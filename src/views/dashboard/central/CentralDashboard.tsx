import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import BranchTable from './components/BranchTable';
import CentralModals from './modals/CentralModals';
import type { CentralModalId } from './modals/CentralModals';
import type { Branch, BranchStatus } from './data/centralDashboard.data';
import {
  branches as seedBranches,
  exportOptions,
  statCards,
} from './data/centralDashboard.data';

const routes = all_routes;

const CentralDashboard = () => {
  const [branches, setBranches] = useState<Branch[]>(seedBranches);
  const [activeModal, setActiveModal] = useState<CentralModalId | null>(null);
  const [target, setTarget] = useState<Branch | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  // Remounts the table to reset its search/filter/page state on Refresh.
  const [tableKey, setTableKey] = useState(0);

  const exportRef = useRef<HTMLDivElement>(null);

  // Outside click / Escape closes the export menu, as Bootstrap's dropdown does.
  useEffect(() => {
    if (!exportOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!exportRef.current?.contains(event.target as Node)) setExportOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExportOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [exportOpen]);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setTarget(null);
  }, []);

  const handleCreate = useCallback(
    (values: { name: string; status: BranchStatus; description: string }) => {
      setBranches((current) => [
        {
          id: `br-new-${current.length + 1}`,
          name: values.name,
          students: 0,
          staff: 0,
          revenue: '$0',
          status: values.status,
          avatarClass: 'bg-primary-transparent text-primary',
        },
        ...current,
      ]);
    },
    [],
  );

  const handleUpdate = useCallback(
    (id: string, values: { name: string; status: BranchStatus }) => {
      setBranches((current) =>
        current.map((branch) =>
          branch.id === id ? { ...branch, name: values.name, status: values.status } : branch,
        ),
      );
    },
    [],
  );

  const handleDelete = useCallback((id: string) => {
    setBranches((current) => current.filter((branch) => branch.id !== id));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Central Dashboard</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">Administration</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Central Dashboard
                </li>
              </ol>
            </nav>
          </div>

          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <button
              type="button"
              className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
              onClick={() => {
                setBranches(seedBranches);
                setTableKey((key) => key + 1);
              }}
            >
              <i className="ti ti-refresh me-1" />
              Refresh
            </button>

            <div className="dropdown mb-2 me-2" ref={exportRef}>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                aria-expanded={exportOpen}
                onClick={() => setExportOpen((open) => !open)}
              >
                <i className="ti ti-file-export me-1" />
                Export
                <i className="ti ti-chevron-down ms-1" />
              </button>
              <ul className={`dropdown-menu p-2${exportOpen ? ' show' : ''}`}>
                {exportOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => setExportOpen(false)}
                    >
                      <i className={`${option.icon} me-1`} />
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              className="btn btn-primary mb-2 d-inline-flex align-items-center"
              onClick={() => setActiveModal('add')}
            >
              <i className="ti ti-square-rounded-plus me-1" />
              Add Branch
            </button>
          </div>
        </div>

        <div className="row">
          {statCards.map((card) => (
            <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <p className="mb-1">{card.label}</p>
                    <h4 className="mb-0">{card.value}</h4>
                  </div>
                  <span className={`avatar avatar-lg ${card.className} rounded`}>
                    <i className={`${card.icon} fs-24`} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <BranchTable
          key={tableKey}
          branches={branches}
          onEdit={(branch) => {
            setTarget(branch);
            setActiveModal('edit');
          }}
          onDelete={(branch) => {
            setTarget(branch);
            setActiveModal('delete');
          }}
        />
      </div>

      <CentralModals
        active={activeModal}
        target={target}
        onClose={closeModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CentralDashboard;
