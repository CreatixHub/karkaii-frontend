import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Allocation } from '../data/allocations.data';
import {
  academicYearOptions,
  bedChoices,
  bedReasonOptions,
  bedsFreeOf,
  bedsOf,
  blockOptions,
  changeReasonOptions,
  floorOptions,
  hostelChoices,
  hostelInfoOf,
  hostelLabelOf,
  money,
  occupancyOf,
  placementOf,
  releaseBedOptions,
  roomChoices,
  roomConditionOptions,
  roomTypeOptions,
  roomTypeTint,
  statusBadge,
  studentChoices,
  studentLineOf,
  summaryOf,
  swapChoicesOf,
  transferReasonOptions,
  transferRoomOptions,
  transferTargets,
  vacateReasonOptions,
  wardenContactOf,
  wardenOf,
} from '../data/allocations.data';

export type AllocationModalId =
  | 'allocate' | 'change-room' | 'change-bed' | 'transfer' | 'view' | 'vacate';

export interface AllocateDraft {
  student: string;
  hostel: string;
  block: string;
  floor: string;
  roomType: string;
  room: string;
  bed: string;
  checkIn: string;
  academicYear: string;
  fee: string;
  notes: string;
  invoice: boolean;
  notify: boolean;
}

export const emptyAllocateDraft: AllocateDraft = {
  student: '', hostel: '', block: blockOptions[0], floor: floorOptions[0],
  roomType: roomTypeOptions[0], room: '', bed: bedChoices[0], checkIn: '05-08-2026',
  academicYear: academicYearOptions[0], fee: '2100.00', notes: '', invoice: true, notify: true,
};

export interface AllocationModalsProps {
  active: AllocationModalId | null;
  row: Allocation | null;
  onClose: () => void;
  onAllocate: (draft: AllocateDraft) => void;
  onChangeRoom: (block: string, floor: string, room: string, bed: string, reason: string) => void;
  onChangeBed: (bed: string, reason: string, swap: boolean) => void;
  onTransfer: (hostel: string, room: string, bed: string, reason: string) => void;
  onVacate: (reason: string, checkOut: string, release: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** The View dialog hands off to Transfer Hostel and to the offcanvas. */
  onOpen: (modal: AllocationModalId) => void;
  onOpenPanel: () => void;
}

/** The label/value line the dialogs and the panel both use. */
const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const AllocationModals = ({
  active, row, onClose, onAllocate, onChangeRoom, onChangeBed, onTransfer, onVacate,
  onToast, onOpen, onOpenPanel,
}: AllocationModalsProps) => {
  const [draft, setDraft] = useState<AllocateDraft>(emptyAllocateDraft);
  const [newBlock, setNewBlock] = useState(blockOptions[0]);
  const [newFloor, setNewFloor] = useState(floorOptions[1]);
  const [newRoom, setNewRoom] = useState(roomChoices[1]);
  const [newRoomBed, setNewRoomBed] = useState('Auto-assign next free bed');
  const [effectiveFrom, setEffectiveFrom] = useState('05-08-2026');
  const [roomReason, setRoomReason] = useState(changeReasonOptions[0]);
  const [roomRemarks, setRoomRemarks] = useState('');
  const [releaseBed, setReleaseBed] = useState(true);
  const [notifyRoom, setNotifyRoom] = useState(true);

  const [swapBed, setSwapBed] = useState('');
  const [bedFrom, setBedFrom] = useState('01-08-2026');
  const [bedReason, setBedReason] = useState(bedReasonOptions[0]);
  const [bedRemarks, setBedRemarks] = useState('');
  const [swapOccupant, setSwapOccupant] = useState(true);

  const [transferTo, setTransferTo] = useState('');
  const [transferRoom, setTransferRoom] = useState(transferRoomOptions[0]);
  const [transferBed, setTransferBed] = useState(bedChoices[0]);
  const [transferDate, setTransferDate] = useState('10-08-2026');
  const [transferReason, setTransferReason] = useState(transferReasonOptions[0]);
  const [transferRemarks, setTransferRemarks] = useState('');
  const [recalcFee, setRecalcFee] = useState(true);
  const [notifyTransfer, setNotifyTransfer] = useState(true);

  const [vacateReason, setVacateReason] = useState(vacateReasonOptions[0]);
  const [checkOut, setCheckOut] = useState('15-08-2026');
  const [condition, setCondition] = useState(roomConditionOptions[0]);
  const [release, setRelease] = useState(releaseBedOptions[0]);
  const [vacateRemarks, setVacateRemarks] = useState('');
  const [refund, setRefund] = useState(false);
  const [notifyVacate, setNotifyVacate] = useState(true);

  /** Each opening seeds from the row being acted on. */
  useEffect(() => {
    if (active === 'allocate') setDraft(emptyAllocateDraft);

    if (active === 'change-room' && row) {
      setNewBlock(row.block || blockOptions[0]);
      setNewFloor(row.floor || floorOptions[1]);
      setNewRoom(roomChoices[1]);
      setNewRoomBed('Auto-assign next free bed');
      setEffectiveFrom('05-08-2026');
      setRoomReason(changeReasonOptions[0]);
      setRoomRemarks(row.status === 'Transfer Requested' ? row.notes : '');
      setReleaseBed(true);
      setNotifyRoom(true);
    }
    if (active === 'change-bed' && row) {
      setSwapBed('');
      setBedFrom('01-08-2026');
      setBedReason(bedReasonOptions[0]);
      setBedRemarks('');
      setSwapOccupant(true);
    }
    if (active === 'transfer' && row) {
      setTransferTo('');
      setTransferRoom(transferRoomOptions[0]);
      setTransferBed(bedChoices[0]);
      setTransferDate('10-08-2026');
      setTransferReason(transferReasonOptions[0]);
      setTransferRemarks('');
    }
    if (active === 'vacate' && row) {
      setVacateReason(vacateReasonOptions[0]);
      setCheckOut('15-08-2026');
      setCondition(roomConditionOptions[0]);
      setRelease(releaseBedOptions[0]);
      setVacateRemarks('');
      setRefund(false);
      setNotifyVacate(true);
    }
  }, [active, row]);

  const field = (key: keyof AllocateDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const beds = row ? bedsOf(row) : [];
  /** A transfer only ever moves a student to a hostel they are not already in. */
  const targets = row
    ? transferTargets.filter((target) => !target.startsWith(hostelLabelOf(row)))
    : transferTargets;

  return (
    <>
      {/* Allocate Room */}
      <Modal
        open={active === 'allocate'}
        onClose={onClose}
        title="Allocate Room"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onAllocate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Allocate Room</button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                <i className="ti ti-bed" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-13 mb-0">Student › Hostel › Room › Bed</h5>
                <span className="fs-12 text-muted">
                  All four are required before the allocation can be confirmed
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="student">Student</label>
            <select
              className="form-select" id="student"
              value={draft.student} onChange={(event) => field('student', event.target.value)}
            >
              <option value="">Select student</option>
              {studentChoices.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="hostel-2">Hostel</label>
            <select
              className="form-select" id="hostel-2"
              value={draft.hostel} onChange={(event) => field('hostel', event.target.value)}
            >
              <option value="">Select hostel</option>
              {hostelChoices.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="block">Block</label>
            <select
              className="form-select" id="block"
              value={draft.block} onChange={(event) => field('block', event.target.value)}
            >
              {blockOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="floor">Floor</label>
            <select
              className="form-select" id="floor"
              value={draft.floor} onChange={(event) => field('floor', event.target.value)}
            >
              {floorOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="room-type-2">Room Type</label>
            <select
              className="form-select" id="room-type-2"
              value={draft.roomType} onChange={(event) => field('roomType', event.target.value)}
            >
              {roomTypeOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="room-no">Room No.</label>
            <select
              className="form-select" id="room-no"
              value={draft.room} onChange={(event) => field('room', event.target.value)}
            >
              <option value="">Select room</option>
              {roomChoices.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="bed-no">Bed No.</label>
            <select
              className="form-select" id="bed-no"
              value={draft.bed} onChange={(event) => field('bed', event.target.value)}
            >
              {bedChoices.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="check-in-date">Check-In Date</label>
            <DateField
              id="check-in-date" value={draft.checkIn}
              onChange={(value) => field('checkIn', value)}
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="academic-year-2">Academic Year</label>
            <select
              className="form-select" id="academic-year-2"
              value={draft.academicYear} onChange={(event) => field('academicYear', event.target.value)}
            >
              {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="hostel-fee-2">Hostel Fee</label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="text" className="form-control" id="hostel-fee-2"
                value={draft.fee} onChange={(event) => field('fee', event.target.value)}
              />
            </div>
          </div></div>
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor="internal-notes">Internal Notes</label>
            <textarea
              className="form-control" rows={2} placeholder="Visible to hostel staff only"
              id="internal-notes"
              value={draft.notes} onChange={(event) => field('notes', event.target.value)}
            />
          </div></div>
          <div className="col-md-12">
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input" type="checkbox" role="switch" id="arInvoice"
                checked={draft.invoice} onChange={(event) => field('invoice', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor="arInvoice">
                Raise the hostel fee invoice on allocation
              </label>
            </div>
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id="arNotify"
                checked={draft.notify} onChange={(event) => field('notify', event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor="arNotify">
                Notify the guardian and the warden
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Change Room */}
      <Modal
        open={active === 'change-room' && row !== null}
        onClose={onClose}
        title="Change Room"
        onSubmit={(event) => {
          event.preventDefault();
          onChangeRoom(newBlock, newFloor, newRoom, newRoomBed, roomReason);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Change Room</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.student}</h5>
                  <span className="fs-12 text-muted">
                    {row.hostel || 'Unassigned'} · {row.block || '—'} · {row.room || '—'} · bed {row.bed || '—'}
                  </span>
                </div>
                <div className="ms-auto text-end">
                  <span className="fs-12 text-muted d-block">Requested</span>
                  <span className="badge badge-soft-info">{newBlock}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-block">New Block</label>
                <select
                  className="form-select" id="new-block"
                  value={newBlock} onChange={(event) => setNewBlock(event.target.value)}
                >
                  {blockOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-floor">New Floor</label>
                <select
                  className="form-select" id="new-floor"
                  value={newFloor} onChange={(event) => setNewFloor(event.target.value)}
                >
                  {floorOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-room">New Room</label>
                <select
                  className="form-select" id="new-room"
                  value={newRoom} onChange={(event) => setNewRoom(event.target.value)}
                >
                  {roomChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-bed">New Bed</label>
                <select
                  className="form-select" id="new-bed"
                  value={newRoomBed} onChange={(event) => setNewRoomBed(event.target.value)}
                >
                  {bedChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="effective-from">Effective From</label>
                <DateField id="effective-from" value={effectiveFrom} onChange={setEffectiveFrom} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reason">Reason</label>
                <select
                  className="form-select" id="reason"
                  value={roomReason} onChange={(event) => setRoomReason(event.target.value)}
                >
                  {changeReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} placeholder="Recorded on the allocation history"
                  id="remarks"
                  value={roomRemarks} onChange={(event) => setRoomRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="crRelease"
                    checked={releaseBed} onChange={(event) => setReleaseBed(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="crRelease">
                    Release bed {row.room || '—'} / {row.bed || '—'} back to the pool
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="crNotifyRoom"
                    checked={notifyRoom} onChange={(event) => setNotifyRoom(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="crNotifyRoom">
                    Notify the guardian, warden and new roommates
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Change Bed */}
      <Modal
        open={active === 'change-bed' && row !== null}
        onClose={onClose}
        title="Change Bed"
        onSubmit={(event) => { event.preventDefault(); onChangeBed(swapBed, bedReason, swapOccupant); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Change Bed</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                <i className="ti ti-door" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-13 mb-0">Room {row.room || '—'} · {row.roomType}</h5>
                <span className="fs-12 text-muted">
                  {row.hostel || 'Unassigned'} · {row.block || '—'} · {row.floor || '—'} ·{' '}
                  {occupancyOf(row)} occupied
                </span>
              </div>
            </div>
            <p className="mb-2 fs-13 text-muted">Bed occupancy</p>
            <div className="row g-2 mb-3">
              {beds.map((slot) => (
                <div className="col-6" key={slot.label}>
                  <div className="border rounded p-2 d-flex align-items-center gap-2">
                    <span className={`badge badge-soft-${slot.self ? 'primary' : 'secondary'}`}>
                      {slot.label}
                    </span>
                    <span className={`fs-12 text-truncate ${slot.self ? 'fw-medium' : 'text-muted'}`}>
                      {slot.occupant}
                    </span>
                  </div>
                </div>
              ))}
              {beds.length === 0 ? (
                <div className="col-12">
                  <span className="fs-12 text-muted">No bed assigned yet.</span>
                </div>
              ) : null}
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="current-bed">Current Bed</label>
                <input type="text" className="form-control" value={row.bed || '—'} readOnly id="current-bed" />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-bed-2">New Bed</label>
                <select
                  className="form-select" id="new-bed-2"
                  value={swapBed} onChange={(event) => setSwapBed(event.target.value)}
                >
                  <option value="">Select bed</option>
                  {swapChoicesOf(row).map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="effective-from-2">Effective From</label>
                <DateField id="effective-from-2" value={bedFrom} onChange={setBedFrom} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reason-2">Reason</label>
                <select
                  className="form-select" id="reason-2"
                  value={bedReason} onChange={(event) => setBedReason(event.target.value)}
                >
                  {bedReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="remarks-2">Remarks</label>
                <textarea
                  className="form-control" rows={2} placeholder="Recorded on the allocation history"
                  id="remarks-2"
                  value={bedRemarks} onChange={(event) => setBedRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="cbSwap"
                    checked={swapOccupant} onChange={(event) => setSwapOccupant(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="cbSwap">
                    Swap the occupant rather than leaving the bed vacant
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Transfer Hostel */}
      <Modal
        open={active === 'transfer' && row !== null}
        onClose={onClose}
        title="Transfer Hostel"
        onSubmit={(event) => {
          event.preventDefault();
          onTransfer(transferTo, transferRoom, transferBed, transferReason);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Transfer Hostel</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                A hostel transfer releases the current room and bed, and recalculates the hostel fee for
                the new block.
              </span>
            </div>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.student}</h5>
                  <span className="fs-12 text-muted">{placementOf(row)}</span>
                </div>
                <div className="ms-auto text-end">
                  <span className="fs-12 text-muted d-block">Current Hostel</span>
                  <span className={`badge badge-soft-${hostelInfoOf(row.hostel)?.tint ?? 'secondary'}`}>
                    {row.hostel || 'Not assigned'}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-to">Transfer To</label>
                <select
                  className="form-select" id="transfer-to"
                  value={transferTo} onChange={(event) => setTransferTo(event.target.value)}
                >
                  <option value="">Select hostel</option>
                  {targets.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-room-2">New Room</label>
                <select
                  className="form-select" id="new-room-2"
                  value={transferRoom} onChange={(event) => setTransferRoom(event.target.value)}
                >
                  {transferRoomOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-bed-3">New Bed</label>
                <select
                  className="form-select" id="new-bed-3"
                  value={transferBed} onChange={(event) => setTransferBed(event.target.value)}
                >
                  {bedChoices.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="transfer-date">Transfer Date</label>
                <DateField id="transfer-date" value={transferDate} onChange={setTransferDate} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reason-3">Reason</label>
                <select
                  className="form-select" id="reason-3"
                  value={transferReason} onChange={(event) => setTransferReason(event.target.value)}
                >
                  {transferReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="remarks-3">Remarks</label>
                <textarea
                  className="form-control" rows={2} placeholder="Recorded on the allocation history"
                  id="remarks-3"
                  value={transferRemarks} onChange={(event) => setTransferRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="thFee"
                    checked={recalcFee} onChange={(event) => setRecalcFee(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="thFee">
                    Recalculate the hostel fee for the new hostel
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="thNotify"
                    checked={notifyTransfer} onChange={(event) => setNotifyTransfer(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="thNotify">
                    Notify both wardens and the guardian
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Allocation */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.id ?? 'Allocation'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('transfer')}>
              <i className="ti ti-arrows-exchange me-1" />Transfer Hostel
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-bed me-1" />Open Allocation Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">{summaryOf(row)}</p>
            <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
              <span className="avatar avatar-lg rounded flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
              </span>
              <div>
                <h5 className="mb-0 fs-15">{row.student}</h5>
                <span className="fs-12 text-muted">{studentLineOf(row)}</span>
              </div>
              <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
            </div>
            <div className="row g-3 mb-3">
              {[
                { label: 'Hostel', value: row.hostel || 'Not assigned', icon: 'ti ti-building-fortress', tint: 'purple' },
                { label: 'Room', value: row.room || '—', icon: 'ti ti-door', tint: 'info' },
                { label: 'Bed', value: row.bed || '—', icon: 'ti ti-bed', tint: 'primary' },
                { label: 'Check-In', value: row.checkIn || '—', icon: 'ti ti-calendar-event', tint: 'warning' },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="d-flex align-items-center gap-2 border rounded p-3 h-100">
                    <span className={`avatar avatar-md bg-${tile.tint}-transparent text-${tile.tint} rounded flex-shrink-0`}>
                      <i className={tile.icon} />
                    </span>
                    <div className="overflow-hidden">
                      <span className="fs-12 text-muted d-block">{tile.label}</span>
                      <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Room &amp; Occupancy</h6>
                <div className="border rounded p-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fs-13 text-muted">Room Type</span>
                    <span className={`badge badge-soft-${roomTypeTint[row.roomType]}`}>{row.roomType}</span>
                  </div>
                  <Row label="Block & Floor" value={row.block ? `${row.block} · ${row.floor}` : '—'} />
                  <Row label="Occupancy" value={row.capacity ? occupancyOf(row) : '—'} />
                  <div className="d-flex align-items-center justify-content-between mb-0">
                    <span className="fs-13 text-muted">Beds Free</span>
                    <span className={`badge badge-soft-${bedsFreeOf(row) === 0 ? 'danger' : 'success'}`}>
                      {bedsFreeOf(row)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Warden &amp; Check-in</h6>
                <div className="border rounded p-3">
                  <Row label="Warden" value={wardenOf(row)} />
                  <Row label="Warden Contact" value={wardenContactOf(row)} />
                  <Row label="Check-In" value={row.checkIn || '—'} />
                  <Row label="Check-Out" value={row.checkOut} last />
                </div>
              </div>
            </div>
            <h6 className="fs-13 mb-2">Hostel Fee</h6>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                <i className="ti ti-file-invoice" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0">Invoice {row.invoice}</h6>
                <span className="fs-12 text-muted">{row.invoiceNote}</span>
              </div>
              <span className="fs-13 fw-medium">{money(row.annualFee)}</span>
            </div>
            <h6 className="fs-13 mb-1">Internal Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.notes}</p>
          </>
        ) : null}
      </Modal>

      {/* Vacate Room */}
      <Modal
        open={active === 'vacate' && row !== null}
        onClose={onClose}
        title="Vacate Room"
        onSubmit={(event) => { event.preventDefault(); onVacate(vacateReason, checkOut, release); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Allocation</button>
            <button type="submit" className="btn btn-danger">Vacate Room</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Vacating releases bed {row.room || '—'} / {row.bed || '—'} to the waiting list and closes
                the allocation.
              </span>
            </div>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md rounded flex-shrink-0">
                  <ImageWithBasePath src={row.avatar} className="rounded" alt={row.student} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.student}</h5>
                  <span className="fs-12 text-muted">{placementOf(row)}</span>
                </div>
                <div className="ms-auto text-end">
                  <span className="fs-12 text-muted d-block">Fee Outstanding</span>
                  <span className="fs-16 fw-semibold text-danger">
                    {row.status === 'Fee Hold' ? money(row.annualFee) : money(0)}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="reason-4">Reason</label>
                <select
                  className="form-select" id="reason-4"
                  value={vacateReason} onChange={(event) => setVacateReason(event.target.value)}
                >
                  {vacateReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="check-out-date">Check-Out Date</label>
                <DateField id="check-out-date" value={checkOut} onChange={setCheckOut} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="room-condition">Room Condition</label>
                <select
                  className="form-select" id="room-condition"
                  value={condition} onChange={(event) => setCondition(event.target.value)}
                >
                  {roomConditionOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="release-bed-to">Release Bed To</label>
                <select
                  className="form-select" id="release-bed-to"
                  value={release} onChange={(event) => setRelease(event.target.value)}
                >
                  {releaseBedOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="remarks-4">Remarks</label>
                <textarea
                  className="form-control" rows={2} placeholder="Recorded on the allocation history"
                  id="remarks-4"
                  value={vacateRemarks} onChange={(event) => setVacateRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="vrRefund"
                    checked={refund} onChange={(event) => setRefund(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="vrRefund">
                    Raise a pro-rata hostel fee refund
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="vrNotify"
                    checked={notifyVacate} onChange={(event) => setNotifyVacate(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="vrNotify">
                    Notify the guardian and the warden
                  </label>
                </div>
              </div>
            </div>
            <button
              type="button" className="btn btn-link p-0 fs-12 mt-2"
              onClick={() => onToast(`Checkout sheet printed for ${row.student}`, 'info')}
            >
              Print the checkout sheet
            </button>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default AllocationModals;
