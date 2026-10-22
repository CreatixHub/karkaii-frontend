import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ColumnId, StaffAttendanceModalId } from '../data/staffAttendanceWorkspace.data';
import type { StaffAttendanceRow as StaffRow } from '../data/staffAttendance.data';
import { statusPill } from '../data/staffAttendance.data';
import { ActionLink } from '@components/workspace';

export interface StaffAttendanceRowProps {
  row: StaffRow;
  /** Position in the template's `att_d0…att_d7` detail ids. */
  index: number;
  columns: Record<ColumnId, boolean>;
  selected: boolean;
  onToggleSelect: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onInspect: () => void;
  onOpenModal: (modal: StaffAttendanceModalId) => void;
  onPrint: () => void;
  onDownload: () => void;
}

const StaffAttendanceRow = ({
  row,
  index,
  columns,
  selected,
  onToggleSelect,
  expanded,
  onToggleExpand,
  menuOpen,
  onToggleMenu,
  onInspect,
  onOpenModal,
  onPrint,
  onDownload,
}: StaffAttendanceRowProps) => {
  const detailId = `att_d${index}`;
  const visibleToggleable = Object.values(columns).filter(Boolean).length;
  // select + expander + Staff Member + Check-In + Check-Out + Working Hours +
  // Attendance + Actions, plus whichever optional columns are on.
  const colSpan = 8 + visibleToggleable;

  const { detail } = row;
  const TimelineHeading = detail.timelineHeadingTag ?? 'h6';
  const CheckInHeading = detail.checkInTag ?? 'h6';

  const rowMenu = (
    <div className="dropdown">
      <ActionLink
        className="dt-ib"
        title="More"
        ariaLabel="More actions"
        ariaExpanded={menuOpen}
        onClick={onToggleMenu}
      >
        <i className="ti ti-dots-vertical" />
      </ActionLink>
      <ul className={`dropdown-menu dropdown-menu-end p-2${menuOpen ? ' show' : ''}`}>
        <li>
          <button type="button" className="dropdown-item rounded-1" onClick={() => onOpenModal('correction')}>
            <i className="ti ti-clock-edit me-2" />
            Correct Attendance
          </button>
        </li>
        <li>
          <button type="button" className="dropdown-item rounded-1" onClick={() => onOpenModal('history')}>
            <i className="ti ti-user me-2" />
            View Staff Profile
          </button>
        </li>
        <li>
          <button type="button" className="dropdown-item rounded-1" onClick={onPrint}>
            <i className="ti ti-printer me-2" />
            Print
          </button>
        </li>
        <li>
          <button type="button" className="dropdown-item rounded-1" onClick={onDownload}>
            <i className="ti ti-download me-2" />
            Download
          </button>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <button type="button" className="dropdown-item rounded-1 text-danger" onClick={() => onOpenModal('delete')}>
            <i className="ti ti-trash me-2" />
            Delete
          </button>
        </li>
      </ul>
    </div>
  );

  const infoList = (items: { label: string; value: string }[], className = 'list-unstyled mb-0') => (
    <ul className={className}>
      {items.map((item, position) => (
        <li
          className={`d-flex justify-content-between py-1 fs-13${
            position === items.length - 1 ? '' : ' border-bottom'
          }`}
          key={item.label}
        >
          <span className="text-muted">{item.label}</span>
          <span className="text-dark">{item.value}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <tr className="dt-row">
        <td className="dt-pin">
          <input
            type="checkbox"
            className="dt-check"
            aria-label={`Select ${row.name}`}
            checked={selected}
            onChange={onToggleSelect}
          />
        </td>
        <td className="card-expand-toggle">
          <button
            type="button"
            className="dt-expand"
            aria-expanded={expanded}
            aria-controls={detailId}
            aria-label="Toggle attendance details"
            onClick={onToggleExpand}
          >
            <i className="ti ti-chevron-right" />
          </button>
        </td>
        <td>
          <div className="dt-user">
            <span className="dt-avatar">
              <ImageWithBasePath src={row.avatar} alt={row.name} />
            </span>
            <span>
              <ActionLink
                className="dt-name"
                onClick={() => onOpenModal('details')}
              >
                {row.name}
              </ActionLink>
              <span className="dt-sub">{row.id}</span>
            </span>
          </div>
        </td>
        {columns.department ? <td>{row.department}</td> : null}
        {columns.designation ? <td>{row.designation}</td> : null}
        {columns.shift ? (
          <td>
            <button
              type="button"
              className="btn btn-link p-0 border-0 align-baseline"
              title="Shift Details"
              onClick={() => onOpenModal('shift')}
            >
              <span className="badge badge-soft-secondary">{row.shift}</span>
            </button>
          </td>
        ) : null}
        <td>
          <span className="d-inline-flex align-items-center text-success">
            <i className="ti ti-login-2 me-1" />
            {row.checkIn}
          </span>
        </td>
        <td>
          <span className="d-inline-flex align-items-center text-primary">
            <i className="ti ti-logout-2 me-1" />
            {row.checkOut}
          </span>
        </td>
        <td>{row.workingHours}</td>
        {columns.break ? <td>{row.breakTime}</td> : null}
        {columns.overtime ? (
          <td>{row.overtimeClass ? <span className={row.overtimeClass}>{row.overtime}</span> : row.overtime}</td>
        ) : null}
        <td>
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />
            {row.status}
          </span>
        </td>
        {columns.method ? (
          <td>
            <span className="d-inline-flex align-items-center">
              <i className={`${row.method.icon} me-1 text-muted`} />
              {row.method.label}
            </span>
          </td>
        ) : null}
        {columns.recordedBy ? <td>{row.recordedBy}</td> : null}
        {columns.lastUpdated ? <td>{row.lastUpdated}</td> : null}
        <td className="text-end">
          <div className="dt-actions">
            <ActionLink
              className="dt-ib"
              title="View Attendance"
              ariaLabel="View Attendance"
              onClick={onInspect}
            >
              <i className="ti ti-eye" />
            </ActionLink>
            <ActionLink
              className="dt-ib"
              title="Edit Record"
              ariaLabel="Edit Record"
              onClick={() => onOpenModal('edit')}
            >
              <i className="ti ti-edit" />
            </ActionLink>
            <ActionLink
              className="dt-ib success"
              title="Approve"
              ariaLabel="Approve"
              onClick={() => onOpenModal('correction')}
            >
              <i className="ti ti-check" />
            </ActionLink>
            {rowMenu}
          </div>
        </td>
      </tr>

      <tr className={`dt-detail${expanded ? ' open' : ''}`}>
        <td colSpan={colSpan} className="p-0">
          <div className={`collapse${expanded ? ' show' : ''}`} id={detailId}>
            <div className="p-3">
              <div className="row g-3">
                <div className="col-lg-3 col-md-6">
                  <TimelineHeading className={detail.timelineHeadingClass ?? 'fs-13 mb-2'}>
                    <i className="ti ti-timeline text-primary me-1" />
                    Attendance Timeline
                  </TimelineHeading>
                  {detail.timeline ? (
                    <>
                      <div className="d-flex">
                        <div className="d-flex flex-column align-items-center me-2">
                          <span className="avatar avatar-xs bg-success-transparent text-success rounded-circle flex-shrink-0">
                            <i className="ti ti-login-2" />
                          </span>
                          <span className="flex-fill border-start border-2 my-1" />
                        </div>
                        <div className="pb-2">
                          <CheckInHeading className="fs-13 mb-0">Check-In</CheckInHeading>
                          <span className="fs-11 text-muted">{detail.timeline.checkIn}</span>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="d-flex flex-column align-items-center me-2">
                          <span className="avatar avatar-xs bg-warning-transparent text-warning rounded-circle flex-shrink-0">
                            <i className="ti ti-coffee" />
                          </span>
                          <span className="flex-fill border-start border-2 my-1" />
                        </div>
                        <div className="pb-2">
                          <h6 className="fs-13 mb-0">Break</h6>
                          <span className="fs-11 text-muted">{detail.timeline.breakTotal}</span>
                        </div>
                      </div>
                      <div className="d-flex">
                        <div className="d-flex flex-column align-items-center me-2">
                          <span className="avatar avatar-xs bg-primary-transparent text-primary rounded-circle flex-shrink-0">
                            <i className="ti ti-logout-2" />
                          </span>
                        </div>
                        <div className="">
                          <h6 className="fs-13 mb-0">Check-Out</h6>
                          <span className="fs-11 text-muted">{detail.timeline.checkOut}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="fs-12 text-muted mb-0">No check-in recorded for this date.</p>
                  )}
                </div>

                <div className="col-lg-3 col-md-6">
                  <h6 className="fs-13 mb-2">
                    <i className="ti ti-coffee text-warning me-1" />
                    Break &amp; Overtime
                  </h6>
                  {infoList(detail.breakOvertime)}
                </div>

                <div className="col-lg-3 col-md-6">
                  <h6 className="fs-13 mb-2">
                    <i className="ti ti-calendar-off text-info me-1" />
                    Leave &amp; Corrections
                  </h6>
                  {infoList(detail.leaveCorrections)}
                </div>

                <div className="col-lg-3 col-md-6">
                  <h6 className="fs-13 mb-2">
                    <i className="ti ti-device-desktop text-secondary me-1" />
                    Device &amp; Notes
                  </h6>
                  {infoList(detail.device, 'list-unstyled mb-2')}
                  <p className="fs-12 text-muted mb-0">
                    <span className="fw-semibold text-dark">Notes:</span> {detail.notes}
                  </p>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
                <button type="button" className="btn btn-primary btn-sm" onClick={onInspect}>
                  <i className="ti ti-eye me-1" />
                  Open Inspector
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm"
                  onClick={() => onOpenModal('correction')}
                >
                  <i className="ti ti-clock-edit me-1" />
                  Correct
                </button>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default StaffAttendanceRow;
