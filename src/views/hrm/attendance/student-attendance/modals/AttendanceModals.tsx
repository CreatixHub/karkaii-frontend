import { useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { ToastVariant } from '@hooks/useToasts';
import type { StudentAttendanceModalId } from '../data/attendanceRegister.data';
import {
  advancedAttendancePct,
  advancedHouses,
  advancedResidence,
  advancedTransport,
  bulkApplyStatuses,
  bulkClasses,
  bulkScopes,
  bulkSections,
  importConflictOptions,
  importSources,
  leaveModalLines,
  leaveModalStats,
  notifyAudiences,
  notifyChannels,
  notifyDefaultMessage,
  notifyModalStats,
  reportFormats,
  reportQuickActions,
  settingsModeOptions,
  settingsNotifyOptions,
  takeAttendanceClasses,
  takeAttendanceRows,
  takeAttendanceSections,
  takeAttendanceSessions,
} from '../data/attendanceModals.data';

type MarkState = 'present' | 'late' | 'absent';

export interface AttendanceModalsProps {
  active: StudentAttendanceModalId | null;
  onClose: () => void;
  onToast: (message: string, variant?: ToastVariant) => void;
}

const AttendanceModals = ({ active, onClose, onToast }: AttendanceModalsProps) => {
  const [marks, setMarks] = useState<MarkState[]>(takeAttendanceRows.map((row) => row.initial));
  const [bulkDate, setBulkDate] = useState('22-07-2025');
  const [reportFrom, setReportFrom] = useState('');
  const [reportTo, setReportTo] = useState('');
  const [notifyMessage, setNotifyMessage] = useState(notifyDefaultMessage);

  const submit = (message: string) => (event: React.FormEvent) => {
    event.preventDefault();
    onToast(message);
    onClose();
  };

  return (
    <>
      {/* ------------------------------ Take Attendance ----------------------------- */}
      <Modal
        open={active === 'att_take'}
        onClose={onClose}
        title="Take Attendance"
        titleIcon="ti ti-clipboard-check"
        dialogClassName="modal-lg modal-dialog-scrollable"
        contentClassName="student-attendance"
        footer={
          <>
            <button type="button" className="toolbar-button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="toolbar-button toolbar-button-primary"
              onClick={() => {
                onToast('Register submitted — guardians of absentees notified.');
                onClose();
              }}
            >
              <i className="ti ti-check" />
              Submit Register
            </button>
          </>
        }
      >
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <label className="sub-text d-block mb-1" htmlFor="att-take-class">
              Class
            </label>
            <select className="form-select" id="att-take-class">
              {takeAttendanceClasses.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="sub-text d-block mb-1" htmlFor="att-take-section">
              Section
            </label>
            <select className="form-select" id="att-take-section">
              {takeAttendanceSections.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="sub-text d-block mb-1" htmlFor="att-take-session">
              Session
            </label>
            <select className="form-select" id="att-take-session">
              {takeAttendanceSessions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
          <span className="sub-text">
            <b>5 students</b> in this section
          </span>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="toolbar-button toolbar-button-xs"
              onClick={() => {
                setMarks(takeAttendanceRows.map(() => 'present'));
                onToast('All students marked present.');
              }}
            >
              <i className="ti ti-checks" />
              All present
            </button>
            <button
              type="button"
              className="toolbar-button toolbar-button-xs"
              onClick={() => {
                setMarks(takeAttendanceRows.map((row) => row.initial));
                onToast('Register reset.', 'info');
              }}
            >
              <i className="ti ti-refresh" />
              Reset
            </button>
          </div>
        </div>
        <div className="attendance-mark">
          {takeAttendanceRows.map((row, index) => (
            <div className="attendance-mark-row" key={row.name}>
              <img src={row.img} alt="" />
              <span>
                <b>{row.name}</b>
                <em>{row.roll}</em>
              </span>
              <div className="toggle-switch" role="group" aria-label={`Status for ${row.name}`}>
                {(['present', 'late', 'absent'] as MarkState[]).map((state) => (
                  <button
                    key={state}
                    type="button"
                    className={marks[index] === state ? 'is-on' : undefined}
                    onClick={() =>
                      setMarks((current) => current.map((value, i) => (i === index ? state : value)))
                    }
                  >
                    {state === 'present' ? 'P' : state === 'late' ? 'L' : 'A'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="note-line is-info mt-3">
          <i className="ti ti-info-circle" />
          <span>Guardians of absent students are notified automatically once the register is submitted.</span>
        </div>
      </Modal>

      {/* -------------------------------- Bulk Attendance ------------------------------- */}
      <Modal
        open={active === 'att_bulk'}
        onClose={onClose}
        title="Bulk Attendance"
        titleIcon="ti ti-users-group"
        contentClassName="student-attendance"
        onSubmit={submit('Bulk attendance applied to 1,329 students.')}
        formClassName="validated-form"
      >
        <div className="row g-2">
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-bulk-scope">
              Scope
            </label>
            <select className="form-select" id="att-bulk-scope">
              {bulkScopes.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-bulk-date">
              Date
            </label>
            <DateField
              value={bulkDate}
              onChange={(dateString) => setBulkDate(dateString as string)}
              id="att-bulk-date"
            />
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-bulk-class">
              Class
            </label>
            <select className="form-select" id="att-bulk-class">
              {bulkClasses.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-bulk-section">
              Section
            </label>
            <select className="form-select" id="att-bulk-section">
              {bulkSections.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <label className="sub-text d-block mb-1 mt-2" htmlFor="att-bulk-status">
          Apply status
        </label>
        <select className="form-select mb-2" id="att-bulk-status">
          {bulkApplyStatuses.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="note-line is-warn">
          <i className="ti ti-alert-triangle" />
          <span>This overwrites any status already recorded for the selected date. Existing remarks are preserved.</span>
        </div>
        <div className="text-end mt-3">
          <button type="button" className="toolbar-button me-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="toolbar-button toolbar-button-primary submit-button">
            <i className="ti ti-check" />
            Apply
          </button>
        </div>
      </Modal>

      {/* --------------------------------- Import Attendance -------------------------------- */}
      <Modal
        open={active === 'att_import'}
        onClose={onClose}
        title="Import Attendance"
        titleIcon="ti ti-file-import"
        contentClassName="student-attendance"
        onSubmit={submit('File queued — 1,329 records validated.')}
        formClassName="validated-form"
      >
        <div className="inline-dropdown">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or biometric export here</b>
          <span>or click to browse · max 10 MB</span>
          <input type="file" aria-label="Attendance file" />
        </div>
        <label className="sub-text d-block mb-1 mt-3" htmlFor="att-import-source">
          Source
        </label>
        <select className="form-select mb-2" id="att-import-source">
          {importSources.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <label className="sub-text d-block mb-1" htmlFor="att-import-conflict">
          On conflict
        </label>
        <select className="form-select mb-2" id="att-import-conflict">
          {importConflictOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="note-line is-info">
          <i className="ti ti-download" />
          <span>
            Need the layout? <b>Download the template</b> with all required columns and sample rows.
          </span>
        </div>
        <div className="text-end mt-3">
          <button type="button" className="toolbar-button me-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="toolbar-button toolbar-button-primary submit-button">
            <i className="ti ti-upload" />
            Import
          </button>
        </div>
      </Modal>

      {/* -------------------------------- Attendance Reports ------------------------------- */}
      <Modal
        open={active === 'att_report'}
        onClose={onClose}
        title="Attendance Reports"
        titleIcon="ti ti-report-analytics"
        contentClassName="student-attendance"
        onSubmit={submit("Report is being generated — you'll get a download link.")}
        formClassName="validated-form"
      >
        <div className="row g-2 mb-3">
          {reportQuickActions.map((action) => (
            <div className="col-6" key={action.id}>
              <button
                type="button"
                className={`quick-actions is-${action.variant} w-100`}
                onClick={() => onToast('Preparing export…', 'info')}
              >
                <span className="ic">
                  <i className={action.icon} />
                </span>
                <b>{action.label}</b>
              </button>
            </div>
          ))}
        </div>
        <div className="row g-2">
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-report-from">
              From
            </label>
            <DateField
              value={reportFrom}
              onChange={(dateString) => setReportFrom(dateString as string)}
              id="att-report-from"
            />
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-report-to">
              To
            </label>
            <DateField
              value={reportTo}
              onChange={(dateString) => setReportTo(dateString as string)}
              id="att-report-to"
            />
          </div>
        </div>
        <label className="sub-text d-block mb-1 mt-2" htmlFor="att-report-format">
          Format
        </label>
        <select className="form-select mb-2" id="att-report-format">
          {reportFormats.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="text-end mt-3">
          <button type="button" className="toolbar-button me-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="toolbar-button toolbar-button-primary submit-button">
            <i className="ti ti-file-export" />
            Generate
          </button>
        </div>
      </Modal>

      {/* ---------------------------------- Leave Requests ---------------------------------- */}
      <Modal
        open={active === 'att_leave'}
        onClose={onClose}
        title="Leave Requests"
        titleIcon="ti ti-calendar-off"
        dialogClassName="modal-lg modal-dialog-scrollable"
        contentClassName="student-attendance"
        footer={
          <>
            <button type="button" className="toolbar-button" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="toolbar-button toolbar-button-primary"
              onClick={() => {
                onToast('All 18 leave requests approved.');
                onClose();
              }}
            >
              <i className="ti ti-checks" />
              Approve All (18)
            </button>
          </>
        }
      >
        <div className="row g-2 mb-3">
          {leaveModalStats.map((stat) => (
            <div className="col-4" key={stat.label}>
              <div className={`stat-fact is-${stat.variant}`}>
                <b>{stat.count}</b>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="detail-drawer-list">
          {leaveModalLines.map((line) => (
            <div className="detail-drawer-line" key={line.name}>
              <img src={line.img} alt="" />
              <span>
                <b>{line.name}</b>
                <em>{line.detail}</em>
              </span>
              {line.hasDoc ? (
                <button
                  type="button"
                  className="toolbar-icon-button"
                  aria-label="View certificate"
                  onClick={() => onToast('Opening the supporting document…', 'info')}
                >
                  <i className="ti ti-paperclip" />
                </button>
              ) : null}
              <span className="d-flex gap-1">
                <button
                  type="button"
                  className="toolbar-icon-button is-ok"
                  aria-label="Approve"
                  onClick={() => onToast('Leave request approved.')}
                >
                  <i className="ti ti-check" />
                </button>
                <button
                  type="button"
                  className="toolbar-icon-button is-no"
                  aria-label="Reject"
                  onClick={() => onToast('Leave request rejected.', 'warning')}
                >
                  <i className="ti ti-x" />
                </button>
              </span>
            </div>
          ))}
        </div>
      </Modal>

      {/* ---------------------------------- Notify Guardians --------------------------------- */}
      <Modal
        open={active === 'att_notify'}
        onClose={onClose}
        title="Notify Guardians"
        titleIcon="ti ti-message"
        contentClassName="student-attendance"
        onSubmit={submit('Notifications queued for 12 guardians.')}
        formClassName="validated-form"
      >
        <div className="row g-2 mb-3">
          {notifyModalStats.map((stat) => (
            <div className="col-4" key={stat.label}>
              <div className={`stat-fact is-${stat.variant}`}>
                <b>{stat.count}</b>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
        <label className="sub-text d-block mb-1" htmlFor="att-notify-audience">
          Audience
        </label>
        <select className="form-select mb-2" id="att-notify-audience">
          {notifyAudiences.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <label className="sub-text d-block mb-1" htmlFor="att-notify-channels">
          Channels
        </label>
        <select className="form-select mb-2" id="att-notify-channels">
          {notifyChannels.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <label className="sub-text d-block mb-1" htmlFor="att-notify-message">
          Message
        </label>
        <textarea
          className="form-control"
          rows={3}
          required
          id="att-notify-message"
          value={notifyMessage}
          onChange={(event) => setNotifyMessage(event.target.value)}
        />
        <div className="note-line is-info mt-3">
          <i className="ti ti-clock" />
          <span>
            Response rates are highest before <b>10:00</b>. Sending now reaches guardians inside that window.
          </span>
        </div>
        <div className="text-end mt-3">
          <button type="button" className="toolbar-button me-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="toolbar-button toolbar-button-primary submit-button">
            <i className="ti ti-send" />
            Send
          </button>
        </div>
      </Modal>

      {/* --------------------------------- Advanced Filters --------------------------------- */}
      <Modal
        open={active === 'att_advanced'}
        onClose={onClose}
        title="Advanced Filters"
        titleIcon="ti ti-adjustments-alt"
        contentClassName="student-attendance"
        onSubmit={submit('Filters applied.')}
        formClassName="validated-form"
      >
        <div className="row g-2">
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-adv-house">
              House
            </label>
            <select className="form-select" id="att-adv-house">
              {advancedHouses.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-adv-transport">
              Transport
            </label>
            <select className="form-select" id="att-adv-transport">
              {advancedTransport.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-adv-residence">
              Residence
            </label>
            <select className="form-select" id="att-adv-residence">
              {advancedResidence.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-adv-pct">
              Attendance %
            </label>
            <select className="form-select" id="att-adv-pct">
              {advancedAttendancePct.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-adv-late-from">
              Late count from
            </label>
            <input type="text" className="form-control" placeholder="0" id="att-adv-late-from" />
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-adv-late-to">
              Late count to
            </label>
            <input type="text" className="form-control" placeholder="20" id="att-adv-late-to" />
          </div>
        </div>
        <div className="text-end mt-3">
          <button
            type="button"
            className="toolbar-button me-1"
            onClick={() => {
              onToast('All filters cleared.');
              onClose();
            }}
          >
            Reset
          </button>
          <button type="submit" className="toolbar-button toolbar-button-primary submit-button">
            <i className="ti ti-filter" />
            Apply Filters
          </button>
        </div>
      </Modal>

      {/* -------------------------------- Attendance Settings -------------------------------- */}
      <Modal
        open={active === 'att_settings'}
        onClose={onClose}
        title="Attendance Settings"
        titleIcon="ti ti-settings"
        contentClassName="student-attendance"
        onSubmit={submit('Attendance settings saved.')}
        formClassName="validated-form"
      >
        <div className="row g-2">
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-set-start">
              School start
            </label>
            <input type="time" className="form-control" defaultValue="08:15" required id="att-set-start" />
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-set-late-after">
              Late after
            </label>
            <input type="time" className="form-control" defaultValue="08:30" required id="att-set-late-after" />
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-set-half-day">
              Half-day cutoff
            </label>
            <input type="time" className="form-control" defaultValue="12:00" id="att-set-half-day" />
          </div>
          <div className="col-6">
            <label className="sub-text d-block mb-1" htmlFor="att-set-min-pct">
              Minimum attendance %
            </label>
            <input type="text" className="form-control" defaultValue="75" id="att-set-min-pct" />
          </div>
        </div>
        <label className="sub-text d-block mb-1 mt-2" htmlFor="att-set-notify">
          Auto-notify guardians
        </label>
        <select className="form-select mb-2" id="att-set-notify">
          {settingsNotifyOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <label className="sub-text d-block mb-1" htmlFor="att-set-mode">
          Attendance mode
        </label>
        <select className="form-select mb-2" id="att-set-mode">
          {settingsModeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="note-line is-info mt-2">
          <i className="ti ti-info-circle" />
          <span>Changes apply from the next session. Historical records are never recalculated.</span>
        </div>
        <div className="text-end mt-3">
          <button type="button" className="toolbar-button me-1" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="toolbar-button toolbar-button-primary submit-button">
            <i className="ti ti-check" />
            Save Settings
          </button>
        </div>
      </Modal>
    </>
  );
};

export default AttendanceModals;
