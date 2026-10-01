import type { Student360Tab, TabSpec } from '../data/student360.data';
import {
  attendanceTiles,
  behaviorEntries,
  examResults,
  feeTransactions,
  lifecycleEntries,
} from '../data/student360.data';
import AcademicsPane from './AcademicsPane';
import AttendancePane from './AttendancePane';
import BehaviorPane from './BehaviorPane';
import FeesPane from './FeesPane';
import OverviewPane from './OverviewPane';
import TimelinePane from './TimelinePane';

export interface ProfileTabsProps {
  tabs: TabSpec[];
  active: Student360Tab;
  onChange: (tab: Student360Tab) => void;
}

const ProfileTabs = ({ tabs, active, onChange }: ProfileTabsProps) => (
  <div className="card">
    <div className="card-body pb-1">
      <ul className="nav nav-tabs nav-tabs-bottom mb-3 flex-nowrap overflow-x-auto">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab.id}>
            <button
              type="button"
              className={`nav-link${active === tab.id ? ' active' : ''}`}
              aria-current={active === tab.id ? 'page' : undefined}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {active === 's360-overview' ? <OverviewPane /> : null}
        {active === 's360-academics' ? <AcademicsPane results={examResults} /> : null}
        {active === 's360-attendance' ? <AttendancePane tiles={attendanceTiles} /> : null}
        {active === 's360-fees' ? <FeesPane transactions={feeTransactions} /> : null}
        {active === 's360-behavior' ? <BehaviorPane entries={behaviorEntries} /> : null}
        {active === 's360-timeline' ? <TimelinePane entries={lifecycleEntries} /> : null}
      </div>
    </div>
  </div>
);

export default ProfileTabs;
