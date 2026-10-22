/**
 * Where the app is hosted. Both values come from Vite's `base` option (see vite.config.ts), which is set by the
 * `VITE_BASE_PATH` environment variable at build time:
 *
 *   npm run build                               -> served from the site root        ("/")      [default]
 *   VITE_BASE_PATH=/app/ npm run build          -> served under a sub-path          ("/app/")
 *
 * `base_path` is the router's basename; `img_path` prefixes every image used through <ImageWithBasePath>.
 * Always ends with a slash.
 */
export const base_path = import.meta.env.BASE_URL
export const img_path = import.meta.env.BASE_URL
