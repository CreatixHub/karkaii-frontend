import { useId } from 'react';
import type { ReactNode } from 'react';
import { Tooltip as PrimeTooltip } from 'primereact/tooltip';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** The tooltip text. */
  content: string;
  position?: TooltipPosition;
  /**
   * The element the tooltip describes. It is wrapped in a display-contents
   * span carrying the target class, so the wrapper adds no layout of its own.
   */
  children: ReactNode;
  /** Extra classes for the wrapping span. */
  className?: string;
}

/**
 * PrimeReact's `Tooltip` attaches to a target by CSS selector rather than by
 * wrapping it, so this component owns a generated class to bind the two
 * together. That keeps the call site looking like the `OverlayTrigger` it
 * replaces.
 */
const Tooltip = ({ content, position = 'top', children, className }: TooltipProps) => {
  // `useId` produces colons, which are not valid in a CSS class selector.
  const target = `tooltip-target-${useId().replace(/[^a-zA-Z0-9-_]/g, '')}`;

  return (
    <>
      <PrimeTooltip target={`.${target}`} position={position} content={content} />
      <span className={`${target}${className ? ` ${className}` : ''}`} style={{ display: 'contents' }}>
        {children}
      </span>
    </>
  );
};

export default Tooltip;
