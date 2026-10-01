import { useEffect } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { teacherProfile } from '../data/teacherProfile.data';
import { loginCredentials } from '../data/teacherDetailsWorkspace.data';

export interface LoginDetailsModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginDetailsModal = ({ open, onClose }: LoginDetailsModalProps) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        id="login_detail"
        role="dialog"
        aria-modal="true"
        aria-label="Login Details"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Login Details</h4>
              <button
                type="button"
                className="btn-close custom-btn-close"
                aria-label="Close"
                onClick={onClose}
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="student-detail-info">
                <span className="student-img">
                  <ImageWithBasePath src={teacherProfile.avatar} alt="img" />
                </span>
                <div className="name-info">
                  <h5 className="fs-15">
                    {teacherProfile.name} <span>{teacherProfile.classSection}</span>
                  </h5>
                </div>
              </div>
              <div className="table-responsive custom-table no-datatable_length">
                <table className="table datanew">
                  <thead className="thead-light">
                    <tr>
                      <th>User Type</th>
                      <th>User Name</th>
                      <th>Password </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginCredentials.map((credential) => (
                      <tr key={credential.userType}>
                        <td>{credential.userType}</td>
                        <td>{credential.userName}</td>
                        <td>{credential.password}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light me-2" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default LoginDetailsModal;
