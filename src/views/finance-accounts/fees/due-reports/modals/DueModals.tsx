import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { DueRow } from '../data/dueReports.data';
import {
  daysOverdueLabel,
  money,
  netOutstanding,
  outstanding,
  statusBadge,
} from '../data/dueReports.data';

export type DueModalId = 'view' | 'payment' | 'reminder' | 'statement' | 'export';

export interface DueModalsProps {
  active: DueModalId | null;
  row: DueRow | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onRecordPayment: (amount: number, method: string, reference: string) => void;
}

const Identity = ({ row }: { row: DueRow }) => (
  <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
    <span className="avatar avatar-lg me-3">
      <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
    </span>
    <div>
      <div className="d-flex align-items-center gap-2">
        <h5 className="mb-0">{row.student}</h5>
        <span className="badge bg-primary-transparent text-primary">{row.admissionNo}</span>
        <span className={statusBadge[row.status]}>{row.status}</span>
      </div>
      <p className="mb-0 text-muted fs-13">
        {row.className} · {row.feeCategory} · {row.invoiceNo}
      </p>
    </div>
  </div>
);

const InfoList = ({ items }: { items: { label: string; value: string }[] }) => (
  <ul className="list-unstyled mb-0">
    {items.map((item, index) => (
      <li
        className={`d-flex justify-content-between py-1 fs-13${index === items.length - 1 ? '' : ' border-bottom'}`}
        key={item.label}
      >
        <span className="text-muted">{item.label}</span>
        <span className="text-dark">{item.value}</span>
      </li>
    ))}
  </ul>
);

const DueModals = ({ active, row, onClose, onToast, onRecordPayment }: DueModalsProps) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('Cash');
  const [reference, setReference] = useState('');
  const [channel, setChannel] = useState('Email');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (active === 'payment' && row) {
      setAmount(String(outstanding(row)));
      setMethod('Cash');
      setReference('');
    }
    if (active === 'reminder' && row) {
      setChannel('Email');
      setMessage(
        `Dear ${row.guardian.name}, an amount of ${money(outstanding(row))} is outstanding against ${row.invoiceNo}, due ${row.dueDate}.`,
      );
    }
  }, [active, row]);

  const closeFooter = (extra?: React.ReactNode) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Close
      </button>
      {extra}
    </>
  );

  return (
    <>
      {/* Due Details */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Due Details"
        dialogClassName="modal-lg"
        footer={closeFooter()}
      >
        {row ? (
          <>
            <Identity row={row} />
            <div className="row">
              <div className="col-md-6">
                <InfoList
                  items={[
                    { label: 'Billed', value: money(row.billed) },
                    { label: 'Collected', value: money(row.paid) },
                    { label: 'Outstanding', value: money(outstanding(row)) },
                    { label: 'Net Outstanding', value: money(netOutstanding(row)) },
                  ]}
                />
              </div>
              <div className="col-md-6">
                <InfoList
                  items={[
                    { label: 'Due Date', value: row.dueDate },
                    { label: 'Days Overdue', value: daysOverdueLabel(row) },
                    { label: 'Academic Year', value: row.academicYear },
                    { label: 'Guardian', value: row.guardian.name },
                  ]}
                />
              </div>
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
          onRecordPayment(Number(amount.replace(/[^0-9.]/g, '')) || 0, method, reference);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record Payment
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-13 mb-3">
              Outstanding on <span className="fw-medium">{row.invoiceNo}</span> is{' '}
              <span className="fw-medium">{money(outstanding(row))}</span>.
            </p>
            <div className="mb-3">
              <label className="form-label" htmlFor="dr-amount">
                Amount
              </label>
              <input
                type="text"
                className="form-control"
                id="dr-amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="dr-method">
                Payment Method
              </label>
              <select
                className="form-select"
                id="dr-method"
                value={method}
                onChange={(event) => setMethod(event.target.value)}
              >
                {['Cash', 'Bank Transfer', 'UPI', 'Cheque', 'Card'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="dr-reference">
                Reference No.
              </label>
              <input
                type="text"
                className="form-control"
                id="dr-reference"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Send Payment Reminder */}
      <Modal
        open={active === 'reminder' && row !== null}
        onClose={onClose}
        title="Send Payment Reminder"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`Reminder sent to ${row?.guardian.name ?? 'the guardian'} by ${channel}`);
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-send me-1" />
              Send Reminder
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="mb-3">
              <label className="form-label" htmlFor="dr-channel">
                Channel
              </label>
              <select
                className="form-select"
                id="dr-channel"
                value={channel}
                onChange={(event) => setChannel(event.target.value)}
              >
                {['Email', 'SMS', 'WhatsApp', 'Email + SMS'].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="dr-message">
                Message
              </label>
              <textarea
                className="form-control"
                rows={4}
                id="dr-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Generate Statement */}
      <Modal
        open={active === 'statement' && row !== null}
        onClose={onClose}
        title="Generate Statement"
        dialogClassName="modal-lg"
        footer={closeFooter(
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onToast('Statement download started');
              onClose();
            }}
          >
            <i className="ti ti-download me-1" />
            Download
          </button>,
        )}
      >
        {row ? (
          <>
            <Identity row={row} />
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
                    <td className="fw-medium">Total Billed</td>
                    <td className="text-end fw-medium">{money(row.billed)}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium">Outstanding</td>
                    <td className="text-end fw-medium">{money(outstanding(row))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Export Report */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Report"
        onSubmit={(event) => {
          event.preventDefault();
          onToast('Due report export started');
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-file-export me-1" />
              Export
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="dr-format">
            Format
          </label>
          <select className="form-select" id="dr-format" defaultValue="PDF">
            {['PDF', 'Excel', 'CSV'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="dr-scope">
            Scope
          </label>
          <select className="form-select" id="dr-scope" defaultValue="Current filters">
            {['Current filters', 'All outstanding', 'Overdue only'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </Modal>
    </>
  );
};

export default DueModals;
