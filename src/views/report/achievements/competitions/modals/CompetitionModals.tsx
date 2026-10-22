import { useEffect, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import type { Competition } from '../data/competitions.data';
import {
  capacityPctOf,
  categoryOptions,
  CATEGORY_META,
  coordinatorOptions,
  dateLabelOf,
  durationLabelOf,
  durationOf,
  eventTypeOptions,
  participantsLabelOf,
  REGISTRATION_CLOSES,
  relativeLabelOf,
  statusNoteOf,
  statusOf,
  statusPill,
  venueOptions,
} from '../data/competitions.data';

export type CompetitionModalId =
  | 'create'
  | 'edit'
  | 'register'
  | 'judges'
  | 'publish'
  | 'certificates'
  | 'view';

export interface CompetitionModalsProps {
  active: CompetitionModalId | null;
  onClose: () => void;
  row: Competition | null;
  rows: Competition[];
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
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

const Line = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="d-flex align-items-center justify-content-between py-2 border-bottom">
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
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
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

const CompetitionModals = ({
  active,
  onClose,
  row,
  rows,
  panelOpen,
  onClosePanel,
  onToast,
}: CompetitionModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  /**
   * The competition picker four of the dialogs carry. It is the register
   * itself, so a competition added upstream shows up in every dialog at once.
   */
  const competitionOptions = rows.map((entry) => `${entry.id} · ${entry.name}`);
  const [competition, setCompetition] = useState(competitionOptions[0] ?? '');

  const free = row && row.places !== null && row.entrants !== null ? row.places - row.entrants : 0;

  const [form, setForm] = useForm(
    {
      name: row?.name ?? '',
      category: row?.category ?? categoryOptions[0],
      eventType: row?.eventType ?? eventTypeOptions[0],
      venue: row?.venue.split(',')[0] ?? venueOptions[0],
      coordinator: row?.coordinator ?? coordinatorOptions[0],
      startsOn: row?.startsOn ?? REGISTRATION_CLOSES,
      endsOn: row?.endsOn ?? REGISTRATION_CLOSES,
      places: row?.places ? String(row.places) : '',
      closesOn: row?.registrationClosesOn ?? REGISTRATION_CLOSES,
    },
    active === 'create' || active === 'edit',
  );

  const [register, setRegister] = useForm(
    {
      group: 'All houses',
      entries: String(Math.min(10, Math.max(1, free))),
      closesOn: row?.registrationClosesOn ?? REGISTRATION_CLOSES,
      confirm: 'Send confirmation to guardians',
    },
    active === 'register',
  );

  const [judges, setJudges] = useForm(
    {
      lead: coordinatorOptions[0],
      panel: 'Three judges',
      criteria: 'Published rubric',
      briefing: 'The day before',
    },
    active === 'judges',
  );

  const [publish, setPublish] = useForm(
    {
      places: 'Top three',
      announce: 'Assembly and portal',
      notify: 'Participants and guardians',
      certificates: 'Issue with the results',
    },
    active === 'publish',
  );

  const [certificates, setCertificates] = useForm(
    {
      recipients: row ? `Placed students · ${row.placements.length}` : 'Placed students',
      template: 'Competition placement',
      signedBy: 'Principal',
      deliver: 'Print and hand out at assembly',
    },
    active === 'certificates',
  );

  const detail = useMemo(() => row, [row]);

  return (
    <>
      <Modal
        open={active === 'create' || active === 'edit'}
        onClose={onClose}
        title={active === 'edit' ? 'Edit Competition' : 'Create Competition'}
        dialogClassName="modal-lg"
        onSubmit={submit(
          active === 'edit' ? 'Competition updated.' : `“${form.name || 'Competition'}” created as a draft.`,
        )}
        footer={
          <Footer
            icon={active === 'edit' ? 'ti ti-check' : 'ti ti-plus'}
            label={active === 'edit' ? 'Save changes' : 'Create competition'}
            onClose={onClose}
          />
        }
      >
        <div className="row g-3">
          <Field label="Competition name" span="col-12">
            <input
              type="text"
              className="form-control"
              value={form.name}
              onChange={(event) => setForm('name')(event.target.value)}
              placeholder="e.g. Annual Science Exhibition 2026"
            />
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={setForm('category')} options={categoryOptions} />
          </Field>
          <Field label="Event type">
            <Select
              value={form.eventType}
              onChange={setForm('eventType')}
              options={eventTypeOptions}
            />
          </Field>
          <Field label="Starts on">
            <DateField value={form.startsOn} onChange={setForm('startsOn')} />
          </Field>
          <Field label="Ends on">
            <DateField value={form.endsOn} onChange={setForm('endsOn')} />
          </Field>
          <Field label="Venue">
            <Select value={form.venue} onChange={setForm('venue')} options={venueOptions} />
          </Field>
          <Field label="Coordinator">
            <Select
              value={form.coordinator}
              onChange={setForm('coordinator')}
              options={coordinatorOptions}
            />
          </Field>
          <Field label="Places available">
            <input
              type="text"
              className="form-control"
              value={form.places}
              onChange={(event) => setForm('places')(event.target.value)}
            />
          </Field>
          <Field label="Registration closes">
            <DateField value={form.closesOn} onChange={setForm('closesOn')} />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'register'}
        onClose={onClose}
        title="Register Participants"
        dialogClassName="modal-lg"
        onSubmit={submit(`${register.entries} entries registered.`)}
        footer={<Footer icon="ti ti-user-plus" label="Register" onClose={onClose} />}
      >
        {row ? (
          <div className="mb-3">
            <Line label="Competition" value={row.name} />
            <Line label="Registered" value={participantsLabelOf(row)} />
            <Line label="Places still free" value={free} />
            <Line label="Capacity" value={`${capacityPctOf(row) ?? 0}%`} />
          </div>
        ) : null}
        <div className="row g-3">
          <Field label="Competition" span="col-12">
            <Select
              value={competition}
              onChange={setCompetition}
              options={competitionOptions}
            />
          </Field>
          <Field label="Group">
            <Select
              value={register.group}
              onChange={setRegister('group')}
              options={['All houses', 'One house', 'Selected classes', 'Individual entry']}
            />
          </Field>
          <Field label="Entries">
            <input
              type="text"
              className="form-control"
              value={register.entries}
              onChange={(event) => setRegister('entries')(event.target.value)}
            />
          </Field>
          <Field label="Registration closes">
            <DateField value={register.closesOn} onChange={setRegister('closesOn')} />
          </Field>
          <Field label="Confirmation">
            <Select
              value={register.confirm}
              onChange={setRegister('confirm')}
              options={[
                'Send confirmation to guardians',
                'Confirm to students only',
                'No confirmation',
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'judges'}
        onClose={onClose}
        title="Assign Judges"
        onSubmit={submit('Judging panel assigned.')}
        footer={<Footer icon="ti ti-gavel" label="Assign judges" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Competition" span="col-12">
            <Select
              value={competition}
              onChange={setCompetition}
              options={competitionOptions}
            />
          </Field>
          <Field label="Lead judge">
            <Select value={judges.lead} onChange={setJudges('lead')} options={coordinatorOptions} />
          </Field>
          <Field label="Panel size">
            <Select
              value={judges.panel}
              onChange={setJudges('panel')}
              options={['Three judges', 'Two judges', 'Five judges']}
            />
          </Field>
          <Field label="Criteria">
            <Select
              value={judges.criteria}
              onChange={setJudges('criteria')}
              options={['Published rubric', 'Custom rubric', 'Points only']}
            />
          </Field>
          <Field label="Briefing">
            <Select
              value={judges.briefing}
              onChange={setJudges('briefing')}
              options={['The day before', 'On the morning', 'No briefing']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'publish'}
        onClose={onClose}
        title="Publish Results"
        dialogClassName="modal-lg"
        onSubmit={submit('Results published.')}
        footer={<Footer icon="ti ti-send" label="Publish results" onClose={onClose} />}
      >
        {row ? (
          <div className="mb-3">
            <Line label="Competition" value={row.name} />
            <Line label="Entrants" value={row.entrants ?? '—'} />
            <Line label="Results recorded" value={row.placements.length} />
            <Line label="Current status" value={statusOf(row)} />
          </div>
        ) : null}
        {row && row.placements.length > 0 ? (
          <div className="table-responsive mb-3">
            <table className="table table-nowrap mb-0">
              <thead className="thead-light">
                <tr>
                  <th>Place</th>
                  <th>Student</th>
                  <th>Class</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {row.placements.map((placement) => (
                  <tr key={placement.place}>
                    <td>{placement.place}</td>
                    <td>{placement.student}</td>
                    <td>{placement.className}</td>
                    <td>
                      {placement.score} / {placement.outOf}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="fs-13 text-muted">
            No results have been recorded for this competition yet. Publishing will do nothing until
            the coordinator enters them.
          </p>
        )}
        <div className="row g-3">
          <Field label="Competition" span="col-12">
            <Select
              value={competition}
              onChange={setCompetition}
              options={competitionOptions}
            />
          </Field>
          <Field label="Places to publish">
            <Select
              value={publish.places}
              onChange={setPublish('places')}
              options={['Top three', 'Top five', 'All entrants ranked']}
            />
          </Field>
          <Field label="Announce on">
            <Select
              value={publish.announce}
              onChange={setPublish('announce')}
              options={['Assembly and portal', 'Portal only', 'Notice board only']}
            />
          </Field>
          <Field label="Notify">
            <Select
              value={publish.notify}
              onChange={setPublish('notify')}
              options={['Participants and guardians', 'Participants only', 'Nobody yet']}
            />
          </Field>
          <Field label="Certificates">
            <Select
              value={publish.certificates}
              onChange={setPublish('certificates')}
              options={['Issue with the results', 'Issue separately', 'Do not issue']}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'certificates'}
        onClose={onClose}
        title="Issue Certificates"
        onSubmit={submit('Certificates queued for printing.')}
        footer={<Footer icon="ti ti-certificate" label="Issue certificates" onClose={onClose} />}
      >
        <div className="row g-3">
          <Field label="Competition" span="col-12">
            <Select
              value={competition}
              onChange={setCompetition}
              options={competitionOptions}
            />
          </Field>
          <Field label="Recipients" span="col-12">
            <Select
              value={certificates.recipients}
              onChange={setCertificates('recipients')}
              options={[
                `Placed students · ${row?.placements.length ?? 0}`,
                `All entrants · ${row?.entrants ?? 0}`,
                'Selected students',
              ]}
            />
          </Field>
          <Field label="Template">
            <Select
              value={certificates.template}
              onChange={setCertificates('template')}
              options={['Competition placement', 'Participation', 'Merit']}
            />
          </Field>
          <Field label="Signed by">
            <Select
              value={certificates.signedBy}
              onChange={setCertificates('signedBy')}
              options={['Principal', 'Coordinator', 'Principal and coordinator']}
            />
          </Field>
          <Field label="Deliver" span="col-12">
            <Select
              value={certificates.deliver}
              onChange={setCertificates('deliver')}
              options={[
                'Print and hand out at assembly',
                'Email as PDF',
                'Both print and email',
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={active === 'view'}
        onClose={onClose}
        title={row?.name ?? 'Competition'}
        dialogClassName="modal-lg"
        footer={
          <ActionLink className="btn btn-light" onClick={onClose}>
            Close
          </ActionLink>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 mb-3">
              <span
                className={`avatar avatar-lg bg-${CATEGORY_META[row.category].tint}-transparent text-${CATEGORY_META[row.category].tint} rounded`}
              >
                <i className={CATEGORY_META[row.category].icon} />
              </span>
              <div>
                <p className="fs-15 fw-medium mb-0">{row.name}</p>
                <p className="fs-12 text-muted mb-0">
                  {row.id} · {row.category} · {row.eventType}
                </p>
              </div>
              <span className={`dt-pill ${statusPill(statusOf(row))} ms-auto`}>
                <span className="dt-pill-dot" />
                {statusOf(row)}
              </span>
            </div>
            <Line label="Dates" value={`${dateLabelOf(row)} · ${durationLabelOf(row)}`} />
            <Line label="When" value={relativeLabelOf(row)} />
            <Line label="Venue" value={row.venue} />
            <Line label="Capacity" value={`${participantsLabelOf(row)} · ${capacityPctOf(row) ?? 0}%`} />
            <Line label="Groups entered" value={row.groups} />
            <Line label="Coordinator" value={`${row.coordinator} · ${row.coordinatorRole}`} />
            <Line label="Status note" value={statusNoteOf(row)} />
          </>
        ) : null}
      </Modal>

      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title={detail?.name ?? 'Competition'}
        titleAccessory={
          detail ? (
            <span className="fs-12 text-muted">
              {detail.id} · {detail.category}
            </span>
          ) : undefined
        }
      >
        {detail ? (
          <>
            <h6 className="fs-14 mb-2">Event</h6>
            <Line label="Dates" value={dateLabelOf(detail)} />
            <Line label="Duration" value={`${durationOf(detail)} days`} />
            <Line label="Venue" value={detail.venue} />
            <Line label="Notes" value={detail.venueNote} />

            <h6 className="fs-14 mt-4 mb-2">Entries</h6>
            <Line label="Registered" value={participantsLabelOf(detail)} />
            <Line label="Capacity" value={`${capacityPctOf(detail) ?? 0}%`} />
            <Line label="Groups" value={detail.groups} />

            <h6 className="fs-14 mt-4 mb-2">Results</h6>
            {detail.placements.length === 0 ? (
              <p className="fs-13 text-muted mb-0">No results recorded yet.</p>
            ) : (
              detail.placements.map((placement) => (
                <Line
                  key={placement.place}
                  label={`${placement.place} · ${placement.student}`}
                  value={`${placement.score} / ${placement.outOf}`}
                />
              ))
            )}
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default CompetitionModals;
