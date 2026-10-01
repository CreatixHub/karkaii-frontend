import { useState } from 'react';
import type { TeacherModalId } from '../data/teacherDashboard.data';
import { assignmentTabs } from '../data/teacherDashboard.data';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';

export interface AssignmentsCardProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const AssignmentsCard = ({ onOpenModal }: AssignmentsCardProps) => {
  const [activeTab, setActiveTab] = useState(assignmentTabs[0].id);
  const active = assignmentTabs.find((tab) => tab.id === activeTab) ?? assignmentTabs[0];

  return (
    <div className="card-widget card-widget-body h-100">
      <WidgetHeader icon="ti ti-file-description" title="Assignments">
        <button
          type="button"
          className="action-button action-button-sm action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
          onClick={() => onOpenModal('homework')}
        >
          <i className="ti ti-plus" />
          Create Assignment
        </button>
      </WidgetHeader>

      <div className="pill-tabs nav mb-3 d-inline-flex flex-wrap" role="tablist">
        {assignmentTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`assignments-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`assignments-${tab.id}`}
            className={`pill-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count ? <b>{tab.count}</b> : null}
          </button>
        ))}
      </div>

      <div
        className="pill-tabpane active"
        id={`assignments-${active.id}`}
        role="tabpanel"
        aria-labelledby={`assignments-tab-${active.id}`}
      >
        <div className="info-list d-flex flex-column">
          {active.rows.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsCard;
