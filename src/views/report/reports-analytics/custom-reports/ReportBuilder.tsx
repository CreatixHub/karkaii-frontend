import { useMemo } from 'react';
import { ActionLink } from '@components/workspace';
import type { BuildState } from './data/customReports.data';
import {
  availableFieldsOf,
  CATEGORY_OPTIONS,
  DATA_SOURCES,
  describeBuild,
  estimatedRowsOf,
  FORMAT_OPTIONS,
  GROUP_OPTIONS,
  JOIN_KEY,
  moduleOptions,
  operatorsFor,
  previewRows,
  previewSubtotal,
  previewOutstandingOf,
  PREVIEW_MATCHING_ROWS,
  ROW_LIMIT_OPTIONS,
  rupees,
  VISIBILITY_OPTIONS,
} from './data/customReports.data';

export interface ReportBuilderProps {
  build: BuildState;
  onChange: (next: BuildState) => void;
  onReset: () => void;
  onSaveTemplate: () => void;
  onRun: () => void;
  dirty: boolean;
}

const ReportBuilder = ({ build, onChange, onReset, onSaveTemplate, onRun, dirty }: ReportBuilderProps) => {
  const available = useMemo(() => availableFieldsOf(build), [build]);
  const grouped = useMemo(() => {
    const map = new Map<string, string[]>();
    available.forEach((field) => {
      map.set(field.module, [...(map.get(field.module) ?? []), field.label]);
    });
    return [...map.entries()];
  }, [available]);

  const set = <K extends keyof BuildState>(key: K, value: BuildState[K]) =>
    onChange({ ...build, [key]: value });

  /** Dropping a module drops the columns and conditions that read from it. */
  const toggleSource = (source: string) => {
    const sources = build.sources.includes(source)
      ? build.sources.filter((item) => item !== source)
      : [...build.sources, source];
    const stillAvailable = availableFieldsOf({ ...build, sources }).map((field) => field.label);
    onChange({
      ...build,
      sources,
      fields: build.fields.filter((field) => stillAvailable.includes(field)),
      conditions: build.conditions.filter((condition) => stillAvailable.includes(condition.field)),
      sortBy: stillAvailable.includes(build.sortBy) ? build.sortBy : '',
    });
  };

  const toggleField = (label: string) =>
    set(
      'fields',
      build.fields.includes(label)
        ? build.fields.filter((item) => item !== label)
        : [...build.fields, label],
    );

  const addCondition = () => {
    const first = available.find((field) => !build.conditions.some((c) => c.field === field.label));
    if (!first) return;
    set('conditions', [
      ...build.conditions,
      { field: first.label, operator: operatorsFor(first.label)[0], value: '' },
    ]);
  };

  const setCondition = (index: number, patch: Partial<BuildState['conditions'][number]>) =>
    set(
      'conditions',
      build.conditions.map((condition, position) =>
        position === index ? { ...condition, ...patch } : condition,
      ),
    );

  const removeCondition = (index: number) =>
    set(
      'conditions',
      build.conditions.filter((_, position) => position !== index),
    );

  const subtotal = previewSubtotal(previewRows);
  const filledConditions = build.conditions.filter((condition) => condition.field && condition.value).length;

  return (
    <div className="card">
      <div className="card-header border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h5 className="fs-16 mb-0">Report Builder</h5>
          <span className="fs-12 text-muted">Pick the modules, choose the columns, then save or run</span>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          {dirty ? <span className="badge badge-soft-warning">Unsaved draft</span> : null}
          <ActionLink className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center" onClick={onReset}>
            <i className="ti ti-restore me-1" />
            Reset Builder
          </ActionLink>
          <ActionLink
            className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
            onClick={onSaveTemplate}
          >
            <i className="ti ti-bookmark-plus me-1" />
            Save as Template
          </ActionLink>
          <ActionLink className="btn btn-sm btn-primary d-inline-flex align-items-center" onClick={onRun}>
            <i className="ti ti-player-play me-1" />
            Build Report
          </ActionLink>
        </div>
      </div>

      <div className="card-body">
        {/* ------------------------ Step 1 — name and place it ------------------ */}
        <h6 className="fs-14 mb-3">
          <span className="badge badge-soft-primary me-2">Step 01</span>
          Name it and place it
        </h6>
        <div className="row g-3 mb-4">
          <div className="col-xl-4 col-md-6">
            <label className="form-label mb-1 fs-12" htmlFor="cr-name">
              Report Name
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id="cr-name"
              value={build.name}
              onChange={(event) => set('name', event.target.value)}
            />
          </div>
          <div className="col-xl-2 col-md-6">
            <label className="form-label mb-1 fs-12" htmlFor="cr-category">
              Report Category
            </label>
            <select
              className="form-select lh-base"
              id="cr-category"
              value={build.category}
              onChange={(event) => set('category', event.target.value)}
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-xl-2 col-md-6">
            <label className="form-label mb-1 fs-12" htmlFor="cr-primary">
              Primary Module
            </label>
            <select
              className="form-select lh-base"
              id="cr-primary"
              value={build.primaryModule}
              onChange={(event) => set('primaryModule', event.target.value)}
            >
              {moduleOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-xl-2 col-md-6">
            <label className="form-label mb-1 fs-12" htmlFor="cr-format">
              Output Format
            </label>
            <select
              className="form-select lh-base"
              id="cr-format"
              value={build.format}
              onChange={(event) => set('format', event.target.value)}
            >
              {FORMAT_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-xl-2 col-md-6">
            <label className="form-label mb-1 fs-12" htmlFor="cr-visibility">
              Visibility
            </label>
            <select
              className="form-select lh-base"
              id="cr-visibility"
              value={build.visibility}
              onChange={(event) => set('visibility', event.target.value)}
            >
              {VISIBILITY_OPTIONS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ------------------- Step 2 — the modules it reads from --------------- */}
        <div className="border-top pt-3 mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
            <h6 className="fs-14 mb-0">
              <span className="badge badge-soft-primary me-2">Step 02</span>
              The modules the report reads from
            </h6>
            <span className="fs-12 text-muted">
              {build.sources.length} of {DATA_SOURCES.length} selected
              {build.sources.length > 1 ? ` · joined on ${JOIN_KEY}` : ''}
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {DATA_SOURCES.map((source) => {
              const on = build.sources.includes(source);
              return (
                <button
                  type="button"
                  className={`btn btn-sm ${on ? 'btn-primary' : 'btn-outline-light bg-white'}`}
                  key={source}
                  aria-pressed={on}
                  onClick={() => toggleSource(source)}
                >
                  <i className={`ti ${on ? 'ti-check' : 'ti-plus'} me-1`} />
                  {source}
                </button>
              );
            })}
          </div>
        </div>

        {/* ------------------- Step 3 — columns and conditions ------------------ */}
        <div className="border-top pt-3 mb-3">
          <h6 className="fs-14 mb-3">
            <span className="badge badge-soft-primary me-2">Step 03</span>
            Columns and conditions
          </h6>

          <div className="row g-3">
            <div className="col-lg-6">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fs-13 fw-medium">Available Fields</span>
                <span className="fs-12 text-muted">
                  {available.length} {available.length === 1 ? 'field' : 'fields'}
                </span>
              </div>
              <div className="border rounded p-2" style={{ maxHeight: 260, overflowY: 'auto' }}>
                {grouped.length === 0 ? (
                  <p className="fs-12 text-muted mb-0">Select a module to see the fields it offers.</p>
                ) : (
                  grouped.map(([module, fields]) => (
                    <div className="mb-2" key={module}>
                      <span className="fs-12 text-muted fw-semibold d-block mb-1">{module}</span>
                      <div className="d-flex flex-wrap gap-1">
                        {fields.map((label) => {
                          const on = build.fields.includes(label);
                          return (
                            <button
                              type="button"
                              className={`badge border-0 ${on ? 'badge-soft-primary' : 'badge-soft-secondary'}`}
                              key={label}
                              aria-pressed={on}
                              onClick={() => toggleField(label)}
                            >
                              <i className={`ti ${on ? 'ti-check' : 'ti-plus'} me-1`} />
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fs-13 fw-medium">Selected Fields</span>
                <span className="fs-12 text-muted">
                  {build.fields.length} {build.fields.length === 1 ? 'column' : 'columns'}
                  {build.fields.length > 0 ? (
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-0 ms-2 fs-12"
                      onClick={() => set('fields', [])}
                    >
                      Clear all
                    </button>
                  ) : null}
                </span>
              </div>
              <div className="border rounded p-2" style={{ maxHeight: 260, overflowY: 'auto' }}>
                {build.fields.length === 0 ? (
                  <p className="fs-12 text-muted mb-0">
                    Pick a field on the left. Column order follows the numbering.
                  </p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {build.fields.map((label, index) => (
                      <li
                        className="d-flex align-items-center justify-content-between border rounded px-2 py-1 mb-1"
                        key={label}
                      >
                        <span className="fs-12">
                          <span className="badge badge-soft-secondary me-2">{index + 1}</span>
                          {label}
                        </span>
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 text-danger"
                          aria-label={`Remove ${label}`}
                          onClick={() => toggleField(label)}
                        >
                          <i className="ti ti-x" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3 mb-2">
            <span className="fs-13 fw-medium">Filter Builder</span>
            <span className="fs-12 text-muted">
              {build.conditions.length} {build.conditions.length === 1 ? 'condition' : 'conditions'}
            </span>
          </div>
          {build.conditions.map((condition, index) => (
            <div className="row g-2 align-items-center mb-2" key={`${condition.field}-${index}`}>
              <div className="col-md-4">
                <select
                  className="form-select form-select-sm"
                  value={condition.field}
                  aria-label="Condition field"
                  onChange={(event) =>
                    setCondition(index, {
                      field: event.target.value,
                      operator: operatorsFor(event.target.value)[0],
                    })
                  }
                >
                  {available.map((field) => (
                    <option key={field.label}>{field.label}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select form-select-sm"
                  value={condition.operator}
                  aria-label="Condition operator"
                  onChange={(event) => setCondition(index, { operator: event.target.value })}
                >
                  {operatorsFor(condition.field).map((operator) => (
                    <option key={operator}>{operator}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={condition.value}
                  aria-label="Condition value"
                  placeholder="Value"
                  onChange={(event) => setCondition(index, { value: event.target.value })}
                />
              </div>
              <div className="col-md-1 text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light bg-white btn-icon"
                  aria-label="Remove condition"
                  onClick={() => removeCondition(index)}
                >
                  <i className="ti ti-trash" />
                </button>
              </div>
            </div>
          ))}
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button type="button" className="btn btn-sm btn-outline-light bg-white" onClick={addCondition}>
              <i className="ti ti-plus me-1" />
              Add
            </button>
            <div className="custom-btn-group custom-btn-group-fill custom-btn-group-sm" role="group">
              <span>
                <input
                  type="radio"
                  className="btn-check"
                  name="cr-match"
                  id="cr-match-all"
                  checked={build.matchAll}
                  onChange={() => set('matchAll', true)}
                />
                <label className="btn" htmlFor="cr-match-all">
                  Match All conditions
                </label>
              </span>
              <span>
                <input
                  type="radio"
                  className="btn-check"
                  name="cr-match"
                  id="cr-match-any"
                  checked={!build.matchAll}
                  onChange={() => set('matchAll', false)}
                />
                <label className="btn" htmlFor="cr-match-any">
                  Any condition
                </label>
              </span>
            </div>
          </div>
        </div>

        {/* ------------------ Step 4 — shaping and time window ------------------ */}
        <div className="border-top pt-3 mb-3">
          <h6 className="fs-14 mb-3">
            <span className="badge badge-soft-primary me-2">Step 04</span>
            Shaping and time window
          </h6>
          <div className="row g-3">
            <div className="col-xl-3 col-md-6">
              <label className="form-label mb-1 fs-12" htmlFor="cr-sort">
                Sort By
              </label>
              <select
                className="form-select lh-base"
                id="cr-sort"
                value={build.sortBy}
                onChange={(event) => set('sortBy', event.target.value)}
              >
                <option value="">No sort</option>
                {build.fields.map((field) => (
                  <option key={field}>{field}</option>
                ))}
              </select>
            </div>
            <div className="col-xl-2 col-md-6">
              <label className="form-label mb-1 fs-12" htmlFor="cr-direction">
                Direction
              </label>
              <select
                className="form-select lh-base"
                id="cr-direction"
                value={build.sortDescending ? 'Descending' : 'Ascending'}
                onChange={(event) => set('sortDescending', event.target.value === 'Descending')}
              >
                <option>Descending</option>
                <option>Ascending</option>
              </select>
            </div>
            <div className="col-xl-3 col-md-6">
              <label className="form-label mb-1 fs-12" htmlFor="cr-group">
                Group By
              </label>
              <select
                className="form-select lh-base"
                id="cr-group"
                value={build.groupBy}
                onChange={(event) => set('groupBy', event.target.value)}
              >
                {GROUP_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="col-xl-2 col-md-6">
              <label className="form-label mb-1 fs-12" htmlFor="cr-subtotals">
                Subtotals
              </label>
              <select
                className="form-select lh-base"
                id="cr-subtotals"
                value={build.subtotals ? 'With subtotals' : 'No subtotals'}
                onChange={(event) => set('subtotals', event.target.value === 'With subtotals')}
                disabled={build.groupBy === 'No grouping'}
              >
                <option>With subtotals</option>
                <option>No subtotals</option>
              </select>
            </div>
            <div className="col-xl-2 col-md-6">
              <label className="form-label mb-1 fs-12" htmlFor="cr-limit">
                Row Limit
              </label>
              <select
                className="form-select lh-base"
                id="cr-limit"
                value={build.rowLimit}
                onChange={(event) => set('rowLimit', event.target.value)}
              >
                {ROW_LIMIT_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ------------- Step 5 — what the configuration adds up to ------------- */}
        <div className="border-top pt-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
            <h6 className="fs-14 mb-0">
              <span className="badge badge-soft-primary me-2">Step 05</span>
              What the configuration adds up to
            </h6>
            <div className="d-flex flex-wrap gap-1">
              <span className="badge badge-soft-primary">
                {build.sources.length} {build.sources.length === 1 ? 'module' : 'modules'}
              </span>
              <span className="badge badge-soft-info">
                {build.fields.length} {build.fields.length === 1 ? 'column' : 'columns'}
              </span>
              <span className="badge badge-soft-warning">
                {filledConditions} {filledConditions === 1 ? 'filter' : 'filters'}
              </span>
              <span className="badge badge-soft-success">
                {estimatedRowsOf(build).toLocaleString()} rows estimated
              </span>
            </div>
          </div>

          <p className="fs-13 text-muted mb-3">{describeBuild(build)}</p>

          <div className="table-responsive border rounded">
            <table className="table table-sm align-middle mb-0">
              <caption className="visually-hidden">
                Preview of the first three rows the configuration returns
              </caption>
              <thead>
                <tr>
                  <th>Admission No.</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Guardian</th>
                  <th className="text-end">Total Fee</th>
                  <th className="text-end">Paid</th>
                  <th className="text-end">Outstanding</th>
                  <th className="text-center">Days Overdue</th>
                  <th className="text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row) => (
                  <tr key={row.admission}>
                    <td className="fs-13">{row.admission}</td>
                    <td className="fs-13">{row.student}</td>
                    <td className="fs-13">{row.section}</td>
                    <td className="fs-12 text-muted">{row.guardian}</td>
                    <td className="text-end fs-13">{rupees(row.totalFee)}</td>
                    <td className="text-end fs-13">{rupees(row.paid)}</td>
                    <td className="text-end fs-13">{rupees(previewOutstandingOf(row))}</td>
                    <td className="text-center fs-13">{row.daysOverdue}</td>
                    <td className="text-center fs-13">{row.attendance}%</td>
                  </tr>
                ))}
                {build.subtotals && build.groupBy !== 'No grouping' ? (
                  <tr className="fw-semibold">
                    <td className="fs-13" colSpan={4}>
                      Subtotal · {build.groupBy}
                    </td>
                    <td className="text-end fs-13">{rupees(subtotal.totalFee)}</td>
                    <td className="text-end fs-13">{rupees(subtotal.paid)}</td>
                    <td className="text-end fs-13">{rupees(subtotal.outstanding)}</td>
                    <td className="text-center fs-13">—</td>
                    <td className="text-center fs-13">{subtotal.attendance}%</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="fs-12 text-muted mt-2 mb-0">
            Preview shows the first {previewRows.length} of{' '}
            {estimatedRowsOf(build).toLocaleString()} matching rows
            {estimatedRowsOf(build) !== PREVIEW_MATCHING_ROWS ? ' at the current conditions' : ''}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportBuilder;
