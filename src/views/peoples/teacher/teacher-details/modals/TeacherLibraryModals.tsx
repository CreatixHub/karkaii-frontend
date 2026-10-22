import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { teacherProfile } from '../data/teacherProfile.data';
import type { LoginCredential } from '../data/teacherLibrary.data';
import { libraryLoginCredentials } from '../data/teacherLibrary.data';

export type TeacherLibraryModalId = 'loginDetail';

export interface TeacherLibraryModalsProps {
  active: TeacherLibraryModalId | null;
  onClose: () => void;
  /** Defaults to the template's Teacher / Parent pair. */
  credentials?: LoginCredential[];
}

const TeacherLibraryModals = ({
  active,
  onClose,
  credentials = libraryLoginCredentials,
}: TeacherLibraryModalsProps) => (
  <>
    {/* Login Details */}
    <Modal
      open={active === 'loginDetail'}
      onClose={onClose}
      title="Login Details"
      dialogClassName=" modal-lg"
      footer={
        <button type="button" className="btn btn-light me-2" onClick={onClose}>
          Cancel
        </button>
      }
    >
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
            {credentials.map((credential) => (
              <tr key={credential.userType}>
                <td>{credential.userType}</td>
                <td>{credential.userName}</td>
                <td>{credential.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
    {/* /Login Details */}
  </>
);

export default TeacherLibraryModals;
