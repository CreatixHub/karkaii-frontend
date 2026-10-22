import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import {
  examCountdown,
  latestResults,
  upcomingExams,
} from '../data/studentDashboard.data';

const routes = all_routes;

export interface ExamCenterCardProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const ExamCenterCard = ({ onOpenModal }: ExamCenterCardProps) => (
  <div className="card-widget card-widget-body h-100 flow-list d-flex flex-column">
    <WidgetHeader icon="ti ti-certificate" title="Exam Center">
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('results')}
      >
        <i className="ti ti-eye" />
        Results
      </button>
    </WidgetHeader>

    <div className="countdown-strip border-primary bg-primary-transparent mb-3 d-flex align-items-center">
      <span className="ic bg-white text-primary">
        <i className="ti ti-hourglass-high" />
      </span>
      <div className="tx">
        <b>{examCountdown.title}</b>
        <span>{examCountdown.detail}</span>
      </div>
      <div className="num text-primary">
        <b>{examCountdown.days}</b>
        <span>days left</span>
      </div>
    </div>

    <h6 className="widget-subtitle mb-2">
      <i className="ti ti-calendar-event me-1" />
      Upcoming Exams
    </h6>
    <div className="info-list mb-3 d-flex flex-column">
      {upcomingExams.map((row) => (
        <InfoListRow row={row} key={row.id} />
      ))}
    </div>

    <h6 className="widget-subtitle mb-2">
      <i className="ti ti-list-check me-1" />
      Latest Results
    </h6>
    <div className="info-list mb-3 d-flex flex-column">
      {latestResults.map((row) => (
        <InfoListRow
          row={row}
          key={row.id}
          endSlot={
            <Link
              to={routes.examResult}
              className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"
              title="Marksheet"
            >
              <i className="ti ti-download" />
            </Link>
          }
        />
      ))}
    </div>

    <Link
      to={routes.examSchedule}
      className="action-button action-button-sm flow-end d-inline-flex align-items-center gap-1 text-nowrap text-decoration-none"
    >
      <i className="ti ti-calendar" />
      Full Exam Schedule
    </Link>
  </div>
);

export default ExamCenterCard;
