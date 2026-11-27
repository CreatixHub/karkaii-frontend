import { apiClient } from '@services/api/client';
import { ApiError } from '@services/api/errors';

const BASE = '/timetable-planner';

// ------------------------------------------------------------------ types

export interface Period {
  id: string;
  name: string;
  startsAt: string; // HH:MM
  endsAt: string;
  isBreak: boolean;
}
export interface DayType {
  id: string;
  name: string;
  days: number[]; // 1 (Mon) - 7 (Sun)
  periods: Period[];
}
export interface Bell {
  weekType: 'weekly';
  dayTypes: DayType[];
}

export interface RoomGroup {
  id: string;
  name: string;
}
export interface Room {
  id: string;
  name: string;
  groupId: string | null;
  capacity: number | null;
  type: string | null;
}

export interface BlockedSlot {
  day: number;
  period: number;
}
export type AvailabilityKind = 'staff' | 'section' | 'room';
export type Availability = Record<AvailabilityKind, Record<string, BlockedSlot[]>>;

export type RuleLevel = 'off' | 'low' | 'medium' | 'high' | 'critical';
export type RuleKey =
  | 'teacherMaxPerDay'
  | 'teacherLongDays'
  | 'teacherMinFreePerDay'
  | 'teacherMaxInRow'
  | 'teacherNoGaps'
  | 'classNoGaps'
  | 'classStartsPeriod1'
  | 'subjectSpread'
  | 'dayBalance';
export interface Rule {
  value: number | boolean;
  level: RuleLevel;
}
export type RuleSet = Partial<Record<RuleKey, Rule>>;
export interface Rules {
  defaults: RuleSet;
  teachers: Record<string, RuleSet>;
  sections: Record<string, RuleSet>;
}

export type RoomRuleType = 'none' | 'fixed' | 'oneOf' | 'any';
export interface LessonPart {
  id: string;
  label: string;
  isPractical?: boolean;
  pattern: { count: number; length: number }[];
  teacherIds: string[];
  mode: 'together' | 'one_of';
  room: { type: RoomRuleType; roomIds?: string[]; groupId?: string | null };
}
export interface Lesson {
  id: string;
  academicYearId: string;
  sectionIds: string[];
  subjectId: string | null;
  activityName: string | null;
  syncGroup: string | null;
  parts: LessonPart[];
}
export type LessonInput = Omit<Lesson, 'id' | 'academicYearId'>;

export interface SectionLookup {
  id: string;
  name: string;
  className?: string;
  classId?: string;
  capacity?: number;
  /** Left out of timetabling: no lessons are planned or generated for it, but its plan is kept. */
  excluded?: boolean;
}
export interface StaffLookup {
  id: string;
  name: string;
  staffType?: string;
  /** Teaching profile: every subject they can teach (primary first), the primary one, and the weekly limit (null = none). */
  subjectIds?: string[];
  primarySubjectId?: string | null;
  maxPeriodsPerWeek?: number | null;
  /** Periods a week the Teaching plan currently gives them. */
  plannedPeriods?: number;
}
export interface SubjectLookup {
  id: string;
  name: string;
  code?: string;
  subjectType?: string;
}
export interface Lookups {
  sections: SectionLookup[];
  staff: StaffLookup[];
  subjects: SubjectLookup[];
  defaultRules: Record<RuleKey, Rule>;
}

export interface VersionSummary {
  canRestore: boolean;
  id: string;
  name: string;
  status: 'draft' | 'published' | 'archived';
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
  generatedAt: string | null;
  publishedAt: string | null;
  seed: number;
  lessonCount: number;
}

export interface PlannerState {
  bell: Bell;
  rooms: Room[];
  roomGroups: RoomGroup[];
  availability: Availability;
  rules: Rules;
  lessons: Lesson[];
  versions: VersionSummary[];
  lookups: Lookups;
  dayLabels: Record<string, string>;
}

export interface Entry {
  id: string;
  blockId: string;
  unitKey: string;
  lessonId: string;
  partId: string;
  label: string;
  sectionId: string;
  subjectId: string | null;
  subjectName: string;
  teacherIds: string[];
  roomIds: string[];
  day: number;
  startNo: number;
  length: number;
  locked: boolean;
}
export interface Unplaced {
  blockId: string;
  lessonId: string;
  partId: string;
  sectionIds: string[];
  subjectName: string;
  length: number;
  teacherIds: string[];
  reasons: string[];
  /** A free slot exists: the lesson is simply not placed yet, so its reason is information, not an error. */
  placeable?: boolean;
}
export interface Stats {
  blocks: number;
  placedBlocks: number;
  totalPeriods: number;
  placedPeriods: number;
  penalty: number;
}
export interface InsightRow {
  sectionId: string;
  section: string;
  subjectName: string;
  teachers: string[];
  units: number;
  unitLength: number;
  actual: number[];
  ideal: string;
  poor: boolean;
  issue: string | null;
}
export interface Insights {
  perfect: number;
  poor: number;
  total: number;
  days: number[];
  rows: InsightRow[];
}
export interface WorkloadRow {
  teacherId: string;
  name: string;
  perDay: number[];
  total: number;
  max: number;
}
/** An empty period a class would notice, with the exact change that would fix it. */
export interface EmptyPeriod {
  kind: 'gap' | 'late_start' | 'unfilled' | 'blank';
  sectionId: string;
  section: string;
  day: number | null;
  period: number | null;
  count: number;
  message: string;
  fix: string;
}
export interface VersionDetail {
  version: VersionSummary;
  bell: Bell;
  days: number[];
  dayLabels: Record<string, string>;
  entries: Entry[];
  unplaced: Unplaced[];
  stats: Stats;
  insights: Insights;
  workload: WorkloadRow[];
  emptyPeriods?: EmptyPeriod[];
  dropped: { blockId: string; reason: string }[];
  criticalViolations?: string[];
  requiresRegeneration?: boolean;
  generation?: { ms: number; iterations: number; moves: number; seed: number; warnings: string[] };
}

export interface Readiness {
  ok: boolean;
  blocking: { code: string; message: string }[];
  warnings: { code: string; message: string }[];
  summary: { lessons: number; periods: number; sections: number; teachers: number; days: number };
}

export interface PublicationPreview {
  revision: string;
  academicYearId: string;
  sectionIds: string[];
  classEntries: number;
  classes: number;
  teacherEntries: number;
  teachers: number;
  periodRows: number;
  plannerEntriesReplaced: number;
  manualEntriesArchived: number;
  blockers: string[];
  unplaced: number;
}

export interface FitPosition {
  reasons?: string[];
  day: number;
  first: number;
  ok: boolean;
  softDelta: number | null;
  reason: string | null;
}

// ------------------------------------------------------------------ errors

/** The server words its refusals for people ("Ben is already teaching then."), so show them as written. */
export function plannerMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof ApiError) {
    const details = error.details as { message?: unknown } | undefined;
    if (typeof details?.message === 'string' && details.message) return details.message;
    if (error.status === 403) return 'You do not have permission to perform this timetable action.';
  }
  return error instanceof Error && error.message && !/^(Request failed|Failed to fetch)/i.test(error.message) ? error.message : fallback;
}

// ---------------------------------------------------------------- requests

/** Each planner request stays in the academic year selected when this API is created. */
export function createPlannerApi(academicYearId: string) {
  const query = { academicYearId };
  const scope = { query };
  const version = (id: string) => `${BASE}/versions/${encodeURIComponent(id)}`;
  const lesson = (id: string) => `${BASE}/lessons/${encodeURIComponent(id)}`;

  return {
    getState: (signal?: AbortSignal) => apiClient.get<PlannerState>(`${BASE}/state`, { query, signal }),
    saveBell: (bell: Bell) => apiClient.patch<Bell>(`${BASE}/bell`, bell, scope),
    updateRoom: (id: string, groupId: string | null) =>
      apiClient.patch<Room>(`${BASE}/rooms/${encodeURIComponent(id)}`, { groupId }, scope),
    createRoomGroup: (name: string) => apiClient.post<RoomGroup>(`${BASE}/room-groups`, { name }, scope),
    deleteRoomGroup: (id: string) => apiClient.delete<void>(`${BASE}/room-groups/${encodeURIComponent(id)}`, scope),
    saveAvailability: (kind: AvailabilityKind, id: string, blocked: BlockedSlot[]) =>
      apiClient.patch<{ blocked: BlockedSlot[] }>(`${BASE}/availability/${kind}/${encodeURIComponent(id)}`, { blocked }, scope),
    saveRules: (rules: Rules) => apiClient.patch<Rules>(`${BASE}/rules`, rules, scope),
    setSectionExcluded: (id: string, excluded: boolean) =>
      apiClient.patch<{ id: string; excluded: boolean }>(`${BASE}/sections/${encodeURIComponent(id)}/excluded`, { excluded }, scope),
    createLesson: (input: LessonInput) => apiClient.post<Lesson>(`${BASE}/lessons`, input, scope),
    updateLesson: (id: string, input: LessonInput) => apiClient.patch<Lesson>(lesson(id), input, scope),
    deleteLesson: (id: string) => apiClient.delete<void>(lesson(id), scope),
    copyLesson: (id: string, sectionIds: string[]) => apiClient.post<Lesson[]>(`${lesson(id)}/copy`, { sectionIds }, scope),
    getReadiness: () => apiClient.get<Readiness>(`${BASE}/readiness`, scope),
    generate: (options: { versionId?: string; budgetMs?: number; name?: string; keepPlaced?: boolean }) =>
      apiClient.post<VersionDetail>(`${BASE}/generate`, options, { query, timeoutMs: 60_000 }),
    createBlankVersion: (name?: string) => apiClient.post<VersionDetail>(`${BASE}/versions`, { name }, scope),
    getVersion: (id: string) => apiClient.get<VersionDetail>(version(id), scope),
    deleteVersion: (id: string) => apiClient.delete<void>(version(id), scope),
    renameVersion: (id: string, name: string) => apiClient.patch<VersionSummary>(version(id), { name }, scope),
    duplicateVersion: (id: string) => apiClient.post<VersionDetail>(`${version(id)}/duplicate`, {}, scope),
    getPublicationPreview: (id: string) => apiClient.get<PublicationPreview>(`${version(id)}/publish-preview`, scope),
    publishVersion: (id: string, input: { effectiveFrom?: string; revision?: string } = {}) =>
      apiClient.post<{ entries: number }>(`${version(id)}/publish`, input, scope),
    restorePublication: (id: string) => apiClient.post<{ restored: true }>(`${version(id)}/restore`, {}, scope),
    getTeacherAvailability: (id: string, blockId: string) =>
      apiClient.get<TeacherAvailabilityResult>(`${version(id)}/teacher-availability`, { query: { ...query, blockId } }),
    async getFit(id: string, blockId: string) {
      const result = await apiClient.get<{ positions: FitPosition[] }>(`${version(id)}/fit`, { query: { ...query, blockId } });
      return result.positions;
    },
    moveLesson: (id: string, blockId: string, day: number, startNo: number) =>
      apiClient.post<VersionDetail>(`${version(id)}/move`, { blockId, day, startNo }, scope),
    placeLesson: (id: string, blockId: string, day: number, startNo: number) =>
      apiClient.post<VersionDetail>(`${version(id)}/place`, { blockId, day, startNo }, scope),
    unscheduleLesson: (id: string, blockId: string) =>
      apiClient.post<VersionDetail>(`${version(id)}/unschedule`, { blockId }, scope),
    lockLesson: (id: string, blockId: string, locked: boolean) =>
      apiClient.post<VersionDetail>(`${version(id)}/lock`, { blockId, locked }, scope),
  };
}

export type PlannerApi = ReturnType<typeof createPlannerApi>;

export interface TeacherAvailabilityPeriod {
  no: number;
  state: 'free' | 'busy' | 'blocked';
  /** The class the teacher is with, when busy. */
  with?: string;
}
export interface TeacherAvailability {
  id: string;
  name: string;
  role: 'assigned' | 'primary' | 'additional';
  planned: number;
  max: number | null;
  atMax: boolean;
  days: { day: number; periods: TeacherAvailabilityPeriod[] }[];
}
export interface TeacherAvailabilityResult {
  blockId: string;
  subjectId: string | null;
  teachers: TeacherAvailability[];
}
// ----------------------------------------------------------------- helpers

export const DAY_SHORT: Record<number, string> = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 7: 'Sun' };
export const DAY_LONG: Record<number, string> = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' };

/** Teaching periods (breaks excluded) of the day type that covers `day`. */
export function teachingPeriods(bell: Bell, day: number): Period[] {
  const type = bell.dayTypes.find((d) => d.days.includes(day));
  return type ? type.periods.filter((p) => !p.isBreak) : [];
}

export function sectionLabel(sections: SectionLookup[], id: string): string {
  const s = sections.find((x) => x.id === id);
  return s ? `${s.className ? `${s.className} ` : ''}${s.name}`.trim() : id;
}
