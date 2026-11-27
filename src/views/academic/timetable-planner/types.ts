import type { ToastVariant } from '@hooks/useToasts';
import type { PlannerApi, PlannerState } from '@services/timetable/planner.api';

export type StepEdits = { saving: boolean; save?: () => Promise<boolean> };

export interface StepProps {
  api: PlannerApi;
  setEdits: (edits: StepEdits | null) => void;
  go: (step: StepId) => void;
  state: PlannerState;
  /** Fetch the planner state again after a change. */
  reload: () => Promise<void>;
  notify: (message: string, variant?: ToastVariant, durationMs?: number) => void;
}

export const STEPS = [
  { id: 'bell', label: 'Bell schedule' },
  { id: 'setup', label: 'Rooms & availability' },
  { id: 'plan', label: 'Teaching plan' },
  { id: 'rules', label: 'Rules' },
  { id: 'generate', label: 'Generate & edit' },
] as const;
export type StepId = (typeof STEPS)[number]['id'];

/** A stable pastel colour per subject, so a subject looks the same in every view. */
export function subjectColors(name: string): { bg: string; border: string } {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  return { bg: `hsl(${hue} 80% 93%)`, border: `hsl(${hue} 60% 48%)` };
}
