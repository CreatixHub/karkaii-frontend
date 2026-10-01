import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { MedicalStatus, Player, PlayerStatus } from '../data/players.data';
import {
  academicYearOptions,
  achievementBadgesOf,
  achievementsOf,
  availabilityOptions,
  classOptions,
  coachOptions,
  fitnessOf,
  genderOptions,
  importModes,
  medicalIcon,
  medicalOptions,
  medicalTint,
  performanceLineOf,
  performanceOf,
  playerFieldOf,
  sectionOptions,
  shortProfileOf,
  skillOptions,
  skillTint,
  skillWidth,
  sportOptions,
  statusOptions,
  statusPill,
  summaryOf,
  teamChoices,
  teamLabelOf,
  teamOptions,
} from '../data/players.data';

export type PlayerModalId =
  | 'add' | 'edit' | 'view' | 'team' | 'coach'
  | 'performance' | 'medical' | 'achievements' | 'import' | 'delete';

export interface PlayerDraft {
  name: string;
  admission: string;
  sport: string;
  team: string;
  position: string;
  jersey: string;
  coach: string;
  roll: string;
  classLevel: string;
  section: string;
  gender: string;
  skill: string;
  attendance: string;
  medical: string;
  achievements: string;
  availability: string;
  academicYear: string;
  status: PlayerStatus;
}

export const emptyDraft: PlayerDraft = {
  name: '', admission: '', sport: sportOptions[0], team: teamOptions[0], position: '',
  jersey: '', coach: '', roll: '', classLevel: classOptions[0], section: sectionOptions[0],
  gender: genderOptions[0], skill: 'Beginner', attendance: '0', medical: 'Cleared',
  achievements: '0', availability: 'Available', academicYear: academicYearOptions[0],
  status: 'Available',
};

export const draftOf = (row: Player): PlayerDraft => ({
  name: row.name,
  admission: row.admission,
  sport: row.sport,
  team: row.team,
  position: row.position,
  jersey: row.jersey,
  coach: row.coach,
  roll: String(row.roll),
  classLevel: row.classLevel,
  section: row.section,
  gender: row.gender,
  skill: row.skill,
  attendance: String(row.attendance),
  medical: row.medical,
  achievements: String(row.achievements),
  availability: row.availability,
  academicYear: row.academicYear,
  status: row.status,
});

export interface PlayerModalsProps {
  active: PlayerModalId | null;
  row: Player | null;
  /** How many rows the Delete dialog is about to remove. */
  deleteCount: number;
  onClose: () => void;
  onCreate: (draft: PlayerDraft) => void;
  onUpdate: (draft: PlayerDraft) => void;
  onAssignTeam: (teamChoice: string, position: string, jersey: string) => void;
  onAssignCoach: (coach: string) => void;
  onSaveClearance: (medical: MedicalStatus, lastCheckup: string, nextReview: string, notes: string) => void;
  onAddAchievement: () => void;
  onImport: (mode: string) => void;
  onDelete: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Lets View Player hand off to Team Assignment, as the template's footer does. */
  onOpen: (modal: PlayerModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: PlayerDraft;
  onField: (field: keyof PlayerDraft, value: string) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const PlayerForm = ({ draft, onField, suffix }: FormProps) => {
  const playing = draft.status !== 'Suspended' && draft.status !== 'Graduated';

  return (
    <div className="row">
      <div className="col-md-12">
        {/* The template's own two controls, kept verbatim. */}
        <div className="mb-3">
          <label className="form-label" htmlFor={`player-name${suffix}`}>Player Name</label>
          <input
            type="text" className="form-control" id={`player-name${suffix}`} placeholder="Enter Player Name"
            value={draft.name} onChange={(event) => onField('name', event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor={`player-sport${suffix}`}>Sports</label>
          <select
            className="form-select" id={`player-sport${suffix}`}
            value={draft.sport} onChange={(event) => onField('sport', event.target.value)}
          >
            {sportOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        {/* Fields the redesigned grid prints but the template's form omits. */}
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-adm${suffix}`}>Admission No</label>
            <input
              type="text" className="form-control" id={`player-adm${suffix}`} placeholder="AD202409"
              value={draft.admission} onChange={(event) => onField('admission', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-roll${suffix}`}>Roll No</label>
            <input
              type="number" className="form-control" id={`player-roll${suffix}`} min={1} placeholder="14"
              value={draft.roll} onChange={(event) => onField('roll', event.target.value)}
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`player-class${suffix}`}>Class</label>
            <select
              className="form-select" id={`player-class${suffix}`}
              value={draft.classLevel} onChange={(event) => onField('classLevel', event.target.value)}
            >
              {classOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`player-section${suffix}`}>Section</label>
            <select
              className="form-select" id={`player-section${suffix}`}
              value={draft.section} onChange={(event) => onField('section', event.target.value)}
            >
              {sectionOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`player-gender${suffix}`}>Gender</label>
            <select
              className="form-select" id={`player-gender${suffix}`}
              value={draft.gender} onChange={(event) => onField('gender', event.target.value)}
            >
              {genderOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-team${suffix}`}>Team</label>
            <select
              className="form-select" id={`player-team${suffix}`}
              value={draft.team} onChange={(event) => onField('team', event.target.value)}
            >
              {teamOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-coach${suffix}`}>Coach</label>
            <select
              className="form-select" id={`player-coach${suffix}`}
              value={draft.coach} onChange={(event) => onField('coach', event.target.value)}
            >
              <option value="">Select coach</option>
              {coachOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-position${suffix}`}>Playing Position</label>
            <input
              type="text" className="form-control" id={`player-position${suffix}`} placeholder="Striker"
              value={draft.position} onChange={(event) => onField('position', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-jersey${suffix}`}>Jersey Number</label>
            <input
              type="text" className="form-control" id={`player-jersey${suffix}`} placeholder="09"
              value={draft.jersey} onChange={(event) => onField('jersey', event.target.value)}
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`player-skill${suffix}`}>Skill Level</label>
            <select
              className="form-select" id={`player-skill${suffix}`}
              value={draft.skill} onChange={(event) => onField('skill', event.target.value)}
            >
              {skillOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`player-attendance${suffix}`}>Attendance (%)</label>
            <input
              type="number" className="form-control" id={`player-attendance${suffix}`}
              min={0} max={100} placeholder="94"
              value={draft.attendance} onChange={(event) => onField('attendance', event.target.value)}
            />
          </div></div>
          <div className="col-md-4"><div className="mb-3">
            <label className="form-label" htmlFor={`player-achievements${suffix}`}>Achievements</label>
            <input
              type="number" className="form-control" id={`player-achievements${suffix}`} min={0} placeholder="5"
              value={draft.achievements} onChange={(event) => onField('achievements', event.target.value)}
            />
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-medical${suffix}`}>Medical Clearance</label>
            <select
              className="form-select" id={`player-medical${suffix}`}
              value={draft.medical} onChange={(event) => onField('medical', event.target.value)}
            >
              {medicalOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-availability${suffix}`}>Availability</label>
            <select
              className="form-select" id={`player-availability${suffix}`}
              value={draft.availability} onChange={(event) => onField('availability', event.target.value)}
            >
              {availabilityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          {/*
            The template's third control is a Date of Join picker, which the
            redesigned page never prints. Academic Year takes its slot.
          */}
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-year${suffix}`}>Academic Year</label>
            <select
              className="form-select" id={`player-year${suffix}`}
              value={draft.academicYear} onChange={(event) => onField('academicYear', event.target.value)}
            >
              {academicYearOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div></div>
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor={`player-status${suffix}`}>Status</label>
            <select
              className="form-select" id={`player-status${suffix}`}
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
              type="checkbox" id={`player-active${suffix}`} className="check"
              checked={playing}
              onChange={(event) => onField('status', event.target.checked ? 'Active' : 'Suspended')}
            />
            <label htmlFor={`player-active${suffix}`} className="checktoggle"> </label>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const PlayerModals = ({
  active, row, deleteCount, onClose, onCreate, onUpdate, onAssignTeam, onAssignCoach,
  onSaveClearance, onAddAchievement, onImport, onDelete, onToast, onOpen,
}: PlayerModalsProps) => {
  const [draft, setDraft] = useState<PlayerDraft>(emptyDraft);
  const [teamChoice, setTeamChoice] = useState('');
  const [position, setPosition] = useState('');
  const [jersey, setJersey] = useState('');
  const [coach, setCoach] = useState('');
  const [medical, setMedical] = useState<MedicalStatus>('Cleared');
  const [lastCheckup, setLastCheckup] = useState('02/05/2024');
  const [nextReview, setNextReview] = useState('02/08/2024');
  const [notes, setNotes] = useState('');
  const [mode, setMode] = useState(importModes[0]);

  /** Each opening seeds from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'team' && row) {
      setTeamChoice(teamLabelOf(row));
      setPosition(row.position);
      setJersey(row.jersey);
    }
    if (active === 'coach' && row) setCoach(row.coach);
    if (active === 'medical' && row) {
      setMedical(row.medical);
      setLastCheckup('02/05/2024');
      setNextReview('02/08/2024');
      setNotes('');
    }
    if (active === 'import') setMode(importModes[0]);
  }, [active, row]);

  const field = (key: keyof PlayerDraft, value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const playerField = row ? playerFieldOf(row) : '';
  const fitness = row ? fitnessOf(row.medical) : null;
  /** The dialog's own fitness line follows the clearance being edited. */
  const draftFitness = fitnessOf(medical);
  const badges = row ? achievementBadgesOf(row) : [];

  return (
    <>
      {/* Add Player */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Player"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Player</button>
          </>
        }
      >
        <PlayerForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Player */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Player"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <PlayerForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Player */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title="Player Profile"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('team')}>Assign Team</button>
          </>
        }
      >
        {row && fitness ? (
          <>
            <div className="d-flex align-items-center mb-3">
              <span className="avatar avatar-lg me-2 flex-shrink-0">
                <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.name} />
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
                <h6 className="details-heading"><i className="ti ti-ball-football" />Sports Profile</h6>
                <p className="fs-13 mb-0">{shortProfileOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-chart-bar" />Performance</h6>
                <div className={`meter meter-${skillTint[row.skill]} mb-1`}>
                  <span style={{ width: `${skillWidth[row.skill]}%` }} />
                </div>
                <p className="fs-12 text-muted mb-0">{performanceLineOf(row)}</p>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-first-aid-kit" />Medical</h6>
                <div className="d-flex flex-wrap gap-1">
                  <span className={`badge badge-soft-${medicalTint[row.medical]}`}>
                    <i className={`${medicalIcon[row.medical]} me-1`} />{row.medical}
                  </span>
                  <span className={`badge badge-soft-${fitness.tint}`}>
                    <i className={`${fitness.icon} me-1`} />{fitness.label}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="details-heading"><i className="ti ti-trophy" />Achievements</h6>
                {badges.length === 0 ? (
                  <p className="fs-13 mb-0">No medals recorded yet.</p>
                ) : (
                  <div className="d-flex flex-wrap gap-1">
                    {badges.map((badge) => (
                      <span className="badge badge-soft-warning" key={badge}>{badge}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Team Assignment */}
      <Modal
        open={active === 'team' && row !== null}
        onClose={onClose}
        title="Team Assignment"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignTeam(teamChoice, position, jersey); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Team</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="player-2">Player</label>
            <input type="text" className="form-control" value={playerField} readOnly id="player-2" />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="sport-team">
              Sport / Team <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" required id="sport-team"
              value={teamChoice} onChange={(event) => setTeamChoice(event.target.value)}
            >
              <option value="">Select team</option>
              {teamChoices.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="playing-position">Playing Position</label>
            <input
              type="text" className="form-control" id="playing-position"
              value={position} onChange={(event) => setPosition(event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="jersey-number">Jersey Number</label>
            <input
              type="text" className="form-control" id="jersey-number"
              value={jersey} onChange={(event) => setJersey(event.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Coach Assignment */}
      <Modal
        open={active === 'coach' && row !== null}
        onClose={onClose}
        title="Coach Assignment"
        formClassName="validated-form"
        onSubmit={(event) => { event.preventDefault(); onAssignCoach(coach); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Assign Coach</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="player-3">Player</label>
            <input type="text" className="form-control" value={playerField} readOnly id="player-3" />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="coach-2">
              Coach <span className="text-danger">*</span>
            </label>
            <select
              className="form-select" required id="coach-2"
              value={coach} onChange={(event) => setCoach(event.target.value)}
            >
              <option value="">Select coach</option>
              {coachOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Performance Details */}
      <Modal
        open={active === 'performance' && row !== null}
        onClose={onClose}
        title="Performance Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button
              type="button" className="btn btn-primary"
              onClick={() => onToast(`Performance report downloaded for ${row?.name ?? 'the player'}`, 'info')}
            >
              <i className="ti ti-download me-1" />Download Report
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
              <i className="ti ti-chart-bar fs-16" />
              <span className="fs-13">{row.name} · {row.sport} · {row.team}</span>
            </div>
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Season</th>
                    <th className="text-end">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceOf(row).map((entry) => (
                    <tr key={entry.metric}>
                      <td>{entry.metric}</td>
                      <td>{entry.season}</td>
                      <td className={entry.badge ? 'text-end' : 'text-end fw-medium'}>
                        {entry.badge
                          ? <span className={`badge badge-soft-${entry.badge}`}>{entry.value}</span>
                          : entry.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Medical Clearance */}
      <Modal
        open={active === 'medical' && row !== null}
        onClose={onClose}
        title="Medical Clearance"
        formClassName="validated-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveClearance(medical, lastCheckup, nextReview, notes);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary form-submit">Save Clearance</button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-12">
            <label className="form-label" htmlFor="player-4">Player</label>
            <input type="text" className="form-control" value={playerField} readOnly id="player-4" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="fitness-status">Fitness Status</label>
            {/* Fitness is the clearance restated — it follows, it does not lead. */}
            <input
              type="text" className="form-control" id="fitness-status"
              value={draftFitness.label} readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="medical-clearance">Medical Clearance</label>
            <select
              className="form-select" id="medical-clearance"
              value={medical} onChange={(event) => setMedical(event.target.value as MedicalStatus)}
            >
              {medicalOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="last-checkup">Last Checkup</label>
            <DateField
              id="last-checkup" format="d/m/Y" withIcon
              value={lastCheckup} onChange={setLastCheckup}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="next-review">Next Review</label>
            <DateField
              id="next-review" format="d/m/Y" withIcon
              value={nextReview} onChange={setNextReview}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label" htmlFor="medical-notes">Medical Notes</label>
            <textarea
              className="form-control" rows={2} placeholder="Physician remarks" id="medical-notes"
              value={notes} onChange={(event) => setNotes(event.target.value)}
            />
          </div>
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
                <th>Event</th>
                <th>Year</th>
                <th className="text-end">Medal</th>
              </tr>
            </thead>
            <tbody>
              {(row ? achievementsOf(row) : []).map((entry, index) => (
                <tr key={`${entry.title}-${index}`}>
                  <td>{entry.title}</td>
                  <td>{entry.event}</td>
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
                  <td colSpan={4} className="text-center text-muted fs-13">No medals recorded yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Import Players */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import Players"
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
          <input type="file" aria-label="Players file" />
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
          onClick={() => onToast('Players import template downloaded', 'info')}
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
          You want to delete {deleteCount === 1 ? 'this player' : `all ${deleteCount} marked items`}, this
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

export default PlayerModals;
