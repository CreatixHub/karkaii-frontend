export interface AttendanceBulkBarProps {
  count: number;
  onMarkPresent: () => void;
  onMarkAbsent: () => void;
  onApproveLeave: () => void;
  onRejectLeave: () => void;
  onSendSms: () => void;
  onExport: () => void;
  onPrint: () => void;
  onClose: () => void;
}

const AttendanceBulkBar = ({
  count,
  onMarkPresent,
  onMarkAbsent,
  onApproveLeave,
  onRejectLeave,
  onSendSms,
  onExport,
  onPrint,
  onClose,
}: AttendanceBulkBarProps) => (
  <div className="bulk-bar" id="attBulk" role="region" aria-label="Bulk actions" hidden={count === 0}>
    <div className="bulk-bar-inner">
      <span className="bulk-bar-count">
        <b id="attCount">{count}</b> selected
      </span>
      <div className="d-flex flex-wrap gap-2">
        <button type="button" className="toolbar-button toolbar-button-sm" onClick={onMarkPresent}>
          <i className="ti ti-user-check" />
          Mark Present
        </button>
        <button type="button" className="toolbar-button toolbar-button-sm" onClick={onMarkAbsent}>
          <i className="ti ti-user-x" />
          Mark Absent
        </button>
        <button type="button" className="toolbar-button toolbar-button-sm" onClick={onApproveLeave}>
          <i className="ti ti-check" />
          Approve Leave
        </button>
        <button type="button" className="toolbar-button toolbar-button-sm" onClick={onRejectLeave}>
          <i className="ti ti-x" />
          Reject Leave
        </button>
        <button type="button" className="toolbar-button toolbar-button-sm" onClick={onSendSms}>
          <i className="ti ti-message" />
          Send SMS
        </button>
        <button type="button" className="toolbar-button toolbar-button-sm" onClick={onExport}>
          <i className="ti ti-download" />
          Export
        </button>
        <button type="button" className="toolbar-button toolbar-button-sm" onClick={onPrint}>
          <i className="ti ti-printer" />
          Print Register
        </button>
      </div>
      <button type="button" className="bulk-bar-close" aria-label="Clear selection" onClick={onClose}>
        <i className="ti ti-x" />
      </button>
    </div>
  </div>
);

export default AttendanceBulkBar;
