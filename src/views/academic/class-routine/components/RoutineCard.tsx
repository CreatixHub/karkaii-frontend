import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { RoutinePeriod, RowMenuItem, TimeSlot } from '../data/classRoutine.data';
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
} from '../data/classRoutine.data';

export interface RoutineCardProps {
  period: RoutinePeriod;
  slot: TimeSlot;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  open: boolean;
  onToggleOpen: (id: string) => void;
  menuOpen: boolean;
  onOpenMenu: (id: string | null) => void;
  onAction: (item: RowMenuItem, period: RoutinePeriod) => void;
}

const RoutineCard = ({
  period,
  slot,
  selected,
  onToggleSelect,
  open,
  onToggleOpen,
  menuOpen,
  onOpenMenu,
  onAction,
}: RoutineCardProps) => (
  <div className={`rt-card${open ? ' is-open' : ''}${selected ? ' is-selected' : ''}`}>
    <span className={`rt-accent ${period.accent}`} />

    <div className="d-flex align-items-start justify-content-between gap-2">
      <div className="rt-title">{period.subject}</div>
      <input
        type="checkbox"
        className="form-check-input rt-check mt-0 flex-shrink-0"
        aria-label={`Select ${period.subject} ${period.day}`}
        checked={selected}
        onChange={() => onToggleSelect(period.id)}
      />
    </div>

    <div className="rt-sub mb-1">
      <i className="ti ti-clock me-1" />
      {slot.start}–{slot.end} · {slot.duration}
    </div>

    {period.teacher ? (
      <div className="d-flex align-items-center gap-1 mb-1">
        <span className="avatar avatar-xs">
          <ImageWithBasePath
            src={period.teacher.avatar}
            className="rounded-circle flex-shrink-0"
            alt={period.teacher.name}
          />
        </span>
        <span className="rt-sub rt-teacher fw-medium text-dark">{period.teacher.name}</span>
      </div>
    ) : null}

    <div className="d-flex align-items-center justify-content-between">
      <span className={`dt-pill ${period.pillClass}`}>
        {period.pillIcon ? <i className={period.pillIcon} /> : <span className="dt-pill-dot" />}
        {period.status}
      </span>
      {period.room ? (
        <span className="rt-sub">
          <i className="ti ti-door me-1" />
          Rm <span className="rt-room">{period.room}</span>
        </span>
      ) : null}
    </div>

    <div className="rt-hover rt-sub">
      <span className="d-block">
        <i className="ti ti-notebook me-1" />
        {period.objective}
      </span>
      <span className="d-block">
        <i className="ti ti-book me-1" />
        HW: {period.homework}
      </span>
    </div>

    <div className="d-flex align-items-center justify-content-between mt-1">
      <span className="rt-sub">
        <i className="ti ti-users me-1" />
        {period.students || '—'}
      </span>
      <button
        type="button"
        className="rt-expand dt-ib"
        aria-expanded={open}
        aria-label={`Expand ${period.subject} ${period.day}`}
        title="Details"
        onClick={() => onToggleOpen(period.id)}
      >
        <i className="ti ti-chevron-down" />
      </button>
    </div>

    <div className="rt-detail">
      <div className="row g-2 fs-12">
        <div className="col-6">
          <span className="text-muted d-block">Teacher Information</span>
          <span className="fw-medium">
            {period.teacher ? `${period.teacher.name} · ${period.teacher.qualification}` : '—'}
          </span>
        </div>
        <div className="col-6">
          <span className="text-muted d-block">Room Information</span>
          <span className="fw-medium">{roomInformation(period)}</span>
        </div>
        <div className="col-6">
          <span className="text-muted d-block">Subject Details</span>
          <span className="fw-medium">{subjectDetails(period)}</span>
        </div>
        <div className="col-6">
          <span className="text-muted d-block">Attendance Summary</span>
          <span className="fw-medium">{attendanceSummary(period)}</span>
        </div>
        <div className="col-12">
          <span className="text-muted d-block">Learning Objectives</span>
          <span className="fw-medium">{period.objective}</span>
        </div>
        <div className="col-12">
          <span className="text-muted d-block">Teaching Resources</span>
          <span className="fw-medium">{teachingResources(period)}</span>
        </div>
        <div className="col-12">
          <span className="text-muted d-block">Assignments</span>
          <span className="fw-medium">{assignmentLine(period)}</span>
        </div>
        <div className="col-12">
          <span className="text-muted d-block">Remarks</span>
          <span className="fw-medium">{remarkFor(period)}</span>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-1 mt-2 pt-2 border-top">
        {cardQuickActions.map((item) => (
          <Link
            key={item.id}
            to="#"
            className="dt-ib"
            title={item.label}
            aria-label={item.label}
            onClick={() => onAction(item, period)}
          >
            <i className={item.icon} />
          </Link>
        ))}
        <div className="dropdown">
          <ActionLink
            className="dt-ib"
            title="More"
            ariaLabel="More actions"
            ariaExpanded={menuOpen}
            onClick={() => onOpenMenu(menuOpen ? null : period.id)}
          >
            <i className="ti ti-dots-vertical" />
          </ActionLink>
          <div className={`dropdown-menu dropdown-menu-end${menuOpen ? ' show' : ''}`}>
            {cardMenuItems.map((item) => (
              <Fragment key={item.id}>
                {item.divider ? <hr className="dropdown-divider" /> : null}
                <Link
                  className={`dropdown-item${item.danger ? ' text-danger' : ''}`}
                  to="#"
                  onClick={() => {
                    onOpenMenu(null);
                    onAction(item, period);
                  }}
                >
                  <i className={item.icon} />
                  {item.label}
                </Link>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RoutineCard;
