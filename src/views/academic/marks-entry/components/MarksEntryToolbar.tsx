import type { ExamContext, ExamContextKey, SelectorField } from '../data/marksEntry.data';

export interface MarksEntryToolbarProps {
  fields: SelectorField[];
  context: ExamContext;
  onContext: (key: ExamContextKey, value: string) => void;
  search: string;
  onSearch: (value: string) => void;
  onRefresh: () => void;
  onPrint: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
  /** Published sheets are read-only until the panel's Reset puts them back in draft. */
  locked: boolean;
}

const MarksEntryToolbar = ({
  fields,
  context,
  onContext,
  search,
  onSearch,
  onRefresh,
  onPrint,
  onSaveDraft,
  onPublish,
  locked,
}: MarksEntryToolbarProps) => (
  <div className="card">
    <div className="card-body">
      <div className="row g-2 align-items-end">
        {fields.map((field) => (
          <div className="col-xxl col-lg-4 col-sm-6" key={field.key}>
            <label className="form-label fs-12 mb-1" htmlFor={field.domId}>
              {field.label}
            </label>
            <select
              className="form-select"
              id={field.domId}
              value={context[field.key]}
              onChange={(event) => onContext(field.key, event.target.value)}
            >
              {field.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
    <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
      <div className="input-group input-group-sm w-auto">
        <span className="input-group-text bg-white border-end-0">
          <i className="ti ti-search" />
        </span>
        <input
          type="text"
          className="form-control border-start-0 ps-0"
          placeholder="Search student, roll or admission number"
          aria-label="Search student, roll or admission number"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>
      <div className="d-flex align-items-center flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-outline-light bg-white btn-sm btn-icon"
          aria-label="Refresh"
          title="Refresh"
          onClick={onRefresh}
        >
          <i className="ti ti-refresh" />
        </button>
        <button
          type="button"
          className="btn btn-outline-light bg-white btn-sm btn-icon"
          aria-label="Print"
          title="Print"
          onClick={onPrint}
        >
          <i className="ti ti-printer" />
        </button>
        <button
          type="button"
          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
          onClick={onSaveDraft}
          disabled={locked}
        >
          <i className="ti ti-device-floppy me-1" />
          Save Draft
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm d-inline-flex align-items-center"
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

export default MarksEntryToolbar;
