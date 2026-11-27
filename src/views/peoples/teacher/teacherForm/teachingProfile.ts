import type { StaffRecord, TeachingProfilePayload } from '@services/staff/staff.api';

export const WEEKLY_PERIOD_LIMIT = 35;

export interface ProfileValues {
  primary: string;
  additional: string[];
  max: string;
}

export const EMPTY_PROFILE: ProfileValues = { primary: '', additional: [], max: '' };

const MAX_PERIODS_MESSAGE =
  'Maximum periods per week must be a whole number from 1 to 35, or left blank.';

function additionalSubjects(ids: string[], primary: string) {
  return [...new Set(ids)].filter((id) => id && id !== primary);
}

export function profileFromStaff(staff: StaffRecord): ProfileValues {
  const primary = staff.primarySubjectId == null ? '' : String(staff.primarySubjectId);
  return {
    primary,
    additional: additionalSubjects((staff.additionalSubjectIds ?? []).map(String), primary),
    max: staff.maxPeriodsPerWeek == null ? '' : String(staff.maxPeriodsPerWeek),
  };
}

export function readProfile(profile: ProfileValues): { payload: TeachingProfilePayload } | { error: string } {
  const text = profile.max.trim();
  const max = text ? Number(text) : null;
  if (max !== null && (!/^\d+$/.test(text) || max < 1 || max > WEEKLY_PERIOD_LIMIT)) {
    return { error: MAX_PERIODS_MESSAGE };
  }

  return {
    payload: {
      primarySubjectId: profile.primary || null,
      additionalSubjectIds: additionalSubjects(profile.additional, profile.primary),
      maxPeriodsPerWeek: max,
    },
  };
}

export function updatedProfile(profile: TeachingProfilePayload, previous: ProfileValues): Partial<TeachingProfilePayload> {
  const changes: Partial<TeachingProfilePayload> = {};
  if (profile.primarySubjectId !== (previous.primary || null)) {
    changes.primarySubjectId = profile.primarySubjectId;
  }
  if (
    profile.additionalSubjectIds.length !== previous.additional.length ||
    profile.additionalSubjectIds.some((id) => !previous.additional.includes(id))
  ) {
    changes.additionalSubjectIds = profile.additionalSubjectIds;
  }
  if (profile.maxPeriodsPerWeek !== (previous.max ? Number(previous.max) : null)) {
    changes.maxPeriodsPerWeek = profile.maxPeriodsPerWeek;
  }
  return changes;
}
