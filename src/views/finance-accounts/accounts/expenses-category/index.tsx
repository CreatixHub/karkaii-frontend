import { useCallback, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { PageHeader, QueueWorkspaceShell, useWorkspace } from '@components/workspace';
import type { ColumnDef, FilterField, SavedView, WorkspaceMenu } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import type { ExpenseCategory } from './data/expensesCategory.data';
import {
  approvalOptions, budgetOptions, departmentOptions, expenseCategories as initialRows, money,
  parentOptions, remainingOf, searchIndexOf, statusBadge, statusOptions, statusPill, taxOptions,
  utilisationOf, utilisationTint,
} from './data/expensesCategory.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'parent-category', label: 'Parent Category', kind: 'select', chipLabel: 'Parent', options: parentOptions },
  { id: 'department', label: 'Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'budget-range', label: 'Budget Range', kind: 'select', chipLabel: 'Budget', options: budgetOptions },
];

type CategoryModalId =
  | 'add' | 'edit' | 'budget' | 'approval' | 'departments' | 'details' | 'delete';

const ExpensesCategory = () => {
  const [rows, setRows] = useState<ExpenseCategory[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<CategoryModalId | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(initialRows[0].id);
  const [budgetDraft, setBudgetDraft] = useState('');
  const [limitDraft, setLimitDraft] = useState('');

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const selected = rows.find((row) => row.id === selectedId) ?? null;

  const openModal = useCallback(
    (modal: CategoryModalId) => {
      if (modal === 'budget' && selected) {
        setBudgetDraft(String(selected.budget));
        setLimitDraft(String(selected.perExpenseLimit));
      }
      setActiveModal(modal);
    },
    [selected],
  );

  const columns = useMemo<ColumnDef<ExpenseCategory>[]>(
    () => [
      { id: 'parent', label: 'Parent Category', render: (row) => row.parent },
      { id: 'budget', label: 'Budget', render: (row) => money(row.budget) },
      { id: 'utilisation', label: 'Utilisation', render: (row) => `${utilisationOf(row)}%` },
      { id: 'status', label: 'Status', render: (row) => row.status },
    ],
    [],
  );

  const workspace = useWorkspace<ExpenseCategory>({
    rows, filterFields, columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['parent-category'] && row.parent !== filters['parent-category']) return false;
      if (filters.department && !row.departments.includes(filters.department)) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['budget-range'] && money(row.budget) !== filters['budget-range']) return false;
      return true;
    },
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b) => a.name.localeCompare(b.name),
    defaultSort: 'name',
    pageSize: 100,
  });

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Categories', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'Active', label: 'Active', icon: 'ti ti-circle-check', count: rows.filter((r) => r.status === 'Active').length },
      { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-off', count: rows.filter((r) => r.status === 'Inactive').length },
    ],
    [rows],
  );

  /* --------------------------------- Actions -------------------------------- */

  const saveBudget = useCallback(() => {
    if (!selected) return;
    const budget = Number(budgetDraft);
    const limit = Number(limitDraft);
    if (!Number.isFinite(budget) || budget <= 0) {
      push('Enter a valid budget', 'danger');
      return;
    }
    setRows((current) =>
      current.map((row) =>
        row.id === selected.id
          ? { ...row, budget, perExpenseLimit: Number.isFinite(limit) ? limit : row.perExpenseLimit }
          : row,
      ),
    );
    setActiveModal(null);
    push(`${selected.name} budget updated`);
  }, [budgetDraft, limitDraft, push, selected]);

  /* ---------------------------------- Cards --------------------------------- */

  const renderCard = (row: ExpenseCategory, isSelected: boolean) => {
    const percent = utilisationOf(row);
    return (
      <button
        type="button"
        className={`cat-card accent-${row.accent}${isSelected ? ' active' : ''}`}
        onClick={() => setSelectedId(row.id)}
      >
        <div className="d-flex align-items-center gap-2 mb-2">
          <span className={`avatar avatar-md bg-${row.accent}-transparent text-${row.accent} rounded flex-shrink-0`}>
            <i className={row.icon} />
          </span>
          <div className="flex-fill overflow-hidden">
            <span className="d-block fs-14 fw-medium text-truncate">{row.name}</span>
            <span className="fs-12 text-muted">{row.code} · {row.parent}</span>
          </div>
          <span className={`dt-pill ${statusPill[row.status]} flex-shrink-0`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-between fs-12 text-muted mb-1">
          <span>{money(row.spent)} of {money(row.budget)}</span>
          <span className={`fw-medium text-${utilisationTint(percent)}`}>{percent}%</span>
        </div>
        <div className="progress progress-xs mb-2" style={{ height: 4 }}>
          <div
            className={`progress-bar bg-${utilisationTint(percent)}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${percent}% of budget used`}
          />
        </div>
        <div className="d-flex align-items-center justify-content-between pt-2 border-top fs-12 text-muted">
          <span><i className="ti ti-receipt me-1" />{row.count} expenses</span>
          <span><i className="ti ti-history me-1" />{row.updated}</span>
        </div>
      </button>
    );
  };

  /* --------------------------------- Detail --------------------------------- */

  const infoItem = (icon: string, label: string, value: string) => (
    <div className="col-sm-6 col-lg-4">
      <div className="exp-info-item">
        <span className="exp-info-label"><i className={`${icon} me-1`} />{label}</span>
        <span className="exp-info-val">{value}</span>
      </div>
    </div>
  );

  const renderDetail = (row: ExpenseCategory) => {
    const percent = utilisationOf(row);
    return (
      <>
        <div className="card">
          <div className="card-body">
            <div className="exp-hero pb-3 mb-3 border-bottom">
              <div className="d-flex align-items-center gap-3">
                <span className={`avatar avatar-lg bg-${row.accent}-transparent text-${row.accent} rounded flex-shrink-0`}>
                  <i className={`${row.icon} fs-20`} />
                </span>
                <div>
                  <h4 className="mb-1">{row.name}</h4>
                  <span className="fs-13 text-muted">{row.code} · {row.parent}</span>
                </div>
              </div>
              <div className="text-md-end">
                <span className="exp-hero-amount">{money(row.budget)}</span>
                <div className="d-flex align-items-center gap-1 mt-1 justify-content-md-end">
                  <span className={`dt-pill ${statusPill[row.status]}`}>
                    <span className="dt-pill-dot" />{row.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
              <h5 className="mb-0 fs-15"><i className="ti ti-info-circle me-2 text-primary" />Category Information</h5>
              <div className="d-flex align-items-center gap-2">
                <button type="button" className="btn btn-icon btn-sm btn-outline-light bg-white" aria-label="Edit category" onClick={() => openModal('edit')}>
                  <i className="ti ti-edit" />
                </button>
                <button type="button" className="btn btn-icon btn-sm btn-outline-light bg-white text-danger" aria-label="Delete category" onClick={() => openModal('delete')}>
                  <i className="ti ti-trash" />
                </button>
              </div>
            </div>

            <div className="row g-3">
              {infoItem('ti ti-hash', 'Category Code', row.code)}
              {infoItem('ti ti-folder', 'Parent Category', row.parent)}
              {infoItem('ti ti-receipt', 'Expenses Filed', String(row.count))}
              {infoItem('ti ti-shield-check', 'Approval', row.approval)}
              {infoItem('ti ti-receipt-tax', 'Tax', row.tax)}
              {infoItem('ti ti-calendar', 'Created', row.created)}
              <div className="col-12">
                <div className="exp-info-item">
                  <span className="exp-info-label"><i className="ti ti-align-left me-1" />Description</span>
                  <span className="exp-info-val">{row.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between">
            <h6 className="mb-0"><i className="ti ti-wallet me-2 text-primary" />Budget Utilisation</h6>
            <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => openModal('budget')}>
              <i className="ti ti-settings me-1" />Budget Settings
            </button>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fs-13 text-muted">{money(row.spent)} spent of {money(row.budget)}</span>
              <span className={`fs-13 fw-medium text-${utilisationTint(percent)}`}>{percent}%</span>
            </div>
            <div className="progress mb-3" style={{ height: 8 }}>
              <div
                className={`progress-bar bg-${utilisationTint(percent)}`}
                style={{ width: `${Math.min(percent, 100)}%` }}
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${percent}% of budget used`}
              />
            </div>
            <div className="row g-3">
              {infoItem('ti ti-cash', 'Annual Budget', money(row.budget))}
              {infoItem('ti ti-arrow-down', 'Spent', money(row.spent))}
              {infoItem(
                remainingOf(row) < 0 ? 'ti ti-alert-triangle' : 'ti ti-arrow-up',
                remainingOf(row) < 0 ? 'Over Budget' : 'Remaining',
                money(Math.abs(remainingOf(row))),
              )}
              {infoItem('ti ti-ban', 'Per-Expense Limit', money(row.perExpenseLimit))}
            </div>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-6">
            <div className="card h-100 mb-0">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h6 className="mb-0"><i className="ti ti-building me-2 text-primary" />Departments</h6>
                <button type="button" className="btn btn-outline-light bg-white btn-sm" onClick={() => openModal('departments')}>
                  <i className="ti ti-plus me-1" />Assign
                </button>
              </div>
              <div className="card-body">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {row.departments.map((dept) => (
                    <span className="badge badge-soft-secondary" key={dept}>
                      <i className="ti ti-building me-1" />{dept}
                    </span>
                  ))}
                </div>
                <h6 className="fs-13 mb-2">Expense Types</h6>
                <div className="d-flex flex-wrap gap-2">
                  {row.expenseTypes.map((type) => (
                    <span className="badge badge-soft-primary" key={type}>
                      <i className="ti ti-tag me-1" />{type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card h-100 mb-0">
              <div className="card-header">
                <h6 className="mb-0"><i className="ti ti-receipt me-2 text-primary" />Recent Expenses</h6>
              </div>
              <div className="card-body">
                {row.recentExpenses.map((expense) => (
                  <div className="cat-mini" key={expense.title}>
                    <span className={`avatar avatar-sm bg-${row.accent}-transparent text-${row.accent} rounded d-inline-flex align-items-center justify-content-center`}>
                      <i className="ti ti-receipt" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <span className="d-block fs-13 fw-medium text-truncate">{expense.title}</span>
                      <span className="fs-12 text-muted">{expense.owner}</span>
                    </div>
                    <span className="fw-semibold fs-13">{expense.amount}</span>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm w-100 mt-2"
                  onClick={() => openModal('approval')}
                >
                  <i className="ti ti-shield-check me-1" />Approval Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const categoryForm = (row: ExpenseCategory | null) => (
    <div className="row">
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ec-name">Category Name</label>
        <input type="text" className="form-control" id="ec-name" defaultValue={row?.name ?? ''} placeholder="Category name" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ec-code">Category Code</label>
        <input type="text" className="form-control" id="ec-code" defaultValue={row?.code ?? ''} placeholder="CAT-XXX" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ec-parent">Parent Category</label>
        <select className="form-select" id="ec-parent" defaultValue={row?.parent ?? parentOptions[0]}>
          {parentOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ec-budget">Annual Budget</label>
        <input type="text" className="form-control" id="ec-budget" defaultValue={row ? String(row.budget) : ''} placeholder="0.00" />
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ec-approval">Approval</label>
        <select className="form-select" id="ec-approval" defaultValue={row?.approval ?? approvalOptions[0]}>
          {approvalOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ec-tax">Tax</label>
        <select className="form-select" id="ec-tax" defaultValue={row?.tax ?? taxOptions[0]}>
          {taxOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-md-6"><div className="mb-3">
        <label className="form-label" htmlFor="ec-status">Status</label>
        <select className="form-select" id="ec-status" defaultValue={row?.status ?? statusOptions[0]}>
          {statusOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </div></div>
      <div className="col-12"><div className="mb-0">
        <label className="form-label" htmlFor="ec-desc">Description</label>
        <textarea className="form-control" rows={3} id="ec-desc" defaultValue={row?.description ?? ''} />
      </div></div>
    </div>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Expense Category"
            section="Accounts"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center me-2 mb-2"
                  onClick={() => push('Categories exported')}
                >
                  <i className="ti ti-file-export me-2" />Export
                </button>
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center mb-2"
                  onClick={() => setActiveModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />Add Category
                </button>
              </>
            }
          />

          <QueueWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            loading={loading}
            workspaceId="categoryWorkspace"
            searchPlaceholder="Search categories, code or department…"
            searchLabel="Search categories"
            savedViews={savedViews}
            filterFields={filterFields}
            noun="categories"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Categories refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            queueTitle="Expense Categories"
            queueIcon="ti ti-category"
            queueLabel="Expense categories"
            queueClassName="cat-list"
            renderCard={renderCard}
            selectedId={selectedId}
            renderDetail={renderDetail}
            emptyIcon="ti ti-category"
            emptyTitle="No Category Selected"
            emptyBody="Select a category from the list to review its budget, departments and recent expenses."
            emptyAction={
              <button type="button" className="btn btn-primary" onClick={() => setActiveModal('add')}>
                <i className="ti ti-square-rounded-plus me-1" />Add Category
              </button>
            }
          />
        </div>
      </div>

      {/* Modals */}
      <Modal
        open={activeModal === 'add'}
        onClose={() => setActiveModal(null)}
        title="Add Expense Category"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Category added'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Category</button>
          </>
        }
      >
        {categoryForm(null)}
      </Modal>

      <Modal
        open={activeModal === 'edit' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Edit Expense Category"
        dialogClassName="modal-lg"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push(`${selected?.name} updated`); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </>
        }
      >
        {categoryForm(selected)}
      </Modal>

      <Modal
        open={activeModal === 'budget' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Budget Settings"
        onSubmit={(e) => { e.preventDefault(); saveBudget(); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Budget</button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          <span className="fw-medium">{selected?.name}</span> has spent{' '}
          {money(selected?.spent ?? 0)} so far this year.
        </p>
        <div className="row">
          <div className="col-md-6"><div className="mb-3">
            <label className="form-label" htmlFor="ec-budget-amount">Annual Budget</label>
            <input
              type="text" className="form-control" id="ec-budget-amount"
              value={budgetDraft} onChange={(e) => setBudgetDraft(e.target.value)} placeholder="0.00"
            />
          </div></div>
          <div className="col-md-6"><div className="mb-0">
            <label className="form-label" htmlFor="ec-limit">Per-Expense Limit</label>
            <input
              type="text" className="form-control" id="ec-limit"
              value={limitDraft} onChange={(e) => setLimitDraft(e.target.value)} placeholder="0.00"
            />
          </div></div>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'approval' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Approval Settings"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Approval settings saved'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Settings</button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="ec-approval-level">Approval Requirement</label>
          <select className="form-select" id="ec-approval-level" defaultValue={selected?.approval ?? approvalOptions[0]}>
            {approvalOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="ec-approval-tax">Tax Treatment</label>
          <select className="form-select" id="ec-approval-tax" defaultValue={selected?.tax ?? taxOptions[0]}>
            {taxOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'departments' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Assign Departments"
        onSubmit={(e) => { e.preventDefault(); setActiveModal(null); push('Departments assigned'); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Assign Departments</button>
          </>
        }
      >
        <p className="fs-13 mb-3">
          {selected?.name} currently covers {selected?.departments.length} department
          {selected?.departments.length === 1 ? '' : 's'}.
        </p>
        <div className="mb-0">
          <label className="form-label" htmlFor="ec-dept">Department</label>
          <select className="form-select" id="ec-dept" defaultValue={departmentOptions[0]}>
            {departmentOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>
      </Modal>

      <Modal
        open={activeModal === 'details' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Category Details"
        dialogClassName="modal-lg"
        footer={<button type="button" className="btn btn-light" onClick={() => setActiveModal(null)}>Close</button>}
      >
        {selected ? (
          <>
            <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
              <h5 className="mb-0">{selected.name}</h5>
              <span className={statusBadge[selected.status]}>{selected.status}</span>
            </div>
            {renderDetail(selected)}
          </>
        ) : null}
      </Modal>

      <Modal
        open={activeModal === 'delete' && selected !== null}
        onClose={() => setActiveModal(null)}
        title="Delete Category"
        onSubmit={(e) => {
          e.preventDefault();
          const id = selected?.id;
          setRows((current) => current.filter((row) => row.id !== id));
          setSelectedId(null);
          setActiveModal(null);
          push('Category deleted');
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => setActiveModal(null)}>Cancel</button>
            <button type="submit" className="btn btn-danger">Yes, Delete</button>
          </>
        }
      >
        <p className="fs-13 mb-0">
          Delete {selected?.name}? {selected?.count} expenses are filed against it. This cannot be undone.
        </p>
      </Modal>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="ecToasts" />
    </>
  );
};

export default ExpensesCategory;
