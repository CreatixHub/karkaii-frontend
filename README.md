# Preskool — School Management Admin Dashboard (React)

Preskool is a school-management admin template: dashboards for admin, teacher,
student and parent roles, plus Academic, HRM, Finance, Attendance, Library,
Transport, Hostel, Communication and Settings modules.

This is the **React + Vite** build. A Next.js (App Router) build of the same
template lives in `../`.

---

## Getting Started

Requires **Node.js 18+**.

```bash
npm install
npm run dev
```

Open <http://localhost:5173/react>. The `/react` prefix is the Vite `base` set
in `vite.config.ts`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check, then bundle to `dist/` |
| `npm run preview` | Serve a previous build |
| `npm run lint` | ESLint |

---

## Project Structure

```
src/
  app/providers/  Redux store + auth context composition
  layouts/        MainLayout (header/sidebar/theme) and AuthLayout
  routes/         all_routes.tsx, route_config.tsx, index.tsx
  views/          every page's UI, grouped by module
  components/     shared UI (ui/, workspace/, routing/)
  core/           template internals: header, sidebar, modals, mock JSON, redux
  services/       API layer — one folder per domain
  mocks/          static fixtures the mock services return
  features/       feature hooks that compose services + form state
  hooks/          reusable hooks (useForm, useQuery, useToasts, …)
  style/          SCSS and icon fonts
  main.tsx        entry point
```

---

## Routing

Routing is react-router, driven by two files:

- **`src/routes/all_routes.tsx`** — every path as a named key. This is the single
  source of truth; always link with `routes.studentList`, never a raw string.
- **`src/routes/route_config.tsx`** — lazy imports plus two arrays,
  `publicRoutes` (rendered inside `MainLayout`) and `authRoutes` (inside
  `AuthLayout`).

To add a page: create the view under `src/views/`, add its path to
`all_routes.tsx`, then add a `React.lazy` import and a `publicRoutes` entry in
`route_config.tsx`.

---

## Path Aliases

Declared in `tsconfig.app.json` and mirrored in `vite.config.ts` — **keep the two
in sync**.

| Alias | Target |
| --- | --- |
| `@/*` | `src/*` |
| `@views/*` | `src/views/*` |
| `@components/*` | `src/components/*` |
| `@core/*` | `src/core/*` |
| `@hooks`, `@hooks/*` | `src/hooks/*` |
| `@services`, `@services/*` | `src/services/*` |
| `@config`, `@config/*` | `src/config/*` |
| `@constants`, `@constants/*` | `src/constants/*` |
| `@utils`, `@utils/*` | `src/utils/*` |
| `@features/*`, `@mocks/*`, `@layouts/*`, `@routes/*`, `@app/*` | as named |

---

## Theming & Layout

Theme state lives in Redux (`src/core/data/redux/themeSettingSlice.tsx`) and is
persisted to `localStorage`. `MainLayout` mirrors it onto `<html>` as
`data-theme`, `data-layout`, `data-sidebar`, `data-sidebarbg`, `data-color` and
`data-topbar`; the SCSS keys off those attributes.

Layout modes — default, mini, boxed and RTL — plus light/dark are switched from
the gear panel (`src/core/common/theme-settings`).

Bootstrap tooltips and popovers are constructed by `useBootstrapTooltips`, which
re-scans on every navigation because SPA routing has no page load.

Images go through `<ImageWithBasePath>` (`src/core/common/imageWithBasePath`),
which prefixes `img_path` from `src/environment.tsx` so assets resolve under the
Vite `base`.

---

## Mock Data / API Layer

The template runs entirely on mocks out of the box — no backend, no `.env`.

Each domain in `src/services/<domain>/` has a `.types.ts`, a `.mock.ts`, a
`.http.ts` and a `.service.ts`. `createService` (`src/services/api/create-service.ts`)
picks the mock or HTTP implementation from `env.useMockApi`, so call sites never
change. All HTTP goes through the single client in `src/services/api/client.ts`.

To point at a real backend, add `.env`:

```
VITE_API_BASE_URL=https://api.example.com/v1
VITE_USE_MOCK_API=false
VITE_AUTH_ENABLED=true
```

`src/config/env.ts` is the only module that reads `import.meta.env`. Every
`VITE_*` value is inlined into the client bundle — never put a secret in one.

With `VITE_AUTH_ENABLED=false` (the default) `ProtectedRoute` and `RoleGuard`
render their children unconditionally, so every route stays reachable. Flip it to
`true` once a real auth API is connected and the same components start enforcing
the session.

---

## Build & Deploy

```bash
npm run build
```

Bundles to `dist/`. Serve it from any static host under the `/react` path, or
change `base` in `vite.config.ts` to match where you deploy. The host must
rewrite unknown paths to `index.html` so client-side routing works on refresh.
