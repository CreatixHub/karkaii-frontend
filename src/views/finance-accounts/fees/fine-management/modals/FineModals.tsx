import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Fine } from '../data/fines.data';
import { fineCategories, money, outstanding, statusBadge } from '../data/fines.data';

export type FineModalId = 'add' | 'edit' | 'payment' | 'view' | 'waive';

export interface FineDraft {
  student: string;
  category: string;
  amount: string;
  dueDate: string;
  remarks: string;
}

export const emptyDraft: FineDraft = {
  student: '',
  category: fineCategories[0].label,
  amount: '',
  dueDate: '',
  remarks: '',
};

export interface FineModalsProps {
  active: FineModalId | null;
  row: Fine | null;
  onClose: () => void;
  onCreate: (draft: FineDraft) => void;
  onUpdate: (draft: FineDraft) => void;
  onRecordPayment: (amount: number, method: string) => void;
  onWaive: (reason: string) => void;
}

const FineForm = ({
  draft,
  onChange,
  suffix,
}: {
  draft: FineDraft;
  onChange: (patch: Partial<FineDraft>) => void;
  suffix: string;
}) => (
  <div className="row">
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`fn-student${suffix}`}>
          Student
        </label>
        <input
          type="text"
          className="form-control"
          id={`fn-student${suffix}`}
          value={draft.student}
          onChange={(event) => onChange({ student: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`fn-category${suffix}`}>
          Fine Category
        </label>
        <select
          className="form-select"
          id={`fn-category${suffix}`}
          value={draft.category}
          onChange={(event) => onChange({ category: event.target.value })}
        >
          {fineCategories.map((category) => (
            <option key={category.id}>{category.label}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`fn-amount${suffix}`}>
          Fine Amount
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="0.00"
          id={`fn-amount${suffix}`}
          value={draft.amount}
          onChange={(event) => onChange({ amount: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`fn-due${suffix}`}>
          Due Date
        </label>
        <input
          type="text"
          className="form-control datetimepicker"
          placeholder="05 Aug 2026"
          id={`fn-due${suffix}`}
          value={draft.dueDate}
          onChange={(event) => onChange({ dueDate: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-12">
      <div className="mb-0">
        <label className="form-label" htmlFor={`fn-remarks${suffix}`}>
          Reason / Remarks
        </label>
        <textarea
          className="form-control"
          rows={3}
          id={`fn-remarks${suffix}`}
          value={draft.remarks}
          onChange={(event) => onChange({ remarks: event.target.value })}
        />
      </div>
    </div>
  </div>
);

const FineModals = ({
  active,
  row,
  onClose,
  onCreate,
  onUpdate,
  onRecordPayment,
  onWaive,
}: FineModalsProps) => {
  const [addDraft, setAddDraft] = useState<FineDraft>(emptyDraft);
  const [editDraft, setEditDraft] = useState<FineDraft>(emptyDraft);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [waiveReason, setWaiveReason] = useState('');

  useEffect(() => {
    if (active === 'add') setAddDraft(emptyDraft);
    if (active === 'waive') setWaiveReason('');
    if (active === 'payment' && row) {
      setAmount(String(outstanding(row)));
      setMethod('Cash');
    }
    if (active === 'edit' && row) {
      setEditDraft({
        student: row.student,
        category: row.category,
        amount: String(row.amount),
        dueDate: row.dueDate,
        remarks: row.remarks,
      });
    }
  }, [active, row]);

  const formFooter = (label: string, tone = 'primary') => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" className={`btn btn-${tone}`}>
        {label}
      </button>
    </>
  );

  return (
    <>
      {/* Add Fine */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Fine"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(addDraft);
        }}
        footer={formFooter('Add Fine')}
      >
        <FineForm draft={addDraft} onChange={(p) => setAddDraft((c) => ({ ...c, ...p }))} suffix="" />
      </Modal>

      {/* Edit Fine */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Fine"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdate(editDraft);
        }}
        footer={formFooter('Save Changes')}
      >
        <FineForm draft={editDraft} onChange={(p) => setEditDraft((c) => ({ ...c, ...p }))} suffix="-2" />
      </Modal>

      {/* View Fine */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Fine Details"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className="avatar avatar-lg me-3">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{row.student}</h5>
                  <span className="badge bg-primary-transparent text-primary">{row.fineId}</span>
                  <span className={statusBadge[row.status]}>{row.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">
                  {row.className} · {row.category} · issued {row.issuedOn}
                </p>
              </div>
            </div>
            <div className="row">
              {[
                [
                  { label: 'Fine Amount', value: money(row.amount) },
                  { label: 'Outstanding', value: money(outstanding(row)) },
                  { label: 'Due Date', value: row.dueDate },
                  { label: 'Receipt No', value: row.receiptNo },
                ],
                [
                  { label: 'Issued By', value: `${row.createdBy} (${row.createdByRole})` },
                  { label: 'Payment Mode', value: row.paymentMode },
                  { label: 'Guardian', value: row.guardian },
                  { label: 'Contact', value: row.contact },
                ],
              ].map((group, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="col-md-6" key={index}>
                  <ul className="list-unstyled mb-0">
                    {group.map((item, position) => (
                      <li
                        className={`d-flex justify-content-between py-1 fs-13${position === group.length - 1 ? '' : ' border-bottom'}`}
                        key={item.label}
                      >
                        <span className="text-muted">{item.label}</span>
                        <span className="text-dark">{item.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </Modal>

      {/* Record Payment */}
      <Modal
        open={active === 'payment' && row !== null}
        onClose={onClose}
        title="Record Payment"
        onSubmit={(event) => {
          event.preventDefault();
          onRecordPayment(Number(amount.replace(/[^0-9.]/g, '')) || 0, method);
        }}
        footer={formFooter('Record Payment')}
      >
        {row ? (
          <>
            <p className="fs-13 mb-3">
              Outstanding on <span className="fw-medium">{row.fineId}</span> is{' '}
              <span className="fw-medium">{money(outstanding(row))}</span>.
            </p>
            <div className="mb-3">
              <label className="form-label" htmlFor="fn-pay-amount">
                Amount
              </label>
              <input
                type="text"
                className="form-control"
                id="fn-pay-amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="fn-pay-method">
                Payment Mode
              </label>
              <select
                className="form-select"
                id="fn-pay-method"
                value={method}
                onChange={(event) => setMethod(event.target.value)}
              >
                {['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Waive Fine */}
      <Modal
        open={active === 'waive' && row !== null}
        onClose={onClose}
        title="Waive Fine"
        onSubmit={(event) => {
          event.preventDefault();
          onWaive(waiveReason);
        }}
        footer={formFooter('Waive Fine', 'warning')}
      >
        {row ? (
          <>
            <p className="fs-13 mb-3">
              Waive the full <span className="fw-medium">{money(outstanding(row))}</span> outstanding on{' '}
              <span className="fw-medium">{row.fineId}</span> for {row.student}?
            </p>
            <div className="mb-0">
              <label className="form-label" htmlFor="fn-waive-reason">
                Approval Note
              </label>
              <textarea
                className="form-control"
                rows={3}
                id="fn-waive-reason"
                value={waiveReason}
                onChange={(event) => setWaiveReason(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default FineModals;
