import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { CalendarModalId } from '../data/academicCalendar.data';

export interface CalendarModalsProps {
  active: CalendarModalId | null;
  /** Title of the entry that opened the Details dialog. */
  eventTitle: string;
  onClose: () => void;
  onToast: (message: string) => void;
}

const EVENT_CATEGORIES = [
  'Academic Session',
  'Examination',
  'Holiday',
  'Sports Event',
  'Cultural Programme',
  'Staff Meeting',
  'Parent Meeting',
  'Admissions',
  'Fee Collection',
  'Graduation',
];

const EVENT_TYPES = ['Single Day', 'Multi-day', 'Recurring'];
const CLASS_OPTIONS = ['All Classes', 'Class IX', 'Class X', 'Class XI', 'Class XII'];
const DEPARTMENTS = ['All Departments', 'Primary', 'Secondary', 'Senior Secondary'];

interface EventDraft {
  title: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  organizer: string;
  classes: string;
  department: string;
  description: string;
  reminder: boolean;
}

const EMPTY_EVENT: EventDraft = {
  title: '',
  category: EVENT_CATEGORIES[0],
  type: EVENT_TYPES[0],
  startDate: '',
  endDate: '',
  startTime: '',
  endTime: '',
  venue: '',
  organizer: '',
  classes: CLASS_OPTIONS[0],
  department: DEPARTMENTS[0],
  description: '',
  reminder: true,
};

/** Add and Edit share one form; only ids and copy differ. */
const EventForm = ({
  prefix,
  draft,
  onChange,
}: {
  prefix: string;
  draft: EventDraft;
  onChange: (patch: Partial<EventDraft>) => void;
}) => (
  <div className="row">
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-title`}>
          Event Title
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter event title"
          id={`${prefix}-title`}
          value={draft.title}
          onChange={(event) => onChange({ title: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-category`}>
          Event Category
        </label>
        <select
          className="form-select"
          id={`${prefix}-category`}
          value={draft.category}
          onChange={(event) => onChange({ category: event.target.value })}
        >
          {EVENT_CATEGORIES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-type`}>
          Event Type
        </label>
        <select
          className="form-select"
          id={`${prefix}-type`}
          value={draft.type}
          onChange={(event) => onChange({ type: event.target.value })}
        >
          {EVENT_TYPES.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-start-date`}>
          Start Date
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-start-date`}
          value={draft.startDate}
          onChange={(event) => onChange({ startDate: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-end-date`}>
          End Date
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-end-date`}
          value={draft.endDate}
          onChange={(event) => onChange({ endDate: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-start-time`}>
          Start Time
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-start-time`}
          value={draft.startTime}
          onChange={(event) => onChange({ startTime: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-end-time`}>
          End Time
        </label>
        <input
          type="text"
          className="form-control"
          id={`${prefix}-end-time`}
          value={draft.endTime}
          onChange={(event) => onChange({ endTime: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-venue`}>
          Venue
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter venue"
          id={`${prefix}-venue`}
          value={draft.venue}
          onChange={(event) => onChange({ venue: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-organizer`}>
          Organizer
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter organizer"
          id={`${prefix}-organizer`}
          value={draft.organizer}
          onChange={(event) => onChange({ organizer: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-classes`}>
          Applicable Classes
        </label>
        <select
          className="form-select"
          id={`${prefix}-classes`}
          value={draft.classes}
          onChange={(event) => onChange({ classes: event.target.value })}
        >
          {CLASS_OPTIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-department`}>
          Department
        </label>
        <select
          className="form-select"
          id={`${prefix}-department`}
          value={draft.department}
          onChange={(event) => onChange({ department: event.target.value })}
        >
          {DEPARTMENTS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-description`}>
          Description
        </label>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Enter description"
          id={`${prefix}-description`}
          value={draft.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
      </div>
    </div>
    <div className="col-md-12">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${prefix}-attachments`}>
          Attachments
        </label>
        <input type="file" className="form-control" id={`${prefix}-attachments`} />
      </div>
      <div className="form-check form-switch mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={`${prefix}-reminder`}
          checked={draft.reminder}
          onChange={(event) => onChange({ reminder: event.target.checked })}
        />
        <label className="form-check-label" htmlFor={`${prefix}-reminder`}>
          Send reminder notification
        </label>
      </div>
    </div>
  </div>
);

const detailRows: { label: string; icon: string; value: string }[] = [
  { label: 'Date', icon: 'ti ti-calendar', value: '22 July 2026' },
  { label: 'Time', icon: 'ti ti-clock', value: '09:00 AM - 01:00 PM' },
  { label: 'Duration', icon: 'ti ti-hourglass', value: '4 Hours' },
  { label: 'Venue', icon: 'ti ti-map-pin', value: 'Main Examination Block' },
  { label: 'Organizer', icon: 'ti ti-user', value: 'Exam Cell' },
  { label: 'Applicable Classes', icon: 'ti ti-school', value: 'IX, X, XI, XII' },
  { label: 'Departments', icon: 'ti ti-building', value: 'Secondary, Senior Secondary' },
  { label: 'Reminder', icon: 'ti ti-bell', value: '1 Day & 1 Hour Before' },
];

const participantAvatars = [
  'assets/img/profiles/avatar-23.jpg',
  'assets/img/profiles/avatar-25.jpg',
  'assets/img/profiles/avatar-27.jpg',
  'assets/img/profiles/avatar-01.jpg',
];

const CalendarModals = ({ active, eventTitle, onClose, onToast }: CalendarModalsProps) => {
  const [addDraft, setAddDraft] = useState<EventDraft>(EMPTY_EVENT);
  const [editDraft, setEditDraft] = useState<EventDraft>({
    ...EMPTY_EVENT,
    title: 'Quarterly Examination',
    category: 'Examination',
  });

  const [assignClasses, setAssignClasses] = useState('Class XI');
  const [assignDepartments, setAssignDepartments] = useState('Primary');
  const [participants] = useState(['James Ross', 'Sylvia Ray', 'Marcus Blake']);

  const [defaultView, setDefaultView] = useState('Month');
  const [weekStart, setWeekStart] = useState('Sunday');
  const [timeFormat, setTimeFormat] = useState('12 Hour');
  const [showWeekends, setShowWeekends] = useState(true);
  const [showHolidays, setShowHolidays] = useState(true);
  const [showCancelled, setShowCancelled] = useState(false);

  const [remindMe, setRemindMe] = useState('1 hour before');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyPush, setNotifyPush] = useState(true);
  const [recipients, setRecipients] = useState('Teachers & Staff');

  const [repeat, setRepeat] = useState('Daily');
  const [ends, setEnds] = useState('Never');

  const [importSource, setImportSource] = useState('iCal / ICS File');

  const finish = (message: string) => {
    onClose();
    onToast(message);
  };

  return (
    <>
      {/* Add Academic Event */}
      <Modal
        open={active === 'addEvent'}
        onClose={onClose}
        title="Add Academic Event"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          setAddDraft(EMPTY_EVENT);
          finish(addDraft.title ? `${addDraft.title} added to the calendar` : 'Event added to the calendar');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Add Event
            </button>
          </>
        }
      >
        <EventForm
          prefix="acal-add"
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Edit Event */}
      <Modal
        open={active === 'editEvent'}
        onClose={onClose}
        title="Edit Event"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          finish('Event updated');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <EventForm
          prefix="acal-edit"
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
        />
      </Modal>

      {/* Event Details */}
      <Modal
        open={active === 'eventDetails'}
        onClose={onClose}
        title={eventTitle || 'Quarterly Examination'}
        dialogClassName="modal-lg"
        titleAccessory={<span className="badge badge-soft-light mt-1">Examination</span>}
        footer={
          <Link to="#" className="btn btn-light" onClick={onClose}>
            Close
          </Link>
        }
      >
        <div className="row">
          {detailRows.map((row) => (
            <div className="col-md-6 mb-3" key={row.label}>
              <span className="text-muted d-block fs-12">{row.label}</span>
              <span className="fw-medium">
                <i className={`${row.icon} text-primary me-1`} />
                {row.value}
              </span>
            </div>
          ))}
          <div className="col-md-12 mb-3">
            <span className="text-muted d-block fs-12 mb-1">Participants</span>
            <div className="avatar-list-stacked avatar-group-sm">
              {participantAvatars.map((avatar) => (
                <span className="avatar avatar-rounded" key={avatar}>
                  <ImageWithBasePath className="border border-white" src={avatar} alt="img" />
                </span>
              ))}
              <span className="avatar avatar-rounded bg-primary text-white fs-12">+8</span>
            </div>
          </div>
          <div className="col-md-12 mb-3">
            <span className="text-muted d-block fs-12 mb-1">Description</span>
            <p className="mb-0">
              Term-1 quarterly assessment for classes IX to XII across all subjects. Students must carry hall
              tickets and report 30 minutes prior to the exam.
            </p>
          </div>
          <div className="col-md-12">
            <span className="text-muted d-block fs-12 mb-2">Attachments</span>
            <Link to="#" className="btn btn-outline-light bg-white btn-sm me-2 mb-2">
              <i className="ti ti-file-type-pdf text-danger me-1" />
              Exam-Timetable.pdf
            </Link>
            <Link to="#" className="btn btn-outline-light bg-white btn-sm mb-2">
              <i className="ti ti-file-type-doc text-primary me-1" />
              Instructions.docx
            </Link>
          </div>
        </div>
      </Modal>

      {/* Assign Participants */}
      <Modal
        open={active === 'assignParticipants'}
        onClose={onClose}
        title="Assign Participants"
        onSubmit={(event) => {
          event.preventDefault();
          finish('Participants assigned');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Assign
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-assign-classes">
            Assign Classes
          </label>
          <select
            className="form-select"
            id="acal-assign-classes"
            value={assignClasses}
            onChange={(event) => setAssignClasses(event.target.value)}
          >
            <option>Class XI</option>
            <option>Class XII</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-assign-departments">
            Assign Departments
          </label>
          <select
            className="form-select"
            id="acal-assign-departments"
            value={assignDepartments}
            onChange={(event) => setAssignDepartments(event.target.value)}
          >
            <option>Primary</option>
            <option>Secondary</option>
            <option>Senior Secondary</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-assign-staff">
            Assign Teachers / Staff
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Search and add participants"
            id="acal-assign-staff"
          />
        </div>
        <div className="d-flex flex-wrap gap-1">
          {participants.map((name) => (
            <span className="badge badge-soft-primary d-inline-flex align-items-center" key={name}>
              {name}
            </span>
          ))}
        </div>
      </Modal>

      {/* Calendar Settings */}
      <Modal
        open={active === 'calendarSettings'}
        onClose={onClose}
        title="Calendar Settings"
        onSubmit={(event) => {
          event.preventDefault();
          finish('Calendar settings saved');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Settings
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-default-view">
            Default View
          </label>
          <select
            className="form-select"
            id="acal-default-view"
            value={defaultView}
            onChange={(event) => setDefaultView(event.target.value)}
          >
            <option>Month</option>
            <option>Week</option>
            <option>Day</option>
            <option>Agenda</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-week-start">
            Week Starts On
          </label>
          <select
            className="form-select"
            id="acal-week-start"
            value={weekStart}
            onChange={(event) => setWeekStart(event.target.value)}
          >
            <option>Sunday</option>
            <option>Monday</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-time-format">
            Time Format
          </label>
          <select
            className="form-select"
            id="acal-time-format"
            value={timeFormat}
            onChange={(event) => setTimeFormat(event.target.value)}
          >
            <option>12 Hour</option>
            <option>24 Hour</option>
          </select>
        </div>
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="show_weekends"
            checked={showWeekends}
            onChange={(event) => setShowWeekends(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="show_weekends">
            Show Weekends
          </label>
        </div>
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="show_holidays"
            checked={showHolidays}
            onChange={(event) => setShowHolidays(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="show_holidays">
            Highlight Holidays
          </label>
        </div>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="show_declined"
            checked={showCancelled}
            onChange={(event) => setShowCancelled(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="show_declined">
            Show Cancelled Events
          </label>
        </div>
      </Modal>

      {/* Reminder Settings */}
      <Modal
        open={active === 'reminderSettings'}
        onClose={onClose}
        title="Reminder Settings"
        onSubmit={(event) => {
          event.preventDefault();
          finish('Reminder saved');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Reminder
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-remind-me">
            Remind Me
          </label>
          <select
            className="form-select"
            id="acal-remind-me"
            value={remindMe}
            onChange={(event) => setRemindMe(event.target.value)}
          >
            <option>At time of event</option>
            <option>10 minutes before</option>
            <option>1 hour before</option>
            <option>1 week before</option>
          </select>
        </div>
        <label className="form-label">Notify Via</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="notify_email"
            checked={notifyEmail}
            onChange={(event) => setNotifyEmail(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="notify_email">
            Email
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="notify_sms"
            checked={notifySms}
            onChange={(event) => setNotifySms(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="notify_sms">
            SMS
          </label>
        </div>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="notify_push"
            checked={notifyPush}
            onChange={(event) => setNotifyPush(event.target.checked)}
          />
          <label className="form-check-label" htmlFor="notify_push">
            Push Notification
          </label>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="acal-recipients">
            Recipients
          </label>
          <select
            className="form-select"
            id="acal-recipients"
            value={recipients}
            onChange={(event) => setRecipients(event.target.value)}
          >
            <option>Teachers &amp; Staff</option>
            <option>Students</option>
            <option>Parents</option>
            <option>Everyone</option>
          </select>
        </div>
      </Modal>

      {/* Recurring Event */}
      <Modal
        open={active === 'recurringEvent'}
        onClose={onClose}
        title="Recurring Event"
        onSubmit={(event) => {
          event.preventDefault();
          finish('Recurrence saved');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Recurrence
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-repeat">
            Repeat
          </label>
          <select
            className="form-select"
            id="acal-repeat"
            value={repeat}
            onChange={(event) => setRepeat(event.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="acal-ends">
            Ends
          </label>
          <select
            className="form-select"
            id="acal-ends"
            value={ends}
            onChange={(event) => setEnds(event.target.value)}
          >
            <option>Never</option>
            <option>On date</option>
            <option>After occurrences</option>
          </select>
        </div>
      </Modal>

      {/* Import Calendar */}
      <Modal
        open={active === 'importCalendar'}
        onClose={onClose}
        title="Import Calendar"
        onSubmit={(event) => {
          event.preventDefault();
          finish('Calendar import queued');
        }}
        footer={
          <>
            <Link to="#" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary">
              Import
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="acal-import-source">
            Import Source
          </label>
          <select
            className="form-select"
            id="acal-import-source"
            value={importSource}
            onChange={(event) => setImportSource(event.target.value)}
          >
            <option>iCal / ICS File</option>
            <option>Google Calendar</option>
            <option>Microsoft Outlook</option>
            <option>CSV File</option>
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="acal-upload-file">
            Upload File
          </label>
          <input type="file" className="form-control" id="acal-upload-file" />
        </div>
      </Modal>
    </>
  );
};

export default CalendarModals;
