import type { H3Event } from 'h3';
import { readBody } from 'h3';
import { errorConstants } from '../constants/error-constants';
import axios from 'axios';
import type { Span } from '@opentelemetry/api';

/*
    This API has been specifically designed for client observability integration, 
    enabling the transmission of traces to the observability platform, New Relic.
*/

export default defineEventHandler(async (event: H3Event) => {
  try {
    const tracePayload = await readBody(event);

    // send trace data to observability platform (New Relic)
    await sendTracesToObservabilityPlatform(tracePayload);

    return 'success';
  } catch (error) {
    console.error('Error sending trace:', error, errorConstants.APP.ERROR_TYPES.OPENTELEMETRY.OBSERVABILITY);
    return 'failure';
  }
});

/*
 * This function sends trace data to the New Relic trace exporter.
 * @param tracePayload - The trace data to be sent to New Relic.
 * @returns A promise that resolves to the response from the exporter or throws an error.
 */
async function sendTracesToObservabilityPlatform(
  tracePayload: Span
): Promise<any> {
  try {
    // Access configuration values for the New Relic trace exporter endpoint
    // and license key from the runtime configuration
    const { traceExporterEndpoint, licenseKey } =
      useRuntimeConfig()._app.otel.observability.newrelic;

    // Send a POST request to new relic
    return await axios.post(traceExporterEndpoint, tracePayload, {
      headers: {
        'api-key': licenseKey,
        'content-type': 'application/json'
      }
    });
  } catch (error) {
    throw new Error(`Unable to process post trace data request - ${error}`);
  }
}
