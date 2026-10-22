/**
 * Single composition point for every application-wide provider.
 *
 * Adding a provider later (a toast host, a query cache, an i18n provider)
 * means editing this file only — `main.tsx` stays untouched.
 */

import type { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PrimeReactProvider } from 'primereact/api';
import store from '../../core/data/redux/store';
import AuthProvider from './AuthProvider';

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * PrimeReact's global configuration. `ripple` is off because the template has
 * no ripple anywhere else, and the overlay z-index is pinned just above
 * Bootstrap's modal (1055) and offcanvas (1045) so dropdown and calendar
 * panels open on top of them instead of behind.
 */
const primeReactConfig = {
  ripple: false,
  zIndex: {
    modal: 1100,
    overlay: 1100,
    menu: 1100,
    tooltip: 1100,
  },
};

const AppProviders = ({ children }: AppProvidersProps) => (
  // Redux keeps theme/sidebar UI state; AuthProvider owns the session.
  <ReduxProvider store={store}>
    <PrimeReactProvider value={primeReactConfig}>
      <AuthProvider>{children}</AuthProvider>
    </PrimeReactProvider>
  </ReduxProvider>
);

export default AppProviders;
