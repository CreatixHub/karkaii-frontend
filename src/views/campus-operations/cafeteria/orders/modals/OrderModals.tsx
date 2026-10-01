import { useEffect, useMemo, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Order, OrderStatus } from '../data/orders.data';
import {
  breakdownPairsOf,
  cancelReasonOptions,
  cancelledByOptions,
  compactOf,
  counterOptions,
  createMethodOptions,
  createOrderStatusOptions,
  createPaymentStatusOptions,
  customerChoices,
  customerTypeOptions,
  itemLineOf,
  itemsLabel,
  kitchenStates,
  menuChoices,
  money,
  orderTypeOptions,
  payableOf,
  paymentBadge,
  placedAtOf,
  receiptFormatOptions,
  refundMethodOptions,
  statusBadge,
  subtotalOf,
} from '../data/orders.data';

export type OrderModalId =
  | 'create' | 'edit' | 'status' | 'receipt' | 'cancel' | 'view';

export interface OrderDraft {
  customer: string;
  customerType: string;
  orderType: string;
  counter: string;
  placedAt: string;
  itemOne: string;
  qtyOne: string;
  itemTwo: string;
  qtyTwo: string;
  method: string;
  credit: string;
  paymentStatus: string;
  orderStatus: string;
  notes: string;
  toKitchen: boolean;
  printToken: boolean;
}

export const emptyDraft: OrderDraft = {
  customer: '', customerType: customerTypeOptions[0], orderType: orderTypeOptions[1],
  counter: counterOptions[0], placedAt: '2026-07-31T12:42', itemOne: menuChoices[0], qtyOne: '1',
  itemTwo: 'No second item', qtyTwo: '1', method: createMethodOptions[0], credit: '0.00',
  paymentStatus: createPaymentStatusOptions[0], orderStatus: createOrderStatusOptions[0],
  notes: '', toKitchen: true, printToken: true,
};

/** "Vegetable Pulao · $1.80" → the price alone. */
export const priceOf = (choice: string): number =>
  Number((choice.split('$')[1] ?? '0').trim()) || 0;

export const nameOf = (choice: string): string => choice.split('·')[0].trim();

export const draftOf = (row: Order): OrderDraft => ({
  customer: customerChoices.find((choice) => choice.startsWith(row.customer)) ?? '',
  customerType: row.customerType,
  orderType: row.orderType,
  counter: counterOptions.find((option) => row.counter.startsWith(option.split(' ·')[0])) ?? counterOptions[0],
  placedAt: '2026-07-31T12:42',
  itemOne: menuChoices.find((choice) => choice.startsWith(row.items[0]?.name ?? '')) ?? menuChoices[0],
  qtyOne: String(row.items[0]?.qty ?? 1),
  itemTwo: menuChoices.find((choice) => choice.startsWith(row.items[1]?.name ?? '')) ?? 'No second item',
  qtyTwo: String(row.items[1]?.qty ?? 1),
  method: createMethodOptions.find((option) => row.method.startsWith(option)) ?? createMethodOptions[0],
  credit: row.credit.toFixed(2),
  paymentStatus: row.paymentStatus,
  orderStatus: row.status === 'Cancelled' ? 'On Hold' : row.status,
  notes: row.notes,
  toKitchen: row.status === 'Preparing',
  printToken: true,
});

export interface OrderModalsProps {
  active: OrderModalId | null;
  row: Order | null;
  onClose: () => void;
  onCreate: (draft: OrderDraft) => void;
  onUpdate: (draft: OrderDraft) => void;
  onUpdateStatus: (status: OrderStatus, counter: string, ready: string) => void;
  onGenerateReceipt: (format: string, sendTo: string) => void;
  onCancel: (reason: string, by: string, refundMethod: string, amount: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** The View dialog hands off to the receipt and to the offcanvas. */
  onOpen: (modal: OrderModalId) => void;
  onOpenPanel: () => void;
}

/** The label/value line the dialogs share. */
const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: OrderDraft;
  onField: (field: keyof OrderDraft, value: string | boolean) => void;
  suffix: string;
}

const OrderForm = ({ draft, onField, suffix }: FormProps) => {
  /** The money follows the lines: subtotal, then the credit taken off it. */
  const subtotal = priceOf(draft.itemOne) * (Number(draft.qtyOne) || 0)
    + (draft.itemTwo === 'No second item' ? 0 : priceOf(draft.itemTwo) * (Number(draft.qtyTwo) || 0));
  const credit = Number(draft.credit) || 0;
  const payable = Math.max(0, subtotal - credit);

  return (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`order-customer${suffix}`}>Customer</label>
        <select
          className="form-select" id={`order-customer${suffix}`}
          value={draft.customer} onChange={(event) => onField('customer', event.target.value)}
        >
          <option value="">Select customer</option>
          {customerChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`order-customer-type${suffix}`}>Customer Type</label>
        <select
          className="form-select" id={`order-customer-type${suffix}`}
          value={draft.customerType} onChange={(event) => onField('customerType', event.target.value)}
        >
          {customerTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`order-type${suffix}`}>Order Type</label>
        <select
          className="form-select" id={`order-type${suffix}`}
          value={draft.orderType} onChange={(event) => onField('orderType', event.target.value)}
        >
          {orderTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`order-counter${suffix}`}>Counter</label>
        <select
          className="form-select" id={`order-counter${suffix}`}
          value={draft.counter} onChange={(event) => onField('counter', event.target.value)}
        >
          {counterOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`order-placed${suffix}`}>Order Date &amp; Time</label>
        <input
          type="datetime-local" className="form-control" id={`order-placed${suffix}`}
          value={draft.placedAt} onChange={(event) => onField('placedAt', event.target.value)}
        />
      </div></div>
      <div className="col-md-8"><div className="mb-3">
        <label className="form-label" htmlFor={`order-item-1${suffix}`}>Menu Item</label>
        <select
          className="form-select" id={`order-item-1${suffix}`}
          value={draft.itemOne} onChange={(event) => onField('itemOne', event.target.value)}
        >
          {menuChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`order-qty-1${suffix}`}>Quantity</label>
        <input
          type="number" className="form-control" id={`order-qty-1${suffix}`} min={1}
          value={draft.qtyOne} onChange={(event) => onField('qtyOne', event.target.value)}
        />
      </div></div>
      <div className="col-md-8"><div className="mb-3">
        <label className="form-label" htmlFor={`order-item-2${suffix}`}>Menu Item</label>
        <select
          className="form-select" id={`order-item-2${suffix}`}
          value={draft.itemTwo} onChange={(event) => onField('itemTwo', event.target.value)}
        >
          {menuChoices.map((option) => <option key={option}>{option}</option>)}
          <option>No second item</option>
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`order-qty-2${suffix}`}>Quantity</label>
        <input
          type="number" className="form-control" id={`order-qty-2${suffix}`} min={1}
          value={draft.qtyTwo} disabled={draft.itemTwo === 'No second item'}
          onChange={(event) => onField('qtyTwo', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`order-method${suffix}`}>Payment Method</label>
        <select
          className="form-select" id={`order-method${suffix}`}
          value={draft.method} onChange={(event) => onField('method', event.target.value)}
        >
          {createMethodOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`order-subtotal${suffix}`}>Subtotal</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          {/* The two item lines multiplied out, not a figure of its own. */}
          <input type="text" className="form-control" id={`order-subtotal${suffix}`} value={subtotal.toFixed(2)} readOnly />
        </div>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`order-credit${suffix}`}>Meal Plan Credit</label>
        <div className="input-group">
          <span className="input-group-text">−$</span>
          <input
            type="number" className="form-control" id={`order-credit${suffix}`} min={0} step="0.05"
            value={draft.credit} onChange={(event) => onField('credit', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`order-payable${suffix}`}>Amount Payable</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input type="text" className="form-control" id={`order-payable${suffix}`} value={payable.toFixed(2)} readOnly />
        </div>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`order-payment${suffix}`}>Payment Status</label>
        <select
          className="form-select" id={`order-payment${suffix}`}
          value={draft.paymentStatus} onChange={(event) => onField('paymentStatus', event.target.value)}
        >
          {createPaymentStatusOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`order-status${suffix}`}>Order Status</label>
        <select
          className="form-select" id={`order-status${suffix}`}
          value={draft.orderStatus} onChange={(event) => onField('orderStatus', event.target.value)}
        >
          {createOrderStatusOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`order-notes${suffix}`}>Internal Notes</label>
        <textarea
          className="form-control" rows={2} id={`order-notes${suffix}`}
          placeholder="Visible to the kitchen and the counter"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`coKitchen${suffix}`}
            checked={draft.toKitchen} onChange={(event) => onField('toKitchen', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`coKitchen${suffix}`}>
            Send straight to the kitchen queue
          </label>
        </div>
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`coToken${suffix}`}
            checked={draft.printToken} onChange={(event) => onField('printToken', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`coToken${suffix}`}>
            Print a collection token
          </label>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const OrderModals = ({
  active, row, onClose, onCreate, onUpdate, onUpdateStatus, onGenerateReceipt, onCancel,
  onToast, onOpen, onOpenPanel,
}: OrderModalsProps) => {
  const [draft, setDraft] = useState<OrderDraft>(emptyDraft);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Preparing');
  const [counter, setCounter] = useState(counterOptions[0]);
  const [readyAt, setReadyAt] = useState('13:08');
  const [kitchenRemarks, setKitchenRemarks] = useState('');
  const [notifyReady, setNotifyReady] = useState(true);

  const [format, setFormat] = useState(receiptFormatOptions[0]);
  const [receiptDate, setReceiptDate] = useState('31-07-2026');
  const [sendTo, setSendTo] = useState('');
  const [itemised, setItemised] = useState(true);
  const [showWallet, setShowWallet] = useState(true);

  const [reason, setReason] = useState(cancelReasonOptions[0]);
  const [cancelledBy, setCancelledBy] = useState(cancelledByOptions[0]);
  const [refundMethod, setRefundMethod] = useState(refundMethodOptions[0]);
  const [refundAmount, setRefundAmount] = useState('0.00');
  const [cancelNotes, setCancelNotes] = useState('');
  const [notifyCancel, setNotifyCancel] = useState(true);

  /** Each opening seeds from the row being acted on, or a blank sheet for Create. */
  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'status' && row) {
      setNewStatus(kitchenStates.includes(row.status) ? row.status : 'Preparing');
      setCounter(counterOptions.find((option) => row.counter.startsWith(option.split(' ·')[0])) ?? counterOptions[0]);
      setReadyAt('13:08');
      setKitchenRemarks('');
    }
    if (active === 'receipt' && row) {
      setFormat(receiptFormatOptions[0]);
      setReceiptDate('31-07-2026');
      setSendTo(`${row.customer.split(' ')[0].toLowerCase()}@example.com`);
    }
    if (active === 'cancel' && row) {
      setReason(cancelReasonOptions[0]);
      setCancelledBy(cancelledByOptions[0]);
      // Nothing to refund on an order that was never paid.
      const paid = row.paymentStatus === 'Paid' || row.paymentStatus === 'Refunded';
      setRefundMethod(paid ? refundMethodOptions[0] : 'No refund due');
      setRefundAmount(paid ? payableOf(row).toFixed(2) : '0.00');
      setCancelNotes('');
    }
  }, [active, row]);

  const field = (key: keyof OrderDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const receiptNo = useMemo(
    () => (row ? `RCP-${row.id.replace('ORD-', '')}` : 'RCP-2026-1845'),
    [row],
  );

  return (
    <>
      {/* Create Order */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create Order"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Order</button>
          </>
        }
      >
        <OrderForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Order */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Order"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <OrderForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* Update Order Status */}
      <Modal
        open={active === 'status' && row !== null}
        onClose={onClose}
        title="Update Order Status"
        onSubmit={(event) => { event.preventDefault(); onUpdateStatus(newStatus, counter, readyAt); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Update Status</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-md rounded flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.customer} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.customer}</h5>
                <span className="fs-12 text-muted">{compactOf(row)}</span>
              </div>
              <span className={`${statusBadge[row.status]}`}>{row.status}</span>
            </div>

            {/* The kitchen timeline, read off the order rather than transcribed. */}
            {row.preparationPairs.slice(0, 3).map((pair) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={pair.label}>
                <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                  <i className="ti ti-clock-hour-4" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{pair.label}</h6>
                  <span className="fs-12 text-muted">{pair.value}</span>
                </div>
              </div>
            ))}

            <p className="mb-2 fs-13 text-muted mt-3">New status</p>
            <div className="custom-btn-group custom-btn-group-fill mb-3" role="group" aria-label="Order status">
              {kitchenStates.map((state) => (
                <button
                  type="button"
                  className={`btn${newStatus === state ? ' active' : ''}`}
                  key={state}
                  aria-pressed={newStatus === state}
                  onClick={() => setNewStatus(state)}
                >
                  <i
                    className={`ti ${
                      state === 'Preparing' ? 'ti-tools-kitchen-2'
                        : state === 'Ready for Pickup' ? 'ti-package' : 'ti-checks'
                    } me-1`}
                  />
                  {state === 'Ready for Pickup' ? 'Ready' : state}
                </button>
              ))}
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="assigned-counter">Assigned Counter</label>
                <select
                  className="form-select" id="assigned-counter"
                  value={counter} onChange={(event) => setCounter(event.target.value)}
                >
                  {counterOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="estimated-ready">Estimated Ready</label>
                <input
                  type="time" className="form-control" id="estimated-ready"
                  value={readyAt} onChange={(event) => setReadyAt(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="kitchen-remarks">Kitchen Remarks</label>
                <textarea
                  className="form-control" rows={2} id="kitchen-remarks"
                  placeholder="Shown on the kitchen docket"
                  value={kitchenRemarks} onChange={(event) => setKitchenRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="usNotify"
                    checked={notifyReady} onChange={(event) => setNotifyReady(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="usNotify">
                    Notify the customer when the order is ready
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Generate Receipt */}
      <Modal
        open={active === 'receipt' && row !== null}
        onClose={onClose}
        title="Generate Receipt"
        onSubmit={(event) => { event.preventDefault(); onGenerateReceipt(format, sendTo); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-receipt me-1" />Generate Receipt
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
                <i className="ti ti-receipt" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{receiptNo}</h5>
                <span className="fs-12 text-muted">{row.customer} · {row.id}</span>
              </div>
              <span className={`${paymentBadge[row.paymentStatus]}`}>{row.paymentStatus}</span>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receipt-format">Receipt Format</label>
                <select
                  className="form-select" id="receipt-format"
                  value={format} onChange={(event) => setFormat(event.target.value)}
                >
                  {receiptFormatOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receipt-date">Receipt Date</label>
                <DateField id="receipt-date" value={receiptDate} onChange={setReceiptDate} />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="send-to">Send To</label>
                <input
                  type="email" className="form-control" id="send-to"
                  value={sendTo} onChange={(event) => setSendTo(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="grItems"
                    checked={itemised} onChange={(event) => setItemised(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="grItems">
                    Include the itemised breakdown
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="grWallet"
                    checked={showWallet} onChange={(event) => setShowWallet(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="grWallet">
                    Show the closing wallet balance
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Cancel Order */}
      <Modal
        open={active === 'cancel' && row !== null}
        onClose={onClose}
        title="Cancel Order"
        onSubmit={(event) => {
          event.preventDefault();
          onCancel(reason, cancelledBy, refundMethod, refundAmount);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Order</button>
            <button type="submit" className="btn btn-danger">Cancel Order</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Cancelling pulls the docket from the kitchen queue and releases the collection token.
              </span>
            </div>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-md rounded flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.customer} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.customer}</h5>
                <span className="fs-12 text-muted">
                  {row.id} · {row.items.map((item) => `${item.name} × ${item.qty}`).join(', ')}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="cancel-reason">Reason</label>
                <select
                  className="form-select" id="cancel-reason"
                  value={reason} onChange={(event) => setReason(event.target.value)}
                >
                  {cancelReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="cancelled-by">Cancelled By</label>
                <select
                  className="form-select" id="cancelled-by"
                  value={cancelledBy} onChange={(event) => setCancelledBy(event.target.value)}
                >
                  {cancelledByOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="refund-method">Refund Method</label>
                <select
                  className="form-select" id="refund-method"
                  value={refundMethod} onChange={(event) => setRefundMethod(event.target.value)}
                >
                  {(row.paymentStatus === 'Paid' || row.paymentStatus === 'Refunded'
                    ? refundMethodOptions
                    : ['No refund due']).map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="refund-amount">Refund Amount</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="refund-amount" min={0} step="0.05"
                    value={refundAmount} onChange={(event) => setRefundAmount(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="cancel-notes">Internal Notes</label>
                <textarea
                  className="form-control" rows={2} id="cancel-notes"
                  placeholder="Recorded against the order"
                  value={cancelNotes} onChange={(event) => setCancelNotes(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="cancNotify"
                    checked={notifyCancel} onChange={(event) => setNotifyCancel(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="cancNotify">
                    Notify the customer with the reason and refund detail
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Order */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Order'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('receipt')}>
              <i className="ti ti-receipt me-1" />Receipt
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-receipt me-1" />Open Order Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">
              {placedAtOf(row)}  •  {row.orderType}  •  {row.counter}
            </p>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <span className="avatar avatar-lg rounded flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.customer} />
              </span>
              <div>
                <h5 className="mb-0 fs-15">{row.customer}</h5>
                <span className="fs-12 text-muted">{row.customerLine} · {row.customerType}</span>
              </div>
              <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
            </div>

            <div className="row g-3 mb-3">
              {[
                { label: 'Items', value: String(row.items.reduce((total, item) => total + item.qty, 0)) },
                { label: 'Payable', value: money(payableOf(row)) },
                { label: 'Prep Time', value: `${row.prepMinutes} min` },
                { label: 'Counter', value: row.counter },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3">
                    <span className="fs-12 text-muted d-block">{tile.label}</span>
                    <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-13 mb-2">Ordered Items</h6>
            {row.items.map((item) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={item.name}>
                <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className="ti ti-tools-kitchen-2" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{item.name}</h6>
                  <span className="fs-12 text-muted">{itemLineOf(item)}</span>
                </div>
                <span className="fs-13 fw-medium">{money(item.qty * item.price)}</span>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Billing Summary</h6>
            <div className="border rounded p-3 mb-3">
              {breakdownPairsOf(row).map((pair) => (
                <Row key={pair.label} label={pair.label} value={pair.value} />
              ))}
              <div className="d-flex align-items-center justify-content-between mb-0 pt-2 border-top">
                <span className="fs-13 text-muted">Amount Payable</span>
                <span className="fs-13 fw-semibold">{money(payableOf(row))}</span>
              </div>
            </div>

            <h6 className="fs-13 mb-2">Order Timeline</h6>
            <div className="border rounded p-3">
              {row.preparationPairs.map((pair, index, all) => (
                <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
              ))}
            </div>

            <button
              type="button" className="btn btn-link p-0 fs-12 mt-2"
              onClick={() => onToast(`Kitchen docket printed for ${row.id} · ${itemsLabel(row)}`, 'info')}
            >
              Print the kitchen docket
            </button>

            <p className="fs-12 text-muted mt-2 mb-0">Subtotal {money(subtotalOf(row))}</p>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default OrderModals;
