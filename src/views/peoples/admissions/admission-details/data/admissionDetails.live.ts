import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import {
  academicDetails,
  activityHistory,
  admissionTimeline,
  documentCards,
  emergencyDetails,
  feeSummary,
  guardians,
  hostelDetails,
  medicalDetails,
  notes,
  overview,
  personalDetails,
  previousSchoolDetails,
  profile,
  setMedicalDoctorContact,
  setPersonalAddress,
  summaryCards,
  transportDetails,
} from './admissionDetails.data';

/* Types are taken from the data arrays themselves, so they always match the data file. */
type Item<T> = T extends readonly (infer U)[] ? U : never;
type DetailField = Item<typeof personalDetails>;
type GuardianCard = Item<typeof guardians>;
type TimelineEntry = Item<typeof admissionTimeline>;
type ActivityEntry = Item<typeof activityHistory>;

interface ApiHistory {
  id: string | number;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  changedByName: string | null;
  createdAt: string;
}

/** GET /api/admissions/:id */
export interface ApiAdmissionDetail {
  id: string | number;
  applicationNo: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender?: string | null;
  email?: string | null;
  phone?: string | null;
  bloodGroup?: string | null;
  fatherName?: string | null;
  fatherPhone?: string | null;
  fatherEmail?: string | null;
  fatherOccupation?: string | null;
  motherName?: string | null;
  motherPhone?: string | null;
  motherEmail?: string | null;
  motherOccupation?: string | null;
  guardianName: string;
  guardianPhone: string;
  guardianEmail?: string | null;
  previousSchool?: string | null;
  previousClass?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  status: string;
  appliedOn: string;
  decisionNotes?: string | null;
  needsTransport?: boolean;
  needsHostel?: boolean;
  applicationFee?: string | number | null;
  feePaid?: boolean;
  source: string;
  className?: string | null;
  assignedToStaffName?: string | null;
  history?: ApiHistory[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dash = (v: unknown): string => {
  const s = v === null || v === undefined ? '' : String(v).trim();
  return s ? s : '-';
};

const pretty = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]} ${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}` : dash(iso);
};

const when = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return dash(iso);
  return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const humanize = (s: string): string => {
  const t = s.replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const SOURCE_LABEL: Record<string, string> = {
  walk_in: 'Walk-in',
  website: 'Website',
  referral: 'Referral',
  agent: 'Agent',
  event: 'Event',
  other: 'Other',
};

function statusBadge(api: string): { label: string; className: string } {
  switch (api) {
    case 'accepted':
      return { label: 'Approved', className: 'badge-soft-success' };
    case 'rejected':
      return { label: 'Rejected', className: 'badge-soft-danger' };
    case 'withdrawn':
      return { label: 'Withdrawn', className: 'badge-soft-danger' };
    case 'waitlisted':
      return { label: 'Waitlisted', className: 'badge-soft-warning' };
    case 'document_review':
    case 'shortlisted':
    case 'offered':
      return { label: 'Under Review', className: 'badge-soft-primary' };
    default:
      return { label: 'Pending', className: 'badge-soft-warning' };
  }
}

/** The first password of a new student login: DD-MM-YYYY of the date of birth. */
export function dobPasswordText(dob: string): string {
  const [y, m, d] = (dob ?? '').split('-');
  return y && m && d ? `${d}-${m}-${y}` : '';
}

function replace<T>(target: T[], items: T[]) {
  target.splice(0, target.length, ...items);
}

export function loadAdmissionDetail(id: string): Promise<ApiAdmissionDetail> {
  return apiClient.get<ApiAdmissionDetail>(endpoints.admissions.detail(id));
}

/** Overwrites the page's data objects (in place) with one real application. */
export function applyAdmission(a: ApiAdmissionDetail): void {
  const st = statusBadge(a.status);
  const fullName = [a.firstName, a.lastName].filter(Boolean).join(' ');
  const dob = pretty(a.dob);
  const applied = pretty(a.appliedOn);
  const counselor = a.assignedToStaffName ?? 'Unassigned';
  const feeLabel = a.feePaid ? 'Paid' : 'Unpaid';

  Object.assign(profile, {
    name: fullName,
    admissionNo: a.applicationNo,
    status: st,
    classApplied: dash(a.className),
    academicYear: '-',
    appliedDate: applied,
    parentName: a.guardianName,
    parentPhone: a.guardianPhone,
  });

  for (const card of summaryCards as unknown as Array<Record<string, unknown>>) {
    switch (card.id) {
      case 'status':
        card.value = st.label;
        card.valueClassName = st.className;
        break;
      case 'stage':
        card.value = humanize(a.status);
        break;
      case 'fee':
        card.value = feeLabel;
        card.valueClassName = a.feePaid ? 'badge-soft-success' : 'badge-soft-danger';
        break;
      case 'interview':
        card.value = 'Not Scheduled';
        break;
      case 'documents':
        card.value = 'None uploaded';
        break;
      case 'counselor':
        card.value = counselor;
        break;
      default:
        break;
    }
  }

  const filled = [a.dob, a.gender, a.phone, a.bloodGroup, a.addressLine1, a.previousSchool, a.guardianPhone, a.className, a.email];
  Object.assign(overview, {
    completeness: Math.round((filled.filter((v) => v && String(v).trim()).length / filled.length) * 100),
    basics: [
      { label: 'Class Applied', value: dash(a.className) },
      { label: 'Academic Year', value: '-' },
      { label: 'Gender', value: dash(a.gender) },
      { label: 'Date of Birth', value: dob },
      { label: 'Applied On', value: applied },
      { label: 'Assigned Staff', value: counselor },
    ],
  });

  replace<DetailField>(personalDetails, [
    { label: 'First Name', value: dash(a.firstName) },
    { label: 'Last Name', value: dash(a.lastName) },
    { label: 'Gender', value: dash(a.gender) },
    { label: 'Date of Birth', value: dob },
    { label: 'Blood Group', value: dash(a.bloodGroup) },
    { label: 'Student Phone (login username)', value: dash(a.phone) },
    { label: 'Email', value: dash(a.email) },
  ] as DetailField[]);
  setPersonalAddress([a.addressLine1, a.addressLine2, a.postalCode].filter((v) => v && String(v).trim()).join(', ') || '-');

  replace<DetailField>(academicDetails, [
    { label: 'Class Applied', value: dash(a.className) },
    { label: 'Application No', value: a.applicationNo },
    { label: 'Source', value: SOURCE_LABEL[a.source] ?? dash(a.source) },
    { label: 'Academic Year', value: '-' },
  ] as DetailField[]);

  replace<DetailField>(medicalDetails, [
    { label: 'Blood Group', value: dash(a.bloodGroup) },
    { label: 'Allergies', value: '-' },
    { label: 'Medical Conditions', value: '-' },
    { label: 'Medications', value: '-' },
  ] as DetailField[]);
  setMedicalDoctorContact('-');

  const cards: GuardianCard[] = [
    {
      name: a.guardianName,
      role: 'Guardian',
      avatar: 'assets/img/profiles/avatar-27.jpg',
      phone: a.guardianPhone,
      email: dash(a.guardianEmail),
      occupation: '-',
    },
  ] as GuardianCard[];
  if (a.fatherName) {
    cards.push({
      name: a.fatherName,
      role: 'Father',
      avatar: 'assets/img/profiles/avatar-27.jpg',
      phone: dash(a.fatherPhone),
      email: dash(a.fatherEmail),
      occupation: dash(a.fatherOccupation),
    } as GuardianCard);
  }
  if (a.motherName) {
    cards.push({
      name: a.motherName,
      role: 'Mother',
      avatar: 'assets/img/profiles/avatar-23.jpg',
      phone: dash(a.motherPhone),
      email: dash(a.motherEmail),
      occupation: dash(a.motherOccupation),
    } as GuardianCard);
  }
  replace<GuardianCard>(guardians, cards);

  replace<DetailField>(emergencyDetails, [
    { label: 'Contact Name', value: a.guardianName },
    { label: 'Relationship', value: 'Guardian' },
    { label: 'Phone', value: a.guardianPhone },
    { label: 'Alternate Phone', value: '-' },
  ] as DetailField[]);

  replace<DetailField>(transportDetails, [
    { label: 'Transport Required', value: a.needsTransport ? 'Yes' : 'No' },
    { label: 'Route', value: '-' },
    { label: 'Pickup Point', value: '-' },
    { label: 'Vehicle', value: '-' },
  ] as DetailField[]);

  replace<DetailField>(hostelDetails, [
    { label: 'Hostel Required', value: a.needsHostel ? 'Yes' : 'No' },
    { label: 'Hostel Name', value: '-' },
    { label: 'Room Type', value: '-' },
  ] as DetailField[]);

  replace<DetailField>(previousSchoolDetails, [
    { label: 'School Name', value: dash(a.previousSchool) },
    { label: 'Board', value: '-' },
    { label: 'Last Class', value: dash(a.previousClass) },
    { label: 'TC Number', value: '-' },
  ] as DetailField[]);

  documentCards.splice(0, documentCards.length);

  const fee = a.applicationFee !== null && a.applicationFee !== undefined ? Number(a.applicationFee) : null;
  Object.assign(feeSummary, {
    total: fee === null ? '-' : fee.toFixed(2),
    paid: fee === null ? '-' : a.feePaid ? fee.toFixed(2) : '0.00',
    balance: fee === null ? '-' : a.feePaid ? '0.00' : fee.toFixed(2),
  });

  const hist = a.history ?? [];
  const timeline = hist.map((h) => ({
    title: h.fromStatus ? `Status: ${humanize(h.toStatus)}` : 'Application Submitted',
    meta: `by ${h.changedByName ?? 'System'} - ${when(h.createdAt)}`,
    icon: 'ti ti-check',
    tone: 'success',
  })) as unknown as TimelineEntry[];
  if (a.status !== 'accepted') {
    timeline.push({ title: 'Enrollment', meta: 'Pending', icon: 'ti ti-user-check', tone: 'pending' } as unknown as TimelineEntry);
  }
  replace<TimelineEntry>(admissionTimeline, timeline);

  notes.splice(
    0,
    notes.length,
    ...((a.decisionNotes
      ? [{ avatar: 'assets/img/profiles/avatar-27.jpg', text: a.decisionNotes, meta: 'Decision note' }]
      : []) as unknown as typeof notes),
  );

  replace<ActivityEntry>(
    activityHistory,
    [...hist].reverse().map((h) => ({
      icon: 'ti ti-activity',
      iconAccent: 'bg-soft-primary',
      title: h.note ? `${humanize(h.toStatus)}: ${h.note}` : `Status changed to ${humanize(h.toStatus)}`,
      meta: `${h.changedByName ?? 'System'} - ${when(h.createdAt)}`,
    })) as unknown as ActivityEntry[],
  );
}