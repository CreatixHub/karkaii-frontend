import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import { scheduleSummary, todaysLessons } from '../data/studentDashboard.data';

export interface TodaysScheduleProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const TodaysSchedule = ({ onOpenModal }: TodaysScheduleProps) => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader
      icon="ti ti-calendar-time"
      title="Today's Schedule"
      as="h4"
      titleClassName="fs-15 fw-medium"
    >
      <div className="d-flex align-items-center gap-2">
        <span className="badge badge-soft-info">Monday · 7 periods</span>
        <button
          type="button"
          className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
          onClick={() => onOpenModal('timetable')}
        >
          <i className="ti ti-eye" />
          Full Timetable
        </button>
      </div>
    </WidgetHeader>

    <div className="row g-2 mb-3">
      {scheduleSummary.map((tile) => (
        <div className="col-sm-3" key={tile.id}>
          <div className={`metric-tile metric-tile-sm ${tile.borderClass} text-center`}>
            <div className="metric-tile-value">{tile.value}</div>
            <div className="metric-tile-label">{tile.label}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="lesson-list d-flex flex-column">
      {todaysLessons.map((lesson) => (
        <div className={`lesson-item ${lesson.borderClass} align-items-center`} key={lesson.id}>
          <div className="lesson-time text-center">
            <b>{lesson.time}</b>
            <span>{lesson.duration}</span>
          </div>

          <div className="lesson-body">
            <b>{lesson.subject}</b>
            <div className="lesson-tags d-flex align-items-center flex-wrap">
              <span className="lesson-tag d-inline-flex align-items-center">
                <i className={lesson.teacherIcon} />
                {lesson.teacher}
              </span>
              <span className="lesson-tag d-inline-flex align-items-center">
                <i className={lesson.roomIcon} />
                {lesson.room}
              </span>
            </div>
          </div>

          <div className="lesson-actions d-flex align-items-center">
            <span className={lesson.status.className}>
              {lesson.status.icon ? <i className={`${lesson.status.icon} me-1`} /> : null}
              {lesson.status.label}
            </span>

            {lesson.join ? (
              <button
                type="button"
                className="action-button action-button-sm action-button-success d-inline-flex align-items-center text-nowrap text-decoration-none"
                onClick={() => onOpenModal('join')}
              >
                <i className="ti ti-video" />
                Join
              </button>
            ) : lesson.noAction ? null : (
              <button
                type="button"
                className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"
                title="View notes"
                onClick={() => onOpenModal('notes')}
              >
                <i className="ti ti-notes" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TodaysSchedule;
