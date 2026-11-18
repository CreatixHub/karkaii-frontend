/**
 * Loads one real student for the Student 360 profile page.
 *
 *   GET /api/students/:id     -> student row + guardians + admission summary
 *   GET /api/admissions/:id   -> the class (className) and previous school
 *
 * The page reads module-level data objects, so `applyStudent` overwrites them in
 * place (same approach as admissionDetails.live.ts). Anything the backend does
 * not have yet (attendance, fees, transport, hostel...) is left out, not faked.
 */

import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import {
  academicInformation,
  addressInfo,
  heroIdentity,
  heroRings,
  languages,
  medicalRows,
  overviewTiles,
  parentsAndGuardians,
  personalInformation,
  profileState,
  studentSummary,
} from './studentProfile.data';
import type { MetaRow, OverviewTile, ProfilePerson } from './studentProfile.data';

type Loose = Record<string, unknown>;

export interface ApiStudentDetail {
  id: string | number;
  admissionNo: string;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  dob?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  fatherName?: string | null;
  fatherPhone?: string | null;
  fatherEmail?: string | null;
  fatherOccupation?: string | null;
  motherName?: string | null;
  motherPhone?: string | null;
  motherEmail?: string | null;
  motherOccupation?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  houseName?: string | null;
  photoFileId?: string | number | null;
  status: string;
  admittedOn?: string | null;
  admission?: { id: string | number; applicationNo?: string } | null;
  guardians?: Loose[];
}

interface ApiAdmissionLite {
  className?: string | null;
  previousSchool?: string | null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const clean = (v: unknown): string => (v === null || v === undefined ? '' : String(v).trim());

const prettyDate = (iso?: string | null): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]} ${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}` : '';
};

const ageFrom = (iso?: string | null): string => {
  const born = new Date(iso ?? '');
  if (Number.isNaN(born.getTime())) return '';
  const now = new Date();
  let age = now.getFullYear() - born.getFullYear();
  const gap = now.getMonth() - born.getMonth();
  if (gap < 0 || (gap === 0 && now.getDate() < born.getDate())) age -= 1;
  return `${Math.max(age, 0)} Years`;
};

const genderLabel = (value?: string | null): string => {
  const g = clean(value).toLowerCase();
  if (['male', 'm', 'boy', 'man'].includes(g)) return 'Male';
  if (['female', 'f', 'girl', 'woman'].includes(g)) return 'Female';
  return g ? g.charAt(0).toUpperCase() + g.slice(1) : '';
};

const STATUS_UI: Record<string, { label: string; accent: string }> = {
  active: { label: 'Active', accent: 'accent-success' },
  inactive: { label: 'Inactive', accent: 'accent-danger' },
  alumni: { label: 'Graduated', accent: 'accent-info' },
  transferred_out: { label: 'Transferred', accent: 'accent-warning' },
  expelled: { label: 'Expelled', accent: 'accent-danger' },
};

/** Only rows that have a value are shown. */
const rows = (items: Array<[string, string, string?]>): MetaRow[] =>
  items.filter(([, value]) => value).map(([key, value, valueClass]) => ({ key, value, valueClass }));

export async function loadStudentProfile(id: string): Promise<{ student: ApiStudentDetail; admission: ApiAdmissionLite | null }> {
  const student = await apiClient.get<ApiStudentDetail>(endpoints.students.detail(id));

  let admission: ApiAdmissionLite | null = null;
  const admissionId = student.admission?.id;
  if (admissionId !== undefined && admissionId !== null) {
    try {
      admission = await apiClient.get<ApiAdmissionLite>(endpoints.admissions.detail(String(admissionId)));
    } catch {
      admission = null; // class simply stays empty
    }
  }
  return { student, admission };
}

export function applyStudent(s: ApiStudentDetail, admission: ApiAdmissionLite | null): void {
  const fullName = clean(s.fullName) || [s.firstName, s.lastName].filter(Boolean).join(' ') || '-';
  const className = clean(admission?.className);
  const house = clean(s.houseName);
  const blood = clean(s.bloodGroup);
  const gender = genderLabel(s.gender);
  const dob = prettyDate(s.dob);
  const age = ageFrom(s.dob);
  const admitted = prettyDate(s.admittedOn);
  const status = STATUS_UI[s.status] ?? { label: clean(s.status) || '-', accent: 'accent-primary' };

  const guardianRows = Array.isArray(s.guardians) ? s.guardians : [];
  const primary = guardianRows[0];
  const primaryPhone = clean(primary?.phone);

  profileState.live = true;
  Object.assign(studentSummary, {
    name: fullName,
    admissionNo: s.admissionNo,
    classLabel: className || '-',
    dob,
    bloodGroup: blood || '-',
    guardianName: clean(primary?.fullName) || clean(s.fatherName) || clean(s.motherName) || '-',
    guardianPhone: primaryPhone || clean(s.fatherPhone) || clean(s.motherPhone) || '-',
    guardianEmail: clean(primary?.email) || clean(s.fatherEmail) || clean(s.motherEmail) || '-',
    status: status.label,
  });

  const filled = [fullName, dob, gender, blood, className, house, s.addressLine1, primaryPhone || s.fatherPhone || s.motherPhone];
  Object.assign(heroIdentity, {
    name: fullName,
    photo: s.photoFileId ? `file:${s.photoFileId}` : 'assets/img/students/student-01.jpg',
    status,
    meta: [
      { icon: 'ti ti-id-badge-2', label: 'Admission', value: s.admissionNo },
      className ? { icon: 'ti ti-school', label: 'Class', value: className } : null,
      admitted ? { icon: 'ti ti-calendar', label: 'Admitted', value: admitted } : null,
      house ? { icon: 'ti ti-home', label: 'House', value: house } : null,
      blood ? { icon: 'ti ti-droplet', label: 'Blood', value: blood } : null,
    ].filter(Boolean),
    badges: [],
    completion: Math.round((filled.filter((v) => clean(v)).length / filled.length) * 100),
  });
  heroRings.splice(0, heroRings.length);

  const tiles: OverviewTile[] = [
    { id: 'status', accent: 'accent-success', icon: 'ti ti-circle-check', label: 'Status', value: status.label, sub: { icon: 'ti ti-id', text: s.admissionNo, className: '' } },
    { id: 'class', accent: 'accent-primary', icon: 'ti ti-school', label: 'Class', value: className || '-', sub: { icon: 'ti ti-home', text: house || 'No house assigned', className: '' } },
    { id: 'age', accent: 'accent-teal', icon: 'ti ti-cake', label: 'Age', value: age || '-', sub: { icon: 'ti ti-calendar', text: dob || 'DOB not set', className: '' } },
    { id: 'admitted', accent: 'accent-info', icon: 'ti ti-calendar-event', label: 'Admitted On', value: admitted || '-', sub: { icon: 'ti ti-user', text: gender || 'Gender not set', className: '' } },
  ];
  overviewTiles.splice(0, overviewTiles.length, ...tiles);

  personalInformation.splice(
    0,
    personalInformation.length,
    ...rows([
      ['Full Name', fullName],
      ['Date of Birth', dob],
      ['Age', age],
      ['Gender', gender],
      ['Blood Group', blood, 'text-danger'],
      ['Emergency', primaryPhone || clean(s.fatherPhone) || clean(s.motherPhone)],
    ]),
  );
  languages.splice(0, languages.length);
  addressInfo.value = [s.addressLine1, s.addressLine2, s.postalCode].map(clean).filter(Boolean).join(', ');

  academicInformation.splice(
    0,
    academicInformation.length,
    ...rows([
      ['Admission Date', admitted],
      ['Admission No', s.admissionNo],
      ['Class', className],
      ['House', house],
      ['Status', status.label],
      ['Previous School', clean(admission?.previousSchool)],
    ]),
  );

  medicalRows.splice(0, medicalRows.length, ...rows([['Blood Group', blood, 'text-danger']]));

  const people: ProfilePerson[] = guardianRows.map((g, index) => {
    const phone = clean(g.phone);
    const email = clean(g.email);
    const relation = clean(g.relationship) || clean(g.relation) || (index === 0 ? 'Guardian' : 'Guardian');
    const occupation = clean(g.occupation);
    return {
      id: `guardian-${String(g.id ?? index)}`,
      icon: 'ti ti-shield-check',
      name: clean(g.fullName) || clean(g.name) || 'Guardian',
      roles: [[relation, occupation].filter(Boolean).join(' · '), [phone, email].filter(Boolean).join(' · ')].filter(Boolean),
      actions: [],
    };
  });
  const known = new Set(people.map((p) => p.name.toLowerCase()));
  const parent = (role: string, name?: string | null, phone?: string | null, email?: string | null, job?: string | null) => {
    const n = clean(name);
    if (!n || known.has(n.toLowerCase())) return;
    known.add(n.toLowerCase());
    people.push({
      id: role.toLowerCase(),
      icon: 'ti ti-user',
      name: n,
      roles: [[role, clean(job)].filter(Boolean).join(' · '), [clean(phone), clean(email)].filter(Boolean).join(' · ')].filter(Boolean),
      actions: [],
    });
  };
  parent('Father', s.fatherName, s.fatherPhone, s.fatherEmail, s.fatherOccupation);
  parent('Mother', s.motherName, s.motherPhone, s.motherEmail, s.motherOccupation);
  parentsAndGuardians.splice(0, parentsAndGuardians.length, ...people);
}