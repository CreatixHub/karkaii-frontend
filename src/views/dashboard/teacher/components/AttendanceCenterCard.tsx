import { useState } from 'react';
import type { TeacherModalId } from '../data/teacherDashboard.data';
import {
  attendanceHeatCells,
  attendanceSplit,
  attendanceSummaryTiles,
  lateStudents,
  leaveRequests as initialLeaveRequests,
} from '../data/teacherDashboard.data';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';

/** Opacity ramp matching the legend swatches in the source markup. */
const HEAT_LEVEL_ALPHA: Record<number, number> = {
  1: 0.25,
  2: 0.45,
  3: 0.68,
  4: 0.9,
};

export interface AttendanceCenterCardProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const AttendanceCenterCard = ({ onOpenModal }: AttendanceCenterCardProps) => {
  const [leaveRequests, setLeaveRequests] = useState(initialLeaveRequests);

  const resolveRequest = (id: string) => {
    setLeaveRequests((current) => current.filter((request) => request.id !== id));
  };

  return (
    <div className="card-widget card-widget-body h-100">
      <WidgetHeader icon="ti ti-clipboard-check" title="Attendance Center">
        <button
          type="button"
          className="action-button action-button-sm action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
          onClick={() => onOpenModal('quickAttendance')}
        >
          <i className="ti ti-plus" />
          Quick Attendance
        </button>
      </WidgetHeader>

      <div className="attendance-split mb-3 text-center">
        {attendanceSplit.map((period) => (
          <div key={period.id}>
            <div className="v">{period.value}</div>
            <div className="l">{period.label}</div>
            <div
              className="progress mt-1"
              role="progressbar"
              aria-label={period.label}
              aria-valuenow={period.percent}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ '--bs-progress-height': '6px' } as React.CSSProperties}
            >
              <div className={`progress-bar ${period.barClass}`} style={{ width: `${period.percent}%` }} />
            </div>
          </div>
        ))}
      </div>

      <h6 className="widget-subtitle mb-2">
        <i className="ti ti-calendar-stats me-1" />
        30-Day Attendance Heatmap
      </h6>
      <div className="heatmap">
        {attendanceHeatCells.map((cell) => (
          <i
            key={cell.day}
            title={`Day ${cell.day}${cell.absent ? ' · absent' : ''}`}
            style={{
              background: cell.absent
                ? 'rgba(220,38,38,.55)'
                : `rgba(22,163,74,${HEAT_LEVEL_ALPHA[cell.level]})`,
            }}
          />
        ))}
      </div>
      <div className="heatmap-legend d-flex align-items-center">
        <span>Less</span>
        <i style={{ background: 'rgba(22,163,74,.25)' }} />
        <i style={{ background: 'rgba(22,163,74,.45)' }} />
        <i style={{ background: 'rgba(22,163,74,.68)' }} />
        <i style={{ background: 'rgba(22,163,74,.9)' }} />
        <span>More</span>
        <i style={{ background: 'rgba(220,38,38,.55)' }} className="ms-2" />
        <span>Absent day</span>
      </div>

      <div className="row g-2 mt-2">
        {attendanceSummaryTiles.map((tile) => (
          <div className="col-6" key={tile.id}>
            <div className="info-list-item info-list-item-sm d-flex align-items-center">
              <span className="avatar flex-shrink-0">
                <i className={tile.icon} />
              </span>
              <div className="info-list-body">
                <b>{tile.value}</b>
                <span>{tile.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h6 className="widget-subtitle mb-2 mt-3">
        <i className="ti ti-clock-exclamation me-1" />
        Late Students Today
      </h6>
      <div className="info-list mb-3 d-flex flex-column">
        {lateStudents.map((row) => (
          <InfoListRow row={row} key={row.id} />
        ))}
      </div>

      <h6 className="widget-subtitle mb-2">
        <i className="ti ti-calendar-off me-1" />
        Leave Requests
      </h6>
      <div className="info-list d-flex flex-column">
        {leaveRequests.map((request) => (
          <div className="info-list-item d-flex align-items-center" key={request.id}>
            <ImageWithBasePath
              className="info-list-avatar object-fit-cover flex-shrink-0"
              src={request.avatar}
              alt={request.name}
            />
            <div className="info-list-body">
              <b>{request.name}</b>
              <span>{request.detail}</span>
            </div>
            <div className="info-list-end flex-shrink-0 text-end d-flex flex-column align-items-end">
              <div className="d-flex gap-1">
                <button
                  type="button"
                  className="icon-action icon-action-sm d-inline-flex align-items-center justify-content-center text-decoration-none"
                  title="Approve"
                  onClick={() => resolveRequest(request.id)}
                >
                  <i className="ti ti-check text-success" />
                </button>
                <button
                  type="button"
                  className="icon-action icon-action-sm d-inline-flex align-items-center justify-content-center text-decoration-none"
                  title="Decline"
                  onClick={() => resolveRequest(request.id)}
                >
                  <i className="ti ti-x text-danger" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {leaveRequests.length === 0 ? (
          <p className="text-muted fs-13 mb-0">No pending leave requests.</p>
        ) : null}
      </div>
    </div>
  );
};

export default AttendanceCenterCard;
