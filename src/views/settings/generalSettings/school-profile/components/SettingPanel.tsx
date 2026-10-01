import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import {
  PANEL_CHECKS,
  PANEL_NOTE,
  PANEL_PREVIEWS,
  PANEL_PREVIOUS,
  PANEL_RELATED,
  PANEL_SUB,
  PANEL_TITLE,
  PANEL_USAGE,
  PANEL_VALUE,
  PANEL_WARNINGS,
  SURFACES,
} from '../data/profile.data';

export interface SettingPanelProps {
  open: boolean;
  onClose: () => void;
  /** The field the pencil was clicked on, where the page knows it. */
  field?: string | null;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="option-row">
    <span className="option-row-key">
      <span className="state-dot" />
      {label}
    </span>
    <span className="option-row-value">{value}</span>
  </div>
);

const SettingPanel = ({ open, onClose, field, onToast }: SettingPanelProps) => (
  <Offcanvas
    open={open}
    onClose={onClose}
    title={field ?? PANEL_TITLE}
    placement="end"
    labelledById="settingPanelLabel"
    footer={
      <div className="d-flex gap-2">
        <ActionLink className="btn btn-light" onClick={onClose}>
          Cancel
        </ActionLink>
        <button
          type="button"
          className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
          onClick={() => {
            onToast(`${field ?? PANEL_TITLE} saved as a draft`);
            onClose();
          }}
        >
          <i className="ti ti-device-floppy me-1" />
          Save change
        </button>
      </div>
    }
  >
    <p className="fs-12 text-muted">{PANEL_SUB}</p>
    <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
      <span className="meta-badge is-active">
        <i className="ti ti-circle-check-filled me-1" />
        Published
      </span>
      <span className="meta-badge is-plain">
        <i className="ti ti-lock me-1" />
        Admin only
      </span>
      {PANEL_WARNINGS > 0 ? (
        <span className="meta-badge is-pending">
          <i className="ti ti-alert-triangle me-1" />
          {PANEL_WARNINGS} validation warning
        </span>
      ) : null}
    </div>

    <span className="eyebrow-label">Current configuration</span>
    <div className="option-card mb-3">
      <div className="option-card-head">
        <span className="option-card-icon">
          <i className="ti ti-palette" />
        </span>
        <div className="flex-fill overflow-hidden">
          <p className="option-card-title">Current value · Primary brand colour</p>
          <p className="fs-12 text-muted mb-0">
            Changed from <code>{PANEL_PREVIOUS}</code>
          </p>
        </div>
        <span className="meta-badge is-active">Live</span>
      </div>
      <div className="option-card-body">
        <Row label="Value" value={<code>{PANEL_VALUE}</code>} />
        <Row label="Previous value" value={<code>{PANEL_PREVIOUS}</code>} />
      </div>
    </div>
    <p className="fs-13 text-muted">{PANEL_NOTE}</p>

    <span className="eyebrow-label">Preview · {PANEL_PREVIEWS.length} surfaces</span>
    <div className="mb-3">
      {PANEL_PREVIEWS.map((preview) => (
        <div className="usage-row" key={preview}>
          <span className="usage-row-icon">
            <i className="ti ti-eye" />
          </span>
          <span className="flex-fill overflow-hidden">
            <span className="d-block fs-13 fw-medium text-dark">{preview}</span>
          </span>
        </div>
      ))}
    </div>

    <span className="eyebrow-label">
      Validation · {PANEL_WARNINGS} {PANEL_WARNINGS === 1 ? 'warning' : 'warnings'}
    </span>
    <div className="mb-3">
      {PANEL_CHECKS.map((check) => (
        <div className="usage-row" key={check.label}>
          <span className="usage-row-icon">
            <i className={check.passed ? 'ti ti-circle-check' : 'ti ti-alert-triangle'} />
          </span>
          <span className="flex-fill overflow-hidden">
            <span className="d-block fs-13 text-dark">{check.label}</span>
          </span>
        </div>
      ))}
    </div>

    <span className="eyebrow-label">Related settings · {PANEL_RELATED.length}</span>
    <div className="mb-3">
      {PANEL_RELATED.map((row) => (
        <Row key={row.key} label={row.key} value={row.value} />
      ))}
    </div>

    <span className="eyebrow-label">Usage · {SURFACES.length} surfaces</span>
    <div>
      {PANEL_USAGE.map((row) => (
        <Row key={row.key} label={row.key} value={row.value} />
      ))}
    </div>
  </Offcanvas>
);

export default SettingPanel;
