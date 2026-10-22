import { useState } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import FormField from './components/FormField';
import FormSection from './components/FormSection';
import {
  EDIT_DEFAULTS,
  OTHER_INFORMATION_ID,
  addressFields,
  guardianGroups,
  hostelFields,
  medicalTagFields,
  otherFields,
  personalFields,
  previousSchoolFields,
  sectionMeta,
  sectionNav,
  siblingFields,
  transportFields,
} from './data/studentForm.data';

const routes = all_routes;

export interface StudentFormProps {
  mode?: 'add' | 'edit';
}

/** The photo uploader repeated in Personal Information and each parent block. */
const PhotoUpload = () => (
  <div className="col-md-12">
    <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
      <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
        <i className="ti ti-photo-plus fs-16" />
      </div>
      <div className="profile-upload">
        <div className="profile-uploader d-flex align-items-center">
          <div className="drag-upload-btn mb-3">
            Upload
            <input type="file" className="form-control image-sign" multiple aria-label="Upload" />
          </div>
          <button type="button" className="btn btn-primary mb-3">
            Remove
          </button>
        </div>
        <p className="fs-12">Upload image size 4MB, Format JPG, PNG, SVG</p>
      </div>
    </div>
  </div>
);

const StudentForm = ({ mode = 'add' }: StudentFormProps) => {
  const isEdit = mode === 'edit';

  const [values, setValues] = useState<Record<string, string>>(() =>
    isEdit ? { ...EDIT_DEFAULTS } : {},
  );
  const [siblingRows, setSiblingRows] = useState([0]);
  const [hasSibling, setHasSibling] = useState(true);
  const [guardianType, setGuardianType] = useState('parents');
  const [condition, setCondition] = useState('good');

  const setValue = (id: string, value: string) =>
    setValues((current) => ({ ...current, [id]: value }));

  const field = (spec: Parameters<typeof FormField>[0]['field']) => (
    <FormField key={spec.id} field={spec} value={values[spec.id] ?? ''} onChange={setValue} />
  );

  const form = (
    <form
      action="#"
      id={isEdit ? undefined : 'add_student_form'}
      onSubmit={(event) => event.preventDefault()}
    >
      {/* Personal Information */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.personal.id}
        icon={sectionMeta.personal.icon}
        title={sectionMeta.personal.title}
      >
        <div className="row">
          <PhotoUpload />
        </div>
        <div className="row row-cols-xxl-4 row-cols-md-6">{personalFields.map(field)}</div>
      </FormSection>

      {/* Parents & Guardian Information */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.guardian.id}
        icon="ti ti-user-shield"
        title={sectionMeta.guardian.title}
        bodyClass="card-body pb-0"
      >
        {guardianGroups.map((group, index) => (
          <div
            className={index < guardianGroups.length - 1 ? 'border-bottom mb-3' : ''}
            key={group.id}
          >
            <h5 className="mb-3">{group.title}</h5>
            <div className="row">
              {group.id === 'guardian' ? (
                <div className="col-md-12">
                  <div className="mb-2">
                    <div className="d-flex align-items-center flex-wrap">
                      <label className="form-label text-dark fw-normal me-2">If Guardian Is</label>
                      {[
                        { id: 'parents', label: 'Parents' },
                        { id: 'guardian', label: 'Guardian' },
                        { id: 'others', label: 'Others' },
                      ].map((option, optionIndex) => (
                        <div
                          className={`form-check${optionIndex < 2 ? ' me-3' : ''} mb-2`}
                          key={option.id}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="guardian"
                            id={option.id === 'others' ? 'guardian-others' : option.id}
                            checked={guardianType === option.id}
                            onChange={() => setGuardianType(option.id)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={option.id === 'others' ? 'guardian-others' : option.id}
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <PhotoUpload />
              )}
              {group.fields.map(field)}
            </div>
          </div>
        ))}
      </FormSection>

      {/* Sibilings */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.siblings.id}
        icon={sectionMeta.siblings.icon}
        title={sectionMeta.siblings.title}
        bodyClass="card-body"
      >
        <div className="addsibling-info">
          <div className="row">
            <div className="col-md-12">
              <div className="mb-2">
                <label className="form-label">Sibiling Info</label>
                <div className="d-flex align-items-center flex-wrap">
                  <label className="form-label text-dark fw-normal me-2">
                    Is Sibiling studying in same school
                  </label>
                  <div className="form-check me-3 mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sibling"
                      id="yes"
                      checked={hasSibling}
                      onChange={() => setHasSibling(true)}
                    />
                    <label className="form-check-label" htmlFor="yes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sibling"
                      id="no"
                      checked={!hasSibling}
                      onChange={() => setHasSibling(false)}
                    />
                    <label className="form-check-label" htmlFor="no">
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {siblingRows.map((row) => (
              <div className="col-12" key={row}>
                <div className="row">
                  {siblingFields.slice(0, 3).map((spec) => (
                    <FormField
                      key={`${spec.id}-${row}`}
                      field={{ ...spec, id: row === 0 ? spec.id : `${spec.id}-${row}` }}
                      value={values[row === 0 ? spec.id : `${spec.id}-${row}`] ?? ''}
                      onChange={setValue}
                    />
                  ))}
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="w-100">
                          <label className="form-label" htmlFor={row === 0 ? 'class-2' : `class-2-${row}`}>
                            Class
                          </label>
                          <FormField
                            field={{
                              ...siblingFields[3],
                              id: row === 0 ? 'class-2' : `class-2-${row}`,
                              col: '',
                              wrapper: '',
                            }}
                            value={values[row === 0 ? 'class-2' : `class-2-${row}`] ?? ''}
                            onChange={setValue}
                          />
                        </div>
                        <div>
                          <label className="form-label">&nbsp;</label>
                          <button
                            type="button"
                            className="trash-icon ms-3"
                            aria-label="Remove sibling"
                            onClick={() =>
                              setSiblingRows((rows) =>
                                rows.length > 1 ? rows.filter((item) => item !== row) : rows,
                              )
                            }
                          >
                            <i className="ti ti-trash-x" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-top pt-3">
          <button
            type="button"
            className="add-sibling btn btn-primary d-inline-flex align-items-center"
            onClick={() => setSiblingRows((rows) => [...rows, (rows[rows.length - 1] ?? 0) + 1])}
          >
            <i className="ti ti-circle-plus me-2" />
            Add New
          </button>
        </div>
      </FormSection>

      {/* Address */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.address.id}
        icon={sectionMeta.address.icon}
        title={sectionMeta.address.title}
      >
        <div className="row">{addressFields.map(field)}</div>
      </FormSection>

      {/* Transport Information */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.transport.id}
        icon={sectionMeta.transport.icon}
        title={sectionMeta.transport.title}
      >
        <div className="row">{transportFields.map(field)}</div>
      </FormSection>

      {/* Hostel Information */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.hostel.id}
        icon={sectionMeta.hostel.icon}
        title={sectionMeta.hostel.title}
      >
        <div className="row">{hostelFields.map(field)}</div>
      </FormSection>

      {/* Documents */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.documents.id}
        icon={sectionMeta.documents.icon}
        title={sectionMeta.documents.title}
      >
        <div className="row">
          <div className="col-12 col-lg-6">
            <div className="mb-2">
              <div className="mb-3">
                <label className="form-label mb-1">Medical Condition</label>
                <p>Upload image size of 4MB, Accepted Format PDF</p>
              </div>
              <div className="d-flex align-items-center flex-wrap">
                <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                  <i className="ti ti-file-upload me-1" />
                  Change
                  <input
                    type="file"
                    className="form-control image_sign"
                    multiple
                    aria-label="Change"
                  />
                </div>
                <p className="mb-2">BirthCertificate.pdf</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="mb-2">
              <div className="mb-3">
                <label className="form-label mb-1">Upload Transfer Certificate</label>
                <p>Upload image size of 4MB, Accepted Format PDF</p>
              </div>
              <div className="d-flex align-items-center flex-wrap">
                <div className="btn btn-primary drag-upload-btn mb-2">
                  <i className="ti ti-file-upload me-1" />
                  Upload Document
                  <input
                    type="file"
                    className="form-control image_sign"
                    multiple
                    aria-label="Upload Document"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Medical History */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.medical.id}
        icon={sectionMeta.medical.icon}
        title={sectionMeta.medical.title}
      >
        <div className="row">
          <div className="col-md-12">
            <div className="mb-2">
              <label className="form-label">Medical Condition</label>
              <div className="d-flex align-items-center flex-wrap">
                <label className="form-label text-dark fw-normal me-2">
                  Medical Condition of a Student
                </label>
                {[
                  { id: 'good', label: 'Good' },
                  { id: 'bad', label: 'Bad' },
                  { id: 'others', label: 'Others' },
                ].map((option, index) => (
                  <div
                    className={`form-check${index < 2 ? ' me-3' : ''} mb-2`}
                    key={option.id}
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      name="condition"
                      id={option.id}
                      checked={condition === option.id}
                      onChange={() => setCondition(option.id)}
                    />
                    <label className="form-check-label" htmlFor={option.id}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {medicalTagFields.map(field)}
        </div>
      </FormSection>

      {/* Previous School Details */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.previous.id}
        icon={sectionMeta.previous.icon}
        title={sectionMeta.previous.title}
      >
        <div className="row">{previousSchoolFields.map(field)}</div>
      </FormSection>

      {/* Other Details */}
      <FormSection
        id={isEdit ? undefined : sectionMeta.other.id}
        icon={sectionMeta.other.icon}
        title={sectionMeta.other.title}
      >
        <div className="row">
          {otherFields.map(field)}
          <FormField
            field={{
              id: OTHER_INFORMATION_ID,
              label: 'Other Information',
              kind: 'textarea',
              col: 'col-md-12',
              rows: 3,
              wrapper: isEdit ? 'mb-4' : 'mb-3',
              placeholder: isEdit ? 'Other Information' : undefined,
            }}
            value={values[OTHER_INFORMATION_ID] ?? ''}
            onChange={setValue}
          />
        </div>
      </FormSection>

      {isEdit ? (
        <div className="text-end">
          <Link to={routes.studentGrid} className="btn btn-light me-3">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      ) : (
        <div className="d-flex align-items-center justify-content-end gap-2 bg-white border rounded p-3 sticky-bottom flex-wrap">
          <Link to={routes.studentGrid} className="btn btn-light">
            Cancel
          </Link>
          <button
            type="submit"
            name="save_draft"
            className="btn btn-outline-primary d-inline-flex align-items-center"
          >
            <i className="ti ti-device-floppy me-2" />
            Save Draft
          </button>
          <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
            <i className="ti ti-circle-plus me-2" />
            Add Student
          </button>
        </div>
      )}
    </form>
  );

  return (
    <div className="page-wrapper">
      <div className="content content-two">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="my-auto mb-2">
            {isEdit ? <h4 className="mb-1">Edit Student</h4> : <h3 className="mb-1">Add Student</h3>}
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={routes.studentGrid}>Students</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {isEdit ? 'Edit Student' : 'Add Student'}
                </li>
              </ol>
            </nav>
          </div>

          {isEdit ? null : (
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
              <Link
                to={routes.studentGrid}
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              >
                <i className="ti ti-arrow-left me-2" />
                Back to List
              </Link>
              <button
                type="submit"
                form="add_student_form"
                name="save_draft"
                className="btn btn-light d-inline-flex align-items-center"
              >
                <i className="ti ti-device-floppy me-2" />
                Save Draft
              </button>
              <button
                type="submit"
                form="add_student_form"
                className="btn btn-primary d-inline-flex align-items-center"
              >
                <i className="ti ti-circle-plus me-2" />
                Add Student
              </button>
            </div>
          )}
        </div>
        {/* /Page Header */}

        <div className="row">
          {isEdit ? (
            <div className="col-md-12">{form}</div>
          ) : (
            <>
              {/* Section Navigation */}
              <div className="col-xxl-3 col-lg-4 d-none d-lg-block">
                <div className="card border sticky-top">
                  <div className="card-header bg-light">
                    <div className="d-flex align-items-center">
                      <span className="bg-white avatar avatar-sm me-2 text-gray-7 flex-shrink-0">
                        <i className="ti ti-list-details fs-16" />
                      </span>
                      <h4 className="text-dark mb-0 fs-16 fw-medium">Form Sections</h4>
                    </div>
                  </div>
                  <div className="card-body p-2">
                    <nav className="nav nav-pills flex-column gap-1">
                      {sectionNav.map((item) => (
                        <a
                          className="nav-link d-flex align-items-center"
                          href={`#${item.id}`}
                          key={item.id}
                        >
                          <i className={`${item.icon} me-2`} />
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
              {/* /Section Navigation */}

              <div className="col-12 col-xxl-9 col-lg-8">{form}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentForm;
