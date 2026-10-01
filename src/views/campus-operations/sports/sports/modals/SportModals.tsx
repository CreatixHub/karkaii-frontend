import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import type { Sport, SportStatus } from '../data/sports.data';
import {
  academicYearOptions,
  achievementBadgesOf,
  achievementsOf,
  categoryOptions,
  coachOptions,
  competitionOptions,
  competitionsOf,
  coachingOf,
  daysOf,
  endTimeOf,
  genderOptions,
  importModes,
  participationOf,
  practiceDays,
  startTimeOf,
  statusOptions,
  statusPill,
  studentOptions,
  summaryOf,
  teamLabelOf,
  teamOptions,
  trainingLineOf,
  venueOptions,
  sports as allSports,
} from '../data/sports.data';

export type SportModalId =
  | 'add' | 'edit' | 'view' | 'assign-coach' | 'assign-students'
  | 'practice' | 'competitions' | 'achievements' | 'import' | 'delete';

export interface SportDraft {
  name: string;
  code: string;
  category: string;
  gender: string;
  team: string;
  coach: string;
  assistant: string;
  schedule: string;
  venue: string;
  students: string;
  events: string;
  achievements: string;
  competition: string;
  academicYear: string;
  status: SportStatus;
}

export const emptyDraft: SportDraft = {
  name: '', code: '', category: categoryOptions[0], gender: genderOptions[0], team: '',
  coach: '', assistant: '', schedule: '', venue: venueOptions[0], students: '0',
  events: '0', achievements: '0', competition: competitionOptions[0],
  academicYear: academicYearOptions[0], status: 'Active',
};

export const draftOf = (row: Sport): SportDraft => ({
  name: row.name,
  code: row.code,
  category: row.category,
  gender: row.gender,
  team: row.team,
  coach: row.coach,
  assistant: row.assistant,
  schedule: row.schedule,
  venue: row.venue,
  students: String(row.students),
  events: String(row.events),
  achievements: String(row.achievements),
  competition: row.competition,
  academicYear: row.academicYear,
  status: row.status,
});

export interface SportModalsProps {
  active: SportModalId | null;
  row: Sport | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: SportDraft) => void;
  onUpdate: (draft: SportDraft) => void;
  onAssignCoach: (coach: string, assistant: string) => void;
  onAssignStudents: (students: string[], team: string) => void;
  onSavePractice: (days: string[], startTime: string, venue: string) => void;
  onAddCompetition: () => void;
  onAddAchievement: () => void;
  onImport: (mode: string) => void;
  onDelete: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View Sport hand off to Assign Students, as the template's footer does. */
  onOpen: (modal: SportModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: SportDraft;
  onField: (field: keyof SportDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const SportForm = ({ draft, onField, suffix }: FormProps) => {
  const running = draft.status !== 'Inactive' && draft.status !== 'Archived';

  return (
    <div className="row">
      <div className="col-md-12">
        {/* The template's own two controls, kept verbatim. */}
        <div className="mb-3">
          <label className="form-label" htmlFor={`sport-name${suffix}`}>Name</label>
          <input
            type="text" className="form-control" id={`sport-name${suffix}`} placeholder="Enter Name"
            value={draft.name} onChange={(event) => onField('name', event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor={`sport-coach${suffix}`}>Coach</label>
          <input
            type="text" className="form-control" id={`sport-coach${suffix}`} placeholder="Enter Coach"
            value={draft.coach} onChange={(event) => onField('coach', event.target.value)}
          />
        </div>

        {/* Fields the redesigned grid prints but the template's form omits. */}
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-code${suffix}`}>Sport Code</label>
            <input
              type="text" className="form-control" id={`sport-code${suffix}`} placeholder="SP-01"
              value={draft.code} onChange={(event) => onField('code', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-category${suffix}`}>Category</label>
            <select
              className="form-select" id={`sport-category${suffix}`}
              value={draft.category} onChange={(event) => onField('category', event.target.value)}
            >
              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-gender${suffix}`}>Gender</label>
            <select
              className="form-select" id={`sport-gender${suffix}`}
              value={draft.gender} onChange={(event) => onField('gender', event.target.value)}
            >
              {genderOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-team${suffix}`}>Team</label>
            <input
              type="text" className="form-control" id={`sport-team${suffix}`} placeholder="Senior XI"
              list={`sport-teams${suffix}`}
              value={draft.team} onChange={(event) => onField('team', event.target.value)}
            />
            <datalist id={`sport-teams${suffix}`}>
              {teamOptions.map((option) => <option key={option} value={option} />)}
            </datalist>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-assistant${suffix}`}>Assistant Coach</label>
            <select
              className="form-select" id={`sport-assistant${suffix}`}
              value={draft.assistant} onChange={(event) => onField('assistant', event.target.value)}
            >
              <option value="">Select assistant</option>
              {coachOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-venue${suffix}`}>Venue</label>
            <select
              className="form-select" id={`sport-venue${suffix}`}
              value={draft.venue} onChange={(event) => onField('venue', event.target.value)}
            >
              {venueOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-schedule${suffix}`}>Training Schedule</label>
            <input
              type="text" className="form-control" id={`sport-schedule${suffix}`}
              placeholder="Mon, Wed, Fri · 04:00 PM"
              value={draft.schedule} onChange={(event) => onField('schedule', event.target.value)}
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-students${suffix}`}>Registered Students</label>
            <input
              type="number" className="form-control" id={`sport-students${suffix}`} min={0} placeholder="28"
              value={draft.students} onChange={(event) => onField('students', event.target.value)}
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-events${suffix}`}>Upcoming Events</label>
            <input
              type="number" className="form-control" id={`sport-events${suffix}`} min={0} placeholder="3"
              value={draft.events} onChange={(event) => onField('events', event.target.value)}
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-achievements${suffix}`}>Achievements</label>
            <input
              type="number" className="form-control" id={`sport-achievements${suffix}`} min={0} placeholder="6"
              value={draft.achievements} onChange={(event) => onField('achievements', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-competition${suffix}`}>Competition</label>
            <select
              className="form-select" id={`sport-competition${suffix}`}
              value={draft.competition} onChange={(event) => onField('competition', event.target.value)}
            >
              {competitionOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          {/*
            The template's third control is a free-text "Started Year", which the
            redesigned page never prints. Academic Year takes its slot.
          */}
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-year${suffix}`}>Academic Year</label>
            <select
              className="form-select" id={`sport-year${suffix}`}
              value={draft.academicYear} onChange={(event) => onField('academicYear', event.target.value)}
            >
              {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-12"><div className="mb-3">
            <label className="form-label" htmlFor={`sport-status${suffix}`}>Status</label>
            <select
              className="form-select" id={`sport-status${suffix}`}
              value={draft.status} onChange={(event) => onField('status', event.target.value)}
            >
              {statusOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
        </div>

        <div className="modal-satus-toggle d-flex align-items-center justify-content-between">
          <div className="status-title">
            <h5>Status</h5>
            <p>Change the Status by toggle </p>
          </div>
          <div className="status-toggle modal-status">
            <input
              type="checkbox" id={`sport-active${suffix}`} className="check"
              checked={running}
              onChange={(event) => onField('status', event.target.checked ? 'Active' : 'Inactive')}
            />
            <label htmlFor={`sport-active${suffix}`} className="checktoggle"> </label>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const SportModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignCoach, onAssignStudents,
  onSavePractice, onAddCompetition, onAddAchievement, onImport, onDelete, onToast, onOpen,
}: SportModalsProps) => {
  const [draft, setDraft] = useState<SportDraft>(emptyDraft);
  const [sport, setSport] = useState('');
  const [headCoach, setHeadCoach] = useState('');
  const [assistant, setAssistant] = useState('');
  const [team, setTeam] = useState('');
  const [students, setStudents] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState(venueOptions[0]);
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening seeds from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'assign-coach' && row) {
      setSport(row.name);
      setHeadCoach(row.coach);
      setAssistant(row.assistant);
    }
    if (active === 'assign-students' && row) {
      setTeam(teamLabelOf(row));
      setStudents([]);
    }
    if (active === 'practice' && row) {
      setDays(daysOf(row));
      setStartTime(startTimeOf(row));
      setEndTime(endTimeOf(row));
      setVenue(row.venue);
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof SportDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const toggleDay = (day: string) =>
    setDays((current) => (current.includes(day) ? current.filter((d) => d !== day) : [...current, day]));

  const badges = row ? achievementBadgesOf(row) : [];

  return (
    <>
      {/* Add Sport */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Sport"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Sport</button>
          </>
        }
      >
        <SportForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Sport */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Sport"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <SportForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Sport */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Sport Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('assign-students')}>
              Assign Students
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span
                className={`avatar avatar-lg bg-${row.tint}-transparent text-${row.tint} rounded d-inline-flex align-items-center justify-content-center me-2`}
              >
                <i className={`${row.icon} fs-20`} />
              </span>
              <div>
                <h5 className="mb-0">
                  {row.name}{' '}
                  <span className={`dt-pill ${statusPill[row.status]} ms-1`}>
                    <span className="dt-pill-dot" />{row.status}
                  </span>
                </h5>
                <span className="fs-12 text-muted">{summaryOf(row)}</span>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-user-star" />Coaching</h6>
                <p className="fs-13 mb-0">{coachingOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-clock" />Training</h6>
                <p className="fs-13 mb-0">{trainingLineOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-users" />Participation</h6>
                <p className="fs-13 mb-0">{participationOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-trophy" />Achievements</h6>
                {badges.length === 0 ? (
                  <p className="fs-13 mb-0">No titles won yet.</p>
                ) : (
                  <div className="d-flex flex-wrap gap-1">
                    {badges.map((badge) => (
                      <span className="badge badge-soft-success" key={badge}>{badge}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Assign Coach */}
      <Modal
        open={active === 'assign-coach' && row !== null}
        onClose={onClose}
        title="Assign Coach"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignCoach(headCoach, assistant); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Coach</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="sport">Sport</label>
            <select
              className="form-select" id="sport"
              value={sport} onChange={(event) => setSport(event.target.value)}
            >
              <option value="">Select sport</option>
              {allSports.map((entry) => <option key={entry.id}>{entry.name}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="head-coach">
              Head Coach <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" required id="head-coach"
              value={headCoach} onChange={(event) => setHeadCoach(event.target.value)}
            >
              <option value="">Select coach</option>
              {coachOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="assistant-coach">Assistant Coach</label>
            <select
              className="form-select" id="assistant-coach"
              value={assistant} onChange={(event) => setAssistant(event.target.value)}
            >
              <option value="">Select assistant</option>
              {coachOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Assign Students */}
      <Modal
        open={active === 'assign-students' && row !== null}
        onClose={onClose}
        title="Assign Students"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignStudents(students, team); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Students</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="sport-team">Sport / Team</label>
            <select
              className="form-select" id="sport-team"
              value={team} onChange={(event) => setTeam(event.target.value)}
            >
              <option value="">Select team</option>
              {allSports.map((entry) => <option key={entry.id}>{teamLabelOf(entry)}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="students">
              Students <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" multiple required id="students" size={4}
              value={students}
              onChange={(event) =>
                setStudents(Array.from(event.target.selectedOptions, (option) => option.value))
              }
            >
              {studentOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-12">
            <span className="fs-12 text-muted">
              <i className="ti ti-info-circle me-1" />Hold Ctrl / Cmd to select multiple students.
            </span>
          </div>
        </div>
      </Modal>

      {/* Practice Schedule */}
      <Modal
        open={active === 'practice' && row !== null}
        onClose={onClose}
        title="Practice Schedule"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onSavePractice(days, startTime, venue); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Save Schedule</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label">Practice Days</label>
            <div className="d-flex flex-wrap gap-3">
              {practiceDays.map((day, index) => (
                <div className="form-check" key={day}>
                  <input
                    className="form-check-input" type="checkbox" id={`pd${index}`}
                    checked={days.includes(day)} onChange={() => toggleDay(day)}
                  />
                  <label className="form-check-label" htmlFor={`pd${index}`}>{day}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="start-time">Start Time</label>
            <input
              type="text" className="form-control" id="start-time" placeholder="04:00 PM"
              value={startTime} onChange={(event) => setStartTime(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="end-time">End Time</label>
            <input
              type="text" className="form-control" id="end-time" placeholder="05:30 PM"
              value={endTime} onChange={(event) => setEndTime(event.target.value)}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="venue">Venue</label>
            <select
              className="form-select" id="venue"
              value={venue} onChange={(event) => setVenue(event.target.value)}
            >
              {venueOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Competition Calendar */}
      <Modal
        open={active === 'competitions' && row !== null}
        onClose={onClose}
        title="Competition Calendar"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={onAddCompetition}>
              <i className="ti ti-calendar-plus me-1" />Add Competition
            </button>
          </>
        }
      >
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Competition</th>
                <th>Date</th>
                <th>Venue</th>
                <th className="text-end">Status</th>
              </tr>
            </thead>
            <tbody>
              {(row ? competitionsOf(row) : []).map((entry, index) => (
                <tr key={`${entry.competition}-${index}`}>
                  <td>{entry.competition}</td>
                  <td>{entry.date}</td>
                  <td>{entry.venue}</td>
                  <td className="text-end">
                    <span
                      className={`badge badge-soft-${
                        entry.stage === 'Scheduled' ? 'primary' : entry.stage === 'Registration' ? 'warning' : 'info'
                      }`}
                    >
                      {entry.stage}
                    </span>
                  </td>
                </tr>
              ))}
              {row && row.events === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted fs-13">
                    No upcoming events scheduled.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Achievement Details */}
      <Modal
        open={active === 'achievements' && row !== null}
        onClose={onClose}
        title="Achievement Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={onAddAchievement}>
              <i className="ti ti-plus me-1" />Add Achievement
            </button>
          </>
        }
      >
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Competition</th>
                <th>Year</th>
                <th className="text-end">Medal</th>
              </tr>
            </thead>
            <tbody>
              {(row ? achievementsOf(row) : []).map((entry, index) => (
                <tr key={`${entry.title}-${index}`}>
                  <td>{entry.title}</td>
                  <td>{entry.competition}</td>
                  <td>{entry.year}</td>
                  <td className="text-end">
                    <span className={`badge badge-soft-${entry.tint}`}>
                      <i className={`${entry.icon} me-1`} />{entry.medal}
                    </span>
                  </td>
                </tr>
              ))}
              {row && row.achievements === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted fs-13">No titles won yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Import Sports */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Sports"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onImport(mode); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Import</button>
          </>
        }
      >
        <div className="stacked-dropdown mb-3">
          <i className="ti ti-cloud-upload" />
          <b>Drop your CSV or Excel file here</b>
          <span className="fs-12 text-muted">or click to browse · max 10 MB</span>
          <input type="file" aria-label="Sports file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="import-mode">Import mode</label>
          <select
            className="form-select" id="import-mode"
            value={mode} onChange={(event) => setMode(event.target.value)}
          >
            {importModes.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="alert alert-light border d-flex align-items-start gap-2 mb-0">
          <i className="ti ti-download fs-16" />
          <span className="fs-12">
            Not sure about the format? Download the template with all required columns and sample rows.
          </span>
        </div>
        <button
          type="button" className="btn btn-link p-0 fs-12 mt-2"
          onClick={() => onToast('Sports import template downloaded', 'info')}
        >
          Download template
        </button>
      </Modal>

      {/* Delete */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        bodyClassName="text-center"
        onSubmit={(event) => { event.preventDefault(); onDelete(); }}
      >
        <span className="delete-icon"><i className="ti ti-trash-x" /></span>
        <h4>Confirm Deletion</h4>
        <p>
          You want to delete {deleteCount === 1 ? 'this sport' : `all ${deleteCount} marked items`}, this
          cant be undone once you delete.
        </p>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-light me-3" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-danger">Yes, Delete</button>
        </div>
      </Modal>
    </>
  );
};

export default SportModals;
