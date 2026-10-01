import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import type { SavedReport } from '../data/customReports.data';
import {
  categoryOptions,
  exportOptions,
  isScheduledOf,
  moduleOptions,
  ownerLabelOf,
  ownerOptions,
  REGISTER_TOTAL,
  scheduleOptions,
  stateOf,
  statePill,
  stateTint,
  visibilityOptions,
} from '../data/customReports.data';

export type CustomModalId =
  | 'create'
  | 'edit'
  | 'duplicate'
  | 'template'
  | 'schedule'
  | 'export'
  | 'share'
  | 'publish'
  | 'delete'
  | 'view';

export interface CustomModalsProps {
  active: CustomModalId | null;
  onClose: () => void;
  row: SavedReport | null;
  rows: SavedReport[];
  selected: SavedReport[];
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onPublish: (ids: string[]) => void;
  onDuplicate: (id: string, name: string) => void;
  onDelete: (ids: string[]) => void;
  onRename: (id: string, name: string, category: string) => void;
}

const Field = ({
  label,
  children,
  span = 'col-md-6',
}: {
  label: string;
  children: React.ReactNode;
  span?: string;
}) => (
  <div className={span}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const Select = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) =>
  onChange ? (
    <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  ) : (
    <select className="form-select" defaultValue={options[0]}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );

const Switch = ({ label, on = false, id }: { label: string; on?: boolean; id: string }) => (
  <div className="form-check form-switch mb-2">
    <input className="form-check-input" type="checkbox" role="switch" id={id} defaultChecked={on} />
    <label className="form-check-label fs-13" htmlFor={id}>
      {label}
    </label>
  </div>
);

const ReportStrip = ({ row }: { row: SavedReport }) => (
  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border rounded p-3 mb-3">
    <div>
      <h6 className="fs-15 mb-0">{row.name}</h6>
      <span className="fs-12 text-muted">
        {row.id} · {row.columns} columns · {ownerLabelOf(row)}
      </span>
    </div>
    <span className={`dt-pill ${statePill[stateOf(row)]}`}>
      <span className="dt-pill-dot" />
      {stateOf(row)}
    </span>
  </div>
);

const CustomModals = ({
  active,
  onClose,
  row,
  rows,
  selected,
  panelOpen,
  onClosePanel,
  onToast,
  onPublish,
  onDuplicate,
  onDelete,
  onRename,
}: CustomModalsProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);

  const detail = row ?? rows[0] ?? null;
  const publishable = selected.length > 0 ? selected : rows.filter((item) => stateOf(item) !== 'Published');
  const deletable = selected.length > 0 ? selected : detail ? [detail] : [];
  const archived = rows.filter((item) => stateOf(item) === 'Archived');

  useEffect(() => {
    if (!detail) return;
    if (active === 'edit') {
      setName(detail.name);
      setCategory(detail.category);
    }
    if (active === 'duplicate') {
      setName(`${detail.name} (copy)`);
      setCategory(detail.category);
    }
    if (active === 'create') {
      setName('');
      setCategory(categoryOptions[0]);
    }
  }, [active, detail]);

  const footerButtons = (label: string, icon: string, onConfirm: () => void) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="btn btn-primary" onClick={onConfirm}>
        <i className={`${icon} me-1`} />
        {label}
      </button>
    </>
  );

  const confirm = (message: string) => () => {
    onClose();
    onToast(message);
  };

  const nameAndCategory = (
    <>
      <Field label="Report Name" span="col-12">
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="What this report answers"
        />
      </Field>
      <Field label="Report Category">
        <Select options={categoryOptions} value={category} onChange={setCategory} />
      </Field>
      <Field label="Primary Module">
        <Select options={moduleOptions} />
      </Field>
    </>
  );

  return (
    <>
      {/* ------------------------------ Create Report ---------------------------- */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="New Custom Report"
        footer={footerButtons('Create Report', 'ti ti-square-rounded-plus', () => {
          if (!name.trim()) {
            onToast('Give the report a name', 'warning');
            return;
          }
          onClose();
          onToast(`${name.trim()} created as a draft`);
        })}
      >
        <p className="text-muted fs-13 mb-3">
          A new report starts as a private draft. Configure it in the builder below, then publish.
        </p>
        <div className="row g-3">
          {nameAndCategory}
          <Field label="Visibility">
            <Select options={visibilityOptions} />
          </Field>
          <Field label="Owner">
            <Select options={ownerOptions} />
          </Field>
          <Field label="Description" span="col-12">
            <textarea className="form-control" rows={2} placeholder="What this report is for, and who reads it." />
          </Field>
          <div className="col-12">
            <Switch id="cr-new-builder" label="Open the builder with this report loaded" on />
            <Switch id="cr-new-favorite" label="Add to my favorites" />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Edit Report ----------------------------- */}
      <Modal
        open={active === 'edit' && detail !== null}
        onClose={onClose}
        title="Edit Report"
        footer={footerButtons('Save Changes', 'ti ti-device-floppy', () => {
          if (!detail) return;
          if (!name.trim()) {
            onToast('Give the report a name', 'warning');
            return;
          }
          onRename(detail.id, name.trim(), category);
          onClose();
          onToast(`${name.trim()} updated`);
        })}
      >
        {detail ? <ReportStrip row={detail} /> : null}
        {detail && stateOf(detail) === 'Published' ? (
          <div className="alert alert-soft-info fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-info-circle" />
            Editing a published report raises a new version. Version {detail.version} stays live until this one
            is published.
          </div>
        ) : null}
        <div className="row g-3">
          {nameAndCategory}
          <Field label="Visibility">
            <Select options={visibilityOptions} />
          </Field>
          <Field label="Row Limit">
            <Select options={['All matching rows', 'Top 100', 'Top 500', 'Top 1,000']} />
          </Field>
          <div className="col-12">
            <Switch id="cr-edit-version" label="Raise a new version rather than editing in place" on />
            <Switch id="cr-edit-notify" label="Notify everyone the report is shared with" />
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Duplicate Report -------------------------- */}
      <Modal
        open={active === 'duplicate' && detail !== null}
        onClose={onClose}
        title="Duplicate Report"
        footer={footerButtons('Duplicate', 'ti ti-copy', () => {
          if (!detail) return;
          onDuplicate(detail.id, name.trim() || `${detail.name} (copy)`);
          onClose();
          onToast(`${detail.name} duplicated as a draft`);
        })}
      >
        {detail ? <ReportStrip row={detail} /> : null}
        <p className="text-muted fs-13 mb-3">
          The copy keeps the columns, filters and shaping, and starts as a private draft with its own
          reference.
        </p>
        <div className="row g-3">
          <Field label="New Report Name" span="col-12">
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field label="Visibility">
            <Select options={['Private', ...visibilityOptions.filter((item) => item !== 'Private')]} />
          </Field>
          <Field label="Owner">
            <Select options={ownerOptions} />
          </Field>
          <div className="col-12">
            <Switch id="cr-dup-schedule" label="Copy the schedule as well" />
            <Switch id="cr-dup-sharing" label="Copy the sharing permissions" />
          </div>
        </div>
      </Modal>

      {/* ---------------------------- Save as Template --------------------------- */}
      <Modal
        open={active === 'template'}
        onClose={onClose}
        title="Save Report Template"
        footer={footerButtons('Save Template', 'ti ti-bookmark-plus', confirm('Template saved'))}
      >
        <div className="row g-3">
          <Field label="Template Name" span="col-12">
            <input type="text" className="form-control" defaultValue="Fee defaulters with low attendance" />
          </Field>
          <Field label="Category">
            <Select options={categoryOptions} />
          </Field>
          <Field label="Visibility">
            <Select options={visibilityOptions} />
          </Field>
          <Field label="Description" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Students carrying a balance whose attendance has fallen under the policy line."
            />
          </Field>
          <div className="col-12">
            <Switch id="cr-tpl-fields" label="Save the selected columns and their order" on />
            <Switch id="cr-tpl-filters" label="Save the filter conditions and match rule" on />
            <Switch id="cr-tpl-shape" label="Save the grouping, sorting and row limit" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Schedule Report -------------------------- */}
      <Modal
        open={active === 'schedule'}
        onClose={onClose}
        title="Schedule Report"
        footer={footerButtons('Save Schedule', 'ti ti-calendar-time', confirm('Schedule saved'))}
      >
        {detail ? (
          <>
            <ReportStrip row={detail} />
            <ul className="list-unstyled fs-13 border rounded p-3 mb-3">
              {[
                { label: 'Current Schedule', value: `${detail.frequency} · ${detail.frequencyNote}` },
                { label: 'Last Run', value: `${detail.lastRun} · ${detail.lastRunNote}` },
                { label: 'Rows Returned', value: detail.rowsReturned.toLocaleString() },
                { label: 'On The Calendar', value: isScheduledOf(detail) ? 'Yes' : 'No' },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        <div className="row g-3">
          <Field label="Frequency">
            <Select options={scheduleOptions} />
          </Field>
          <Field label="Run Time">
            <input type="text" className="form-control" defaultValue="06:00" />
          </Field>
          <Field label="Starts On">
            <DateField value="03-08-2026" onChange={() => undefined} format="d-m-Y" id="cr-sc-date" />
          </Field>
          <Field label="Deliver To">
            <Select options={['The owner', 'Everyone it is shared with', 'A named list']} />
          </Field>
          <Field label="Format">
            <Select options={['PDF and Excel', 'PDF only', 'Excel only', 'CSV only']} />
          </Field>
          <Field label="Ends">
            <Select options={['End of the academic year', 'After 12 runs', 'Never']} />
          </Field>
          <div className="col-12">
            <Switch id="cr-sc-skip" label="Skip the run if nothing has changed since the last one" on />
            <Switch id="cr-sc-notify" label="Notify the owner when a run fails" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Export Report --------------------------- */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Report"
        footer={footerButtons('Export', 'ti ti-file-export', confirm(`${rows.length} reports exported`))}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Select options={exportOptions} />
          </Field>
          <div className="col-12">
            <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Reports</span>
                <span className="fw-medium">
                  {selected.length} selected of {REGISTER_TOTAL}
                </span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Archived In Selection</span>
                <span className="fw-medium">{selected.filter((item) => item.archivedOn).length}</span>
              </li>
            </ul>
          </div>
          <Field label="Rows To Export">
            <Select options={['Selected reports only', 'Current page', 'All filtered reports', 'All reports']} />
          </Field>
          <Field label="Columns">
            <Select options={['Visible columns', 'All columns', 'Configuration only']} />
          </Field>
          <Field label="File Name" span="col-12">
            <input type="text" className="form-control" defaultValue="custom-reports-register" />
          </Field>
          <div className="col-12">
            <Switch id="cr-ex-config" label="Include each report's configuration" on />
            <Switch id="cr-ex-schedule" label="Include the schedule and delivery list" />
            <Switch id="cr-ex-audit" label="Record the export in the audit history" on />
          </div>
        </div>
      </Modal>

      {/* -------------------------------- Share Report --------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Report"
        footer={footerButtons('Share', 'ti ti-share', confirm('Report shared'))}
      >
        {detail ? <ReportStrip row={detail} /> : null}
        {detail && stateOf(detail) !== 'Published' ? (
          <div className="alert alert-soft-warning fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-alert-triangle" />
            {detail.name} is {stateOf(detail).toLowerCase()}. Only a published report can be shared beyond its
            owner.
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Share With" span="col-12">
            <Select options={['All staff', 'Department heads', 'Class teachers', 'A named list']} />
          </Field>
          <Field label="Access">
            <Select options={['View only', 'View and download', 'View, download and edit']} />
          </Field>
          <Field label="Link Expires">
            <Select options={['End of the term', 'In 30 days', 'In 7 days', 'Never']} />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Shared for reference. The report re-runs on its own schedule; download the latest run rather than an old copy."
            />
          </Field>
          <div className="col-12">
            <Switch id="cr-sh-download" label="Allow downloads" on />
            <Switch id="cr-sh-audit" label="Record the share in the audit history" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Publish Report --------------------------- */}
      <Modal
        open={active === 'publish'}
        onClose={onClose}
        title="Publish Report"
        footer={footerButtons('Publish', 'ti ti-send', () => {
          const ids = publishable.filter((item) => !item.archivedOn).map((item) => item.id);
          if (ids.length === 0) {
            onToast('Nothing in this selection can be published', 'warning');
            return;
          }
          onPublish(ids);
          onClose();
          onToast(`${ids.length} ${ids.length === 1 ? 'report' : 'reports'} published`);
        })}
      >
        {archived.length > 0 ? (
          <div className="alert alert-soft-warning fs-13 d-flex align-items-center gap-2">
            <i className="ti ti-archive" />
            {archived.length} archived {archived.length === 1 ? 'report is' : 'reports are'} read only and will
            be skipped.
          </div>
        ) : null}
        <ul className="list-unstyled fs-13 border rounded p-3 mb-3">
          {[
            {
              label: 'Already Published',
              value: `${rows.filter((item) => stateOf(item) === 'Published').length} reports`,
            },
            { label: 'Drafts', value: `${rows.filter((item) => stateOf(item) === 'Draft').length} reports` },
            {
              label: 'Under Review',
              value: `${rows.filter((item) => stateOf(item) === 'Under Review').length} reports`,
            },
            {
              label: 'To Publish Now',
              value: `${publishable.filter((item) => !item.archivedOn).length} reports`,
            },
          ].map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>
        <div className="row g-3">
          <Field label="Publish To" span="col-12">
            <Select options={['Everyone it is shared with', 'The owner only', 'All staff']} />
          </Field>
          <Field label="Approved By">
            <Select options={ownerOptions} />
          </Field>
          <Field label="Publish On">
            <DateField value="31-07-2026" onChange={() => undefined} format="d-m-Y" id="cr-pub-date" />
          </Field>
          <Field label="Publishing Note" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Publishing makes the current version live and resumes any paused schedule."
            />
          </Field>
          <div className="col-12">
            <Switch id="cr-pb-resume" label="Resume any paused schedule" on />
            <Switch id="cr-pb-notify" label="Notify everyone the report is shared with" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Delete Report --------------------------- */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Delete Report"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (deletable.length === 0) return;
                onDelete(deletable.map((item) => item.id));
                onClose();
                onToast(`${deletable.length} ${deletable.length === 1 ? 'report' : 'reports'} deleted`);
              }}
            >
              <i className="ti ti-trash me-1" />
              Delete
            </button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          {deletable.length === 1
            ? `${deletable[0]?.name} and its run history will be removed.`
            : `${deletable.length} reports and their run histories will be removed.`}{' '}
          This cannot be undone.
        </p>
        {deletable.some((item) => stateOf(item) === 'Published') ? (
          <div className="alert alert-soft-danger fs-13 d-flex align-items-center gap-2 mb-0">
            <i className="ti ti-alert-triangle" />
            {deletable.filter((item) => stateOf(item) === 'Published').length} of these are published and
            others are relying on them. Consider archiving instead.
          </div>
        ) : null}
      </Modal>

      {/* ------------------------------- View Details ---------------------------- */}
      <Modal
        open={active === 'view' && detail !== null}
        onClose={onClose}
        title={detail?.name ?? 'Report'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Report run')}>
              <i className="ti ti-player-play me-1" />
              Run Now
            </button>
          </>
        }
      >
        {detail ? (
          <>
            <ReportStrip row={detail} />

            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Report Configuration</h6>
                <ul className="list-unstyled fs-13 mb-0">
                  {detail.configuration.map((item) => (
                    <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                      <span className="text-muted">{item.label}</span>
                      <span className="fw-medium">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Grouping &amp; Sorting</h6>
                <ul className="list-unstyled fs-13 mb-0">
                  {detail.grouping.map((item) => (
                    <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                      <span className="text-muted">{item.label}</span>
                      <span className="fw-medium">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h6 className="fs-14 mb-2 mt-3">Selected Data Fields</h6>
            <div className="d-flex flex-wrap gap-1 mb-2">
              {detail.fields.map((field) => (
                <span className="badge badge-soft-primary" key={field}>
                  {field}
                </span>
              ))}
              {detail.fieldsMore > 0 ? (
                <span className="badge badge-soft-secondary">and {detail.fieldsMore} more</span>
              ) : null}
            </div>
            <ul className="list-unstyled fs-13 mb-3">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Total Columns</span>
                <span className="fw-medium">{detail.columns}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Calculated Columns</span>
                <span className="fw-medium">{detail.calculatedColumns}</span>
              </li>
            </ul>

            <h6 className="fs-14 mb-2">Applied Filters</h6>
            <div className="d-flex flex-wrap gap-1 mb-2">
              {detail.filters.map((filter) => (
                <span className="badge badge-soft-warning" key={filter}>
                  {filter}
                </span>
              ))}
            </div>
            <ul className="list-unstyled fs-13 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Match Rule</span>
                <span className="fw-medium">{detail.matchRule}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Rows Returned</span>
                <span className="fw-medium">
                  {detail.rowsReturned.toLocaleString()}
                  {detail.rowsOf ? ` of ${detail.rowsOf.toLocaleString()}` : ''}
                </span>
              </li>
            </ul>
          </>
        ) : null}
      </Modal>

      {/* -------------------------- Report Details panel ------------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Report Details"
        className="offcanvas-lg"
        titleAccessory={
          detail ? (
            <span className="fs-12 text-muted">
              {detail.id} · {detail.name}
            </span>
          ) : null
        }
      >
        {detail ? (
          <>
            <h6 className="fs-14 mb-2">Schedule Information</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {detail.schedule.map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Export Formats</h6>
            <ul className="list-unstyled mb-4">
              {detail.exports.map((entry) => (
                <li className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                  <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                    <i className="ti ti-file-export" />
                  </span>
                  <div>
                    <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
                    <span className="fs-12 text-muted">{entry.detail}</span>
                  </div>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Sharing Permissions</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {detail.sharing.map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Generation History</h6>
            <ul className="list-unstyled fs-13 mb-4">
              {detail.generation.map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Recent Downloads</h6>
            <ul className="list-unstyled mb-4">
              {detail.downloads.map((entry) => (
                <li className="d-flex align-items-center justify-content-between py-1 fs-13" key={entry.title}>
                  <span>{entry.title}</span>
                  <span className="text-muted">{entry.detail}</span>
                </li>
              ))}
            </ul>

            <h6 className="fs-14 mb-2">Audit History</h6>
            <ul className="list-unstyled mb-0">
              {detail.audit.map((entry) => (
                <li className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.title}>
                  <span
                    className={`avatar avatar-sm bg-${stateTint[stateOf(detail)]}-transparent text-${stateTint[stateOf(detail)]} rounded flex-shrink-0`}
                  >
                    <i className="ti ti-history" />
                  </span>
                  <div>
                    <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
                    <span className="fs-12 text-muted">{entry.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default CustomModals;
