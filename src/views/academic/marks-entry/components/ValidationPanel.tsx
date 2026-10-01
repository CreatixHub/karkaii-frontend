import type { EntrySummary } from './ExamSelectionPanel';
import { pad2 } from '../data/marksEntry.data';

export interface ValidationPanelProps {
  summary: EntrySummary;
  /** Draft until Publish Marks succeeds. */
  saveState: 'Draft' | 'Published';
  lastSaved: string;
  locked: boolean;
  onReset: () => void;
  onPrint: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const ValidationPanel = ({
  summary,
  saveState,
  lastSaved,
  locked,
  onReset,
  onPrint,
  onSaveDraft,
  onPublish,
}: ValidationPanelProps) => {
  const validation =
    summary.pending > 0
      ? { badge: 'badge-soft-warning', icon: 'ti ti-alert-circle', label: `${summary.pending} pending` }
      : { badge: 'badge-soft-success', icon: 'ti ti-circle-check', label: 'All entries valid' };

  const save = locked
    ? { badge: 'badge-soft-success', icon: 'ti ti-send', label: `Published ${lastSaved}` }
    : { badge: 'badge-soft-success', icon: 'ti ti-device-floppy', label: `${saveState} ${lastSaved}` };

  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-xl-2 col-md-4 col-6">
            <p className="fs-12 text-muted mb-1">Total Students</p>
            <h6 className="fs-14 mb-0">{summary.students}</h6>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <p className="fs-12 text-muted mb-1">Entered Marks</p>
            <h6 className="fs-14 mb-0 text-success">{summary.entered}</h6>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <p className="fs-12 text-muted mb-1">Missing Entries</p>
            <h6 className="fs-14 mb-0 text-warning">{pad2(summary.pending)}</h6>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <p className="fs-12 text-muted mb-1">Absent Count</p>
            <h6 className="fs-14 mb-0 text-danger">{pad2(summary.absent)}</h6>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <p className="fs-12 text-muted mb-1">Validation Status</p>
            <span className={`badge ${validation.badge} d-inline-flex align-items-center`}>
              <i className={`${validation.icon} me-1`} />
              {validation.label}
            </span>
          </div>
          <div className="col-xl-2 col-md-4 col-6">
            <p className="fs-12 text-muted mb-1">Save Status</p>
            <span className={`badge ${save.badge} d-inline-flex align-items-center`}>
              <i className={`${save.icon} me-1`} />
              {save.label}
            </span>
          </div>
        </div>
      </div>
      <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
        <p className="mb-0 fs-12 text-muted">
          <i className="ti ti-info-circle me-1" />
          Publishing locks the sheet and notifies parents. Missing entries must be completed or marked absent
          first.
        </p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            onClick={onReset}
          >
            <i className="ti ti-rotate me-1" />
            Reset
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            onClick={onPrint}
          >
            <i className="ti ti-printer me-1" />
            Print
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            onClick={onSaveDraft}
            disabled={locked}
          >
            <i className="ti ti-device-floppy me-1" />
            Save Draft
          </button>
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center"
            onClick={onPublish}
            disabled={locked}
          >
            <i className="ti ti-send me-1" />
            Publish Marks
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
