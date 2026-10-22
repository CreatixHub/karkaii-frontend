import { Link } from 'react-router-dom';
import type { ReportTab } from '../data/teacherReport.data';

export interface ReportTabsProps {
  tabs: ReportTab[];
  /** Route of the page currently rendered. */
  current: string;
}

const ReportTabs = ({ tabs, current }: ReportTabsProps) => (
  <div className="filter-wrapper">
    {/* List Tab */}
    <div className="list-tab">
      <ul>
        {tabs.map((tab) => (
          <li key={tab.route}>
            <Link
              to={tab.route}
              className={tab.route === current ? 'active' : undefined}
              aria-current={tab.route === current ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
    {/* /List Tab */}
  </div>
);

export default ReportTabs;
