import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { MealName, MealPlan } from '../data/mealPlans.data';
import {
  audienceOptions,
  billingModeOptions,
  cafeteriaOptions,
  cafeteriaPairsOf,
  compactOf,
  dailyMenuOf,
  archiveReasonOptions,
  daysCoveredOptions,
  dietaryOptions,
  duplicateStatusOptions,
  durationOptions,
  durationStyle,
  mealNames,
  mealsLabel,
  nutritionPairsOf,
  schedulePairsOf,
  statusBadge,
  summaryOf,
  targetGroupOptions,
} from '../data/mealPlans.data';

export type PlanModalId = 'create' | 'edit' | 'assign' | 'duplicate' | 'archive' | 'view';

export interface PlanDraft {
  name: string;
  code: string;
  duration: string;
  audience: string;
  cafeteria: string;
  meals: MealName[];
  windows: Record<MealName, string>;
  effectiveFrom: string;
  effectiveTo: string;
  ratePerDay: string;
  ratePerMonth: string;
  dietary: string;
  daysCovered: string;
  notes: string;
  publish: boolean;
  billing: boolean;
}

const defaultWindows: Record<MealName, string> = {
  Breakfast: '07:30', Lunch: '12:30', Snacks: '16:00', Dinner: '19:30',
};

export const emptyDraft: PlanDraft = {
  name: '', code: '', duration: durationOptions[1], audience: audienceOptions[0],
  cafeteria: cafeteriaOptions[0], meals: ['Breakfast', 'Lunch', 'Snacks'],
  windows: { ...defaultWindows }, effectiveFrom: '03-08-2026', effectiveTo: '31-03-2027',
  ratePerDay: '', ratePerMonth: '', dietary: dietaryOptions[0], daysCovered: daysCoveredOptions[0],
  notes: '', publish: true, billing: true,
};

/** "07:30 – 09:00 AM" → "07:30", the 24-hour value the form's inputs carry. */
const toInputTime = (window: string): string => {
  const match = /^(\d{1,2}):(\d{2})\s*(?:–|-)?\s*(?:\d{1,2}:\d{2})?\s*(AM|PM)?/i.exec(window.trim());
  if (!match) return '07:30';
  let hour = Number(match[1]);
  const meridiem = /PM\s*$/i.test(window) && !/AM\s*–/i.test(window) ? 'PM' : match[3];
  if (meridiem?.toUpperCase() === 'PM' && hour < 12) hour += 12;
  return `${String(hour).padStart(2, '0')}:${match[2]}`;
};

export const draftOf = (row: MealPlan): PlanDraft => ({
  name: row.name,
  code: row.code,
  duration: row.duration,
  audience: row.audience,
  cafeteria: cafeteriaOptions.find((option) => row.cafeteria.startsWith(option.split(' ')[0]))
    ?? cafeteriaOptions[0],
  meals: mealNames.filter((meal) => row.meals[meal].included),
  windows: mealNames.reduce(
    (windows, meal) => ({
      ...windows,
      [meal]: row.meals[meal].included ? toInputTime(row.meals[meal].window) : defaultWindows[meal],
    }),
    {} as Record<MealName, string>,
  ),
  effectiveFrom: '03-08-2026',
  effectiveTo: '31-03-2027',
  ratePerDay: (row.rate.match(/\$([\d.]+)\s*\/\s*day/) ?? [, ''])[1] ?? '',
  ratePerMonth: (row.rate.match(/\$([\d.]+)\s*\/\s*month/) ?? [, ''])[1] ?? '',
  dietary: row.dietary[0]?.label.replace(' option', '') ?? dietaryOptions[0],
  daysCovered: row.daysCovered,
  notes: row.notes,
  publish: row.status !== 'Draft',
  billing: row.status === 'Active',
});

export interface PlanModalsProps {
  active: PlanModalId | null;
  row: MealPlan | null;
  /** Every other plan, for the Archive dialog's hand-over list. */
  otherPlans: string[];
  onClose: () => void;
  onCreate: (draft: PlanDraft) => void;
  onUpdate: (draft: PlanDraft) => void;
  onAssign: (group: string, from: string, billingMode: string) => void;
  onDuplicate: (name: string, duration: string, audience: string, status: string) => void;
  onArchive: (reason: string, from: string, moveTo: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** The View dialog hands off to Duplicate and to the offcanvas. */
  onOpen: (modal: PlanModalId) => void;
  onOpenPanel: () => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: PlanDraft;
  onField: (field: keyof PlanDraft, value: string | string[] | boolean) => void;
  onWindow: (meal: MealName, value: string) => void;
  suffix: string;
}

const PlanForm = ({ draft, onField, onWindow, suffix }: FormProps) => {
  const toggleMeal = (meal: MealName) =>
    onField('meals', draft.meals.includes(meal)
      ? draft.meals.filter((entry) => entry !== meal)
      : [...draft.meals, meal]);

  return (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-name${suffix}`}>Plan Name</label>
        <input
          type="text" className="form-control" id={`plan-name${suffix}`}
          placeholder="e.g. Standard Student Weekly"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-code${suffix}`}>Plan Code</label>
        <input
          type="text" className="form-control" id={`plan-code${suffix}`}
          placeholder="Auto-generated if left blank"
          value={draft.code} onChange={(event) => onField('code', event.target.value)}
        />
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-duration${suffix}`}>Plan Duration</label>
        <select
          className="form-select" id={`plan-duration${suffix}`}
          value={draft.duration} onChange={(event) => onField('duration', event.target.value)}
        >
          {durationOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-audience${suffix}`}>Applicable For</label>
        <select
          className="form-select" id={`plan-audience${suffix}`}
          value={draft.audience} onChange={(event) => onField('audience', event.target.value)}
        >
          {audienceOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-cafeteria${suffix}`}>Assigned Cafeteria</label>
        <select
          className="form-select" id={`plan-cafeteria${suffix}`}
          value={draft.cafeteria} onChange={(event) => onField('cafeteria', event.target.value)}
        >
          {cafeteriaOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label">Meals Included</label>
        <div className="d-flex flex-wrap gap-3">
          {mealNames.map((meal) => (
            <div className="form-check" key={meal}>
              <input
                className="form-check-input" type="checkbox" id={`plan-meal-${meal}${suffix}`}
                checked={draft.meals.includes(meal)} onChange={() => toggleMeal(meal)}
              />
              <label className="form-check-label fs-13" htmlFor={`plan-meal-${meal}${suffix}`}>{meal}</label>
            </div>
          ))}
        </div>
      </div></div>
      {mealNames.map((meal) => (
        <div className="col-md-3" key={meal}><div className="mb-3">
          <label className="form-label" htmlFor={`plan-window-${meal}${suffix}`}>{meal}</label>
          {/* A serving time only means something once its meal is on the plan. */}
          <input
            type="time" className="form-control" id={`plan-window-${meal}${suffix}`}
            value={draft.windows[meal]} disabled={!draft.meals.includes(meal)}
            onChange={(event) => onWindow(meal, event.target.value)}
          />
        </div></div>
      ))}
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-from${suffix}`}>Effective From</label>
        <DateField
          id={`plan-from${suffix}`} value={draft.effectiveFrom}
          onChange={(value) => onField('effectiveFrom', value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-to${suffix}`}>Effective To</label>
        <DateField
          id={`plan-to${suffix}`} value={draft.effectiveTo}
          onChange={(value) => onField('effectiveTo', value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-rate${suffix}`}>Rate per Day</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number" className="form-control" id={`plan-rate${suffix}`} min={0} step="0.05"
            value={draft.ratePerDay} onChange={(event) => onField('ratePerDay', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-month${suffix}`}>Rate per Month</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number" className="form-control" id={`plan-month${suffix}`} min={0}
            value={draft.ratePerMonth} onChange={(event) => onField('ratePerMonth', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-dietary${suffix}`}>Dietary Preference</label>
        <select
          className="form-select" id={`plan-dietary${suffix}`}
          value={draft.dietary} onChange={(event) => onField('dietary', event.target.value)}
        >
          {dietaryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-days${suffix}`}>Days Covered</label>
        <select
          className="form-select" id={`plan-days${suffix}`}
          value={draft.daysCovered} onChange={(event) => onField('daysCovered', event.target.value)}
        >
          {daysCoveredOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`plan-notes${suffix}`}>Internal Notes</label>
        <textarea
          className="form-control" rows={2} id={`plan-notes${suffix}`}
          placeholder="Visible to the catering office"
          value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
        />
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`cpPublish${suffix}`}
            checked={draft.publish} onChange={(event) => onField('publish', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`cpPublish${suffix}`}>
            Publish to the menu board and the student app
          </label>
        </div>
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`cpBilling${suffix}`}
            checked={draft.billing} onChange={(event) => onField('billing', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`cpBilling${suffix}`}>
            Add the plan rate to cafeteria billing
          </label>
        </div>
      </div>
    </div>
  );
};

/** The label/value line the dialogs share. */
const Row = ({ label, value, last = false }: { label: string; value: string; last?: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const PlanModals = ({
  active, row, otherPlans, onClose, onCreate, onUpdate, onAssign, onDuplicate, onArchive,
  onToast, onOpen, onOpenPanel,
}: PlanModalsProps) => {
  const [draft, setDraft] = useState<PlanDraft>(emptyDraft);
  const [group, setGroup] = useState(targetGroupOptions[0]);
  const [assignFrom, setAssignFrom] = useState('01-08-2026');
  const [assignTo, setAssignTo] = useState('31-03-2027');
  const [billingMode, setBillingMode] = useState(billingModeOptions[0]);
  const [replaces, setReplaces] = useState('None');
  const [assignRemarks, setAssignRemarks] = useState('');
  const [override, setOverride] = useState(false);
  const [notifyGuardian, setNotifyGuardian] = useState(true);

  const [copyName, setCopyName] = useState('');
  const [copyDuration, setCopyDuration] = useState<string>(durationOptions[0]);
  const [copyAudience, setCopyAudience] = useState<string>(audienceOptions[0]);
  const [copyFrom, setCopyFrom] = useState('03-08-2026');
  const [copyStatus, setCopyStatus] = useState<string>(duplicateStatusOptions[0]);
  const [copySchedule, setCopySchedule] = useState(true);
  const [copyNutrition, setCopyNutrition] = useState(true);
  const [copyEnrol, setCopyEnrol] = useState(false);

  const [reason, setReason] = useState(archiveReasonOptions[0]);
  const [archiveFrom, setArchiveFrom] = useState('30-06-2026');
  const [moveTo, setMoveTo] = useState('No replacement');
  const [archiveNotes, setArchiveNotes] = useState('');
  const [notifyKitchen, setNotifyKitchen] = useState(true);

  /** Each opening seeds from the row being acted on, or a blank sheet for Create. */
  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'assign' && row) {
      setGroup(targetGroupOptions[0]);
      setAssignFrom('01-08-2026');
      setAssignTo('31-03-2027');
      setBillingMode(billingModeOptions[0]);
      setReplaces('None');
      setAssignRemarks('');
    }
    if (active === 'duplicate' && row) {
      setCopyName(`${row.name} (Copy)`);
      setCopyDuration(row.duration);
      setCopyAudience(row.audience);
      setCopyFrom('03-08-2026');
      setCopyStatus(duplicateStatusOptions[0]);
    }
    if (active === 'archive' && row) {
      setReason(archiveReasonOptions[0]);
      setArchiveFrom('30-06-2026');
      setMoveTo(otherPlans[0] ?? 'No replacement');
      setArchiveNotes('');
    }
  }, [active, otherPlans, row]);

  const field = (key: keyof PlanDraft, value: string | string[] | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const setWindow = (meal: MealName, value: string) =>
    setDraft((current) => ({ ...current, windows: { ...current.windows, [meal]: value } }));

  return (
    <>
      {/* Create Meal Plan */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create Meal Plan"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create Plan</button>
          </>
        }
      >
        <PlanForm draft={draft} onField={field} onWindow={setWindow} suffix="" />
      </Modal>

      {/* Edit Meal Plan */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Meal Plan"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <PlanForm draft={draft} onField={field} onWindow={setWindow} suffix="-2" />
      </Modal>

      {/* Assign Meal Plan */}
      <Modal
        open={active === 'assign' && row !== null}
        onClose={onClose}
        title="Assign Meal Plan"
        onSubmit={(event) => { event.preventDefault(); onAssign(group, assignFrom, billingMode); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Plan</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span
                className={`avatar avatar-md bg-${durationStyle[row.duration].tint}-transparent text-${durationStyle[row.duration].tint} rounded flex-shrink-0`}
              >
                <i className={durationStyle[row.duration].icon} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.name}</h5>
                <span className="fs-12 text-muted">{compactOf(row)}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="target-group">Target Group</label>
                <select
                  className="form-select" id="target-group"
                  value={group} onChange={(event) => setGroup(event.target.value)}
                >
                  {targetGroupOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="assign-from">Effective From</label>
                <DateField id="assign-from" value={assignFrom} onChange={setAssignFrom} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="assign-to">Effective To</label>
                <DateField id="assign-to" value={assignTo} onChange={setAssignTo} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="billing-mode">Billing Mode</label>
                <select
                  className="form-select" id="billing-mode"
                  value={billingMode} onChange={(event) => setBillingMode(event.target.value)}
                >
                  {billingModeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="replaces-plan">Replaces Plan</label>
                <select
                  className="form-select" id="replaces-plan"
                  value={replaces} onChange={(event) => setReplaces(event.target.value)}
                >
                  <option>None</option>
                  {otherPlans.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="assign-remarks">Remarks</label>
                <textarea
                  className="form-control" rows={2} id="assign-remarks"
                  placeholder="Recorded against the assignment"
                  value={assignRemarks} onChange={(event) => setAssignRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="apOverride"
                    checked={override} onChange={(event) => setOverride(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="apOverride">
                    Override any special diet plan already assigned
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="apNotifyGuardian"
                    checked={notifyGuardian} onChange={(event) => setNotifyGuardian(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="apNotifyGuardian">
                    Email the plan schedule to guardians
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Duplicate Meal Plan */}
      <Modal
        open={active === 'duplicate' && row !== null}
        onClose={onClose}
        title="Duplicate Meal Plan"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate(copyName, copyDuration, copyAudience, copyStatus);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Duplicate Plan</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span
                className={`avatar avatar-md bg-${durationStyle[row.duration].tint}-transparent text-${durationStyle[row.duration].tint} rounded flex-shrink-0`}
              >
                <i className={durationStyle[row.duration].icon} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.name}</h5>
                <span className="fs-12 text-muted">{compactOf(row)}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="new-plan-name">New Plan Name</label>
                <input
                  type="text" className="form-control" id="new-plan-name"
                  value={copyName} onChange={(event) => setCopyName(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copy-duration">Plan Duration</label>
                <select
                  className="form-select" id="copy-duration"
                  value={copyDuration} onChange={(event) => setCopyDuration(event.target.value)}
                >
                  {durationOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copy-audience">Applicable For</label>
                <select
                  className="form-select" id="copy-audience"
                  value={copyAudience} onChange={(event) => setCopyAudience(event.target.value)}
                >
                  {audienceOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copy-from">Effective From</label>
                <DateField id="copy-from" value={copyFrom} onChange={setCopyFrom} />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copy-status">Status</label>
                <select
                  className="form-select" id="copy-status"
                  value={copyStatus} onChange={(event) => setCopyStatus(event.target.value)}
                >
                  {duplicateStatusOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="dpSchedule"
                    checked={copySchedule} onChange={(event) => setCopySchedule(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="dpSchedule">
                    Copy the meal schedule and serving windows
                  </label>
                </div>
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="dpNutrition"
                    checked={copyNutrition} onChange={(event) => setCopyNutrition(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="dpNutrition">
                    Copy nutrition, dietary and allergen data
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="dpEnrol"
                    checked={copyEnrol} onChange={(event) => setCopyEnrol(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="dpEnrol">
                    Carry over the enrolled members
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Archive Meal Plan */}
      <Modal
        open={active === 'archive' && row !== null}
        onClose={onClose}
        title="Archive Meal Plan"
        onSubmit={(event) => { event.preventDefault(); onArchive(reason, archiveFrom, moveTo); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Plan</button>
            <button type="submit" className="btn btn-danger">Archive Plan</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Archiving stops the plan from the date below and closes its cafeteria billing.
              </span>
            </div>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span
                  className={`avatar avatar-md bg-${durationStyle[row.duration].tint}-transparent text-${durationStyle[row.duration].tint} rounded flex-shrink-0`}
                >
                  <i className={durationStyle[row.duration].icon} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.name}</h5>
                  <span className="fs-12 text-muted">{compactOf(row)}</span>
                </div>
                <div className="ms-auto text-end">
                  <span className="fs-12 text-muted d-block">Still Enrolled</span>
                  <span className="fs-16 fw-semibold">{row.enrolled ?? 0}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="archive-reason">Reason</label>
                <select
                  className="form-select" id="archive-reason"
                  value={reason} onChange={(event) => setReason(event.target.value)}
                >
                  {archiveReasonOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="archive-from">Archive From</label>
                <DateField id="archive-from" value={archiveFrom} onChange={setArchiveFrom} />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="move-members">Move Enrolled Members To</label>
                <select
                  className="form-select" id="move-members"
                  value={moveTo} onChange={(event) => setMoveTo(event.target.value)}
                >
                  {otherPlans.map((option) => <option key={option}>{option}</option>)}
                  <option>No replacement</option>
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="archive-notes">Internal Notes</label>
                <textarea
                  className="form-control" rows={2} id="archive-notes"
                  placeholder="Recorded against the plan"
                  value={archiveNotes} onChange={(event) => setArchiveNotes(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="ampNotify"
                    checked={notifyKitchen} onChange={(event) => setNotifyKitchen(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="ampNotify">
                    Notify the kitchen and update cafeteria billing
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Meal Plan */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.name ?? 'Meal plan'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('duplicate')}>
              <i className="ti ti-copy me-1" />Duplicate
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-salad me-1" />Open Plan Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">{summaryOf(row)}</p>
            <div className="row g-3 mb-3">
              {[
                { label: 'Enrolled', value: row.enrolled === null ? 'Walk-in' : String(row.enrolled) },
                { label: 'Per Day', value: row.energy },
                { label: 'Rate', value: row.rate.split('·')[0].trim() },
                { label: 'Meals', value: mealsLabel(row) },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3">
                    <span className="fs-12 text-muted d-block">{tile.label}</span>
                    <h5 className="fs-14 mb-0 text-truncate">{tile.value}</h5>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Meal Schedule</h6>
                <div className="border rounded p-3">
                  {schedulePairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Nutrition per Day</h6>
                <div className="border rounded p-3">
                  {nutritionPairsOf(row).map((pair, index, all) => (
                    <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <h6 className="fs-13 mb-2">Daily Menu</h6>
            {dailyMenuOf(row).map((line) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={line.meal}>
                <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className="ti ti-tools-kitchen-2" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{line.meal}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{line.dish} · {line.note}</span>
                </div>
              </div>
            ))}

            <h6 className="fs-13 mb-2 mt-3">Dietary Preferences &amp; Allergens</h6>
            <div className="d-flex flex-wrap gap-1 mb-2">
              {row.dietary.map((tag) => (
                <span className={`badge badge-soft-${tag.tint}`} key={tag.label}>{tag.label}</span>
              ))}
              <span className={`${statusBadge[row.status]} ms-auto`}>{row.status}</span>
            </div>
            <p className="fs-12 text-muted mb-3">
              Contains {row.contains.toLowerCase()} · free from {row.freeFrom.toLowerCase()}.
            </p>

            <div className="border rounded p-3">
              {cafeteriaPairsOf(row).map((pair, index, all) => (
                <Row key={pair.label} label={pair.label} value={pair.value} last={index === all.length - 1} />
              ))}
            </div>

            <button
              type="button" className="btn btn-link p-0 fs-12 mt-2"
              onClick={() => onToast(`${row.name} schedule printed`, 'info')}
            >
              Print the plan schedule
            </button>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default PlanModals;
