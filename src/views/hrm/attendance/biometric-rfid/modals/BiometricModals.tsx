import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AttendanceLog, Device } from '../data/biometric.data';
import { healthTone, statusPill } from '../data/biometric.data';

export type BiometricModalId =
  | 'device_details'
  | 'device_config'
  | 'sync_history'
  | 'attendance_record'
  | 'user_information'
  | 'delete';

export interface BiometricModalsProps {
  active: BiometricModalId | null;
  device: Device | null;
  log: AttendanceLog | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onConfirmDelete: () => void;
}

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

const BiometricModals = ({ active, device, log, onClose, onToast, onConfirmDelete }: BiometricModalsProps) => {
  const [syncInterval, setSyncInterval] = useState('Real time');
  const [threshold, setThreshold] = useState('High');
  const [offlineBuffer, setOfflineBuffer] = useState(true);

  useEffect(() => {
    if (active === 'device_config') {
      setSyncInterval('Real time');
      setThreshold('High');
      setOfflineBuffer(true);
    }
  }, [active, device]);

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
      {/* Device Details */}
      <Modal
        open={active === 'device_details' && device !== null}
        onClose={onClose}
        title="Device Details"
        dialogClassName="modal-lg"
        footer={closeFooter(
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onToast(`${device?.name ?? 'Device'} sync requested`);
              onClose();
            }}
          >
            <i className="ti ti-refresh me-1" />
            Sync Now
          </button>,
        )}
      >
        {device ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className={`avatar avatar-lg bg-${device.tint}-transparent text-${device.tint} rounded me-3`}>
                <i className={`${device.icon} fs-24`} />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{device.name}</h5>
                  <span className={`badge badge-soft-${device.status === 'Online' ? 'success' : 'danger'}`}>
                    {device.status}
                  </span>
                  <span className={`badge badge-soft-${healthTone[device.health]}`}>{device.health}</span>
                </div>
                <p className="mb-0 text-muted fs-13">{device.serial}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <InfoList
                  items={[
                    { label: 'Campus', value: device.campus },
                    { label: 'Location', value: device.location },
                    { label: 'Signal', value: device.signal },
                    { label: 'Power', value: device.power },
                  ]}
                />
              </div>
              <div className="col-md-6">
                <InfoList
                  items={[
                    { label: 'Firmware', value: device.firmware },
                    { label: 'Last Sync', value: device.lastSync },
                    { label: "Today's Scans", value: String(device.scans) },
                    { label: 'Device Type', value: device.kind },
                  ]}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Device Configuration */}
      <Modal
        open={active === 'device_config' && device !== null}
        onClose={onClose}
        title="Device Configuration"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onToast(`${device?.name ?? 'Device'} configuration saved`);
          onClose();
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="sync-interval">
                Sync Interval
              </label>
              <select
                className="form-select"
                id="sync-interval"
                value={syncInterval}
                onChange={(event) => setSyncInterval(event.target.value)}
              >
                <option>Real time</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="match-threshold">
                Match Threshold
              </label>
              <select
                className="form-select"
                id="match-threshold"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          <div className="col-md-12">
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="offline-buffer"
                checked={offlineBuffer}
                onChange={(event) => setOfflineBuffer(event.target.checked)}
              />
              <label className="form-check-label fs-13" htmlFor="offline-buffer">
                Buffer scans locally while the device is offline
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Sync History */}
      <Modal
        open={active === 'sync_history' && device !== null}
        onClose={onClose}
        title="Sync History"
        dialogClassName="modal-lg"
        footer={closeFooter(
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onToast('Sync history export started');
              onClose();
            }}
          >
            <i className="ti ti-download me-1" />
            Export
          </button>,
        )}
      >
        {device ? (
          <>
            <p className="fs-13 text-muted">
              Recent synchronisation attempts for <span className="fw-medium text-dark">{device.name}</span>.
            </p>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Time</th>
                    <th>Records</th>
                    <th>Duration</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { time: device.lastSync, records: '18', duration: '1.2s', result: 'Success', tone: 'success' },
                    { time: '4m ago', records: '24', duration: '1.6s', result: 'Success', tone: 'success' },
                    { time: '11m ago', records: '9', duration: '0.8s', result: 'Partial', tone: 'warning' },
                    { time: '22m ago', records: '0', duration: '—', result: 'Failed', tone: 'danger' },
                  ].map((entry) => (
                    <tr key={entry.time}>
                      <td>{entry.time}</td>
                      <td>{entry.records}</td>
                      <td>{entry.duration}</td>
                      <td>
                        <span className={`badge badge-soft-${entry.tone}`}>{entry.result}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Attendance Record */}
      <Modal
        open={active === 'attendance_record' && log !== null}
        onClose={onClose}
        title="Attendance Record"
        dialogClassName="modal-lg"
        footer={closeFooter()}
      >
        {log ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className="avatar avatar-lg me-3">
                <ImageWithBasePath src={log.avatar} className="rounded" alt={log.person} />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{log.person}</h5>
                  <span className="badge bg-primary-transparent text-primary">{log.personId}</span>
                  <span className={`dt-pill ${statusPill[log.status]}`}>
                    <span className="dt-pill-dot" />
                    {log.status}
                  </span>
                </div>
                <p className="mb-0 text-muted fs-13">
                  {log.userType} · {log.date} · {log.time}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <InfoList
                  items={[
                    { label: 'Device', value: log.device },
                    { label: 'Campus', value: log.campus },
                    { label: 'RFID Card', value: log.card },
                    { label: 'Auth Method', value: log.method.label },
                  ]}
                />
              </div>
              <div className="col-md-6">
                <InfoList
                  items={[
                    { label: 'Entry Result', value: log.entry },
                    { label: 'Verification', value: log.verification },
                    { label: 'Attendance', value: log.status },
                    { label: 'Sync', value: log.sync },
                  ]}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* User Information */}
      <Modal
        open={active === 'user_information' && log !== null}
        onClose={onClose}
        title="User Information"
        footer={closeFooter()}
      >
        {log ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span className="avatar avatar-lg me-3">
                <ImageWithBasePath src={log.avatar} className="rounded" alt={log.person} />
              </span>
              <div>
                <h5 className="mb-0">{log.person}</h5>
                <p className="mb-0 text-muted fs-13">
                  {log.personId} · {log.userType}
                </p>
              </div>
            </div>
            <InfoList
              items={[
                { label: 'RFID Card', value: log.card },
                { label: 'Registered Device', value: log.device },
                { label: 'Campus', value: log.campus },
                { label: 'Preferred Auth', value: log.method.label },
              ]}
            />
          </>
        ) : null}
      </Modal>

      {/* Confirm Deletion */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => {
          event.preventDefault();
          onConfirmDelete();
        }}
      >
        <span className="delete-icon">
          <i className="ti ti-trash-x" />
        </span>
        <h4>Confirm Deletion</h4>
        <p>You want to delete this attendance log, this cant be undone once you delete.</p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-danger">
            Yes, Delete
          </button>
        </div>
      </Modal>
    </>
  );
};

export default BiometricModals;
