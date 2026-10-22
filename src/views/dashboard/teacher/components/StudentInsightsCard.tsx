import type { TeacherModalId } from '../data/teacherDashboard.data';
import {
  behaviorAlerts,
  lowAttendance,
  studentsAtRisk,
  topPerformers,
} from '../data/teacherDashboard.data';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';

export interface StudentInsightsCardProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const StudentInsightsCard = ({ onOpenModal }: StudentInsightsCardProps) => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-users" title="Student Insights">
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('performance')}
      >
        <i className="ti ti-eye" />
        View All
      </button>
    </WidgetHeader>

    <div className="row g-3">
      <div className="col-md-6">
        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-star me-1 text-warning" />
          Top Performers
        </h6>
        <div className="info-list d-flex flex-column">
          {topPerformers.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>

        <h6 className="widget-subtitle mb-2 mt-3">
          <i className="ti ti-alert-hexagon me-1 text-danger" />
          Students at Risk
        </h6>
        <div className="info-list d-flex flex-column">
          {studentsAtRisk.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>
      </div>

      <div className="col-md-6">
        <h6 className="widget-subtitle mb-2">
          <i className="ti ti-calendar-x me-1 text-danger" />
          Low Attendance
        </h6>
        <div className="info-list d-flex flex-column">
          {lowAttendance.map((row) => (
            <InfoListRow row={row} key={row.id} />
          ))}
        </div>

        <h6 className="widget-subtitle mb-2 mt-3">
          <i className="ti ti-mood-smile me-1 text-info" />
          Behavior Alerts &amp; Achievements
        </h6>
        <div className="info-list d-flex flex-column">
          {behaviorAlerts.map((row) => (
            <InfoListRow
              row={row}
              key={row.id}
              endSlot={
                row.id === 'ba2' ? (
                  <button
                    type="button"
                    className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
                  >
                    <i className="ti ti-gift" />
                    Wish
                  </button>
                ) : undefined
              }
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default StudentInsightsCard;
