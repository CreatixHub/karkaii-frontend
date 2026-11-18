import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';

/**
 * TEMPORARY: the backend has no academic_years table yet, so every table just stores a number.
 * Replace this with a real year id when the academic years module exists.
 */
export const ACADEMIC_YEAR_ID = 1;

export interface ClassOption {
  id: string;
  name: string;
}

export interface CreateAdmissionPayload {
  academicYearId: number;
  classId: string;
  firstName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  gender?: string;
  bloodGroup?: string;
  phone?: string; // the student's own phone: becomes the login username
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string;
  addressLine1?: string;
  needsTransport?: boolean;
  previousSchool?: string;
  previousClass?: string;
  photoFileId?: string; // an uploaded photo (see services/files)
  source: 'walk_in' | 'website' | 'referral' | 'agent' | 'event' | 'other';
}

export interface AcceptResult {
  id: string;
  status: string;
  login?: { username: string; password: string };
  student?: { id: string; admissionNo: string };
}

export function listClasses(): Promise<ClassOption[]> {
  return apiClient.get<ClassOption[]>(endpoints.classes.list, { query: { limit: 100 } });
}

export function createAdmission(payload: CreateAdmissionPayload) {
  return apiClient.post<{ id: string; applicationNo: string }>(endpoints.admissions.create, payload);
}

export function acceptAdmission(id: string) {
  return apiClient.post<AcceptResult>(endpoints.admissions.accept(id), {});
}

/** Accepts YYYY-MM-DD, DD-MM-YYYY or DD/MM/YYYY and returns YYYY-MM-DD ('' if unreadable). */
export function toIsoDate(input: string): string {
  const s = input.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return '';
}

const SOURCE_MAP: Record<string, CreateAdmissionPayload['source']> = {
  'Walk-in': 'walk_in',
  Online: 'website',
  Website: 'website',
  Referral: 'referral',
  Campaign: 'other',
};

/** Form values (keyed by field id) -> API body. Returns an error message if something required is missing. */
export function buildAdmissionPayload(
  v: Record<string, string>,
  classes: ClassOption[],
): { payload?: CreateAdmissionPayload; error?: string } {
  const missing: string[] = [];
  const get = (id: string) => (v[id] ?? '').trim();
  const clean = (s: string) => (s && s !== 'Select' ? s : undefined);

  const cls = classes.find((c) => c.name === get('class-applied'));
  const dob = toIsoDate(get('date-of-birth'));

  if (!get('first-name')) missing.push('First name');
  if (!get('last-name')) missing.push('Last name');
  if (!dob) missing.push('Date of birth');
  if (!cls) missing.push('Class applied');
  if (!get('parent-guardian-name')) missing.push('Parent / guardian name');
  if (!get('phone')) missing.push('Guardian phone');
  if (missing.length) return { error: `Please fill: ${missing.join(', ')}` };

  return {
    payload: {
      academicYearId: ACADEMIC_YEAR_ID,
      classId: cls!.id,
      firstName: get('first-name'),
      lastName: get('last-name'),
      dob,
      gender: clean(get('gender')),
      bloodGroup: clean(get('blood-group')),
      phone: get('student-phone') || undefined,
      guardianName: get('parent-guardian-name'),
      guardianPhone: get('phone'),
      guardianEmail: get('email') || undefined,
      addressLine1: get('address') || undefined,
      needsTransport: get('transport-required') === 'Yes',
      previousSchool: get('school-name') || get('previous-school') || undefined,
      previousClass: get('last-class-attended') || get('previous-class') || undefined,
      source: SOURCE_MAP[get('application-source')] ?? 'walk_in',
    },
  };
}