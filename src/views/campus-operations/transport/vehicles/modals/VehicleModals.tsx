import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import SelectField from '@components/ui/SelectField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { FuelType, Vehicle, VehicleStatus, VehicleType } from '../data/vehicles.data';
import {
  complianceBadge,
  complianceStateOf,
  documentsOf,
  driverContacts,
  driverLabelOf,
  driverOptions,
  fuelOptions,
  gpsIdOf,
  importModes,
  coverageOptions,
  policyNumberOf,
  routeLabelOf,
  routeOptions,
  serviceTypeOptions,
  shiftOptions,
  statusBadge,
  statusOptions,
  typeOptions,
  vehicleLabelOf,
} from '../data/vehicles.data';

export type VehicleModalId =
  | 'add' | 'edit' | 'view' | 'assign-driver' | 'assign-route' | 'maintenance'
  | 'insurance' | 'documents' | 'track' | 'import' | 'delete';

export interface VehicleDraft {
  number: string;
  model: string;
  mfgYear: string;
  registration: string;
  /** The template's Chassis No; no column in the redesigned grid. */
  chassis: string;
  seats: string;
  /** The template's GPS Tracking ID; derived on the row, editable here. */
  gpsId: string;
  driver: string;
  driverLicense: string;
  driverContact: string;
  /** The template's Driver Address; no column in the redesigned grid. */
  driverAddress: string;
  /* Fields the grid prints that the template's own form omits. */
  type: VehicleType;
  fuel: FuelType;
  route: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  fitnessExpiry: string;
  status: VehicleStatus;
}

export const emptyDraft: VehicleDraft = {
  number: '', model: '', mfgYear: '', registration: '', chassis: '', seats: '', gpsId: '',
  driver: '', driverLicense: '', driverContact: '', driverAddress: '',
  type: typeOptions[0], fuel: fuelOptions[0], route: '',
  insuranceExpiry: '', registrationExpiry: '', fitnessExpiry: '', status: 'Available',
};

export const draftOf = (row: Vehicle): VehicleDraft => ({
  number: row.number,
  model: row.model,
  mfgYear: String(row.mfgYear),
  registration: row.registration,
  chassis: '',
  seats: String(row.seats),
  gpsId: gpsIdOf(row),
  driver: row.driver,
  driverLicense: '',
  driverContact: driverContacts[row.driver] ?? '',
  driverAddress: '',
  type: row.type,
  fuel: row.fuel,
  route: row.route,
  insuranceExpiry: row.insuranceExpiry,
  registrationExpiry: row.registrationExpiry,
  fitnessExpiry: row.fitnessExpiry,
  status: row.status,
});

/** What Assign Driver hands back. */
export interface DriverAssignment {
  driver: string;
  shift: string;
  effective: string;
}

/** What Assign Route hands back. */
export interface RouteAssignment {
  route: string;
  driver: string;
  shift: string;
}

/** What Schedule Maintenance hands back. */
export interface MaintenancePlan {
  serviceType: string;
  scheduled: string;
  vendor: string;
  cost: string;
  notes: string;
}

/** What Insurance Details hands back. */
export interface InsurancePlan {
  policy: string;
  provider: string;
  start: string;
  expiry: string;
  coverage: string;
  premium: string;
}

export interface VehicleModalsProps {
  active: VehicleModalId | null;
  row: Vehicle | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: VehicleDraft) => void;
  onUpdate: (draft: VehicleDraft) => void;
  onAssignDriver: (assignment: DriverAssignment) => void;
  onAssignRoute: (assignment: RouteAssignment) => void;
  onScheduleMaintenance: (plan: MaintenancePlan) => void;
  onSaveInsurance: (plan: InsurancePlan) => void;
  onDelete: () => void;
  onImport: (mode: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View hand off to Documents and Edit, as the template's footer does. */
  onOpen: (modal: VehicleModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: VehicleDraft;
  onField: <K extends keyof VehicleDraft>(field: K, value: VehicleDraft[K]) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const text = (
  id: string,
  label: string,
  value: string,
  onChange: (next: string) => void,
  placeholder?: string,
) => (
  <div className="col-md-6"><div className="mb-3">
    <label className="form-label" htmlFor={id}>{label}</label>
    <input
      type="text" className="form-control" id={id} placeholder={placeholder}
      value={value} onChange={(event) => onChange(event.target.value)}
    />
  </div></div>
);

const VehicleForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    {text(`vehicle-no${suffix}`, 'Vehicle No', draft.number, (v) => onField('number', v), 'KA-01-AB-1234')}
    {text(`vehicle-model${suffix}`, 'Vehicle Model', draft.model, (v) => onField('model', v), 'Ashok Leyland Lynx')}

    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`made-year${suffix}`}>Made of Year</label>
      <input
        type="text" className="form-control" id={`made-year${suffix}`} placeholder="2019"
        value={draft.mfgYear} onChange={(event) => onField('mfgYear', event.target.value)}
      />
    </div></div>
    {text(`registration-no${suffix}`, 'Registration No', draft.registration, (v) => onField('registration', v), 'REG-KA-2019-1234')}
    {text(`chassis-no${suffix}`, 'Chassis No', draft.chassis, (v) => onField('chassis', v))}
    {text(`seat-capacity${suffix}`, 'Seat Capacity', draft.seats, (v) => onField('seats', v), '42')}
    {text(`gps-id${suffix}`, 'GPS Tracking ID', draft.gpsId, (v) => onField('gpsId', v))}

    {/* The template mounts Choices.js on this one select (`class="select"`). */}
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`select-driver${suffix}`}>Select Driver</label>
      <SelectField
        options={driverOptions}
        value={draft.driver}
        onChange={(value) => onField('driver', value)}
        id={`select-driver${suffix}`}
        blankLabel="Select"
      />
    </div></div>

    {text(`driver-license${suffix}`, 'Driver License', draft.driverLicense, (v) => onField('driverLicense', v))}
    {text(`driver-contact${suffix}`, 'Driver Contact No', draft.driverContact, (v) => onField('driverContact', v))}
    <div className="col-md-12"><div className="mb-3">
      <label className="form-label" htmlFor={`driver-address${suffix}`}>Driver Address</label>
      <input
        type="text" className="form-control" id={`driver-address${suffix}`}
        value={draft.driverAddress} onChange={(event) => onField('driverAddress', event.target.value)}
      />
    </div></div>

    {/* Catalogue fields the redesigned grid prints but the template's form omits. */}
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`vehicle-type${suffix}`}>Vehicle Type</label>
      <select
        className="form-select" id={`vehicle-type${suffix}`}
        value={draft.type} onChange={(event) => onField('type', event.target.value as VehicleType)}
      >
        {typeOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`fuel-type${suffix}`}>Fuel Type</label>
      <select
        className="form-select" id={`fuel-type${suffix}`}
        value={draft.fuel} onChange={(event) => onField('fuel', event.target.value as FuelType)}
      >
        {fuelOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`vehicle-route${suffix}`}>Route</label>
      <select
        className="form-select" id={`vehicle-route${suffix}`}
        value={draft.route} onChange={(event) => onField('route', event.target.value)}
      >
        <option value="">No route</option>
        {routeOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`vehicle-status${suffix}`}>Status</label>
      <select
        className="form-select" id={`vehicle-status${suffix}`}
        value={draft.status} onChange={(event) => onField('status', event.target.value as VehicleStatus)}
      >
        {statusOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div></div>
    {text(`insurance-expiry${suffix}`, 'Insurance Expiry', draft.insuranceExpiry, (v) => onField('insuranceExpiry', v), '18 Sep 2026')}
    {text(`registration-expiry${suffix}`, 'Registration Expiry', draft.registrationExpiry, (v) => onField('registrationExpiry', v), '20 Aug 2027')}
    {text(`fitness-expiry${suffix}`, 'Fitness Expiry', draft.fitnessExpiry, (v) => onField('fitnessExpiry', v), '12 Jul 2026')}
  </div>
);

/** The read-only Vehicle field every assignment dialog opens with. */
const vehicleField = (id: string, row: Vehicle) => (
  <div className="col-md-12"><div className="mb-3">
    <label className="form-label" htmlFor={id}>Vehicle</label>
    <input type="text" className="form-control" id={id} value={vehicleLabelOf(row)} readOnly />
  </div></div>
);

const pair = (label: string, value: string) => (
  <div className="d-flex align-items-center justify-content-between py-1" key={label}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const VehicleModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignDriver, onAssignRoute,
  onScheduleMaintenance, onSaveInsurance, onDelete, onImport, onToast, onOpen,
}: VehicleModalsProps) => {
  const [draft, setDraft] = useState<VehicleDraft>(emptyDraft);
  const [driverAssign, setDriverAssign] = useState<DriverAssignment>({
    driver: '', shift: shiftOptions[0], effective: '24/07/2026',
  });
  const [routeAssign, setRouteAssign] = useState<RouteAssignment>({
    route: '', driver: '', shift: shiftOptions[0],
  });
  const [maintenance, setMaintenance] = useState<MaintenancePlan>({
    serviceType: '', scheduled: '02/08/2024', vendor: 'City Fleet Services', cost: '180', notes: '',
  });
  const [insurance, setInsurance] = useState<InsurancePlan>({
    policy: '', provider: 'National Insurance Co.', start: '19/09/2025',
    expiry: '18/09/2026', coverage: coverageOptions[0], premium: '1250',
  });
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening starts from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    if (active === 'edit' && row) setDraft(draftOf(row));
    if (active === 'assign-driver') {
      setDriverAssign({ driver: row?.driver ?? '', shift: shiftOptions[0], effective: '24/07/2026' });
    }
    if (active === 'assign-route') {
      setRouteAssign({ route: row?.route ?? '', driver: row?.driver ?? '', shift: shiftOptions[0] });
    }
    if (active === 'maintenance') {
      setMaintenance({
        serviceType: '', scheduled: '02/08/2024', vendor: 'City Fleet Services',
        cost: '180', notes: '',
      });
    }
    if (active === 'insurance' && row) {
      setInsurance({
        policy: policyNumberOf(row), provider: 'National Insurance Co.', start: '19/09/2025',
        expiry: '18/09/2026', coverage: coverageOptions[0], premium: '1250',
      });
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = <K extends keyof VehicleDraft>(key: K, value: VehicleDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const closeButton = <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>;

  return (
    <>
      {/* Add Vehicle */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add New Vehicle"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={<>{closeButton}<button type="submit" className="btn btn-primary">Add New Vehicle</button></>}
      >
        <VehicleForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Vehicle */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Vehicle"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={<>{closeButton}<button type="submit" className="btn btn-primary">Save Vehicle</button></>}
      >
        <VehicleForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Vehicle */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Vehicle Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-outline-light bg-white me-2" onClick={() => onOpen('documents')}>
              <i className="ti ti-files me-1" />Documents
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('edit')}>
              <i className="ti ti-edit me-1" />Edit Vehicle
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
              <span className="avatar avatar-lg">
                <ImageWithBasePath src={row.photo} className="rounded" alt={row.number} />
              </span>
              <div>
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  {row.number}
                  <span className={statusBadge[row.status]}>{row.status}</span>
                </h5>
                <span className="fs-12 text-muted">
                  {row.model} · {row.type} · {row.registration}
                </span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Route &amp; Driver</h6>
                <div className="border rounded p-3">
                  {pair('Route', routeLabelOf(row))}
                  {pair('Driver', driverLabelOf(row))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Specifications</h6>
                <div className="border rounded p-3">
                  {pair('Fuel', row.fuel)}
                  {pair('Seats', String(row.seats))}
                  {pair('Manufactured', String(row.mfgYear))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Compliance</h6>
                <div className="border rounded p-3">
                  {pair('Insurance', row.insuranceExpiry)}
                  {pair('Registration', row.registrationExpiry)}
                  {pair('Fitness', row.fitnessExpiry)}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Maintenance</h6>
                <div className="border rounded p-3">
                  {pair('Last Service', row.lastService)}
                  {pair('Next Service', row.nextService)}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assign Driver */}
      <Modal
        open={active === 'assign-driver' && row !== null}
        onClose={onClose}
        title="Assign Driver"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignDriver(driverAssign); }}
        footer={<>{closeButton}<button type="submit" className="btn btn-primary">Assign Driver</button></>}
      >
        {row ? (
          <div className="row">
            {vehicleField('assign-driver-vehicle', row)}
            <div className="col-md-12"><div className="mb-3">
              <label className="form-label" htmlFor="assign-driver-name">
                Driver <span className="text-danger">*</span>
              </label>
              <select
                className="form-select" id="assign-driver-name" required
                value={driverAssign.driver}
                onChange={(event) => setDriverAssign((c) => ({ ...c, driver: event.target.value }))}
              >
                <option value="">Select driver</option>
                {driverOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="assign-driver-shift">Shift</label>
              <select
                className="form-select" id="assign-driver-shift"
                value={driverAssign.shift}
                onChange={(event) => setDriverAssign((c) => ({ ...c, shift: event.target.value }))}
              >
                {shiftOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="effective-date">Effective Date</label>
              <div className="input-icon-end position-relative">
                <DateField
                  value={driverAssign.effective}
                  onChange={(next) => setDriverAssign((c) => ({ ...c, effective: next }))}
                  format="d/m/Y"
                  id="effective-date"
                />
                <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
              </div>
            </div></div>
          </div>
        ) : null}
      </Modal>

      {/* Assign Route */}
      <Modal
        open={active === 'assign-route' && row !== null}
        onClose={onClose}
        title="Assign Route"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignRoute(routeAssign); }}
        footer={<>{closeButton}<button type="submit" className="btn btn-primary">Assign Route</button></>}
      >
        {row ? (
          <div className="row">
            {vehicleField('assign-route-vehicle', row)}
            <div className="col-md-12"><div className="mb-3">
              <label className="form-label" htmlFor="assign-route-name">
                Route <span className="text-danger">*</span>
              </label>
              <select
                className="form-select" id="assign-route-name" required
                value={routeAssign.route}
                onChange={(event) => setRouteAssign((c) => ({ ...c, route: event.target.value }))}
              >
                <option value="">Select route</option>
                {routeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="assign-route-driver">Driver</label>
              <select
                className="form-select" id="assign-route-driver"
                value={routeAssign.driver}
                onChange={(event) => setRouteAssign((c) => ({ ...c, driver: event.target.value }))}
              >
                <option value="">Select driver</option>
                {driverOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="assign-route-shift">Shift</label>
              <select
                className="form-select" id="assign-route-shift"
                value={routeAssign.shift}
                onChange={(event) => setRouteAssign((c) => ({ ...c, shift: event.target.value }))}
              >
                {shiftOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
          </div>
        ) : null}
      </Modal>

      {/* Schedule Maintenance */}
      <Modal
        open={active === 'maintenance' && row !== null}
        onClose={onClose}
        title="Schedule Maintenance"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onScheduleMaintenance(maintenance); }}
        footer={<>{closeButton}<button type="submit" className="btn btn-primary">Schedule Maintenance</button></>}
      >
        {row ? (
          <div className="row">
            {vehicleField('maintenance-vehicle', row)}
            <div className="col-md-12"><div className="mb-3">
              <label className="form-label" htmlFor="service-type">
                Service Type <span className="text-danger">*</span>
              </label>
              <select
                className="form-select" id="service-type" required
                value={maintenance.serviceType}
                onChange={(event) => setMaintenance((c) => ({ ...c, serviceType: event.target.value }))}
              >
                <option value="">Select type</option>
                {serviceTypeOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="scheduled-date">Scheduled Date</label>
              <div className="input-icon-end position-relative">
                <DateField
                  value={maintenance.scheduled}
                  onChange={(next) => setMaintenance((c) => ({ ...c, scheduled: next }))}
                  format="d/m/Y"
                  id="scheduled-date"
                />
                <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
              </div>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="garage-vendor">Garage / Vendor</label>
              <input
                type="text" className="form-control" id="garage-vendor"
                value={maintenance.vendor}
                onChange={(event) => setMaintenance((c) => ({ ...c, vendor: event.target.value }))}
              />
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="estimated-cost">Estimated Cost</label>
              <input
                type="number" className="form-control" id="estimated-cost"
                value={maintenance.cost}
                onChange={(event) => setMaintenance((c) => ({ ...c, cost: event.target.value }))}
              />
            </div></div>
            <div className="col-md-12"><div className="mb-0">
              <label className="form-label" htmlFor="maintenance-notes">Notes</label>
              <textarea
                className="form-control" rows={2} id="maintenance-notes"
                value={maintenance.notes}
                onChange={(event) => setMaintenance((c) => ({ ...c, notes: event.target.value }))}
              />
            </div></div>
          </div>
        ) : null}
      </Modal>

      {/* Insurance Details */}
      <Modal
        open={active === 'insurance' && row !== null}
        onClose={onClose}
        title="Insurance Details"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onSaveInsurance(insurance); }}
        footer={<>{closeButton}<button type="submit" className="btn btn-primary">Save Insurance</button></>}
      >
        {row ? (
          <div className="row">
            {vehicleField('insurance-vehicle', row)}
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="policy-number">
                Policy Number <span className="text-danger">*</span>
              </label>
              <input
                type="text" className="form-control" id="policy-number" required
                value={insurance.policy}
                onChange={(event) => setInsurance((c) => ({ ...c, policy: event.target.value }))}
              />
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="provider">Provider</label>
              <input
                type="text" className="form-control" id="provider"
                value={insurance.provider}
                onChange={(event) => setInsurance((c) => ({ ...c, provider: event.target.value }))}
              />
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="start-date">Start Date</label>
              <div className="input-icon-end position-relative">
                <DateField
                  value={insurance.start}
                  onChange={(next) => setInsurance((c) => ({ ...c, start: next }))}
                  format="d/m/Y"
                  id="start-date"
                />
                <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
              </div>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="expiry-date">Expiry Date</label>
              <div className="input-icon-end position-relative">
                <DateField
                  value={insurance.expiry}
                  onChange={(next) => setInsurance((c) => ({ ...c, expiry: next }))}
                  format="d/m/Y"
                  id="expiry-date"
                />
                <span className="input-icon-addon"><i className="ti ti-calendar" /></span>
              </div>
            </div></div>
            <div className="col-md-6"><div className="mb-3">
              <label className="form-label" htmlFor="coverage">Coverage</label>
              <select
                className="form-select" id="coverage"
                value={insurance.coverage}
                onChange={(event) => setInsurance((c) => ({ ...c, coverage: event.target.value }))}
              >
                {coverageOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </div></div>
            <div className="col-md-6"><div className="mb-0">
              <label className="form-label" htmlFor="premium">Premium</label>
              <input
                type="number" className="form-control" id="premium"
                value={insurance.premium}
                onChange={(event) => setInsurance((c) => ({ ...c, premium: event.target.value }))}
              />
            </div></div>
          </div>
        ) : null}
      </Modal>

      {/* Vehicle Documents */}
      <Modal
        open={active === 'documents' && row !== null}
        onClose={onClose}
        title="Vehicle Documents"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={onClose}>Close</button>}
      >
        {row ? (
          <>
            <div className="table-responsive mb-3">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Document</th><th>Reference</th><th>Expiry</th>
                    <th>Status</th><th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documentsOf(row).map((document) => (
                    <tr key={document.label}>
                      <td>{document.label}</td>
                      <td>{document.reference}</td>
                      <td>{document.expiry}</td>
                      <td>
                        <span className={complianceBadge[complianceStateOf(document.expiry)]}>
                          {complianceStateOf(document.expiry)}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button" className="btn btn-outline-light bg-white btn-sm"
                          onClick={() => onToast(`${document.label} downloaded`)}
                        >
                          <i className="ti ti-download" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="stacked-dropdown">
              <i className="ti ti-cloud-upload" />
              <b>Upload a new document</b>
              <span className="fs-12 text-muted">PDF, JPG or PNG · max 10 MB</span>
              <input type="file" aria-label="Vehicle document" />
            </div>
          </>
        ) : null}
      </Modal>

      {/* Live Tracking */}
      <Modal
        open={active === 'track' && row !== null}
        onClose={onClose}
        title="Live Tracking Vehicle"
        dialogClassName="modal-xl"
        footer={
          <>
            {closeButton}
            <button
              type="button" className="btn btn-primary"
              onClick={() => onToast(`Recentred on ${row?.number}`)}
            >
              Reset to Live Location
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-satellite fs-16" />
              <span className="fs-13">GPS Tracking ID : {gpsIdOf(row)}</span>
            </div>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="border rounded p-3">
                  <span className="fs-12 text-muted d-block mb-1">Vehicle No</span>
                  <h6 className="mb-0">{row.number}</h6>
                </div>
              </div>
              <div className="col-md-3">
                <div className="border rounded p-3">
                  <span className="fs-12 text-muted d-block mb-1">Vehicle Model</span>
                  <h6 className="mb-0">{row.model}</h6>
                </div>
              </div>
              <div className="col-md-3">
                <div className="border rounded p-3">
                  <span className="fs-12 text-muted d-block mb-1">Driver</span>
                  <h6 className="mb-0">{driverLabelOf(row)}</h6>
                </div>
              </div>
              <div className="col-md-3">
                <div className="border rounded p-3">
                  <span className="fs-12 text-muted d-block mb-1">Driver Contact No</span>
                  <h6 className="mb-0">{driverContacts[row.driver] ?? '—'}</h6>
                </div>
              </div>
            </div>
            {/* The template's map is a static placeholder; no map library ships here. */}
            <div
              className="position-relative rounded overflow-hidden border bg-light mt-3"
              style={{ height: 280 }}
              role="img"
              aria-label={`Live location of ${row.number}`}
            >
              <span className="badge badge-soft-primary position-absolute top-50 start-50 translate-middle">
                <i className="ti ti-bus me-1" />{row.number} · {routeLabelOf(row)}
              </span>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Import Vehicles */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Vehicles"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onImport(mode); }}
        footer={<>{closeButton}<button type="submit" className="btn btn-primary">Import</button></>}
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Vehicles file" />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="vehicle-import-mode">Import mode</label>
          <select
            className="form-select" id="vehicle-import-mode"
            value={mode} onChange={(event) => setMode(event.target.value)}
          >
            {importModes.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </Modal>

      {/* Delete */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => { event.preventDefault(); onDelete(); }}
      >
        <span className="delete-icon"><i className="ti ti-trash-x" /></span>
        <h4>Confirm Deletion</h4>
        <p>
          You want to delete {deleteCount === 1 ? 'this vehicle' : `all ${deleteCount} marked items`},
          this cant be undone once you delete.
        </p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-danger">Yes, Delete</button>
        </div>
      </Modal>
    </>
  );
};

export default VehicleModals;
