import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import type { BankTxn, ReconStatus } from '../data/bankTransactions.data';
import { accountOptions, money, statusBadge, txnType } from '../data/bankTransactions.data';

export type TxnModalId = 'add' | 'edit' | 'view' | 'import' | 'reconcile';

export interface TxnDraft {
  description: string;
  account: string;
  type: 'Credit' | 'Debit';
  amount: string;
  reference: string;
  method: string;
  date: string;
}

export const emptyDraft: TxnDraft = {
  description: '',
  account: accountOptions[0],
  type: 'Credit',
  amount: '',
  reference: '',
  method: 'Bank Transfer',
  date: '',
};

export interface TransactionModalsProps {
  active: TxnModalId | null;
  row: BankTxn | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onCreate: (draft: TxnDraft) => void;
  onUpdate: (draft: TxnDraft) => void;
  onReconcile: (status: ReconStatus, note: string) => void;
}

const TxnForm = ({
  draft,
  onChange,
  suffix,
}: {
  draft: TxnDraft;
  onChange: (patch: Partial<TxnDraft>) => void;
  suffix: string;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`bt-desc${suffix}`}>
          Description
        </label>
        <input
          type="text"
          className="form-control"
          id={`bt-desc${suffix}`}
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`bt-account${suffix}`}>
          Bank Account
        </label>
        <select
          className="form-select"
          id={`bt-account${suffix}`}
          value={draft.account}
          onChange={(event) => onChange({ account: event.target.value })}
        >
          {accountOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`bt-type${suffix}`}>
          Transaction Type
        </label>
        <select
          className="form-select"
          id={`bt-type${suffix}`}
          value={draft.type}
          onChange={(event) => onChange({ type: event.target.value as 'Credit' | 'Debit' })}
        >
          <option>Credit</option>
          <option>Debit</option>
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`bt-amount${suffix}`}>
          Amount
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="0.00"
          id={`bt-amount${suffix}`}
          value={draft.amount}
          onChange={(event) => onChange({ amount: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`bt-method${suffix}`}>
          Payment Method
        </label>
        <select
          className="form-select"
          id={`bt-method${suffix}`}
          value={draft.method}
          onChange={(event) => onChange({ method: event.target.value })}
        >
          {['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Online', 'Auto Debit', 'Bulk Transfer'].map(
            (option) => (
              <option key={option}>{option}</option>
            ),
          )}
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`bt-ref${suffix}`}>
          Reference No.
        </label>
        <input
          type="text"
          className="form-control"
          id={`bt-ref${suffix}`}
          value={draft.reference}
          onChange={(event) => onChange({ reference: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-0">
        <label className="form-label" htmlFor={`bt-date${suffix}`}>
          Transaction Date
        </label>
        <input
          type="text"
          className="form-control datetimepicker"
          placeholder="30 Jul 2026"
          id={`bt-date${suffix}`}
          value={draft.date}
          onChange={(event) => onChange({ date: event.target.value })}
        />
      </div>
    </div>
  </div>
);

const TransactionModals = ({
  active,
  row,
  onClose,
  onToast,
  onCreate,
  onUpdate,
  onReconcile,
}: TransactionModalsProps) => {
  const [addDraft, setAddDraft] = useState<TxnDraft>(emptyDraft);
  const [editDraft, setEditDraft] = useState<TxnDraft>(emptyDraft);
  const [status, setStatus] = useState<ReconStatus>('Reconciled');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (active === 'add') setAddDraft(emptyDraft);
    if (active === 'reconcile' && row) {
      setStatus('Reconciled');
      setNote('');
    }
    if (active === 'edit' && row) {
      setEditDraft({
        description: row.description,
        account: `${row.account} · ${row.accountMask.replace(/[^0-9]/g, '')}`,
        type: txnType(row),
        amount: String(Math.abs(row.amount)),
        reference: row.referenceNo,
        method: row.paymentMethod,
        date: row.date,
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
      {/* Add Transaction */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Transaction"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(addDraft);
        }}
        footer={formFooter('Add Transaction')}
      >
        <TxnForm draft={addDraft} onChange={(p) => setAddDraft((c) => ({ ...c, ...p }))} suffix="" />
      </Modal>

      {/* Edit Transaction */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Transaction"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdate(editDraft);
        }}
        footer={formFooter('Save Changes')}
      >
        <TxnForm draft={editDraft} onChange={(p) => setEditDraft((c) => ({ ...c, ...p }))} suffix="-2" />
      </Modal>

      {/* View Transaction */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Transaction Details"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{row.txnId}</h5>
                  <span className={statusBadge[row.status]}>{row.status}</span>
                </div>
                <p className="mb-0 text-muted fs-13">
                  {row.description} · {row.date} {row.time}
                </p>
              </div>
              <h5 className={`mb-0 ${txnType(row) === 'Credit' ? 'text-success' : 'text-danger'}`}>
                {txnType(row) === 'Credit' ? '+' : '−'}
                {money(row.amount)}
              </h5>
            </div>
            <div className="row">
              {[row.details, row.bankReference].map((group, index) => (
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

      {/* Import Bank Statement */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Bank Statement"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Bank statement imported.');
          onClose();
        }}
        footer={formFooter('Import')}
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your statement file here</b>
          <span className="fs-12 text-muted">CSV, Excel or MT940 · max 10 MB</span>
          <input type="file" aria-label="Statement file" />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="bt-import-account">
            Bank Account
          </label>
          <select className="form-select" id="bt-import-account" defaultValue={accountOptions[0]}>
            {accountOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Reconcile Transaction */}
      <Modal
        open={active === 'reconcile' && row !== null}
        onClose={onClose}
        title="Reconcile Transaction"
        onSubmit={(event) => {
          event.preventDefault();
          onReconcile(status, note);
        }}
        footer={formFooter('Reconcile')}
      >
        {row ? (
          <>
            <p className="fs-13 mb-3">
              <span className="fw-medium">{row.txnId}</span> · {row.description} ·{' '}
              <span className="fw-medium">{money(row.amount)}</span>
            </p>
            <div className="mb-3">
              <label className="form-label" htmlFor="bt-recon-status">
                Reconciliation Status
              </label>
              <select
                className="form-select"
                id="bt-recon-status"
                value={status}
                onChange={(event) => setStatus(event.target.value as ReconStatus)}
              >
                {['Reconciled', 'Pending', 'In Clearing', 'Unmatched'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="bt-recon-note">
                Note
              </label>
              <textarea
                className="form-control"
                rows={3}
                id="bt-recon-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default TransactionModals;
