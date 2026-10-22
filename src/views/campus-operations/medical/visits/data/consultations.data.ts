export type VisitStatus =
  | 'Scheduled' | 'Awaiting Results' | 'Under Treatment' | 'Referred' | 'Completed';

export type VisitType =
  | 'Consultation' | 'Emergency' | 'Follow-Up'
  | 'Health Assessment' | 'Injury Review' | 'Screening';

export type FollowUpState = 'Overdue' | 'Due today' | 'Scheduled' | 'Completed' | 'Not required';

export type PersonType = 'Student' | 'Staff';

export type MedicalCondition =
  | 'Respiratory' | 'Gastrointestinal' | 'Injury and trauma'
  | 'Neurological' | 'Nutritional' | 'Cardiovascular';

export interface Investigation {
  name: string;
  lab: string;
  /** Empty while the result is still awaited. */
  result: string;
}

export interface Prescription {
  medication: string;
  dose: string;
  frequency: string;
  courseDays: number;
}

export interface Referral {
  id: string;
  facility: string;
  doctor: string;
  referredAt: string;
  urgency: string;
  reason: string;
  transport: string;
}

export interface FollowUp {
  /** "4 Aug 2026" — empty when no review is booked. */
  reviewDate: string;
  reviewTime: string;
  reviewer: string;
  purpose: string;
  /** Set once the review has actually happened. */
  completedOn: string;
}

export interface Vitals {
  temperature: string;
  pulse: string;
  bloodPressure: string;
  oxygen: string;
  respiration: string;
  weight: string;
}

export interface Consultation {
  id: string;
  patient: string;
  /** "AD9892431 · Class II B". */
  reference: string;
  personType: PersonType;
  group: string;
  guardian: string;
  contact: string;

  visitDate: string;
  visitTime: string;
  /** Minutes the consultation ran. */
  consultationMinutes: number;
  reason: string;
  diagnosis: string;
  visitType: VisitType;
  condition: MedicalCondition;

  staff: string;
  staffRole: string;

  symptoms: string[];
  vitals: Vitals;
  investigations: Investigation[];
  prescriptions: Prescription[];
  /** "28 Jul 2026" — when the course started; empty when nothing was given. */
  courseFrom: string;
  referral: Referral | null;
  followUp: FollowUp | null;

  notes: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const personBadge: Record<PersonType, string> = {
  Student: 'badge badge-soft-info',
  Staff: 'badge badge-soft-success',
};

export const visitTypeBadge: Record<VisitType, string> = {
  Consultation: 'badge badge-soft-primary',
  Emergency: 'badge badge-soft-danger',
  'Follow-Up': 'badge badge-soft-info',
  'Health Assessment': 'badge badge-soft-success',
  'Injury Review': 'badge badge-soft-warning',
  Screening: 'badge badge-soft-purple',
};

export const visitTypeIcon: Record<VisitType, string> = {
  Consultation: 'ti ti-stethoscope',
  Emergency: 'ti ti-ambulance',
  'Follow-Up': 'ti ti-calendar-time',
  'Health Assessment': 'ti ti-report-medical',
  'Injury Review': 'ti ti-first-aid-kit',
  Screening: 'ti ti-test-pipe',
};

export const statusPill: Record<VisitStatus, string> = {
  Scheduled: 'is-pending',
  'Awaiting Results': 'is-review',
  'Under Treatment': 'is-active',
  Referred: 'is-blocked',
  Completed: 'is-completed',
};

export const statusBadge: Record<VisitStatus, string> = {
  Scheduled: 'badge badge-soft-warning',
  'Awaiting Results': 'badge badge-soft-info',
  'Under Treatment': 'badge badge-soft-primary',
  Referred: 'badge badge-soft-danger',
  Completed: 'badge badge-soft-success',
};

export const followUpBadge: Record<FollowUpState, string> = {
  Overdue: 'badge badge-soft-danger',
  'Due today': 'badge badge-soft-warning',
  Scheduled: 'badge badge-soft-info',
  Completed: 'badge badge-soft-success',
  'Not required': 'badge badge-soft-secondary',
};

/** The chip the clinical-notes card prints. */
export const followUpChip: Record<FollowUpState, string> = {
  Overdue: 'Follow-up Overdue',
  'Due today': 'Follow-up Due Today',
  Scheduled: 'Follow-up Scheduled',
  Completed: 'Follow-up Completed',
  'Not required': 'Follow-up Not Required',
};

/* ------------------------------ Filter options ------------------------------ */

export const personTypeOptions: PersonType[] = ['Student', 'Staff'];

export const visitTypeOptions: VisitType[] = [
  'Consultation', 'Emergency', 'Follow-Up', 'Health Assessment', 'Injury Review', 'Screening',
];

export const conditionOptions: MedicalCondition[] = [
  'Respiratory', 'Gastrointestinal', 'Injury and trauma',
  'Neurological', 'Nutritional', 'Cardiovascular',
];

export const statusOptions: VisitStatus[] = [
  'Scheduled', 'Awaiting Results', 'Under Treatment', 'Referred', 'Completed',
];

export const followUpOptions: FollowUpState[] = [
  'Overdue', 'Due today', 'Scheduled', 'Completed', 'Not required',
];

export const staffOptions = [
  'Dr. Anil Menon', 'Dr. Leena Fernandes', 'Mrs. Sofia Alvarez', 'Ms. Meera Nair',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const quickTypeOptions = ['Consultation', 'Emergency', 'Follow-Up', 'Screening'];

export const groupOptions = [
  'Class II B', 'Class V A', 'Class VI B', 'Class VII A',
  'Class IX C', 'Class X B', 'Administration', 'Class Teacher',
];

export const staffChoices = [
  'Dr. Anil Menon · Visiting Physician',
  'Dr. Leena Fernandes · Visiting Paediatrician',
  'Mrs. Sofia Alvarez · NUR-2019-002',
  'Ms. Meera Nair · NUR-2021-004',
];

export const lengthOptions = ['15 minutes', '20 minutes', '25 minutes', '30 minutes', '35 minutes'];

export const investigationOptions = [
  'None', 'Haemoglobin', 'Peripheral smear', 'Throat swab',
  'Stool routine', 'Ankle X-ray, two views', 'Lipid profile',
];

export const labOptions = ['Riverside Clinic lab', 'Riverside Clinic imaging', 'School health room'];

export const diagnosisKindOptions = ['Provisional', 'Confirmed', 'Ruled Out'];

export const routeOptions = ['Oral', 'Topical', 'Inhaled'];

export const medicationOptions = [
  'Ferrous ascorbate', 'Vitamin C', 'Paracetamol', 'Ibuprofen',
  'Antacid suspension', 'Amoxicillin clavulanate', 'Salbutamol inhaler',
];

export const frequencyOptions = ['Once daily', 'Twice daily', 'Three times daily', 'As needed'];

export const courseLengthOptions = ['3 days', '5 days', '7 days', '30 days'];

export const followUpPresets = ['3 days', '1 week', '2 weeks', '1 month'];

export const transportOptions = ['Ambulance', 'Nurse Escort', 'Guardian'];

export const facilityOptions = [
  'Riverside Clinic', 'City General Hospital', "Metro Children's Hospital", 'Dental Care Centre',
];

export const receivingDoctorOptions = [
  'Dr. Anil Menon', 'Dr. Leena Fernandes', 'Emergency department',
];

export const urgencyOptions = ['Immediate', 'Same day', 'Within 48 hours', 'Routine'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const dayNumber = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

/** Whole days between two of the template's dates. */
export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

/** Adds days to one of the template's dates, keeping its format. */
export const shiftDate = (value: string, days: number): string => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return value;
  const moved = new Date(Date.UTC(Number(year), index, Number(day) + days));
  return `${moved.getUTCDate()} ${months[moved.getUTCMonth()]} ${moved.getUTCFullYear()}`;
};

/** "3 days" / "1 day" — the way the template counts a gap. */
export const dayText = (days: number): string =>
  `${Math.abs(days)} ${Math.abs(days) === 1 ? 'day' : 'days'}`;

/** Days from today to the visit; negative once it has happened. */
export const daysToVisitOf = (row: Consultation): number =>
  daysBetween(REGISTER_DATE, row.visitDate);

/** The line under the Visit Date & Time column. */
export const visitAgeLabelOf = (row: Consultation): string => {
  const days = daysToVisitOf(row);
  if (days === 0) return 'Today';
  return days > 0 ? `In ${dayText(days)}` : `${dayText(days)} ago`;
};

export const visitAgeTintOf = (row: Consultation): string => {
  const days = daysToVisitOf(row);
  if (days === 0) return 'text-warning';
  return days > 0 ? 'text-info' : 'text-muted';
};

/** "28 Jul 2026 09:30 · 25 min consultation". */
export const visitLabelOf = (row: Consultation): string =>
  `${row.visitTime} · ${row.consultationMinutes} min consultation`;

/* --------------------------- Investigations & course ------------------------ */

export const pendingInvestigationsOf = (row: Consultation): number =>
  row.investigations.filter((investigation) => investigation.result === '').length;

/** "2 ordered · 0 pending". */
export const investigationSummaryOf = (row: Consultation): string =>
  `${row.investigations.length} ordered · ${pendingInvestigationsOf(row)} pending`;

/** The longest course on the prescription decides when the treatment ends. */
export const courseEndOf = (row: Consultation): string => {
  if (!row.courseFrom || row.prescriptions.length === 0) return '';
  const longest = Math.max(...row.prescriptions.map((prescription) => prescription.courseDays));
  return shiftDate(row.courseFrom, longest - 1);
};

/** "28 Jul 2026 to 1 Aug 2026". */
export const courseLabelOf = (row: Consultation): string => {
  const end = courseEndOf(row);
  return end ? `${row.courseFrom} to ${end}` : 'No medication prescribed';
};

export const courseRunning = (row: Consultation): boolean => {
  const end = courseEndOf(row);
  return end !== '' && dateKey(end) >= dateKey(REGISTER_DATE);
};

/**
 * The pill the Treatment Status column prints, read in order: a visit still to
 * come, then a referral, then an outstanding investigation, then a running
 * course, and only then Completed.
 */
export const statusOf = (row: Consultation): VisitStatus => {
  if (daysToVisitOf(row) > 0) return 'Scheduled';
  if (row.referral) return 'Referred';
  if (pendingInvestigationsOf(row) > 0) return 'Awaiting Results';
  return courseRunning(row) ? 'Under Treatment' : 'Completed';
};

/** The line under it. */
export const statusSubLabelOf = (row: Consultation): string => {
  const status = statusOf(row);
  if (status === 'Scheduled') return `Opens in ${dayText(daysToVisitOf(row))}`;
  if (status === 'Referred') return row.referral?.facility ?? 'Referred out';
  if (status === 'Awaiting Results') {
    const pending = pendingInvestigationsOf(row);
    return `${pending} ${pending === 1 ? 'investigation' : 'investigations'} pending`;
  }
  if (status === 'Under Treatment') return `Course ends ${courseEndOf(row)}`;
  return courseEndOf(row) ? `Course closed ${courseEndOf(row)}` : 'No medication prescribed';
};

/* ------------------------------- The follow-up ------------------------------ */

export const followUpStateOf = (row: Consultation): FollowUpState => {
  if (!row.followUp || !row.followUp.reviewDate) return 'Not required';
  if (row.followUp.completedOn) return 'Completed';
  const days = daysBetween(REGISTER_DATE, row.followUp.reviewDate);
  if (days < 0) return 'Overdue';
  return days === 0 ? 'Due today' : 'Scheduled';
};

/** The line under the Follow-Up badge. */
export const followUpLabelOf = (row: Consultation): string => {
  const state = followUpStateOf(row);
  if (state === 'Not required') return 'No review booked';
  if (!row.followUp) return 'No review booked';
  if (state === 'Completed') return `Seen ${row.followUp.completedOn}`;
  if (state === 'Overdue') return `Was due ${row.followUp.reviewDate}`;
  if (state === 'Due today') return `${row.followUp.reviewDate} · today`;
  return `${row.followUp.reviewDate} · in ${dayText(daysBetween(REGISTER_DATE, row.followUp.reviewDate))}`;
};

/** The Follow-Up Plan card's own timing line. */
export const followUpTimingOf = (row: Consultation): string => {
  if (!row.followUp?.reviewDate) return 'Not applicable';
  const days = daysBetween(REGISTER_DATE, row.followUp.reviewDate);
  if (row.followUp.completedOn) return `Completed ${row.followUp.completedOn}`;
  if (days < 0) return `Overdue by ${dayText(days)}`;
  return days === 0 ? 'Today' : `In ${dayText(days)}`;
};

export interface Pair {
  label: string;
  value: string;
}

export const patientPairsOf = (row: Consultation): Pair[] => [
  { label: 'Patient', value: row.patient },
  { label: 'Person Type', value: row.personType },
  { label: 'Class / Department', value: row.group },
  { label: 'Reference', value: row.reference },
  { label: 'Guardian', value: row.guardian },
  { label: 'Contact', value: row.contact },
];

export const assessmentPairsOf = (row: Consultation): Pair[] => [
  { label: 'Visit Type', value: row.visitType },
  { label: 'Seen By', value: row.staff },
  { label: 'Consultation', value: `${row.consultationMinutes} minutes` },
  { label: 'Investigations', value: investigationSummaryOf(row) },
];

export const vitalsPairsOf = (row: Consultation): Pair[] => [
  { label: 'Temperature', value: row.vitals.temperature },
  { label: 'Pulse', value: row.vitals.pulse },
  { label: 'Blood Pressure', value: row.vitals.bloodPressure },
  { label: 'Oxygen Saturation', value: row.vitals.oxygen },
  { label: 'Respiration', value: row.vitals.respiration },
  { label: 'Weight', value: row.vitals.weight },
];

export const referralPairsOf = (row: Consultation): Pair[] =>
  row.referral
    ? [
      { label: 'Referral ID', value: row.referral.id },
      { label: 'Facility', value: row.referral.facility },
      { label: 'Receiving Doctor', value: row.referral.doctor },
      { label: 'Referred At', value: row.referral.referredAt },
      { label: 'Urgency', value: row.referral.urgency },
      { label: 'Transport', value: row.referral.transport },
    ]
    : [];

export const followUpPairsOf = (row: Consultation): Pair[] =>
  row.followUp?.reviewDate
    ? [
      { label: 'Status', value: followUpStateOf(row) },
      { label: 'Review Date', value: `${row.followUp.reviewDate} · ${row.followUp.reviewTime}` },
      { label: 'Timing', value: followUpTimingOf(row) },
      { label: 'Reviewer', value: row.followUp.reviewer },
    ]
    : [];

/** The View dialog's visit block. */
export const visitPairsOf = (row: Consultation): Pair[] => [
  { label: 'Visit Date', value: `${row.visitDate} · ${row.visitTime}` },
  { label: 'Reason', value: row.reason },
  { label: 'Diagnosis', value: row.diagnosis },
  { label: 'Condition', value: row.condition },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The medical trail. Every line comes from the visit, the investigations, the
 * prescription, the referral and the review, so saving a diagnosis or booking a
 * follow-up redraws it.
 */
export const timelineOf = (row: Consultation): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: visitTypeIcon[row.visitType], tint: 'primary',
      title: `${row.visitType} · ${row.reason}`,
      meta: `${row.visitDate} ${row.visitTime} · ${row.staff}`,
    },
  ];
  if (row.diagnosis) {
    entries.push({
      icon: 'ti ti-stethoscope', tint: 'info',
      title: row.diagnosis, meta: `${row.condition} · clinical diagnosis`,
    });
  }
  row.investigations.forEach((investigation) => {
    entries.push({
      icon: 'ti ti-flask', tint: investigation.result ? 'success' : 'warning',
      title: investigation.name,
      meta: `${investigation.lab} · ${investigation.result || 'result awaited'}`,
    });
  });
  row.prescriptions.forEach((prescription) => {
    entries.push({
      icon: 'ti ti-pill', tint: 'purple',
      title: `${prescription.medication} · ${prescription.dose}`,
      meta: `${prescription.frequency} · ${prescription.courseDays} day course`,
    });
  });
  if (row.referral) {
    entries.push({
      icon: 'ti ti-medical-cross', tint: 'danger',
      title: `Referred to ${row.referral.facility}`,
      meta: `${row.referral.referredAt} · ${row.referral.urgency}`,
    });
  }
  if (row.followUp?.reviewDate) {
    entries.push({
      icon: 'ti ti-calendar-time',
      tint: followUpStateOf(row) === 'Overdue' ? 'danger'
        : followUpStateOf(row) === 'Completed' ? 'success' : 'info',
      title: row.followUp.completedOn ? 'Follow-up completed' : 'Follow-up booked',
      meta: `${row.followUp.completedOn || row.followUp.reviewDate} · ${row.followUp.reviewer}`,
    });
  }
  return entries;
};

/** The panel's audit trail, built from the same record. */
export const auditOf = (row: Consultation): TimelineEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Visit record created', meta: `${row.visitDate} ${row.visitTime} · ${row.staff}` ,
  },
  {
    icon: 'ti ti-flask',
    tint: pendingInvestigationsOf(row) > 0 ? 'warning' : row.investigations.length > 0 ? 'success' : 'secondary',
    title: row.investigations.length > 0 ? investigationSummaryOf(row) : 'No investigation ordered',
    meta: row.investigations[0]?.lab ?? 'Managed clinically',
  },
  {
    icon: 'ti ti-checks',
    tint: statusOf(row) === 'Completed' ? 'success' : statusOf(row) === 'Referred' ? 'danger' : 'warning',
    title: `Status · ${statusOf(row)}`, meta: statusSubLabelOf(row),
  },
];

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: Consultation): string =>
  [
    row.id, row.patient, row.reference, row.personType, row.group, row.reason,
    row.diagnosis, row.visitType, row.condition, row.staff,
    statusOf(row), followUpStateOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole term — 143 visits against the eight this page lists
 * — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  today: 12,
  followUps: 9,
  emergency: 3,
  referred: 5,
  activeVisits: 25,
  completed: 118,
  total: 143,
};

export const VIEW_TOTALS = {
  all: 143,
  open: 25,
  followUpsDue: 9,
  referred: 5,
  awaitingResults: 7,
};

export const QUICK_TOTALS = {
  all: 143,
  today: 12,
  followUp: 9,
  emergency: 3,
  referred: 5,
  completed: 118,
};

/** The template's one committed chip is the visit window it opens on. */
export const PERIOD_FROM = '01-07-2026';
export const PERIOD_TO = '07-08-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const consultations: Consultation[] = [
  {
    id: 'MV-2026-0496', patient: 'Lisa Gourley', reference: 'AD9892431 · Class II B',
    personType: 'Student', group: 'II B',
    guardian: 'Mrs. Janet Gourley · Mother', contact: '+1 55 7712 4409',
    visitDate: '28 Jul 2026', visitTime: '09:30', consultationMinutes: 25,
    reason: 'Recurrent abdominal pain', diagnosis: 'Functional abdominal pain',
    visitType: 'Consultation', condition: 'Gastrointestinal',
    staff: 'Dr. Anil Menon', staffRole: 'Visiting Physician · Riverside Clinic',
    symptoms: [
      'Cramping pain around the navel, worse after meals',
      'No vomiting, no blood in the stool',
      'Appetite reduced over the past three weeks',
    ],
    vitals: {
      temperature: '37.1 °C', pulse: '94 bpm', bloodPressure: '102/66 mmHg',
      oxygen: '99%', respiration: '20 per minute', weight: '22.4 kg',
    },
    investigations: [
      { name: 'Stool routine', lab: 'Riverside Clinic lab', result: 'Normal · no ova or cysts' },
      { name: 'Haemoglobin', lab: 'Riverside Clinic lab', result: '11.8 g/dL · low normal' },
    ],
    prescriptions: [
      { medication: 'Antacid suspension', dose: '10 ml', frequency: 'Twice daily before meals', courseDays: 5 },
      { medication: 'Probiotic sachet', dose: '1 sachet', frequency: 'Once at night', courseDays: 5 },
    ],
    courseFrom: '28 Jul 2026',
    referral: null,
    followUp: {
      reviewDate: '4 Aug 2026', reviewTime: '09:30', reviewer: 'Dr. Anil Menon',
      purpose: 'Review the symptom diary and repeat the haemoglobin.', completedOn: '',
    },
    notes: 'Symptom diary given to the guardian. Sick room visit VIS-2026-0405 on 31 Jul was the third episode this term.',
  },
  {
    id: 'MV-2026-0468', patient: 'Kabir Shah', reference: 'AD9892008 · Class VI B',
    personType: 'Student', group: 'VI B',
    guardian: 'Mr. Vikram Shah · Father', contact: '+1 55 6612 9903',
    visitDate: '10 Jul 2026', visitTime: '11:15', consultationMinutes: 20,
    reason: 'Anaemia screening', diagnosis: 'Iron deficiency anaemia, mild',
    visitType: 'Screening', condition: 'Nutritional',
    staff: 'Dr. Leena Fernandes', staffRole: 'Visiting Paediatrician · Riverside Clinic',
    symptoms: [
      'Tires quickly during physical training',
      'Pale conjunctivae on examination',
      'No bleeding or bruising reported',
    ],
    vitals: {
      temperature: '36.8 °C', pulse: '92 bpm', bloodPressure: '104/64 mmHg',
      oxygen: '99%', respiration: '18 per minute', weight: '31.6 kg',
    },
    investigations: [
      { name: 'Haemoglobin', lab: 'Riverside Clinic lab', result: '10.4 g/dL · low' },
      { name: 'Peripheral smear', lab: 'Riverside Clinic lab', result: 'Microcytic hypochromic' },
    ],
    prescriptions: [
      { medication: 'Ferrous ascorbate', dose: '100 mg', frequency: 'Once daily', courseDays: 30 },
      { medication: 'Vitamin C', dose: '100 mg', frequency: 'Once daily', courseDays: 30 },
    ],
    courseFrom: '10 Jul 2026',
    referral: null,
    followUp: {
      reviewDate: '28 Jul 2026', reviewTime: '11:00', reviewer: 'Dr. Leena Fernandes',
      purpose: 'Repeat haemoglobin after four weeks of iron therapy.', completedOn: '',
    },
    notes: 'Review not attended. Health room asked to contact the guardian and rebook before the course ends.',
  },
  {
    id: 'MV-2026-0481', patient: 'Mr. Ethan Brooks', reference: 'Junior Warden · EMP-2023-071',
    personType: 'Staff', group: 'Class Teacher',
    guardian: 'Not applicable', contact: '+1 55 4453 6621',
    visitDate: '22 Jul 2026', visitTime: '14:00', consultationMinutes: 30,
    reason: 'Annual health assessment', diagnosis: 'Fit for duty, borderline lipids',
    visitType: 'Health Assessment', condition: 'Cardiovascular',
    staff: 'Dr. Anil Menon', staffRole: 'Visiting Physician · Riverside Clinic',
    symptoms: [
      'No presenting complaint at the assessment',
      'Reports irregular meal times on duty days',
    ],
    vitals: {
      temperature: '36.6 °C', pulse: '76 bpm', bloodPressure: '128/82 mmHg',
      oxygen: '99%', respiration: '16 per minute', weight: '78.2 kg',
    },
    investigations: [
      { name: 'Lipid profile', lab: 'Riverside Clinic lab', result: 'LDL 138 mg/dL · borderline' },
    ],
    prescriptions: [],
    courseFrom: '',
    referral: null,
    followUp: {
      reviewDate: '5 Aug 2026', reviewTime: '14:00', reviewer: 'Dr. Anil Menon',
      purpose: 'Review the lipid profile after two weeks of dietary advice.', completedOn: '',
    },
    notes: 'Dietary advice given with a walking plan. No medication needed at this stage.',
  },
  {
    id: 'MV-2026-0487', patient: 'Ms. Carla Mendes', reference: 'Assistant Warden · EMP-2024-088',
    personType: 'Staff', group: 'Administration',
    guardian: 'Not applicable', contact: '+1 55 3341 7726',
    visitDate: '24 Jul 2026', visitTime: '10:45', consultationMinutes: 20,
    reason: 'Recurrent migraine', diagnosis: 'Migraine without aura',
    visitType: 'Consultation', condition: 'Neurological',
    staff: 'Dr. Anil Menon', staffRole: 'Visiting Physician · Riverside Clinic',
    symptoms: [
      'Throbbing right sided headache, three episodes this month',
      'Light sensitivity during attacks',
      'No visual aura or weakness',
    ],
    vitals: {
      temperature: '36.5 °C', pulse: '74 bpm', bloodPressure: '118/76 mmHg',
      oxygen: '99%', respiration: '16 per minute', weight: '61.4 kg',
    },
    investigations: [],
    prescriptions: [
      { medication: 'Paracetamol', dose: '500 mg', frequency: 'As needed', courseDays: 3 },
    ],
    courseFrom: '24 Jul 2026',
    referral: null,
    followUp: {
      reviewDate: '30 Jul 2026', reviewTime: '10:45', reviewer: 'Dr. Anil Menon',
      purpose: 'Review the headache diary and the trigger list.', completedOn: '30 Jul 2026',
    },
    notes: 'Headache diary reviewed on 30 Jul. Screen breaks and hydration advised; no imaging indicated.',
  },
  {
    id: 'MV-2026-0502', patient: 'Aarav Kumar', reference: 'AD9891255 · Class VII A',
    personType: 'Student', group: 'VII A',
    guardian: 'Mr. Rajesh Kumar · Father', contact: '+1 55 4176 2280',
    visitDate: '31 Jul 2026', visitTime: '12:20', consultationMinutes: 15,
    reason: 'Ankle injury review', diagnosis: 'Lateral ligament sprain, grade 1',
    visitType: 'Injury Review', condition: 'Injury and trauma',
    staff: 'Mrs. Sofia Alvarez', staffRole: 'Senior Nurse · NUR-2019-002',
    symptoms: [
      'Swelling on the lateral ankle after a games period twist',
      'Full weight bearing with mild discomfort',
      'No bony tenderness on the posterior border',
    ],
    vitals: {
      temperature: '36.7 °C', pulse: '88 bpm', bloodPressure: '108/70 mmHg',
      oxygen: '99%', respiration: '18 per minute', weight: '38.5 kg',
    },
    investigations: [
      { name: 'Ankle X-ray, two views', lab: 'Riverside Clinic imaging', result: '' },
    ],
    prescriptions: [
      { medication: 'Ibuprofen', dose: '200 mg', frequency: 'Twice daily', courseDays: 3 },
    ],
    courseFrom: '31 Jul 2026',
    referral: null,
    followUp: {
      reviewDate: '3 Aug 2026', reviewTime: '12:00', reviewer: 'Mrs. Sofia Alvarez',
      purpose: 'Review the imaging and clear the student for games.', completedOn: '',
    },
    notes: 'Games excused for three days. Imaging requested only to exclude a fracture before clearing sport.',
  },
  {
    id: 'MV-2026-0511', patient: 'Ananya Rao', reference: 'AD9887402 · Class X B',
    personType: 'Student', group: 'X B',
    guardian: 'Mr. Anil Rao · Father', contact: '+1 55 4417 8830',
    visitDate: '31 Jul 2026', visitTime: '11:10', consultationMinutes: 30,
    reason: 'Deep forearm laceration', diagnosis: 'Laceration needing sutures',
    visitType: 'Emergency', condition: 'Injury and trauma',
    staff: 'Mrs. Sofia Alvarez', staffRole: 'Senior Nurse · NUR-2019-002',
    symptoms: [
      'Four centimetre laceration from laboratory glassware',
      'Bleeding controlled with direct pressure',
      'Tetanus cover confirmed current',
    ],
    vitals: {
      temperature: '36.9 °C', pulse: '104 bpm', bloodPressure: '112/72 mmHg',
      oxygen: '98%', respiration: '20 per minute', weight: '48.2 kg',
    },
    investigations: [],
    prescriptions: [
      { medication: 'Amoxicillin clavulanate', dose: '375 mg', frequency: 'Twice daily', courseDays: 5 },
    ],
    courseFrom: '31 Jul 2026',
    referral: {
      id: 'REF-2026-0088', facility: 'Riverside Clinic', doctor: 'Emergency department',
      referredAt: '11:00', urgency: 'Immediate',
      reason: 'Laceration needing sutures under local anaesthesia.',
      transport: 'Nurse Escort',
    },
    followUp: {
      reviewDate: '2 Aug 2026', reviewTime: '11:00', reviewer: 'Mrs. Sofia Alvarez',
      purpose: 'Wound check and dressing change.', completedOn: '',
    },
    notes: 'Incident reported to the science department. Glassware handling briefing scheduled for the class.',
  },
  {
    id: 'MV-2026-0518', patient: 'Rohan Desai', reference: 'AD9889014 · Class IX C',
    personType: 'Student', group: 'IX C',
    guardian: 'Mrs. Priya Desai · Mother', contact: '+1 55 9930 4471',
    visitDate: '31 Jul 2026', visitTime: '15:20', consultationMinutes: 35,
    reason: 'Acute asthma flare', diagnosis: 'Moderate acute asthma',
    visitType: 'Emergency', condition: 'Respiratory',
    staff: 'Mrs. Sofia Alvarez', staffRole: 'Senior Nurse · NUR-2019-002',
    symptoms: [
      'Audible wheeze with speech in short phrases',
      'Oxygen saturation 93 percent on arrival',
      'Reliever inhaler left at home',
    ],
    vitals: {
      temperature: '36.8 °C', pulse: '118 bpm', bloodPressure: '116/74 mmHg',
      oxygen: '96%', respiration: '26 per minute', weight: '44.8 kg',
    },
    investigations: [],
    prescriptions: [
      { medication: 'Salbutamol inhaler', dose: '2 puffs', frequency: 'As needed', courseDays: 7 },
    ],
    courseFrom: '31 Jul 2026',
    referral: {
      id: 'REF-2026-0091', facility: 'Riverside Clinic', doctor: 'Emergency department',
      referredAt: '15:20', urgency: 'Immediate',
      reason: 'Moderate acute asthma not fully settling after two salbutamol nebulisers.',
      transport: 'Ambulance',
    },
    followUp: {
      reviewDate: '3 Aug 2026', reviewTime: '09:30', reviewer: 'Dr. Leena Fernandes',
      purpose: 'Asthma review and a written action plan.', completedOn: '',
    },
    notes: 'Sick room to hold a spare reliever inhaler under the school medication policy.',
  },
  {
    id: 'MV-2026-0524', patient: 'Meera Iyer', reference: 'AD9893660 · Class V A',
    personType: 'Student', group: 'V A',
    guardian: 'Mrs. Latha Iyer · Mother', contact: '+1 55 3390 8827',
    visitDate: '3 Aug 2026', visitTime: '10:30', consultationMinutes: 20,
    reason: 'Fever review after the sick room visit', diagnosis: 'To be assessed at the review',
    visitType: 'Follow-Up', condition: 'Respiratory',
    staff: 'Dr. Leena Fernandes', staffRole: 'Visiting Paediatrician · Riverside Clinic',
    symptoms: [
      'Fever and sore throat treated in the sick room on 31 Jul',
      'Guardian asked to report any return of the fever',
    ],
    vitals: {
      temperature: 'To be recorded', pulse: 'To be recorded', bloodPressure: 'To be recorded',
      oxygen: 'To be recorded', respiration: 'To be recorded', weight: 'To be recorded',
    },
    investigations: [],
    prescriptions: [],
    courseFrom: '',
    referral: null,
    followUp: null,
    notes: 'Booked from sick room visit VIS-2026-0426. Throat swab to be taken if the fever has returned.',
  },
];
