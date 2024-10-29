import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import {
  WebTracerProvider,
  SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { trace, SpanStatusCode, context } from '@opentelemetry/api';
import type { Tracer, Span } from '@opentelemetry/api';

// Interface for OpenTelemetry exporter configuration
interface ExporterConfig {
  url: string;
  headers?: { [key: string]: string };
  concurrencyLimit?: number;
}

export default defineNuxtPlugin(() => {
  const csrfToken = useCookie('csrf-token').value;
  // Configure exporter to send traces to custom API via POST request
  const exporterConfig: ExporterConfig = {
    url: `traces`,
    ...(csrfToken && {
      headers: {
        'csrf-token': csrfToken
      }
    })
  };

  // Initialize OTEL trace exporter
  const exporter = new OTLPTraceExporter(exporterConfig);

  // Get the app name from config
  const { appName } = getOpentelemetryConfig();

  // Create a WebTracerProvider instance
  const provider = new WebTracerProvider({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: `${appName}-client`
    })
  });

  // Add span processors to the provider:
  // 1. SimpleSpanProcessor with OTLP exporter (send to New Relic)
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  // Register the provider with OpenTelemetry
  provider.register();

  // Initialise and get the tracer for the services
  const tracer: Tracer = trace.getTracer(`${appName}-client-tracing`);

  console.log(`Browser Tracer initialzed for ${appName} client app..✅✅`);

  return {
    provide: {
      tracer: tracer, // otel service tracer
      spanStatusCode: SpanStatusCode, // span status code
      trace: trace, // Otel trace instance
      context: context, // Otel trace context
      getTraceParentHeaderValue: (span: Span) => getTraceParentHeaderValue(span) // header for distributed tracing
    }
  };
});

// Function to create traceparent header value
function getTraceParentHeaderValue(spanData: Span) {
  // Get the trace data from span context
  const version = '00';
  const traceId = spanData.spanContext().traceId;
  const parentSpanId = spanData.spanContext().spanId;
  const traceFlags = spanData.spanContext().traceFlags == 1 ? '01' : '00';

  const traceparent = `${version}-${traceId}-${parentSpanId}-${traceFlags}`;
  return traceparent;
}

// Function to get OpenTelemetry configuration from runtime config
function getOpentelemetryConfig() {
  const { appName } = useRuntimeConfig().public;

  return {
    appName
  };
}
