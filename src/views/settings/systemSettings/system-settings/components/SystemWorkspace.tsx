import Offcanvas from '@components/ui/Offcanvas';
import DiskBar from './DiskBar';
import {
  DISK_ALERT_AT,
  DISK_PERCENT,
  FREE_GB,
  MEASURED_AT,
  PARTITIONS,
  USED_GB,
  VOLUME_GB,
  VOLUME_PATH,
} from '../data/systemSettings.data';

export interface SystemWorkspaceProps {
  open: boolean;
  onClose: () => void;
  /** What the reader clicked to get here. */
  subject?: string;
  onToast: (message: string) => void;
}

/** Roughly what the volume puts on in a day, used for the runway sentence. */
const GROWTH_GB_PER_DAY = 1.4;

/** Cutting log retention to a third returns two thirds of the log partition. */
const RECLAIMABLE_GB = 40;

const SystemWorkspace = ({ open, onClose, subject, onToast }: SystemWorkspaceProps) => {
  const logs = PARTITIONS.find((part) => part.id === 'logs');
  const headroom = Math.round(((DISK_ALERT_AT / 100) * VOLUME_GB - USED_GB) / GROWTH_GB_PER_DAY);
  const afterReclaim = Math.round(((USED_GB - RECLAIMABLE_GB) / VOLUME_GB) * 100);

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      className="sys-canvas"
      labelledById="sys_workspace_label"
      title={`Storage — ${VOLUME_PATH}`}
      header={
        <div className="sys-canvas-head">
          <span className="sys-card-ic">
            <i className="ti ti-database" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h3 className="offcanvas-title mb-1 fs-16 fw-medium" id="sys_workspace_label">
              Storage — {VOLUME_PATH}
            </h3>
            <p className="fs-12 mb-0">
              {USED_GB} GB of {VOLUME_GB} GB used · {MEASURED_AT.toLowerCase()}
              {subject ? ` · opened from ${subject}` : ''}
            </p>
          </div>
          <span className="sys-badge is-warn">{DISK_PERCENT}%</span>
          <button type="button" className="btn-close ms-2" onClick={onClose} aria-label="Close" />
        </div>
      }
      footer={
        <div className="sys-card-foot justify-content-end">
          <button type="button" className="btn btn-outline-light bg-white" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn btn-light d-inline-flex align-items-center"
            onClick={() => onToast('Backup started before the change')}
          >
            <i className="ti ti-archive me-1" />
            Back up first
          </button>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center"
            onClick={() => {
              onToast('Storage settings saved');
              onClose();
            }}
          >
            <i className="ti ti-device-floppy me-1" />
            Save changes
          </button>
        </div>
      }
    >
      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="sys-card-body">
            <span className="sys-lbl">Configuration details</span>
            {[
              ['Mount point', VOLUME_PATH],
              ['Device', '/dev/nvme1n1'],
              ['File system', 'ext4'],
              ['Capacity', `${VOLUME_GB} GB`],
              ['Used', `${USED_GB} GB`],
              ['Growth rate', `~${GROWTH_GB_PER_DAY} GB per day`],
            ].map(([key, value]) => (
              <div className="sys-row" key={key}>
                <div className="sys-row-key">{key}</div>
                <div className="sys-row-val">{value}</div>
              </div>
            ))}
          </div>

          <div className="sys-card-body">
            <span className="sys-lbl">What is on the volume</span>
            <DiskBar />
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="sys-card-body">
            <span className="sys-lbl">Validation</span>
            <div className="sys-check">
              <i className="ti ti-circle-check" />
              <div>
                Volume is writable
                <span>Test file written and removed at 02:14.</span>
              </div>
            </div>
            <div className="sys-check">
              <i className="ti ti-circle-check" />
              <div>
                Backups are on a different volume
                <span>
                  And in a different region, so a disk failure does not take both.
                </span>
              </div>
            </div>
            <div className="sys-check is-warn">
              <i className="ti ti-alert-circle" />
              <div>
                {DISK_PERCENT}% used, alert threshold {DISK_ALERT_AT}%
                <span>
                  Growing at roughly {GROWTH_GB_PER_DAY} GB a day, most of it logs.
                </span>
              </div>
            </div>
            <div className="sys-check is-warn">
              <i className="ti ti-alert-circle" />
              <div>
                No automatic expansion
                <span>
                  The volume is fixed. At the current rate the threshold is reached in about{' '}
                  {headroom} days.
                </span>
              </div>
            </div>
          </div>

          <div className="sys-card-body">
            <span className="sys-lbl">System impact</span>
            <p className="fs-12 text-muted mb-2">
              Reducing log retention to 30 days returns roughly {RECLAIMABLE_GB} GB and takes the
              volume to {afterReclaim}%.
            </p>
            <div className="sys-check">
              <i className="ti ti-circle-check" />
              <div>
                No downtime
                <span>Old files are removed by the nightly cleanup, not by a restart.</span>
              </div>
            </div>
            <div className="sys-check">
              <i className="ti ti-circle-check" />
              <div>
                Audit logs are unaffected
                <span>They are retained for three years under a separate rule.</span>
              </div>
            </div>
            <div className="sys-check is-warn">
              <i className="ti ti-alert-circle" />
              <div>
                Loses application logs older than 30 days
                <span>
                  Only relevant to an investigation that goes back further than a month.
                </span>
              </div>
            </div>
          </div>

          <div className="sys-card-body">
            <span className="sys-lbl">Dependencies</span>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              {['Backups', 'Logging', 'Object storage', 'Nightly cleanup'].map((chip) => (
                <span className="badge-meta" key={chip}>
                  {chip}
                </span>
              ))}
            </div>
            <p className="fs-12 text-muted mb-0">
              If this volume fills, uploads fail first and the nightly backup fails second. Neither
              is announced to a user; both appear only in the log. {logs?.size ?? 0} GB of it is
              logs, and {FREE_GB} GB is free.
            </p>
          </div>

          <div className="sys-card-body">
            <span className="sys-lbl">Audit history</span>
            {[
              {
                id: 'w1',
                date: '31 Jul 2026',
                time: '02:14',
                what: `Usage measured at ${DISK_PERCENT}%`,
                who: 'System · nightly',
              },
              {
                id: 'w2',
                date: '02 Jun 2026',
                time: '14:02',
                what: 'Log retention raised 30 to 90 days',
                who: 'r.venkatesh',
              },
              {
                id: 'w3',
                date: '14 Apr 2026',
                time: '11:30',
                what: 'Backups moved off this volume',
                who: 'latha.rao · ap-southeast-1',
              },
              {
                id: 'w4',
                date: '08 Sep 2025',
                time: '10:00',
                what: `Volume provisioned at ${VOLUME_GB} GB`,
                who: 'r.venkatesh · at install',
              },
            ].map((entry) => (
              <div className="sys-audit" key={entry.id}>
                <div className="sys-audit-when">
                  <strong>{entry.date}</strong>
                  {entry.time}
                </div>
                <div className="sys-audit-what">
                  {entry.what}
                  <span>{entry.who}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Offcanvas>
  );
};

export default SystemWorkspace;
