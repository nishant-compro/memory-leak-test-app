import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import type {
  HttpRequestCustomAttributeFunction,
  IgnoreIncomingRequestFunction
} from '@opentelemetry/instrumentation-http';
import type { Span } from '@opentelemetry/api';
import type { ClientRequest, IncomingMessage } from 'http';

/*
    Traces are only visible once the application is deployed, they won't appear in the console during local development. 
    This discrepancy arises because we're using the 'import' statement rather than 'require' to import the Axios module 
    (which is necessary to patch the http and https module). 
    
    Since ESM instrumentation is not yet available for Node 20, and we are using Node version 20, we need a CJS module 
    to instrument HTTP and HTTPS requests (in case of local development).

    However, during the build process, when using 'require', it relies 'import.meta.url', which is dynamically generated. 
    This dynamic nature causes errors when 'require' is used in the build state, resulting in no traces being generated with 'require'.
*/

// Interface for OpenTelemetry exporter configuration
interface ExporterConfig {
  url: string;
  headers?: { [key: string]: string };
  concurrencyLimit?: number;
}

// Interface for OpenTelemetry exporter thresholds config
interface OtelExporterThresholdConfig {
  concurrencyLimit: number;
  maxExportBatchSize: number;
  scheduledDelayMillis: number;
  exportTimeoutMillis: number;
  maxQueueSize: number;
}

export default defineNitroPlugin(() => {
  // Retrieve the 'isOpentelemetryTracingEnabled' configuration
  // This value determines whether OpenTelemetry tracing is enabled in the application
  const { isOpentelemetryTracingEnabled } = getOpentelemetryConfig();

  // Initialize the tracing in the application only if server tracing is enabled
  if (isOpentelemetryTracingEnabled) {
    // Get the New Relic license key, app name and otel exporter thresholds from config
    const {
      traceExporterEndpoint,
      newRelicLicenseKey,
      appName,
      otelExporterThresholds
    } = getOpentelemetryConfig();

    // Configure the OTLP exporter for sending traces to New Relic
    const exporterConfig: ExporterConfig = {
      url: traceExporterEndpoint,
      headers: {
        'api-key': newRelicLicenseKey // NR license key for authentication
      },
      concurrencyLimit: otelExporterThresholds.concurrencyLimit // the number of trace batches that can be sent concurrently to the New Relic
    };

    // Initialize OTEL trace exporter
    const exporter = new OTLPTraceExporter(exporterConfig);

    // Create a NodeTracerProvider instance
    const provider = new NodeTracerProvider({
      resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: `${appName}-server`
      })
    });

    // Add span processors to the provider:
    // 1. BatchSpanProcessor with OTLP exporter (send to New Relic)
    provider.addSpanProcessor(
      new BatchSpanProcessor(exporter, {
        maxExportBatchSize: otelExporterThresholds.maxExportBatchSize, // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
        scheduledDelayMillis: otelExporterThresholds.scheduledDelayMillis, // The delay interval in milliseconds between two consecutive exports.
        exportTimeoutMillis: otelExporterThresholds.exportTimeoutMillis, // How long the export can run before it is cancelled.
        maxQueueSize: otelExporterThresholds.maxQueueSize // The maximum queue size. After the size is reached spans are dropped.
      })
    );

    // Register the provider with OpenTelemetry
    provider.register();

    // Register default HTTP instrumentation (automatically track whitelisted HTTP requests)
    registerDefaultInstruments();

    /*
        It's important to register any instrumentation modules before 
        you require the target module for instrumentation. 
        Since we want to instrument HTTP and HTTPS requests, 
        we are importing the Axios module after registering the instrumentation.
    */
    import('axios');

    console.log(`Tracing initialized for ${appName} app!✅✅`);
  }
});

// Function to register default HTTP instrumentations
function registerDefaultInstruments() {
  // Register HTTP instrumentation with custom request hook and ignore function
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation({
        ignoreIncomingRequestHook: shouldIgnoreIncomingRequest, // to decide which requests to ignore for tracing
        requestHook: updateHttpRequestAttributes // to add/update custom attributes to spans for HTTP requests
      })
    ]
  });
}

// Function to determine if an incoming request should be ignored for tracing
const shouldIgnoreIncomingRequest: IgnoreIncomingRequestFunction = (
  request: IncomingMessage
): boolean => {
  // Get the request URL from the IncomingMessage object
  const requestPath = (request as IncomingMessage).url?.split('?')[0] || '';

  // Retrieve the HTTP tracing whitelisted URLs for this application
  const { appBaseUrl, httpTracingWhitelistedPaths } = getOpentelemetryConfig();

  // Check if the request URL is whitelisted, if not then ignore incoming requests traces
  for (const whitelistedPath of httpTracingWhitelistedPaths) {
    // Combine the base path with whitelisted API path
    const combinedWhitelistedPath = combineBaseUrlWithWhitelistedPath(
      appBaseUrl,
      whitelistedPath
    );

    // Check if the request URL matches the URL pattern
    const isUrlWhitelisted = isRequestUrlWhitelisted(
      combinedWhitelistedPath,
      requestPath
    );

    // trace the incoming request
    if (isUrlWhitelisted) return false;
  }
  // ignore the incoming request
  return true;
};

// Function to add/update custom attributes to spans for HTTP requests
const updateHttpRequestAttributes: HttpRequestCustomAttributeFunction = (
  span: Span,
  request: ClientRequest | IncomingMessage
) => {
  // Get the request method (GET, POST) from the IncomingMessage object
  const requestMethod = (request as IncomingMessage).method || 'UNKNOWN-METHOD';

  let spanName: string, requestPath: string;

  // Update span details as per the request type-
  // CASE 1: If `request` is an `IncomingMessage` (an incoming HTTP request to our application):
  //      - Access the `url` property from the request.
  //      - Use the whitelisted path pattern for span name (might include parameters).
  const incomingMessageRequestPath =
    (request as IncomingMessage).url?.split('?')[0] || '';
  if (incomingMessageRequestPath) {
    // Retrieve the application name and HTTP tracing whitelisted URLs
    const { appName, appBaseUrl, httpTracingWhitelistedPaths } =
      getOpentelemetryConfig();

    let requestPathPattern: string | undefined;
    for (const whitelistedPath of httpTracingWhitelistedPaths) {
      // Combine the base path with whitelisted API path
      const combinedWhitelistedPath = combineBaseUrlWithWhitelistedPath(
        appBaseUrl,
        whitelistedPath
      );

      // Check if the request URL matches the URL pattern
      const isUrlWhitelisted = isRequestUrlWhitelisted(
        combinedWhitelistedPath,
        incomingMessageRequestPath
      );

      if (isUrlWhitelisted) {
        requestPathPattern = whitelistedPath;
        break;
      }
    }
    // Update the variables as per the request type
    spanName = `${requestMethod} /${appName}${requestPathPattern}`;
    requestPath = incomingMessageRequestPath;
  }
  // CASE 2: If `request` is a `ClientRequest` (an outgoing HTTP request made by our application):
  //      - Access the `url` from client request (combination of host and path).
  //      - Use the original request path as there's no whitelisted pattern matching.
  else {
    const clientRequestHost = `${(request as ClientRequest).host}`;
    const clientRequestPath = (request as ClientRequest).path || '';

    // Update the variables as per the request type
    spanName = `${requestMethod} ${clientRequestHost}${clientRequestPath}`;
    requestPath = clientRequestPath;
  }

  // Update the span name and span attributes
  span.updateName(`${spanName}`);
  span.setAttribute('http.method', requestMethod);
  span.setAttribute('http.url', requestPath);
};

// Function to concatenate the base URL with the API path
function combineBaseUrlWithWhitelistedPath(
  basePath: string,
  whitelistedPath: string
): string {
  // Remove trailing slash from basePath (if any)
  basePath = basePath.replace(/\/$/, '');

  // Concatenate the base URL and the whitelisted path
  const combinedPath = `${basePath}${whitelistedPath}`;

  return combinedPath;
}

// Function to check if a incoming request URL is whitelisted or not
function isRequestUrlWhitelisted(
  whitelistedPath: string,
  requestPath: string
): boolean {
  const reqPathSegments = requestPath?.split('/'); // Split the request path into segments
  const whitelistedPathSegments = whitelistedPath?.split('/'); // Split the whitelisted path into segments

  // If the number of segments doesn't match, return false (mismatched structure)
  if (reqPathSegments?.length !== whitelistedPathSegments?.length) {
    return false;
  }

  // Check each segment of the request URL and whitelisted URL
  for (let index = 0; index < reqPathSegments.length; index++) {
    // If the pattern segment is a dynamic parameter, continue
    if (whitelistedPathSegments[index].startsWith(':')) {
      continue;
    }
    // If segments don't match, return false
    if (reqPathSegments[index] !== whitelistedPathSegments[index]) {
      return false;
    }
  }
  // All segments match, return true
  return true;
}

// Function to get OpenTelemetry configuration from runtime config
function getOpentelemetryConfig() {
  const { appName, appBaseUrl } = useRuntimeConfig().public;

  const opentelemetryConfig: any = useRuntimeConfig().otel;

  const isOpentelemetryTracingEnabled: boolean =
    opentelemetryConfig.server.enable;

  const traceExporterEndpoint: string =
    opentelemetryConfig.observability.newrelic.traceExporterEndpoint;

  const newRelicLicenseKey: string =
    opentelemetryConfig.observability.newrelic.licenseKey;

  const otelExporterThresholds: OtelExporterThresholdConfig =
    opentelemetryConfig.server.thresholds;

  const httpTracingWhitelistedPaths: string[] =
    opentelemetryConfig.server.httpTracing.whitelistedUrls;

  return {
    appName,
    appBaseUrl,
    isOpentelemetryTracingEnabled,
    traceExporterEndpoint,
    newRelicLicenseKey,
    otelExporterThresholds,
    httpTracingWhitelistedPaths
  };
}
