import type { WizardStepDef } from '../data/addAdmission.data';

export interface WizardNavProps {
  steps: WizardStepDef[];
  current: number;
  onGoTo: (index: number) => void;
}

const WizardNav = ({ steps, current, onGoTo }: WizardNavProps) => (
  <ul className="nav nav-tabs twitter-bs-wizard-nav">
    {steps.map((step, index) => (
      <li className={`nav-item${index < current ? ' done' : ''}`} key={step.id}>
        <a
          href={`#${step.id}`}
          className={`nav-link border-0${index === current ? ' active' : ''}`}
          onClick={(event) => {
            event.preventDefault();
            onGoTo(index);
          }}
        >
          <div className="step-icon" title={step.title}>
            <i className={step.icon} />
          </div>
        </a>
      </li>
    ))}
  </ul>
);

export default WizardNav;
