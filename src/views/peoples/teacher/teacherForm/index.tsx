import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import CommonSelect from '@core/common/commonSelect';
import { useToasts } from '@hooks/useToasts';
import { all_routes } from '@/routes/all_routes';
import { ApiError } from '@services/api/errors';
import { getCurrentAcademicYearId } from '@services/academic/years.api';
import { toIsoDate } from '@services/admissions/admissions.api';
import {
  addTeacherAssignments,
  createTeacher,
  getStaffRecord,
  listClassOptions,
  listStaffAssignments,
  listSubjectOptions,
  removeTeacherAssignment,
  updateTeacher,
} from '@services/staff/staff.api';
import type {
  CreatedStaff,
  CreateTeacherPayload,
  MyAssignment,
  SelectOption,
  StaffRecord,
  TeachingProfilePayload,
  UpdateTeacherPayload,
} from '@services/staff/staff.api';
import FormField from './components/FormField';
import FormSection from './components/FormSection';
import TeachingProfileFields from './components/TeachingProfileFields';
import QuickSetup from './QuickSetup';
import { EMPTY_PROFILE, profileFromStaff, readProfile, updatedProfile } from './teachingProfile';
import type { ProfileValues } from './teachingProfile';
import {
  BASE_DEFAULTS,
  documentUploads,
  documentsSection,
  formSections,
} from './data/teacherForm.data';

const routes = all_routes;

export interface TeacherFormProps {
  mode?: 'add' | 'edit';
}

interface OriginalTeacher {
  status: string;
  employmentType: string;
  profile: ProfileValues;
}

interface AssignmentRow {
  classId: string;
  subjectId: string;
}

interface ExistingGroup {
  key: string;
  classId: string;
  subjectId: string;
  label: string;
}

// On Add these two are replaced by the "Classes & Subjects" card below.
const DYNAMIC_FIELD_IDS = new Set(['class', 'subject']);

// On Edit only the fields that are really saved are shown.
const EDIT_FIELD_IDS = new Set([
  'first-name',
  'last-name',
  'gender',
  'primary-contact-number',
  'email-address',
  'blood-group',
  'date-of-joining',
  'father-s-name',
  'date-of-birth',
  'marital-status',
  'qualification',
  'work-experience',
  'address',
  'pan-number-id-number',
  'status',
  'epf-no',
  'contract-type',
  'account-name',
  'account-number',
  'bank-name',
  'ifsc-code',
  'branch-name',
]);

// ---- helpers --------------------------------------------------------------------
const clean = (v: string | undefined): string | undefined => {
  const t = (v ?? '').trim();
  return t === '' || t === 'Select' ? undefined : t;
};

const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/** YYYY-MM-DD from the server -> DD-MM-YYYY for the date fields. */
const toDmy = (iso: string | null | undefined): string => {
  if (!iso) return '';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return y && m && d ? `${d}-${m}-${y}` : '';
};

/** Checks the class + subject rows. Fully empty rows are ignored. */
function validateRows(rows: AssignmentRow[]): { filled?: AssignmentRow[]; error?: string } {
  const filled = rows.filter((r) => r.classId || r.subjectId);
  if (filled.some((r) => !r.classId || !r.subjectId)) {
    return { error: 'For each row, choose both a class and a subject (or remove the row).' };
  }
  const seen = new Set<string>();
  for (const r of filled) {
    const key = `${r.classId}:${r.subjectId}`;
    if (seen.has(key)) return { error: 'The same class and subject is listed twice.' };
    seen.add(key);
  }
  return { filled };
}

// ---- ADD: form values -> POST body ------------------------------------------------
function buildPayload(
  values: Record<string, string>,
  rows: AssignmentRow[],
  profile: TeachingProfilePayload,
): { payload?: CreateTeacherPayload; error?: string } {
  const firstName = clean(values['first-name']);
  if (!firstName) return { error: 'First name is required.' };

  const joinedOn = toIsoDate(values['date-of-joining'] ?? '');
  if (!joinedOn) return { error: 'Date of joining is required.' };

  const dob = toIsoDate(values['date-of-birth'] ?? '');
  if (!dob) return { error: 'Date of birth is required (it becomes the first password).' };

  const account = clean(values['account-number']);
  if (account && !/^\d{6,20}$/.test(account)) return { error: 'Account number must be 6 to 20 digits.' };

  const ifsc = clean(values['ifsc-code'])?.toUpperCase();
  if (ifsc && !IFSC_RE.test(ifsc)) return { error: 'IFSC code looks invalid (example: SBIN0001234).' };

  const checked = validateRows(rows);
  if (checked.error || !checked.filled) return { error: checked.error };
  const filled = checked.filled;

  // "PAN Number / ID Number": a valid PAN goes to pan, anything else is kept as the national id.
  const idValue = clean(values['pan-number-id-number'])?.toUpperCase();
  const pan = idValue && PAN_RE.test(idValue) ? idValue : undefined;
  const nationalId = idValue && !pan ? idValue : undefined;

  const years = parseFloat(values['work-experience'] ?? '');
  const contract = clean(values['contract-type']);

  const payload: CreateTeacherPayload = {
    employeeNo: clean(values['teacher-id']),
    staffType: 'teaching',
    employmentType: contract === 'Temporary' ? 'contract' : 'full_time',
    firstName,
    lastName: clean(values['last-name']),
    dob,
    gender: clean(values.gender),
    bloodGroup: clean(values['blood-group']),
    maritalStatus: clean(values['marital-status']),
    fatherName: clean(values['father-s-name']),
    email: clean(values['email-address']),
    phone: clean(values['primary-contact-number']),
    addressLine1: clean(values.address),
    joinedOn,
    qualification: clean(values.qualification),
    experienceYears: Number.isFinite(years) ? years : undefined,
    nationalId,
    pan,
    epfNo: clean(values['epf-no']),
    bankAccountName: clean(values['account-name']),
    bankAccountNumber: account,
    bankName: clean(values['bank-name']),
    bankBranch: clean(values['branch-name']),
    bankIfsc: ifsc,
    createLogin: true,
    ...profile,
    assignments: filled.length > 0 ? filled : undefined,
  };

  // The API rejects unknown or empty keys: drop everything that is undefined.
  return { payload: JSON.parse(JSON.stringify(payload)) as CreateTeacherPayload };
}

// ---- EDIT: saved teacher -> form values ---------------------------------------------
function valuesFromStaff(s: StaffRecord): Record<string, string> {
  const years = s.experienceYears;
  return {
    'teacher-id': s.employeeNo ?? '',
    'first-name': s.firstName ?? '',
    'last-name': s.lastName ?? '',
    gender: s.gender ?? '',
    'primary-contact-number': s.phone ?? '',
    'email-address': s.email ?? '',
    'blood-group': s.bloodGroup ?? '',
    'date-of-joining': toDmy(s.joinedOn),
    'father-s-name': s.fatherName ?? '',
    'date-of-birth': toDmy(s.dob),
    'marital-status': s.maritalStatus ?? '',
    qualification: s.qualification ?? '',
    'work-experience': years === null || years === undefined || years === '' ? '' : String(Number(years)),
    address: s.addressLine1 ?? '',
    status: s.status === 'active' ? 'Active' : 'Inactive',
    'epf-no': s.epfNo ?? '',
    'contract-type': s.employmentType === 'contract' ? 'Temporary' : 'Permanent',
    'account-name': s.bankAccountName ?? '',
    'bank-name': s.bankName ?? '',
    'ifsc-code': s.bankIfsc ?? '',
    'branch-name': s.bankBranch ?? '',
    // PAN / ID and account number are stored encrypted and never sent back: they start blank.
    'pan-number-id-number': '',
    'account-number': '',
  };
}

// ---- EDIT: form values -> PATCH body ------------------------------------------------
function buildUpdatePayload(
  values: Record<string, string>,
  original: OriginalTeacher,
  profile: TeachingProfilePayload,
): { payload?: UpdateTeacherPayload; error?: string } {
  const firstName = clean(values['first-name']);
  if (!firstName) return { error: 'First name is required.' };

  const joinedOn = toIsoDate(values['date-of-joining'] ?? '');
  if (!joinedOn) return { error: 'Date of joining is required.' };

  const dobText = clean(values['date-of-birth']);
  const dob = dobText ? toIsoDate(dobText) : null;
  if (dobText && !dob) return { error: 'Date of birth is not a valid date.' };

  const account = clean(values['account-number']);
  if (account && !/^\d{6,20}$/.test(account)) return { error: 'Account number must be 6 to 20 digits.' };

  const ifsc = clean(values['ifsc-code'])?.toUpperCase() ?? null;
  if (ifsc && !IFSC_RE.test(ifsc)) return { error: 'IFSC code looks invalid (example: SBIN0001234).' };

  const yearsText = clean(values['work-experience']);
  const years = yearsText ? parseFloat(yearsText) : null;
  if (yearsText && !Number.isFinite(years)) return { error: 'Work experience must be a number of years.' };

  const payload: UpdateTeacherPayload = {
    firstName,
    lastName: clean(values['last-name']) ?? null,
    dob,
    gender: clean(values.gender) ?? null,
    bloodGroup: clean(values['blood-group']) ?? null,
    maritalStatus: clean(values['marital-status']) ?? null,
    fatherName: clean(values['father-s-name']) ?? null,
    email: clean(values['email-address']) ?? null,
    phone: clean(values['primary-contact-number']) ?? null,
    addressLine1: clean(values.address) ?? null,
    joinedOn,
    qualification: clean(values.qualification) ?? null,
    experienceYears: years,
    epfNo: clean(values['epf-no']) ?? null,
    bankAccountName: clean(values['account-name']) ?? null,
    bankName: clean(values['bank-name']) ?? null,
    bankBranch: clean(values['branch-name']) ?? null,
    bankIfsc: ifsc,
    ...updatedProfile(profile, original.profile),
  };

  // Sensitive values are only sent when a new one was typed.
  const idValue = clean(values['pan-number-id-number'])?.toUpperCase();
  if (idValue) {
    if (PAN_RE.test(idValue)) payload.pan = idValue;
    else payload.nationalId = idValue;
  }
  if (account) payload.bankAccountNumber = account;

  // Status and employment type are only sent when the person really changed them.
  const wantedStatus = clean(values.status);
  if (wantedStatus) {
    const wasActive = original.status === 'active';
    if ((wantedStatus === 'Active') !== wasActive) {
      payload.status = wantedStatus === 'Active' ? 'active' : 'suspended';
    }
  }
  const contract = clean(values['contract-type']);
  if (contract === 'Temporary' || contract === 'Permanent') {
    const wasContract = original.employmentType === 'contract';
    if ((contract === 'Temporary') !== wasContract) {
      payload.employmentType = contract === 'Temporary' ? 'contract' : 'full_time';
    }
  }

  return { payload };
}

type LoadState = 'loading' | 'ready' | 'missing' | 'error';

const TeacherForm = ({ mode = 'add' }: TeacherFormProps) => {
  const isEdit = mode === 'edit';
  const title = isEdit ? 'Edit Teacher' : 'Add Teacher';

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teacherId = searchParams.get('id') ?? '';
  const { toasts, push, dismiss } = useToasts();

  const [values, setValues] = useState<Record<string, string>>(() => (isEdit ? {} : { ...BASE_DEFAULTS }));
  const [photoName, setPhotoName] = useState('');
  const [documentNames, setDocumentNames] = useState<Record<string, string>>(() =>
    Object.fromEntries(documentUploads.map((doc) => [doc.key, doc.fileName])),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState<CreatedStaff | null>(null);

  // Edit: the saved teacher
  const [loadState, setLoadState] = useState<LoadState>(isEdit ? 'loading' : 'ready');
  const [original, setOriginal] = useState<OriginalTeacher>({
    status: 'active',
    employmentType: 'full_time',
    profile: EMPTY_PROFILE,
  });
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [hasSensitive, setHasSensitive] = useState(false);
  const [existing, setExisting] = useState<MyAssignment[]>([]);

  // Classes and subjects from the database
  const [classOptions, setClassOptions] = useState<SelectOption[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<SelectOption[]>([]);
  const [optionsError, setOptionsError] = useState('');
  const [rows, setRows] = useState<AssignmentRow[]>([{ classId: '', subjectId: '' }]);

  // Loads (or reloads) the Class and Subject lists. Also called by Quick setup after it adds a subject.
  const loadOptions = useCallback(async () => {
    try {
      const [classes, subjects] = await Promise.all([listClassOptions(), listSubjectOptions()]);
      setClassOptions(classes);
      setSubjectOptions(subjects);
      setOptionsError('');
    } catch {
      setOptionsError('Could not load classes and subjects. You can still save the teacher without them.');
    }
  }, []);

  useEffect(() => {
    void loadOptions();
  }, [loadOptions]);

  const reloadExisting = useCallback(async () => {
    if (!teacherId) return;
    try {
      setExisting(await listStaffAssignments(teacherId, await getCurrentAcademicYearId()));
    } catch {
      setExisting([]);
    }
  }, [teacherId]);

  // Edit: load the teacher by ?id=
  useEffect(() => {
    if (!isEdit) return;
    if (!teacherId) {
      setLoadState('missing');
      return;
    }
    let cancelled = false;
    setLoadState('loading');
    (async () => {
      try {
        const [record, assignments] = await Promise.all([
          getStaffRecord(teacherId),
          // the current year only: removing also acts on the current year, so the list has to match it
          getCurrentAcademicYearId()
            .then((yearId) => listStaffAssignments(teacherId, yearId))
            .catch(() => [] as MyAssignment[]),
        ]);
        if (cancelled) return;
        setValues(valuesFromStaff(record));
        const savedProfile = profileFromStaff(record);
        setOriginal({ status: record.status, employmentType: record.employmentType, profile: savedProfile });
        setProfile(savedProfile);
        setHasSensitive(Boolean(record.hasPan || record.hasNationalId || record.hasBankAccount));
        setExisting(assignments);
        setLoadState('ready');
      } catch (e) {
        if (cancelled) return;
        setLoadState(e instanceof ApiError && e.status === 404 ? 'missing' : 'error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isEdit, teacherId]);

  // Existing class + subject pairs, one line each (the API stores one row per section).
  const groups = useMemo<ExistingGroup[]>(() => {
    const map = new Map<string, ExistingGroup>();
    for (const a of existing) {
      const subjectId = a.subject?.id;
      if (subjectId === undefined || subjectId === null) continue;
      const key = `${a.classId}:${subjectId}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          classId: String(a.classId),
          subjectId: String(subjectId),
          label: `${a.className} — ${a.subject?.name ?? 'Subject'}`,
        });
      }
    }
    return [...map.values()];
  }, [existing]);

  const removeExisting = async (group: ExistingGroup) => {
    if (!window.confirm(`Remove ${group.label} from this teacher?`)) return;
    setError('');
    try {
      await removeTeacherAssignment(teacherId, group.classId, group.subjectId, await getCurrentAcademicYearId());
      await reloadExisting();
      push('Removed.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not remove it.');
    }
  };

  const photoInput = useRef<HTMLInputElement>(null);

  const setValue = (id: string, value: string) =>
    setValues((current) => ({ ...current, [id]: value }));

  const setRow = (index: number, patch: Partial<AssignmentRow>) =>
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () => setRows((current) => [...current, { classId: '', subjectId: '' }]);

  const removeRow = (index: number) =>
    setRows((current) =>
      current.length === 1 ? [{ classId: '', subjectId: '' }] : current.filter((_, i) => i !== index),
    );

  const labelOf = (options: SelectOption[], value: string) => options.find((o) => o.value === value)?.label ?? '';

  const fail = (message: string) => {
    setError(message);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const teaching = readProfile(profile);
    if ('error' in teaching) return fail(teaching.error);

    // ----------------------------- EDIT -----------------------------
    if (isEdit) {
      const built = buildUpdatePayload(values, original, teaching.payload);
      if (!built.payload) return fail(built.error ?? 'Please check the form.');

      const checked = validateRows(rows);
      if (!checked.filled) return fail(checked.error ?? 'Please check the classes and subjects.');
      const fresh = checked.filled;
      const taken = new Set(groups.map((g) => g.key));
      if (fresh.some((r) => taken.has(`${r.classId}:${r.subjectId}`))) {
        return fail('One of those classes and subjects is already assigned to this teacher.');
      }

      setSaving(true);
      try {
        await updateTeacher(teacherId, built.payload);
        if (fresh.length > 0) {
          try {
            await addTeacherAssignments(teacherId, await getCurrentAcademicYearId(), fresh);
          } catch (e) {
            await reloadExisting();
            setRows([{ classId: '', subjectId: '' }]);
            fail(
              `The details were saved, but the classes could not be added: ${
                e instanceof Error ? e.message : 'please try again.'
              }`,
            );
            return;
          }
        }
        navigate(`${routes.teacherDetails}?id=${teacherId}`);
      } catch (e) {
        fail(e instanceof Error ? e.message : 'Could not save the changes.');
      } finally {
        setSaving(false);
      }
      return;
    }

    // ----------------------------- ADD -----------------------------
    const { payload, error: problem } = buildPayload(values, rows, teaching.payload);
    if (!payload) return fail(problem ?? 'Please check the form.');

    setSaving(true);
    try {
      // Classes and subjects are saved for the school's current academic year.
      if (payload.assignments) payload.academicYearId = await getCurrentAcademicYearId();
      const result = await createTeacher(payload);
      setCreated(result);
      push('Teacher added successfully.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      fail(e instanceof Error ? e.message : 'Could not add the teacher.');
    } finally {
      setSaving(false);
    }
  };

  // Edit shows only the fields that are really saved; Add hides Class / Subject (replaced by the card below).
  const visibleSections = formSections
    .map((section) => ({
      ...section,
      fields: section.fields.filter((field) =>
        isEdit ? EDIT_FIELD_IDS.has(field.id) : !DYNAMIC_FIELD_IDS.has(field.id),
      ),
    }))
    .filter((section) => section.fields.length > 0);

  const backTo = isEdit && teacherId ? `${routes.teacherDetails}?id=${teacherId}` : routes.teacherGrid;

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="mb-1">
                {title}
                {isEdit && values['teacher-id'] ? ` — ${values['teacher-id']}` : ''}
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.teacherGrid}>Teachers</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {title}
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* /Page Header */}

          {/* Edit: loading / not found / error */}
          {isEdit && loadState === 'loading' ? (
            <div className="card">
              <div className="card-body text-center text-muted py-5">Loading teacher…</div>
            </div>
          ) : null}

          {isEdit && loadState === 'missing' ? (
            <div className="alert alert-warning" role="alert">
              This teacher was not found. Open a teacher from the{' '}
              <Link to={routes.teacherGrid}>Teacher Directory</Link> and click Edit.
            </div>
          ) : null}

          {isEdit && loadState === 'error' ? (
            <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
              <span>Could not load this teacher.</span>
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => window.location.reload()}>
                Try again
              </button>
            </div>
          ) : null}

          {/* Result: shown after a new teacher is saved */}
          {created ? (
            <div className="alert alert-success mb-3" role="status">
              <h5 className="mb-2">{created.fullName ?? 'Teacher'} was added ({created.employeeNo})</h5>
              {created.login ? (
                <>
                  <p className="mb-1">
                    Login username: <strong>{created.login.username}</strong>
                  </p>
                  <p className="mb-2">
                    First password: the teacher&apos;s <strong>date of birth (DD-MM-YYYY)</strong>. They will be asked
                    to choose a new password at first sign-in.
                  </p>
                </>
              ) : (
                <p className="mb-2">No login was created for this teacher.</p>
              )}
              <Link to={`${routes.teacherDetails}?id=${created.id}`} className="btn btn-primary me-2">
                View profile
              </Link>
              <button type="button" className="btn btn-light" onClick={() => navigate(routes.teacherGrid)}>
                Go to teachers
              </button>
            </div>
          ) : null}

          {error ? (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          ) : null}

          {!isEdit || loadState === 'ready' ? (
            <div className="row">
              <div className="col-md-12">
                <form onSubmit={handleSubmit}>
                  {isEdit && hasSensitive ? (
                    <div className="alert alert-info mb-3">
                      For security, the saved PAN / ID number and bank account number are not shown. Leave those fields
                      blank to keep them, or type a new value to replace them.
                    </div>
                  ) : null}

                  {visibleSections.map((section) => (
                    <FormSection key={section.key} icon={section.icon} title={section.title}>
                      {section.photoUpload && !isEdit ? (
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
                                      onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? '')}
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

                  <FormSection icon="ti ti-book" title="Teaching Profile" bodyClass="card-body">
                    <TeachingProfileFields value={profile} onChange={setProfile} subjectOptions={subjectOptions} />
                  </FormSection>

                  {/* Classes & Subjects */}
                  <FormSection icon="ti ti-school" title="Classes & Subjects">
                    {optionsError ? <div className="alert alert-warning">{optionsError}</div> : null}

                    {isEdit ? (
                      <div className="mb-3">
                        <p className="fw-medium mb-2">Currently assigned</p>
                        {groups.length === 0 ? (
                          <p className="text-muted mb-0">No classes or subjects assigned yet.</p>
                        ) : (
                          <div className="d-flex flex-wrap gap-2">
                            {groups.map((group) => (
                              <span className="badge badge-soft-primary d-inline-flex align-items-center" key={group.key}>
                                {group.label}
                                <button
                                  type="button"
                                  className="btn btn-link btn-sm text-danger p-0 ms-2"
                                  aria-label={`Remove ${group.label}`}
                                  onClick={() => void removeExisting(group)}
                                >
                                  <i className="ti ti-x" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}

                    <p className="text-muted fs-12 mb-3">
                      {isEdit ? 'Add more: choose' : 'Choose'} the class this teacher takes and the subject for each. The
                      teacher is assigned to every section of that class.
                    </p>

                    {/* Add a missing subject without leaving this page */}
                    <QuickSetup onDone={loadOptions} />

                    {rows.map((row, index) => (
                      <div className="row align-items-end mb-2" key={index}>
                        <div className="col-md-5">
                          <label className="form-label" htmlFor={`assign-class-${index}`}>
                            Class
                          </label>
                          <CommonSelect
                            inputId={`assign-class-${index}`}
                            options={classOptions}
                            value={
                              row.classId ? { value: row.classId, label: labelOf(classOptions, row.classId) } : null
                            }
                            onChange={(option) => setRow(index, { classId: option?.value ?? '' })}
                          />
                        </div>
                        <div className="col-md-5">
                          <label className="form-label" htmlFor={`assign-subject-${index}`}>
                            Subject
                          </label>
                          <CommonSelect
                            inputId={`assign-subject-${index}`}
                            options={subjectOptions}
                            value={
                              row.subjectId
                                ? { value: row.subjectId, label: labelOf(subjectOptions, row.subjectId) }
                                : null
                            }
                            onChange={(option) => setRow(index, { subjectId: option?.value ?? '' })}
                          />
                        </div>
                        <div className="col-md-2">
                          <button type="button" className="btn btn-light" onClick={() => removeRow(index)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <button type="button" className="btn btn-outline-primary mt-2" onClick={addRow}>
                      <i className="ti ti-plus me-1" />
                      Add another class
                    </button>
                  </FormSection>
                  {/* /Classes & Subjects */}

                  {/* Documents (Add only: nothing stores them yet) */}
                  {!isEdit ? (
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
                  ) : null}
                  {/* /Documents */}

                  <div className="alert alert-info mb-3">
                    {isEdit
                      ? "The login username and password are not changed here. The teacher's username stays as it was created."
                      : 'A login is created automatically: the username is the phone number (or the teacher ID if the phone is empty or already used) and the first password is the date of birth (DD-MM-YYYY).'}
                  </div>

                  <div className="text-end">
                    <button type="button" className="btn btn-light me-3" onClick={() => navigate(backTo)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving || created !== null}>
                      {saving ? 'Saving...' : isEdit ? 'Save changes' : title}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {/* /Page Wrapper */}

      <h1 className="visually-hidden">{title}</h1>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="teacherFormToast" />
    </>
  );
};

export default TeacherForm;
