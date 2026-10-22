import Offcanvas from '@components/ui/Offcanvas';
import type { AwardModalId } from '../data/awardsWorkspace.data';
import type { AchievementPanelData, PanelEntry, PanelRow } from '../data/achievementPanel.data';

export interface AchievementPanelProps {
  open: boolean;
  onClose: () => void;
  panel: AchievementPanelData;
  onOpenModal: (modal: AwardModalId) => void;
}

const Rows = ({ rows }: { rows: PanelRow[] }) => (
  <>
    {rows.map((row, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${
          index === rows.length - 1 ? 'mb-0' : 'mb-2'
        }`}
        key={row.label}
      >
        <span className="fs-13 text-muted">{row.label}</span>
        {row.badgeClass ? (
          <span className={`badge ${row.badgeClass}`}>{row.value}</span>
        ) : (
          <span className={`fs-13 fw-medium${row.alignEnd ? ' text-end' : ''}`}>{row.value}</span>
        )}
      </div>
    ))}
  </>
);

const Entry = ({ entry }: { entry: PanelEntry }) => (
  <div className={`d-flex align-items-center gap-2 border rounded p-2 ${entry.last ? 'mb-3' : 'mb-2'}`}>
    <span className={`avatar avatar-sm ${entry.tint} rounded flex-shrink-0`}>
      <i className={entry.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h6 className={`fs-13 mb-0${entry.truncate ? ' text-truncate' : ''}`}>{entry.title}</h6>
      <span className="fs-12 text-muted">{entry.meta}</span>
    </div>
    {entry.download ? (
      <a
        role="button"
        tabIndex={0}
        className="dt-ib"
        aria-label={entry.download}
      >
        <i className="ti ti-download" />
      </a>
    ) : null}
  </div>
);

const AchievementPanel = ({ open, onClose, panel, onOpenModal }: AchievementPanelProps) => (
  <Offcanvas
    open={open}
    onClose={onClose}
    title="Achievement Details"
    placement="end"
    labelledById="aw_panel_lbl"
  >
    <h6 className="fs-14 mb-2">Student Information</h6>
    <div className="d-flex align-items-center mb-3">
      <span className="avatar avatar-lg bg-info-transparent text-info rounded flex-shrink-0">
        <i className="ti ti-school fs-20" />
      </span>
      <div className="ms-2">
        <h6 className="mb-0">{panel.student}</h6>
        <span className="fs-12 text-muted">{panel.meta}</span>
      </div>
      <span className="badge badge-soft-success ms-auto">{panel.status}</span>
    </div>
    <div className="border rounded p-3 mb-3">
      <Rows rows={panel.studentRows} />
    </div>

    <h6 className="fs-14 mb-2">Achievement Summary</h6>
    <div className="border rounded p-3 mb-3">
      <Rows rows={panel.summaryRows} />
    </div>

    <div className="row g-2 mb-3">
      {panel.tiles.map((tile) => (
        <div className="col-4" key={tile.label}>
          <div className="border rounded p-2 text-center">
            <span className="fs-12 text-muted d-block mb-1">{tile.label}</span>
            <h6 className={`fs-14 mb-0${tile.valueClass ? ` ${tile.valueClass}` : ''}`}>
              {tile.value}
            </h6>
          </div>
        </div>
      ))}
    </div>

    <h6 className="fs-14 mb-2">Award Information</h6>
    <div className="border rounded p-3 mb-3">
      <Rows rows={panel.awardRows} />
    </div>

    <h6 className="fs-14 mb-2">Supporting Documents</h6>
    {panel.documents.map((entry) => (
      <Entry entry={entry} key={entry.id} />
    ))}

    <h6 className="fs-14 mb-2">Achievement Timeline</h6>
    {panel.timeline.map((entry) => (
      <Entry entry={entry} key={entry.id} />
    ))}

    <h6 className="fs-14 mb-2">Audit History</h6>
    {panel.audit.map((entry) => (
      <Entry entry={entry} key={entry.id} />
    ))}

    <div className="d-flex gap-2">
      <button
        type="button"
        className="btn btn-primary flex-fill"
        onClick={() => {
          onClose();
          onOpenModal('print');
        }}
      >
        <i className="ti ti-printer me-1" />
        Print Award
      </button>
      <button
        type="button"
        className="btn btn-outline-light bg-white"
        onClick={() => {
          onClose();
          onOpenModal('edit');
        }}
      >
        <i className="ti ti-edit me-1" />
        Edit
      </button>
    </div>
  </Offcanvas>
);

export default AchievementPanel;
