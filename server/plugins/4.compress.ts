// IMPORTS

// Node compression libraries
import zlib from 'node:zlib';

// Node promise utlitity
import { promisify } from 'node:util';

// H3 helper functions
import { getRequestHeader, setHeader, send } from 'h3';

// Wrap gzip compression function in promise
const gzip = promisify(zlib.gzip);

// Nitro plugin to compress response body
export default defineNitroPlugin((nitro) => {
  /**
   * Hook into the render:response event to compress the response body
   *
   * This hook is excecuted after the response body is generated and
   * before it is sent to the client/browser
   */
  nitro.hooks.hook('render:response', async (response, { event }) => {
    /**
     * Skip compressing the response body in the following cases:
     * - The app is NOT running in the 'thor' environment (Compression is provided by
     *  Cloudflare on other environments)
     * - The response body is NOT a string
     * - The response body is an error page
     */
    if (
      typeof response.body !== 'string' ||
      event._headers?.get('x-nuxt-error')
    ) {
      return;
    }

    // Get the client/browser supported encodings
    const clientSupportedEncodings = getRequestHeader(event, 'accept-encoding');

    /**
     * Compress the response body with supported encoding if available
     * - Tried brotli compression algo, but it increased the TimeToFirstByte(TTFB)
     *  and the smaller response from brotli was not significant enough to overcome
     *  the above increased time.
     *
     * If not available, the response body is sent as it is
     */
    if (clientSupportedEncodings?.includes('gzip')) {
      // Compress the response body with gzip
      const compressedBody = await gzip(Buffer.from(response.body, 'utf-8'));

      // Set the response header to indicate the response body is compressed with gzip
      setHeader(event, 'Content-Encoding', 'gzip');

      // Send the compressed response body
      send(event, compressedBody);
    }
  });
});
