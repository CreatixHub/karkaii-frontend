import { Fragment, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import type { AwardModalId } from '../data/awardsWorkspace.data';
import {
  academicYearOptions,
  achievementOptions,
  awardLevelOptions,
  categoryOptions,
  copyOptions,
  mentorOptions,
  paperSizeOptions,
  placingOptions,
  signatoryOptions,
  studentOptions,
  verifierOptions,
} from '../data/awardsWorkspace.data';
import type { DialogSummary, RadioChoice } from '../data/awardDialogs.data';
import {
  categoryChoices,
  documentTypeChoices,
  nominateSummary,
  nominationScopeChoices,
  printSummary,
  printTemplateChoices,
  uploadSummary,
  viewAchievement,
} from '../data/awardDialogs.data';


const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

/** The template separates the header meta with a non-breaking bullet. */
const META_SEPARATOR = ' • ';

const defaultFields: Record<string, string> = {
  adaId: '',
  adaTitle: '',
  adaEvent: '',
  adaOrg: '',
  adaEventDate: '17-07-2026',
  adaAwardDate: '31-07-2026',
  adaVenue: '',
  adaEntry: '',
  adaCert: '',
  adaRem: '',
  adaNotes: '',
  edaId: '',
  edaTitle: 'Inter-House Chess Tournament — School Champion',
  edaEvent: '',
  edaOrg: '',
  edaEventDate: '17-07-2026',
  edaAwardDate: '30-07-2026',
  edaVenue: '',
  edaEntry: '',
  edaCert: '',
  edaRem: '',
  edaNotes: '',
  upcNumber: '',
  upcIssuedBy: 'District Sports Board',
  upcIssueDate: '31-07-2026',
  upcNotes:
    'Original held in the school office. A scanned copy is attached to the achievement record.',
  nomFor: '',
  nomDue: '12-08-2026',
  nomJustification:
    'Shortlisted from over four thousand entries in the international junior category, and winner of the school art exhibition in March.',
  prnCitation:
    'In recognition of first place at the State Level Science Exhibition 2026 for a study on low cost water filtration.',
};

const defaultSwitches: Record<string, boolean> = {
  adaReport: true,
  adaAssembly: true,
  edaAudit: true,
  upcStatus: true,
  upcGuardian: true,
  nomAuto: true,
  nomNotify: true,
  prnSeal: true,
  prnCopy: true,
};

export interface AwardModalsProps {
  active: AwardModalId | null;
  onClose: () => void;
  onOpen: (modal: AwardModalId) => void;
  onOpenPanel: () => void;
  onToast: (message: string) => void;
}

const AwardModals = ({ active, onClose, onOpen, onOpenPanel, onToast }: AwardModalsProps) => {
  const [fields, setFields] = useState(defaultFields);
  const [switches, setSwitches] = useState(defaultSwitches);
  const [selects, setSelects] = useState<Record<string, string>>({
    adaStudent: studentOptions[0],
    adaCategory: categoryOptions[0],
    adaLevel: awardLevelOptions[0],
    adaPlacing: placingOptions[0],
    adaYear: academicYearOptions[0],
    adaMentor: mentorOptions[0],
    adaVerifier: verifierOptions[0],
    edaStudent: studentOptions[0],
    edaCategory: categoryOptions[0],
    edaLevel: awardLevelOptions[0],
    edaPlacing: placingOptions[0],
    edaYear: academicYearOptions[0],
    edaMentor: mentorOptions[0],
    edaVerifier: verifierOptions[0],
    upcAchievement: achievementOptions[0],
    nomStudent: studentOptions[0],
    nomBy: mentorOptions[0],
    prnAchievement: achievementOptions[0],
    prnCopies: copyOptions[0],
    prnPaper: paperSizeOptions[0],
    prnSignatory: signatoryOptions[0],
  });
  const [segments, setSegments] = useState<Record<string, string>>({
    ada_cat: categoryChoices[0].id,
    upc_kind: documentTypeChoices[0].id,
    nom_scope: nominationScopeChoices[0].id,
    prn_tpl: printTemplateChoices[0].id,
  });

  const setField = (id: string, value: string) =>
    setFields((current) => ({ ...current, [id]: value }));

  const setSelect = (id: string, value: string) =>
    setSelects((current) => ({ ...current, [id]: value }));

  const toggle = (id: string) => setSwitches((current) => ({ ...current, [id]: !current[id] }));

  const settle = (message: string) => (event: React.FormEvent) => {
    event.preventDefault();
    onToast(message);
    onClose();
  };

  const cancel = (
    <button type="button" className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </button>
  );

  const select = (id: string, inputId: string, options: string[]) => (
    <CommonSelect
      inputId={inputId}
      className="select"
      options={toOptions(options)}
      value={selects[id] ? { value: selects[id], label: selects[id] } : null}
      onChange={(option) => setSelect(id, option?.value ?? '')}
    />
  );

  const text = (id: string, inputId: string, placeholder?: string) => (
    <input
      type="text"
      className="form-control"
      id={inputId}
      placeholder={placeholder}
      value={fields[id]}
      onChange={(event) => setField(id, event.target.value)}
    />
  );

  const area = (id: string, inputId: string, rows: number, placeholder?: string) => (
    <textarea
      className="form-control"
      rows={rows}
      id={inputId}
      placeholder={placeholder}
      value={fields[id]}
      onChange={(event) => setField(id, event.target.value)}
    />
  );

  const datePicker = (id: string, inputId: string) => (
    <DateField
      id={inputId}
      value={fields[id]}
      onChange={(dateString) => setField(id, dateString as string)}
    />
  );

  const segment = (name: string, label: string, options: RadioChoice[]) => (
    <div className="custom-btn-group custom-btn-group-fill mb-3" role="group" aria-label={label}>
      {options.map((option) => (
        <Fragment key={option.id}>
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={option.id}
            checked={segments[name] === option.id}
            onChange={() => setSegments((current) => ({ ...current, [name]: option.id }))}
          />
          <label className="btn" htmlFor={option.id}>
            {option.icon ? <i className={option.icon} /> : null}
            {option.label}
          </label>
        </Fragment>
      ))}
    </div>
  );

  const switchRow = (id: string, label: string, last = false) => (
    <div className={`form-check form-switch ${last ? 'mb-0' : 'mb-2'}`}>
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        checked={switches[id]}
        onChange={() => toggle(id)}
      />
      <label className="form-check-label fs-13" htmlFor={id}>
        {label}
      </label>
    </div>
  );

  const summaryCard = (summary: DialogSummary) => (
    <div className="border rounded p-3 mb-3">
      <div className="d-flex align-items-center mb-3">
        <span className={`avatar avatar-md ${summary.tint} rounded flex-shrink-0`}>
          <i className={summary.icon} />
        </span>
        <div className="ms-2">
          <h5 className="fs-14 mb-0">{summary.name}</h5>
          <span className="fs-12 text-muted">{summary.meta}</span>
        </div>
        <div className="ms-auto text-end">
          <span className="fs-12 text-muted d-block">{summary.asideLabel}</span>
          <span className={`badge ${summary.asideBadgeClass}`}>{summary.asideBadge}</span>
        </div>
      </div>
      {summary.rows.map((row) => (
        <div
          className="d-flex align-items-center justify-content-between mb-2"
          key={row.label}
        >
          <span className="fs-13 text-muted">{row.label}</span>
          <span className="fs-13 fw-medium">{row.value}</span>
        </div>
      ))}
      <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
        <span className="fs-13 fw-medium">{summary.footerLabel}</span>
        <span className={`fs-13 fw-semibold ${summary.footerValueClass}`}>
          {summary.footerValue}
        </span>
      </div>
    </div>
  );

  /** The Competition & Event / Recognition & Verification section headings. */
  const sectionHeading = (label: string) => (
    <div className="col-md-12">
      <hr className="my-2" />
      <p className="fs-13 fw-medium mb-2">{label}</p>
    </div>
  );

  const field = (col: string, label: string, inputId: string, control: React.ReactNode) => (
    <div className={col}>
      <div className="mb-3">
        <label className="form-label" htmlFor={inputId}>
          {label}
        </label>
        {control}
      </div>
    </div>
  );

  return (
    <>
      {/* Add Achievement */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Achievement"
        titleIcon="ti ti-trophy"
        titleAccessory={
          <p className="mb-0 fs-12 text-muted">
            Record an award and add it to the student recognition history
          </p>
        }
        dialogClassName="modal-lg"
        onSubmit={settle('Achievement added')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              Add Achievement
            </button>
          </>
        }
      >
        <p className="mb-2 fs-13 text-muted">Category</p>
        {segment('ada_cat', 'Category', categoryChoices)}
        <div className="row">
          {field('col-md-6', 'Achievement ID', 'adaId', text('adaId', 'adaId', 'Generated on save'))}
          {field('col-md-6', 'Student', 'student', select('adaStudent', 'student', studentOptions))}
          {field(
            'col-md-12',
            'Achievement Title',
            'adaTitle',
            text('adaTitle', 'adaTitle', 'e.g. State Science Exhibition, First Place'),
          )}
          {field('col-md-4', 'Category', 'category', select('adaCategory', 'category', categoryOptions))}
          {field(
            'col-md-4',
            'Award Level',
            'award-level-2',
            select('adaLevel', 'award-level-2', awardLevelOptions),
          )}
          {field('col-md-4', 'Placing', 'placing-2', select('adaPlacing', 'placing-2', placingOptions))}
          {sectionHeading('Competition & Event')}
          {field(
            'col-md-6',
            'Event Name',
            'adaEvent',
            text('adaEvent', 'adaEvent', 'e.g. State Level Science Exhibition 2026'),
          )}
          {field(
            'col-md-6',
            'Organiser',
            'adaOrg',
            text('adaOrg', 'adaOrg', 'e.g. State Science Council'),
          )}
          {field('col-md-4', 'Event Date', 'event-date', datePicker('adaEventDate', 'event-date'))}
          {field('col-md-4', 'Award Date', 'award-date', datePicker('adaAwardDate', 'award-date'))}
          {field(
            'col-md-4',
            'Academic Year',
            'academic-year-2',
            select('adaYear', 'academic-year-2', academicYearOptions),
          )}
          {field(
            'col-md-6',
            'Venue',
            'adaVenue',
            text('adaVenue', 'adaVenue', 'e.g. Civic Convention Centre, Hall 2'),
          )}
          {field(
            'col-md-6',
            'Entry',
            'adaEntry',
            text('adaEntry', 'adaEntry', 'Event, category or project title'),
          )}
          {sectionHeading('Recognition & Verification')}
          {field(
            'col-md-6',
            'Mentor / Teacher',
            'mentor-teacher',
            select('adaMentor', 'mentor-teacher', mentorOptions),
          )}
          {field(
            'col-md-6',
            'Verified By',
            'verified-by',
            select('adaVerifier', 'verified-by', verifierOptions),
          )}
          {field(
            'col-md-6',
            'Certificate Number',
            'adaCert',
            text('adaCert', 'adaCert', 'Blank until the certificate arrives'),
          )}
          {field(
            'col-md-6',
            'Supporting Document',
            'supporting-document',
            <input type="file" className="form-control" id="supporting-document" />,
          )}
          {field(
            'col-md-12',
            'Remarks',
            'adaRem',
            area('adaRem', 'adaRem', 2, 'Shown on the achievement record and the report card'),
          )}
          {field(
            'col-md-12',
            'Internal Notes',
            'adaNotes',
            area('adaNotes', 'adaNotes', 2, 'Visible to administrators only'),
          )}
          <div className="col-md-12">
            {switchRow('adaReport', 'Show this achievement on the term report card')}
            {switchRow('adaAssembly', 'Add to the next assembly recognition list', true)}
          </div>
        </div>
      </Modal>

      {/* Edit Achievement */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Achievement"
        titleIcon="ti ti-award"
        titleAccessory={
          <p className="mb-0 fs-12 text-muted">
            {`ACH-2026-0239${META_SEPARATOR}Kabir Shah${META_SEPARATOR}pending verification`}
          </p>
        }
        dialogClassName="modal-lg"
        onSubmit={settle('Changes saved')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
          <i className="ti ti-alert-triangle me-2" />
          <span className="fs-13">
            Changing the level or the placing recalculates the recognition points on the student
            record.
          </span>
        </div>
        <div className="row">
          {field('col-md-6', 'Achievement ID', 'edaId', text('edaId', 'edaId', 'Generated on save'))}
          {field(
            'col-md-6',
            'Student',
            'student-2',
            select('edaStudent', 'student-2', studentOptions),
          )}
          {field(
            'col-md-12',
            'Achievement Title',
            'edaTitle',
            text('edaTitle', 'edaTitle', 'e.g. State Science Exhibition, First Place'),
          )}
          {field(
            'col-md-4',
            'Category',
            'category-2',
            select('edaCategory', 'category-2', categoryOptions),
          )}
          {field(
            'col-md-4',
            'Award Level',
            'award-level-3',
            select('edaLevel', 'award-level-3', awardLevelOptions),
          )}
          {field('col-md-4', 'Placing', 'placing-3', select('edaPlacing', 'placing-3', placingOptions))}
          {sectionHeading('Competition & Event')}
          {field(
            'col-md-6',
            'Event Name',
            'edaEvent',
            text('edaEvent', 'edaEvent', 'e.g. State Level Science Exhibition 2026'),
          )}
          {field(
            'col-md-6',
            'Organiser',
            'edaOrg',
            text('edaOrg', 'edaOrg', 'e.g. State Science Council'),
          )}
          {field('col-md-4', 'Event Date', 'event-date-2', datePicker('edaEventDate', 'event-date-2'))}
          {field('col-md-4', 'Award Date', 'award-date-2', datePicker('edaAwardDate', 'award-date-2'))}
          {field(
            'col-md-4',
            'Academic Year',
            'academic-year-3',
            select('edaYear', 'academic-year-3', academicYearOptions),
          )}
          {field(
            'col-md-6',
            'Venue',
            'edaVenue',
            text('edaVenue', 'edaVenue', 'e.g. Civic Convention Centre, Hall 2'),
          )}
          {field(
            'col-md-6',
            'Entry',
            'edaEntry',
            text('edaEntry', 'edaEntry', 'Event, category or project title'),
          )}
          {sectionHeading('Recognition & Verification')}
          {field(
            'col-md-6',
            'Mentor / Teacher',
            'mentor-teacher-2',
            select('edaMentor', 'mentor-teacher-2', mentorOptions),
          )}
          {field(
            'col-md-6',
            'Verified By',
            'verified-by-2',
            select('edaVerifier', 'verified-by-2', verifierOptions),
          )}
          {field(
            'col-md-6',
            'Certificate Number',
            'edaCert',
            text('edaCert', 'edaCert', 'Blank until the certificate arrives'),
          )}
          {field(
            'col-md-6',
            'Supporting Document',
            'supporting-document-2',
            <input type="file" className="form-control" id="supporting-document-2" />,
          )}
          {field(
            'col-md-12',
            'Remarks',
            'edaRem',
            area('edaRem', 'edaRem', 2, 'Shown on the achievement record and the report card'),
          )}
          {field(
            'col-md-12',
            'Internal Notes',
            'edaNotes',
            area('edaNotes', 'edaNotes', 2, 'Visible to administrators only'),
          )}
          <div className="col-md-12">
            {switchRow('edaAudit', 'Record this amendment on the audit history', true)}
          </div>
        </div>
      </Modal>

      {/* Upload Certificate */}
      <Modal
        open={active === 'upload'}
        onClose={onClose}
        title="Upload Certificate"
        onSubmit={settle('Certificate uploaded')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-upload me-1" />
              Upload Certificate
            </button>
          </>
        }
      >
        {summaryCard(uploadSummary)}
        <p className="mb-2 fs-13 text-muted">Document type</p>
        {segment('upc_kind', 'Document type', documentTypeChoices)}
        <div className="row">
          {field(
            'col-md-6',
            'Achievement',
            'achievement',
            select('upcAchievement', 'achievement', achievementOptions),
          )}
          {field(
            'col-md-6',
            'Certificate Number',
            'certificate-number',
            text('upcNumber', 'certificate-number', 'e.g. DSB-2026-0338'),
          )}
          {field('col-md-6', 'Issued By', 'issued-by', text('upcIssuedBy', 'issued-by'))}
          {field('col-md-6', 'Issue Date', 'issue-date', datePicker('upcIssueDate', 'issue-date'))}
          {field(
            'col-md-12',
            'Upload File',
            'upload-file',
            <input type="file" className="form-control" id="upload-file" />,
          )}
          {field(
            'col-md-12',
            'Document Notes',
            'document-notes',
            area('upcNotes', 'document-notes', 2, 'Written to the supporting documents list'),
          )}
          <div className="col-md-12">
            {switchRow('upcStatus', 'Move the achievement to certificate issued')}
            {switchRow('upcGuardian', 'Share a copy with the guardian through the portal', true)}
          </div>
        </div>
      </Modal>

      {/* Nominate Student */}
      <Modal
        open={active === 'nominate'}
        onClose={onClose}
        title="Nominate Student"
        onSubmit={settle('Nomination submitted')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-star me-1" />
              Submit Nomination
            </button>
          </>
        }
      >
        {summaryCard(nominateSummary)}
        <p className="mb-2 fs-13 text-muted">Nomination scope</p>
        {segment('nom_scope', 'Nomination scope', nominationScopeChoices)}
        <div className="row">
          {field(
            'col-md-6',
            'Student',
            'student-3',
            select('nomStudent', 'student-3', studentOptions),
          )}
          {field(
            'col-md-6',
            'Nominated For',
            'nominated-for',
            text('nomFor', 'nominated-for', 'e.g. Best Junior Artist of the Year'),
          )}
          {field(
            'col-md-6',
            'Nominated By',
            'nominated-by',
            select('nomBy', 'nominated-by', mentorOptions),
          )}
          {field('col-md-6', 'Result Due', 'result-due', datePicker('nomDue', 'result-due'))}
          {field(
            'col-md-12',
            'Justification',
            'justification',
            area('nomJustification', 'justification', 3),
          )}
          <div className="col-md-12">
            {switchRow('nomAuto', 'Convert to an award automatically if the entry places')}
            {switchRow('nomNotify', 'Inform the guardian and the class teacher', true)}
          </div>
        </div>
      </Modal>

      {/* Print Award */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Award"
        onSubmit={settle('Award sent to the printer')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-printer me-1" />
              Print Award
            </button>
          </>
        }
      >
        <div className="border rounded p-3 mb-3 text-center">
          <span className="avatar avatar-xl bg-warning-transparent text-warning rounded mb-2">
            <i className="ti ti-trophy fs-24" />
          </span>
          <h5 className="fs-15 mb-1">{printSummary.name}</h5>
          <p className="fs-13 text-muted mb-2">{printSummary.title}</p>
          <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
            {printSummary.badges.map((badge) => (
              <span className={`badge ${badge.className}`} key={badge.label}>
                {badge.label}
              </span>
            ))}
          </div>
        </div>
        <p className="mb-2 fs-13 text-muted">Print template</p>
        {segment('prn_tpl', 'Print template', printTemplateChoices)}
        <div className="row">
          {field(
            'col-md-6',
            'Achievement',
            'achievement-2',
            select('prnAchievement', 'achievement-2', achievementOptions),
          )}
          {field('col-md-6', 'Copies', 'copies', select('prnCopies', 'copies', copyOptions))}
          {field(
            'col-md-6',
            'Paper Size',
            'paper-size',
            select('prnPaper', 'paper-size', paperSizeOptions),
          )}
          {field(
            'col-md-6',
            'Signatory',
            'signatory',
            select('prnSignatory', 'signatory', signatoryOptions),
          )}
          {field(
            'col-md-12',
            'Citation Line',
            'citation-line',
            area('prnCitation', 'citation-line', 2),
          )}
          <div className="col-md-12">
            {switchRow('prnSeal', 'Include the school seal and signature block')}
            {switchRow('prnCopy', 'File a copy with the student record', true)}
          </div>
        </div>
      </Modal>

      {/* View Achievement Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title={viewAchievement.id}
        titleIcon="ti ti-trophy"
        titleAccessory={
          <p className="mb-0 fs-12 text-muted">
            {viewAchievement.headerMeta.join(META_SEPARATOR)}
          </p>
        }
        dialogClassName="modal-lg"
        footer={
          <>
            <button
              type="button"
              className="btn btn-light me-2"
              onClick={() => onOpen('print')}
            >
              <i className="ti ti-printer me-1" />
              Print Award
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onOpenPanel();
              }}
            >
              <i className="ti ti-trophy me-1" />
              Open Achievement Panel
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
          <span className="avatar avatar-lg bg-info-transparent text-info rounded flex-shrink-0">
            <i className="ti ti-school fs-20" />
          </span>
          <div>
            <h5 className="mb-0 fs-15">{viewAchievement.student}</h5>
            <span className="fs-12 text-muted">{viewAchievement.studentMeta}</span>
          </div>
          <span className="badge badge-soft-success ms-auto">{viewAchievement.status}</span>
        </div>

        <div className="row g-3 mb-3">
          {viewAchievement.tiles.map((tile) => (
            <div className="col-md-3" key={tile.id}>
              <div className="d-flex align-items-center gap-2 border rounded p-3 h-100">
                <span className={`avatar avatar-md ${tile.tint} rounded flex-shrink-0`}>
                  <i className={tile.icon} />
                </span>
                <div className="overflow-hidden">
                  <span className="fs-12 text-muted d-block">{tile.label}</span>
                  <h6 className="fs-14 mb-0 text-truncate">{tile.value}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <h6 className="fs-13 mb-2">Achievement Detail</h6>
            <div className="border rounded p-3">
              {viewAchievement.achievementRows.map((row, index) => (
                <div
                  className={`d-flex align-items-center justify-content-between ${
                    index === viewAchievement.achievementRows.length - 1 ? 'mb-0' : 'mb-2'
                  }`}
                  key={row.label}
                >
                  <span className="fs-13 text-muted">{row.label}</span>
                  {row.badgeClass ? (
                    <span className={`badge ${row.badgeClass}`}>{row.value}</span>
                  ) : (
                    <span className="fs-13 fw-medium">{row.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <h6 className="fs-13 mb-2">Event Detail</h6>
            <div className="border rounded p-3">
              {viewAchievement.eventRows.map((row, index) => (
                <div
                  className={`d-flex align-items-center justify-content-between ${
                    index === viewAchievement.eventRows.length - 1 ? 'mb-0' : 'mb-2'
                  }`}
                  key={row.label}
                >
                  <span className="fs-13 text-muted">{row.label}</span>
                  <span className="fs-13 fw-medium">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h6 className="fs-13 mb-2">Recognition History</h6>
        <div className="table-responsive border rounded mb-3">
          <table className="table table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th className="fs-13">Date</th>
                <th className="fs-13">Achievement</th>
                <th className="fs-13">Level</th>
                <th className="fs-13">Points</th>
              </tr>
            </thead>
            <tbody>
              {viewAchievement.history.map((row) => (
                <tr key={row.id}>
                  <td className="fs-13">{row.date}</td>
                  <td className="fs-13">{row.achievement}</td>
                  <td>
                    <span className={`badge ${row.level.className}`}>{row.level.label}</span>
                  </td>
                  <td className="fs-13">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h6 className="fs-13 mb-2">Certificates &amp; Attachments</h6>
        {viewAchievement.documents.map((doc) => (
          <div
            className={`d-flex align-items-center gap-2 border rounded p-2 ${
              doc.last ? 'mb-3' : 'mb-2'
            }`}
            key={doc.id}
          >
            <span className={`avatar avatar-sm ${doc.tint} rounded flex-shrink-0`}>
              <i className={doc.icon} />
            </span>
            <div className="flex-fill overflow-hidden">
              <h6 className="fs-13 mb-0">{doc.title}</h6>
              <span className="fs-12 text-muted">{doc.meta}</span>
            </div>
            <a
              role="button"
              tabIndex={0}
              className="dt-ib"
              aria-label={doc.download}
            >
              <i className="ti ti-download" />
            </a>
          </div>
        ))}

        <h6 className="fs-13 mb-1">Remarks</h6>
        <p className="fs-13 text-muted mb-0">{viewAchievement.remarks}</p>
      </Modal>
    </>
  );
};

export default AwardModals;
