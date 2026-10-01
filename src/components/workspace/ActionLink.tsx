import type { KeyboardEvent, ReactNode } from 'react';

export interface ActionLinkProps {
  className?: string;
  onClick: () => void;
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
  /** For the anchors that open a menu, so the state is announced. */
  ariaExpanded?: boolean;
}

const ActionLink = ({
  className,
  onClick,
  children,
  title,
  ariaLabel,
  ariaExpanded,
}: ActionLinkProps) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onClick();
  };

  return (
    <a
      className={className}
      role="button"
      tabIndex={0}
      title={title}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </a>
  );
};

export default ActionLink;
