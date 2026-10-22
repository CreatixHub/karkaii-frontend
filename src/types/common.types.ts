/**
 * Types shared across features that are not tied to the HTTP transport.
 */

import type { ApiError } from '@services/api/errors';

/** The four states any asynchronous read can be in. */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * The canonical async-read shape consumed by UI components.
 * A component that accepts this needs to know nothing about mocks or HTTP.
 */
export interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  status: RequestStatus;
}

/** `RequestState` plus the ability to run the read again. */
export interface QueryResult<T> extends RequestState<T> {
  refetch: () => void;
  /** True while a refetch runs but previous data is still on screen. */
  isRefetching: boolean;
}

/** A `{ label, value }` pair, the shape every select component here expects. */
export interface SelectOption<TValue = string> {
  label: string;
  value: TValue;
}

/** Identifier type used by all domain entities. */
export type EntityId = string;

/** An entity that carries audit timestamps (ISO 8601 strings). */
export interface Timestamped {
  createdAt: string;
  updatedAt: string;
}
