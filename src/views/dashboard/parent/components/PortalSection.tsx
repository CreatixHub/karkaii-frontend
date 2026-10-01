import type { ReactNode } from 'react';

export interface PortalSectionProps {
  icon: string;
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

const PortalSection = ({ icon, eyebrow, title, children }: PortalSectionProps) => (
  <div className="portal-section d-flex align-items-end justify-content-between flex-wrap">
    <div>
      <div className="portal-eyebrow d-flex align-items-center">
        <i className={icon} />
        {eyebrow}
      </div>
      <div className="portal-title">{title}</div>
    </div>
    {children}
  </div>
);

export default PortalSection;
