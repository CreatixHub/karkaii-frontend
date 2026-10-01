import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import DocumentRowMenu from './DocumentRowMenu';
import type { DocumentModalId, DocumentRecord } from '../data/documents.data';

const routes = all_routes;

export interface DocumentListRowProps {
  document: DocumentRecord;
  selected: boolean;
  onToggleSelect: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpenModal: (modal: DocumentModalId) => void;
  onPreview: () => void;
  onFavourite: () => void;
}

const DocumentListRow = ({
  document,
  selected,
  onToggleSelect,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpenModal,
  onPreview,
  onFavourite,
}: DocumentListRowProps) => (
  <div className="list-group-item d-flex align-items-center gap-3 flex-wrap doc-item">
    <div className="form-check mb-0">
      <input
        className="form-check-input row-check"
        type="checkbox"
        aria-label={`Select ${document.name}`}
        checked={selected}
        onChange={onToggleSelect}
      />
    </div>

    <span className={`avatar avatar-md ${document.avatarClass} rounded flex-shrink-0`}>
      <i className={`${document.icon} fs-20`} />
    </span>

    <div className="overflow-hidden flex-fill">
      <h6 className="mb-0 text-truncate">
        <button
          type="button"
          className="text-dark btn btn-link p-0 border-0 text-decoration-none"
          onClick={onPreview}
        >
          {document.name}
        </button>
      </h6>
      <span className="fs-12 text-muted">
        {document.category.label} · {document.size} · {document.date}
      </span>
    </div>

    <div className="d-none d-md-flex align-items-center">
      <Link to={routes.studentDetail} className="avatar avatar-sm me-2">
        <ImageWithBasePath
          src={document.photo}
          className="rounded-circle flex-shrink-0"
          alt={document.student}
        />
      </Link>
      <div>
        <p className="mb-0 fs-13 text-dark">{document.student}</p>
        <span className="fs-12 text-muted">{document.admissionNo}</span>
      </div>
    </div>

    <span className={`badge ${document.status.className} d-inline-flex align-items-center`}>
      <i className="ti ti-circle-filled fs-5 me-1" />
      {document.status.label}
    </span>

    <div className="d-flex align-items-center gap-1">
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
        title="Preview"
        aria-label="Preview"
        onClick={onPreview}
      >
        <i className="ti ti-eye" />
      </button>
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
        title="Download"
        aria-label="Download"
      >
        <i className="ti ti-download" />
      </button>
      <DocumentRowMenu
        open={menuOpen}
        onToggle={onToggleMenu}
        onClose={onCloseMenu}
        onOpenModal={onOpenModal}
        onFavourite={onFavourite}
      />
    </div>
  </div>
);

export default DocumentListRow;
