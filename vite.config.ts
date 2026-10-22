import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Path aliases for the API-ready layer. Existing relative imports keep working
// unchanged; new code should prefer these.
//
// Replacements are root-relative ("/src/...") rather than absolute filesystem
// paths, so this config needs no Node APIs and therefore no @types/node.
// Keep in sync with `compilerOptions.paths` in tsconfig.app.json.
const alias = [
  { find: /^@app\//, replacement: '/src/app/' },
  { find: /^@components\//, replacement: '/src/components/' },
  { find: /^@config$/, replacement: '/src/config/index.ts' },
  { find: /^@config\//, replacement: '/src/config/' },
  { find: /^@constants$/, replacement: '/src/constants/index.ts' },
  { find: /^@constants\//, replacement: '/src/constants/' },
  { find: /^@features\//, replacement: '/src/features/' },
  { find: /^@hooks$/, replacement: '/src/hooks/index.ts' },
  { find: /^@hooks\//, replacement: '/src/hooks/' },
  { find: /^@mocks\//, replacement: '/src/mocks/' },
  { find: /^@services$/, replacement: '/src/services/index.ts' },
  { find: /^@services\//, replacement: '/src/services/' },
  { find: /^@utils$/, replacement: '/src/utils/index.ts' },
  { find: /^@utils\//, replacement: '/src/utils/' },
  { find: /^@routes$/, replacement: '/src/routes/index.tsx' },
  { find: /^@routes\//, replacement: '/src/routes/' },
  { find: /^@views\//, replacement: '/src/views/' },
  { find: /^@layouts\//, replacement: '/src/layouts/' },
  { find: /^@core\//, replacement: '/src/core/' },
  // Must stay last: the broadest pattern.
  { find: /^@\//, replacement: '/src/' },
]

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // `loadEnv` needs no Node typings. API_PROXY_TARGET is dev-only and never reaches the browser bundle.
  const fileEnv = loadEnv(mode, '.', '')
  const apiTarget = fileEnv.API_PROXY_TARGET || 'http://localhost:5000'

  return {
  // Set VITE_BASE_PATH=/app/ to host the app under a sub-path (e.g. landing page at "/", app at "/app/"). Default: site root.
  base: fileEnv.VITE_BASE_PATH || '/',
  plugins: [react()],
  resolve: { alias },
  // `npm run dev` lands on the login screen rather than the bare root, which
  // only redirects there anyway. Pass `--no-open` to suppress it.
  //
  // `/api` and `/uploads` are proxied to the Express server, so in development the browser talks to ONE origin:
  // the httpOnly refresh cookie just works (no CORS, no third-party-cookie rules) and it mirrors production,
  // where nginx serves the frontend and forwards /api the same way.
  server: {
    open: '/login',
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
      '/uploads': { target: apiTarget, changeOrigin: true },
    },
  },
  // dragula's transitive deps (crossvent, custom-event) are browserify-era and
  // read the free `global` variable, which the browser has no equivalent for.
  // `define` covers the production build, `optimizeDeps` the dev pre-bundle.
  define: { global: 'globalThis' },
  optimizeDeps: { esbuildOptions: { define: { global: 'globalThis' } } },
  }
})
