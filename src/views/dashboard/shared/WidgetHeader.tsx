import type { ReactNode } from 'react';

export interface WidgetHeaderProps {
  icon: string;
  title: string;
  /** Heading level; the template mixes h4/h5/h6 across panels. */
  as?: 'h4' | 'h5' | 'h6';
  titleClassName?: string;
  children?: ReactNode;
}

const WidgetHeader = ({
  icon,
  title,
  as: Heading = 'h6',
  titleClassName = '',
  children,
}: WidgetHeaderProps) => (
  <div className="widget-header d-flex align-items-center justify-content-between flex-wrap">
    <Heading className={`widget-title d-flex align-items-center m-0 ${titleClassName}`}>
      <i className={icon} />
      {title}
    </Heading>
    {children}
  </div>
);

export default WidgetHeader;
