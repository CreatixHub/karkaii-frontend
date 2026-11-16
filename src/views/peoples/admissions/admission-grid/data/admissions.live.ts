import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import type { AdmissionDetail, AdmissionRow, StatusTag } from './admissions.data';

/** One admission exactly as GET /api/admissions returns it (only the fields the grid uses). */
interface ApiAdmission {
  id: string | number;
  applicationNo: string;
  firstName: string;
  lastName: string;
  gender?: string | null;
  dob: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  className?: string | null;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string | null;
  previousSchool?: string | null;
  appliedOn: string;
  source: string;
  feePaid?: boolean;
  assignedToStaffName?: string | null;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 2026-07-02 -> 02 Jul 2026 */
function prettyDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  if (!m) return iso ?? '';
  return `${m[3]} ${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}`;
}

const SOURCE_LABEL: Record<string, string> = {
  walk_in: 'Walk-in',
  website: 'Website',
  referral: 'Referral',
  agent: 'Agent',
  event: 'Event',
  other: 'Other',
};

/** API status -> the grid's tab key + label. */
function statusOf(api: string): { key: string; label: string; badge: string } {
  switch (api) {
    case 'document_review':
    case 'shortlisted':
    case 'offered':
      return { key: 'review', label: 'Under Review', badge: 'badge-soft-primary' };
    case 'accepted':
      return { key: 'approved', label: 'Approved', badge: 'badge-soft-success' };
    case 'waitlisted':
      return { key: 'waitlisted', label: 'Waitlisted', badge: 'badge-soft-warning' };
    case 'rejected':
    case 'withdrawn':
      return { key: 'rejected', label: api === 'withdrawn' ? 'Withdrawn' : 'Rejected', badge: 'badge-soft-danger' };
    case 'enquiry':
    case 'applied':
    default:
      return { key: 'pending', label: 'Pending', badge: 'badge-soft-primary' };
  }
}

export function toAdmissionRow(a: ApiAdmission): AdmissionRow {
  const st = statusOf(a.status);
  const name = [a.firstName, a.lastName].filter(Boolean).join(' ');
  const source = SOURCE_LABEL[a.source] ?? a.source;
  const classApplied = a.className ?? '-';
  const status: StatusTag = { label: st.label, className: `is-${st.key}` };
  const gender = a.gender ?? '-';

  const detail = {
    gender,
    dob: prettyDate(a.dob),
    classApplied,
    academicYear: '-',
    source,
    parentName: a.guardianName,
    relationship: 'Guardian',
    mobile: a.guardianPhone,
    email: a.guardianEmail ?? a.email ?? '-',
    address: '-',
    status: { label: st.label, className: st.badge },
    interview: 'Not Scheduled',
    feeStatus: a.feePaid
      ? { label: 'Paid', className: 'badge-soft-success' }
      : { label: 'Unpaid', className: 'badge-soft-danger' },
    counselor: a.assignedToStaffName ?? 'Unassigned',
    previousSchool: a.previousSchool ?? '-',
    documents: [],
  } as AdmissionDetail;

  return {
    id: String(a.id),
    name,
    avatar: 'assets/img/students/student-01.jpg',
    admissionNo: a.applicationNo,
    gender,
    statusKey: st.key,
    status,
    classApplied,
    parentName: a.guardianName,
    parentAvatar: 'assets/img/profiles/avatar-27.jpg',
    parentPhone: a.guardianPhone,
    appliedDate: prettyDate(a.appliedOn),
    source,
    search: [name, a.applicationNo, classApplied, a.guardianName, st.label, a.guardianPhone, source]
      .join(' ')
      .toLowerCase(),
    detail,
  };
}

/** Loads the real admissions (the API allows up to 100 per page; paging is done in the grid for now). */
export async function loadAdmissionRows(): Promise<AdmissionRow[]> {
  const rows = await apiClient.get<ApiAdmission[]>(endpoints.admissions.list, { query: { limit: 100 } });
  return rows.map(toAdmissionRow);
}