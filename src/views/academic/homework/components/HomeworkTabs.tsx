import { Link } from 'react-router-dom';
import type { TabConfig, TabId } from '../data/homework.data';

export interface HomeworkTabsProps {
  tabs: TabConfig[];
  active: TabId;
  onChange: (id: TabId) => void;
}

const HomeworkTabs = ({ tabs, active, onChange }: HomeworkTabsProps) => (
  <div className="card-header border-bottom pb-0">
    <ul className="nav nav-tabs nav-tabs-bottom mb-0" role="tablist">
      {tabs.map((tab) => (
        <li className="nav-item" role="presentation" key={tab.id}>
          <Link
            className={`nav-link d-inline-flex align-items-center${active === tab.id ? ' active' : ''}`}
            to="#"
            role="tab"
            aria-controls={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            onClick={() => onChange(tab.id)}
          >
            <i className={`${tab.icon} me-2`} />
            {tab.label}
            <span className={`badge ${tab.badgeClass} ms-2`}>{tab.rows.length}</span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default HomeworkTabs;
