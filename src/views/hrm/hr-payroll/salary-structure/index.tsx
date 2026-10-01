import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StructureRow from './components/StructureRow';
import StructureModals from './modals/StructureModals';
import type { StructureDraft, StructureModalId } from './modals/StructureModals';
import type { SalaryStructure, SortKey, StructureStatus } from './data/salaryStructure.data';
import {
  categoryOptions,
  departmentOptions,
  frequencyOptions,
  grossSalary,
  netSalary,
  PAYROLL_CYCLE,
  salaryStructures,
  statusOptions,
} from './data/salaryStructure.data';

const routes = all_routes;

const SalaryStructurePage = () => {
  const [rows, setRows] = useState<SalaryStructure[]>(salaryStructures);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(categoryOptions[0]);
  const [department, setDepartment] = useState(departmentOptions[0]);
  const [frequency, setFrequency] = useState(frequencyOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);

  const [sort, setSort] = useState<SortKey>('name');
  const [ascending, setAscending] = useState(true);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [exportOpen, setExportOpen] = useState(false);

  const [activeModal, setActiveModal] = useState<StructureModalId | null>(null);
  const [modalRow, setModalRow] = useState<SalaryStructure | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();

    const list = rows.filter((row) => {
      if (term && !`${row.name} ${row.code}`.toLowerCase().includes(term)) return false;
      if (category !== categoryOptions[0] && row.category !== category) return false;
      if (department !== departmentOptions[0] && row.department !== department) return false;
      if (frequency !== frequencyOptions[0] && row.frequency !== frequency) return false;
      if (status !== statusOptions[0] && row.status !== status) return false;
      return true;
    });

    const direction = ascending ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort) {
        case 'category':
          return a.category.localeCompare(b.category) * direction;
        case 'department':
          return a.department.localeCompare(b.department) * direction;
        case 'basic':
          return (a.basic - b.basic) * direction;
        case 'gross':
          return (grossSalary(a) - grossSalary(b)) * direction;
        case 'net':
          return (netSalary(a) - netSalary(b)) * direction;
        case 'effective':
          return a.effectiveFrom.localeCompare(b.effectiveFrom) * direction;
        case 'name':
        default:
          return a.name.localeCompare(b.name) * direction;
      }
    });
  }, [rows, search, category, department, frequency, status, sort, ascending]);

  const toggleSort = (key: SortKey) => {
    if (sort === key) setAscending((value) => !value);
    else {
      setSort(key);
      setAscending(true);
    }
  };

  const sortableTh = (key: SortKey, label: string, className = '') => (
    <th
      className={`dt-sortable${sort === key ? (ascending ? ' dt-sort-asc' : ' dt-sort-desc') : ''} ${className}`.trim()}
      aria-sort={sort === key ? (ascending ? 'ascending' : 'descending') : 'none'}
    >
      <button type="button" className="btn btn-link p-0 border-0 text-reset text-decoration-none" onClick={() => toggleSort(key)}>
        {label}
        <i className={`ti ${sort === key && !ascending ? 'ti-arrow-narrow-down' : 'ti-arrow-narrow-up'} dt-sort-ic ms-1`} />
      </button>
    </th>
  );

  const allShownSelected = visible.length > 0 && visible.every((row) => selected.includes(row.id));

  const openModal = (modal: StructureModalId, row: SalaryStructure | null = null) => {
    setModalRow(row);
    setActiveModal(modal);
  };

  /** Splits a total across the breakdown so the panel keeps reconciling. */
  const asLines = (label: string, total: string) => {
    const amount = Number(total.replace(/[^0-9.]/g, '')) || 0;
    return amount > 0 ? [{ label, amount }] : [];
  };

  const createStructure = useCallback(
    (draft: StructureDraft) => {
      if (!draft.name.trim() || !draft.code.trim()) {
        push('Give the structure a name and a code', 'warning');
        return;
      }
      const record: SalaryStructure = {
        id: draft.code.trim(),
        code: draft.code.trim(),
        name: draft.name.trim(),
        category: draft.category,
        department: draft.department,
        frequency: draft.frequency,
        tint: 'primary',
        basic: Number(draft.basic.replace(/[^0-9.]/g, '')) || 0,
        earnings: asLines('Total Earnings', draft.earnings),
        deductions: asLines('Total Deductions', draft.deductions),
        employer: [],
        designations: [],
        frequencyNote: draft.frequency,
        frequencySub: '',
        notes: draft.notes,
        effectiveFrom: draft.effectiveFrom || '—',
        lastUpdated: '—',
        status: draft.status as StructureStatus,
      };
      setRows((current) => [...current, record]);
      setActiveModal(null);
      push(`${record.name} added`);
    },
    [push],
  );

  const updateStructure = useCallback(
    (draft: StructureDraft) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                name: draft.name.trim() || row.name,
                code: draft.code.trim() || row.code,
                category: draft.category,
                department: draft.department,
                frequency: draft.frequency,
                basic: Number(draft.basic.replace(/[^0-9.]/g, '')) || row.basic,
                effectiveFrom: draft.effectiveFrom || row.effectiveFrom,
                status: draft.status as StructureStatus,
                notes: draft.notes,
              }
            : row,
        ),
      );
      setActiveModal(null);
      push('Salary structure updated');
    },
    [modalRow, push],
  );

  const duplicateStructure = useCallback(
    (name: string, code: string) => {
      if (!modalRow) return;
      if (!name.trim() || !code.trim()) {
        push('Give the copy a name and a code', 'warning');
        return;
      }
      setRows((current) => [
        ...current,
        { ...modalRow, id: code.trim(), code: code.trim(), name: name.trim(), status: 'Draft', lastUpdated: '—' },
      ]);
      setActiveModal(null);
      push(`${name.trim()} created from ${modalRow.name}`);
    },
    [modalRow, push],
  );

  const archive = (row: SalaryStructure) => {
    setRows((current) =>
      current.map((item) => (item.id === row.id ? { ...item, status: 'Inactive' as StructureStatus } : item)),
    );
    push(`${row.name} archived`);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Salary Structure</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Salary Structure
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <span className="badge badge-soft-bordered d-inline-flex align-items-center me-2 mb-2 p-2">
                <i className="ti ti-calendar-dollar me-1" />
                {PAYROLL_CYCLE}
              </span>
            </div>
          </div>
          {/* /Page Header */}

          {/* Sticky Toolbar */}
          <div className="card">
            <div className="card-body">
              <div className="card-toolbar">
                <div className="card-search">
                  <i className="ti ti-search card-search-ic" />
                  <input
                    type="text"
                    placeholder="Search structure name or code…"
                    aria-label="Search salary structures"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  <span className="card-search-kbd">⌘K</span>
                </div>

                {[
                  { label: 'Employee category', value: category, set: setCategory, options: categoryOptions },
                  { label: 'Department', value: department, set: setDepartment, options: departmentOptions },
                  { label: 'Payroll frequency', value: frequency, set: setFrequency, options: frequencyOptions },
                  { label: 'Status', value: status, set: setStatus, options: statusOptions },
                ].map((filter) => (
                  <select
                    className="form-select w-auto"
                    aria-label={filter.label}
                    key={filter.label}
                    value={filter.value}
                    onChange={(event) => filter.set(event.target.value)}
                  >
                    {filter.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                ))}

                <span className="flex-grow-1" />

                <button type="button" className="card-btn" onClick={() => push('Import is not wired to a backend yet', 'info')}>
                  <i className="ti ti-file-import" />
                  Import
                </button>
                <div className="dropdown">
                  <button
                    type="button"
                    className="card-btn dropdown-toggle"
                    aria-expanded={exportOpen}
                    onClick={() => setExportOpen((value) => !value)}
                  >
                    <i className="ti ti-file-export" />
                    Export
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end p-2${exportOpen ? ' show' : ''}`}>
                    {[
                      { id: 'PDF', icon: 'ti ti-file-type-pdf' },
                      { id: 'Excel', icon: 'ti ti-file-type-xls' },
                      { id: 'CSV', icon: 'ti ti-file-type-csv' },
                    ].map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          className="dropdown-item rounded-1"
                          onClick={() => {
                            setExportOpen(false);
                            push(`Export as ${option.id} started`);
                          }}
                        >
                          <i className={`${option.icon} me-2`} />
                          {option.id}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-inline-flex align-items-center"
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-1" />
                  Add Salary Structure
                </button>
              </div>
            </div>
          </div>
          {/* /Sticky Toolbar */}

          {/* Salary Structure Table */}
          <div className="card">
            <div className="data-table dt-scroll">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check"
                        aria-label="Select all"
                        checked={allShownSelected}
                        onChange={() =>
                          setSelected(allShownSelected ? [] : visible.map((row) => row.id))
                        }
                      />
                    </th>
                    <th />
                    {sortableTh('name', 'Structure Name')}
                    {sortableTh('category', 'Employee Category')}
                    {sortableTh('department', 'Department')}
                    {sortableTh('basic', 'Basic Salary', 'text-end')}
                    <th className="text-end">Earnings</th>
                    <th className="text-end">Deductions</th>
                    {sortableTh('gross', 'Gross Salary', 'text-end')}
                    {sortableTh('net', 'Net Salary', 'text-end')}
                    {sortableTh('effective', 'Effective From')}
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((row) => (
                    <StructureRow
                      key={row.id}
                      structure={row}
                      expanded={expanded.includes(row.id)}
                      onToggleExpand={() =>
                        setExpanded((current) =>
                          current.includes(row.id)
                            ? current.filter((id) => id !== row.id)
                            : [...current, row.id],
                        )
                      }
                      selected={selected.includes(row.id)}
                      onToggleSelect={() =>
                        setSelected((current) =>
                          current.includes(row.id)
                            ? current.filter((id) => id !== row.id)
                            : [...current, row.id],
                        )
                      }
                      onView={() => openModal('view', row)}
                      onEdit={() => openModal('edit', row)}
                      onDuplicate={() => openModal('duplicate', row)}
                      onArchive={() => archive(row)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {visible.length === 0 ? (
              <div className="text-center py-5">
                <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                  <i className="ti ti-file-dollar fs-36" />
                </span>
                <h5 className="mb-1">No Salary Structures Found</h5>
                <p className="text-muted mb-0">No structure matches the selected filters.</p>
              </div>
            ) : null}
          </div>
          {/* /Salary Structure Table */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <StructureModals
        active={activeModal}
        structure={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createStructure}
        onUpdate={updateStructure}
        onDuplicate={duplicateStructure}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="ssToasts" />
    </>
  );
};

export default SalaryStructurePage;
