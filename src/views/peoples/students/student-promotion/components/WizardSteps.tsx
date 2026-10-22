import type { WizardStepDef } from '../data/studentPromotion.data';

export interface WizardStepsProps {
  steps: WizardStepDef[];
  current: number;
  maxReached: number;
  onGoTo: (step: number) => void;
}

const WizardSteps = ({ steps, current, maxReached, onGoTo }: WizardStepsProps) => (
  <div className="panel-block wizard mb-3">
    <div className="wizard-steps" id="pwSteps">
      {steps.map((step) => (
        <div
          className={`wizard-step${step.step === current ? ' active' : ''}${
            step.step < maxReached && step.step !== current ? ' done' : ''
          }`}
          data-step={step.step}
          key={step.step}
          role="button"
          tabIndex={0}
          onClick={() => {
            if (step.step <= maxReached) onGoTo(step.step);
          }}
        >
          <span className="wizard-step-dot">{step.step}</span>
          <div className="wizard-step-text">
            <b>{step.title}</b>
            <span>{step.sub}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WizardSteps;
