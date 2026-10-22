
import {  Route, Routes } from "react-router";
import { authRoutes, publicRoutes } from "./route_config";
import Feature from "../layouts/MainLayout";
import AuthFeature from "../layouts/AuthLayout";
import ProtectedRoute from "@components/routing/ProtectedRoute";
import React, { Suspense } from "react";

// Lazy load Login component
const Login = React.lazy(() => import("../views/auth/login/login"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '18px'
  }}>
    Loading...
  </div>
);

const ALLRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Login />} />
        {/*
          ProtectedRoute is a pass-through while VITE_AUTH_ENABLED is false,
          so these routes behave exactly as before. Setting that flag to true
          turns on session enforcement with no further code change.
        */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Feature />}>
            {publicRoutes.map((route, idx) => (
              <Route
                path={route.path}
                element={route.element}
                key={idx}
              />
            ))}
          </Route>
        </Route>

        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route 
              path={route.path} 
              element={route.element} 
              key={idx} 
            />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default ALLRoutes;
