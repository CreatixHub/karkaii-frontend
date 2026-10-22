export type TreatmentStatus =
  | 'Under Observation' | 'Treatment In Progress' | 'Referred to Doctor'
  | 'Emergency Care' | 'Treatment Complete';

export type DischargeStatus =
  | 'In Sick Room' | 'Awaiting Guardian' | 'Awaiting Ambulance'
  | 'Returned to Class' | 'Returned to Duty' | 'Sent Home' | 'Referred Out';

export type Severity = 'Minor' | 'Moderate' | 'Emergency';

export type PersonType = 'Student' | 'Staff';

export type Condition =
  | 'Fever' | 'Injury' | 'Stomach complaint'
  | 'Headache or migraine' | 'Breathing difficulty' | 'Allergy';

export interface Observation {
  note: string;
  at: string;
  by: string;
}

export interface Medication {
  name: string;
  dose: string;
  at: string;
  by: string;
}

export interface Vitals {
  temperature: string;
  pulse: string;
  bloodPressure: string;
  oxygen: string;
  respiration: string;
  /** "Fever" — the flag the template prints beside a high temperature. */
  flag: string;
}

export interface Guardian {
  name: string;
  relationship: string;
  contact: string;
  /** Empty when no call was needed. */
  informedAt: string;
  method: string;
}

export interface Referral {
  clinic: string;
  raisedAt: string;
  reason: string;
  transport: string;
}

export interface SickRoomVisit {
  id: string;
  patient: string;
  /** "AD9892431 · Class II B". */
  reference: string;
  personType: PersonType;
  /** "II B" or "Administration". */
  group: string;

  /** "09:50" — when the patient reported to the sick room. */
  checkIn: string;
  date: string;
  complaint: string;
  complaintDetail: string;
  condition: Condition;
  severity: Severity;

  nurse: string;
  nurseRole: string;

  observations: Observation[];
  vitals: Vitals;
  medications: Medication[];
  guardian: Guardian | null;
  referral: Referral | null;

  /** Empty until the patient leaves. */
  dischargedAt: string;
  dischargedBy: string;
  /** Where they went; empty while still in the sick room. */
  outcome: '' | 'Returned to Class' | 'Returned to Duty' | 'Sent Home' | 'Referred Out';
  dischargeNotes: string;
  /** "15:20" — set when an ambulance has been called. */
  ambulanceAt: string;

  notes: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const personBadge: Record<PersonType, string> = {
  Student: 'badge badge-soft-info',
  Staff: 'badge badge-soft-success',
};

export const severityBadge: Record<Severity, string> = {
  Minor: 'badge badge-soft-success',
  Moderate: 'badge badge-soft-warning',
  Emergency: 'badge badge-soft-danger',
};

export const treatmentPill: Record<TreatmentStatus, string> = {
  'Under Observation': 'is-review',
  'Treatment In Progress': 'is-pending',
  'Referred to Doctor': 'is-blocked',
  'Emergency Care': 'is-suspended',
  'Treatment Complete': 'is-completed',
};

export const treatmentBadge: Record<TreatmentStatus, string> = {
  'Under Observation': 'badge badge-soft-info',
  'Treatment In Progress': 'badge badge-soft-warning',
  'Referred to Doctor': 'badge badge-soft-danger',
  'Emergency Care': 'badge badge-soft-danger',
  'Treatment Complete': 'badge badge-soft-success',
};

export const dischargeBadge: Record<DischargeStatus, string> = {
  'In Sick Room': 'badge badge-soft-warning',
  'Awaiting Guardian': 'badge badge-soft-warning',
  'Awaiting Ambulance': 'badge badge-soft-danger',
  'Returned to Class': 'badge badge-soft-success',
  'Returned to Duty': 'badge badge-soft-success',
  'Sent Home': 'badge badge-soft-info',
  'Referred Out': 'badge badge-soft-purple',
};

/* ------------------------------ Filter options ------------------------------ */

export const personTypeOptions: PersonType[] = ['Student', 'Staff'];

export const conditionOptions: Condition[] = [
  'Fever', 'Injury', 'Stomach complaint',
  'Headache or migraine', 'Breathing difficulty', 'Allergy',
];

export const treatmentOptions: TreatmentStatus[] = [
  'Under Observation', 'Treatment In Progress', 'Referred to Doctor',
  'Emergency Care', 'Treatment Complete',
];

export const dischargeOptions: DischargeStatus[] = [
  'In Sick Room', 'Awaiting Guardian', 'Awaiting Ambulance',
  'Returned to Class', 'Returned to Duty', 'Sent Home', 'Referred Out',
];

export const severityOptions: Severity[] = ['Minor', 'Moderate', 'Emergency'];

export const nurseOptions = ['Ms. Meera Nair', 'Mrs. Sofia Alvarez', 'Ms. Grace Otieno'];

/* --------------------------- Dialog option lists ----------------------------- */

export const groupOptions = [
  'Class II B', 'Class IV A', 'Class V A', 'Class VI B', 'Class VII A',
  'Class IX C', 'Class X B', 'Administration', 'Cafeteria',
];

export const nurseChoices = [
  'Ms. Meera Nair · NUR-2021-004',
  'Mrs. Sofia Alvarez · NUR-2019-002',
  'Ms. Grace Otieno · NUR-2023-011',
];

export const conditionCategoryOptions = [...conditionOptions, 'Other'];

export const treatmentKindOptions = ['Medication', 'First Aid', 'Rest Only'];

export const medicationOptions = [
  'Oral rehydration salts', 'Paracetamol syrup', 'Paracetamol 500 mg',
  'Antacid suspension', 'Salbutamol nebuliser', 'Antiseptic dressing',
];

export const notifyMethodOptions = ['Phone Call', 'SMS', 'Email'];

export const notifyOutcomeOptions = [
  'Acknowledged · on the way', 'Acknowledged · no collection needed',
  'No answer · retry due', 'Voicemail left',
];

export const dischargeKindOptions = ['To Class', 'Sent Home', 'Referred Out'];

export const returnToSchoolOptions = [
  'Next school day', 'After 24 hours without fever',
  'On a doctor certificate', 'Same day · returned to class',
];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/** 85 → "1h 25m"; under an hour drops the hours. */
export const durationText = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  return hours === 0 ? `${mins}m` : `${hours}h ${String(mins).padStart(2, '0')}m`;
};

export const addMinutes = (time: string, minutes: number): string => {
  const total = (minutesOf(time) + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** Check-in to discharge, or to now while the patient is still in the room. */
export const stayOf = (row: SickRoomVisit): number =>
  Math.max(0, minutesOf(row.dischargedAt || REGISTER_TIME) - minutesOf(row.checkIn));

export const isAdmitted = (row: SickRoomVisit): boolean => row.dischargedAt === '';

/**
 * The pill the Treatment Status column prints. A discharge closes the visit, a
 * referral outranks the medication, and a visit with nothing given yet is still
 * only under observation.
 */
export const treatmentOf = (row: SickRoomVisit): TreatmentStatus => {
  if (row.dischargedAt) return 'Treatment Complete';
  if (row.referral) return 'Referred to Doctor';
  return row.medications.length > 0 ? 'Treatment In Progress' : 'Under Observation';
};

/** The badge the Discharge Status column prints. */
export const dischargeOf = (row: SickRoomVisit): DischargeStatus => {
  if (row.outcome) return row.outcome;
  if (row.ambulanceAt) return 'Awaiting Ambulance';
  if (row.guardian?.informedAt) return 'Awaiting Guardian';
  return 'In Sick Room';
};

/** The line under the Check-In column. */
export const stayLabelOf = (row: SickRoomVisit): string =>
  isAdmitted(row) ? `In sick room ${durationText(stayOf(row))}` : `Stayed ${durationText(stayOf(row))}`;

export const stayTintOf = (row: SickRoomVisit): string =>
  isAdmitted(row) ? 'text-warning' : 'text-muted';

/** The line under the Treatment Status pill. */
export const treatmentSubLabelOf = (row: SickRoomVisit): string => {
  if (row.dischargedAt) return `Discharged ${row.dischargedAt}`;
  if (row.referral) return row.referral.clinic;
  if (row.medications.length > 0) {
    return `${row.medications.length} ${row.medications.length === 1 ? 'entry' : 'entries'} recorded`;
  }
  return 'No medication given';
};

/** The line under the Discharge Status badge. */
export const dischargeSubLabelOf = (row: SickRoomVisit): string => {
  if (row.dischargedAt) return `${row.dischargedAt} · ${durationText(stayOf(row))} stay`;
  if (row.ambulanceAt) return `Called ${row.ambulanceAt}`;
  if (row.guardian?.informedAt) return `Guardian informed ${row.guardian.informedAt}`;
  return 'Under observation';
};

export type NotificationState = 'Acknowledged' | 'Pending' | 'Not Required';

export const notificationStateOf = (row: SickRoomVisit): NotificationState => {
  if (!row.guardian) return 'Not Required';
  return row.guardian.informedAt ? 'Acknowledged' : 'Pending';
};

/** The chip the security-notes card prints. */
export const notificationChipOf = (row: SickRoomVisit): string => {
  const state = notificationStateOf(row);
  if (state === 'Not Required') return 'Guardian Not Required';
  return state === 'Acknowledged' ? 'Guardian Acknowledged' : 'Guardian Contact Pending';
};

export const notificationBadge: Record<NotificationState, string> = {
  Acknowledged: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  'Not Required': 'badge badge-soft-secondary',
};

export interface Pair {
  label: string;
  value: string;
}

export const patientPairsOf = (row: SickRoomVisit): Pair[] => [
  { label: 'Patient', value: row.patient },
  { label: 'Person Type', value: row.personType },
  { label: 'Class / Department', value: row.group },
  { label: 'Reference', value: row.reference },
  { label: 'Visit ID', value: row.id },
];

export const vitalsPairsOf = (row: SickRoomVisit): Pair[] => [
  { label: 'Temperature', value: `${row.vitals.temperature}${row.vitals.flag ? ` · ${row.vitals.flag}` : ''}` },
  { label: 'Pulse', value: row.vitals.pulse },
  { label: 'Blood Pressure', value: row.vitals.bloodPressure },
  { label: 'Oxygen Saturation', value: row.vitals.oxygen },
  { label: 'Respiration', value: row.vitals.respiration },
];

export const guardianPairsOf = (row: SickRoomVisit): Pair[] =>
  row.guardian
    ? [
      { label: 'Guardian', value: row.guardian.name },
      { label: 'Relationship', value: row.guardian.relationship },
      { label: 'Contact', value: row.guardian.contact },
      { label: 'Notification', value: notificationStateOf(row) },
      {
        label: 'Informed At',
        value: row.guardian.informedAt ? `${row.guardian.informedAt} · ${row.guardian.method}` : 'Not yet contacted',
      },
    ]
    : [];

export const dischargePairsOf = (row: SickRoomVisit): Pair[] => [
  { label: 'Discharged At', value: row.dischargedAt },
  { label: 'Length of Stay', value: durationText(stayOf(row)) },
  { label: 'Outcome', value: row.outcome || 'Still in the sick room' },
  { label: 'Discharged By', value: row.dischargedBy },
];

export const referralPairsOf = (row: SickRoomVisit): Pair[] =>
  row.referral
    ? [
      { label: 'Clinic', value: row.referral.clinic },
      { label: 'Raised At', value: row.referral.raisedAt },
      { label: 'Reason', value: row.referral.reason },
      { label: 'Transport', value: row.referral.transport },
    ]
    : [];

/** The View dialog's visit block. */
export const visitPairsOf = (row: SickRoomVisit): Pair[] => [
  { label: 'Complaint', value: row.complaint },
  { label: 'Condition', value: row.condition },
  { label: 'Severity', value: row.severity },
  { label: 'Attending Nurse', value: row.nurse },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The visit trail. Every line comes from the observations, the medication and
 * the discharge, so recording a dose or closing the visit redraws it.
 */
export const timelineOf = (row: SickRoomVisit): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-stethoscope', tint: 'primary',
      title: 'Reported to the sick room', meta: `${row.checkIn} · ${row.nurse}`,
    },
    ...row.observations.map((observation) => ({
      icon: 'ti ti-eye', tint: 'info',
      title: observation.note, meta: `${observation.at} · ${observation.by}`,
    })),
    ...row.medications.map((medication) => ({
      icon: 'ti ti-pill', tint: 'purple',
      title: `${medication.name} · ${medication.dose}`, meta: `${medication.at} · ${medication.by}`,
    })),
  ];
  if (row.guardian?.informedAt) {
    entries.push({
      icon: 'ti ti-bell', tint: 'warning',
      title: `Guardian informed · ${row.guardian.name}`,
      meta: `${row.guardian.informedAt} · ${row.guardian.method}`,
    });
  }
  if (row.referral) {
    entries.push({
      icon: 'ti ti-medical-cross', tint: 'danger',
      title: `Referred to ${row.referral.clinic}`,
      meta: `${row.referral.raisedAt} · ${row.referral.transport}`,
    });
  }
  if (row.ambulanceAt) {
    entries.push({
      icon: 'ti ti-ambulance', tint: 'danger',
      title: 'Ambulance called', meta: `${row.ambulanceAt} · awaiting arrival`,
    });
  }
  if (row.dischargedAt) {
    entries.push({
      icon: 'ti ti-door-exit', tint: 'success',
      title: `Discharged · ${row.outcome}`,
      meta: `${row.dischargedAt} · stayed ${durationText(stayOf(row))}`,
    });
  } else {
    entries.push({
      icon: 'ti ti-bed', tint: 'warning',
      title: 'Still in the sick room', meta: `Admitted ${durationText(stayOf(row))} ago`,
    });
  }
  return entries;
};

/** The panel's audit trail, built from the same record. */
export const auditOf = (row: SickRoomVisit): TimelineEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Visit record created', meta: `${row.checkIn} · ${row.nurse}`,
  },
  {
    icon: 'ti ti-pill', tint: row.medications.length > 0 ? 'purple' : 'secondary',
    title: row.medications.length > 0
      ? `${row.medications.length} treatment ${row.medications.length === 1 ? 'entry' : 'entries'} recorded`
      : 'No medication administered',
    meta: row.medications[0] ? `Last at ${row.medications[row.medications.length - 1].at}` : 'Observation only',
  },
  row.dischargedAt
    ? {
      icon: 'ti ti-checks', tint: 'success',
      title: `Visit closed · ${row.outcome}`, meta: `${row.dischargedAt} · ${row.dischargedBy}`,
    }
    : {
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Visit still open', meta: `${REGISTER_TIME} · sick room`,
    },
];

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: SickRoomVisit): string =>
  [
    row.id, row.patient, row.reference, row.personType, row.group, row.complaint,
    row.complaintDetail, row.condition, row.severity, row.nurse,
    treatmentOf(row), dischargeOf(row),
  ]
    .join(' ')
    .toLowerCase();

/** The sort menu orders by severity; this is the rank it uses. */
export const severityRank: Record<Severity, number> = {
  Emergency: 0,
  Moderate: 1,
  Minor: 2,
};

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole day — 34 visits against the eight this page lists —
 * so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  today: 34,
  admitted: 3,
  discharged: 31,
  emergency: 2,
  notifications: 19,
};

export const VIEW_TOTALS = {
  all: 34,
  admitted: 3,
  emergency: 2,
  contactPending: 4,
  referrals: 6,
};

export const QUICK_TOTALS = {
  all: 34,
  admitted: 3,
  discharged: 31,
  emergency: 2,
  students: 29,
  staff: 5,
};

/** The template's one committed chip — the date the register is showing. */
export const REGISTER_FROM = '31-07-2026';
export const REGISTER_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const sickRoomVisits: SickRoomVisit[] = [
  {
    id: 'VIS-2026-0405', patient: 'Lisa Gourley', reference: 'AD9892431 · Class II B',
    personType: 'Student', group: 'II B',
    checkIn: '09:50', date: '31 Jul 2026',
    complaint: 'Persistent stomach pain', complaintDetail: 'Reported during the first period',
    condition: 'Stomach complaint', severity: 'Moderate',
    nurse: 'Ms. Meera Nair', nurseRole: 'School Nurse · NUR-2021-004',
    observations: [
      { note: 'Presented with cramping pain in the lower abdomen, no vomiting', at: '09:50', by: 'Ms. Meera Nair' },
      { note: 'Pain eased after rest, appetite still poor', at: '10:20', by: 'Ms. Meera Nair' },
      { note: 'Comfortable and stable, requested to go home', at: '11:00', by: 'Ms. Meera Nair' },
    ],
    vitals: {
      temperature: '37.4 °C', pulse: '96 bpm', bloodPressure: '104/68 mmHg',
      oxygen: '98%', respiration: '20 per minute', flag: '',
    },
    medications: [
      { name: 'Antacid suspension', dose: '10 ml oral', at: '09:58', by: 'Ms. Meera Nair' },
      { name: 'Oral rehydration salts', dose: '200 ml', at: '10:25', by: 'Ms. Meera Nair' },
    ],
    guardian: {
      name: 'Mrs. Janet Gourley', relationship: 'Mother', contact: '+1 55 7712 4409',
      informedAt: '10:15', method: 'Phone call',
    },
    referral: null,
    dischargedAt: '11:15', dischargedBy: 'Ms. Meera Nair', outcome: 'Sent Home',
    dischargeNotes: 'Handed over to the guardian at the reception desk on exit pass SP-2026-0362. Advised a light diet and rest for the remainder of the day.',
    ambulanceAt: '',
    notes: 'Third stomach complaint this term. Class teacher asked to watch meal times and hydration.',
  },
  {
    id: 'VIS-2026-0409', patient: 'Ishaan Verma', reference: 'AD9894107 · Class IV A',
    personType: 'Student', group: 'IV A',
    checkIn: '12:05', date: '31 Jul 2026',
    complaint: 'Nosebleed', complaintDetail: 'Started during the lunch break',
    condition: 'Injury', severity: 'Minor',
    nurse: 'Ms. Grace Otieno', nurseRole: 'Nurse Assistant · NUR-2023-011',
    observations: [
      { note: 'Bleeding from the left nostril, pressure applied at the desk', at: '12:05', by: 'Ms. Grace Otieno' },
      { note: 'Bleeding stopped within eight minutes, no further loss', at: '12:15', by: 'Ms. Grace Otieno' },
    ],
    vitals: {
      temperature: '36.8 °C', pulse: '84 bpm', bloodPressure: '106/70 mmHg',
      oxygen: '99%', respiration: '18 per minute', flag: '',
    },
    medications: [],
    guardian: null,
    referral: null,
    dischargedAt: '12:25', dischargedBy: 'Ms. Grace Otieno', outcome: 'Returned to Class',
    dischargeNotes: 'Returned to class with the teacher informed. No medication given.',
    ambulanceAt: '',
    notes: 'Dry weather nosebleed. Second one this month, both settled with pressure alone.',
  },
  {
    id: 'VIS-2026-0414', patient: 'Ananya Rao', reference: 'AD9887402 · Class X B',
    personType: 'Student', group: 'X B',
    checkIn: '10:40', date: '31 Jul 2026',
    complaint: 'Deep cut on the left forearm', complaintDetail: 'Laboratory glassware accident',
    condition: 'Injury', severity: 'Emergency',
    nurse: 'Mrs. Sofia Alvarez', nurseRole: 'Senior Nurse · NUR-2019-002',
    observations: [
      { note: 'Four centimetre laceration, bleeding controlled with pressure', at: '10:40', by: 'Mrs. Sofia Alvarez' },
      { note: 'Wound cleaned and dressed, tetanus status confirmed current', at: '10:55', by: 'Mrs. Sofia Alvarez' },
    ],
    vitals: {
      temperature: '36.9 °C', pulse: '104 bpm', bloodPressure: '112/72 mmHg',
      oxygen: '98%', respiration: '20 per minute', flag: '',
    },
    medications: [
      { name: 'Antiseptic dressing', dose: 'Sterile pad and bandage', at: '10:50', by: 'Mrs. Sofia Alvarez' },
    ],
    guardian: {
      name: 'Mr. Anil Rao', relationship: 'Father', contact: '+1 55 4417 8830',
      informedAt: '10:50', method: 'Phone call',
    },
    referral: {
      clinic: 'Riverside Clinic', raisedAt: '11:00',
      reason: 'Laceration needing sutures', transport: 'School vehicle with the senior nurse',
    },
    dischargedAt: '11:10', dischargedBy: 'Mrs. Sofia Alvarez', outcome: 'Referred Out',
    dischargeNotes: 'Transferred to Riverside Clinic accompanied by the senior nurse. Guardian met the student at the clinic.',
    ambulanceAt: '',
    notes: 'Incident reported to the science department. Glassware handling briefing scheduled for the class.',
  },
  {
    id: 'VIS-2026-0418', patient: 'Aarav Kumar', reference: 'AD9891255 · Class VII A',
    personType: 'Student', group: 'VII A',
    checkIn: '11:35', date: '31 Jul 2026',
    complaint: 'Ankle sprain', complaintDetail: 'Twisted during the games period',
    condition: 'Injury', severity: 'Moderate',
    nurse: 'Ms. Meera Nair', nurseRole: 'School Nurse · NUR-2021-004',
    observations: [
      { note: 'Swelling on the lateral ankle, able to bear partial weight', at: '11:35', by: 'Ms. Meera Nair' },
      { note: 'Ice applied for twenty minutes, swelling reduced', at: '11:55', by: 'Ms. Meera Nair' },
    ],
    vitals: {
      temperature: '36.7 °C', pulse: '88 bpm', bloodPressure: '108/70 mmHg',
      oxygen: '99%', respiration: '18 per minute', flag: '',
    },
    medications: [
      { name: 'Antiseptic dressing', dose: 'Compression bandage', at: '11:58', by: 'Ms. Meera Nair' },
    ],
    guardian: {
      name: 'Mr. Rajesh Kumar', relationship: 'Father', contact: '+1 55 4176 2280',
      informedAt: '12:00', method: 'SMS',
    },
    referral: null,
    dischargedAt: '12:20', dischargedBy: 'Ms. Meera Nair', outcome: 'Returned to Class',
    dischargeNotes: 'Returned to class with a note excusing games for three days. Guardian informed of the home care advice.',
    ambulanceAt: '',
    notes: 'Guardian meeting APT-2026-0709 on 4 Aug will cover the games exemption with the class teacher.',
  },
  {
    id: 'VIS-2026-0421', patient: 'Ms. Carla Mendes', reference: 'Assistant Warden · EMP-2024-088',
    personType: 'Staff', group: 'Administration',
    checkIn: '13:10', date: '31 Jul 2026',
    complaint: 'Migraine with light sensitivity', complaintDetail: 'Third episode this month',
    condition: 'Headache or migraine', severity: 'Moderate',
    nurse: 'Mrs. Sofia Alvarez', nurseRole: 'Senior Nurse · NUR-2019-002',
    observations: [
      { note: 'Rested in a darkened room, reported throbbing pain on the right side', at: '13:10', by: 'Mrs. Sofia Alvarez' },
      { note: 'Pain reduced after rest and analgesia, light sensitivity easing', at: '13:45', by: 'Mrs. Sofia Alvarez' },
    ],
    vitals: {
      temperature: '36.6 °C', pulse: '78 bpm', bloodPressure: '118/76 mmHg',
      oxygen: '99%', respiration: '16 per minute', flag: '',
    },
    medications: [
      { name: 'Paracetamol 500 mg', dose: '1 tablet oral', at: '13:15', by: 'Mrs. Sofia Alvarez' },
    ],
    guardian: null,
    referral: null,
    dischargedAt: '13:55', dischargedBy: 'Mrs. Sofia Alvarez', outcome: 'Returned to Duty',
    dischargeNotes: 'Returned to duty and advised to take the second half of the day as leave. Half day approved by the Chief Warden.',
    ambulanceAt: '',
    notes: 'Left campus on staff pass SP-2026-0364 for the approved half day leave.',
  },
  {
    id: 'VIS-2026-0426', patient: 'Meera Iyer', reference: 'AD9893660 · Class V A',
    personType: 'Student', group: 'V A',
    checkIn: '14:50', date: '31 Jul 2026',
    complaint: 'Fever and sore throat', complaintDetail: 'Unwell since the morning assembly',
    condition: 'Fever', severity: 'Moderate',
    nurse: 'Ms. Meera Nair', nurseRole: 'School Nurse · NUR-2021-004',
    observations: [
      { note: 'Temperature 38.4 C, throat red with no visible exudate', at: '14:50', by: 'Ms. Meera Nair' },
      { note: 'Tepid sponging started, fluids encouraged', at: '15:05', by: 'Ms. Meera Nair' },
      { note: 'Resting quietly, temperature recheck due at 16:00', at: '15:30', by: 'Ms. Meera Nair' },
    ],
    vitals: {
      temperature: '38.4 °C', pulse: '108 bpm', bloodPressure: '102/66 mmHg',
      oxygen: '97%', respiration: '22 per minute', flag: 'Fever',
    },
    medications: [
      { name: 'Paracetamol syrup', dose: '250 mg oral', at: '15:00', by: 'Ms. Meera Nair' },
      { name: 'Tepid sponging', dose: 'Fifteen minutes', at: '15:05', by: 'Ms. Grace Otieno' },
    ],
    guardian: {
      name: 'Mrs. Latha Iyer', relationship: 'Mother', contact: '+1 55 3390 8827',
      informedAt: '15:05', method: 'Phone call',
    },
    referral: null,
    dischargedAt: '', dischargedBy: '', outcome: '',
    dischargeNotes: '',
    ambulanceAt: '',
    notes: 'Two classmates seen with sore throats this week. Class teacher asked to watch for further cases.',
  },
  {
    id: 'VIS-2026-0429', patient: 'Rohan Desai', reference: 'AD9889014 · Class IX C',
    personType: 'Student', group: 'IX C',
    checkIn: '15:05', date: '31 Jul 2026',
    complaint: 'Acute breathing difficulty', complaintDetail: 'Known asthma, inhaler not carried',
    condition: 'Breathing difficulty', severity: 'Emergency',
    nurse: 'Mrs. Sofia Alvarez', nurseRole: 'Senior Nurse · NUR-2019-002',
    observations: [
      { note: 'Audible wheeze, speaking in short phrases, oxygen saturation 93%', at: '15:05', by: 'Mrs. Sofia Alvarez' },
      { note: 'Nebuliser started, wheeze reducing and saturation climbing to 96%', at: '15:12', by: 'Mrs. Sofia Alvarez' },
    ],
    vitals: {
      temperature: '36.8 °C', pulse: '118 bpm', bloodPressure: '116/74 mmHg',
      oxygen: '96%', respiration: '26 per minute', flag: 'Low on arrival',
    },
    medications: [
      { name: 'Salbutamol nebuliser', dose: '2.5 mg nebulised', at: '15:10', by: 'Mrs. Sofia Alvarez' },
    ],
    guardian: {
      name: 'Mrs. Priya Desai', relationship: 'Mother', contact: '+1 55 9930 4471',
      informedAt: '15:15', method: 'Phone call',
    },
    referral: {
      clinic: 'Riverside Clinic', raisedAt: '15:18',
      reason: 'Asthma flare needing review', transport: 'Ambulance called at 15:20',
    },
    dischargedAt: '', dischargedBy: '', outcome: '',
    dischargeNotes: '',
    ambulanceAt: '15:20',
    notes: 'Reliever inhaler was left at home. Sick room to hold a spare under the school medication policy.',
  },
  {
    id: 'VIS-2026-0431', patient: 'Kabir Shah', reference: 'AD9892008 · Class VI B',
    personType: 'Student', group: 'VI B',
    checkIn: '15:25', date: '31 Jul 2026',
    complaint: 'Dizziness after physical training', complaintDetail: 'Missed breakfast this morning',
    condition: 'Headache or migraine', severity: 'Minor',
    nurse: 'Ms. Grace Otieno', nurseRole: 'Nurse Assistant · NUR-2023-011',
    observations: [
      { note: 'Light headed on standing, no fainting or head injury', at: '15:25', by: 'Ms. Grace Otieno' },
      { note: 'Seated with fluids offered, colour improving', at: '15:35', by: 'Ms. Grace Otieno' },
    ],
    vitals: {
      temperature: '36.5 °C', pulse: '92 bpm', bloodPressure: '98/62 mmHg',
      oxygen: '99%', respiration: '18 per minute', flag: '',
    },
    medications: [],
    guardian: null,
    referral: null,
    dischargedAt: '', dischargedBy: '', outcome: '',
    dischargeNotes: '',
    ambulanceAt: '',
    notes: 'Second student from the same PT session today. Games department asked to move the drill to the shaded court.',
  },
];
