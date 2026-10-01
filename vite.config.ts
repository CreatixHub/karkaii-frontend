import { defineConfig } from 'vite'
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
export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  // `npm run dev` lands on the login screen rather than the bare root, which
  // only redirects there anyway. Pass `--no-open` to suppress it.
  server: { open: '/login' },
  // dragula's transitive deps (crossvent, custom-event) are browserify-era and
  // read the free `global` variable, which the browser has no equivalent for.
  // `define` covers the production build, `optimizeDeps` the dev pre-bundle.
  define: { global: 'globalThis' },
  optimizeDeps: { esbuildOptions: { define: { global: 'globalThis' } } },
})
