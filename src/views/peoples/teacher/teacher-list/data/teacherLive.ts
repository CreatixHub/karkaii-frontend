import type { StaffListItem } from '@services/staff/staff.list';
import type { MeterVariant, Teacher } from './teachers.data';

// Teacher photos are not stored yet (the upload on the form is not wired), so every row uses this one
// placeholder picture. It is not data, only an image until real photos exist.
const PLACEHOLDER_AVATAR = 'assets/img/teachers/teacher-01.jpg';

const DASH = '—';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 2024-03-25 -> 25 Mar 2024
function formatDate(iso: string | null | undefined): string {
  if (!iso) return DASH;
  const [y, m, d] = iso.slice(0, 10).split('-');
  const month = MONTHS[Number(m) - 1];
  return month ? `${Number(d)} ${month} ${y}` : DASH;
}

const EMPLOYMENT_LABEL: Record<string, string> = {
  full_time: 'Full time',
  part_time: 'Part time',
  contract: 'Contract',
  visiting: 'Visiting',
};

function experienceLabel(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return DASH;
  const years = Number(value);
  return Number.isFinite(years) ? `${years} yrs` : DASH;
}

// The "Class Load" bar: how many sections this teacher is mapped to (10 or more = full bar).
function load(sectionCount: number): { variant: MeterVariant; width: string } {
  const pct = Math.min(100, sectionCount * 10);
  const variant: MeterVariant = pct >= 80 ? 'meter-danger' : pct >= 50 ? 'meter-warning' : 'meter-success';
  return { variant, width: `${pct}%` };
}

/** One row of GET /api/staff -> one row of the teacher list. */
export function toTeacher(s: StaffListItem): Teacher {
  const name = s.fullName || [s.firstName, s.lastName].filter(Boolean).join(' ') || DASH;
  const classes = s.teaching.classes;
  const subjects = s.teaching.subjects;
  const meter = load(s.teaching.sections.length);

  const classText = classes.length > 0 ? classes.join(', ') : DASH;
  const subjectText = subjects.length > 0 ? subjects.join(', ') : DASH;
  const status = s.status === 'active' ? 'Active' : 'Inactive';

  return {
    key: String(s.id),
    id: s.employeeNo,
    name,
    avatar: PLACEHOLDER_AVATAR,
    status,
    classes: classText,
    subject: subjectText,
    email: s.email || DASH,
    phone: s.phone || DASH,
    dateOfJoin: formatDate(s.joinedOn),
    search: [name, s.employeeNo, classText, subjectText, s.email ?? '', status].join(' ').toLowerCase(),
    detail: {
      address: s.addressLine1 || DASH,
      subjects,
      classesHandled: s.teaching.sections.length > 0 ? s.teaching.sections.join(', ') : DASH,
      loadVariant: meter.variant,
      loadWidth: meter.width,
      loadLabel:
        s.teaching.sections.length > 0
          ? `${s.teaching.sections.length} section${s.teaching.sections.length === 1 ? '' : 's'} assigned`
          : 'No sections assigned yet',
      qualification: s.qualification || DASH,
      experience: experienceLabel(s.experienceYears),
      note: EMPLOYMENT_LABEL[s.employmentType] ?? DASH,
    },
  };
}