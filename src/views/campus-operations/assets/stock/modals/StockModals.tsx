import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { StockItem } from '../data/stock.data';
import {
  adjustmentReasonOptions,
  approverOptions,
  availableOf,
  categoryOptions,
  ledgerOf,
  money,
  movementIcon,
  qty,
  receivedByOptions,
  reorderObservationOf,
  requestedByOptions,
  statusBadge,
  statusOf,
  stockTypeOptions,
  stockValueOf,
  supplierOptions,
  transfersOf,
  unitLabel,
  unitOptions,
  warehouseOptions,
} from '../data/stock.data';

export type StockModalId = 'add' | 'edit' | 'adjust' | 'transfer' | 'receive' | 'history';

export interface StockDraft {
  stockType: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  warehouse: string;
  bin: string;
  supplier: string;
  leadTime: string;
  reorderLevel: string;
  reorderQty: string;
  unitPrice: string;
  notes: string;
  alert: boolean;
  batchTracked: boolean;
}

export const emptyDraft: StockDraft = {
  stockType: stockTypeOptions[0], code: '', name: '', category: categoryOptions[0],
  unit: unitOptions[0], warehouse: warehouseOptions[0], bin: '',
  supplier: supplierOptions[0], leadTime: '', reorderLevel: '', reorderQty: '',
  unitPrice: '', notes: '', alert: true, batchTracked: false,
};

export const draftOf = (row: StockItem): StockDraft => ({
  stockType: stockTypeOptions[0],
  code: row.id,
  name: row.name,
  category: row.category,
  unit: unitOptions.find((option) => option.toLowerCase() === row.unit.toLowerCase()) ?? unitOptions[0],
  warehouse: row.warehouse,
  bin: row.location,
  supplier: row.supplier,
  leadTime: String(row.leadTime),
  reorderLevel: String(row.reorderLevel),
  reorderQty: String(row.reorderQty),
  unitPrice: row.unitPrice.toFixed(2),
  notes: row.notes,
  alert: true,
  batchTracked: row.batches.length > 0,
});

export interface AdjustPayload {
  mode: 'Increase' | 'Decrease' | 'Set Count';
  quantity: string;
  reason: string;
  date: string;
  approvedBy: string;
  remarks: string;
}

export interface TransferPayload {
  quantity: string;
  fromStore: string;
  toStore: string;
  date: string;
  requestedBy: string;
  reference: string;
  carriedBy: string;
  remarks: string;
}

export interface ReceivePayload {
  purchaseOrder: string;
  supplier: string;
  store: string;
  ordered: string;
  received: string;
  rejected: string;
  rate: string;
  date: string;
  invoiceNo: string;
  batch: string;
  bin: string;
  receivedBy: string;
  remarks: string;
}

export interface StockModalsProps {
  active: StockModalId | null;
  row: StockItem | null;
  onClose: () => void;
  onAdd: (draft: StockDraft) => void;
  onUpdate: (draft: StockDraft) => void;
  onAdjust: (payload: AdjustPayload) => void;
  onTransfer: (payload: TransferPayload) => void;
  onReceive: (payload: ReceivePayload) => void;
  onOpen: (modal: StockModalId) => void;
  onOpenPanel: () => void;
}

const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const ItemStrip = ({ row, children }: { row: StockItem; children?: ReactNode }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
      <i className={row.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-14 mb-0 text-truncate">{row.name}</h5>
      <span className="fs-12 text-muted text-truncate d-block">
        {row.id} · {row.warehouse} · {row.packSize}
      </span>
    </div>
    {children ?? <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>}
  </div>
);

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: StockDraft;
  onField: (field: keyof StockDraft, value: string | boolean) => void;
  suffix: string;
  mode: 'add' | 'edit';
  notifyTarget?: string;
}

const StockForm = ({ draft, onField, suffix, mode, notifyTarget }: FormProps) => (
  <>
    {mode === 'add' ? (
      <div className="mb-3">
        <span className="form-label d-block">Stock type</span>
        <div className="d-flex flex-wrap gap-3">
          {stockTypeOptions.map((option) => (
            <div className="form-check" key={option}>
              <input
                className="form-check-input" type="radio" name="stock-type"
                id={`asi-${option}${suffix}`} checked={draft.stockType === option}
                onChange={() => onField('stockType', option)}
              />
              <label className="form-check-label fs-13" htmlFor={`asi-${option}${suffix}`}>
                <i
                  className={`ti ${option === 'Consumable' ? 'ti-package' : option === 'Durable' ? 'ti-box' : option === 'Perishable' ? 'ti-clock' : 'ti-barcode'} me-1`}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    ) : null}

    <div className="row">
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-code${suffix}`}>Item Code</label>
        <input
          type="text" className="form-control" id={`stk-code${suffix}`} placeholder="e.g. STK-1082"
          value={draft.code} onChange={(event) => onField('code', event.target.value)}
        />
      </div></div>
      <div className="col-md-8"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-name${suffix}`}>Item Name</label>
        <input
          type="text" className="form-control" id={`stk-name${suffix}`} placeholder="e.g. A4 Copier Paper"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-category${suffix}`}>Category</label>
        <select
          className="form-select" id={`stk-category${suffix}`}
          value={draft.category} onChange={(event) => onField('category', event.target.value)}
        >
          {categoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-unit${suffix}`}>Unit of Measure</label>
        <select
          className="form-select" id={`stk-unit${suffix}`}
          value={draft.unit} onChange={(event) => onField('unit', event.target.value)}
        >
          {unitOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Storage &amp; Supplier</h6>
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-warehouse${suffix}`}>Warehouse / Store</label>
        <select
          className="form-select" id={`stk-warehouse${suffix}`}
          value={draft.warehouse} onChange={(event) => onField('warehouse', event.target.value)}
        >
          {warehouseOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-bin${suffix}`}>Rack / Bin</label>
        <input
          type="text" className="form-control" id={`stk-bin${suffix}`}
          placeholder="e.g. Admin Block · Rack A2 · Bin 07"
          value={draft.bin} onChange={(event) => onField('bin', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-supplier${suffix}`}>Supplier</label>
        <select
          className="form-select" id={`stk-supplier${suffix}`}
          value={draft.supplier} onChange={(event) => onField('supplier', event.target.value)}
        >
          {supplierOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-lead${suffix}`}>Lead Time (days)</label>
        <input
          type="number" className="form-control" id={`stk-lead${suffix}`} min={0} placeholder="e.g. 7"
          value={draft.leadTime} onChange={(event) => onField('leadTime', event.target.value)}
        />
      </div></div>
    </div>

    <h6 className="fs-13 mb-2">Levels &amp; Pricing</h6>
    <div className="row">
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-reorder${suffix}`}>Reorder Level</label>
        <input
          type="number" className="form-control" id={`stk-reorder${suffix}`} min={0} placeholder="0"
          value={draft.reorderLevel} onChange={(event) => onField('reorderLevel', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-roq${suffix}`}>Reorder Quantity</label>
        <input
          type="number" className="form-control" id={`stk-roq${suffix}`} min={0} placeholder="0"
          value={draft.reorderQty} onChange={(event) => onField('reorderQty', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-price${suffix}`}>Unit Price</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number" className="form-control" id={`stk-price${suffix}`} min={0} step="0.01"
            placeholder="0.00"
            value={draft.unitPrice} onChange={(event) => onField('unitPrice', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`stk-notes${suffix}`}>Internal Notes</label>
        <textarea
          className="form-control" rows={2} id={`stk-notes${suffix}`}
          placeholder="Visible to the store office only"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`stkAlert${suffix}`}
            checked={draft.alert} onChange={(event) => onField('alert', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`stkAlert${suffix}`}>
            {mode === 'add'
              ? 'Raise a low stock alert when the balance reaches the reorder level'
              : `Notify the ${notifyTarget ?? 'store office'} when the level changes`}
          </label>
        </div>
        {mode === 'add' ? (
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input" type="checkbox" role="switch" id={`stkBatch${suffix}`}
              checked={draft.batchTracked} onChange={(event) => onField('batchTracked', event.target.checked)}
            />
            <label className="form-check-label fs-13" htmlFor={`stkBatch${suffix}`}>
              Track this item by batch number and expiry date
            </label>
          </div>
        ) : null}
      </div>
    </div>
  </>
);

/* --------------------------------- Modals ---------------------------------- */

const StockModals = ({
  active, row, onClose, onAdd, onUpdate, onAdjust, onTransfer, onReceive, onOpen, onOpenPanel,
}: StockModalsProps) => {
  const [draft, setDraft] = useState<StockDraft>(emptyDraft);

  const [adjustMode, setAdjustMode] = useState<AdjustPayload['mode']>('Decrease');
  const [adjustQty, setAdjustQty] = useState('1');
  const [adjustReason, setAdjustReason] = useState(adjustmentReasonOptions[0]);
  const [adjustDate, setAdjustDate] = useState('31-07-2026');
  const [approvedBy, setApprovedBy] = useState(approverOptions[0]);
  const [adjustRemarks, setAdjustRemarks] = useState('');
  const [postValue, setPostValue] = useState(true);

  const [transferQty, setTransferQty] = useState('1');
  const [fromStore, setFromStore] = useState(warehouseOptions[0]);
  const [toStore, setToStore] = useState(warehouseOptions[1]);
  const [transferDate, setTransferDate] = useState('03-08-2026');
  const [requestedBy, setRequestedBy] = useState(requestedByOptions[0]);
  const [transferRef, setTransferRef] = useState('TRF-2026-0118');
  const [carriedBy, setCarriedBy] = useState('');
  const [transferRemarks, setTransferRemarks] = useState('');
  const [transferNote, setTransferNote] = useState(true);
  const [holdInTransit, setHoldInTransit] = useState(false);

  const [purchaseOrder, setPurchaseOrder] = useState('Direct receipt · no order');
  const [receiveSupplier, setReceiveSupplier] = useState(supplierOptions[0]);
  const [receivingStore, setReceivingStore] = useState(warehouseOptions[0]);
  const [ordered, setOrdered] = useState('0');
  const [receivedQty, setReceivedQty] = useState('0');
  const [rejectedQty, setRejectedQty] = useState('0');
  const [rate, setRate] = useState('0.00');
  const [receiptDate, setReceiptDate] = useState('04-08-2026');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [batch, setBatch] = useState('');
  const [receiveBin, setReceiveBin] = useState('');
  const [receivedBy, setReceivedBy] = useState(receivedByOptions[0]);
  const [inspection, setInspection] = useState('');
  const [closeOrder, setCloseOrder] = useState(true);
  const [clearAlert, setClearAlert] = useState(true);

  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (!row) return;
    if (active === 'adjust') {
      setAdjustMode('Decrease');
      setAdjustQty('1');
      setAdjustReason(adjustmentReasonOptions[0]);
      setAdjustRemarks('');
    }
    if (active === 'transfer') {
      setTransferQty('1');
      setFromStore(row.warehouse);
      setToStore(warehouseOptions.find((option) => option !== row.warehouse) ?? warehouseOptions[0]);
      setCarriedBy('');
      setTransferRemarks('');
    }
    if (active === 'receive') {
      const order = row.purchases[0];
      setPurchaseOrder(order ? `${order.id} · ${row.name}` : 'Direct receipt · no order');
      setReceiveSupplier(row.supplier);
      setReceivingStore(row.warehouse);
      setOrdered(String(row.reorderQty));
      setReceivedQty(String(row.reorderQty));
      setRejectedQty('0');
      setRate(row.unitPrice.toFixed(2));
      setInvoiceNo('');
      setBatch('');
      setReceiveBin(row.location);
      setInspection('');
    }
  }, [active, row]);

  const field = (key: keyof StockDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const balance = row ? availableOf(row) : 0;

  /** What the adjustment will leave behind, as it is typed. */
  const adjustedBalance = (() => {
    const amount = Number(adjustQty) || 0;
    if (adjustMode === 'Increase') return balance + amount;
    if (adjustMode === 'Decrease') return Math.max(0, balance - amount);
    return Math.max(0, amount);
  })();

  /** The accepted quantity at the rate, and what it leaves on the shelf. */
  const accepted = Math.max(0, (Number(receivedQty) || 0) - (Number(rejectedQty) || 0));
  const receiptValue = Number((accepted * (Number(rate) || 0)).toFixed(2));

  const purchaseOrderChoices = row
    ? [...row.purchases.map((order) => `${order.id} · ${row.name}`), 'Direct receipt · no order']
    : ['Direct receipt · no order'];

  return (
    <>
      {/* Add Stock Item */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Stock Item"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onAdd(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Stock Item</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">Create a new item on the stock register</p>
        <StockForm draft={draft} onField={field} suffix="" mode="add" />
      </Modal>

      {/* Edit Stock Item */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Stock Item"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.id}  •  {row.name}  •  {qty(balance)} in stock
            </p>
            <div className="alert alert-warning d-flex align-items-center mb-3">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Raising the reorder level re-evaluates the low stock alert straight away. The balance
                itself can only change through an adjustment.
              </span>
            </div>
            <StockForm
              draft={draft} onField={field} suffix="-2" mode="edit"
              notifyTarget={`${row.warehouse} storekeeper`}
            />
          </>
        ) : null}
      </Modal>

      {/* Stock Adjustment */}
      <Modal
        open={active === 'adjust' && row !== null}
        onClose={onClose}
        title="Stock Adjustment"
        onSubmit={(event) => {
          event.preventDefault();
          onAdjust({
            mode: adjustMode, quantity: adjustQty, reason: adjustReason,
            date: adjustDate, approvedBy, remarks: adjustRemarks,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-adjustments me-1" />Post Adjustment
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center mb-3">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                An adjustment writes straight to the ledger and needs a reason. It cannot be reversed
                once posted.
              </span>
            </div>
            <ItemStrip row={row} />
            <div className="border rounded p-3 mb-3">
              <Row label="Available" value={unitLabel(balance, row.unit)} />
              <Row label="Reorder Level" value={unitLabel(row.reorderLevel, row.unit)} />
              <Row label="Stock Value" value={money(stockValueOf(row))} last />
            </div>

            <div className="mb-3">
              <span className="form-label d-block">Adjustment type</span>
              <div className="d-flex flex-wrap gap-3">
                {(['Increase', 'Decrease', 'Set Count'] as const).map((option) => (
                  <div className="form-check" key={option}>
                    <input
                      className="form-check-input" type="radio" name="adjust-mode"
                      id={`adj-${option}`} checked={adjustMode === option}
                      onChange={() => setAdjustMode(option)}
                    />
                    <label className="form-check-label fs-13" htmlFor={`adj-${option}`}>
                      <i
                        className={`ti ${option === 'Increase' ? 'ti-plus' : option === 'Decrease' ? 'ti-minus' : 'ti-equal'} me-1`}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="adjust-quantity">Quantity</label>
                <input
                  type="number" className="form-control" id="adjust-quantity" min={0}
                  value={adjustQty} onChange={(event) => setAdjustQty(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="adjust-reason">Reason</label>
                <select
                  className="form-select" id="adjust-reason"
                  value={adjustReason} onChange={(event) => setAdjustReason(event.target.value)}
                >
                  {adjustmentReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="adjustment-date">Adjustment Date</label>
                <DateField id="adjustment-date" value={adjustDate} onChange={setAdjustDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="adjust-approver">Approved By</label>
                <select
                  className="form-select" id="adjust-approver"
                  value={approvedBy} onChange={(event) => setApprovedBy(event.target.value)}
                >
                  {approverOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="adjust-evidence">Evidence</label>
                <input type="file" className="form-control" id="adjust-evidence" />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="adjust-remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="adjust-remarks"
                  placeholder="Recorded on the stock ledger"
                  value={adjustRemarks} onChange={(event) => setAdjustRemarks(event.target.value)}
                />
              </div></div>
            </div>

            {/* What the posting will leave on the shelf. */}
            <div className="border rounded p-3 mb-3">
              <Row label="Balance Before" value={unitLabel(balance, row.unit)} />
              <Row label="Balance After" value={unitLabel(adjustedBalance, row.unit)} />
              <Row
                label="Value Difference"
                value={money(Number(((adjustedBalance - balance) * row.unitPrice).toFixed(2)))}
                last
              />
            </div>

            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id="adjPost"
                checked={postValue} onChange={(event) => setPostValue(event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor="adjPost">
                Post the value difference against the store consumables budget
              </label>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Transfer Stock */}
      <Modal
        open={active === 'transfer' && row !== null}
        onClose={onClose}
        title="Transfer Stock"
        onSubmit={(event) => {
          event.preventDefault();
          onTransfer({
            quantity: transferQty, fromStore, toStore, date: transferDate,
            requestedBy, reference: transferRef, carriedBy, remarks: transferRemarks,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-arrows-exchange me-1" />Transfer Stock
            </button>
          </>
        }
      >
        {row ? (
          <>
            <ItemStrip row={row}>
              <span className="fs-12 text-muted text-nowrap">{unitLabel(balance, row.unit)}</span>
            </ItemStrip>
            <div className="border rounded p-3 mb-3">
              <Row label="Available" value={unitLabel(balance, row.unit)} />
              <Row label="From Store" value={`${row.warehouse} · ${row.location.split('·').pop()?.trim()}`} />
              <Row
                label="Last Transfer"
                value={transfersOf(row)[0]
                  ? `${Math.abs(transfersOf(row)[0].qty)} ${transfersOf(row)[0].kind === 'transfer-out' ? 'out' : 'in'} on ${transfersOf(row)[0].date}`
                  : 'None recorded'}
                last
              />
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-quantity">Quantity</label>
                <input
                  type="number" className="form-control" id="transfer-quantity" min={1} max={balance}
                  value={transferQty} onChange={(event) => setTransferQty(event.target.value)}
                />
                {Number(transferQty) > balance ? (
                  <span className="fs-12 text-danger">
                    Only {unitLabel(balance, row.unit)} on the shelf.
                  </span>
                ) : null}
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-date">Transfer Date</label>
                <DateField id="transfer-date" value={transferDate} onChange={setTransferDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="from-store">From Store</label>
                <select
                  className="form-select" id="from-store"
                  value={fromStore} onChange={(event) => setFromStore(event.target.value)}
                >
                  {warehouseOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="to-store">To Store</label>
                <select
                  className="form-select" id="to-store"
                  value={toStore} onChange={(event) => setToStore(event.target.value)}
                >
                  {/* A store cannot transfer to itself. */}
                  {warehouseOptions.filter((option) => option !== fromStore).map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="requested-by">Requested By</label>
                <select
                  className="form-select" id="requested-by"
                  value={requestedBy} onChange={(event) => setRequestedBy(event.target.value)}
                >
                  {requestedByOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-reference">Transfer Reference</label>
                <input
                  type="text" className="form-control" id="transfer-reference"
                  value={transferRef} onChange={(event) => setTransferRef(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="carried-by">Carried By</label>
                <input
                  type="text" className="form-control" id="carried-by" placeholder="e.g. Store Assistant"
                  value={carriedBy} onChange={(event) => setCarriedBy(event.target.value)}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="transfer-remarks"
                  placeholder="Recorded on both store ledgers"
                  value={transferRemarks} onChange={(event) => setTransferRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="trfNote"
                    checked={transferNote} onChange={(event) => setTransferNote(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="trfNote">
                    Generate a transfer note for both storekeepers to sign
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="trfAck"
                    checked={holdInTransit} onChange={(event) => setHoldInTransit(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="trfAck">
                    Hold the stock in transit until the receiving store acknowledges
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Receive Stock */}
      <Modal
        open={active === 'receive' && row !== null}
        onClose={onClose}
        title="Receive Stock"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onReceive({
            purchaseOrder, supplier: receiveSupplier, store: receivingStore,
            ordered, received: receivedQty, rejected: rejectedQty, rate,
            date: receiptDate, invoiceNo, batch, bin: receiveBin, receivedBy, remarks: inspection,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-package-import me-1" />Receive Stock
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.purchases[0]?.id ?? 'Direct receipt'}  •  {row.supplier}  •  goods inward
            </p>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="purchase-order">Purchase Order</label>
                <select
                  className="form-select" id="purchase-order"
                  value={purchaseOrder} onChange={(event) => setPurchaseOrder(event.target.value)}
                >
                  {purchaseOrderChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receive-supplier">Supplier</label>
                <select
                  className="form-select" id="receive-supplier"
                  value={receiveSupplier} onChange={(event) => setReceiveSupplier(event.target.value)}
                >
                  {supplierOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receive-item">Item</label>
                <input type="text" className="form-control" id="receive-item" value={`${row.name} · ${row.id}`} readOnly />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receiving-store">Receiving Store</label>
                <select
                  className="form-select" id="receiving-store"
                  value={receivingStore} onChange={(event) => setReceivingStore(event.target.value)}
                >
                  {warehouseOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
            </div>

            <h6 className="fs-13 mb-2">Goods Inward</h6>
            <div className="row">
              <div className="col-md-3"><div className="mb-3">
                <label className="form-label" htmlFor="ordered-qty">Ordered Qty</label>
                <input
                  type="number" className="form-control" id="ordered-qty" min={0}
                  value={ordered} onChange={(event) => setOrdered(event.target.value)}
                />
              </div></div>
              <div className="col-md-3"><div className="mb-3">
                <label className="form-label" htmlFor="received-qty">Received Qty</label>
                <input
                  type="number" className="form-control" id="received-qty" min={0}
                  value={receivedQty} onChange={(event) => setReceivedQty(event.target.value)}
                />
              </div></div>
              <div className="col-md-3"><div className="mb-3">
                <label className="form-label" htmlFor="rejected-qty">Rejected Qty</label>
                <input
                  type="number" className="form-control" id="rejected-qty" min={0}
                  value={rejectedQty} onChange={(event) => setRejectedQty(event.target.value)}
                />
              </div></div>
              <div className="col-md-3"><div className="mb-3">
                <label className="form-label" htmlFor="unit-rate">Unit Rate</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="unit-rate" min={0} step="0.01"
                    value={rate} onChange={(event) => setRate(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receipt-date">Receipt Date</label>
                <DateField id="receipt-date" value={receiptDate} onChange={setReceiptDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="receive-invoice">Invoice No</label>
                <input
                  type="text" className="form-control" id="receive-invoice"
                  placeholder="e.g. GP-INV-2026-1142"
                  value={invoiceNo} onChange={(event) => setInvoiceNo(event.target.value)}
                />
              </div></div>
            </div>

            {/* Accepted quantity at the rate, against the item's own balance. */}
            <div className="border rounded p-3 mb-3">
              <Row label="Accepted Qty" value={unitLabel(accepted, row.unit)} />
              <Row label="Receipt Value" value={money(receiptValue)} />
              <Row label="Balance Before" value={unitLabel(balance, row.unit)} />
              <Row label="Balance After" value={unitLabel(balance + accepted, row.unit)} last />
            </div>

            <div className="row">
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="receive-batch">Batch Number</label>
                <input
                  type="text" className="form-control" id="receive-batch" placeholder="e.g. LOT-GP-2608"
                  value={batch} onChange={(event) => setBatch(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="receive-bin">Rack / Bin</label>
                <input
                  type="text" className="form-control" id="receive-bin"
                  value={receiveBin} onChange={(event) => setReceiveBin(event.target.value)}
                />
              </div></div>
              <div className="col-md-4"><div className="mb-3">
                <label className="form-label" htmlFor="received-by">Received By</label>
                <select
                  className="form-select" id="received-by"
                  value={receivedBy} onChange={(event) => setReceivedBy(event.target.value)}
                >
                  {receivedByOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="delivery-note">Delivery Note</label>
                <input type="file" className="form-control" id="delivery-note" />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="inspection-remarks">Inspection Remarks</label>
                <textarea
                  className="form-control" rows={2} id="inspection-remarks"
                  placeholder="Recorded on the goods inward note"
                  value={inspection} onChange={(event) => setInspection(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rcvClose"
                    checked={closeOrder} onChange={(event) => setCloseOrder(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rcvClose">
                    Close the purchase order once the full quantity is received
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="rcvClear"
                    checked={clearAlert} onChange={(event) => setClearAlert(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="rcvClear">
                    Clear the low stock alert for this item
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Stock History */}
      <Modal
        open={active === 'history' && row !== null}
        onClose={onClose}
        title={row?.name ?? 'Stock ledger'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('receive')}>
              <i className="ti ti-package-import me-1" />Receive Stock
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-packages me-1" />Open Stock Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {row.id}  •  {row.warehouse}  •  stock ledger 2026 / 2027
            </p>

            <div className="row g-3 mb-3">
              {[
                { icon: 'ti ti-stack-2', tint: 'primary', label: 'Opening', value: unitLabel(row.openingBalance, row.unit) },
                { icon: 'ti ti-package-import', tint: 'success', label: 'Received', value: unitLabel(row.received, row.unit) },
                { icon: 'ti ti-package-export', tint: 'warning', label: 'Issued', value: unitLabel(row.issued, row.unit) },
                { icon: 'ti ti-packages', tint: 'info', label: 'Closing', value: unitLabel(balance, row.unit) },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3 d-flex align-items-center gap-2">
                    <span className={`avatar avatar-sm bg-${tile.tint}-transparent text-${tile.tint} rounded flex-shrink-0`}>
                      <i className={tile.icon} />
                    </span>
                    <div className="overflow-hidden">
                      <span className="fs-12 text-muted d-block text-truncate">{tile.label}</span>
                      <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-13 mb-2">Ledger Entries</h6>
            <div className="table-responsive mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th className="fs-12">Date</th>
                    <th className="fs-12">Reference</th>
                    <th className="fs-12">Movement</th>
                    <th className="fs-12 text-end">In</th>
                    <th className="fs-12 text-end">Out</th>
                    <th className="fs-12 text-end">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {/* The opening balance run through every recorded movement. */}
                  {ledgerOf(row).map((entry, index) => (
                    <tr key={`${entry.reference}-${index}`}>
                      <td className="fs-13 text-nowrap">{entry.date}</td>
                      <td className="fs-13">{entry.reference}</td>
                      <td className="fs-13">{entry.movement}</td>
                      <td className="fs-13 text-end">
                        {entry.qty !== null && entry.qty > 0 ? `+${qty(entry.qty)}` : '–'}
                      </td>
                      <td className="fs-13 text-end">
                        {entry.qty !== null && entry.qty < 0 ? qty(entry.qty) : '–'}
                      </td>
                      <td className="fs-13 text-end fw-medium">{qty(entry.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h6 className="fs-13 mb-2">Consumption Pattern</h6>
            {[...row.observations, reorderObservationOf(row)].map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                  <i className={row.openOrder ? 'ti ti-shopping-cart' : 'ti ti-alert-triangle'} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0">{entry.title}</h6>
                  <span className="fs-12 text-muted d-block">{entry.meta}</span>
                </div>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Recent Movements</h6>
            {row.movements.slice(-3).reverse().map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.reference}>
                <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className={movementIcon[entry.kind]} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {entry.date} · {entry.reference}
                  </span>
                </div>
                <span className={`fs-13 fw-medium text-nowrap ${entry.qty > 0 ? 'text-success' : 'text-danger'}`}>
                  {entry.qty > 0 ? `+${qty(entry.qty)}` : qty(entry.qty)}
                </span>
              </div>
            ))}
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default StockModals;
