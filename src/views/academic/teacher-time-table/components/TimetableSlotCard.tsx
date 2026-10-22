import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { TimetableSlot } from '../data/teacherTimeTable.data';
import type { TimetableModalId } from '../modals/TimeTableModals';

const routes = all_routes;

export interface TimetableSlotCardProps {
  slot: TimetableSlot;
  menuOpen: boolean;
  onToggleMenu: (id: string | null) => void;
  onOpenModal: (modal: TimetableModalId, slot: TimetableSlot) => void;
}

const TimetableSlotCard = ({
  slot,
  menuOpen,
  onToggleMenu,
  onOpenModal,
}: TimetableSlotCardProps) => {
  const open = (modal: TimetableModalId) => {
    onToggleMenu(null);
    onOpenModal(modal, slot);
  };

  const Heading = slot.heading;

  return (
    <div className={`timetable-slot bg-transparent-${slot.tone}`}>
      <div className="toolbar-actions dropdown">
        <button
          type="button"
          className="btn btn-icon btn-sm bg-white rounded-circle flex-shrink-0 shadow-sm"
          aria-label="Session actions"
          aria-expanded={menuOpen}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={() => onToggleMenu(menuOpen ? null : slot.id)}
        >
          <i className="ti ti-dots-vertical" />
        </button>
        <ul className={`dropdown-menu dropdown-menu-end p-2${menuOpen ? ' show' : ''}`}>
          <li>
            <button
              type="button"
              className="dropdown-item rounded-1"
              onClick={() => open(slot.detailsModal)}
            >
              <i className="ti ti-eye me-2" />
              View Details
            </button>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item rounded-1"
              onClick={() => open('editSession')}
            >
              <i className="ti ti-edit me-2" />
              Edit Schedule
            </button>
          </li>
          {slot.fullMenu ? (
            <>
              <li>
                <button
                  type="button"
                  className="dropdown-item rounded-1"
                  onClick={() => open('swapSchedule')}
                >
                  <i className="ti ti-arrows-exchange me-2" />
                  Swap Class
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item rounded-1"
                  onClick={() => open('assignSubstitute')}
                >
                  <i className="ti ti-user-plus me-2" />
                  Assign Substitute
                </button>
              </li>
              <li>
                <Link className="dropdown-item rounded-1" to={routes.studentAttendance}>
                  <i className="ti ti-calendar-check me-2" />
                  Open Attendance
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded-1" to={routes.classSyllabus}>
                  <i className="ti ti-book me-2" />
                  Open Lesson Plan
                </Link>
              </li>
              <li>
                <Link className="dropdown-item rounded-1" to={routes.studentGrid}>
                  <i className="ti ti-users me-2" />
                  View Students
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item rounded-1"
                  onClick={() => {
                    onToggleMenu(null);
                    window.print();
                  }}
                >
                  <i className="ti ti-printer me-2" />
                  Print Class Sheet
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </div>

      <div className="d-flex align-items-center gap-2 mb-2">
        <span className={`timetable-slot-icon ${slot.iconTone}`}>
          <i className={slot.icon} />
        </span>
        <div className="overflow-hidden">
          <Heading className={slot.headingClass}>{slot.subject}</Heading>
          <span className="timetable-slot-time">
            <i className="ti ti-clock me-1" />
            {slot.time}
          </span>
        </div>
      </div>

      {slot.metas.length > 0 ? (
        <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
          {slot.metas.map((meta) => (
            <span className="timetable-slot-meta" key={meta.label}>
              <i className={meta.icon} />
              {meta.label}
            </span>
          ))}
        </div>
      ) : null}

      {slot.badges.length > 0 ? (
        <div className="d-flex align-items-center flex-wrap gap-1">
          {slot.badges.map((badge) => (
            <span className={`badge ${badge.className}`} key={badge.label}>
              {badge.icon ? <i className={badge.icon} /> : null}
              {badge.label}
            </span>
          ))}
        </div>
      ) : null}

      {slot.soloBadge ? (
        <span className={`badge ${slot.soloBadge.className}`}>{slot.soloBadge.label}</span>
      ) : null}
    </div>
  );
};

export default TimetableSlotCard;
