/**
 * Legacy import path. The implementation moved to `components/ui/Select`
 * when the form controls were migrated to PrimeReact; this re-export keeps the
 * ~43 existing `@core/common/commonSelect` imports working unchanged.
 */
export { default } from '@components/ui/Select';
export type { Option, SelectProps } from '@components/ui/Select';
