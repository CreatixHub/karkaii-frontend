import type { DocumentModalId } from '../data/documents.data';
import {
  categories,
  favouriteDocuments,
  recentDocuments,
  sharedDocuments,
  smartFilters,
} from '../data/documents.data';

export interface DocumentSidebarProps {
  filter: string;
  onFilter: (id: string) => void;
  category: string | null;
  onCategory: (id: string | null) => void;
  onOpenModal: (modal: DocumentModalId) => void;
  onPreview: () => void;
}

const DocumentSidebar = ({
  filter,
  onFilter,
  category,
  onCategory,
  onOpenModal,
  onPreview,
}: DocumentSidebarProps) => (
  <div className="col-xxl-3 col-xl-12 col-lg-12 d-none d-lg-block">
    <div className="card mb-0 h-100">
      <div className="card-body">
        <button
          type="button"
          className="btn btn-primary w-100 mb-3 d-inline-flex align-items-center justify-content-center"
          onClick={() => onOpenModal('upload')}
        >
          <i className="ti ti-cloud-upload me-1" />
          Upload
        </button>

        <h4 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Smart Filters</h4>
        <div className="nav flex-column mb-3" role="tablist" aria-label="Smart filters">
          {smartFilters.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`nav-link d-flex align-items-center justify-content-between rounded px-2 py-2${
                filter === item.id ? ' active' : ' text-dark'
              }`}
              onClick={() => onFilter(item.id)}
            >
              <span>
                <i className={`${item.icon} me-2`} />
                {item.label}
              </span>
              <span className={`badge ${item.badgeClass}`}>{item.count}</span>
            </button>
          ))}
        </div>

        <h5 className="fs-12 text-uppercase text-muted fw-semibold mb-2 d-flex align-items-center justify-content-between">
          Categories
          <button
            type="button"
            className="text-primary btn btn-link p-0 border-0"
            aria-label="Manage categories"
            onClick={() => onOpenModal('categories')}
          >
            <i className="ti ti-settings" />
          </button>
        </h5>
        <div className="nav flex-column mb-3">
          {categories.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`nav-link d-flex align-items-center justify-content-between rounded px-2 py-2${
                category === item.id ? ' active' : ' text-dark'
              }`}
              onClick={() => onCategory(category === item.id ? null : item.id)}
            >
              <span>
                <i className={`ti ti-folder ${item.color} me-2`} />
                {item.label}
              </span>
              <span className="badge bg-light text-dark">{item.count}</span>
            </button>
          ))}
        </div>

        <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Recent Documents</h6>
        <ul className="list-unstyled mb-3">
          {recentDocuments.map((doc, index) => (
            <li className={index < recentDocuments.length - 1 ? 'mb-2' : 'mb-0'} key={doc.id}>
              <button
                type="button"
                className="d-flex align-items-center text-dark btn btn-link p-0 border-0 text-decoration-none w-100"
                onClick={onPreview}
              >
                <i className={`${doc.icon} ${doc.color} me-2`} />
                <span className="text-truncate">
                  <span className="d-block text-truncate">{doc.name}</span>
                  <small className="text-muted">{doc.owner}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Favourite Documents</h6>
        <ul className="list-unstyled mb-3">
          {favouriteDocuments.map((doc, index) => (
            <li className={index < favouriteDocuments.length - 1 ? 'mb-2' : 'mb-0'} key={doc.id}>
              <button
                type="button"
                className="d-flex align-items-center text-dark btn btn-link p-0 border-0 text-decoration-none w-100"
                onClick={onPreview}
              >
                <i className="ti ti-star-filled text-warning me-2" />
                <span className="text-truncate">{doc.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <h6 className="fs-12 text-uppercase text-muted fw-semibold mb-2">Shared Documents</h6>
        <ul className="list-unstyled mb-0">
          {sharedDocuments.map((doc, index) => (
            <li className={index < sharedDocuments.length - 1 ? 'mb-2' : 'mb-0'} key={doc.id}>
              <button
                type="button"
                className="d-flex align-items-center text-dark btn btn-link p-0 border-0 text-decoration-none w-100"
                onClick={onPreview}
              >
                <i className="ti ti-share text-primary me-2" />
                <span className="text-truncate">{doc.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default DocumentSidebar;
