import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Receipt } from '../data/receipts.data';
import { amountPaid, money, receiptDateTime, statusBadge } from '../data/receipts.data';

export type ReceiptModalId = 'generate' | 'view' | 'print' | 'email' | 'cancel';

export interface ReceiptModalsProps {
  active: ReceiptModalId | null;
  row: Receipt | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onCancelReceipt: (reason: string) => void;
}

const ReceiptModals = ({ active, row, onClose, onToast, onCancelReceipt }: ReceiptModalsProps) => {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (active === 'email' && row) setEmail(`${row.student.toLowerCase().replace(/\s+/g, '.')}@example.com`);
    if (active === 'cancel') setReason('');
  }, [active, row]);

  const closeFooter = (extra?: React.ReactNode) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Close
      </button>
      {extra}
    </>
  );

  const preview = row ? (
    <>
      <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
        <span className="avatar avatar-lg me-3">
          <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
        </span>
        <div>
          <div className="d-flex align-items-center gap-2">
            <h5 className="mb-0">{row.student}</h5>
            <span className="badge bg-primary-transparent text-primary">{row.receiptNo}</span>
            <span className={statusBadge[row.status]}>{row.status}</span>
          </div>
          <p className="mb-0 text-muted fs-13">
            {row.className} · {row.admissionNo} · {receiptDateTime(row)}
          </p>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Component</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {row.feeBreakdown.map((line) => (
              <tr key={line.label}>
                <td>{line.label}</td>
                <td className="text-end">{line.amount}</td>
              </tr>
            ))}
            <tr>
              <td className="fw-medium">Amount Paid</td>
              <td className="text-end fw-medium">{money(amountPaid(row))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  ) : null;

  return (
    <>
      {/* Generate Receipt */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Receipt"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Receipt generated');
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Generate
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="rc-invoice">
            Invoice No.
          </label>
          <input type="text" className="form-control" id="rc-invoice" placeholder="INV-2026-0000" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="rc-method">
            Payment Method
          </label>
          <select className="form-select" id="rc-method" defaultValue="Cash">
            {['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque', 'Online'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="rc-amount">
            Amount
          </label>
          <input type="text" className="form-control" id="rc-amount" placeholder="0.00" />
        </div>
      </Modal>

      {/* View Receipt */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Receipt Details"
        dialogClassName="modal-lg"
        footer={closeFooter()}
      >
        {preview}
      </Modal>

      {/* Print Receipt */}
      <Modal
        open={active === 'print' && row !== null}
        onClose={onClose}
        title="Print Receipt"
        dialogClassName="modal-lg"
        footer={closeFooter(
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              window.print();
              onClose();
            }}
          >
            <i className="ti ti-printer me-1" />
            Print
          </button>,
        )}
      >
        {preview}
      </Modal>

      {/* Email Receipt */}
      <Modal
        open={active === 'email' && row !== null}
        onClose={onClose}
        title="Email Receipt"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`Receipt emailed to ${email}`);
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />
              Send
            </button>
          </>
        }
      >
        <div className="mb-0">
          <label className="form-label" htmlFor="rc-email">
            Recipient
          </label>
          <input
            type="email"
            className="form-control"
            id="rc-email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </Modal>

      {/* Cancel Receipt */}
      <Modal
        open={active === 'cancel' && row !== null}
        onClose={onClose}
        title="Cancel Receipt"
        onSubmit={(event) => {
          event.preventDefault();
          onCancelReceipt(reason);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              <i className="ti ti-receipt-off me-1" />
              Cancel Receipt
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-13 mb-3">
              Cancel <span className="fw-medium">{row.receiptNo}</span> for{' '}
              <span className="fw-medium">{row.student}</span>? The payment will be reversed against{' '}
              {row.invoiceNo}.
            </p>
            <div className="mb-0">
              <label className="form-label" htmlFor="rc-reason">
                Reason for Cancellation
              </label>
              <textarea
                className="form-control"
                rows={3}
                id="rc-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default ReceiptModals;
