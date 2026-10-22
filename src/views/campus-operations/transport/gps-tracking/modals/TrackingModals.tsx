import Modal from '@components/ui/Modal';
import type { Vehicle } from '../data/fleet.data';
import { completionPct, stateBadge, stopsRemaining } from '../data/fleet.data';

export type TrackingModalId =
  | 'vehicle' | 'driver' | 'route' | 'students' | 'trip' | 'gps';

export interface TrackingModalsProps {
  active: TrackingModalId | null;
  vehicle: Vehicle | null;
  onClose: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets Vehicle Details hand off to GPS Info, as the template's footer does. */
  onOpen: (modal: TrackingModalId) => void;
}

const pair = (label: string, value: string) => (
  <div className="d-flex align-items-center justify-content-between py-1" key={label}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const tile = (label: string, value: string, tint?: string) => (
  <div className="col-6 col-md-3" key={label}>
    <div className="border rounded p-3 text-center">
      <span className="fs-12 text-muted d-block mb-1">{label}</span>
      <h5 className={`mb-0${tint ? ` text-${tint}` : ''}`}>{value}</h5>
    </div>
  </div>
);

/** The template's dialog header: avatar, name, state badge, one-line subtitle. */
const Head = ({ tint, icon, title, badge, badgeClass, subtitle }: {
  tint: string; icon: string; title: string;
  badge?: string; badgeClass?: string; subtitle: string;
}) => (
  <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
    <span className={`avatar avatar-lg bg-${tint}-transparent text-${tint} rounded`}>
      <i className={`${icon} fs-20`} />
    </span>
    <div>
      <h5 className="mb-0 d-flex align-items-center gap-2">
        {title}
        {badge ? <span className={badgeClass}>{badge}</span> : null}
      </h5>
      <span className="fs-12 text-muted">{subtitle}</span>
    </div>
  </div>
);

/** The six-name sample the template's pickup dialog prints. */
const manifest = [
  { name: 'Aarav Sharma', stop: 'Maple Avenue', state: 'Picked' },
  { name: 'Diya Nair', stop: 'Oak Street', state: 'Picked' },
  { name: 'Kabir Rao', stop: 'Cedar Cross', state: 'Picked' },
  { name: 'Meera Iyer', stop: 'Maple Avenue', state: 'Next' },
  { name: 'Ryan Dsouza', stop: 'Pine Road', state: 'Pending' },
  { name: 'Sara Khan', stop: 'Garden Gate', state: 'Pending' },
];

const manifestBadge: Record<string, string> = {
  Picked: 'badge badge-soft-success',
  Next: 'badge badge-soft-primary',
  Pending: 'badge badge-soft-secondary',
};

const TrackingModals = ({ active, vehicle, onClose, onToast, onOpen }: TrackingModalsProps) => {
  if (!vehicle) return null;

  const closeButton = (
    <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
  );

  return (
    <>
      {/* Vehicle Details */}
      <Modal
        open={active === 'vehicle'}
        onClose={onClose}
        title="Vehicle Details"
        dialogClassName="modal-lg"
        footer={
          <>
            {closeButton}
            <button type="button" className="btn btn-primary" onClick={() => onOpen('gps')}>
              <i className="ti ti-satellite me-1" />GPS Info
            </button>
          </>
        }
      >
        <Head
          tint={vehicle.tint} icon="ti ti-bus" title={vehicle.name}
          badge={vehicle.state} badgeClass={stateBadge[vehicle.state]}
          subtitle={`${vehicle.registration} · ${vehicle.route} · ${vehicle.students} Students`}
        />
        <div className="row g-3">
          <div className="col-md-6">{[
            pair('Model', 'Ashok Leyland'),
            pair('Capacity', '40 Seats'),
            pair('Fuel Level', `${vehicle.fuel}%`),
            pair('Odometer', vehicle.odometer),
          ]}</div>
          <div className="col-md-6">{[
            pair('Engine', vehicle.engine),
            pair('AC', vehicle.ac),
            pair('GPS Device', 'GT-06N'),
            pair('Insurance', 'Valid · 2027'),
          ]}</div>
        </div>
      </Modal>

      {/* Driver Details */}
      <Modal
        open={active === 'driver'}
        onClose={onClose}
        title="Driver Details"
        dialogClassName="modal-lg"
        footer={
          <>
            {closeButton}
            <button
              type="button" className="btn btn-primary"
              onClick={() => { onClose(); onToast(`Calling ${vehicle.driver} on ${vehicle.driverPhone}`); }}
            >
              <i className="ti ti-phone me-1" />Call Driver
            </button>
          </>
        }
      >
        <Head
          tint="info" icon="ti ti-user" title={vehicle.driver}
          badge={vehicle.state === 'Offline' ? 'Off Duty' : 'On Duty'}
          badgeClass={vehicle.state === 'Offline' ? 'badge badge-soft-secondary' : 'badge badge-soft-success'}
          subtitle={`Driver · ${vehicle.driverExperience} · ${vehicle.driverRating}`}
        />
        <div className="row g-3">
          <div className="col-md-6">{[
            pair('Phone', vehicle.driverPhone),
            pair('License', `${vehicle.driverLicence} · ${vehicle.driverLicenceYear}`),
            pair('Blood Group', 'O+'),
          ]}</div>
          <div className="col-md-6">{[
            pair('Assistant', vehicle.assistant),
            pair('Shift', vehicle.trip === 'Morning Pickup' ? 'Morning' : 'Afternoon'),
            pair('Assigned Bus', vehicle.name),
          ]}</div>
        </div>
      </Modal>

      {/* Route Details */}
      <Modal
        open={active === 'route'}
        onClose={onClose}
        title="Route Details"
        dialogClassName="modal-lg"
        footer={
          <>
            {closeButton}
            <button
              type="button" className="btn btn-primary"
              onClick={() => { onClose(); onToast(`${vehicle.route} highlighted on the map`); }}
            >
              <i className="ti ti-map-2 me-1" />Show on Map
            </button>
          </>
        }
      >
        <Head
          tint="primary" icon="ti ti-route" title={vehicle.route}
          badge={vehicle.state === 'Offline' ? 'Interrupted' : 'Active'}
          badgeClass={vehicle.state === 'Offline' ? 'badge badge-soft-danger' : 'badge badge-soft-success'}
          subtitle={`${vehicle.totalStops} Stops · ${vehicle.routeDistance} · ${vehicle.estDuration}`}
        />
        <ul className="list-unstyled mb-0">
          <li className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
            <span className="fs-13">
              <i className="ti ti-building-community text-primary me-2" />Global School (Start)
            </span>
            <span className="fs-12 text-muted">{vehicle.tripStart}</span>
          </li>
          <li className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
            <span className="fs-13">
              <i className="ti ti-circle-check text-success me-2" />{vehicle.location}
            </span>
            <span className="badge badge-soft-success">Done</span>
          </li>
          {vehicle.upcoming.length === 0 ? (
            <li className="fs-13 text-muted">No upcoming stops on this trip.</li>
          ) : (
            vehicle.upcoming.map((stop) => (
              <li className="d-flex align-items-center justify-content-between border rounded p-2 mb-2" key={stop.name}>
                <span className="fs-13"><i className="ti ti-map-pin text-muted me-2" />{stop.name}</span>
                <span className="fs-12 text-muted">{stop.eta}</span>
              </li>
            ))
          )}
        </ul>
      </Modal>

      {/* Student Pickup List */}
      <Modal
        open={active === 'students'}
        onClose={onClose}
        title="Student Pickup List"
        dialogClassName="modal-lg"
        footer={
          <>
            {closeButton}
            <button
              type="button" className="btn btn-primary"
              onClick={() => { onClose(); onToast(`Parents notified for ${vehicle.name}`); }}
            >
              <i className="ti ti-bell me-1" />Notify Parents
            </button>
          </>
        }
      >
        <Head
          tint={vehicle.tint} icon="ti ti-users" title={vehicle.name}
          subtitle={`${vehicle.route} · ${vehicle.students} students on the manifest`}
        />
        <div className="row g-3 mb-3">
          {tile('Picked', String(vehicle.pickedUp), 'success')}
          {tile('Remaining', String(vehicle.remaining), 'warning')}
          {tile('Next Student', vehicle.nextStudent)}
          {tile('Arrival', vehicle.arrivalTime)}
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr><th>Student</th><th>Stop</th><th className="text-end">Status</th></tr>
            </thead>
            <tbody>
              {manifest.map((student) => (
                <tr key={student.name}>
                  <td>{student.name}</td>
                  <td>{student.stop}</td>
                  <td className="text-end">
                    <span className={manifestBadge[student.state]}>{student.state}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Trip Summary */}
      <Modal
        open={active === 'trip'}
        onClose={onClose}
        title="Trip Summary"
        dialogClassName="modal-lg"
        footer={
          <>
            {closeButton}
            <button
              type="button" className="btn btn-primary"
              onClick={() => { onClose(); onToast(`Trip summary for ${vehicle.name} downloaded`); }}
            >
              <i className="ti ti-download me-1" />Download
            </button>
          </>
        }
      >
        <Head
          tint={vehicle.tint} icon="ti ti-route" title={`${vehicle.trip} · 26 Jul 2026`}
          subtitle={`${vehicle.name} · ${vehicle.route}`}
        />
        <div className="row g-3">
          {tile('Trip Start', vehicle.tripStart)}
          {tile('Est. Arrival', vehicle.estArrival)}
          {tile('Delay', vehicle.delay, vehicle.delay.startsWith('+') ? 'danger' : undefined)}
          {tile('Avg Speed', vehicle.avgSpeed)}
          {tile('Total Distance', vehicle.totalDistance)}
          {tile('Stops Covered', `${vehicle.stopsCovered} of ${vehicle.totalStops}`)}
          {tile('Students', `${vehicle.pickedUp} of ${vehicle.students}`)}
          {tile('Completion', `${completionPct(vehicle)}%`, 'success')}
        </div>
        <div className="mt-3">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fs-12 text-muted">Route Completion</span>
            <span className="fs-12 fw-semibold">{stopsRemaining(vehicle)} stops remaining</span>
          </div>
          <div className="progress progress-sm" role="progressbar" aria-label="Route completion"
            aria-valuenow={completionPct(vehicle)} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-bar bg-success" style={{ width: `${completionPct(vehicle)}%` }} />
          </div>
        </div>
      </Modal>

      {/* GPS Information */}
      <Modal
        open={active === 'gps'}
        onClose={onClose}
        title="GPS Information"
        dialogClassName="modal-lg"
        footer={
          <>
            {closeButton}
            <button
              type="button" className="btn btn-primary"
              onClick={() => onToast(`GPS refreshed for ${vehicle.name}`)}
            >
              <i className="ti ti-refresh me-1" />Refresh
            </button>
          </>
        }
      >
        <Head
          tint={vehicle.gps === 'Online' ? 'success' : 'danger'} icon="ti ti-satellite"
          title="GPS Signal"
          badge={vehicle.gps === 'Online' ? 'Strong' : 'No signal'}
          badgeClass={vehicle.gps === 'Online' ? 'badge badge-soft-success' : 'badge badge-soft-danger'}
          subtitle={`Device GT-06N · ${vehicle.name}`}
        />
        <div className="row g-3">
          <div className="col-md-6">{[
            pair('Latitude', '12.9716° N'),
            pair('Longitude', '77.5946° E'),
            pair('Altitude', '920 m'),
          ]}</div>
          <div className="col-md-6">{[
            pair('Last Update', vehicle.lastUpdate),
            pair('Satellites', vehicle.gps === 'Online' ? '9 locked' : '0 locked'),
            pair('Accuracy', vehicle.gps === 'Online' ? '4.2 m' : '—'),
          ]}</div>
        </div>
      </Modal>
    </>
  );
};

export default TrackingModals;
