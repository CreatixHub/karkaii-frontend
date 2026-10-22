import type { Device } from '../data/biometric.data';
import { healthTone } from '../data/biometric.data';

export interface DeviceMonitorProps {
  devices: Device[];
  open: boolean;
  onHide: () => void;
  onDetails: (device: Device) => void;
  onSync: (device: Device) => void;
}

const DeviceMonitor = ({ devices, open, onHide, onDetails, onSync }: DeviceMonitorProps) => (
  <div className={`collapse${open ? ' show' : ''}`} id="bio_devices">
    <div className="p-3 border-bottom bg-light">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0 fs-15 fw-medium">
          <i className="ti ti-devices text-primary me-1" />
          Live Device Monitor
        </h4>
        <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={onHide}>
          <i className="ti ti-chevron-up me-1" />
          Hide
        </button>
      </div>
      <div className="row g-3">
        {devices.map((device) => (
          <div className="col-xxl-3 col-lg-6 col-md-6 d-flex" key={device.id}>
            <div className="card card-hover flex-fill mb-0">
              <div className="card-body">
                <div className="d-flex align-items-start mb-3">
                  <span
                    className={`avatar avatar-lg bg-${device.tint}-transparent text-${device.tint} rounded me-2 flex-shrink-0`}
                  >
                    <i className={`${device.icon} fs-24`} />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <div className="d-flex align-items-center justify-content-between">
                      <h6 className="mb-0 text-truncate">{device.name}</h6>
                      <span
                        className={`badge badge-soft-${
                          device.status === 'Online' ? 'success' : 'danger'
                        } d-inline-flex align-items-center`}
                      >
                        <i className="ti ti-circle-filled fs-6 me-1" />
                        {device.status}
                      </span>
                    </div>
                    <span className="fs-12 text-muted d-block text-truncate">{device.serial}</span>
                  </div>
                </div>
                <ul className="list-unstyled mb-3 fs-12">
                  {[
                    { icon: 'ti ti-map-pin', label: device.campus, value: device.location },
                    { icon: 'ti ti-antenna', label: 'Signal', value: device.signal },
                    { icon: device.powerIcon, label: 'Power', value: device.power },
                    { icon: 'ti ti-cpu', label: 'Firmware', value: device.firmware },
                    { icon: 'ti ti-clock', label: 'Last Sync', value: device.lastSync },
                  ].map((item) => (
                    <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                      <span className="text-muted">
                        <i className={`${item.icon} me-1`} />
                        {item.label}
                      </span>
                      <span className="text-dark">{item.value}</span>
                    </li>
                  ))}
                </ul>
                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <span>
                    <span className="fs-11 text-muted d-block">Today&apos;s Scans</span>
                    <span className="fw-semibold">{device.scans}</span>
                  </span>
                  <span className={`badge badge-soft-${healthTone[device.health]} d-inline-flex align-items-center`}>
                    <i className="ti ti-heartbeat me-1" />
                    {device.health}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 mt-3">
                  <button type="button" className="btn btn-light btn-sm flex-fill" onClick={() => onDetails(device)}>
                    <i className="ti ti-info-circle me-1" />
                    Details
                  </button>
                  <button type="button" className="btn btn-primary btn-sm flex-fill" onClick={() => onSync(device)}>
                    <i className="ti ti-refresh me-1" />
                    Sync
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DeviceMonitor;
