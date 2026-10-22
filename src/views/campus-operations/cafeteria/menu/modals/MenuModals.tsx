import { useEffect, useMemo, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import type { MealType, MenuItem } from '../data/menuItems.data';
import {
  allergenChoices,
  archiveReasonOptions,
  availabilityOptions,
  caloriesLabel,
  categoryOptions,
  compactOf,
  dayLabel,
  daysPerWeek,
  dietaryOptions,
  mealStyle,
  mealTypeOptions,
  nutritionPairsOf,
  openingLabel,
  plannerAppliesOptions,
  plannerCopyOptions,
  priceLabel,
  replacementOptions,
  shortDays,
  statusBadge,
  summaryOf,
} from '../data/menuItems.data';

export type MenuModalId = 'add' | 'edit' | 'duplicate' | 'planner' | 'archive' | 'view';

export interface MenuDraft {
  name: string;
  category: string;
  mealType: string;
  from: string;
  to: string;
  days: string[];
  price: string;
  staffPrice: string;
  calories: string;
  portion: string;
  protein: string;
  carbs: string;
  fat: string;
  fibre: string;
  dietary: string[];
  allergens: string[];
  available: boolean;
  board: boolean;
}

export const emptyDraft: MenuDraft = {
  name: '', category: categoryOptions[0], mealType: mealTypeOptions[0], from: '07:30', to: '09:00',
  days: ['Mon', 'Wed', 'Fri'], price: '', staffPrice: '', calories: '', portion: '',
  protein: '', carbs: '', fat: '', fibre: '', dietary: ['Veg'], allergens: ['None'],
  available: true, board: true,
};

export const draftOf = (row: MenuItem): MenuDraft => ({
  name: row.name,
  category: row.category,
  mealType: row.mealType,
  from: row.from,
  to: row.to,
  days: [...row.days],
  price: row.price.toFixed(2),
  staffPrice: row.staffPrice.toFixed(2),
  calories: String(row.nutrition.calories),
  portion: row.portion,
  protein: String(row.nutrition.protein),
  carbs: String(row.nutrition.carbs),
  fat: String(row.nutrition.fat),
  fibre: String(row.nutrition.fibre),
  dietary: row.tags.map((tag) => tag.label),
  allergens: row.contains === 'None declared' ? ['None'] : [row.contains.split('·')[0].trim()],
  available: row.availability !== 'Archived' && row.availability !== 'Out of Stock',
  board: true,
});

export interface MenuModalsProps {
  active: MenuModalId | null;
  row: MenuItem | null;
  /** Every item on the page, for the planner grid. */
  rows: MenuItem[];
  onClose: () => void;
  onCreate: (draft: MenuDraft) => void;
  onUpdate: (draft: MenuDraft) => void;
  onDuplicate: (name: string, mealType: string, day: string, price: string, availability: string) => void;
  onSavePlanner: (week: string, appliesTo: string) => void;
  onArchive: (reason: string, from: string, replacement: string) => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** The View dialog hands off to Duplicate and to the offcanvas. */
  onOpen: (modal: MenuModalId) => void;
  onOpenPanel: () => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: MenuDraft;
  onField: (field: keyof MenuDraft, value: string | string[] | boolean) => void;
  /** Keeps input ids unique between the Add and Edit dialogs. */
  suffix: string;
}

const MenuForm = ({ draft, onField, suffix }: FormProps) => {
  const toggleDay = (day: string) =>
    onField('days', draft.days.includes(day)
      ? draft.days.filter((entry) => entry !== day)
      : [...draft.days, day]);

  return (
    <div className="row">
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-name${suffix}`}>Menu Item</label>
        <input
          type="text" className="form-control" id={`menu-name${suffix}`} placeholder="e.g. Masala Dosa"
          value={draft.name} onChange={(event) => onField('name', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-category${suffix}`}>Menu Category</label>
        <select
          className="form-select" id={`menu-category${suffix}`}
          value={draft.category} onChange={(event) => onField('category', event.target.value)}
        >
          {categoryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-meal${suffix}`}>Meal Type</label>
        <select
          className="form-select" id={`menu-meal${suffix}`}
          value={draft.mealType} onChange={(event) => onField('mealType', event.target.value)}
        >
          {mealTypeOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-from${suffix}`}>Serving From</label>
        <input
          type="time" className="form-control" id={`menu-from${suffix}`}
          value={draft.from} onChange={(event) => onField('from', event.target.value)}
        />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-to${suffix}`}>Serving To</label>
        <input
          type="time" className="form-control" id={`menu-to${suffix}`}
          value={draft.to} onChange={(event) => onField('to', event.target.value)}
        />
      </div></div>
      <div className="col-md-12"><div className="mb-3">
        <label className="form-label">Available Days</label>
        <div className="d-flex flex-wrap gap-3">
          {shortDays.map((day) => (
            <div className="form-check" key={day}>
              <input
                className="form-check-input" type="checkbox" id={`menu-day-${day}${suffix}`}
                checked={draft.days.includes(day)} onChange={() => toggleDay(day)}
              />
              <label className="form-check-label fs-13" htmlFor={`menu-day-${day}${suffix}`}>{day}</label>
            </div>
          ))}
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-price${suffix}`}>Student Price</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number" className="form-control" id={`menu-price${suffix}`} min={0} step="0.05"
            value={draft.price} onChange={(event) => onField('price', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-staff${suffix}`}>Staff Price</label>
        <div className="input-group">
          <span className="input-group-text">$</span>
          <input
            type="number" className="form-control" id={`menu-staff${suffix}`} min={0} step="0.05"
            value={draft.staffPrice} onChange={(event) => onField('staffPrice', event.target.value)}
          />
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-kcal${suffix}`}>Calories</label>
        <div className="input-group">
          <input
            type="number" className="form-control" id={`menu-kcal${suffix}`} min={0}
            value={draft.calories} onChange={(event) => onField('calories', event.target.value)}
          />
          <span className="input-group-text">kcal</span>
        </div>
      </div></div>
      <div className="col-md-4"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-portion${suffix}`}>Portion Size</label>
        <input
          type="text" className="form-control" id={`menu-portion${suffix}`} placeholder="e.g. 250 g"
          value={draft.portion} onChange={(event) => onField('portion', event.target.value)}
        />
      </div></div>
      {([
        { key: 'protein', label: 'Protein' },
        { key: 'carbs', label: 'Carbohydrates' },
        { key: 'fat', label: 'Fat' },
        { key: 'fibre', label: 'Fibre' },
      ] as { key: keyof MenuDraft; label: string }[]).map((macro) => (
        <div className="col-md-2" key={macro.key}><div className="mb-3">
          <label className="form-label" htmlFor={`menu-${macro.key}${suffix}`}>{macro.label}</label>
          <div className="input-group">
            <input
              type="number" className="form-control" id={`menu-${macro.key}${suffix}`} min={0}
              value={draft[macro.key] as string}
              onChange={(event) => onField(macro.key, event.target.value)}
            />
            <span className="input-group-text">g</span>
          </div>
        </div></div>
      ))}
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-dietary${suffix}`}>Dietary Tags</label>
        <select
          className="form-select" multiple id={`menu-dietary${suffix}`} size={4}
          value={draft.dietary}
          onChange={(event) =>
            onField('dietary', Array.from(event.target.selectedOptions, (option) => option.value))
          }
        >
          {dietaryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor={`menu-allergens${suffix}`}>Contains Allergens</label>
        <select
          className="form-select" multiple id={`menu-allergens${suffix}`} size={4}
          value={draft.allergens}
          onChange={(event) =>
            onField('allergens', Array.from(event.target.selectedOptions, (option) => option.value))
          }
        >
          {allergenChoices.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-12">
        <div className="form-check form-switch mb-2">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`amAvailable${suffix}`}
            checked={draft.available} onChange={(event) => onField('available', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`amAvailable${suffix}`}>
            Make this item available from the next service
          </label>
        </div>
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input" type="checkbox" role="switch" id={`amBoard${suffix}`}
            checked={draft.board} onChange={(event) => onField('board', event.target.checked)}
          />
          <label className="form-check-label fs-13" htmlFor={`amBoard${suffix}`}>
            Publish to the menu board and the student app
          </label>
        </div>
      </div>
    </div>
  );
};

/* --------------------------------- Modals ---------------------------------- */

const MenuModals = ({
  active, row, rows, onClose, onCreate, onUpdate, onDuplicate, onSavePlanner, onArchive,
  onToast, onOpen, onOpenPanel,
}: MenuModalsProps) => {
  const [draft, setDraft] = useState<MenuDraft>(emptyDraft);
  const [copyName, setCopyName] = useState('');
  const [copyMeal, setCopyMeal] = useState<string>(mealTypeOptions[0]);
  const [copyDay, setCopyDay] = useState('Sun');
  const [copyPrice, setCopyPrice] = useState('');
  const [copyAvailability, setCopyAvailability] = useState<string>(availabilityOptions[0]);
  const [copyNutrition, setCopyNutrition] = useState(true);
  const [copyPrep, setCopyPrep] = useState(true);

  const [week, setWeek] = useState('27-07-2026');
  const [appliesTo, setAppliesTo] = useState(plannerAppliesOptions[0]);
  const [copyFrom, setCopyFrom] = useState(plannerCopyOptions[0]);

  const [reason, setReason] = useState(archiveReasonOptions[0]);
  const [archiveFrom, setArchiveFrom] = useState('01-08-2026');
  const [replacement, setReplacement] = useState(replacementOptions[0]);
  const [archiveRemarks, setArchiveRemarks] = useState('');
  const [notifyKitchen, setNotifyKitchen] = useState(true);

  /** Each opening seeds from the row being acted on, or a blank sheet for Add. */
  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    else if (active === 'edit' && row) setDraft(draftOf(row));

    if (active === 'duplicate' && row) {
      setCopyName(`${row.name} (Copy)`);
      setCopyMeal(row.mealType);
      setCopyDay(row.days[0] ?? 'Mon');
      setCopyPrice(row.price.toFixed(2));
      setCopyAvailability(row.availability);
      setCopyNutrition(true);
      setCopyPrep(true);
    }
    if (active === 'planner') {
      setWeek('27-07-2026');
      setAppliesTo(plannerAppliesOptions[0]);
      setCopyFrom(plannerCopyOptions[0]);
    }
    if (active === 'archive' && row) {
      setReason(archiveReasonOptions[0]);
      setArchiveFrom('01-08-2026');
      setReplacement(replacementOptions[0]);
      setArchiveRemarks('');
      setNotifyKitchen(true);
    }
  }, [active, row]);

  const field = (key: keyof MenuDraft, value: string | string[] | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  /**
   * The planner grid, built from the roster: one line per meal type, one column
   * per day, listing whatever the menu actually serves then.
   */
  const planner = useMemo(() => {
    const meals: MealType[] = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];
    return meals.map((meal) => ({
      meal,
      cells: shortDays.map((day) =>
        rows
          .filter((item) => item.mealType === meal && item.days.includes(day) && item.availability !== 'Archived')
          .map((item) => item.name)
          .join(', ') || '—'),
    }));
  }, [rows]);

  return (
    <>
      {/* Add Menu Item */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Menu Item"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Menu Item</button>
          </>
        }
      >
        <MenuForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Menu Item */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Menu Item"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        <MenuForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* Duplicate Menu Item */}
      <Modal
        open={active === 'duplicate' && row !== null}
        onClose={onClose}
        title="Duplicate Menu Item"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate(copyName, copyMeal, copyDay, copyPrice, copyAvailability);
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Duplicate Item</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span
                className={`avatar avatar-md bg-${mealStyle[row.mealType].tint}-transparent text-${mealStyle[row.mealType].tint} rounded flex-shrink-0`}
              >
                <i className={mealStyle[row.mealType].icon} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.name}</h5>
                <span className="fs-12 text-muted">{compactOf(row)}</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="new-item-name">New Item Name</label>
                <input
                  type="text" className="form-control" id="new-item-name"
                  value={copyName} onChange={(event) => setCopyName(event.target.value)}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copy-meal-type">Meal Type</label>
                <select
                  className="form-select" id="copy-meal-type"
                  value={copyMeal} onChange={(event) => setCopyMeal(event.target.value)}
                >
                  {mealTypeOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="assign-to-day">Assign To Day</label>
                <select
                  className="form-select" id="assign-to-day"
                  value={copyDay} onChange={(event) => setCopyDay(event.target.value)}
                >
                  {shortDays.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copy-price">Student Price</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number" className="form-control" id="copy-price" min={0} step="0.05"
                    value={copyPrice} onChange={(event) => setCopyPrice(event.target.value)}
                  />
                </div>
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="copy-availability">Availability</label>
                <select
                  className="form-select" id="copy-availability"
                  value={copyAvailability} onChange={(event) => setCopyAvailability(event.target.value)}
                >
                  {availabilityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="dmNutrition"
                    checked={copyNutrition} onChange={(event) => setCopyNutrition(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="dmNutrition">
                    Copy ingredients, nutrition and allergen data
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="dmPrep"
                    checked={copyPrep} onChange={(event) => setCopyPrep(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="dmPrep">
                    Copy the preparation notes for the kitchen
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Weekly Menu Planner */}
      <Modal
        open={active === 'planner'}
        onClose={onClose}
        title="Weekly Menu Planner"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onSavePlanner(week, appliesTo); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Publish Plan</button>
          </>
        }
      >
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label" htmlFor="week-starting">Week Starting</label>
            <DateField id="week-starting" value={week} onChange={setWeek} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="applies-to">Applies To</label>
            <select
              className="form-select" id="applies-to"
              value={appliesTo} onChange={(event) => setAppliesTo(event.target.value)}
            >
              {plannerAppliesOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="copy-from">Copy From</label>
            <select
              className="form-select" id="copy-from"
              value={copyFrom} onChange={(event) => setCopyFrom(event.target.value)}
            >
              {plannerCopyOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Meal</th>
                {shortDays.map((day) => <th key={day}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {planner.map((line) => (
                <tr key={line.meal}>
                  <td>
                    <span className={`badge badge-soft-${mealStyle[line.meal].tint}`}>{line.meal}</span>
                  </td>
                  {line.cells.map((cell, index) => (
                    <td className="fs-13" key={`${line.meal}-${shortDays[index]}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="fs-12 text-muted mt-2 mb-0">
          Built from the published menu — an item appears on the days it is served.
        </p>
      </Modal>

      {/* Archive Menu Item */}
      <Modal
        open={active === 'archive' && row !== null}
        onClose={onClose}
        title="Archive Menu Item"
        onSubmit={(event) => { event.preventDefault(); onArchive(reason, archiveFrom, replacement); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Item</button>
            <button type="submit" className="btn btn-danger">Archive Item</button>
          </>
        }
      >
        {row ? (
          <>
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="ti ti-alert-triangle me-2" />
              <span className="fs-13">
                Archiving removes {row.name} from the menu board and the weekly plan from the date below.
              </span>
            </div>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span
                className={`avatar avatar-md bg-${mealStyle[row.mealType].tint}-transparent text-${mealStyle[row.mealType].tint} rounded flex-shrink-0`}
              >
                <i className={mealStyle[row.mealType].icon} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h5 className="fs-14 mb-0">{row.name}</h5>
                <span className="fs-12 text-muted">
                  {row.category} · {dayLabel(row)} {row.mealType.toLowerCase()} · {priceLabel(row)}
                </span>
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
                <label className="form-label" htmlFor="replacement-item">Replacement Item</label>
                <select
                  className="form-select" id="replacement-item"
                  value={replacement} onChange={(event) => setReplacement(event.target.value)}
                >
                  {replacementOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="archive-remarks">Internal Remarks</label>
                <textarea
                  className="form-control" rows={2} id="archive-remarks"
                  placeholder="Recorded against the menu item"
                  value={archiveRemarks} onChange={(event) => setArchiveRemarks(event.target.value)}
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="arNotifyKitchen"
                    checked={notifyKitchen} onChange={(event) => setNotifyKitchen(event.target.checked)}
                  />
                  <label className="form-check-label fs-13" htmlFor="arNotifyKitchen">
                    Notify the kitchen and update the procurement list
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* View Menu Item */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.name ?? 'Menu item'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('duplicate')}>
              <i className="ti ti-copy me-1" />Duplicate
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-tools-kitchen-2 me-1" />Open Menu Panel
            </button>
          </>
        }
      >
        {row ? (
          <>
            <p className="mb-3 fs-12 text-muted">{summaryOf(row)}</p>
            <div className="row g-3 mb-3">
              {[
                { label: 'Student Price', value: priceLabel(row) },
                { label: 'Calories', value: caloriesLabel(row) },
                { label: 'Serving', value: openingLabel(row) },
                { label: 'Days', value: daysPerWeek(row) },
              ].map((tile) => (
                <div className="col-md-3" key={tile.label}>
                  <div className="border rounded p-3">
                    <span className="fs-12 text-muted d-block">{tile.label}</span>
                    <h5 className="fs-14 mb-0 text-truncate">{tile.value}</h5>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-13 mb-2">Menu Description</h6>
            <p className="fs-13 text-muted mb-3">{row.description}</p>

            <h6 className="fs-13 mb-2">Ingredients</h6>
            <div className="border rounded p-3 mb-3">
              {row.ingredients.map((ingredient, index, all) => (
                <div
                  className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                  key={ingredient.name}
                >
                  <span className="fs-13 text-muted">{ingredient.name}</span>
                  <span className="fs-13 fw-medium">{ingredient.amount}</span>
                </div>
              ))}
            </div>

            <h6 className="fs-13 mb-2">Nutrition per Portion</h6>
            <div className="border rounded p-3 mb-3">
              {nutritionPairsOf(row).map((pair, index, all) => (
                <div
                  className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                  key={pair.label}
                >
                  <span className="fs-13 text-muted">{pair.label}</span>
                  <span className="fs-13 fw-medium">{pair.value}</span>
                </div>
              ))}
            </div>

            <h6 className="fs-13 mb-2">Dietary Tags &amp; Allergens</h6>
            <div className="d-flex flex-wrap gap-1 mb-2">
              {row.tags.map((tag) => (
                <span className={`badge badge-soft-${tag.tint}`} key={tag.label}>{tag.label}</span>
              ))}
              <span className={`${statusBadge[row.availability]} ms-auto`}>{row.availability}</span>
            </div>
            <p className="fs-12 text-muted mb-3">
              Contains {row.contains.toLowerCase()} · free from {row.freeFrom.toLowerCase()}.
            </p>

            <h6 className="fs-13 mb-1">Preparation Notes</h6>
            <p className="fs-13 text-muted mb-0">{row.prep}</p>

            <button
              type="button" className="btn btn-link p-0 fs-12 mt-2"
              onClick={() => onToast(`${row.name} sent to the menu board`, 'info')}
            >
              Publish to the menu board
            </button>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default MenuModals;
