import { useEffect, useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import SelectField from '@components/ui/SelectField';
import type { Category, CategoryStatus, CategoryType } from '../data/categories.data';
import {
  count,
  issued,
  loanPeriodOptions,
  managedByOptions,
  maxPerMember,
  parentLabel,
  renewalsAllowed,
  reservations,
  statusBadge,
  statusOptions,
  typeBadge,
  typeOptions,
} from '../data/categories.data';

export type CategoryModalId = 'add' | 'edit' | 'view' | 'move' | 'delete';

/** "None — root category" is the template's own wording for no parent. */
export const NO_PARENT = 'None — root category';

export const parentChoices = [
  NO_PARENT, 'Academic Books', 'Reference Books', 'Fiction', 'Non-Fiction', 'Digital Resources',
];

export interface CategoryDraft {
  name: string;
  code: string;
  parent: string;
  type: CategoryType;
  shelf: string;
  loanPeriod: string;
  managedBy: string;
  maxPerMember: string;
  status: CategoryStatus;
  description: string;
  notes: string;
  visibleInCatalogue: boolean;
  allowReservations: boolean;
}

export const emptyDraft: CategoryDraft = {
  name: '', code: '', parent: NO_PARENT, type: 'Physical', shelf: '',
  loanPeriod: loanPeriodOptions[0], managedBy: managedByOptions[0], maxPerMember: '',
  status: 'Active', description: '', notes: '', visibleInCatalogue: true, allowReservations: true,
};

export const draftOf = (row: Category): CategoryDraft => ({
  name: row.name,
  code: row.code,
  parent: row.parent ?? NO_PARENT,
  type: row.type,
  shelf: row.shelf,
  loanPeriod: loanPeriodOptions.includes(row.loanPeriod) ? row.loanPeriod : loanPeriodOptions[0],
  managedBy: row.managedBy,
  maxPerMember: maxPerMember(row).replace(' books', ''),
  status: row.status,
  description: row.description,
  notes: row.notes,
  visibleInCatalogue: row.status !== 'Archived',
  allowReservations: reservations(row) === 'Allowed',
});

export interface MoveResult {
  parent: string;
  shelf: string;
  /** The template's "Effective From" date, `d-m-Y`. */
  effectiveFrom: string;
  moveSubcategories: boolean;
  inheritRules: boolean;
}

export interface DeleteResult {
  /** The template's switch: archive rather than remove outright. */
  archive: boolean;
  applyToSubcategories: boolean;
}

export interface CategoryModalsProps {
  active: CategoryModalId | null;
  row: Category | null;
  onClose: () => void;
  onCreate: (draft: CategoryDraft) => void;
  onUpdate: (draft: CategoryDraft) => void;
  onMove: (result: MoveResult) => void;
  onDelete: (result: DeleteResult) => void;
  /** Lets View hand off to Edit, as the template's footer button does. */
  onOpen: (modal: CategoryModalId) => void;
}

/* ---------------------------------- Form ----------------------------------- */

interface FormProps {
  draft: CategoryDraft;
  onField: <K extends keyof CategoryDraft>(field: K, value: CategoryDraft[K]) => void;
  suffix: string;
}

const CategoryForm = ({ draft, onField, suffix }: FormProps) => (
  <div className="row">
    <div className="col-md-8"><div className="mb-3">
      <label className="form-label" htmlFor={`category-name${suffix}`}>Category Name</label>
      <input
        type="text" className="form-control" id={`category-name${suffix}`} placeholder="e.g. Popular Science"
        value={draft.name} onChange={(event) => onField('name', event.target.value)}
      />
    </div></div>
    <div className="col-md-4"><div className="mb-3">
      <label className="form-label" htmlFor={`category-code${suffix}`}>Category Code</label>
      <input
        type="text" className="form-control" id={`category-code${suffix}`} placeholder="CAT-000"
        value={draft.code} onChange={(event) => onField('code', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`parent-category${suffix}`}>Parent Category</label>
      <SelectField
        options={parentChoices}
        value={draft.parent}
        onChange={(value) => onField('parent', value)}
        id={`parent-category${suffix}`}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`category-type${suffix}`}>Category Type</label>
      <SelectField
        options={typeOptions}
        value={draft.type}
        onChange={(value) => onField('type', value as CategoryType)}
        id={`category-type${suffix}`}
      />
    </div></div>
    <div className="col-md-4"><div className="mb-3">
      <label className="form-label" htmlFor={`shelf-location${suffix}`}>Shelf Location</label>
      <input
        type="text" className="form-control" id={`shelf-location${suffix}`} placeholder="e.g. C6 – C8"
        value={draft.shelf} onChange={(event) => onField('shelf', event.target.value)}
      />
    </div></div>
    <div className="col-md-4"><div className="mb-3">
      <label className="form-label" htmlFor={`loan-period${suffix}`}>Loan Period</label>
      <SelectField
        options={loanPeriodOptions}
        value={draft.loanPeriod}
        onChange={(value) => onField('loanPeriod', value)}
        id={`loan-period${suffix}`}
      />
    </div></div>
    <div className="col-md-4"><div className="mb-3">
      <label className="form-label" htmlFor={`managed-by${suffix}`}>Managed By</label>
      <SelectField
        options={managedByOptions}
        value={draft.managedBy}
        onChange={(value) => onField('managedBy', value)}
        id={`managed-by${suffix}`}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`max-books${suffix}`}>Max Books Per Member</label>
      <input
        type="text" className="form-control" id={`max-books${suffix}`} placeholder="3"
        value={draft.maxPerMember} onChange={(event) => onField('maxPerMember', event.target.value)}
      />
    </div></div>
    <div className="col-md-6"><div className="mb-3">
      <label className="form-label" htmlFor={`cat-status${suffix}`}>Status</label>
      <SelectField
        options={statusOptions}
        value={draft.status}
        onChange={(value) => onField('status', value as CategoryStatus)}
        id={`cat-status${suffix}`}
      />
    </div></div>
    <div className="col-md-12"><div className="mb-3">
      <label className="form-label" htmlFor={`description${suffix}`}>Description</label>
      <textarea
        className="form-control" rows={2} id={`description${suffix}`}
        placeholder="Shown in the catalogue and on the shelf label"
        value={draft.description} onChange={(event) => onField('description', event.target.value)}
      />
    </div></div>
    <div className="col-md-12"><div className="mb-3">
      <label className="form-label" htmlFor={`librarian-notes${suffix}`}>Librarian Notes</label>
      <textarea
        className="form-control" rows={2} id={`librarian-notes${suffix}`}
        placeholder="Internal only, not shown in the catalogue"
        value={draft.notes} onChange={(event) => onField('notes', event.target.value)}
      />
    </div></div>
    <div className="col-md-12">
      <div className="form-check form-switch mb-2">
        <input
          className="form-check-input" type="checkbox" role="switch" id={`cat-visible${suffix}`}
          checked={draft.visibleInCatalogue}
          onChange={(event) => onField('visibleInCatalogue', event.target.checked)}
        />
        <label className="form-check-label fs-13" htmlFor={`cat-visible${suffix}`}>
          Show this category in the student catalogue
        </label>
      </div>
      <div className="form-check form-switch mb-0">
        <input
          className="form-check-input" type="checkbox" role="switch" id={`cat-reserve${suffix}`}
          checked={draft.allowReservations}
          onChange={(event) => onField('allowReservations', event.target.checked)}
        />
        <label className="form-check-label fs-13" htmlFor={`cat-reserve${suffix}`}>
          Allow reservations for books in this category
        </label>
      </div>
    </div>
  </div>
);

/** The template's header — avatar, title and a one-line subtitle. */
const DialogHead = ({ tint, icon, title, subtitle }: {
  tint: string; icon: string; title: string; subtitle: string;
}) => (
  <div className="d-flex align-items-center gap-3">
    <span className={`avatar avatar-lg bg-${tint}-transparent text-${tint} rounded`}>
      <i className={`${icon} fs-20`} />
    </span>
    <div>
      <h4 className="modal-title mb-0">{title}</h4>
      <p className="mb-0 fs-12 text-muted">{subtitle}</p>
    </div>
  </div>
);

const summaryTile = (label: string, value: string, tint?: string) => (
  <div className="col-md-3" key={label}>
    <div className="border rounded p-3 text-center">
      <span className="fs-12 text-muted d-block mb-1">{label}</span>
      <h5 className={`mb-0${tint ? ` text-${tint}` : ''}`}>{value}</h5>
    </div>
  </div>
);

const ruleRow = (label: string, value: string, badge?: string) => (
  <div className="d-flex align-items-center justify-content-between mb-2" key={label}>
    <span className="fs-13 text-muted">{label}</span>
    {badge ? <span className={badge}>{value}</span> : <span className="fs-13 fw-medium">{value}</span>}
  </div>
);

/* --------------------------------- Modals ---------------------------------- */

const CategoryModals = ({
  active, row, onClose, onCreate, onUpdate, onMove, onDelete, onOpen,
}: CategoryModalsProps) => {
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);
  const [move, setMove] = useState<MoveResult>({
    parent: NO_PARENT, shelf: '', effectiveFrom: '01-08-2026',
    moveSubcategories: true, inheritRules: true,
  });
  const [removal, setRemoval] = useState<DeleteResult>({ archive: true, applyToSubcategories: true });

  useEffect(() => {
    if (active === 'add') setDraft(emptyDraft);
    if (active === 'edit' && row) setDraft(draftOf(row));
    if (active === 'move' && row) {
      setMove({
        parent: row.parent ?? NO_PARENT,
        shelf: row.shelf,
        effectiveFrom: '01-08-2026',
        moveSubcategories: true,
        inheritRules: true,
      });
    }
    if (active === 'delete') setRemoval({ archive: true, applyToSubcategories: true });
  }, [active, row]);

  const field = <K extends keyof CategoryDraft>(key: K, value: CategoryDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const subtitleOf = (item: Category) =>
    `${item.code} · ${count(item.total)} ${item.unit} · ${item.subcategories.length} subcategories`;

  return (
    <>
      {/* Add Category */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Category"
        dialogClassName="modal-lg"
        titleAccessory={null}
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Category</button>
          </>
        }
      >
        <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
          <DialogHead
            tint="primary" icon="ti ti-books" title="Add Category"
            subtitle="Create a new category in the library catalogue"
          />
        </div>
        <CategoryForm draft={draft} onField={field} suffix="" />
      </Modal>

      {/* Edit Category */}
      <Modal
        open={active === 'edit' && row !== null}
        onClose={onClose}
        title="Edit Category"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onUpdate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {row ? (
          <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
            <DialogHead
              tint="warning" icon="ti ti-file-text" title={`Edit ${row.name}`}
              subtitle={`${row.code} · ${parentLabel(row)}`}
            />
          </div>
        ) : null}
        <CategoryForm draft={draft} onField={field} suffix="-2" />
      </Modal>

      {/* View Category */}
      <Modal
        open={active === 'view' && row !== null}
        onClose={onClose}
        title={row?.name ?? 'Category'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('edit')}>
              <i className="ti ti-edit me-1" />Edit Category
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom">
              <DialogHead
                tint={row.tint} icon={row.icon} title={row.name}
                subtitle={`${row.code} · ${parentLabel(row)} · ${row.shelf}`}
              />
            </div>
            <div className="row g-3 mb-3">
              {summaryTile('Total Books', count(row.total))}
              {summaryTile('Available', count(row.available), 'success')}
              {summaryTile('Issued', count(issued(row)), 'warning')}
              {summaryTile('Subcategories', String(row.subcategories.length))}
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Category Information</h6>
                <div className="border rounded p-3">
                  {ruleRow('Category Code', row.code)}
                  {ruleRow('Type', row.type, typeBadge[row.type])}
                  {ruleRow('Managed By', row.managedBy)}
                  {ruleRow('Status', row.status, statusBadge[row.status])}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-13 mb-2">Category Rules</h6>
                <div className="border rounded p-3">
                  {ruleRow('Loan Period', row.loanPeriod)}
                  {ruleRow('Max Per Member', maxPerMember(row))}
                  {ruleRow('Renewals Allowed', renewalsAllowed(row))}
                  {ruleRow(
                    'Reservations',
                    reservations(row),
                    reservations(row) === 'Allowed' ? 'badge badge-soft-success' : 'badge badge-soft-secondary',
                  )}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Move Category */}
      <Modal
        open={active === 'move' && row !== null}
        onClose={onClose}
        title="Move Category"
        onSubmit={(event) => { event.preventDefault(); onMove(move); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-arrows-move me-1" />Move Category
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
                  <i className={row.icon} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.name}</h5>
                  <span className="fs-12 text-muted">{subtitleOf(row)}</span>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                <i className="ti ti-sitemap" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0">
                  {row.parent ? `Currently under ${row.parent}` : 'Currently a root category'}
                </h6>
                <span className="fs-12 text-muted">
                  {row.parent ? `${row.parent} › ${row.name}` : `Library Root › ${row.name}`}
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="move-to">Move To</label>
                <SelectField
                  options={parentChoices.filter((option) => option !== row.name)}
                  value={move.parent}
                  onChange={(value) => setMove((current) => ({ ...current, parent: value }))}
                  id="move-to"
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="new-shelf-location">New Shelf Location</label>
                <input
                  type="text" className="form-control" id="new-shelf-location"
                  value={move.shelf}
                  onChange={(event) => setMove((current) => ({ ...current, shelf: event.target.value }))}
                />
              </div></div>
              <div className="col-md-6"><div className="mb-3">
                <label className="form-label" htmlFor="effective-from">Effective From</label>
                <DateField
                  value={move.effectiveFrom}
                  onChange={(value) => setMove((current) => ({ ...current, effectiveFrom: value }))}
                  format="d-m-Y"
                  id="effective-from"
                />
              </div></div>
              <div className="col-md-12"><div className="mb-3">
                <label className="form-label" htmlFor="reason-for-move">Reason for Move</label>
                <textarea
                  className="form-control" rows={2} id="reason-for-move"
                  placeholder="Recorded in the catalogue history"
                />
              </div></div>
              <div className="col-md-12">
                <div className="form-check form-switch mb-2">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="mvSubs"
                    checked={move.moveSubcategories}
                    onChange={(event) =>
                      setMove((current) => ({ ...current, moveSubcategories: event.target.checked }))}
                  />
                  <label className="form-check-label fs-13" htmlFor="mvSubs">
                    Move all {row.subcategories.length} subcategories with this category
                  </label>
                </div>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input" type="checkbox" role="switch" id="mvRules"
                    checked={move.inheritRules}
                    onChange={(event) =>
                      setMove((current) => ({ ...current, inheritRules: event.target.checked }))}
                  />
                  <label className="form-check-label fs-13" htmlFor="mvRules">
                    Inherit the loan rules of the new parent
                  </label>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Delete Category */}
      <Modal
        open={active === 'delete' && row !== null}
        onClose={onClose}
        title="Delete Category"
        onSubmit={(event) => { event.preventDefault(); onDelete(removal); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Keep Category</button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={row !== null && row.total > 0 && !removal.archive}
            >
              {removal.archive ? 'Archive Category' : 'Delete Category'}
            </button>
          </>
        }
      >
        {row ? (
          <>
            {row.total > 0 ? (
              <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                <i className="ti ti-alert-triangle me-2" />
                <span className="fs-13">
                  This category still holds {count(row.total)} {row.unit}. They must be reassigned before it
                  can be removed.
                </span>
              </div>
            ) : null}
            <div className="border rounded p-3 mb-3">
              <div className="d-flex align-items-center">
                <span className={`avatar avatar-md bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
                  <i className={row.icon} />
                </span>
                <div className="ms-2">
                  <h5 className="fs-14 mb-0">{row.name}</h5>
                  <span className="fs-12 text-muted">{subtitleOf(row)}</span>
                </div>
                <div className="ms-auto text-end">
                  <span className={statusBadge[row.status]}>{row.status}</span>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="delete-remarks">Remarks</label>
              <textarea
                className="form-control" rows={2} id="delete-remarks"
                placeholder="Recorded in the catalogue history"
              />
            </div>
            <div className="form-check form-switch mb-2">
              <input
                className="form-check-input" type="checkbox" role="switch" id="delArchive"
                checked={removal.archive}
                onChange={(event) => setRemoval((current) => ({ ...current, archive: event.target.checked }))}
              />
              <label className="form-check-label fs-13" htmlFor="delArchive">
                Archive instead of permanently deleting
              </label>
            </div>
            <div className="form-check form-switch mb-0">
              <input
                className="form-check-input" type="checkbox" role="switch" id="delSubs"
                checked={removal.applyToSubcategories}
                onChange={(event) =>
                  setRemoval((current) => ({ ...current, applyToSubcategories: event.target.checked }))}
              />
              <label className="form-check-label fs-13" htmlFor="delSubs">
                Apply the same action to its {row.subcategories.length} subcategories
              </label>
            </div>
          </>
        ) : null}
      </Modal>
    </>
  );
};

export default CategoryModals;
