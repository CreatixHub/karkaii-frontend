export const DASH = '—';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** GET /api/staff/:id (sensitive numbers are never returned, only yes/no flags). */
export interface StaffDetail {
  id: string | number;
  employeeNo: string;
  firstName: string;
  lastName?: string | null;
  fullName?: string | null;
  dob?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  maritalStatus?: string | null;
  fatherName?: string | null;
  email?: string | null;
  phone?: string | null;
  altPhone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  permanentAddressLine1?: string | null;
  permanentAddressLine2?: string | null;
  permanentPostalCode?: string | null;
  joinedOn?: string | null;
  confirmedOn?: string | null;
  qualification?: string | null;
  experienceYears?: string | number | null;
  epfNo?: string | null;
  bankAccountName?: string | null;
  bankName?: string | null;
  bankBranch?: string | null;
  bankIfsc?: string | null;
  socialLinks?: Record<string, string> | null;
  staffType: string;
  employmentType: string;
  status: string;
  hasNationalId?: boolean;
  hasPan?: boolean;
  hasBankAccount?: boolean;
}

/** The parts of an assignment row this page uses. */
export interface AssignmentLite {
  className?: string;
  sectionName?: string;
  subject?: { name?: string };
}

export interface LiveProfile {
  id: string;
  employeeNo: string;
  name: string;
  initials: string;
  statusLabel: string;
  statusClass: string;
  email: string;
  phone: string;
  altPhone: string;
  hasEmail: boolean;
  hasPhone: boolean;
  dob: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  fatherName: string;
  qualification: string;
  experience: string;
  joinedOn: string;
  confirmedOn: string;
  employmentType: string;
  staffType: string;
  address: string;
  permanentAddress: string;
  sectionsText: string;
  subjectsText: string;
  sectionCount: number;
  subjectCount: number;
  idOnFile: string;
  epfNo: string;
  bankAccountName: string;
  bankName: string;
  bankBranch: string;
  bankIfsc: string;
  bankAccount: string;
  social: { label: string; value: string }[];
}

const val = (v: string | number | null | undefined): string =>
  v === null || v === undefined || String(v).trim() === '' ? DASH : String(v).trim();

const cap = (v: string | null | undefined): string => {
  const t = val(v);
  return t === DASH ? DASH : t.charAt(0).toUpperCase() + t.slice(1);
};

// 2024-03-25 -> 25 Mar 2024
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return DASH;
  const [y, m, d] = iso.slice(0, 10).split('-');
  const month = MONTHS[Number(m) - 1];
  return month ? `${Number(d)} ${month} ${y}` : DASH;
}

const EMPLOYMENT: Record<string, string> = {
  full_time: 'Full time',
  part_time: 'Part time',
  contract: 'Contract',
  visiting: 'Visiting',
};

const STAFF_TYPE: Record<string, string> = { teaching: 'Teaching', non_teaching: 'Non-teaching' };

const STATUS: Record<string, { label: string; cls: string }> = {
  active: { label: 'Active', cls: 'badge-soft-success' },
  on_leave: { label: 'On leave', cls: 'badge-soft-warning' },
  suspended: { label: 'Suspended', cls: 'badge-soft-danger' },
  left: { label: 'Left', cls: 'badge-soft-danger' },
};

const unique = (items: (string | undefined | null)[]): string[] =>
  Array.from(new Set(items.filter((i): i is string => !!i && i.trim() !== '')));

const join = (parts: (string | null | undefined)[]): string => {
  const text = parts.filter((p) => p && p.trim() !== '').join(', ');
  return text || DASH;
};

export function initialsOf(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

export function buildProfile(s: StaffDetail, assignments: AssignmentLite[]): LiveProfile {
  const name = s.fullName || [s.firstName, s.lastName].filter(Boolean).join(' ') || DASH;
  const status = STATUS[s.status] ?? { label: cap(s.status), cls: 'badge-soft-warning' };

  const sections = unique(assignments.map((a) => (a.className ? `${a.className} - ${a.sectionName ?? ''}`.trim() : null)));
  const subjects = unique(assignments.map((a) => a.subject?.name));

  const years = Number(s.experienceYears);
  const social = Object.entries(s.socialLinks ?? {})
    .filter(([, v]) => v)
    .map(([label, value]) => ({ label: cap(label), value }));

  return {
    id: String(s.id),
    employeeNo: s.employeeNo,
    name,
    initials: initialsOf(name),
    statusLabel: status.label,
    statusClass: status.cls,
    email: val(s.email),
    phone: val(s.phone),
    altPhone: val(s.altPhone),
    hasEmail: !!s.email,
    hasPhone: !!s.phone,
    dob: fmtDate(s.dob),
    gender: cap(s.gender),
    bloodGroup: val(s.bloodGroup),
    maritalStatus: cap(s.maritalStatus),
    fatherName: val(s.fatherName),
    qualification: val(s.qualification),
    experience: s.experienceYears !== null && s.experienceYears !== undefined && Number.isFinite(years) ? `${years} yrs` : DASH,
    joinedOn: fmtDate(s.joinedOn),
    confirmedOn: fmtDate(s.confirmedOn),
    employmentType: EMPLOYMENT[s.employmentType] ?? cap(s.employmentType),
    staffType: STAFF_TYPE[s.staffType] ?? cap(s.staffType),
    address: join([s.addressLine1, s.addressLine2, s.postalCode]),
    permanentAddress: join([s.permanentAddressLine1, s.permanentAddressLine2, s.permanentPostalCode]),
    sectionsText: sections.length > 0 ? sections.join(', ') : DASH,
    subjectsText: subjects.length > 0 ? subjects.join(', ') : DASH,
    sectionCount: sections.length,
    subjectCount: subjects.length,
    idOnFile: s.hasPan || s.hasNationalId ? 'On file' : DASH,
    epfNo: val(s.epfNo),
    bankAccountName: val(s.bankAccountName),
    bankName: val(s.bankName),
    bankBranch: val(s.bankBranch),
    bankIfsc: val(s.bankIfsc),
    bankAccount: s.hasBankAccount ? 'On file' : DASH,
    social,
  };
}