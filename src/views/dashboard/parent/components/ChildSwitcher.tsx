import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ChildKey } from '../data/parentDashboard.data';
import { childSwitcherOptions } from '../data/parentDashboard.data';

export interface ChildSwitcherProps {
  active: ChildKey;
  onChange: (child: ChildKey) => void;
}

const ChildSwitcher = ({ active, onChange }: ChildSwitcherProps) => (
  <div className="parent-portal child-switcher mb-2">
    <span className="child-switcher-label">
      <i className="ti ti-users" />
      Viewing
    </span>
    <div className="child-switcher-option" role="group" aria-label="Select student">
      {childSwitcherOptions.map((option) => (
        <button
          key={option.key}
          type="button"
          className={`switch-control switch-control-sm${active === option.key ? ' active' : ''}`}
          aria-pressed={active === option.key}
          onClick={() => onChange(option.key)}
        >
          <ImageWithBasePath src={option.img} alt={option.name} />
          <span>
            <span className="switch-control-name">{option.name}</span>
            <span className="switch-control-class">{option.className}</span>
          </span>
          <i className="ti ti-circle-check switch-control-check" />
        </button>
      ))}
    </div>
  </div>
);

export default ChildSwitcher;
