// Vendor packages that ship no TypeScript declarations.

/**
 * Bootstrap 5's JS has no bundled types. Only the two components this project
 * constructs by hand are declared; everything else Bootstrap does here is
 * driven by its data-api, which needs no types.
 */
declare module 'bootstrap' {
  class BaseComponent {
    constructor(element: Element, config?: Record<string, unknown>);
    dispose(): void;
  }
  export class Tooltip extends BaseComponent {
    static getInstance(element: Element): Tooltip | null;
  }
  export class Popover extends BaseComponent {
    static getInstance(element: Element): Popover | null;
  }
}

declare module 'bootstrap/dist/js/bootstrap.bundle.min.js';

/**
 * dragula ships no TypeScript declarations. Only the slice this project uses
 * is declared: the factory, the `moves` predicate and `destroy()`.
 */
declare module 'dragula' {
  interface DragulaOptions {
    moves?: (
      el?: Element,
      source?: Element,
      handle?: Element,
      sibling?: Element,
    ) => boolean;
  }
  interface Drake {
    destroy(): void;
  }
  export default function dragula(
    containers: Element[],
    options?: DragulaOptions,
  ): Drake;
}
