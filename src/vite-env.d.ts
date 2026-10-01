/// <reference types="vite/client" />

/**
 * Type definitions for the application's build-time environment variables.
 *
 * Only add PUBLIC configuration here — every VITE_* value is inlined into the
 * client bundle and is visible to anyone using the app.
 *
 * Read these through `src/config/env.ts`, never directly.
 */
interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_AUTH_ENABLED?: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_MOCK_LATENCY?: string;
  readonly VITE_MOCK_ERROR_RATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
