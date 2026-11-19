/**
 * Loads one real student and turns it into the Edit Student form's values
 * (keyed by the field ids in studentForm.data.ts).
 *
 *   GET /api/students/:id    -> student row + guardians + admission summary
 *   GET /api/admissions/:id  -> class name and previous school
 */

import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';

type Loose = Record<string, unknown>;

interface ApiStudent {
  admissionNo: string;
  firstName: string;
  lastName: string;
  dob?: string | null;
  gender?: string | null;
  bloodGroup?: string | null;
  socialCategory?: string | null;
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
  status: string;
  admittedOn?: string | null;
  admission?: { id: string | number } | null;
  guardians?: Loose[];
}

interface ApiAdmission {
  className?: string | null;
  previousSchool?: string | null;
}

const clean = (v: unknown): string => (v === null || v === undefined ? '' : String(v).trim());

/** `2024-03-18` -> `18-03-2024` (the format the form's date fields use). */
const toFormDate = (iso?: string | null): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
};

const capital = (v: string): string => (v ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : '');

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  alumni: 'Alumni',
  transferred_out: 'Transferred',
  expelled: 'Expelled',
};

export async function loadStudentFormValues(id: string): Promise<Record<string, string>> {
  const s = await apiClient.get<ApiStudent>(endpoints.students.detail(id));

  let admission: ApiAdmission | null = null;
  if (s.admission?.id !== undefined && s.admission?.id !== null) {
    try {
      admission = await apiClient.get<ApiAdmission>(endpoints.admissions.detail(String(s.admission.id)));
    } catch {
      admission = null;
    }
  }

  const g = Array.isArray(s.guardians) ? s.guardians[0] : undefined;
  const address = [s.addressLine1, s.addressLine2, s.postalCode].map(clean).filter(Boolean).join(', ');

  const values: Record<string, string> = {
    'admission-number': clean(s.admissionNo),
    'admission-date': toFormDate(s.admittedOn),
    status: STATUS_LABEL[s.status] ?? capital(clean(s.status)),
    'first-name': clean(s.firstName),
    'last-name': clean(s.lastName),
    class: clean(admission?.className).replace(/^class\s+/i, ''),
    gender: capital(clean(s.gender)),
    'date-of-birth': toFormDate(s.dob),
    'blood-group': clean(s.bloodGroup),
    house: clean(s.houseName),
    category: clean(s.socialCategory),
    'father-name': clean(s.fatherName),
    email: clean(s.fatherEmail),
    'phone-number': clean(s.fatherPhone),
    'father-occupation': clean(s.fatherOccupation),
    'mother-name': clean(s.motherName),
    'email-2': clean(s.motherEmail),
    'phone-number-2': clean(s.motherPhone),
    'mother-occupation': clean(s.motherOccupation),
    'guardian-name': clean(g?.fullName) || clean(g?.name),
    'guardian-relation': clean(g?.relationship) || clean(g?.relation),
    'phone-number-3': clean(g?.phone),
    'email-3': clean(g?.email),
    occupation: clean(g?.occupation),
    'current-address': address,
    'school-name': clean(admission?.previousSchool),
  };

  // Drop empty entries so untouched fields stay blank.
  return Object.fromEntries(Object.entries(values).filter(([, v]) => v));
}

/* ----------------------------------- Saving ---------------------------------- */

/** The dropdowns show "Select" when empty; treat it as no value. */
const norm = (value?: string): string => {
  const v = (value ?? '').trim();
  return v === 'Select' ? '' : v;
};

/** Form field id -> backend field, for text fields saved as typed (empty -> null). */
const TEXT_FIELDS: Record<string, string> = {
  gender: 'gender',
  'blood-group': 'bloodGroup',
  category: 'socialCategory',
  'father-name': 'fatherName',
  'phone-number': 'fatherPhone',
  email: 'fatherEmail',
  'father-occupation': 'fatherOccupation',
  'mother-name': 'motherName',
  'phone-number-2': 'motherPhone',
  'email-2': 'motherEmail',
  'mother-occupation': 'motherOccupation',
};

const STATUS_VALUE: Record<string, string> = { Active: 'active', Inactive: 'inactive' };

/** `18-03-2024` or `18/03/2024` -> `2024-03-18`; '' when it is not a date. */
const toIsoDate = (value: string): string => {
  const m = /^(\d{2})[-/](\d{2})[-/](\d{4})$/.exec(value.trim());
  return m ? `${m[3]}-${m[2]}-${m[1]}` : '';
};

/**
 * Compares the form with what was loaded and returns only the changed fields,
 * ready for `PATCH /api/students/:id`. Throws a readable Error for bad input.
 */
export function buildStudentPatch(
  original: Record<string, string>,
  current: Record<string, string>,
): Record<string, unknown> {
  const changed = (id: string) => norm(current[id]) !== norm(original[id]);
  const patch: Record<string, unknown> = {};

  for (const [id, label] of [
    ['first-name', 'First name'],
    ['last-name', 'Last name'],
  ] as const) {
    if (!changed(id)) continue;
    const value = (current[id] ?? '').trim();
    if (!value) throw new Error(`${label} is required`);
    patch[id === 'first-name' ? 'firstName' : 'lastName'] = value;
  }

  for (const [id, label, field] of [
    ['date-of-birth', 'Date of birth', 'dob'],
    ['admission-date', 'Admission date', 'admittedOn'],
  ] as const) {
    if (!changed(id)) continue;
    const iso = toIsoDate(current[id] ?? '');
    if (!iso) throw new Error(`${label} must be a valid date (DD-MM-YYYY)`);
    patch[field] = iso;
  }

  if (changed('status')) {
    const status = STATUS_VALUE[(current.status ?? '').trim()];
    if (status) patch.status = status;
  }

  for (const [id, field] of Object.entries(TEXT_FIELDS)) {
    if (!changed(id)) continue;
    const value = (current[id] ?? '').trim();
    patch[field] = value === '' ? null : value;
  }

  if (changed('current-address')) {
    const value = (current['current-address'] ?? '').trim();
    patch.addressLine1 = value === '' ? null : value;
    patch.addressLine2 = null;
    patch.postalCode = null;
  }

  return patch;
}

export async function saveStudent(id: string, patch: Record<string, unknown>): Promise<void> {
  await apiClient.patch<unknown>(endpoints.students.update(id), patch);
}

const SAVEABLE = new Set([
  'first-name', 'last-name', 'date-of-birth', 'admission-date', 'status', 'current-address',
  ...Object.keys(TEXT_FIELDS),
]);

/** Fields that were edited but have nowhere to be saved yet (class, section, house...). */
export function unsavedFieldNames(
  original: Record<string, string>,
  current: Record<string, string>,
): string[] {
  const ids = new Set([...Object.keys(original), ...Object.keys(current)]);
  return Array.from(ids)
    .filter((id) => !SAVEABLE.has(id) && norm(current[id]) !== norm(original[id]))
    .map((id) => id.replace(/-\d+$/, '').replace(/-/g, ' '));
}