import type { StaffListItem } from '@services/staff/staff.list';
import type { TeacherCard } from './teachers.data';

const DASH = '—';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const EMPLOYMENT: Record<string, { label: string; className: string }> = {
  full_time: { label: 'Full Time', className: 'badge-soft-info' },
  part_time: { label: 'Part Time', className: 'badge-soft-warning' },
  contract: { label: 'Contract', className: 'badge-soft-primary' },
  visiting: { label: 'Visiting', className: 'badge-soft-info' },
};

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return DASH;
  const [y, m, d] = iso.slice(0, 10).split('-');
  const month = MONTHS[Number(m) - 1];
  return month ? `${Number(d)} ${month} ${y}` : DASH;
}

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '?';

const text = (v: string | null | undefined) => (v && v.trim() !== '' ? v.trim() : DASH);

/** One row of GET /api/staff -> one card of the Teacher Directory. */
export function toTeacherCard(s: StaffListItem): TeacherCard {
  const name = s.fullName || [s.firstName, s.lastName].filter(Boolean).join(' ') || DASH;
  const classNames = s.teaching.classes;
  const subjectNames = s.teaching.subjects;
  const status = s.status === 'active' ? 'Active' : 'Inactive';

  const years = Number(s.experienceYears);
  const hasYears = s.experienceYears !== null && s.experienceYears !== undefined && Number.isFinite(years);

  const classesText = classNames.length > 0 ? classNames.join(', ') : DASH;
  const subjectText = subjectNames.length > 0 ? subjectNames.join(', ') : DASH;

  const joinedYear = s.joinedOn ? Number(s.joinedOn.slice(0, 4)) : NaN;

  return {
    key: String(s.id),
    id: s.employeeNo,
    name,
    initials: initialsOf(name),
    status,
    statusBadge: status === 'Active' ? 'badge-soft-success' : 'badge-soft-danger',
    employment: EMPLOYMENT[s.employmentType] ?? { label: DASH, className: 'badge-soft-info' },
    qualification: text(s.qualification),
    subject: subjectText,
    subjectNames,
    classes: classesText,
    classNames,
    sections: s.teaching.sections,
    phone: text(s.phone),
    email: text(s.email),
    experience: hasYears ? `${years} yrs` : DASH,
    address: text(s.addressLine1),
    joined: fmtDate(s.joinedOn),
    joinedYear: Number.isFinite(joinedYear) ? joinedYear : null,
    search: [name, s.employeeNo, classesText, subjectText, s.email ?? '', s.phone ?? '', status]
      .join(' ')
      .toLowerCase(),
  };
}