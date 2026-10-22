import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { PayrollRow, PayrollStatus } from '../data/employeePayroll.data';
import {
  componentsOf,
  grossSalary,
  money,
  netSalary,
  statusBadge,
} from '../data/employeePayroll.data';

export type PayrollModalId =
  | 'process_payroll'
  | 'edit_payroll'
  | 'payroll_breakdown'
  | 'salary_structure'
  | 'payroll_history'
  | 'approve_payroll'
  | 'generate_payslip'
  | 'delete';

export interface PayrollDraft {
  basic: string;
  allowances: string;
  deductions: string;
  bonus: string;
  method: string;
  status: PayrollStatus;
}

export interface PayrollModalsProps {
  active: PayrollModalId | null;
  row: PayrollRow | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onSave: (draft: PayrollDraft) => void;
  onSetStatus: (status: PayrollStatus, message: string) => void;
  onConfirmDelete: () => void;
}

const Identity = ({ row, subtitle }: { row: PayrollRow; subtitle: string }) => (
  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
    <span className="avatar avatar-lg me-3">
      <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
    </span>
    <div>
      <div className="d-flex align-items-center gap-2">
        <h5 className="mb-0">{row.name}</h5>
        <span className="badge bg-primary-transparent text-primary">{row.id}</span>
        <span className={statusBadge[row.status]}>{row.status}</span>
      </div>
      <p className="mb-0 text-muted fs-13">{subtitle}</p>
    </div>
  </div>
);

const PayrollModals = ({
  active,
  row,
  onClose,
  onToast,
  onSave,
  onSetStatus,
  onConfirmDelete,
}: PayrollModalsProps) => {
  const [draft, setDraft] = useState<PayrollDraft>({
    basic: '',
    allowances: '',
    deductions: '',
    bonus: '',
    method: 'Bank Transfer',
    status: 'Pending',
  });

  useEffect(() => {
    if (active === 'edit_payroll' && row) {
      setDraft({
        basic: String(row.basic),
        allowances: String(row.allowances),
        deductions: String(row.deductions),
        bonus: String(row.bonus),
        method: row.method.label,
        status: row.status,
      });
    }
  }, [active, row]);

  const subtitle = row ? `${row.designation} · ${row.department} · ${row.month}` : '';
  const closeFooter = (extra?: React.ReactNode) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Close
      </button>
      {extra}
    </>
  );

  const confirmDialog = (
    id: PayrollModalId,
    title: string,
    icon: string,
    tone: string,
    copy: string,
    cta: string,
    status: PayrollStatus,
    toast: string,
  ) => (
    <Modal
      open={active === id && row !== null}
      onClose={onClose}
      title={title}
      onSubmit={(event) => {
        event.preventDefault();
        onSetStatus(status, toast);
      }}
      footer={
        <>
          <button type="button" className="btn btn-light me-2" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={`btn btn-${tone}`}>
            {cta}
          </button>
        </>
      }
    >
      {row ? (
        <div className="text-center">
          <span className={`avatar avatar-xl bg-${tone}-transparent text-${tone} rounded-circle mb-3`}>
            <i className={`${icon} fs-24`} />
          </span>
          <h5 className="mb-1">{row.name}</h5>
          <p className="text-muted fs-13 mb-0">{copy}</p>
        </div>
      ) : null}
    </Modal>
  );

  return (
    <>
      {confirmDialog(
        'process_payroll',
        'Process Payroll',
        'ti ti-player-play',
        'primary',
        `Process the ${row?.month ?? ''} payroll run for this employee.`,
        'Process',
        'Processing',
        'Payroll processing started',
      )}

      {confirmDialog(
        'approve_payroll',
        'Approve Payroll',
        'ti ti-circle-check',
        'success',
        'Approving releases this payroll for payment.',
        'Approve',
        'Approved',
        'Payroll approved',
      )}

      {confirmDialog(
        'generate_payslip',
        'Generate Payslip',
        'ti ti-file-text',
        'primary',
        'Generate and mark this payslip as paid.',
        'Generate',
        'Paid',
        'Payslip generated',
      )}

      {/* Edit Payroll */}
      <Modal
        open={active === 'edit_payroll' && row !== null}
        onClose={onClose}
        title="Edit Payroll"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(draft);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <div className="row">
          {(
            [
              ['basic', 'Basic Salary'],
              ['allowances', 'Allowances'],
              ['deductions', 'Deductions'],
              ['bonus', 'Bonus'],
            ] as const
          ).map(([key, label]) => (
            <div className="col-md-6" key={key}>
              <div className="mb-3">
                <label className="form-label" htmlFor={`ep-${key}`}>
                  {label}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`ep-${key}`}
                  value={draft[key]}
                  onChange={(event) => setDraft((c) => ({ ...c, [key]: event.target.value }))}
                />
              </div>
            </div>
          ))}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="ep-method">
                Payment Method
              </label>
              <select
                className="form-select"
                id="ep-method"
                value={draft.method}
                onChange={(event) => setDraft((c) => ({ ...c, method: event.target.value }))}
              >
                {['Bank Transfer', 'Cheque', 'Cash', 'UPI'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-0">
              <label className="form-label" htmlFor="ep-status">
                Payroll Status
              </label>
              <select
                className="form-select"
                id="ep-status"
                value={draft.status}
                onChange={(event) => setDraft((c) => ({ ...c, status: event.target.value as PayrollStatus }))}
              >
                {['Paid', 'Approved', 'Processing', 'Pending', 'On Hold', 'Unpaid'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Payroll Breakdown */}
      <Modal
        open={active === 'payroll_breakdown' && row !== null}
        onClose={onClose}
        title="Payroll Breakdown"
        dialogClassName="modal-lg"
        footer={closeFooter()}
      >
        {row ? (
          <>
            <Identity row={row} subtitle={subtitle} />
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Component</th>
                    <th>Type</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {componentsOf(row).map((item) => (
                    <tr key={item.label}>
                      <td>{item.label}</td>
                      <td>
                        <span
                          className={`badge badge-soft-${item.type === 'Earning' ? 'success' : 'danger'}`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="text-end">{money(item.amount)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="fw-medium">Net Salary</td>
                    <td />
                    <td className="text-end fw-medium">{money(netSalary(row))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Salary Structure */}
      <Modal
        open={active === 'salary_structure' && row !== null}
        onClose={onClose}
        title="Salary Structure"
        dialogClassName="modal-lg"
        footer={closeFooter()}
      >
        {row ? (
          <>
            <Identity row={row} subtitle={subtitle} />
            <div className="row g-3">
              {[
                { label: 'Basic Salary', value: money(row.basic) },
                { label: 'Allowances', value: money(row.allowances) },
                { label: 'Bonus', value: money(row.bonus) },
                { label: 'Gross', value: money(grossSalary(row)) },
                { label: 'Deductions', value: money(row.deductions) },
                { label: 'Net Salary', value: money(netSalary(row)) },
              ].map((tile) => (
                <div className="col-6 col-md-4" key={tile.label}>
                  <div className="border rounded p-3 text-center h-100">
                    <p className="fs-12 text-muted mb-1">{tile.label}</p>
                    <h6 className="mb-0">{tile.value}</h6>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Modal>

      {/* Payroll History */}
      <Modal
        open={active === 'payroll_history' && row !== null}
        onClose={onClose}
        title="Payroll History"
        dialogClassName="modal-lg"
        footer={closeFooter(
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onToast('Payroll history export started');
              onClose();
            }}
          >
            <i className="ti ti-download me-1" />
            Export
          </button>,
        )}
      >
        {row ? (
          <>
            <Identity row={row} subtitle={`${row.id} · ${row.designation}`} />
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Month</th>
                    <th className="text-end">Net Salary</th>
                    <th>Method</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {['Jul 2026', 'Jun 2026', 'May 2026', 'Apr 2026'].map((month, index) => {
                    const net = Math.round(netSalary(row) * (1 - index * 0.02));
                    return (
                      <tr key={month}>
                        <td>{month}</td>
                        <td className="text-end">{money(net)}</td>
                        <td>{row.method.label}</td>
                        <td>{index === 0 ? row.paymentDate : `28 ${month.split(' ')[0]} 2026`}</td>
                        <td>
                          <span className={index === 0 ? statusBadge[row.status] : 'badge badge-soft-success'}>
                            {index === 0 ? row.status : 'Paid'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
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
        <p>You want to delete this payroll record, this cant be undone once you delete.</p>
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

export default PayrollModals;
