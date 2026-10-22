export interface RuleTemplate {
  id: string;
  code: string;
  label: string;
  icon: string;
  /** The builder sub-heading, e.g. "Applies to all teaching staff". */
  scope: string;
}

export const ruleTemplates: RuleTemplate[] = [
  { id: 'working', code: 'ATR-01', label: 'Working Hours', icon: 'ti ti-clock-hour-9', scope: 'Applies to all teaching staff' },
  { id: 'grace', code: 'ATR-02', label: 'Grace Time', icon: 'ti ti-hourglass-low', scope: 'Applies to all employees' },
  { id: 'late', code: 'ATR-03', label: 'Late Arrival', icon: 'ti ti-alarm', scope: 'Applies to all employees' },
  { id: 'early', code: 'ATR-04', label: 'Early Exit', icon: 'ti ti-door-exit', scope: 'Applies to all employees' },
  { id: 'half', code: 'ATR-05', label: 'Half Day', icon: 'ti ti-circle-half-2', scope: 'Applies to all employees' },
  { id: 'ot', code: 'ATR-06', label: 'Overtime', icon: 'ti ti-clock-plus', scope: 'Applies to non-teaching staff' },
  { id: 'weekend', code: 'ATR-07', label: 'Weekend Rule', icon: 'ti ti-calendar-week', scope: 'Applies to all employees' },
  { id: 'holiday', code: 'ATR-08', label: 'Holiday Rule', icon: 'ti ti-beach', scope: 'Applies to all employees' },
  { id: 'bio', code: 'ATR-09', label: 'Biometric Rule', icon: 'ti ti-fingerprint', scope: 'Applies to all employees' },
  { id: 'rfid', code: 'ATR-10', label: 'RFID Rule', icon: 'ti ti-nfc', scope: 'Applies to all employees' },
];

export interface RuleSettings {
  active: boolean;
  /* Shift Timing */
  startTime: string;
  endTime: string;
  minimumHours: string;
  breakDuration: string;
  /* Grace & Tolerance */
  gracePeriod: string;
  markLateAfter: string;
  earlyExitBefore: string;
  halfDayBelow: string;
  lateAllowed: string;
  actionOnExceeding: string;
  /* Applicable To */
  employeeCategory: string;
  department: string;
  effectiveFrom: string;
  workingDays: string[];
  /* Capture & Enforcement */
  primaryCapture: string;
  fallbackCapture: string;
  autoMarkAbsent: boolean;
  allowManualOverride: boolean;
}

/** Exactly the values the template's Working Hours builder shipped with. */
export const defaultSettings: RuleSettings = {
  active: true,
  startTime: '09:00',
  endTime: '16:30',
  minimumHours: '6.5',
  breakDuration: '45',
  gracePeriod: '15',
  markLateAfter: '09:15',
  earlyExitBefore: '16:00',
  halfDayBelow: '4',
  lateAllowed: '3 occurrences',
  actionOnExceeding: 'Deduct half day leave',
  employeeCategory: 'Teaching Staff',
  department: 'All Departments',
  effectiveFrom: '01-04-2026',
  workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  primaryCapture: 'Biometric',
  fallbackCapture: 'RFID Card',
  autoMarkAbsent: true,
  allowManualOverride: true,
};

export const lateAllowedOptions = ['2 occurrences', '3 occurrences', '5 occurrences'];

export const actionOptions = [
  'Deduct half day leave',
  'Deduct full day leave',
  'Notify department head only',
];

export const employeeCategoryOptions = ['Teaching Staff', 'Non-Teaching Staff', 'All Employees'];

export const departmentOptions = ['All Departments', 'Languages', 'Science', 'Mathematics'];

export const primaryCaptureOptions = ['Biometric', 'RFID Card', 'Mobile Check-in'];

export const fallbackCaptureOptions = ['RFID Card', 'Manual entry by HR', 'None'];

export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export type AccordionId = 'timing' | 'grace' | 'scope' | 'capture';

export const accordionSections: { id: AccordionId; icon: string; title: string }[] = [
  { id: 'timing', icon: 'ti ti-clock', title: 'Shift Timing' },
  { id: 'grace', icon: 'ti ti-hourglass-low', title: 'Grace & Tolerance' },
  { id: 'scope', icon: 'ti ti-users-group', title: 'Applicable To' },
  { id: 'capture', icon: 'ti ti-fingerprint', title: 'Capture & Enforcement' },
];

/* --------------------------------- Preview --------------------------------- */

/** "09:15" → 555, so the preview can state real minute deltas. */
const toMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
};

/** "09:28" → "09:28 AM", the 12-hour form the preview cards print. */
const to12Hour = (value: string): string => {
  const [hours, minutes] = value.split(':').map(Number);
  const meridiem = hours >= 12 ? 'PM' : 'AM';
  const hour = hours % 12 === 0 ? 12 : hours % 12;
  return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${meridiem}`;
};

export interface PreviewCard {
  id: string;
  icon: string;
  headline: string;
  detail: string;
  badge: { label: string; icon: string; tone: string };
}

/**
 * The template's four preview cards were fixed prose that quoted the default
 * settings ("15 minute grace window", "4 hour half day threshold"). They are
 * computed from the live settings here, so editing a field updates the preview
 * instead of leaving it contradicting the form above it.
 */
export const buildPreview = (settings: RuleSettings): PreviewCard[] => {
  const graceEnd = toMinutes(settings.markLateAfter);
  const lateExample = graceEnd + 13;
  const lateExampleTime = `${String(Math.floor(lateExample / 60)).padStart(2, '0')}:${String(lateExample % 60).padStart(2, '0')}`;
  const onTimeExample = Math.max(toMinutes(settings.startTime), graceEnd - 3);
  const onTimeTime = `${String(Math.floor(onTimeExample / 60)).padStart(2, '0')}:${String(onTimeExample % 60).padStart(2, '0')}`;
  const earlyExit = toMinutes(settings.earlyExitBefore) - 20;
  const earlyExitTime = `${String(Math.floor(earlyExit / 60)).padStart(2, '0')}:${String(earlyExit % 60).padStart(2, '0')}`;
  const allowed = settings.lateAllowed.split(' ')[0];

  return [
    {
      id: 'present',
      icon: 'ti ti-login',
      headline: `Check in ${to12Hour(onTimeTime)}`,
      detail: `Inside the ${settings.gracePeriod} minute grace window · ${settings.startTime} – ${settings.markLateAfter}`,
      badge: { label: 'Present', icon: 'ti ti-circle-check', tone: 'success' },
    },
    {
      id: 'late',
      icon: 'ti ti-login',
      headline: `Check in ${to12Hour(lateExampleTime)}`,
      detail: `13 minutes past the grace window · 1 of ${allowed} allowed this month`,
      badge: { label: 'Late Arrival', icon: 'ti ti-alert-triangle', tone: 'warning' },
    },
    {
      id: 'half',
      icon: 'ti ti-hourglass',
      headline: 'Worked 3 hrs 10 min',
      detail: `Below the ${settings.halfDayBelow} hour half day threshold`,
      badge: { label: 'Half Day', icon: 'ti ti-circle-half-2', tone: 'danger' },
    },
    {
      id: 'early',
      icon: 'ti ti-logout',
      headline: `Check out ${to12Hour(earlyExitTime)}`,
      detail: `20 minutes before the ${settings.earlyExitBefore} early exit limit`,
      badge: { label: 'Early Exit', icon: 'ti ti-door-exit', tone: 'warning' },
    },
  ];
};

export interface RelatedRule {
  icon: string;
  tint: string;
  title: string;
  note: string;
}

/** The downstream chain, whose first two steps quote the live thresholds. */
export const buildRelatedRules = (settings: RuleSettings): RelatedRule[] => {
  const allowed = Number(settings.lateAllowed.split(' ')[0]) || 3;
  return [
    { icon: 'ti ti-alarm', tint: 'warning', title: 'Late Arrival', note: `Punch after ${to12Hour(settings.markLateAfter)}` },
    { icon: 'ti ti-circle-half-2', tint: 'danger', title: 'Half Day', note: `${allowed + 1}th late arrival in a month` },
    { icon: 'ti ti-calendar-minus', tint: 'info', title: 'Leave Deduction', note: '0.5 day from casual leave' },
    { icon: 'ti ti-cash', tint: 'success', title: 'Payroll Impact', note: 'Applied in the next cycle' },
  ];
};
