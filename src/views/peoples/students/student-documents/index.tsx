import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import DocumentCard from './components/DocumentCard';
import DocumentListRow from './components/DocumentListRow';
import DocumentSidebar from './components/DocumentSidebar';
import DocumentModals from './modals/DocumentModals';
import type { DocSortKey, DocumentModalId, DocumentRecord } from './data/documents.data';
import { documents, filterFields, sortOptions } from './data/documents.data';

const routes = all_routes;

/** The preview offcanvas's File Information rows, from the template. */
const previewInfo = [
  { key: 'Category', value: 'Birth Certificate' },
  { key: 'File Type', value: 'PDF Document' },
  { key: 'File Size', value: '1.2 MB' },
  { key: 'Upload Date', value: '02 Jul 2026' },
  { key: 'Last Modified', value: '18 Jul 2026' },
  { key: 'Version', value: 'v3 (Current)' },
  { key: 'Uploaded By', value: 'Teena Mathew' },
];

const previewHistory = [
  { tint: 'bg-success-transparent text-success', icon: 'ti ti-check', title: 'Verified by Teena Mathew', when: '02 Jul 2026, 10:24 AM' },
  { tint: 'bg-info-transparent text-info', icon: 'ti ti-upload', title: 'Re-uploaded by Parent', when: '15 May 2026, 02:10 PM' },
  { tint: 'bg-primary-transparent text-primary', icon: 'ti ti-file-plus', title: 'Created by Parent', when: '02 Jan 2026, 09:00 AM' },
];

/** Grid skeleton: six placeholder cards, as the template renders. */
const SkeletonGrid = () => (
  <div id="doc_skeleton" className="data-workspace classes-workspace">
    <div className="row g-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="col-xxl-4 col-lg-6 col-md-6" key={index}>
          <div className="card mb-0">
            <div className="ratio ratio-4x3">
              <span className="skeleton" />
            </div>
            <div className="card-body">
              <div className="skeleton skeleton-line w-75 mb-2" />
              <div className="skeleton skeleton-pill mb-3" />
              <div className="d-flex align-items-center mb-3">
                <span className="skeleton skeleton-circle me-2" />
                <div className="flex-fill">
                  <div className="skeleton skeleton-line w-50 mb-1" />
                  <div className="skeleton skeleton-line skeleton-thin w-25" />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="skeleton skeleton-line w-25" />
                <span className="skeleton skeleton-line w-25" />
              </div>
              <div className="d-flex align-items-center gap-1 border-top pt-3">
                <span className="skeleton skeleton-circle" />
                <span className="skeleton skeleton-circle" />
                <span className="skeleton skeleton-circle" />
                <span className="skeleton skeleton-circle" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StudentDocuments = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [smartFilter, setSmartFilter] = useState('all');
  const [category, setCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<DocSortKey>('newest');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<DocumentModalId | null>(null);
  const [rows, setRows] = useState<DocumentRecord[]>(documents);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((modal: DocumentModalId) => setActiveModal(modal), []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = rows.filter((doc) => {
      if (term && !`${doc.name} ${doc.student} ${doc.category.label}`.toLowerCase().includes(term)) {
        return false;
      }
      if (smartFilter === 'favourites' && !doc.favourite) return false;
      if (smartFilter === 'verified' && doc.status.label !== 'Verified') return false;
      if (smartFilter === 'pending' && doc.status.label !== 'Pending') return false;
      if (smartFilter === 'expired' && doc.status.label !== 'Expired') return false;
      if (filters.verification && doc.status.label !== filters.verification) return false;
      if (filters.student && doc.student !== filters.student) return false;
      if (filters.class && doc.className !== filters.class) return false;
      if (filters.category && doc.category.label !== filters.category) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'size') return a.size.localeCompare(b.size);
      if (sort === 'oldest') return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [rows, search, smartFilter, filters, sort]);

  const toggleSelect = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );

  const toggleFavourite = (id: string) => {
    setRows((current) =>
      current.map((doc) => (doc.id === id ? { ...doc, favourite: !doc.favourite } : doc)),
    );
  };

  /** The template's refresh button replayed the skeleton. */
  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setRows(documents);
      setLoading(false);
      push('Documents refreshed');
    }, 700);
  };

  const confirmDelete = () => {
    setRows((current) => current.filter((doc) => !selected.includes(doc.id)));
    setSelected([]);
    setActiveModal(null);
    push('Documents deleted');
  };

  const cardProps = (doc: DocumentRecord) => ({
    document: doc,
    selected: selected.includes(doc.id),
    onToggleSelect: () => toggleSelect(doc.id),
    menuOpen: menuOpen === doc.id,
    onToggleMenu: () => setMenuOpen(menuOpen === doc.id ? null : doc.id),
    onCloseMenu: () => setMenuOpen(null),
    onOpenModal: openModal,
    onPreview: () => setPreviewOpen(true),
    onFavourite: () => toggleFavourite(doc.id),
  });

  return (
    <>
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student Document Vault</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <a href="#">Dashboard</a>
                  </li>
                  <li className="breadcrumb-item">Students</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Documents
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => setNavOpen(true)}
              >
                <i className="ti ti-layout-sidebar-left-expand me-1" />
                Browse
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => openModal('bulkUpload')}
              >
                <i className="ti ti-cloud-upload me-1" />
                Bulk Upload
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal('upload')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Upload Documents
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* Expiry Alert */}
          {alertOpen ? (
            <div
              className="alert alert-warning alert-dismissible fade show d-flex align-items-center"
              role="alert"
            >
              <i className="ti ti-alert-triangle me-2 fs-16" />
              <span>
                <b>7</b> documents are expiring within 30 days and <b>3</b> have expired.
              </span>
              <button type="button" className="ms-2 fw-semibold text-decoration-underline btn btn-link p-0 border-0">
                Review
              </button>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setAlertOpen(false)}
              />
            </div>
          ) : null}

          {/* Workspace */}
          <div className="row g-3">
            <DocumentSidebar
              filter={smartFilter}
              onFilter={setSmartFilter}
              category={category}
              onCategory={setCategory}
              onOpenModal={openModal}
              onPreview={() => setPreviewOpen(true)}
            />

            <div className="col-xxl-9 col-xl-12 col-lg-12">
              {/* Sticky Toolbar */}
              <div className="card mb-3 sticky-top classes-workspace is-loaded" id="doc_toolbar">
                <div className="card-header border-bottom">
                  <div className="page-toolbar">
                    <div className="search-toolbar">
                      <i className="ti ti-search search-toolbar-icon" />
                      <input
                        type="text"
                        id="docSearch"
                        placeholder="Search documents, students, tags…"
                        aria-label="Search documents"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                      />
                      <span className="search-toolbar-kbd">⌘K</span>
                    </div>

                    <div className="dropdown">
                      <button
                        type="button"
                        className="workspace-button dropdown-toggle"
                        aria-expanded={filterOpen}
                        onClick={() => setFilterOpen((open) => !open)}
                      >
                        <i className="ti ti-adjustments-horizontal" />
                        Filters
                      </button>
                      <div className={`dropdown-menu p-3 filter-menu${filterOpen ? ' show' : ''}`}>
                        <div className="row g-3">
                          {filterFields.map((field) => (
                            <div className="col-6" key={field.id}>
                              <label className="form-label mb-1" htmlFor={field.id}>
                                {field.label}
                              </label>
                              <select
                                className="form-select"
                                id={field.id}
                                value={filters[field.id] ?? ''}
                                onChange={(event) =>
                                  setFilters((current) => ({
                                    ...current,
                                    [field.id]: event.target.value,
                                  }))
                                }
                              >
                                <option value="">All</option>
                                {field.options.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                          <div className="col-12">
                            <label className="form-label mb-1" htmlFor="upload-date">
                              Upload Date
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm date-range bookingrange"
                              placeholder="Select date range"
                              id="upload-date"
                            />
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
                          <button
                            type="button"
                            className="btn btn-light btn-sm"
                            onClick={() => setFilters({})}
                          >
                            Reset
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => setFilterOpen(false)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="dropdown">
                      <button
                        type="button"
                        className="workspace-button dropdown-toggle"
                        aria-expanded={sortOpen}
                        onClick={() => setSortOpen((open) => !open)}
                      >
                        <i className="ti ti-sort-descending-2" />
                        Sort
                      </button>
                      <ul className={`dropdown-menu dropdown-menu-end${sortOpen ? ' show' : ''}`}>
                        <li className="context-menu-head">Sort by</li>
                        {sortOptions.map((option) => (
                          <li key={option.id}>
                            <button
                              type="button"
                              className={`dropdown-item${sort === option.id ? ' active' : ''}`}
                              onClick={() => {
                                setSort(option.id);
                                setSortOpen(false);
                              }}
                            >
                              <i className={option.icon} />
                              {option.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <span className="flex-grow-1" />

                    <div className="view-switcher" role="group" aria-label="Layout view">
                      <Link
                        to="#"
                        id="doc_view_grid"
                        className={view === 'grid' ? 'active' : undefined}
                        title="Grid view"
                        aria-label="Grid view"
                        onClick={() => setView('grid')}
                      >
                        <i className="ti ti-layout-grid" />
                      </Link>
                      <Link
                        to="#"
                        id="doc_view_list"
                        className={view === 'list' ? 'active' : undefined}
                        title="List view"
                        aria-label="List view"
                        onClick={() => setView('list')}
                      >
                        <i className="ti ti-list" />
                      </Link>
                    </div>

                    <button
                      type="button"
                      className="workspace-button workspace-button-icon"
                      id="doc_refresh"
                      title="Refresh"
                      aria-label="Refresh"
                      onClick={refresh}
                    >
                      <i className="ti ti-refresh" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm d-inline-flex align-items-center"
                      onClick={() => openModal('upload')}
                    >
                      <i className="ti ti-cloud-upload me-1" />
                      Upload
                    </button>
                  </div>
                </div>
              </div>
              {/* /Sticky Toolbar */}

              {/* Bulk Action Bar */}
              {selected.length > 0 ? (
                <div
                  id="bulk_action_bar"
                  className="bulk-action-bar d-flex align-items-center justify-content-between bg-light rounded p-2 mb-3"
                >
                  <span>
                    <span className="fw-semibold selected-count">{selected.length}</span> selected
                  </span>
                  <div className="d-flex gap-2 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => push('Documents verified')}
                    >
                      <i className="ti ti-check me-1" />
                      Verify
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => openModal('share')}
                    >
                      <i className="ti ti-share me-1" />
                      Share
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => push('Download started')}
                    >
                      <i className="ti ti-download me-1" />
                      Download
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => openModal('move')}
                    >
                      <i className="ti ti-folder-symlink me-1" />
                      Move
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => openModal('delete')}
                    >
                      <i className="ti ti-trash me-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ) : null}

              {loading ? <SkeletonGrid /> : null}

              {/* Document Grid */}
              {!loading && view === 'grid' ? (
                <div id="doc_grid" className="row g-3">
                  {filtered.map((doc) => (
                    <DocumentCard key={doc.id} {...cardProps(doc)} />
                  ))}
                </div>
              ) : null}

              {/* Document List */}
              {!loading && view === 'list' ? (
                <div id="doc_list">
                  <div className="card mb-0">
                    <div className="list-group list-group-flush">
                      {filtered.map((doc) => (
                        <DocumentListRow key={doc.id} {...cardProps(doc)} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Empty State */}
              {!loading && filtered.length === 0 ? (
                <div id="doc_empty" className="card mb-0">
                  <div className="card-body text-center py-5">
                    <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mx-auto mb-3">
                      <i className="ti ti-folder-off display-5" />
                    </span>
                    <h5 className="mb-1">No Documents Available</h5>
                    <p className="text-muted mb-3">
                      Upload student documents to start building the vault. Drag &amp; drop files or
                      use the upload button.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary d-inline-flex align-items-center mx-auto"
                      onClick={() => openModal('upload')}
                    >
                      <i className="ti ti-cloud-upload me-1" />
                      Upload Documents
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Pagination */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-3">
                <p className="mb-0 text-muted fs-13">Showing 1 – 6 of 9,842 documents</p>
                <nav aria-label="Documents pagination">
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled">
                      <button type="button" className="page-link" aria-label="Previous">
                        <i className="ti ti-chevron-left" />
                      </button>
                    </li>
                    {['1', '2', '3'].map((page) => (
                      <li className={`page-item${page === '1' ? ' active' : ''}`} key={page}>
                        <button type="button" className="page-link">
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className="page-item">
                      <button type="button" className="page-link" aria-label="Next">
                        <i className="ti ti-chevron-right" />
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          {/* /Workspace */}
        </div>
      </div>

      {/* Document Preview */}
      <Offcanvas
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Document Preview"
        labelledById="doc_preview_label"
      >
        <div className="ratio ratio-4x3 mb-3">
          <span className="d-flex align-items-center justify-content-center bg-light rounded">
            <i className="ti ti-file-type-pdf text-danger display-2" />
          </span>
        </div>
        <h6 className="mb-1 text-truncate">birth-certificate.pdf</h6>
        <span className="badge badge-soft-success d-inline-flex align-items-center mb-3">
          <i className="ti ti-circle-filled fs-5 me-1" />
          Verified
        </span>

        <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
          <Link to={routes.studentDetail} className="avatar avatar-md me-2">
            <ImageWithBasePath
              src="assets/img/students/student-01.jpg"
              className="rounded-circle flex-shrink-0"
              alt="Janet Daniel"
            />
          </Link>
          <div>
            <p className="mb-0 fw-medium text-dark">Janet Daniel</p>
            <span className="fs-12 text-muted">AD283778 · Class III</span>
          </div>
        </div>

        <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">File Information</h6>
        <ul className="list-unstyled mb-3">
          {previewInfo.map((row) => (
            <li
              className="d-flex align-items-center justify-content-between py-1 fs-13"
              key={row.key}
            >
              <span className="text-muted">{row.key}</span>
              <span className="text-dark">{row.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Verification History</h6>
        <ul className="list-unstyled mb-3">
          {previewHistory.map((entry, index) => (
            <li
              className={`d-flex ${index < previewHistory.length - 1 ? 'mb-2' : 'mb-0'}`}
              key={entry.title}
            >
              <span
                className={`avatar avatar-xs ${entry.tint} rounded-circle flex-shrink-0 me-2`}
              >
                <i className={entry.icon} />
              </span>
              <div>
                <p className="mb-0 fs-13 text-dark">{entry.title}</p>
                <span className="fs-12 text-muted">{entry.when}</span>
              </div>
            </li>
          ))}
        </ul>

        <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Remarks</h6>
        <p className="fs-13 text-muted mb-3">
          Document is clear and matches student records. No further action required.
        </p>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-outline-light bg-white flex-fill">
            <i className="ti ti-download me-1" />
            Download
          </button>
          <button
            type="button"
            className="btn btn-primary flex-fill"
            onClick={() => openModal('share')}
          >
            <i className="ti ti-share me-1" />
            Share
          </button>
        </div>
      </Offcanvas>

      {/* Browse (mobile sidebar) */}
      <Offcanvas
        open={navOpen}
        onClose={() => setNavOpen(false)}
        title="Browse Documents"
        placement="start"
        labelledById="doc_vault_nav_label"
      >
        <div className="row">
          <DocumentSidebar
            filter={smartFilter}
            onFilter={(id) => {
              setSmartFilter(id);
              setNavOpen(false);
            }}
            category={category}
            onCategory={setCategory}
            onOpenModal={openModal}
            onPreview={() => setPreviewOpen(true)}
          />
        </div>
      </Offcanvas>

      <DocumentModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default StudentDocuments;
