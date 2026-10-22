import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import type { Draft } from '../data/reports.data';
import {
  AWAITING_APPROVAL,
  backlogLabel,
  DRAFTS,
  DUE_ON,
  LANGUAGES,
  REPORTS_GENERATED,
  SCHEDULE_ON,
  stateToneOf,
  templateOf,
  TEMPLATES,
  WAITING,
} from '../data/reports.data';

export type ReportModalId =
  | 'generate_report'
  | 'new_template'
  | 'translate'
  | 'compare_versions'
  | 'approve_report'
  | 'export_reports'
  | 'schedule_report'
  | 'preview_report'
  | 'review_draft';

export interface ReportModalsProps {
  active: ReportModalId | null;
  onClose: () => void;
  row: Draft | null;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onOpenRow: (row: Draft) => void;
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
  value: string;
  onChange: (value: string) => void;
}) => (
  <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
);

const Note = ({ text }: { text: string }) => (
  <div className="aix-block mb-3">
    <div className="aix-block-body">
      <p className="fs-13 text-muted mb-0">
        <i className="ti ti-sparkles me-2 text-primary" />
        {text}
      </p>
    </div>
  </div>
);

const Footer = ({ icon, label, onClose }: { icon: string; label: string; onClose: () => void }) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
      <i className={`${icon} me-1`} />
      {label}
    </button>
  </>
);

const useForm = <T extends Record<string, string>>(defaults: T, open: boolean) => {
  const [values, setValues] = useState<T>(defaults);
  // Serialised so the effect depends on the defaults' content, not their identity.
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

const ReportModals = ({ active, onClose, row, onToast, onOpenRow }: ReportModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const template = row ? templateOf(row) : undefined;
  const templateNames = TEMPLATES.map((entry) => entry.name);

  const [generate, setGenerate] = useForm(
    {
      prompt: 'Summarise Class III term-2 performance for guardians, one page.',
      template: template?.name ?? templateNames[0],
      tone: 'Formal',
      length: 'Short',
      language: LANGUAGES[0],
      onDone: 'Hold for approval',
    },
    active === 'generate_report',
  );

  const [newTemplate, setNewTemplate] = useForm(
    {
      name: '',
      audience: 'Guardians',
      sections: '5',
      basis: 'Start from the parent letter',
      languages: 'English only',
    },
    active === 'new_template',
  );

  const [translate, setTranslate] = useForm(
    {
      report: row?.title ?? DRAFTS[0].title,
      from: LANGUAGES[0],
      into: 'All published languages',
      level: 'Match the source reading level',
      review: 'Hold all versions together',
    },
    active === 'translate',
  );

  const [compare, setCompare] = useForm(
    {
      report: row?.title ?? DRAFTS[0].title,
      left: 'Current draft',
      right: 'Previous version',
      show: 'What changed and who changed it',
      include: 'Figures and prose',
    },
    active === 'compare_versions',
  );

  const [approve, setApprove] = useForm(
    {
      report: row?.title ?? DRAFTS[0].title,
      approver: row?.approver ?? 'Principal',
      due: DUE_ON,
      onApproval: 'Distribute to the stated audience',
      note: 'Two figures were flagged where the source changed after the first pass. Both are marked in the margin.',
    },
    active === 'approve_report',
  );

  const [exportForm, setExportForm] = useForm(
    {
      contents: 'Approved reports only',
      format: 'PDF',
      trail: 'Yes, with the approval trail',
      deliver: 'Download',
    },
    active === 'export_reports',
  );

  const [schedule, setSchedule] = useForm(
    {
      report: templateNames[3],
      cadence: 'Weekly',
      startOn: SCHEDULE_ON,
      approver: 'Deputy principal',
      onDone: 'Hold for approval every time',
    },
    active === 'schedule_report',
  );

  return (
    <>
      <Modal
        open={active === 'generate_report'}
        onClose={onClose}
        title="Generate a Report"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Draft</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit('Draft queued. It will wait here for a signature.')}
        footer={<Footer icon="ti ti-sparkles" label="Generate" onClose={onClose} />}
      >
        <Note
          text={`${REPORTS_GENERATED.toLocaleString('en-US')} reports written so far, across ${TEMPLATES.length} templates. Nothing generated here is sent anywhere.`}
        />
        <div className="row g-3">
          <Field label="Prompt" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={generate.prompt}
              onChange={(event) => setGenerate('prompt')(event.target.value)}
            />
          </Field>
          <Field label="Template">
            <Select
              value={generate.template}
              onChange={setGenerate('template')}
              options={templateNames}
            />
          </Field>
          <Field label="Tone">
            <Select
              value={generate.tone}
              onChange={setGenerate('tone')}
              options={['Formal', 'Friendly', 'Plain']}
            />
          </Field>
          <Field label="Length">
            <Select
              value={generate.length}
              onChange={setGenerate('length')}
              options={['Short', 'Detailed', 'One page exactly']}
            />
          </Field>
          <Field label="Language">
            <Select value={generate.language} onChange={setGenerate('language')} options={LANGUAGES} />
          </Field>
          <Field label="On completion" span="col-12">
            <Select
              value={generate.onDone}
              onChange={setGenerate('onDone')}
              options={['Hold for approval', 'Hold and notify the approver', 'Save as a draft only']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'new_template'}
        onClose={onClose}
        title="Build a New Template"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Library</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Template “${newTemplate.name || 'Untitled'}” added to the library.`)}
        footer={<Footer icon="ti ti-template" label="Create template" onClose={onClose} />}
      >
        <Note text="A template is a section layout the engine reuses. Changing one changes every report drawn from it after that." />
        <div className="row g-3">
          <Field label="Name" span="col-12">
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Governor Briefing Note"
              value={newTemplate.name}
              onChange={(event) => setNewTemplate('name')(event.target.value)}
            />
          </Field>
          <Field label="Audience">
            <Select
              value={newTemplate.audience}
              onChange={setNewTemplate('audience')}
              options={['Guardians', 'Governors', 'Leadership', 'Heads of department', 'Students']}
            />
          </Field>
          <Field label="Sections">
            <input
              type="text"
              className="form-control"
              value={newTemplate.sections}
              onChange={(event) => setNewTemplate('sections')(event.target.value)}
            />
          </Field>
          <Field label="Start from">
            <Select
              value={newTemplate.basis}
              onChange={setNewTemplate('basis')}
              options={[
                'Start from the parent letter',
                'Start from the board pack',
                'Start empty',
              ]}
            />
          </Field>
          <Field label="Languages">
            <Select
              value={newTemplate.languages}
              onChange={setNewTemplate('languages')}
              options={['English only', 'All published languages', 'Choose per report']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'translate'}
        onClose={onClose}
        title="Translate a Report"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Library</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`Translations drafted into ${translate.into.toLowerCase()}.`)}
        footer={<Footer icon="ti ti-language" label="Translate" onClose={onClose} />}
      >
        <Note
          text={`One source text, up to ${LANGUAGES.length} published languages. A correction to the source reaches every version.`}
        />
        <div className="row g-3">
          <Field label="Report" span="col-12">
            <Select
              value={translate.report}
              onChange={setTranslate('report')}
              options={DRAFTS.map((entry) => entry.title)}
            />
          </Field>
          <Field label="From">
            <Select value={translate.from} onChange={setTranslate('from')} options={LANGUAGES} />
          </Field>
          <Field label="Into">
            <Select
              value={translate.into}
              onChange={setTranslate('into')}
              options={['All published languages', ...LANGUAGES.slice(1)]}
            />
          </Field>
          <Field label="Reading level">
            <Select
              value={translate.level}
              onChange={setTranslate('level')}
              options={['Match the source reading level', 'Simplify', 'Keep formal register']}
            />
          </Field>
          <Field label="Review">
            <Select
              value={translate.review}
              onChange={setTranslate('review')}
              options={['Hold all versions together', 'Release as each is ready']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'compare_versions'}
        onClose={onClose}
        title="Compare Two Versions"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Review</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit('Comparison opened, with the author against each change.')}
        footer={<Footer icon="ti ti-git-compare" label="Compare" onClose={onClose} />}
      >
        <Note text="Every edit carries the name of whoever made it, whether that was a person or the engine." />
        <div className="row g-3">
          <Field label="Report" span="col-12">
            <Select
              value={compare.report}
              onChange={setCompare('report')}
              options={DRAFTS.map((entry) => entry.title)}
            />
          </Field>
          <Field label="Left">
            <Select
              value={compare.left}
              onChange={setCompare('left')}
              options={['Current draft', 'Previous version', 'First pass']}
            />
          </Field>
          <Field label="Right">
            <Select
              value={compare.right}
              onChange={setCompare('right')}
              options={['Previous version', 'First pass', 'Last approved']}
            />
          </Field>
          <Field label="Show">
            <Select
              value={compare.show}
              onChange={setCompare('show')}
              options={['What changed and who changed it', 'What changed only']}
            />
          </Field>
          <Field label="Include">
            <Select
              value={compare.include}
              onChange={setCompare('include')}
              options={['Figures and prose', 'Figures only', 'Prose only']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'approve_report'}
        onClose={onClose}
        title="Send for Approval"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Approve</span>}
        dialogClassName="modal-dialog-centered modal-lg"
        onSubmit={submit(`Sent to ${approve.approver} for signature, due ${approve.due}.`)}
        footer={<Footer icon="ti ti-signature" label="Send for approval" onClose={onClose} />}
      >
        <Note
          text={`${AWAITING_APPROVAL} reports are waiting on a signature, and ${backlogLabel()} of reading sits behind the open queue. Nothing has ever been sent unsigned.`}
        />
        <div className="row g-3">
          <Field label="Report" span="col-12">
            <Select
              value={approve.report}
              onChange={setApprove('report')}
              options={WAITING.map((entry) => entry.title)}
            />
          </Field>
          <Field label="Approver">
            <Select
              value={approve.approver}
              onChange={setApprove('approver')}
              options={[...new Set(DRAFTS.map((entry) => entry.approver))]}
            />
          </Field>
          <Field label="Due by">
            <DateField value={approve.due} onChange={setApprove('due')} />
          </Field>
          <Field label="On approval" span="col-12">
            <Select
              value={approve.onApproval}
              onChange={setApprove('onApproval')}
              options={[
                'Distribute to the stated audience',
                'Hold for a second signature',
                'Archive without distributing',
              ]}
            />
          </Field>
          <Field label="Note for the approver" span="col-12">
            <textarea
              rows={3}
              className="form-control"
              value={approve.note}
              onChange={(event) => setApprove('note')(event.target.value)}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'export_reports'}
        onClose={onClose}
        title="Export the Library"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Export</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${exportForm.contents} exported as ${exportForm.format}.`)}
        footer={<Footer icon="ti ti-file-export" label="Export" onClose={onClose} />}
      >
        <Note text="Exports carry the approval trail, so a reader can see who signed each document and when." />
        <div className="row g-3">
          <Field label="Contents">
            <Select
              value={exportForm.contents}
              onChange={setExportForm('contents')}
              options={[
                'Approved reports only',
                'Everything including drafts',
                'One template',
                'This report only',
              ]}
            />
          </Field>
          <Field label="Format">
            <Select
              value={exportForm.format}
              onChange={setExportForm('format')}
              options={['PDF', 'DOCX', 'ZIP of PDFs']}
            />
          </Field>
          <Field label="Include the approval trail">
            <Select
              value={exportForm.trail}
              onChange={setExportForm('trail')}
              options={['Yes, with the approval trail', 'No, documents only']}
            />
          </Field>
          <Field label="Deliver to">
            <Select
              value={exportForm.deliver}
              onChange={setExportForm('deliver')}
              options={['Download', 'Email to me', 'Document store']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'schedule_report'}
        onClose={onClose}
        title="Schedule a Report"
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Draft</span>}
        dialogClassName="modal-dialog-centered"
        onSubmit={submit(`${schedule.report} scheduled ${schedule.cadence.toLowerCase()}, from ${schedule.startOn}.`)}
        footer={<Footer icon="ti ti-calendar-time" label="Schedule" onClose={onClose} />}
      >
        <Note text="A scheduled report still stops at approval. The schedule decides when it is drafted, not when it is sent." />
        <div className="row g-3">
          <Field label="Report" span="col-12">
            <Select
              value={schedule.report}
              onChange={setSchedule('report')}
              options={TEMPLATES.map((entry) => entry.name)}
            />
          </Field>
          <Field label="Cadence">
            <Select
              value={schedule.cadence}
              onChange={setSchedule('cadence')}
              options={['Weekly', 'Fortnightly', 'Termly', 'On a date']}
            />
          </Field>
          <Field label="Starting">
            <DateField value={schedule.startOn} onChange={setSchedule('startOn')} />
          </Field>
          <Field label="Approver">
            <Select
              value={schedule.approver}
              onChange={setSchedule('approver')}
              options={[...new Set(DRAFTS.map((entry) => entry.approver))]}
            />
          </Field>
          <Field label="On completion" span="col-12">
            <Select
              value={schedule.onDone}
              onChange={setSchedule('onDone')}
              options={[
                'Hold for approval every time',
                'Hold and notify the approver',
                'Save quietly as a draft',
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'preview_report' || active === 'review_draft'}
        onClose={onClose}
        title={active === 'review_draft' ? 'Review Draft' : 'Preview Report'}
        className="aix-modal"
        eyebrow={<span className="aix-eyebrow">Review</span>}
        dialogClassName="modal-dialog-centered modal-xl"
        footer={
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 w-100">
            <span className="fs-13 text-muted">
              <span className="fw-medium text-dark">{WAITING.length}</span> of{' '}
              <span className="fw-medium text-dark">{DRAFTS.length}</span> drafts still need a
              person · {backlogLabel()} of reading
            </span>
            <ActionLink
              className="btn btn-primary d-inline-flex align-items-center"
              onClick={() => onToast('Opened for signature.', 'info')}
            >
              <i className="ti ti-signature me-1" />
              Send for approval
            </ActionLink>
          </div>
        }
      >
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Report</th>
                <th>Template</th>
                <th>Audience</th>
                <th>Signs it</th>
                <th>State</th>
                <th>Words</th>
                <th>Review</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {DRAFTS.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <span className="fs-13 fw-medium text-dark">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.id}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{templateOf(entry)?.name ?? '—'}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{entry.audience}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{entry.approver}</span>
                  </td>
                  <td>
                    <span className={`aix-badge ${stateToneOf(entry.state)}`}>{entry.state}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">
                      {entry.words === 0 ? '—' : entry.words.toLocaleString('en-US')}
                    </span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{entry.reviewMinutes} min</span>
                  </td>
                  <td className="text-end">
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => {
                        onClose();
                        onOpenRow(entry);
                      }}
                    >
                      <i className="ti ti-eye me-1" />
                      Open
                    </ActionLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
};

export default ReportModals;
