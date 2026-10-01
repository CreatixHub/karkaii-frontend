/**
 * Typed, validated access to build-time environment configuration.
 *
 * This is the ONLY module in the application that reads `import.meta.env`.
 * Everything else imports `env` from here, so there is exactly one place to
 * look when wiring up a new environment.
 *
 * The template ships WITHOUT any `.env` file: every value below has a safe
 * default (mock data on, authentication off), so the project runs correctly
 * out of the box. To connect a real backend, create a `.env` file and set the
 * variables you need — nothing else has to change.
 *
 *   VITE_APP_ENV=production
 *   VITE_API_BASE_URL=https://api.example.com/v1
 *   VITE_USE_MOCK_API=false
 *   VITE_AUTH_ENABLED=true
 *
 * SECURITY: every VITE_* value is inlined into the client bundle and is
 * therefore public. Never put secrets or private keys in one.
 */

export type AppEnvironment = 'development' | 'staging' | 'production';

export interface AppConfig {
  /** Free-form environment label. */
  appEnv: AppEnvironment;
  /** Base URL of the REST API. Empty while running on mocks. */
  apiBaseUrl: string;
  /** Resolve data from static mocks instead of HTTP. */
  useMockApi: boolean;
  /** Enforce authentication on protected routes. */
  authEnabled: boolean;
  /** Abort an in-flight request after this many milliseconds. */
  apiTimeoutMs: number;
  /** Artificial latency for mock services, in milliseconds. */
  mockLatencyMs: number;
  /** Probability (0..1) that a mock request fails, for testing error states. */
  mockErrorRate: number;
  /** Convenience flags derived from `appEnv`. */
  isDevelopment: boolean;
  isProduction: boolean;
}

/** Parses "true"/"false" strings, falling back when the value is absent. */
function toBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value.toLowerCase() === 'true';
}

/** Parses a numeric string, falling back when absent or not a finite number. */
function toNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toAppEnvironment(value: string | undefined): AppEnvironment {
  if (value === 'production' || value === 'staging' || value === 'development') {
    return value;
  }
  return import.meta.env.PROD ? 'production' : 'development';
}

/** Strips a trailing slash so URL joining never produces a double slash. */
function normalizeBaseUrl(value: string | undefined): string {
  if (!value) return '';
  return value.replace(/\/+$/, '');
}

const raw = import.meta.env;

const appEnv = toAppEnvironment(raw.VITE_APP_ENV);
const apiBaseUrl = normalizeBaseUrl(raw.VITE_API_BASE_URL);
const useMockApi = toBoolean(raw.VITE_USE_MOCK_API, true);

export const env: AppConfig = {
  appEnv,
  apiBaseUrl,
  useMockApi,
  authEnabled: toBoolean(raw.VITE_AUTH_ENABLED, false),
  apiTimeoutMs: toNumber(raw.VITE_API_TIMEOUT, 15000),
  mockLatencyMs: toNumber(raw.VITE_MOCK_LATENCY, 300),
  mockErrorRate: toNumber(raw.VITE_MOCK_ERROR_RATE, 0),
  isDevelopment: appEnv === 'development',
  isProduction: appEnv === 'production',
};

/**
 * Warn loudly (in development only) about configurations that cannot work,
 * rather than failing later with a confusing network error.
 */
if (!useMockApi && !apiBaseUrl && !import.meta.env.PROD) {
  console.warn(
    '[config] VITE_USE_MOCK_API is false but VITE_API_BASE_URL is empty. ' +
      'API requests will be sent to the current origin.',
  );
}
