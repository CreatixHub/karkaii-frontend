
import { createRoot } from 'react-dom/client'
import { base_path } from "./environment";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../src/style/css/feather.css";
import "../src/index.scss";
import AppProviders from "./app/providers/AppProviders";
import "../src/style/icon/boxicons/boxicons/css/boxicons.min.css";
import "../src/style/icon/weather/weathericons.css";
import "../src/style/icon/typicons/typicons.css";
import "../src/style/icon/fontawesome/css/fontawesome.min.css";
import "../src/style/icon/fontawesome/css/all.min.css";
import "../src/style/icon/ionic/ionicons.css";
import "../src/style/icon/tabler-icons/webfont/tabler-icons.css";
import ALLRoutes from "./routes";
// Named ESM exports, not the UMD bundle: a bundler does not run the UMD's
// global side effect, so `window.bootstrap` would be undefined.
import "bootstrap";
import { BrowserRouter } from 'react-router';
import React from 'react';



createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* AppProviders composes the Redux store and the auth session provider. */}
    <AppProviders>
      {/* basename has no trailing slash: "/app/" -> "/app", "/" -> "/" */}
      <BrowserRouter basename={base_path.replace(/\/+$/, "") || "/"}>
        <ALLRoutes />
      </BrowserRouter>
    </AppProviders>
  </React.StrictMode>
)
