/**
 * The single switch between mock and real implementations.
 *
 * Each domain declares an interface, provides two implementations of it, and
 * exports `createService(mock, http)`. Because both sides satisfy the same
 * interface, connecting a real backend is a configuration change
 * (`VITE_USE_MOCK_API=false`) rather than a code change — and no page, hook or
 * component can tell the difference.
 */

import { env } from '@config/env';

export function createService<TService>(
  mockImplementation: TService,
  httpImplementation: TService,
): TService {
  return env.useMockApi ? mockImplementation : httpImplementation;
}
