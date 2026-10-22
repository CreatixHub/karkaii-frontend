import { useState } from 'react';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import {
  assignmentTabs,
  compactAssignmentRowIds,
} from '../data/studentDashboard.data';

export interface AssignmentsCardProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const AssignmentsCard = ({ onOpenModal }: AssignmentsCardProps) => {
  const [activeTab, setActiveTab] = useState(assignmentTabs[0].id);
  const active = assignmentTabs.find((tab) => tab.id === activeTab) ?? assignmentTabs[0];

  return (
    <div className="card-widget card-widget-body h-100">
      <WidgetHeader icon="ti ti-file-description" title="Assignments &amp; Homework">
        <button
          type="button"
          className="action-button action-button-sm action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
          onClick={() => onOpenModal('assign')}
        >
          <i className="ti ti-upload" />
          Upload Assignment
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
          {active.rows.map((row) => {
            const isCompact = compactAssignmentRowIds.includes(row.id);
            // The policy/reminder rows carry no action, only copy.
            const showAction = !isCompact && (active.upload || active.feedback);

            return (
              <InfoListRow
                row={row}
                key={row.id}
                small={isCompact}
                endSlot={
                  showAction ? (
                    <>
                      {row.endBadge ? (
                        <span className={`badge ${row.endBadge.className}`}>
                          {row.endBadge.label}
                        </span>
                      ) : null}
                      <button
                        type="button"
                        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
                        onClick={() => onOpenModal(active.feedback ? 'feedback' : 'assign')}
                      >
                        {active.feedback ? 'Feedback' : 'Upload'}
                      </button>
                    </>
                  ) : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsCard;
