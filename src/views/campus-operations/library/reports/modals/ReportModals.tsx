import { useEffect, useState } from 'react';
import TimeField from '@components/ui/TimeField';
import Modal from '@components/ui/Modal';
import SelectField from '@components/ui/SelectField';
import type { LibraryReport, ReportFormat, ReportType } from '../data/libraryReports.data';
import {
  catalogueRows,
  catalogueTotals,
  count,
  figure,
  formatIcon,
  formatTint,
  reportTypeOptions,
  scheduleSummary,
  statusBadge,
  typeIcon,
  typeTint,
} from '../data/libraryReports.data';

export type ReportModalId = 'generate' | 'view' | 'schedule' | 'export' | 'print';

/* -------------------------------- Vocabulary -------------------------------- */

/** The dialogs spell the formats out; the grid prints the short name. */
export const outputFormatOptions = ['PDF Document', 'Excel Workbook', 'CSV File'];

export const formatOfLabel = (label: string): ReportFormat => {
  if (label.startsWith('Excel')) return 'Excel';
  if (label.startsWith('CSV')) return 'CSV';
  return 'PDF';
};

export const labelOfFormat = (format: ReportFormat): string =>
  outputFormatOptions.find((option) => formatOfLabel(option) === format) ?? outputFormatOptions[0];

export const generateCategoryOptions = [
  'All Categories', 'Academic Books', 'Reference Books', 'Fiction', 'Non-Fiction', 'Digital Resources',
];

export const generateMemberOptions = ['All Members', 'Students', 'Teaching Staff', 'Support Staff'];

export const groupByOptions = ['Category', 'Member Type', 'Class', 'Shelf Location', 'None'];

export const authorOptions = ['Mary Winsler · Head Librarian', 'Anita Rao · Librarian'];

export const frequencyOptions = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];

export const runOnOptions = ['Last day of the period', '1st of the period', '15th of the month'];

export const notifyOptions = ['Head Librarian', 'Academic Coordinator', 'Principal Office', 'No one else'];

export const detailLevelOptions = ['Category summary', 'Title-level detail', 'Copy-level detail'];

export const scopeOptions = ['This report', 'Selected reports', 'All reports in view'];

export const deliverOptions = ['Download now', 'Email to me', 'Email to the library team'];

export const exportFormatOptions = ['Excel Workbook', 'PDF Document', 'CSV File'];

export const paperSizeOptions = ['A4', 'A3', 'Legal'];

export const orientationOptions = ['Landscape', 'Portrait'];

export const printerOptions = ['Library Desk — HP LaserJet', 'Front Office — Canon iR', 'Save as PDF'];

export const copiesOptions = ['1', '2', '3'];

/* ---------------------------------- Drafts ---------------------------------- */

export interface GenerateDraft {
  type: ReportType;
  name: string;
  dateFrom: string;
  dateTo: string;
  category: string;
  memberType: string;
  groupBy: string;
  outputFormat: string;
  author: string;
  notes: string;
  includeArchived: boolean;
  includeContact: boolean;
  saveSchedule: boolean;
}

export const emptyGenerate: GenerateDraft = {
  type: 'Book Inventory',
  name: '',
  dateFrom: '01-07-2026',
  dateTo: '31-07-2026',
  category: generateCategoryOptions[0],
  memberType: generateMemberOptions[0],
  groupBy: groupByOptions[0],
  outputFormat: outputFormatOptions[0],
  author: authorOptions[0],
  notes: '',
  includeArchived: true,
  includeContact: false,
  saveSchedule: false,
};

/** Re-generate opens the same form seeded from the run that failed. */
export const generateOf = (row: LibraryReport): GenerateDraft => ({
  ...emptyGenerate,
  type: row.type,
  name: row.name,
  outputFormat: labelOfFormat(row.format),
  author: authorOptions.find((option) => option.startsWith(row.generatedBy)) ?? authorOptions[0],
  notes: row.notes,
});

export interface ScheduleResult {
  frequency: string;
  runOn: string;
  runTime: string;
  outputFormat: string;
  deliverTo: string;
  alsoNotify: string;
  attach: boolean;
  alertOnFail: boolean;
}

export interface ExportResult {
  format: string;
  detailLevel: string;
  scope: string;
  deliver: string;
  printFilters: boolean;
  includeShelf: boolean;
  appendAudit: boolean;
}

export interface PrintResult {
  reportId: string;
  paperSize: string;
  orientation: string;
  printer: string;
  copies: string;
  letterhead: boolean;
  subtotals: boolean;
  signature: boolean;
}

export interface ReportModalsProps {
  active: ReportModalId | null;
  row: LibraryReport | null;
  /** The full roster, for the Print dialog's Report select. */
  rows: LibraryReport[];
  /** Rows the grid is showing, for the Export dialog's "All reports in view". */
  visibleCount: number;
  /** Report type a category card asked Generate to open on. */
  presetType?: ReportType | null;
  onClose: () => void;
  onGenerate: (draft: GenerateDraft) => void;
  onSchedule: (result: ScheduleResult) => void;
  onExport: (result: ExportResult) => void;
  onPrint: (result: PrintResult) => void;
  /** Lets View Report hand off to Print and Export, as its footer does. */
  onOpen: (modal: ReportModalId) => void;
}

/* --------------------------------- Fragments -------------------------------- */

const DialogHead = ({ tint, icon, title, subtitle }: {
  tint: string; icon: string; title: string; subtitle: string;
}) => (
  <div className="d-flex align-items-center gap-3">
    <span className={`avatar avatar-lg bg-${tint}-transparent text-${tint} rounded`}>
      <i className={`${icon} fs-20`} />
    </span>
    <div>
      <h4 className="modal-title mb-0">{title}</h4>
      <p className="mb-0 fs-12 text-muted">{subtitle}</p>
    </div>
  </div>
);

/** The one-line report strip the Schedule and Export dialogs open with. */
const ReportStrip = ({ row, icon, tint, caption }: {
  row: LibraryReport; icon: string; tint: string; caption: string;
}) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
    <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded flex-shrink-0`}>
      <i className={icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h5 className="fs-13 mb-0">{row.name}</h5>
      <span className="fs-12 text-muted">{caption}</span>
    </div>
  </div>
);

const summaryTile = (label: string, value: string, tint?: string) => (
  <div className="col-md-3" key={label}>
    <div className="border rounded p-3 text-center">
      <span className="fs-12 text-muted d-block mb-1">{label}</span>
      <h5 className={`mb-0${tint ? ` text-${tint}` : ''}`}>{value}</h5>
    </div>
  </div>
);

const Switch = ({ id, label, checked, onChange, last }: {
  id: string; label: string; checked: boolean; onChange: (value: boolean) => void; last?: boolean;
}) => (
  <div className={`form-check form-switch ${last ? 'mb-0' : 'mb-2'}`}>
    <input
      className="form-check-input" type="checkbox" role="switch" id={id}
      checked={checked} onChange={(event) => onChange(event.target.checked)}
    />
    <label className="form-check-label fs-13" htmlFor={id}>{label}</label>
  </div>
);

/* ---------------------------------- Modals ---------------------------------- */

const ReportModals = ({
  active, row, rows, visibleCount, presetType = null, onClose, onGenerate, onSchedule, onExport,
  onPrint, onOpen,
}: ReportModalsProps) => {
  const [generate, setGenerate] = useState<GenerateDraft>(emptyGenerate);
  const [schedule, setSchedule] = useState<ScheduleResult>({
    frequency: 'Quarterly',
    runOn: runOnOptions[0],
    runTime: '06:00',
    outputFormat: outputFormatOptions[2],
    deliverTo: 'library@globalinternational.edu',
    alsoNotify: notifyOptions[0],
    attach: true,
    alertOnFail: true,
  });
  const [exportDraft, setExportDraft] = useState<ExportResult>({
    format: exportFormatOptions[0],
    detailLevel: detailLevelOptions[0],
    scope: scopeOptions[0],
    deliver: deliverOptions[0],
    printFilters: true,
    includeShelf: true,
    appendAudit: false,
  });
  const [print, setPrint] = useState<PrintResult>({
    reportId: '',
    paperSize: paperSizeOptions[0],
    orientation: orientationOptions[0],
    printer: printerOptions[0],
    copies: copiesOptions[0],
    letterhead: true,
    subtotals: true,
    signature: true,
  });

  useEffect(() => {
    if (active === 'generate') {
      setGenerate(row ? generateOf(row) : { ...emptyGenerate, type: presetType ?? emptyGenerate.type });
    }
    if (active === 'schedule' && row) {
      setSchedule((current) => ({
        ...current,
        frequency: frequencyOptions.includes(row.scheduleBadge) ? row.scheduleBadge : 'Monthly',
        outputFormat: labelOfFormat(row.format),
      }));
    }
    if (active === 'export' && row) {
      setExportDraft((current) => ({ ...current, format: labelOfFormat(row.format) }));
    }
    if (active === 'print') {
      setPrint((current) => ({ ...current, reportId: row?.id ?? rows[0]?.id ?? '' }));
    }
  }, [active, presetType, row, rows]);

  const generateField = <K extends keyof GenerateDraft>(key: K, value: GenerateDraft[K]) =>
    setGenerate((current) => ({ ...current, [key]: value }));

  const tint = row ? typeTint[row.type] : 'primary';
  const icon = row ? typeIcon[row.type] : 'ti ti-report';

  /** The template's Book Inventory breakdown; every other run shows its stats. */
  const isInventory = row?.type === 'Book Inventory';

  return (
    <>
      {/* Generate Report */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Report"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onGenerate(generate); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-report me-1" />
              {row ? 'Re-generate Report' : 'Generate Report'}
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
          <DialogHead
            tint="primary" icon="ti ti-report"
            title={row ? `Re-generate ${row.name}` : 'Generate Report'}
            subtitle="Build a library report for the selected period"
          />
        </div>
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="report-type-2">Report Type</label>
            <SelectField
              options={reportTypeOptions}
              value={generate.type}
              onChange={(next: string) => generateField('type', next as ReportType)}
              id="report-type-2"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="report-name">Report Name</label>
            <input
              type="text" className="form-control" id="report-name"
              placeholder="e.g. Issued Books — August 2026"
              value={generate.name} onChange={(event) => generateField('name', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="date-from">Date From</label>
            <TimeField
              value={generate.dateFrom}
              onChange={(next: string) => generateField('dateFrom', next)}
              id="date-from"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="date-to">Date To</label>
            <TimeField
              value={generate.dateTo}
              onChange={(next: string) => generateField('dateTo', next)}
              id="date-to"
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="category-2">Category</label>
            <SelectField
              options={generateCategoryOptions}
              value={generate.category}
              onChange={(next: string) => generateField('category', next)}
              id="category-2"
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="member-type-2">Member Type</label>
            <SelectField
              options={generateMemberOptions}
              value={generate.memberType}
              onChange={(next: string) => generateField('memberType', next)}
              id="member-type-2"
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor="group-by">Group By</label>
            <SelectField
              options={groupByOptions}
              value={generate.groupBy}
              onChange={(next: string) => generateField('groupBy', next)}
              id="group-by"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="output-format">Output Format</label>
            <SelectField
              options={outputFormatOptions}
              value={generate.outputFormat}
              onChange={(next: string) => generateField('outputFormat', next)}
              id="output-format"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="generated-by-2">Generated By</label>
            <SelectField
              options={authorOptions}
              value={generate.author}
              onChange={(next: string) => generateField('author', next)}
              id="generated-by-2"
            />
          </div></div>
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor="internal-notes">Internal Notes</label>
            <textarea
              className="form-control" rows={2} id="internal-notes"
              placeholder="Printed in the report header"
              value={generate.notes} onChange={(event) => generateField('notes', event.target.value)}
            />
          </div></div>
          <div className="col-md-12">
            <Switch
              id="gnArchived" label="Include archived and withdrawn titles"
              checked={generate.includeArchived}
              onChange={(value) => generateField('includeArchived', value)}
            />
            <Switch
              id="gnMember" label="Include member contact details"
              checked={generate.includeContact}
              onChange={(value) => generateField('includeContact', value)}
            />
            <Switch
              id="gnSchedule" label="Save these settings as a recurring schedule" last
              checked={generate.saveSchedule}
              onChange={(value) => generateField('saveSchedule', value)}
            />
          </div>
        </div>
      </Modal>

      {/* View Report */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.name ?? 'Report'}
        dialogClassName="modal-xl modal-dialog-scrollable"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('print')}>
              <i className="ti ti-printer me-1" />Print
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('export')}>
              <i className="ti ti-download me-1" />Export
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
              <DialogHead
                tint={tint} icon={icon} title={row.name}
                subtitle={`${row.dateRange}  •  Generated ${row.generatedDate}, ${row.generatedTime}`}
              />
            </div>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border rounded p-3 mb-3">
              <div>
                <h5 className="fs-14 mb-0">Global International — Central Library</h5>
                <span className="fs-12 text-muted">
                  {row.type} · all categories · {row.dateRange.toLowerCase()}
                </span>
              </div>
              <span className={statusBadge[row.status]}>{row.status}</span>
            </div>
            <div className="row g-3 mb-3">
              {row.summary.map((pair, index) =>
                summaryTile(
                  pair.label,
                  pair.value,
                  index === 2 ? 'success' : index === 3 ? 'warning' : undefined,
                ))}
            </div>
            <div className="data-table border rounded">
              <table className="table align-middle mb-0">
                <thead>
                  {isInventory ? (
                    <tr>
                      <th>Category</th>
                      <th>Code</th>
                      <th>Shelf</th>
                      <th className="text-end">Total</th>
                      <th className="text-end">Available</th>
                      <th className="text-end">Issued</th>
                      <th className="text-end">Overdue</th>
                    </tr>
                  ) : (
                    <tr>
                      <th>Breakdown</th>
                      <th className="text-end">Value</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {isInventory ? (
                    <>
                      {catalogueRows.map((entry) => (
                        <tr key={entry.code}>
                          <td className="fs-13 fw-medium">{entry.category}</td>
                          <td className="fs-13">{entry.code}</td>
                          <td className="fs-13">{entry.shelf}</td>
                          <td className="text-end">{count(entry.total)}</td>
                          <td className={`text-end ${entry.available === null ? 'text-muted' : 'text-success'}`}>
                            {figure(entry.available)}
                          </td>
                          <td className="text-end">{figure(entry.issued)}</td>
                          <td className={`text-end ${entry.overdue === null ? 'text-muted' : 'text-warning'}`}>
                            {figure(entry.overdue)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="fs-13 fw-semibold">Total</td>
                        <td />
                        <td />
                        <td className="text-end fw-semibold">{count(catalogueTotals.total)}</td>
                        <td className="text-end fw-semibold text-success">{count(catalogueTotals.available)}</td>
                        <td className="text-end fw-semibold">{count(catalogueTotals.issued)}</td>
                        <td className="text-end fw-semibold text-warning">{count(catalogueTotals.overdue)}</td>
                      </tr>
                    </>
                  ) : (
                    row.stats.map((pair) => (
                      <tr key={pair.label}>
                        <td className="fs-13 fw-medium">{pair.label}</td>
                        <td className="text-end">{pair.value}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {isInventory ? (
              <p className="fs-12 text-muted mt-3 mb-0">
                Title counts exclude duplicate copies; the copies total of 6,142 includes all
                duplicates. Rare &amp; Archived titles are not issuable.
              </p>
            ) : (
              <p className="fs-12 text-muted mt-3 mb-0">
                Figures follow the applied filters printed on the cover page: {row.appliedFilters
                  .map((pair) => `${pair.label} ${pair.value}`)
                  .join(' · ')}.
              </p>
            )}
          </>
        ) : null}
      </Modal>

      {/* Schedule Report */}
      <Modal
        open={active === 'schedule' && row !== null}
        onClose={onClose}
        title="Schedule Report"
        onSubmit={(event) => { event.preventDefault(); onSchedule(schedule); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Schedule</button>
          </>
        }
      >
        {row ? (
          <>
            <ReportStrip row={row} icon={icon} tint={tint} caption={scheduleSummary(row)} />
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="frequency">Frequency</label>
                <SelectField
                  options={frequencyOptions}
                  value={schedule.frequency}
                  onChange={(next: string) => setSchedule((c) => ({ ...c, frequency: next }))}
                  id="frequency"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="run-on">Run On</label>
                <SelectField
                  options={runOnOptions}
                  value={schedule.runOn}
                  onChange={(next: string) => setSchedule((c) => ({ ...c, runOn: next }))}
                  id="run-on"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="run-time">Run Time</label>
                <input
                  type="time" className="form-control" id="run-time"
                  value={schedule.runTime}
                  onChange={(event) => setSchedule((c) => ({ ...c, runTime: event.target.value }))}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="output-format-2">Output Format</label>
                <SelectField
                  options={outputFormatOptions}
                  value={schedule.outputFormat}
                  onChange={(next: string) => setSchedule((c) => ({ ...c, outputFormat: next }))}
                  id="output-format-2"
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="deliver-to">Deliver To</label>
                <input
                  type="email" className="form-control" id="deliver-to"
                  value={schedule.deliverTo}
                  onChange={(event) => setSchedule((c) => ({ ...c, deliverTo: event.target.value }))}
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="also-notify">Also Notify</label>
                <SelectField
                  options={notifyOptions}
                  value={schedule.alsoNotify}
                  onChange={(next: string) => setSchedule((c) => ({ ...c, alsoNotify: next }))}
                  id="also-notify"
                />
              </div></div>
              <div className="col-md-12">
                <Switch
                  id="scAttach" label="Attach the report file to the email"
                  checked={schedule.attach}
                  onChange={(value) => setSchedule((c) => ({ ...c, attach: value }))}
                />
                <Switch
                  id="scFail" label="Alert me if a scheduled run fails" last
                  checked={schedule.alertOnFail}
                  onChange={(value) => setSchedule((c) => ({ ...c, alertOnFail: value }))}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Export Report */}
      <Modal
        open={active === 'export' && row !== null}
        onClose={onClose}
        title="Export Report"
        onSubmit={(event) => { event.preventDefault(); onExport(exportDraft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-download me-1" />Export
            </button>
          </>
        }
      >
        {row ? (
          <>
            <ReportStrip
              row={row} icon="ti ti-file-export" tint="primary"
              caption={`${row.type} · ${row.dateRange} · ${row.format}`}
            />
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="format-2">Format</label>
                <SelectField
                  options={exportFormatOptions}
                  value={exportDraft.format}
                  onChange={(next: string) => setExportDraft((c) => ({ ...c, format: next }))}
                  id="format-2"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="detail-level">Detail Level</label>
                <SelectField
                  options={detailLevelOptions}
                  value={exportDraft.detailLevel}
                  onChange={(next: string) => setExportDraft((c) => ({ ...c, detailLevel: next }))}
                  id="detail-level"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="scope">Scope</label>
                <SelectField
                  options={scopeOptions}
                  value={exportDraft.scope}
                  onChange={(next: string) => setExportDraft((c) => ({ ...c, scope: next }))}
                  id="scope"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="deliver">Deliver</label>
                <SelectField
                  options={deliverOptions}
                  value={exportDraft.deliver}
                  onChange={(next: string) => setExportDraft((c) => ({ ...c, deliver: next }))}
                  id="deliver"
                />
              </div></div>
              <div className="col-md-12">
                <p className="fs-12 text-muted mb-3">
                  <i className={`${formatIcon[formatOfLabel(exportDraft.format)]} text-${formatTint[formatOfLabel(exportDraft.format)]} me-1`} />
                  {exportDraft.scope === 'All reports in view'
                    ? `${visibleCount} report${visibleCount === 1 ? '' : 's'} currently in view`
                    : row.name}
                </p>
              </div>
              <div className="col-md-12">
                <Switch
                  id="exFilters" label="Print the applied filters on the cover page"
                  checked={exportDraft.printFilters}
                  onChange={(value) => setExportDraft((c) => ({ ...c, printFilters: value }))}
                />
                <Switch
                  id="exShelf" label="Include shelf locations and category codes"
                  checked={exportDraft.includeShelf}
                  onChange={(value) => setExportDraft((c) => ({ ...c, includeShelf: value }))}
                />
                <Switch
                  id="exAudit" label="Append the audit trail" last
                  checked={exportDraft.appendAudit}
                  onChange={(value) => setExportDraft((c) => ({ ...c, appendAudit: value }))}
                />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Print Report */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Report"
        onSubmit={(event) => { event.preventDefault(); onPrint(print); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-printer me-1" />Print
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor="report">Report</label>
            <SelectField
              options={rows.map((report) => ({ value: report.id, label: report.name }))}
              value={print.reportId}
              onChange={(next: string) => setPrint((c) => ({ ...c, reportId: next }))}
              id="report"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="paper-size">Paper Size</label>
            <SelectField
              options={paperSizeOptions}
              value={print.paperSize}
              onChange={(next: string) => setPrint((c) => ({ ...c, paperSize: next }))}
              id="paper-size"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="orientation">Orientation</label>
            <SelectField
              options={orientationOptions}
              value={print.orientation}
              onChange={(next: string) => setPrint((c) => ({ ...c, orientation: next }))}
              id="orientation"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="printer">Printer</label>
            <SelectField
              options={printerOptions}
              value={print.printer}
              onChange={(next: string) => setPrint((c) => ({ ...c, printer: next }))}
              id="printer"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="copies">Copies</label>
            <SelectField
              options={copiesOptions}
              value={print.copies}
              onChange={(next: string) => setPrint((c) => ({ ...c, copies: next }))}
              id="copies"
            />
          </div></div>
          <div className="col-md-12">
            <Switch
              id="prHead" label="Include the library letterhead and period header"
              checked={print.letterhead}
              onChange={(value) => setPrint((c) => ({ ...c, letterhead: value }))}
            />
            <Switch
              id="prTotals" label="Print category subtotals and grand total"
              checked={print.subtotals}
              onChange={(value) => setPrint((c) => ({ ...c, subtotals: value }))}
            />
            <Switch
              id="prSign" label="Include the librarian signature block" last
              checked={print.signature}
              onChange={(value) => setPrint((c) => ({ ...c, signature: value }))}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportModals;
