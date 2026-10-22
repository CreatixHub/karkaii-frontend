import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { TeacherModalId } from '../data/teacherDashboard.data';
import { classActions, myClasses } from '../data/teacherDashboard.data';
import WidgetHeader from '../../shared/WidgetHeader';

const routes = all_routes;

export interface MyClassesProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const MyClasses = ({ onOpenModal }: MyClassesProps) => (
  <div className="card-widget card-widget-body mb-3">
    <WidgetHeader icon="ti ti-school" title="My Classes">
      <Link to={routes.classes} className="widget-link d-inline-flex align-items-center">
        View all
        <i className="ti ti-chevron-right" />
      </Link>
    </WidgetHeader>

    <div className="class-grid">
      {myClasses.map((item) => (
        <div className="card-class overflow-hidden" key={item.id}>
          <div className={`card-class-header ${item.headerClass} d-flex align-items-center`}>
            <span className={`avatar avatar-icon ${item.avatarClass}`}>
              <i className={item.icon} />
            </span>
            <div>
              <b>{item.grade}</b>
              <span>{item.subject}</span>
            </div>
            {item.homeroom ? (
              <span className="badge badge-soft-success card-class-badge ms-auto d-inline-flex align-items-center align-self-start gap-1">
                <i className="ti ti-star" />
                Homeroom
              </span>
            ) : null}
          </div>

          <div className="card-class-stats">
            {item.stats.map((stat) => (
              <div className="card-class-stat" key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="card-class-actions d-flex">
            <button
              type="button"
              className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"
              title="Attendance"
              onClick={() => onOpenModal('quickAttendance')}
            >
              <i className="ti ti-clipboard-check" />
            </button>
            {classActions.map((action) => (
              <Link
                key={action.id}
                to={action.to}
                className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"
                title={action.title}
              >
                <i className={action.icon} />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MyClasses;
