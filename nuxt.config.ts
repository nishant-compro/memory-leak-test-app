// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  pinia: {
    storesDirs: ['./stores/**']
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-security',
  ],
  runtimeConfig: {
    appName: 'your-app-name',
    appBaseUrl: 'https://localhost:3000',
    otel: {
      observability: {
        newrelic: {
          traceExporterEndpoint: 'https://otlp.nr-data.net:4318/v1/traces', // Otel exporter endpoint
          licenseKey: 'YOUR_LICENSE_KEY'
        }
      },
      server: {
        enable: true,
        thresholds: {
          concurrencyLimit: 30,
          maxExportBatchSize: 512,
          scheduledDelayMillis: 5000,
          exportTimeoutMillis: 30000,
          maxQueueSize: 2048
        },
        httpTracing: {
          whitelistedUrls: [] // Array of the whitelisted API URLs for which HTTPInstumentation data will be sent to the observability platform (NewRelic)
        }
      }
    },
    public: {
      appName: 'your-app-name',
      appBaseUrl: 'https://localhost:3000',
    }
  },
})
