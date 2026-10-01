import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import DocumentRowMenu from './DocumentRowMenu';
import type { DocumentModalId, DocumentRecord } from '../data/documents.data';

const routes = all_routes;

export interface DocumentCardProps {
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

const DocumentCard = ({
  document,
  selected,
  onToggleSelect,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpenModal,
  onPreview,
  onFavourite,
}: DocumentCardProps) => (
  <div className="col-xxl-4 col-lg-6 col-md-6 doc-item">
    <div className="card card-hover mb-0 h-100">
      <div className="position-relative">
        <div className="ratio ratio-4x3">
          <button
            type="button"
            className="d-flex align-items-center justify-content-center bg-light rounded-top border-0"
            aria-label={`Preview ${document.name}`}
            onClick={onPreview}
          >
            <i className={`${document.icon} ${document.iconColor} display-3`} />
          </button>
        </div>

        <div className="position-absolute top-0 start-0 m-2 form-check mb-0">
          <input
            className="form-check-input row-check"
            type="checkbox"
            aria-label={`Select ${document.name}`}
            checked={selected}
            onChange={onToggleSelect}
          />
        </div>

        <span
          className={`position-absolute top-0 end-0 m-2 badge ${document.status.className} d-inline-flex align-items-center`}
        >
          <i className="ti ti-circle-filled fs-5 me-1" />
          {document.status.label}
        </span>

        <button
          type="button"
          className="position-absolute bottom-0 end-0 m-2 btn btn-icon btn-sm bg-white rounded-circle flex-shrink-0 shadow-sm"
          aria-label={`Favourite ${document.name}`}
          title="Favourite"
          onClick={onFavourite}
        >
          <i
            className={
              document.favourite ? 'ti ti-star-filled text-warning' : 'ti ti-star text-muted'
            }
          />
        </button>
      </div>

      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div className="overflow-hidden">
            <h6 className="mb-1 text-truncate">
              <button
                type="button"
                className="text-dark btn btn-link p-0 border-0 text-decoration-none"
                onClick={onPreview}
              >
                <i className={`${document.icon} ${document.iconColor} me-1`} />
                {document.name}
              </button>
            </h6>
            <span className={`badge ${document.category.className}`}>
              {document.category.label}
            </span>
          </div>
          <DocumentRowMenu
            className="flex-shrink-0"
            open={menuOpen}
            onToggle={onToggleMenu}
            onClose={onCloseMenu}
            onOpenModal={onOpenModal}
            onFavourite={onFavourite}
          />
        </div>

        <div className="d-flex align-items-center mb-3">
          <Link to={routes.studentDetail} className="avatar avatar-sm me-2 flex-shrink-0">
            <ImageWithBasePath
              src={document.photo}
              className="rounded-circle flex-shrink-0"
              alt={document.student}
            />
          </Link>
          <div className="overflow-hidden">
            <p className="mb-0 text-truncate text-dark fw-medium fs-13">{document.student}</p>
            <span className="fs-12 text-muted">
              {document.admissionNo} · {document.className}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between text-muted fs-12 mb-2">
          <span>
            <i className="ti ti-file me-1" />
            {document.size}
          </span>
          <span>
            <i className="ti ti-calendar me-1" />
            {document.date}
          </span>
        </div>

        <p className="fs-12 text-muted mb-3">
          <i className="ti ti-user me-1" />
          {document.uploadedBy}
        </p>

        <div className="d-flex align-items-center gap-1 border-top pt-3">
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
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
            title="Verify"
            aria-label="Verify"
            onClick={() => onOpenModal('verify')}
          >
            <i className="ti ti-checks" />
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0"
            title="Share"
            aria-label="Share"
            onClick={() => onOpenModal('share')}
          >
            <i className="ti ti-share" />
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white btn-icon btn-sm rounded-circle flex-shrink-0 ms-auto"
            title="Rename"
            aria-label="Rename"
            onClick={() => onOpenModal('rename')}
          >
            <i className="ti ti-pencil" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default DocumentCard;
