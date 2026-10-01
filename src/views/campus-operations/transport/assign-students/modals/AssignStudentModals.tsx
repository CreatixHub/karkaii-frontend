import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import SelectField from '@components/ui/SelectField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { StudentAssignment } from '../data/studentAssignments.data';
import {
  classOptions,
  driverLabel,
  dropPointOptions,
  feeBadge,
  feeState,
  pickupPointOptions,
  routeLabel,
  routeOptions,
  sectionOptions,
  statusBadge,
  vehicleLabel,
  vehicleOptions,
} from '../data/studentAssignments.data';

export type StudentModalId =
  | 'assign' | 'view' | 'change-route' | 'change-vehicle' | 'change-pickup' | 'remove';

export interface StudentAssignDraft {
  student: string;
  className: string;
  section: string;
  route: string;
  vehicle: string;
  pickupPoint: string;
  dropPoint: string;
  seatNo: string;
}

export const emptyDraft: StudentAssignDraft = {
  student: '', className: classOptions[0], section: sectionOptions[0],
  route: '', vehicle: '', pickupPoint: '', dropPoint: dropPointOptions[0], seatNo: '',
};

/** What each "change one part" dialog hands back. */
export interface SwapResult {
  value: string;
  reason: string;
}

export interface AssignStudentModalsProps {
  active: StudentModalId | null;
  row: StudentAssignment | null;
  /** Students with no route yet, offered by the Assign dialog. */
  waiting: StudentAssignment[];
  onClose: () => void;
  onAssign: (draft: StudentAssignDraft) => void;
  onChangeRoute: (result: SwapResult) => void;
  onChangeVehicle: (result: SwapResult) => void;
  onChangePickup: (result: SwapResult) => void;
  onRemove: (reason: string) => void;
  /** Lets View hand off to Change Route, as the template's footer does. */
  onOpen: (modal: StudentModalId) => void;
}

const reasonOptions = [
  'Route restructured',
  'Address changed',
  'Capacity rebalanced',
  'Parent request',
  'Fee arrears',
  'Other',
];

const pair = (label: string, value: string) => (
  <div className="d-flex align-items-center justify-content-between mb-2" key={label}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const AssignStudentModals = ({
  active, row, waiting, onClose, onAssign, onChangeRoute, onChangeVehicle,
  onChangePickup, onRemove, onOpen,
}: AssignStudentModalsProps) => {
  const [draft, setDraft] = useState<StudentAssignDraft>(emptyDraft);
  const [swap, setSwap] = useState<SwapResult>({ value: '', reason: reasonOptions[0] });
  const [removeReason, setRemoveReason] = useState(reasonOptions[0]);

  useEffect(() => {
    if (active === 'assign') setDraft(emptyDraft);
    if (active === 'change-route') {
      setSwap({ value: row?.routeCode ? routeLabel(row) : '', reason: reasonOptions[0] });
    }
    if (active === 'change-vehicle') setSwap({ value: row?.vehicle ?? '', reason: reasonOptions[2] });
    if (active === 'change-pickup') setSwap({ value: row?.pickupPoint ?? '', reason: reasonOptions[1] });
    if (active === 'remove') setRemoveReason(reasonOptions[0]);
  }, [active, row]);

  const field = <K extends keyof StudentAssignDraft>(key: K, value: StudentAssignDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const cancel = <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>;

  /** The read-only Student field every swap dialog opens with. */
  const studentField = (id: string, student: StudentAssignment) => (
    <div className="col-md-12"><div className="mb-3">
      <label className="form-label" htmlFor={id}>Student</label>
      <input
        type="text" className="form-control" id={id}
        value={`${student.name} · ${student.admissionNo} · ${student.className}`}
        readOnly
      />
    </div></div>
  );

  /** The three swap dialogs differ only in label, options and handler. */
  const swapDialog = (
    id: StudentModalId,
    title: string,
    label: string,
    options: readonly string[],
    blank: string,
    submit: (result: SwapResult) => void,
    action: string,
  ) => (
    <Modal
      open={active === id && row !== null}
      onClose={onClose}
      title={title}
      formClassName="validated-form"
      onSubmit={(event) => { event.preventDefault(); submit(swap); }}
      footer={<>{cancel}<button type="submit" className="btn btn-primary">{action}</button></>}
    >
      {row ? (
        <div className="row">
          {studentField(`${id}-student`, row)}
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor={`${id}-value`}>
              {label} <span className="text-danger">*</span>
            </label>
            <SelectField
              options={options}
              value={swap.value}
              onChange={(value) => setSwap((current) => ({ ...current, value }))}
              id={`${id}-value`}
              blankLabel={blank}
            />
          </div></div>
          <div className="col-md-12"><div className="mb-0">
            <label className="form-label" htmlFor={`${id}-reason`}>Reason</label>
            <SelectField
              options={reasonOptions}
              value={swap.reason}
              onChange={(reason) => setSwap((current) => ({ ...current, reason }))}
              id={`${id}-reason`}
            />
          </div></div>
        </div>
      ) : null}
    </Modal>
  );

  return (
    <>
      {/* Assign Students */}
      <Modal
        open={active === 'assign'}
        onClose={onClose}
        title="Assign Students"
        dialogClassName="modal-lg"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssign(draft); }}
        footer={<>{cancel}<button type="submit" className="btn btn-primary">Assign Students</button></>}
      >
        <div className="row">
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor="assign-student">
              Student <span className="text-danger">*</span>
            </label>
            <SelectField
              options={waiting.map((student) => ({
                value: student.id,
                label: `${student.name} · ${student.admissionNo} · ${student.className}`,
              }))}
              value={draft.student}
              onChange={(value) => field('student', value)}
              id="assign-student"
              blankLabel={waiting.length === 0 ? 'No students awaiting a route' : 'Select student'}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="assign-route">
              Route <span className="text-danger">*</span>
            </label>
            <SelectField
              options={routeOptions.filter((option) => option !== 'Not assigned')}
              value={draft.route}
              onChange={(value) => field('route', value)}
              id="assign-route"
              blankLabel="Select route"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="assign-vehicle">Vehicle</label>
            <SelectField
              options={vehicleOptions}
              value={draft.vehicle}
              onChange={(value) => field('vehicle', value)}
              id="assign-vehicle"
              blankLabel="Select vehicle"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="assign-pickup">
              Pickup Point <span className="text-danger">*</span>
            </label>
            <SelectField
              options={pickupPointOptions}
              value={draft.pickupPoint}
              onChange={(value) => field('pickupPoint', value)}
              id="assign-pickup"
              blankLabel="Select pickup point"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="assign-drop">Drop Point</label>
            <SelectField
              options={dropPointOptions}
              value={draft.dropPoint}
              onChange={(value) => field('dropPoint', value)}
              id="assign-drop"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="assign-seat">Seat No.</label>
            <input
              type="text" className="form-control" id="assign-seat" placeholder="A-12"
              value={draft.seatNo} onChange={(event) => field('seatNo', event.target.value)}
            />
          </div></div>
        </div>
      </Modal>

      {/* View Assignment */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Assignment Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('change-route')}>
              <i className="ti ti-route me-1" />Change Route
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
              <span className="avatar avatar-lg">
                <ImageWithBasePath src={row.photo} className="rounded" alt={row.name} />
              </span>
              <div>
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  {row.name}
                  <span className={statusBadge[row.status]}>{row.status}</span>
                </h5>
                <span className="fs-12 text-muted">
                  {row.admissionNo} · {row.className} · {row.roll}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Route &amp; Vehicle</h6>
                <div className="border rounded p-3">
                  {pair('Route', routeLabel(row))}
                  {pair('Vehicle', vehicleLabel(row))}
                  {pair('Driver', driverLabel(row))}
                  {pair('Seat No.', row.seatNo)}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Stops</h6>
                <div className="border rounded p-3">
                  {pair('Pickup Point', row.pickupPoint)}
                  {pair('Drop Point', row.dropPoint)}
                  {pair('Academic Year', row.academicYear)}
                </div>
              </div>
              <div className="col-md-12">
                <h6 className="fs-13 mb-2">Transport Fee</h6>
                <div className="border rounded p-3 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="fs-13 fw-medium d-block">{row.fee}</span>
                    <span className="fs-12 text-muted">{row.feeNote}</span>
                  </div>
                  <span className={feeBadge[feeState(row)]}>{feeState(row)}</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {swapDialog(
        'change-route', 'Change Route', 'New Route',
        routeOptions, 'Select route', onChangeRoute, 'Change Route',
      )}
      {swapDialog(
        'change-vehicle', 'Change Vehicle', 'New Vehicle',
        vehicleOptions, 'Select vehicle', onChangeVehicle, 'Change Vehicle',
      )}
      {swapDialog(
        'change-pickup', 'Change Pickup Point', 'New Pickup Point',
        pickupPointOptions, 'Select pickup point', onChangePickup, 'Change Pickup Point',
      )}

      {/* Remove Assignment */}
      <Modal
        open={active === 'remove' && row !== null}
        onClose={onClose}
        title="Remove Assignment"
        onSubmit={(event) => { event.preventDefault(); onRemove(removeReason); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Assignment</button>
            <button type="submit" className="btn btn-danger">Remove Assignment</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                {row.name} will come off {routeLabel(row)} and return to the waiting list.
                Seat {row.seatNo} frees up immediately.
              </span>
            </div>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md">
                  <ImageWithBasePath src={row.photo} className="rounded" alt={row.name} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.name}</h5>
                  <span className="fs-12 text-muted">
                    {row.admissionNo} · {row.className} · {row.pickupPoint}
                  </span>
                </div>
                <div className="ms-auto text-end">
                  <span className={statusBadge[row.status]}>{row.status}</span>
                </div>
              </div>
            </div>
            <div className="mb-0">
              <label className="form-label" htmlFor="remove-student-reason">Reason</label>
              <SelectField
                options={reasonOptions}
                value={removeReason}
                onChange={setRemoveReason}
                id="remove-student-reason"
              />
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default AssignStudentModals;
