import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { LeaveRequest } from '../data/leaves.data';
import {
  balancesFor,
  historyFor,
  leaveTypeOptions,
  statusBadge,
} from '../data/leaves.data';

export type LeaveModalId =
  | 'add'
  | 'edit'
  | 'view'
  | 'approve'
  | 'reject'
  | 'history'
  | 'attachment'
  | 'import'
  | 'delete';

export interface LeaveDraft {
  name: string;
  leaveType: string;
  from: string;
  to: string;
  days: string;
  reason: string;
}

export const emptyDraft: LeaveDraft = {
  name: '',
  leaveType: leaveTypeOptions[0],
  from: '',
  to: '',
  days: '',
  reason: '',
};

export interface LeaveModalsProps {
  active: LeaveModalId | null;
  row: LeaveRequest | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onCreate: (draft: LeaveDraft) => void;
  onUpdate: (draft: LeaveDraft) => void;
  onApprove: (note: string) => void;
  onReject: (reason: string) => void;
  onConfirmDelete: () => void;
}

const Identity = ({ row }: { row: LeaveRequest }) => (
  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
    <span className="avatar avatar-lg me-3">
      <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
    </span>
    <div>
      <div className="d-flex align-items-center gap-2">
        <h5 className="mb-0">{row.name}</h5>
        <span className="badge bg-primary-transparent text-primary">{row.staffId}</span>
        <span className={statusBadge[row.status]}>{row.status}</span>
      </div>
      <p className="mb-0 text-muted fs-13">
        {row.designation} · {row.department} · {row.branch}
      </p>
    </div>
  </div>
);

const LeaveForm = ({
  draft,
  onChange,
  suffix,
}: {
  draft: LeaveDraft;
  onChange: (patch: Partial<LeaveDraft>) => void;
  suffix: string;
}) => (
  <div className="row">
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`lv-name${suffix}`}>
          Employee
        </label>
        <input
          type="text"
          className="form-control"
          id={`lv-name${suffix}`}
          value={draft.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`lv-type${suffix}`}>
          Leave Type
        </label>
        <select
          className="form-select"
          id={`lv-type${suffix}`}
          value={draft.leaveType}
          onChange={(event) => onChange({ leaveType: event.target.value })}
        >
          {leaveTypeOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-4">
      <div className="mb-3">
        <label className="form-label" htmlFor={`lv-from${suffix}`}>
          From Date
        </label>
        <input
          type="text"
          className="form-control datetimepicker"
          id={`lv-from${suffix}`}
          value={draft.from}
          onChange={(event) => onChange({ from: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="mb-3">
        <label className="form-label" htmlFor={`lv-to${suffix}`}>
          To Date
        </label>
        <input
          type="text"
          className="form-control datetimepicker"
          id={`lv-to${suffix}`}
          value={draft.to}
          onChange={(event) => onChange({ to: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-4">
      <div className="mb-3">
        <label className="form-label" htmlFor={`lv-days${suffix}`}>
          No of Days
        </label>
        <input
          type="text"
          className="form-control"
          id={`lv-days${suffix}`}
          value={draft.days}
          onChange={(event) => onChange({ days: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-12">
      <div className="mb-0">
        <label className="form-label" htmlFor={`lv-reason${suffix}`}>
          Reason
        </label>
        <textarea
          className="form-control"
          rows={3}
          id={`lv-reason${suffix}`}
          value={draft.reason}
          onChange={(event) => onChange({ reason: event.target.value })}
        />
      </div>
    </div>
  </div>
);

const LeaveModals = ({
  active,
  row,
  onClose,
  onToast,
  onCreate,
  onUpdate,
  onApprove,
  onReject,
  onConfirmDelete,
}: LeaveModalsProps) => {
  const [addDraft, setAddDraft] = useState<LeaveDraft>(emptyDraft);
  const [editDraft, setEditDraft] = useState<LeaveDraft>(emptyDraft);
  const [note, setNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (active === 'add') setAddDraft(emptyDraft);
    if (active === 'approve') setNote('');
    if (active === 'reject') setRejectReason('');
    if (active === 'edit' && row) {
      setEditDraft({
        name: row.name,
        leaveType: row.leaveType,
        from: row.from,
        to: row.to,
        days: String(row.days),
        reason: row.reason,
      });
    }
  }, [active, row]);

  const formFooter = (label: string) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        {label}
      </button>
    </>
  );

  return (
    <>
      {/* Add Leaves */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Leave"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(addDraft);
        }}
        footer={formFooter('Add Leave')}
      >
        <LeaveForm draft={addDraft} onChange={(p) => setAddDraft((c) => ({ ...c, ...p }))} suffix="" />
      </Modal>

      {/* Edit Leaves */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Leave"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdate(editDraft);
        }}
        footer={formFooter('Save Changes')}
      >
        <LeaveForm draft={editDraft} onChange={(p) => setEditDraft((c) => ({ ...c, ...p }))} suffix="-2" />
      </Modal>

      {/* Leave Request Details */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Leave Request Details"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
        }
      >
        {row ? (
          <>
            <Identity row={row} />
            <div className="row mb-3">
              <div className="col-md-6">
                <ul className="list-unstyled mb-0">
                  {[
                    { label: 'Leave Type', value: row.leaveType },
                    { label: 'From', value: row.from },
                    { label: 'To', value: row.to },
                    { label: 'No of Days', value: `${row.days} ${row.days === 1 ? 'day' : 'days'}` },
                  ].map((item, index, arr) => (
                    <li
                      className={`d-flex justify-content-between py-1 fs-13${index === arr.length - 1 ? '' : ' border-bottom'}`}
                      key={item.label}
                    >
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled mb-0">
                  {[
                    { label: 'Applied On', value: row.applied },
                    { label: 'Approver', value: row.approver },
                    { label: 'Branch', value: row.branch },
                    { label: 'Attachment', value: row.hasAttachment ? 'leave-note.pdf' : 'No attachments' },
                  ].map((item, index, arr) => (
                    <li
                      className={`d-flex justify-content-between py-1 fs-13${index === arr.length - 1 ? '' : ' border-bottom'}`}
                      key={item.label}
                    >
                      <span className="text-muted">{item.label}</span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <h6 className="fs-13 mb-2">Reason</h6>
            <p className="fs-13 text-muted mb-0">{row.reason}</p>
          </>
        ) : null}
      </Modal>

      {/* Leave Approval */}
      <Modal
        open={active === 'approve' && row !== null}
        onClose={onClose}
        title="Leave Approval"
        onSubmit={(event) => {
          event.preventDefault();
          onApprove(note);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success">
              <i className="ti ti-circle-check me-1" />
              Approve
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-13 mb-3">
              Approve <span className="fw-medium">{row.name}</span>&apos;s {row.leaveType} from{' '}
              <span className="fw-medium">{row.from}</span> to <span className="fw-medium">{row.to}</span>?
            </p>
            <div className="mb-0">
              <label className="form-label" htmlFor="approve-note">
                Approver Note
              </label>
              <textarea
                className="form-control"
                rows={3}
                id="approve-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Leave Rejection */}
      <Modal
        open={active === 'reject' && row !== null}
        onClose={onClose}
        title="Leave Rejection"
        onSubmit={(event) => {
          event.preventDefault();
          onReject(rejectReason);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              <i className="ti ti-circle-x me-1" />
              Reject
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-13 mb-3">
              Reject <span className="fw-medium">{row.name}</span>&apos;s {row.leaveType} request?
            </p>
            <div className="mb-0">
              <label className="form-label" htmlFor="reject-reason">
                Reason for Rejection
              </label>
              <textarea
                className="form-control"
                rows={3}
                id="reject-reason"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Employee Leave History */}
      <Modal
        open={active === 'history' && row !== null}
        onClose={onClose}
        title="Employee Leave History"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onToast('Leave history export started');
                onClose();
              }}
            >
              <i className="ti ti-download me-1" />
              Export
            </button>
          </>
        }
      >
        {row ? (
          <>
            <Identity row={row} />
            <h6 className="fs-13 mb-2">Leave Balance</h6>
            <div className="table-responsive mb-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th className="text-end">Total</th>
                    <th className="text-end">Used</th>
                    <th className="text-end">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {balancesFor(row).map((balance) => (
                    <tr key={balance.type}>
                      <td>{balance.type}</td>
                      <td className="text-end">{balance.total}</td>
                      <td className="text-end">{balance.used}</td>
                      <td className="text-end fw-medium">{balance.total - balance.used}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h6 className="fs-13 mb-2">Recent Requests</h6>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Approver</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyFor(row).map((entry, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <tr key={index}>
                      <td>{entry.type}</td>
                      <td>{entry.from}</td>
                      <td>{entry.to}</td>
                      <td>{entry.days}</td>
                      <td>{entry.approver}</td>
                      <td>
                        <span className={statusBadge[entry.status]}>{entry.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Attachment Preview */}
      <Modal
        open={active === 'attachment' && row !== null}
        onClose={onClose}
        title="Attachment Preview"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onToast('Attachment download started');
                onClose();
              }}
            >
              <i className="ti ti-download me-1" />
              Download
            </button>
          </>
        }
      >
        {row?.hasAttachment ? (
          <div className="d-flex align-items-center justify-content-between border rounded p-3">
            <div className="d-flex align-items-center gap-2">
              <span className="avatar avatar-lg bg-danger-transparent text-danger rounded d-inline-flex align-items-center justify-content-center">
                <i className="ti ti-file-type-pdf fs-24" />
              </span>
              <div>
                <span className="fw-medium d-block fs-13">leave-note.pdf</span>
                <span className="fs-12 text-muted">Uploaded {row.applied} · 96 KB</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="fs-13 text-muted mb-0">No attachments were uploaded with this request.</p>
        )}
      </Modal>

      {/* Import Leaves */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Leaves"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Leave records imported.');
          onClose();
        }}
        footer={formFooter('Import')}
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Leave file" />
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0" role="note">
          <i className="ti ti-info-circle fs-16" />
          <span className="fs-12">
            Rows must carry an employee id, leave type, from and to dates. Existing requests are matched by id.
          </span>
        </div>
      </Modal>

      {/* Confirm Deletion */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirmDelete();
        }}
      >
        <span className="delete-icon">
          <i className="ti ti-trash-x" />
        </span>
        <h4>Confirm Deletion</h4>
        <p>You want to delete this leave request, this cant be undone once you delete.</p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-danger">
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default LeaveModals;
