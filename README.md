# Karkaii — School Management Admin Dashboard (React)

Karkaii is a school-management admin template: dashboards for admin, teacher,
student and parent roles, plus Academic, HRM, Finance, Attendance, Library,
Transport, Hostel, Communication and Settings modules.

This is the **React + Vite** build. A Next.js (App Router) build of the same
template lives in `../`.

**Working on a change?** See [`CONTRIBUTING.md`](./CONTRIBUTING.md) first — short-lived branches off
`main`, how to open a PR, and where to watch CI. `main` is protected: a PR needs a passing check and
one approval before it can merge.

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

## Test Accounts (role-based dashboard testing)

One account per role, all in the same test school (`karkaii-test-school`), seeded
against the real backend via the signup + "add member" endpoints — not mock data.
Use these with `VITE_USE_MOCK_API=false` / `VITE_AUTH_ENABLED=true` (see
`.env.development`) to verify each role lands on its own dashboard after login,
and that `DashboardGuard` (`src/components/routing/DashboardGuard.tsx`) redirects
away from another role's dashboard if you type its URL directly.

All passwords: `Test@12345`

| Role | Email | Expected landing page |
| --- | --- | --- |
| owner | `owner@karkaii.test` | `/admin-dashboard` |
| admin | `admin@karkaii.test` | `/admin-dashboard` |
| teacher | `teacher@karkaii.test` | `/teacher-dashboard` |
| student | `student@karkaii.test` | `/student-dashboard` |
| parent | `parent@karkaii.test` | `/parent-dashboard` |
| accountant | `accountant@karkaii.test` | `/admin-dashboard` |
| receptionist | `receptionist@karkaii.test` | `/admin-dashboard` |
| librarian | `librarian@karkaii.test` | `/admin-dashboard` |
| warden | `warden@karkaii.test` | `/admin-dashboard` |
| transport_manager | `transport_manager@karkaii.test` | `/admin-dashboard` |
| nurse | `nurse@karkaii.test` | `/admin-dashboard` |
| security | `security@karkaii.test` | `/admin-dashboard` |

Every non-teacher/student/parent role shares the admin dashboard today (see the
comment in `src/features/auth/roleHome.ts`) — that's expected, not a bug.

These are test-only accounts on a disposable school; don't reuse this password
anywhere real.

---

## Build & Deploy

```bash
npm run build
```

Bundles to `dist/`. Serve it from any static host under the `/react` path, or
change `base` in `vite.config.ts` to match where you deploy. The host must
rewrite unknown paths to `index.html` so client-side routing works on refresh.
