import { Link } from 'react-router-dom';
import RoleGuard from '@components/routing/RoleGuard';
import { all_routes } from '@/routes/all_routes';
import type { SelectOption } from '@services/staff/staff.api';
import { WEEKLY_PERIOD_LIMIT } from '../teachingProfile';
import type { ProfileValues } from '../teachingProfile';

interface Props {
  value: ProfileValues;
  onChange: (next: ProfileValues) => void;
  subjectOptions: SelectOption[];
}

const TeachingProfileFields = ({ value, onChange, subjectOptions }: Props) => {
  const knownIds = new Set(subjectOptions.map((subject) => subject.value));
  const unavailable = [value.primary, ...value.additional]
    .filter((id) => id && !knownIds.has(id))
    .map((id) => ({ value: id, label: `Subject #${id} (unavailable)` }));
  const subjects = [...subjectOptions, ...unavailable];

  const choosePrimary = (id: string) =>
    onChange({ ...value, primary: id, additional: value.additional.filter((subjectId) => subjectId !== id) });

  const toggleAdditional = (id: string) =>
    onChange({
      ...value,
      additional: value.additional.includes(id)
        ? value.additional.filter((subjectId) => subjectId !== id)
        : [...value.additional, id],
    });

  return (
    <>
      <p className="text-muted fs-13 mb-3">
        The timetable planner uses these subjects to suggest teachers and checks the weekly maximum when generating a timetable.
      </p>
      <div className="row g-3">
        <div className="col-md-5">
          <label className="form-label" htmlFor="profile-primary">Primary subject</label>
          <select id="profile-primary" className="form-select" value={value.primary} onChange={(event) => choosePrimary(event.target.value)}>
            <option value="">Not set</option>
            {subjects.filter((subject) => knownIds.has(subject.value) || subject.value === value.primary).map((subject) => (
              <option key={subject.value} value={subject.value}>{subject.label}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="profile-max">Max periods per week</label>
          <input
            id="profile-max"
            className="form-control"
            inputMode="numeric"
            placeholder="No limit"
            value={value.max}
            onChange={(event) => onChange({ ...value, max: event.target.value })}
            aria-describedby="profile-max-hint"
          />
          <div id="profile-max-hint" className="form-text">1 to {WEEKLY_PERIOD_LIMIT}. Leave blank for no limit.</div>
        </div>
        <div className="col-12">
          <div className="form-label" id="profile-additional-label">Additional subjects</div>
          <div className="d-flex flex-wrap gap-2" role="group" aria-labelledby="profile-additional-label">
            {subjects.filter((subject) => subject.value !== value.primary).map((subject) => {
              const selected = value.additional.includes(subject.value);
              return (
                <button
                  key={subject.value}
                  type="button"
                  className={`btn btn-sm ${selected ? 'btn-primary' : 'btn-outline-light bg-white border'}`}
                  aria-pressed={selected}
                  onClick={() => toggleAdditional(subject.value)}
                >
                  {subject.label}
                </button>
              );
            })}
            {subjects.length === 0 ? <span className="text-muted fs-13">No subjects available.</span> : null}
          </div>
        </div>
      </div>
      <RoleGuard roles="admin" permission="timetable.edit">
        <div className="mt-3 fs-13">
          <Link to={all_routes.timetablePlanner}>Set days off in the timetable planner</Link>
        </div>
      </RoleGuard>
    </>
  );
};

export default TeachingProfileFields;
