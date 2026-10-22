import type { TeacherModalId } from '../data/teacherDashboard.data';
import { todaysLessons } from '../data/teacherDashboard.data';
import WidgetHeader from '../../shared/WidgetHeader';

export interface TodaysTimetableProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const TodaysTimetable = ({ onOpenModal }: TodaysTimetableProps) => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader
      icon="ti ti-calendar-time"
      title="Today's Timetable"
      as="h4"
      titleClassName="fs-15 fw-medium"
    >
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('classes')}
      >
        <i className="ti ti-eye" />
        View Full Schedule
      </button>
    </WidgetHeader>

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
                <i className="ti ti-users" />
                {lesson.grade}
              </span>
              <span className="lesson-tag d-inline-flex align-items-center">
                <i className="ti ti-door" />
                {lesson.room}
              </span>
              <span className="lesson-tag d-inline-flex align-items-center">
                <i className="ti ti-user" />
                {lesson.students}
              </span>
            </div>
          </div>

          <div className="lesson-actions d-flex align-items-center">
            <span className={lesson.status.className}>
              {lesson.status.icon ? <i className={lesson.status.icon} /> : null}
              {lesson.status.label}
            </span>

            {lesson.startButton ? (
              <button
                type="button"
                className={`action-button action-button-sm ${lesson.startButton.className} d-inline-flex align-items-center text-nowrap text-decoration-none`}
                onClick={() => onOpenModal('startClass')}
              >
                <i className="ti ti-player-play" />
                Class
              </button>
            ) : null}

            <button
              type="button"
              className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"
              title="Attendance"
              onClick={() => onOpenModal(lesson.attendanceModal ?? 'quickAttendance')}
            >
              <i className="ti ti-clipboard-check" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TodaysTimetable;
