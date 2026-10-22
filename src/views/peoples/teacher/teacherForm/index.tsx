import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { useToasts } from '@hooks/useToasts';
import { all_routes } from '@/routes/all_routes';
import FormField from './components/FormField';
import FormSection from './components/FormSection';
import {
  BASE_DEFAULTS,
  EDIT_DEFAULTS,
  documentUploads,
  documentsSection,
  formSections,
  passwordFields,
  passwordSection,
} from './data/teacherForm.data';

const routes = all_routes;

export interface TeacherFormProps {
  mode?: 'add' | 'edit';
}

const TeacherForm = ({ mode = 'add' }: TeacherFormProps) => {
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Teacher' : 'Add Teacher';

  const navigate = useNavigate();
  const { toasts, push, dismiss } = useToasts();

  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...BASE_DEFAULTS,
    ...(isEdit ? EDIT_DEFAULTS : {}),
  }));
  const [photoName, setPhotoName] = useState('');
  const [documentNames, setDocumentNames] = useState<Record<string, string>>(() =>
    Object.fromEntries(documentUploads.map((doc) => [doc.key, doc.fileName])),
  );
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Clearing the photo has to reset the picker too, or re-choosing the same
  // file fires no change event.
  const photoInput = useRef<HTMLInputElement>(null);

  const setValue = (id: string, value: string) =>
    setValues((current) => ({ ...current, [id]: value }));

  const toggleReveal = (id: string) =>
    setRevealed((current) => ({ ...current, [id]: !current[id] }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    push(isEdit ? 'Teacher details updated successfully.' : 'Teacher added successfully.');
    navigate(routes.teacherGrid);
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">{title}</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  {/* The edit page drops the link on this crumb. */}
                  {isEdit ? (
                    <li className="breadcrumb-item">Teachers</li>
                  ) : (
                    <li className="breadcrumb-item">
                      <Link to={routes.teacherGrid}>Teachers</Link>
                    </li>
                  )}
                  <li className="breadcrumb-item active" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}

          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit}>
                {/* Personal Information → Social Media Links */}
                {formSections.map((section) => (
                  <FormSection key={section.key} icon={section.icon} title={section.title}>
                    {section.photoUpload ? (
                      <div className="row">
                        <div className="col-md-12">
                          <div className="d-flex align-items-center flex-wrap row-gap-3 mb-3">
                            <div className="d-flex align-items-center justify-content-center avatar avatar-xxl border border-dashed me-2 flex-shrink-0 text-dark frames">
                              <i className="ti ti-photo-plus fs-16" />
                            </div>
                            <div className="profile-upload">
                              <div className="profile-uploader d-flex align-items-center">
                                <div className="drag-upload-btn mb-3">
                                  Upload
                                  <input
                                    ref={photoInput}
                                    type="file"
                                    className="form-control image-sign"
                                    multiple
                                    aria-label="Upload"
                                    onChange={(event) =>
                                      setPhotoName(event.target.files?.[0]?.name ?? '')
                                    }
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-primary mb-3"
                                  onClick={() => {
                                    setPhotoName('');
                                    if (photoInput.current) photoInput.current.value = '';
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                              <p className="fs-12">Upload image size 4MB, Format JPG, PNG, SVG</p>
                              {photoName ? <p className="fs-12 mb-0">{photoName}</p> : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <div className={section.rowClass}>
                      {section.fields.map((field) => (
                        <FormField
                          key={field.id}
                          field={field}
                          value={values[field.id] ?? ''}
                          onChange={setValue}
                          isEdit={isEdit}
                        />
                      ))}
                    </div>
                  </FormSection>
                ))}
                {/* /Personal Information → Social Media Links */}

                {/* Documents */}
                <FormSection icon={documentsSection.icon} title={documentsSection.title}>
                  <div className="row">
                    {documentUploads.map((doc) => (
                      <div className="col-12 col-lg-6" key={doc.key}>
                        <div className="mb-2">
                          <div className="mb-3">
                            <label className="form-label">{doc.label}</label>
                            <p>Upload image size of 4MB, Accepted Format PDF</p>
                          </div>
                          <div className="d-flex align-items-center flex-wrap">
                            <div className="btn btn-primary drag-upload-btn mb-2 me-2">
                              <i className="ti ti-file-upload me-1" />
                              {doc.button}
                              <input
                                type="file"
                                className="form-control image_sign"
                                multiple
                                aria-label={doc.button}
                                onChange={(event) =>
                                  setDocumentNames((current) => ({
                                    ...current,
                                    [doc.key]: event.target.files?.[0]?.name ?? doc.fileName,
                                  }))
                                }
                              />
                            </div>
                            <p className="mb-2">{documentNames[doc.key]}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </FormSection>
                {/* /Documents */}

                {/* Password */}
                <FormSection icon={passwordSection.icon} title={passwordSection.title}>
                  <div className="row">
                    {passwordFields.map((field) => (
                      <div className="col-md-6" key={field.id}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor={field.id}>
                            {field.label}
                          </label>
                          <div className="pass-group">
                            <input
                              type={revealed[field.id] ? 'text' : 'password'}
                              autoComplete="new-password"
                              className="pass-input form-control"
                              id={field.id}
                              value={values[field.id] ?? ''}
                              onChange={(event) => setValue(field.id, event.target.value)}
                            />
                            <span
                              className={`ti toggle-password ${
                                revealed[field.id] ? 'ti-eye' : 'ti-eye-off'
                              }`}
                              role="button"
                              tabIndex={0}
                              aria-label={`${revealed[field.id] ? 'Hide' : 'Show'} ${field.label}`}
                              onClick={() => toggleReveal(field.id)}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  toggleReveal(field.id);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </FormSection>
                {/* /Password */}

                <div className="text-end">
                  <button
                    type="button"
                    className="btn btn-light me-3"
                    onClick={() => navigate(routes.teacherGrid)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {title}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* The template closes the body with a visually hidden page heading. */}
      <h1 className="visually-hidden">{title}</h1>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="teacherFormToast" />
    </>
  );
};

export default TeacherForm;
