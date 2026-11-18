import type { LiveProfile } from '../../data/teacherProfileLive';

export interface TeacherDetailsPaneProps {
  active: boolean;
  profile: LiveProfile;
}

interface Row {
  label: string;
  value: string;
}

const FieldColumn = ({ row, className }: { row: Row; className: string }) => (
  <div className={className}>
    <div className="mb-3">
      <p className="mb-1 text-dark fw-medium">{row.label}</p>
      <p>{row.value}</p>
    </div>
  </div>
);

const TeacherDetailsPane = ({ active, profile }: TeacherDetailsPaneProps) => {
  const profileDetails: Row[] = [
    { label: 'Full Name', value: profile.name },
    { label: 'Date of Birth', value: profile.dob },
    { label: 'Gender', value: profile.gender },
    { label: 'Blood Group', value: profile.bloodGroup },
    { label: 'Marital Status', value: profile.maritalStatus },
    { label: "Father's Name", value: profile.fatherName },
    { label: 'Email', value: profile.email },
    { label: 'Phone', value: profile.phone },
    { label: 'Alternate Phone', value: profile.altPhone },
    { label: 'Qualification', value: profile.qualification },
    { label: 'Experience', value: profile.experience },
  ];

  const bankDetails: Row[] = [
    { label: 'Account Holder', value: profile.bankAccountName },
    { label: 'Bank', value: profile.bankName },
    { label: 'Branch', value: profile.bankBranch },
    { label: 'IFSC', value: profile.bankIfsc },
    { label: 'Account Number', value: profile.bankAccount },
    { label: 'EPF No', value: profile.epfNo },
  ];

  const workDetails: Row[] = [
    { label: 'Employee ID', value: profile.employeeNo },
    { label: 'Joined On', value: profile.joinedOn },
    { label: 'Confirmed On', value: profile.confirmedOn },
    { label: 'Employment Type', value: profile.employmentType },
    { label: 'Staff Type', value: profile.staffType },
    { label: 'Status', value: profile.statusLabel },
    { label: 'Classes', value: profile.sectionsText },
    { label: 'Subjects', value: profile.subjectsText },
  ];

  return (
    <div className={`tab-pane fade${active ? ' show active' : ''}`} id="teacher_details">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="d-flex align-items-center gap-2">
                <i className="ti ti-user text-primary" />
                Profile Details
              </h5>
            </div>
            <div className="card-body">
              <div className="border rounded p-3 pb-0">
                <div className="row">
                  {profileDetails.map((row) => (
                    <div className="col-sm-6 col-lg-4" key={row.label}>
                      <div className="mb-3">
                        <p className="text-dark fw-medium mb-1">{row.label}</p>
                        <p>{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xxl-6 d-flex">
          <div className="card flex-fill card-hover">
            <div className="card-header">
              <h5 className="d-flex align-items-center gap-2">
                <i className="ti ti-map-pin text-primary" />
                Address
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-map-pin" />
                </span>
                <div>
                  <p className="text-dark fw-medium mb-1">Current Address</p>
                  <p>{profile.address}</p>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <span className="avatar avatar-md bg-light-300 rounded me-2 flex-shrink-0 text-default">
                  <i className="ti ti-home" />
                </span>
                <div>
                  <p className="text-dark fw-medium mb-1">Permanent Address</p>
                  <p>{profile.permanentAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xxl-6 d-flex">
          <div className="card flex-fill card-hover">
            <div className="card-header">
              <h5 className="d-flex align-items-center gap-2">
                <i className="ti ti-files text-primary" />
                Documents
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted mb-0">No documents have been uploaded for this teacher yet.</p>
            </div>
          </div>
        </div>

        <div className="col-12 col-xxl-6 d-flex">
          <div className="card flex-fill card-hover">
            <div className="card-header">
              <h5 className="d-flex align-items-center gap-2">
                <i className="ti ti-building-bank text-primary" />
                Bank Details
              </h5>
            </div>
            <div className="card-body pb-1">
              <div className="row">
                {bankDetails.map((row) => (
                  <FieldColumn row={row} className="col-md-4" key={row.label} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xxl-6 d-flex">
          <div className="card flex-fill card-hover">
            <div className="card-header">
              <h5 className="d-flex align-items-center gap-2">
                <i className="ti ti-briefcase text-primary" />
                Work Details
              </h5>
            </div>
            <div className="card-body pb-1">
              <div className="row">
                {workDetails.map((row) => (
                  <FieldColumn row={row} className="col-md-4" key={row.label} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {profile.social.length > 0 ? (
          <div className="col-12 d-flex">
            <div className="card flex-fill card-hover">
              <div className="card-header">
                <h5 className="d-flex align-items-center gap-2">
                  <i className="ti ti-share text-primary" />
                  Social Media
                </h5>
              </div>
              <div className="card-body pb-1">
                <div className="row row-cols-xxl-5 row-cols-xl-3">
                  {profile.social.map((row) => (
                    <FieldColumn row={row} className="col" key={row.label} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default TeacherDetailsPane;