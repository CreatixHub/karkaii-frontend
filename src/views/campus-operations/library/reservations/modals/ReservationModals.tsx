import { useEffect, useMemo, useState } from 'react';
import TimeField from '@components/ui/TimeField';
import Modal from '@components/ui/Modal';
import SelectField from '@components/ui/SelectField';
import type { MemberType, Reservation } from '../data/reservations.data';
import {
  SELECT_BOOK, SELECT_MEMBER, addDaysInput, assignChoices, atLimit,
  bookChoices, booksHeldLabel, cancellationReasons, cancelledByChoices, conditionOptions,
  holdDurationOptions, issuedByChoices, librarianChoices, loanPeriodOptions,
  memberChoices, memberTypeOptions, onHold, photoOf, pickupPointOptions, queueBadge,
  queueEntryPanelMeta, queuePlacementOptions, remainingBadge, spanDays, statusBadge, toInputDate,
} from '../data/reservations.data';

export type ReservationModalId = 'add' | 'view' | 'approve' | 'ready' | 'complete' | 'cancel';

/* ---------------------------------- Drafts --------------------------------- */

export interface ReservationDraft {
  book: string;
  member: string;
  memberType: MemberType;
  reservedOn: string;
  holdDuration: string;
  pickupPoint: string;
  librarian: string;
  notes: string;
  notifyOnAvailable: boolean;
  autoExpire: boolean;
}

export const emptyDraft: ReservationDraft = {
  book: SELECT_BOOK,
  member: SELECT_MEMBER,
  memberType: 'Student',
  reservedOn: '31-07-2026',
  holdDuration: '72 hours',
  pickupPoint: 'Library front desk',
  librarian: librarianChoices[0],
  notes: '',
  notifyOnAvailable: true,
  autoExpire: true,
};

export interface ApproveResult {
  approvedBy: string;
  approvalDate: string;
  placement: string;
  holdDuration: string;
  remarks: string;
  override: boolean;
  notify: boolean;
}

export interface ReadyResult {
  copy: string;
  pickupPoint: string;
  availableFrom: string;
  deadline: string;
  shelfNote: string;
  email: boolean;
  sms: boolean;
}

export interface PickupResult {
  collectedOn: string;
  issuedBy: string;
  loanPeriod: string;
  dueDate: string;
  condition: string;
  createIssue: boolean;
  advanceQueue: boolean;
}

export interface CancelResult {
  reason: string;
  cancelledBy: string;
  remarks: string;
  release: boolean;
  notify: boolean;
}

/** The template's three-apart accession list, rebased on the row's own copy. */
export const copyChoices = (row: Reservation): string[] => {
  const match = row.accession.match(/^(.*?)(\d+)$/);
  if (!match) return [row.accession];
  const [, prefix, digits] = match;
  const base = Number(digits);
  return [0, 3, 6].map((step) => `${prefix}${String(base + step).padStart(digits.length, '0')}`);
};

export interface ReservationModalsProps {
  active: ReservationModalId | null;
  row: Reservation | null;
  onClose: () => void;
  onCreate: (draft: ReservationDraft) => void;
  onApprove: (result: ApproveResult) => void;
  onMarkReady: (result: ReadyResult) => void;
  onCompletePickup: (result: PickupResult) => void;
  onCancel: (result: CancelResult) => void;
  /** Lets View hand off to Cancel and Complete Pickup, as its footer does. */
  onOpen: (modal: ReservationModalId) => void;
}

/* --------------------------------- Pieces ---------------------------------- */

/** The template's dialog header — avatar, title and a one-line subtitle. */
const DialogHead = ({ tint, icon, title, subtitle }: {
  tint: string; icon: string; title: string; subtitle: string;
}) => (
  <div className="d-flex align-items-center gap-3">
    <span className={`avatar avatar-lg bg-${tint}-transparent text-${tint} rounded`}>
      <i className={`${icon} fs-20`} />
    </span>
    <div>
      <h4 className="modal-title mb-0">{title}</h4>
      <p className="mb-0 fs-12 text-muted">{subtitle}</p>
    </div>
  </div>
);

/** The bordered member strip the confirm dialogs open with. */
const MemberStrip = ({ row, caption, value, tint }: {
  row: Reservation; caption: string; value: string; tint?: string;
}) => (
  <div className="border rounded p-3 mb-3">
    <div className="d-flex align-items-center">
      <span className="avatar avatar-md rounded flex-shrink-0">
        <img src={photoOf(row.member)} className="rounded" alt={row.member} />
      </span>
      <div className="ms-2">
        <h5 className="fs-14 mb-0">{row.member}</h5>
        <span className="fs-12 text-muted">{row.id} · {row.book} · {row.accession}</span>
      </div>
      <div className="ms-auto text-end">
        <span className="fs-12 text-muted d-block">{caption}</span>
        <span className={`fs-16 fw-semibold${tint ? ` text-${tint}` : ''}`}>{value}</span>
      </div>
    </div>
  </div>
);

const infoRow = (label: string, value: string, badge?: string) => (
  <div className="d-flex align-items-center justify-content-between mb-2" key={label}>
    <span className="fs-13 text-muted">{label}</span>
    {badge ? <span className={badge}>{value}</span> : <span className="fs-13 fw-medium">{value}</span>}
  </div>
);

const tile = (label: string, value: string, tint?: string) => (
  <div className="col-md-3" key={label}>
    <div className="border rounded p-3 text-center">
      <span className="fs-12 text-muted d-block mb-1">{label}</span>
      <h5 className={`mb-0${tint ? ` text-${tint}` : ''}`}>{value}</h5>
    </div>
  </div>
);

const Switch = ({ id, label, checked, onChange, last = false }: {
  id: string; label: string; checked: boolean; onChange: (value: boolean) => void; last?: boolean;
}) => (
  <div className={`form-check form-switch ${last ? 'mb-0' : 'mb-2'}`}>
    <input
      className="form-check-input" type="checkbox" role="switch" id={id}
      checked={checked} onChange={(event) => onChange(event.target.checked)}
    />
    <label className="form-check-label fs-13" htmlFor={id}>{label}</label>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const ReservationModals = ({
  active, row, onClose, onCreate, onApprove, onMarkReady, onCompletePickup, onCancel, onOpen,
}: ReservationModalsProps) => {
  const [draft, setDraft] = useState<ReservationDraft>(emptyDraft);
  const [approve, setApprove] = useState<ApproveResult>({
    approvedBy: librarianChoices[0], approvalDate: '31-07-2026',
    placement: queuePlacementOptions[0], holdDuration: '72 hours',
    remarks: '', override: false, notify: true,
  });
  const [ready, setReady] = useState<ReadyResult>({
    copy: '', pickupPoint: 'Library front desk', availableFrom: '30-07-2026',
    deadline: '02-08-2026', shelfNote: '', email: true, sms: true,
  });
  const [pickup, setPickup] = useState<PickupResult>({
    collectedOn: '31-07-2026', issuedBy: issuedByChoices[0], loanPeriod: loanPeriodOptions[1],
    dueDate: '21-08-2026', condition: 'Good', createIssue: true, advanceQueue: true,
  });
  const [cancel, setCancel] = useState<CancelResult>({
    reason: cancellationReasons[0], cancelledBy: cancelledByChoices[0],
    remarks: '', release: true, notify: true,
  });

  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    if (active === 'approve' && row) {
      setApprove({
        approvedBy: librarianChoices[0], approvalDate: '31-07-2026',
        placement: row.availableNow > 0 ? queuePlacementOptions[0] : queuePlacementOptions[1],
        holdDuration: '72 hours', remarks: '', override: false, notify: true,
      });
    }
    if (active === 'ready' && row) {
      const availableFrom = row.allocatedOn ? toInputDate(row.allocatedOn) : '30-07-2026';
      setReady({
        copy: copyChoices(row)[0],
        pickupPoint: pickupPointOptions.includes(row.pickupPoint) ? row.pickupPoint : pickupPointOptions[0],
        availableFrom,
        deadline: addDaysInput(availableFrom, spanDays(row.holdDuration) || 3),
        shelfNote: row.holdShelf === '—' ? '' : row.holdShelf,
        email: true,
        sms: true,
      });
    }
    if (active === 'complete') {
      setPickup({
        collectedOn: '31-07-2026', issuedBy: issuedByChoices[0],
        loanPeriod: row?.category === 'Fiction' ? loanPeriodOptions[1] : loanPeriodOptions[0],
        dueDate: addDaysInput('31-07-2026', spanDays(row?.category === 'Fiction' ? loanPeriodOptions[1] : loanPeriodOptions[0])),
        condition: 'Good', createIssue: true, advanceQueue: true,
      });
    }
    if (active === 'cancel') {
      setCancel({
        reason: cancellationReasons[0], cancelledBy: cancelledByChoices[0],
        remarks: '', release: true, notify: true,
      });
    }
  }, [active, row]);

  /** The template's inline note under the Add form's Member row. */
  const chosenBook = useMemo(
    () => bookChoices.find((choice) => choice.label === draft.book) ?? null,
    [draft.book],
  );

  const setReadyField = <K extends keyof ReadyResult>(key: K, value: ReadyResult[K]) =>
    setReady((current) => ({ ...current, [key]: value }));

  return (
    <>
      {/* Add Reservation */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Reservation"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Reservation</button>
          </>
        }
      >
        <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
          <DialogHead
            tint="primary" icon="ti ti-bookmark" title="Add Reservation"
            subtitle="Place a hold on a title for a library member"
          />
        </div>
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="book-title">Book Title</label>
            <SelectField
              options={bookChoices}
              value={draft.book}
              onChange={(next: string) => setDraft((current) => ({ ...current, book: next }))}
              id="book-title"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="member">Member</label>
            <SelectField
              options={memberChoices}
              value={draft.member}
              onChange={(next: string) => {
                const value = next;
                const choice = memberChoices.find((item) => item.label === value);
                setDraft((current) => ({
                  ...current,
                  member: value,
                  memberType: choice?.memberType ?? current.memberType,
                }));
              }}
              id="member"
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="member-type-2">Member Type</label>
            <SelectField
              options={memberTypeOptions}
              value={draft.memberType}
              onChange={(next: string) =>
                setDraft((current) => ({ ...current, memberType: next as MemberType }))}
              id="member-type-2"
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="reserved-on">Reserved On</label>
            <TimeField
              value={draft.reservedOn}
              onChange={(next: string) => setDraft((current) => ({ ...current, reservedOn: next }))}
              id="reserved-on"
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="hold-duration">Hold Duration</label>
            <SelectField
              options={holdDurationOptions}
              value={draft.holdDuration}
              onChange={(next: string) => setDraft((current) => ({ ...current, holdDuration: next }))}
              id="hold-duration"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="pickup-point">Pickup Point</label>
            <SelectField
              options={pickupPointOptions}
              value={draft.pickupPoint}
              onChange={(next: string) => setDraft((current) => ({ ...current, pickupPoint: next }))}
              id="pickup-point"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="assign-librarian">Assign Librarian</label>
            <SelectField
              options={assignChoices}
              value={draft.librarian}
              onChange={(next: string) => setDraft((current) => ({ ...current, librarian: next }))}
              id="assign-librarian"
            />
          </div></div>
          {chosenBook ? (
            <div className="col-md-12">
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                <span
                  className={`avatar avatar-sm bg-${chosenBook.availableNow > 0 ? 'success' : 'warning'}-transparent text-${chosenBook.availableNow > 0 ? 'success' : 'warning'} rounded flex-shrink-0`}
                >
                  <i className={chosenBook.availableNow > 0 ? 'ti ti-checks' : 'ti ti-users'} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h5 className="fs-13 mb-0">
                    {chosenBook.availableNow > 0
                      ? `${chosenBook.availableNow} of ${chosenBook.totalCopies} copies on the shelf`
                      : 'All copies currently issued'}
                  </h5>
                  <span className="fs-12 text-muted">
                    {chosenBook.availableNow > 0
                      ? 'Reservation will be held for staff approval'
                      : 'Member will be added to the waiting list'}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor="internal-notes">Internal Notes</label>
            <textarea
              className="form-control" rows={2} id="internal-notes"
              placeholder="Visible to library staff only"
              value={draft.notes}
              onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
            />
          </div></div>
          <div className="col-md-12">
            <Switch
              id="addRvNotify" label="Notify the member when a copy becomes available"
              checked={draft.notifyOnAvailable}
              onChange={(value) => setDraft((current) => ({ ...current, notifyOnAvailable: value }))}
            />
            <Switch
              id="addRvAuto" label="Auto-expire the hold if not collected in time" last
              checked={draft.autoExpire}
              onChange={(value) => setDraft((current) => ({ ...current, autoExpire: value }))}
            />
          </div>
        </div>
      </Modal>

      {/* View Reservation */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.book ?? 'Reservation'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('cancel')}>
              <i className="ti ti-circle-x me-1" />Cancel Reservation
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('complete')}>
              <i className="ti ti-circle-check me-1" />Complete Pickup
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
              <DialogHead
                tint={row.bookTint} icon="ti ti-book" title={row.book}
                subtitle={`${row.id} • ${row.category} • ${row.accession}`}
              />
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <span className="avatar avatar-lg rounded flex-shrink-0">
                <img src={photoOf(row.member)} className="rounded" alt={row.member} />
              </span>
              <div>
                <h5 className="mb-0 fs-15">{row.member}</h5>
                <span className="fs-12 text-muted">{row.memberId} · {row.memberMeta}</span>
              </div>
              <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
            </div>
            <div className="row g-3 mb-3">
              {tile('Total Copies', String(row.totalCopies))}
              {tile('Available', String(row.availableNow), 'success')}
              {tile('On Hold', String(onHold(row)), 'warning')}
              {tile('Waiting List', String(row.waitingList.length))}
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Reservation Information</h6>
                <div className="border rounded p-3">
                  {infoRow('Reserved On', row.reservedOn)}
                  {infoRow('Approved By', row.approvedBy ?? '—')}
                  {infoRow('Allocated On', row.allocatedOn ?? '—')}
                  <div className="d-flex align-items-center justify-content-between mb-0">
                    <span className="fs-13 text-muted">Queue Position</span>
                    <span className={queueBadge(row).badge}>{queueBadge(row).label}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Pickup Details</h6>
                <div className="border rounded p-3">
                  {infoRow('Pickup Point', row.pickupPoint)}
                  {infoRow('Available From', row.availableFrom)}
                  {infoRow('Deadline', row.deadlineTime)}
                  <div className="d-flex align-items-center justify-content-between mb-0">
                    <span className="fs-13 text-muted">Time Remaining</span>
                    <span className={`badge badge-soft-${row.status === 'Expired' ? 'danger' : 'success'}`}>
                      {remainingBadge(row)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h6 className="fs-13 mb-2">Waiting List</h6>
            {row.waitingList.length === 0 ? (
              <p className="fs-13 text-muted mb-3">{row.waitingNote}</p>
            ) : (
              row.waitingList.map((entry, index) => (
                <div
                  className={`d-flex align-items-center gap-2 border rounded p-2 ${index === row.waitingList.length - 1 ? 'mb-3' : 'mb-2'}`}
                  key={entry.name}
                >
                  <span className="avatar avatar-sm rounded flex-shrink-0">
                    <img src={photoOf(entry.name)} className="rounded" alt={entry.name} />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">{entry.name}</h6>
                    <span className="fs-12 text-muted">{queueEntryPanelMeta(entry)}</span>
                  </div>
                  {entry.position === null ? null : (
                    <span className="badge badge-soft-warning">Position {entry.position}</span>
                  )}
                </div>
              ))
            )}
            <h6 className="fs-13 mb-1">Internal Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>

      {/* Approve Reservation */}
      <Modal
        open={active === 'approve' && row !== null}
        onClose={onClose}
        title="Approve Reservation"
        onSubmit={(event) => { event.preventDefault(); onApprove(approve); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button
              type="submit" className="btn btn-success"
              disabled={row !== null && atLimit(row) && !approve.override}
            >
              Approve Reservation
            </button>
          </>
        }
      >
        {row ? (
          <>
            {atLimit(row) ? (
              <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This member already holds {booksHeldLabel(row)} permitted books. Approving will
                  exceed the borrowing limit.
                </span>
              </div>
            ) : null}
            <MemberStrip
              row={row} caption="Books Held" value={booksHeldLabel(row)}
              tint={atLimit(row) ? 'warning' : undefined}
            />
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="approved-by">Approved By</label>
                <SelectField
                  options={librarianChoices}
                  value={approve.approvedBy}
                  onChange={(next: string) => setApprove((current) => ({ ...current, approvedBy: next }))}
                  id="approved-by"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="approval-date">Approval Date</label>
                <TimeField
                  value={approve.approvalDate}
                  onChange={(next: string) => setApprove((current) => ({ ...current, approvalDate: next }))}
                  id="approval-date"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="queue-placement">Queue Placement</label>
                <SelectField
                  options={queuePlacementOptions}
                  value={approve.placement}
                  onChange={(next: string) => setApprove((current) => ({ ...current, placement: next }))}
                  id="queue-placement"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="hold-duration-2">Hold Duration</label>
                <SelectField
                  options={holdDurationOptions}
                  value={approve.holdDuration}
                  onChange={(next: string) => setApprove((current) => ({ ...current, holdDuration: next }))}
                  id="hold-duration-2"
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="approval-remarks">Approval Remarks</label>
                <textarea
                  className="form-control" rows={2} id="approval-remarks"
                  placeholder="Recorded on the reservation timeline"
                  value={approve.remarks}
                  onChange={(event) => setApprove((current) => ({ ...current, remarks: event.target.value }))}
                />
              </div></div>
              <div className="col-md-12">
                <Switch
                  id="apOverride" label="Override the borrowing limit for this reservation"
                  checked={approve.override}
                  onChange={(value) => setApprove((current) => ({ ...current, override: value }))}
                />
                <Switch
                  id="apNotify" label="Notify the member by email" last
                  checked={approve.notify}
                  onChange={(value) => setApprove((current) => ({ ...current, notify: value }))}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Mark as Ready for Pickup */}
      <Modal
        open={active === 'ready' && row !== null}
        onClose={onClose}
        title="Mark as Ready for Pickup"
        onSubmit={(event) => { event.preventDefault(); onMarkReady(ready); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-checks me-1" />Mark Ready
            </button>
          </>
        }
      >
        {row ? (
          <>
            <MemberStrip
              row={row} caption="Copies Free"
              value={`${row.availableNow} of ${row.totalCopies}`}
              tint={row.availableNow > 0 ? 'success' : 'warning'}
            />
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="allocated-copy">Allocated Copy</label>
                <SelectField
                  options={copyChoices(row)}
                  value={ready.copy}
                  onChange={(next: string) => setReadyField('copy', next)}
                  id="allocated-copy"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pickup-point-2">Pickup Point</label>
                <SelectField
                  options={pickupPointOptions}
                  value={ready.pickupPoint}
                  onChange={(next: string) => setReadyField('pickupPoint', next)}
                  id="pickup-point-2"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="available-from">Available From</label>
                <TimeField
                  value={ready.availableFrom}
                  onChange={(next: string) => {
                    const value = next;
                    setReady((current) => ({
                      ...current,
                      availableFrom: value,
                      deadline: addDaysInput(value, spanDays(row.holdDuration) || 3),
                    }));
                  }}
                  id="available-from"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="pickup-deadline-2">Pickup Deadline</label>
                <TimeField
                  value={ready.deadline}
                  onChange={(next: string) => setReadyField('deadline', next)}
                  id="pickup-deadline-2"
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="shelf-note">Shelf Note</label>
                <input
                  type="text" className="form-control" id="shelf-note"
                  placeholder="e.g. Hold shelf slot H-14"
                  value={ready.shelfNote}
                  onChange={(event) => setReadyField('shelfNote', event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <Switch
                  id="mrEmail" label="Send the ready-for-pickup email"
                  checked={ready.email} onChange={(value) => setReadyField('email', value)}
                />
                <Switch
                  id="mrSms" label="Also send an SMS reminder 24 hours before expiry" last
                  checked={ready.sms} onChange={(value) => setReadyField('sms', value)}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Complete Pickup */}
      <Modal
        open={active === 'complete' && row !== null}
        onClose={onClose}
        title="Complete Pickup"
        onSubmit={(event) => { event.preventDefault(); onCompletePickup(pickup); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-circle-check me-1" />Complete Pickup
            </button>
          </>
        }
      >
        {row ? (
          <>
            <MemberStrip row={row} caption="Books Held" value={booksHeldLabel(row)} />
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="collected-on">Collected On</label>
                <TimeField
                  value={pickup.collectedOn}
                  onChange={(next: string) => {
                    const value = next;
                    setPickup((current) => ({
                      ...current,
                      collectedOn: value,
                      dueDate: addDaysInput(value, spanDays(current.loanPeriod)),
                    }));
                  }}
                  id="collected-on"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="issued-by">Issued By</label>
                <SelectField
                  options={issuedByChoices}
                  value={pickup.issuedBy}
                  onChange={(next: string) => setPickup((current) => ({ ...current, issuedBy: next }))}
                  id="issued-by"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="loan-period">Loan Period</label>
                <SelectField
                  options={loanPeriodOptions}
                  value={pickup.loanPeriod}
                  onChange={(next: string) => {
                    const value = next;
                    setPickup((current) => ({
                      ...current,
                      loanPeriod: value,
                      dueDate: addDaysInput(current.collectedOn, spanDays(value)),
                    }));
                  }}
                  id="loan-period"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="due-date">Due Date</label>
                <TimeField
                  value={pickup.dueDate}
                  onChange={(next: string) => setPickup((current) => ({ ...current, dueDate: next }))}
                  id="due-date"
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="condition-on-issue">Condition on Issue</label>
                <SelectField
                  options={conditionOptions}
                  value={pickup.condition}
                  onChange={(next: string) => setPickup((current) => ({ ...current, condition: next }))}
                  id="condition-on-issue"
                />
              </div></div>
              <div className="col-md-12">
                <Switch
                  id="cpIssue" label="Create the issue record and close the reservation"
                  checked={pickup.createIssue}
                  onChange={(value) => setPickup((current) => ({ ...current, createIssue: value }))}
                />
                <Switch
                  id="cpQueue" label="Advance the waiting list for this title" last
                  checked={pickup.advanceQueue}
                  onChange={(value) => setPickup((current) => ({ ...current, advanceQueue: value }))}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Cancel Reservation */}
      <Modal
        open={active === 'cancel' && row !== null}
        onClose={onClose}
        title="Cancel Reservation"
        onSubmit={(event) => { event.preventDefault(); onCancel(cancel); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Reservation</button>
            <button type="submit" className="btn btn-danger">Cancel Reservation</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Cancelling releases the held copy and moves the next member in the queue up one
                position.
              </span>
            </div>
            <MemberStrip
              row={row} caption="Waiting List" value={String(row.waitingList.length)} tint="warning"
            />
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="cancellation-reason">Cancellation Reason</label>
                <SelectField
                  options={cancellationReasons}
                  value={cancel.reason}
                  onChange={(next: string) => setCancel((current) => ({ ...current, reason: next }))}
                  id="cancellation-reason"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="cancelled-by">Cancelled By</label>
                <SelectField
                  options={cancelledByChoices}
                  value={cancel.cancelledBy}
                  onChange={(next: string) => setCancel((current) => ({ ...current, cancelledBy: next }))}
                  id="cancelled-by"
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="remarks"
                  placeholder="Recorded on the reservation timeline"
                  value={cancel.remarks}
                  onChange={(event) => setCancel((current) => ({ ...current, remarks: event.target.value }))}
                />
              </div></div>
              <div className="col-md-12">
                <Switch
                  id="cnRelease" label="Release the copy to the next member in the queue"
                  checked={cancel.release}
                  onChange={(value) => setCancel((current) => ({ ...current, release: value }))}
                />
                <Switch
                  id="cnNotify" label="Notify the member by email" last
                  checked={cancel.notify}
                  onChange={(value) => setCancel((current) => ({ ...current, notify: value }))}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default ReservationModals;
