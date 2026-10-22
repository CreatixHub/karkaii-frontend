import { BlockHeading } from '../primitives';
import type { ProfileAction } from '../../data/studentProfileActions';

const DOCUMENTS = [
  { id: 'birth', accent: 'accent-primary', icon: 'ti ti-file-certificate', ext: 'PDF', name: 'Birth Certificate', size: '240 KB', date: '12 Mar 2024', pill: 'ok', pillIcon: 'ti ti-discount', status: 'Verified' },
  { id: 'transfer', accent: 'accent-info', icon: 'ti ti-file-text', ext: 'PDF', name: 'Transfer Certificate', size: '180 KB', date: '18 Mar 2024', pill: 'ok', pillIcon: 'ti ti-discount', status: 'Verified' },
  { id: 'marks', accent: 'accent-success', icon: 'ti ti-report', ext: 'PDF', name: 'Mark Sheets (2023-24)', size: '320 KB', date: '30 Jun 2024', pill: 'ok', pillIcon: 'ti ti-discount', status: 'Verified' },
  { id: 'medical', accent: 'accent-danger', icon: 'ti ti-heartbeat', ext: 'PDF', name: 'Medical Records', size: '150 KB', date: '12 Jun 2024', pill: 'ok', pillIcon: 'ti ti-discount', status: 'Verified' },
  { id: 'identity', accent: 'accent-warning', icon: 'ti ti-id', ext: 'JPG', name: 'Identity Proof', size: '210 KB', date: '15 Mar 2024', pill: 'warn', pillIcon: 'ti ti-clock', status: 'Pending' },
  { id: 'photos', accent: 'accent-purple', icon: 'ti ti-photo', ext: 'ZIP', name: 'Passport Photos', size: '1.2 MB', date: '15 Mar 2024', pill: 'ok', pillIcon: 'ti ti-discount', status: 'Verified' },
];

export interface DocumentsPaneProps {
  onAction: (action: ProfileAction) => void;
  onDownloadDoc: (name: string) => void;
}

const DocumentsPane = ({ onAction, onDownloadDoc }: DocumentsPaneProps) => (
  <div id="profile-pane-documents" className="tab-pane-block active" data-pane="documents" role="tabpanel">
    <div className="profile-tile-head mb-3">
      <BlockHeading icon="ti ti-files" className="mb-0" sub="6 files">
        Documents{' '}
      </BlockHeading>
      <div className="d-flex gap-2">
        <button
          type="button"
          className="profile-button profile-button-sm"
          onClick={() => onAction('upload')}
        >
          <i className="ti ti-upload" />
          Upload
        </button>
        <button
          type="button"
          className="profile-button profile-button-sm"
          onClick={() => onAction('download')}
        >
          <i className="ti ti-download" />
          Download All
        </button>
      </div>
    </div>

    <div className="row g-3">
      {DOCUMENTS.map((doc) => (
        <div className="col-md-6 col-xl-4" key={doc.id}>
          <div className={`profile-document ${doc.accent}`}>
            <div className="document-top">
              <span className="avatar avatar-icon avatar-accent-soft">
                <i className={doc.icon} />
              </span>
              <span className="document-ext">{doc.ext}</span>
            </div>
            <div className="document-name">{doc.name}</div>
            <div className="document-meta">
              <i className="ti ti-database" />
              {doc.size}
              <i className="ti ti-calendar ms-2" />
              {doc.date}
            </div>
            <div className="document-foot">
              <span className={`profile-pill ${doc.pill}`}>
                <i className={doc.pillIcon} />
                {doc.status}
              </span>
              <span className="document-actions">
                <button
                  type="button"
                  className="profile-button profile-icon-button profile-button-sm"
                  title="View"
                  aria-label={`View ${doc.name}`}
                >
                  <i className="ti ti-eye" />
                </button>
                <button
                  type="button"
                  className="profile-button profile-icon-button profile-button-sm"
                  title="Download"
                  aria-label={`Download ${doc.name}`}
                  onClick={() => onDownloadDoc(doc.name)}
                >
                  <i className="ti ti-download" />
                </button>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DocumentsPane;
