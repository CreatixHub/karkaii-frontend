import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import type { SchoolEvent } from '../data/events.data';
import {
  AGENDA,
  PROGRESS,
  progressToneOf,
  ATTACHMENTS,
  audienceOptions,
  capacityLabelOf,
  categoryOptions,
  organizerOptions,
  PARTICIPANTS,
  registrationOf,
  registrationTint,
  venueOptions,
} from '../data/events.data';

export type EventModalId =
  | 'create'
  | 'edit'
  | 'view'
  | 'registration'
  | 'participants'
  | 'agenda'
  | 'attachment'
  | 'delete';

export interface EventModalsProps {
  active: EventModalId | null;
  onClose: () => void;
  event: SchoolEvent | null;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Opens another dialog from inside this one, e.g. Edit from the detail panel. */
  onOpen: (modal: EventModalId) => void;
}

/** The tint the attachment list gives each kind of file. */
const fileTone = (icon: string) =>
  icon.includes('pdf') ? 'is-pdf' : icon.includes('photo') ? 'is-img' : 'is-doc';

/* ----------------------------- Small helpers ----------------------------- */

const Field = ({
  label,
  children,
  span = 'col-md-6',
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  span?: string;
  required?: boolean;
}) => (
  <div className={span}>
    <label className="form-label">
      {label}
      {required ? <span className="text-danger ms-1">*</span> : null}
    </label>
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

/* -------------------------------- Dialogs -------------------------------- */

const EventModals = ({ active, onClose, event, onToast, onOpen }: EventModalsProps) => {
  const submit = (message: string) => (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const editing = active === 'edit';

  const [form, setForm] = useForm(
    {
      title: editing ? (event?.title ?? '') : '',
      category: event?.category ?? categoryOptions[0],
      date: editing ? (event?.date ?? '') : '',
      startTime: '',
      endTime: '',
      venue: event?.venue ?? venueOptions[0],
      organizer: event?.organizer ?? organizerOptions[0],
      audience: event?.audience ?? audienceOptions[0],
      deadline: editing ? (event?.deadline ?? '') : '',
      capacity: editing ? String(event?.capacity ?? '') : '',
      contact: editing ? (event?.contact ?? '') : '',
      description: editing ? (event?.description ?? '') : '',
    },
    active === 'create' || active === 'edit',
  );

  const [registration, setRegistration] = useForm(
    {
      status: event ? registrationOf(event) : 'Open',
      deadline: event?.deadline ?? '',
      capacity: String(event?.capacity ?? ''),
      waitlist: 'Allow a waitlist once capacity is reached',
    },
    active === 'registration',
  );

  const [notify, setNotify] = useState(true);

  return (
    <>
      {/* --------------------------- Create / Edit --------------------------- */}
      <Modal
        open={active === 'create' || active === 'edit'}
        onClose={onClose}
        title={editing ? 'Edit Event' : 'Create Event'}
        dialogClassName="modal-lg"
        onSubmit={submit(editing ? 'Event updated.' : 'Event created.')}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              {editing ? 'Save Changes' : 'Create Event'}
            </button>
          </>
        }
      >
        <div className="row g-3">
          <Field label="Event Name" span="col-12" required>
            <input
              type="text"
              className="form-control"
              value={form.title}
              onChange={(input) => setForm('title')(input.target.value)}
              placeholder="Enter an event name."
            />
          </Field>
          <Field label="Category">
            <Select
              value={form.category}
              onChange={setForm('category')}
              options={categoryOptions}
            />
          </Field>
          <Field label="Date" required>
            <DateField value={form.date} onChange={setForm('date')} />
          </Field>
          {editing ? null : (
            <>
              <Field label="Start Time">
                <input
                  type="text"
                  className="form-control"
                  value={form.startTime}
                  onChange={(input) => setForm('startTime')(input.target.value)}
                />
              </Field>
              <Field label="End Time">
                <input
                  type="text"
                  className="form-control"
                  value={form.endTime}
                  onChange={(input) => setForm('endTime')(input.target.value)}
                />
              </Field>
            </>
          )}
          <Field label="Venue">
            <Select value={form.venue} onChange={setForm('venue')} options={venueOptions} />
          </Field>
          {editing ? null : (
            <>
              <Field label="Organizer">
                <Select
                  value={form.organizer}
                  onChange={setForm('organizer')}
                  options={organizerOptions}
                />
              </Field>
              <Field label="Audience">
                <Select
                  value={form.audience}
                  onChange={setForm('audience')}
                  options={audienceOptions}
                />
              </Field>
              <Field label="Registration Deadline">
                <DateField value={form.deadline} onChange={setForm('deadline')} />
              </Field>
              <Field label="Capacity">
                <input
                  type="text"
                  className="form-control"
                  value={form.capacity}
                  onChange={(input) => setForm('capacity')(input.target.value)}
                />
              </Field>
              <Field label="Contact Person" span="col-12">
                <input
                  type="text"
                  className="form-control"
                  value={form.contact}
                  onChange={(input) => setForm('contact')(input.target.value)}
                />
              </Field>
            </>
          )}
          <Field label="Description" span="col-12" required={!editing}>
            <textarea
              className="form-control"
              rows={3}
              value={form.description}
              onChange={(input) => setForm('description')(input.target.value)}
              placeholder="Enter a description."
            />
          </Field>
        </div>
      </Modal>

      {/* ------------------------------ Detail ------------------------------- */}
      {/*
        The template ships the detail as an offcanvas — `#ev_detail`, which the
        stylesheet widens to 480px and hangs `.ev-oc-banner` off — not a modal.
      */}
      <Offcanvas
        open={active === 'view'}
        onClose={onClose}
        className={`cat-${event?.categoryKey ?? 'school'}`}
        labelledById="evdTitle"
        title={event?.title ?? 'Event'}
        id="ev_detail"
        footer={
          <div className="offcanvas-footer border-top p-3 d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-light bg-white flex-fill"
              onClick={() => onOpen('edit')}
            >
              <i className="ti ti-edit me-1" />
              Edit
            </button>
            <button
              type="button"
              className="btn btn-primary flex-fill"
              onClick={() => onOpen('registration')}
            >
              <i className="ti ti-clipboard-check me-1" />
              Register
            </button>
          </div>
        }
      >
        {event ? (
          <>
            <div className="ev-oc-banner mb-3">
              <span className="ev-oc-cat">{event.category}</span>
              <i
                className={`${event.icon} position-absolute top-50 start-50 translate-middle fs-1 opacity-50`}
                aria-hidden="true"
              />
            </div>

            <h6 className="mb-2">Description</h6>
            <p className="fs-13 text-muted">{event.description}</p>

            <div className="row g-3 my-1">
              {[
                ['Date', event.date],
                ['Time', event.time],
                ['Venue', event.venue],
                ['Organizer', event.organizer],
                ['Audience', event.audience],
              ].map(([label, value]) => (
                <div className="col-6" key={label}>
                  <div className="ev-info-item">
                    <span className="ev-info-label">{label}</span>
                    <span className="ev-info-val">{value}</span>
                  </div>
                </div>
              ))}
              <div className="col-6">
                <div className="ev-info-item">
                  <span className="ev-info-label">Participants</span>
                  <span className="ev-info-val">{event.registered} registered</span>
                </div>
              </div>
              <div className="col-6">
                <div className="ev-info-item">
                  <span className="ev-info-label">Registration Deadline</span>
                  <span className="ev-info-val">{event.deadline}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="ev-info-item">
                  <span className="ev-info-label">Registration</span>
                  <span className={`badge badge-soft-${registrationTint(registrationOf(event))}`}>
                    {registrationOf(event)}
                  </span>
                </div>
              </div>
              <div className="col-12">
                <div className="ev-info-item">
                  <span className="ev-info-label">Contact Person</span>
                  <span className="ev-info-val">{event.contact}</span>
                </div>
              </div>
            </div>

            <h6 className="mb-2 mt-3">Event Agenda</h6>
            <ul className="list-unstyled fs-13 text-muted mb-3">
              {AGENDA.map((slot) => (
                <li className="d-flex gap-2 py-1" key={slot.time}>
                  <span className="fw-medium text-dark">{slot.time}</span>
                  {slot.title}
                </li>
              ))}
            </ul>

            <h6 className="mb-2">Attachments</h6>
            <div className="d-flex flex-column gap-2 mb-3">
              {ATTACHMENTS.map((file) => (
                <div className="ev-file" key={file.name}>
                  <span className={`ev-file-ic ${fileTone(file.icon)}`}>
                    <i className={file.icon} />
                  </span>
                  <div className="flex-fill">
                    <div className="ev-file-name">{file.name}</div>
                    <div className="ev-file-meta">{file.meta}</div>
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label={`Preview ${file.name}`}
                      onClick={() => onOpen('attachment')}
                    >
                      <i className="ti ti-eye" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label={`Download ${file.name}`}
                      onClick={() => onToast(`${file.name} downloaded`)}
                    >
                      <i className="ti ti-download" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="mb-2">Event Progress</h6>
            <ul className="ev-steps">
              {PROGRESS.map((step, index) => {
                const tone = progressToneOf(index);
                return (
                  <li className={`ev-step ${tone}`} key={step.id}>
                    <span className="ev-step-ic">
                      <i className={step.icon} />
                    </span>
                    <div>
                      <div className="ev-step-title">{step.title}</div>
                      <div className="ev-step-meta">
                        {tone === 'is-muted' ? step.pending : step.meta}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </Offcanvas>

      {/* --------------------------- Registration ---------------------------- */}
      <Modal
        open={active === 'registration'}
        onClose={onClose}
        title="Manage Registration"
        subtitle={event ? `${event.title} · ${capacityLabelOf(event)}` : undefined}
        onSubmit={submit('Registration updated.')}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </ActionLink>
            <button type="submit" className="btn btn-primary">
              Save Registration
            </button>
          </>
        }
      >
        <div className="row g-3">
          <Field label="Registration Status" span="col-12">
            <Select
              value={registration.status}
              onChange={setRegistration('status')}
              options={['Open', 'Closing Soon', 'Full', 'Closed']}
            />
          </Field>
          <Field label="Deadline">
            <DateField value={registration.deadline} onChange={setRegistration('deadline')} />
          </Field>
          <Field label="Capacity">
            <input
              type="text"
              className="form-control"
              value={registration.capacity}
              onChange={(input) => setRegistration('capacity')(input.target.value)}
            />
          </Field>
          <Field label="Waitlist" span="col-12">
            <input
              type="text"
              className="form-control"
              value={registration.waitlist}
              onChange={(input) => setRegistration('waitlist')(input.target.value)}
            />
          </Field>
          <div className="col-12">
            <div className="form-check mb-0">
              <input
                className="form-check-input"
                type="checkbox"
                id="ev-notify"
                checked={notify}
                onChange={() => setNotify(!notify)}
              />
              <label className="form-check-label fs-13" htmlFor="ev-notify">
                Notify registered participants of changes
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* --------------------------- Participants ---------------------------- */}
      <Modal
        open={active === 'participants'}
        onClose={onClose}
        title="Participants"
        subtitle={event ? capacityLabelOf(event) : undefined}
        dialogClassName="modal-lg"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Close
            </ActionLink>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onToast('Attendee list downloaded');
                onClose();
              }}
            >
              Download List
            </button>
          </>
        }
      >
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PARTICIPANTS.map((person) => (
                <tr key={person.name}>
                  <td>
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-sm me-2">
                        <ImageWithBasePath
                          src={person.photo}
                          className="rounded-circle flex-shrink-0"
                          alt={person.name}
                        />
                      </span>
                      {person.name}
                    </div>
                  </td>
                  <td className="fs-13">{person.className}</td>
                  <td>
                    <span
                      className={`badge badge-soft-${person.state === 'Confirmed' ? 'success' : 'warning'}`}
                    >
                      {person.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* ------------------------------ Agenda ------------------------------- */}
      <Modal
        open={active === 'agenda'}
        onClose={onClose}
        title="Agenda Preview"
        subtitle={event?.title}
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Close
            </ActionLink>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              Print Agenda
            </button>
          </>
        }
      >
        <div className="ev-steps">
          {AGENDA.map((slot) => (
            <div className="ev-step" key={slot.time}>
              <span className="ev-step-ic">
                <i className="ti ti-clock" />
              </span>
              <div>
                <div className="ev-step-title">{slot.title}</div>
                <div className="ev-step-meta">
                  {slot.time} · {slot.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* ---------------------------- Attachment ----------------------------- */}
      <Modal
        open={active === 'attachment'}
        onClose={onClose}
        title="Attachment Preview"
        dialogClassName="modal-lg"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Close
            </ActionLink>
            <button type="button" className="btn btn-outline-light bg-white me-2" onClick={() => window.print()}>
              Print
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onToast('Attachment downloaded');
                onClose();
              }}
            >
              Download
            </button>
          </>
        }
      >
        {ATTACHMENTS.map((file) => (
          <div className="ev-file" key={file.name}>
            <span className="ev-file-ic">
              <i className={file.icon} />
            </span>
            <div className="flex-fill overflow-hidden">
              <div className="ev-file-name">{file.name}</div>
              <div className="ev-file-meta">{file.meta}</div>
            </div>
          </div>
        ))}
      </Modal>

      {/* ------------------------------ Delete ------------------------------- */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        bodyClassName="text-center"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </ActionLink>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                onToast(`${event?.title ?? 'Event'} deleted`, 'danger');
                onClose();
              }}
            >
              Yes, Delete
            </button>
          </>
        }
      >
        <span className="avatar avatar-xl bg-danger-transparent text-danger rounded-circle mb-3">
          <i className="ti ti-trash fs-24" />
        </span>
        <p className="fs-14 mb-0">
          You want to delete all the marked items, this cant be undone once you delete.
        </p>
      </Modal>
    </>
  );
};

export default EventModals;
