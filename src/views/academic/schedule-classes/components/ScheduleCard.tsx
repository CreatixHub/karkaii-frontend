import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { RowMenuItem, ScheduledClass, TimeSlot } from '../data/classSchedule.data';
import { ActionLink } from '@components/workspace';
import {
  assignmentLine,
  attendanceSummary,
  cardMenuItems,
  cardQuickActions,
  remarkFor,
  roomInformation,
  subjectDetails,
  teachingResources,
} from '../data/classSchedule.data';

const routes = all_routes as Record<string, string>;

export interface ScheduleCardProps {
  item: ScheduledClass;
  slot: TimeSlot;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  open: boolean;
  onToggleOpen: (id: string) => void;
  menuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  onAction: (menuItem: RowMenuItem, item: ScheduledClass) => void;
}

const ScheduleCard = ({
  item,
  slot,
  selected,
  onToggleSelect,
  open,
  onToggleOpen,
  menuOpen,
  onOpenMenu,
  onAction,
}: ScheduleCardProps) => (
  <div className={`rt-card${open ? ' is-open' : ''}${selected ? ' is-selected' : ''}`}>
    <span className={`rt-accent ${item.accent}`} />

    <div className="d-flex align-items-start justify-content-between gap-2">
      <div className="rt-title">{item.subject}</div>
      <input
        type="checkbox"
        className="form-check-input rt-check mt-0 flex-shrink-0"
        aria-label={`Select ${item.subject} ${item.day}`}
        checked={selected}
        onChange={() => onToggleSelect(item.id)}
      />
    </div>

    <div className="rt-sub mb-1">
      <i className="ti ti-clock me-1" />
      {slot.start}–{slot.end} · {slot.duration}
    </div>

    {item.teacher ? (
      <div className="d-flex align-items-center gap-1 mb-1">
        <span className="avatar avatar-xs">
          <ImageWithBasePath
            src={item.teacher.avatar}
            className="rounded-circle flex-shrink-0"
            alt={item.teacher.name}
          />
        </span>
        <span className="rt-sub rt-teacher fw-medium text-dark">{item.teacher.name}</span>
      </div>
    ) : null}

    <div className="d-flex align-items-center justify-content-between">
      <span className={`dt-pill ${item.pillClass}`}>
        {item.pillIcon ? <i className={item.pillIcon} /> : <span className="dt-pill-dot" />}
        {item.status}
      </span>
      {item.room ? (
        <span className="rt-sub">
          <i className="ti ti-door me-1" />
          Rm <span className="rt-room">{item.room}</span>
        </span>
      ) : null}
    </div>

    <div className="rt-hover rt-sub">
      <span className="d-block">
        <i className="ti ti-notebook me-1" />
        {item.objective}
      </span>
      <span className="d-block">
        <i className="ti ti-book me-1" />
        HW: {item.homework}
      </span>
    </div>

    <div className="d-flex align-items-center justify-content-between mt-1">
      <span className="rt-sub">
        <i className="ti ti-users me-1" />
        {item.students || '—'}
      </span>
      <button
        type="button"
        className="rt-expand dt-ib"
        aria-expanded={open}
        aria-label={`Expand ${item.subject} ${item.day}`}
        title="Details"
        onClick={() => onToggleOpen(item.id)}
      >
        <i className="ti ti-chevron-down" />
      </button>
    </div>

    <div className="rt-detail">
      <div className="row g-2 fs-12">
        <div className="col-6">
          <span className="text-muted d-block">Teacher Information</span>
          <span className="fw-medium">
            {item.teacher ? `${item.teacher.name} · ${item.teacher.qualification}` : '—'}
          </span>
        </div>
        <div className="col-6">
          <span className="text-muted d-block">Room Information</span>
          <span className="fw-medium">{roomInformation(item)}</span>
        </div>
        <div className="col-6">
          <span className="text-muted d-block">Subject Details</span>
          <span className="fw-medium">{subjectDetails(item)}</span>
        </div>
        <div className="col-6">
          <span className="text-muted d-block">Attendance Summary</span>
          <span className="fw-medium">{attendanceSummary(item)}</span>
        </div>
        <div className="col-12">
          <span className="text-muted d-block">Learning Objectives</span>
          <span className="fw-medium">{item.objective}</span>
        </div>
        <div className="col-12">
          <span className="text-muted d-block">Teaching Resources</span>
          <span className="fw-medium">{teachingResources(item)}</span>
        </div>
        <div className="col-12">
          <span className="text-muted d-block">Assignments</span>
          <span className="fw-medium">{assignmentLine(item)}</span>
        </div>
        <div className="col-12">
          <span className="text-muted d-block">Remarks</span>
          <span className="fw-medium">{remarkFor(item)}</span>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-1 mt-2 pt-2 border-top">
        {cardQuickActions.map((menuItem) => (
          <Link
            key={menuItem.id}
            to="#"
            className="dt-ib"
            title={menuItem.label}
            aria-label={menuItem.label}
            onClick={() => onAction(menuItem, item)}
          >
            <i className={menuItem.icon} />
          </Link>
        ))}
        <div className="dropdown">
          <ActionLink
            className="dt-ib"
            title="More"
            ariaLabel="More actions"
            ariaExpanded={menuOpen}
            onClick={() => onOpenMenu(menuOpen ? null : item.id)}
          >
            <i className="ti ti-dots-vertical" />
          </ActionLink>
          <div className={`dropdown-menu dropdown-menu-end${menuOpen ? ' show' : ''}`}>
            {cardMenuItems.map((menuItem) => (
              <Fragment key={menuItem.id}>
                {menuItem.divider ? <hr className="dropdown-divider" /> : null}
                {menuItem.route ? (
                  <Link className="dropdown-item" to={routes[menuItem.route]}>
                    <i className={menuItem.icon} />
                    {menuItem.label}
                  </Link>
                ) : (
                  <Link
                    className={`dropdown-item${menuItem.danger ? ' text-danger' : ''}`}
                    to="#"
                    onClick={() => {
                      onOpenMenu(null);
                      onAction(menuItem, item);
                    }}
                  >
                    <i className={menuItem.icon} />
                    {menuItem.label}
                  </Link>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ScheduleCard;
