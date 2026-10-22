import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { SlotMenuItem, TimetableSlot } from '../data/classTimeTable.data';
import { slotMenuItems } from '../data/classTimeTable.data';

const routes = all_routes;

export interface TimetableSlotCardProps {
  slot: TimetableSlot;
  menuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  onAction: (item: SlotMenuItem, slot: TimetableSlot) => void;
}

const TimetableSlotCard = ({ slot, menuOpen, onOpenMenu, onAction }: TimetableSlotCardProps) => (
  <div className={`timetable-slot bg-transparent-${slot.tone}`}>
    <div className="toolbar-actions dropdown">
      <button
        type="button"
        className="btn btn-icon btn-sm bg-white rounded-circle flex-shrink-0 shadow-sm"
        aria-label="Period actions"
        aria-expanded={menuOpen}
        onClick={() => onOpenMenu(menuOpen ? null : slot.id)}
      >
        <i className="ti ti-dots-vertical" />
      </button>
      <ul className={`dropdown-menu dropdown-menu-end p-2${menuOpen ? ' show' : ''}`}>
        {slotMenuItems.map((item) => (
          <Fragment key={item.id}>
            {item.divider ? (
              <li>
                <hr className="dropdown-divider" />
              </li>
            ) : null}
            <li>
              <Link
                className={`dropdown-item rounded-1${item.danger ? ' text-danger' : ''}`}
                to="#"
                onClick={() => {
                  onOpenMenu(null);
                  onAction(item, slot);
                }}
              >
                <i className={`${item.icon} me-2`} />
                {item.label}
              </Link>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>

    <div className="d-flex align-items-center gap-2 mb-2">
      <span className={`timetable-slot-icon text-${slot.iconTone}`}>
        <i className={slot.icon} />
      </span>
      <div className="overflow-hidden">
        <h6 className="timetable-slot-sub mb-0 text-truncate">{slot.subject}</h6>
        <span className="timetable-slot-time">
          <i className="ti ti-clock me-1" />
          {slot.time}
        </span>
      </div>
    </div>

    <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
      <span className="timetable-slot-meta">
        <i className="ti ti-door me-1" />
        {slot.room}
      </span>
      <span className="timetable-slot-meta">
        <i className="ti ti-hourglass me-1" />
        {slot.duration}
      </span>
    </div>

    <Link to={routes.teacherDetails} className="timetable-slot-teacher d-flex align-items-center p-1">
      <span className="avatar avatar-sm me-2">
        <ImageWithBasePath src={slot.teacher.avatar} alt={slot.teacher.name} />
      </span>
      <span className="text-dark fs-13">{slot.teacher.name}</span>
    </Link>
  </div>
);

export default TimetableSlotCard;
