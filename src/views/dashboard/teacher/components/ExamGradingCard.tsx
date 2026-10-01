import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import {
  examStats,
  studentsNeedingAttention,
  upcomingExams,
} from '../data/teacherDashboard.data';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';

const routes = all_routes;

const ExamGradingCard = () => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-certificate" title="Exam & Grading">
      <Link to={routes.examResult} className="widget-link d-inline-flex align-items-center">
        Results
        <i className="ti ti-chevron-right" />
      </Link>
    </WidgetHeader>

    <div className="row g-2 mb-3">
      {examStats.map((stat) => (
        <div className="col-6" key={stat.id}>
          <div className="card p-2 mb-0">
            <div className="fs-22 fw-bold text-dark mt-2 mb-1">{stat.value}</div>
            <div className="fs-11 text-muted">{stat.label}</div>
          </div>
        </div>
      ))}
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
      <i className="ti ti-alert-triangle me-1" />
      Students Needing Attention
    </h6>
    <div className="info-list d-flex flex-column">
      {studentsNeedingAttention.map((row) => (
        <InfoListRow row={row} key={row.id} />
      ))}
    </div>
  </div>
);

export default ExamGradingCard;
