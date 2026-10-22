import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import DesignationModals from './modals/DesignationModals';
import type { DesignationDraft } from './modals/DesignationModals';
import type { DesignationModalId, DesignationRow } from './data/designation.data';
import { designationRows, exportActions } from './data/designation.data';

const routes = all_routes;

const Designation = () => {
  const [rows, setRows] = useState<DesignationRow[]>(designationRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [exportOpen, setExportOpen] = useState(false);

  const [activeModal, setActiveModal] = useState<DesignationModalId | null>(null);
  const [modalRow, setModalRow] = useState<DesignationRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const selectAllRef = useRef<HTMLInputElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const { toasts, push, dismiss } = useToasts();

  const allChecked = rows.length > 0 && selected.length === rows.length;
  const someChecked = selected.length > 0 && !allChecked;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someChecked;
  }, [someChecked]);

  useEffect(() => {
    if (!exportOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!exportRef.current?.contains(event.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [exportOpen]);

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const openModal = (modal: DesignationModalId, row: DesignationRow | null = null) => {
    setModalRow(row);
    setActiveModal(modal);
  };
  const closeModal = () => setActiveModal(null);

  const handleAdd = (draft: DesignationDraft) => {
    // Counting rows would reuse an id after a delete, so take the highest in use.
    const nextNumber = rows.reduce((max, row) => Math.max(max, Number(row.id.replace('DS', '')) || 0), 748294) + 1;
    setRows((current) => [
      {
        id: `DS${nextNumber}`,
        name: draft.name,
        status: draft.status,
        pillClass: draft.status === 'Active' ? 'is-active' : 'is-inactive',
      },
      ...current,
    ]);
    push(`${draft.name} added successfully`);
  };

  const handleSave = (id: string, draft: DesignationDraft) => {
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              name: draft.name,
              status: draft.status,
              pillClass: draft.status === 'Active' ? 'is-active' : 'is-inactive',
            }
          : row,
      ),
    );
    push('Designation updated');
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      setRows((current) => current.filter((row) => row.id !== pendingDelete));
      setSelected((current) => current.filter((item) => item !== pendingDelete));
      push('Designation deleted');
    }
    setPendingDelete(null);
    closeModal();
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Designation</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Designation
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  title="Refresh"
                  aria-label="Refresh"
                  onClick={() => {
                    setRows(designationRows);
                    setSelected([]);
                    push('Designation list refreshed');
                  }}
                >
                  <i className="ti ti-refresh" />
                </Link>
              </div>
              <div className="pe-1 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  title="Print"
                  aria-label="Print"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer" />
                </button>
              </div>
              <div className="dropdown me-2 mb-2" ref={exportRef}>
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end p-3${exportOpen ? ' show' : ''}`}>
                  {exportActions.map((action) => (
                    <li key={action.id}>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setExportOpen(false);
                          push(action.label.replace('Export as', 'Exported as'));
                        }}
                      >
                        <i className={`${action.icon} me-1`} />
                        {action.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <Link to="#" className="btn btn-primary d-flex align-items-center" onClick={() => openModal('add')}>
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Designation
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Designation List */}
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Designation</h4>
            </div>
            <div className="card-body p-0 py-3">
              <div className="data-table">
                <table className="table">
                  <caption className="visually-hidden">Designation list with ID, name and status</caption>
                  <thead>
                    <tr>
                      <th className="dt-pin">
                        <input
                          ref={selectAllRef}
                          type="checkbox"
                          className="dt-check"
                          id="select-all"
                          aria-label="Select all designations"
                          checked={allChecked}
                          onChange={(event) => setSelected(event.target.checked ? rows.map((row) => row.id) : [])}
                        />
                      </th>
                      <th>ID</th>
                      <th>Designation</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr className="dt-row" key={row.id}>
                        <td className="dt-pin">
                          <input
                            type="checkbox"
                            className="dt-check"
                            aria-label={`Select ${row.name}`}
                            checked={selected.includes(row.id)}
                            onChange={() => toggleSelect(row.id)}
                          />
                        </td>
                        <td>
                          <Link to="#" className="link-primary">
                            {row.id}
                          </Link>
                        </td>
                        <td>
                          <span className="dt-name">{row.name}</span>
                        </td>
                        <td>
                          <span className={`dt-pill ${row.pillClass}`}>
                            <span className="dt-pill-dot" />
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <div className="dt-actions justify-content-end">
                            <Link
                              to="#"
                              className="dt-ib"
                              title="Edit"
                              aria-label="Edit"
                              onClick={() => openModal('edit', row)}
                            >
                              <i className="ti ti-edit" />
                            </Link>
                            <Link
                              to="#"
                              className="dt-ib"
                              title="Delete"
                              aria-label="Delete"
                              onClick={() => {
                                setPendingDelete(row.id);
                                openModal('delete', row);
                              }}
                            >
                              <i className="ti ti-trash" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* /Designation List */}
        </div>
      </div>

      <DesignationModals
        active={activeModal}
        designation={modalRow}
        onClose={closeModal}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="designationToasts" />
    </>
  );
};

export default Designation;
