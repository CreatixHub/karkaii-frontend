import type { ReactNode } from 'react';

export interface FormSectionProps {
  id?: string;
  icon: string;
  title: string;
  children: ReactNode;
  bodyClass?: string;
}

const FormSection = ({ id, icon, title, children, bodyClass = 'card-body pb-1' }: FormSectionProps) => (
  <div className="card" id={id}>
    <div className="card-header bg-light">
      <div className="d-flex align-items-center">
        <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
          <i className={`${icon} fs-16`} />
        </span>
        <h4 className="text-dark">{title}</h4>
      </div>
    </div>
    <div className={bodyClass}>{children}</div>
  </div>
);

export default FormSection;
