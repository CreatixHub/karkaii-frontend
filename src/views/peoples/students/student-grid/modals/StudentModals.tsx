import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { useForm } from '@hooks/useForm';
import { required } from '@utils/validation';
import type { StudentCard } from '../data/students.data';
import type { StudentModalId } from '../data/studentsWorkspace.data';
import {
  attendanceRecords,
  attendanceStatuses,
  attendanceTiles,
  collectPaymentTypes,
  examOptions,
  feeTerms,
  feeTiles,
  feesGroups,
  feesTypes,
  issuedBooks,
  leaveRows,
  leaveTypes,
  paymentMethods,
  promoteClasses,
  promoteResults,
  promoteYears,
  resultRows,
  resultTotal,
  timetableRows,
  timetableSlots,
} from '../data/studentModals.data';

/** "Class III · A · Red House" → "Class III, A", matching the template's copy. */
const classLabel = (student: StudentCard) => student.meta.split(' · ').slice(0, 2).join(', ');

/** "Class III · A · Red House" → "III - A", the promote dialog's readonly field. */
const classCode = (student: StudentCard) => {
  const [level = '', section = ''] = student.meta.split(' · ');
  return `${level.replace(/^Class\s+/, '')} - ${section}`;
};

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

const closeFooter = (onClose: () => void, extra?: React.ReactNode) => (
  <>
    <button type="button" className="btn btn-light" onClick={onClose}>
      Close
    </button>
    {extra}
  </>
);

interface IdentityRowProps {
  student: StudentCard;
  subtitle: string;
  badge?: { label: string; className: string };
}

/** The `info-list-item` header repeated at the top of every student dialog. */
const IdentityRow = ({ student, subtitle, badge }: IdentityRowProps) => (
  <div className="info-list-item d-flex align-items-center mb-3">
    <ImageWithBasePath
      className="info-list-avatar object-fit-cover flex-shrink-0"
      src={student.avatar}
      alt={student.name}
    />
    <div className="info-list-body">
      <b>{student.name}</b>
      <span>{subtitle}</span>
    </div>
    <div className="info-list-end flex-shrink-0 text-end d-flex flex-column align-items-end">
      {badge ? <span className={`badge ${badge.className} rounded-pill`}>{badge.label}</span> : null}
    </div>
  </div>
);

export interface StudentModalsProps {
  active: StudentModalId | null;
  /** The card that opened the dialog; the toolbar's bulk delete passes null. */
  student: StudentCard | null;
  onClose: () => void;
  onToast: (message: string) => void;
  onConfirmDelete: () => void;
}

const StudentModals = ({
  active,
  student,
  onClose,
  onToast,
  onConfirmDelete,
}: StudentModalsProps) => {
  /* ------------------------------ Collect Fees ------------------------------ */
  const collectForm = useForm<
    {
      feesGroup: string;
      feesType: string;
      amount: string;
      collectionDate: string;
      paymentType: string;
      reference: string;
      status: boolean;
      notes: string;
    },
    string
  >({
    initialValues: {
      feesGroup: '',
      feesType: '',
      amount: '',
      collectionDate: '',
      paymentType: '',
      reference: '',
      status: false,
      notes: '',
    },
    onSubmit: async () => 'Fees collected successfully',
    onSuccess: (message) => {
      onToast(message);
      collectForm.reset();
      onClose();
    },
  });

  /* ------------------------------- Attendance ------------------------------- */
  const attendanceForm = useForm<{ date: string; status: string; remark: string }, string>({
    initialValues: { date: '21-07-2026', status: '', remark: '' },
    validationSchema: { status: required('Please select a status.') },
    onSubmit: async () => `Attendance saved for ${student?.name ?? 'student'}`,
    onSuccess: (message) => {
      onToast(message);
      attendanceForm.reset();
    },
  });

  /* ---------------------------------- Fees ---------------------------------- */
  const paymentForm = useForm<
    { amount: string; method: string; date: string; reference: string },
    string
  >({
    initialValues: { amount: '', method: '', date: '21-07-2026', reference: '' },
    validationSchema: {
      amount: (value) =>
        (Number(value) > 0 ? null : 'Enter a valid amount.'),
      method: required('Select a method.'),
    },
    onSubmit: async () => 'Payment of collected successfully',
    onSuccess: (message) => {
      onToast(message);
      paymentForm.reset();
    },
  });

  /* --------------------------------- Library -------------------------------- */
  const bookForm = useForm<{ title: string; issueDate: string; dueDate: string }, string>({
    initialValues: { title: '', issueDate: '21-07-2026', dueDate: '04-08-2026' },
    validationSchema: {
      title: required('Enter a book title.'),
      dueDate: (value, values) =>
        String(value) && String(values.issueDate) && String(value) < String(values.issueDate)
          ? 'Due date must be after issue date.'
          : null,
    },
    onSubmit: async () => 'Book issued successfully',
    onSuccess: (message) => {
      onToast(message);
      bookForm.reset();
    },
  });

  /* --------------------------------- Leaves --------------------------------- */
  const leaveForm = useForm<
    { type: string; from: string; to: string; reason: string },
    string
  >({
    initialValues: { type: '', from: '', to: '', reason: '' },
    validationSchema: {
      type: required('Select a type.'),
      from: required('Required.'),
      to: (value, values) => {
        if (!String(value)) return 'To date must be on/after From date.';
        if (String(values.from) && String(value) < String(values.from)) {
          return 'To date must be on/after From date.';
        }
        return null;
      },
    },
    onSubmit: async () => 'Leave request submitted',
    onSuccess: (message) => {
      onToast(message);
      leaveForm.reset();
    },
  });

  /* --------------------------------- Promote -------------------------------- */
  const promoteForm = useForm<
    { promoteTo: string; academicYear: string; resultStatus: string; remarks: string },
    string
  >({
    initialValues: { promoteTo: '', academicYear: '', resultStatus: 'Passed', remarks: '' },
    validationSchema: {
      promoteTo: required('Select a class.'),
      academicYear: required('Select an academic year.'),
    },
    onSubmit: async () => 'Student promoted successfully',
    onSuccess: (message) => {
      onToast(message);
      promoteForm.reset();
      onClose();
    },
  });

  return (
    <>
      {/* ---------------------------- Collect Fees ---------------------------- */}
      <Modal
        open={active === 'collectFees'}
        onClose={onClose}
        title="Collect Fees"
        dialogClassName="modal-lg"
        titleAccessory={
          <span className="badge badge-sm bg-primary ms-2">{student?.admissionNo ?? 'AD124556'}</span>
        }
        onSubmit={collectForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={collectForm.isSubmitting}>
              Pay Fees
            </button>
          </>
        }
      >
        <div className="bg-light-300 p-3 pb-0 rounded mb-4">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-6">
              <div className="d-flex align-items-center mb-3">
                <span className="avatar avatar-md me-2">
                  <ImageWithBasePath
                    src={student?.avatar ?? 'assets/img/students/student-01.jpg'}
                    alt={student?.name ?? 'Student'}
                  />
                </span>
                <span className="d-flex flex-column">
                  <span className="text-dark">{student?.name.split(' ')[0] ?? 'Janet'}</span>
                  {student ? classLabel(student).replace('Class ', '') : 'III, A'}
                </span>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="mb-3">
                <span className="fs-12 mb-1">Total Outstanding</span>
                <p className="text-dark">2000</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="mb-3">
                <span className="fs-12 mb-1">Last Date</span>
                <p className="text-dark">25 May 2024</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="mb-3">
                <span className="badge badge-soft-danger">
                  <i className="ti ti-circle-filled me-2" />
                  Unpaid
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="fees-group">
                Fees Group
              </label>
              <CommonSelect
                inputId="fees-group"
                options={toOptions(feesGroups)}
                value={
                  collectForm.values.feesGroup
                    ? { value: collectForm.values.feesGroup, label: collectForm.values.feesGroup }
                    : null
                }
                onChange={(option) => collectForm.setFieldValue('feesGroup', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="fees-type">
                Fees Type
              </label>
              <CommonSelect
                inputId="fees-type"
                options={toOptions(feesTypes)}
                value={
                  collectForm.values.feesType
                    ? { value: collectForm.values.feesType, label: collectForm.values.feesType }
                    : null
                }
                onChange={(option) => collectForm.setFieldValue('feesType', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="amount">
                Amount
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Amout"
                id="amount"
                name="amount"
                value={collectForm.values.amount}
                onChange={collectForm.handleChange}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="collection-date">
                Collection Date
              </label>
              <div className="date-pic">
                <DateField
                  placeholder="Select"
                  id="collection-date"
                  onChange={(dateString) =>
                    collectForm.setFieldValue('collectionDate', dateString as string)
                  }
                />
                <span className="cal-icon">
                  <i className="ti ti-calendar" />
                </span>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="payment-type">
                Payment Type
              </label>
              <CommonSelect
                inputId="payment-type"
                options={toOptions(collectPaymentTypes)}
                value={
                  collectForm.values.paymentType
                    ? {
                        value: collectForm.values.paymentType,
                        label: collectForm.values.paymentType,
                      }
                    : null
                }
                onChange={(option) => collectForm.setFieldValue('paymentType', option?.value ?? '')}
              />
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="payment-reference-no">
                Payment Reference No
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Payment Reference No"
                id="payment-reference-no"
                name="reference"
                value={collectForm.values.reference}
                onChange={collectForm.handleChange}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="modal-satus-toggle d-flex align-items-center justify-content-between mb-3">
              <div className="status-title">
                <h5>Status</h5>
                <p>Change the Status by toggle </p>
              </div>
              <div className="status-toggle modal-status">
                <input
                  type="checkbox"
                  id="user1"
                  className="check"
                  name="status"
                  checked={collectForm.values.status}
                  onChange={collectForm.handleChange}
                />
                <label htmlFor="user1" className="checktoggle">
                  {' '}
                </label>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="mb-0">
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                rows={4}
                className="form-control"
                placeholder="Add Notes"
                id="notes"
                name="notes"
                value={collectForm.values.notes}
                onChange={collectForm.handleChange}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* ------------------------------- Delete ------------------------------- */}
      <Modal
        open={active === 'delete'}
        onClose={onClose}
        title="Confirm Deletion"
        hideHeader
        onSubmit={(event) => {
          event.preventDefault();
          onConfirmDelete();
        }}
      >
        <div className="text-center">
          <span className="delete-icon">
            <i className="ti ti-trash-x" />
          </span>
          <h4>Confirm Deletion</h4>
          <p>You want to delete all the marked items, this cant be undone once you delete.</p>
          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-light me-3" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              Yes, Delete
            </button>
          </div>
        </div>
      </Modal>

      {student ? (
        <>
          {/* ----------------------------- Attendance ---------------------------- */}
          <Modal
            open={active === 'attendance'}
            onClose={onClose}
            title="Student Attendance"
            titleIcon="ti ti-calendar-check text-primary"
            closeVariant="plain"
            dialogClassName="modal-lg modal-dialog-scrollable"
            footer={closeFooter(onClose)}
          >
            <IdentityRow
              student={student}
              subtitle={`${classLabel(student)} · Roll No ${student.roll}`}
              badge={{ label: '94.6% Present', className: 'badge-soft-success' }}
            />

            <div className="row g-2 mb-3">
              {attendanceTiles.map((tile) => (
                <div className="col-3" key={tile.id}>
                  <div className={`metric-tile metric-tile-sm border-${tile.color}`}>
                    <div className={`metric-tile-value text-${tile.color}`}>{tile.value}</div>
                    <div className="metric-tile-label">{tile.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="stat-caption mb-2">Mark Today&apos;s Attendance</div>
            <form className="row g-2 align-items-end" onSubmit={attendanceForm.handleSubmit} noValidate>
              <div className="col-md-4">
                <label className="form-label" htmlFor="date">
                  Date
                </label>
                <input
                  type="text"
                  className="form-control datetimepicker"
                  value={attendanceForm.values.date}
                  readOnly
                  id="date"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="status-2">
                  Status
                </label>
                <select
                  className="form-select"
                  id="status-2"
                  name="status"
                  value={attendanceForm.values.status}
                  onChange={attendanceForm.handleChange}
                  onBlur={attendanceForm.handleBlur}
                >
                  <option value="">Select status</option>
                  {attendanceStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                {fieldError(attendanceForm.errors.status, attendanceForm.touched.status)}
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="remark">
                  Remark
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Optional"
                  id="remark"
                  name="remark"
                  value={attendanceForm.values.remark}
                  onChange={attendanceForm.handleChange}
                />
              </div>
              <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-primary">
                  <i className="ti ti-check me-1" />
                  Save Attendance
                </button>
              </div>
            </form>

            <div className="stat-caption d-block mt-3 mb-2">Recent Records</div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Remark</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record) => (
                    <tr key={record.date}>
                      <td>{record.date}</td>
                      <td>
                        <span className={`badge ${record.status.className} rounded-pill`}>
                          {record.status.label}
                        </span>
                      </td>
                      <td>{record.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal>

          {/* -------------------------------- Fees ------------------------------- */}
          <Modal
            open={active === 'fees'}
            onClose={onClose}
            title="Student Fees"
            titleIcon="ti ti-report-money text-primary"
            closeVariant="plain"
            dialogClassName="modal-lg modal-dialog-scrollable"
            footer={closeFooter(onClose)}
          >
            <IdentityRow
              student={student}
              subtitle={`${classLabel(student)} · Roll No ${student.roll}`}
              badge={{ label: '$600 Pending', className: 'badge-soft-warning' }}
            />

            <div className="row g-2 mb-3">
              {feeTiles.map((tile) => (
                <div className="col-4" key={tile.id}>
                  <div className={`metric-tile metric-tile-sm border-${tile.color}`}>
                    <div className={`metric-tile-value text-${tile.color}`}>{tile.value}</div>
                    <div className="metric-tile-label">{tile.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="stat-caption mb-2">Fee Terms</div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Term</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feeTerms.map((term) => (
                    <tr key={term.term}>
                      <td>{term.term}</td>
                      <td>{term.amount}</td>
                      <td>{term.due}</td>
                      <td>
                        <span className={`badge ${term.status.className} rounded-pill`}>
                          {term.status.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stat-caption d-block mt-2 mb-2">Collect Payment</div>
            <form className="row g-2 align-items-end" onSubmit={paymentForm.handleSubmit} noValidate>
              <div className="col-md-3">
                <label className="form-label" htmlFor="amount-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  placeholder="600"
                  id="amount-2"
                  name="amount"
                  value={paymentForm.values.amount}
                  onChange={paymentForm.handleChange}
                  onBlur={paymentForm.handleBlur}
                />
                {fieldError(paymentForm.errors.amount, paymentForm.touched.amount)}
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="method">
                  Method
                </label>
                <select
                  className="form-select"
                  id="method"
                  name="method"
                  value={paymentForm.values.method}
                  onChange={paymentForm.handleChange}
                  onBlur={paymentForm.handleBlur}
                >
                  <option value="">Select</option>
                  {paymentMethods.map((method) => (
                    <option key={method}>{method}</option>
                  ))}
                </select>
                {fieldError(paymentForm.errors.method, paymentForm.touched.method)}
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="date-2">
                  Date
                </label>
                <DateField
                  placeholder="Select"
                  id="date-2"
                  onChange={(dateString) =>
                    paymentForm.setFieldValue('date', dateString as string)
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="reference-no">
                  Reference No
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Optional"
                  id="reference-no"
                  name="reference"
                  value={paymentForm.values.reference}
                  onChange={paymentForm.handleChange}
                />
              </div>
              <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-primary">
                  <i className="ti ti-cash me-1" />
                  Collect Payment
                </button>
              </div>
            </form>
          </Modal>

          {/* ------------------------------- Result ------------------------------ */}
          <Modal
            open={active === 'result'}
            onClose={onClose}
            title="Exam Result"
            titleIcon="ti ti-file-certificate text-primary"
            closeVariant="plain"
            dialogClassName="modal-lg modal-dialog-scrollable"
            footer={closeFooter(
              onClose,
              <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                <i className="ti ti-printer me-1" />
                Print
              </button>,
            )}
          >
            <IdentityRow
              student={student}
              subtitle={`${classLabel(student)} · Roll No ${student.roll}`}
              badge={{ label: 'Passed · 87.4%', className: 'badge-soft-success' }}
            />

            <div className="row g-2 align-items-center mb-3">
              <div className="col-auto">
                <label className="form-label mb-0" htmlFor="sg-exam">
                  Exam
                </label>
              </div>
              <div className="col-sm-6 col-md-4">
                <select className="form-select" id="sg-exam" aria-label="Term 1 Examination">
                  {examOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table align-middle text-center">
                <thead>
                  <tr>
                    <th className="text-start">Subject</th>
                    <th>Max</th>
                    <th>Obtained</th>
                    <th>Grade</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {resultRows.map((row) => (
                    <tr key={row.subject}>
                      <td className="text-start">{row.subject}</td>
                      <td>{row.max}</td>
                      <td>{row.obtained}</td>
                      <td>{row.grade}</td>
                      <td>
                        <span className={`badge ${row.result.className} rounded-pill`}>
                          {row.result.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="fw-bold">
                    <td className="text-start">Total</td>
                    <td>{resultTotal.max}</td>
                    <td>{resultTotal.obtained}</td>
                    <td>{resultTotal.grade}</td>
                    <td>
                      <span className="badge bg-success rounded-pill">{resultTotal.percentage}</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Modal>

          {/* ------------------------------ Timetable ---------------------------- */}
          <Modal
            open={active === 'timetable'}
            onClose={onClose}
            title="Class Time Table"
            titleIcon="ti ti-table text-primary"
            closeVariant="plain"
            dialogClassName="modal-lg modal-dialog-scrollable"
            footer={closeFooter(onClose)}
          >
            <IdentityRow student={student} subtitle={`${classLabel(student)} · Weekly schedule`} />

            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center mb-0">
                <thead>
                  <tr>
                    <th className="text-start">Day</th>
                    {timetableSlots.map((slot) => (
                      <th key={slot}>{slot}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetableRows.map((row) => (
                    <tr key={row.day}>
                      <td className="text-start fw-semibold">{row.day}</td>
                      {row.periods.map((period, index) => (
                        <td className={index === row.breakIndex ? 'text-muted' : undefined} key={`${row.day}-${period}`}>
                          {period}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal>

          {/* ------------------------------- Library ----------------------------- */}
          <Modal
            open={active === 'library'}
            onClose={onClose}
            title="Library"
            titleIcon="ti ti-books text-primary"
            closeVariant="plain"
            dialogClassName="modal-lg modal-dialog-scrollable"
            footer={closeFooter(onClose)}
          >
            <IdentityRow
              student={student}
              subtitle={`Library Card · LIB-${student.roll}`}
              badge={{ label: '2 Issued', className: 'badge-soft-primary' }}
            />

            <div className="stat-caption mb-2">Issued Books</div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Issued</th>
                    <th>Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issuedBooks.map((book) => (
                    <tr key={book.book}>
                      <td>{book.book}</td>
                      <td>{book.issued}</td>
                      <td>{book.due}</td>
                      <td>
                        <span className={`badge ${book.status.className} rounded-pill`}>
                          {book.status.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stat-caption d-block mt-2 mb-2">Issue New Book</div>
            <form className="row g-2 align-items-end" onSubmit={bookForm.handleSubmit} noValidate>
              <div className="col-md-5">
                <label className="form-label" htmlFor="book-title">
                  Book Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search book"
                  id="book-title"
                  name="title"
                  value={bookForm.values.title}
                  onChange={bookForm.handleChange}
                  onBlur={bookForm.handleBlur}
                />
                {fieldError(bookForm.errors.title, bookForm.touched.title)}
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="issue-date">
                  Issue Date
                </label>
                <DateField
                  placeholder="Select"
                  id="issue-date"
                  onChange={(dateString) =>
                    bookForm.setFieldValue('issueDate', dateString as string)
                  }
                />
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="due-date">
                  Due Date
                </label>
                <DateField
                  placeholder="Select"
                  id="due-date"
                  onChange={(dateString) =>
                    bookForm.setFieldValue('dueDate', dateString as string)
                  }
                />
                {fieldError(bookForm.errors.dueDate, bookForm.touched.dueDate)}
              </div>
              <div className="col-md-1 text-end mt-2">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="ti ti-plus" />
                </button>
              </div>
            </form>
          </Modal>

          {/* -------------------------------- Leaves ----------------------------- */}
          <Modal
            open={active === 'leaves'}
            onClose={onClose}
            title="Leaves"
            titleIcon="ti ti-calendar-off text-primary"
            closeVariant="plain"
            dialogClassName="modal-lg modal-dialog-scrollable"
            footer={closeFooter(onClose)}
          >
            <IdentityRow
              student={student}
              subtitle={`${classLabel(student)} · Roll No ${student.roll}`}
              badge={{ label: '3 Leaves Taken', className: 'badge-soft-primary' }}
            />

            <div className="stat-caption mb-2">Leave History</div>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRows.map((row) => (
                    <tr key={`${row.type}-${row.from}`}>
                      <td>{row.type}</td>
                      <td>{row.from}</td>
                      <td>{row.to}</td>
                      <td>{row.days}</td>
                      <td>
                        <span className={`badge ${row.status.className} rounded-pill`}>
                          {row.status.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stat-caption d-block mt-2 mb-2">Apply for Leave</div>
            <form className="row g-2 align-items-end" onSubmit={leaveForm.handleSubmit} noValidate>
              <div className="col-md-3">
                <label className="form-label" htmlFor="type">
                  Type
                </label>
                <select
                  className="form-select"
                  id="type"
                  name="type"
                  value={leaveForm.values.type}
                  onChange={leaveForm.handleChange}
                  onBlur={leaveForm.handleBlur}
                >
                  <option value="">Select</option>
                  {leaveTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
                {fieldError(leaveForm.errors.type, leaveForm.touched.type)}
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="from">
                  From
                </label>
                <DateField
                  placeholder="Select"
                  id="from"
                  onChange={(dateString) => leaveForm.setFieldValue('from', dateString as string)}
                />
                {fieldError(leaveForm.errors.from, leaveForm.touched.from)}
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="to">
                  To
                </label>
                <DateField
                  placeholder="Select"
                  id="to"
                  onChange={(dateString) => leaveForm.setFieldValue('to', dateString as string)}
                />
                {fieldError(leaveForm.errors.to, leaveForm.touched.to)}
              </div>
              <div className="col-md-3">
                <label className="form-label" htmlFor="reason">
                  Reason
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Reason"
                  id="reason"
                  name="reason"
                  value={leaveForm.values.reason}
                  onChange={leaveForm.handleChange}
                />
              </div>
              <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-primary">
                  <i className="ti ti-send me-1" />
                  Submit Request
                </button>
              </div>
            </form>
          </Modal>

          {/* ------------------------------- Promote ----------------------------- */}
          <Modal
            open={active === 'promote'}
            onClose={onClose}
            title="Promote Student"
            titleIcon="ti ti-arrow-ramp-right-2 text-primary"
            closeVariant="plain"
            onSubmit={promoteForm.handleSubmit}
            footer={
              <>
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="ti ti-check me-1" />
                  Promote Student
                </button>
              </>
            }
          >
            <IdentityRow student={student} subtitle={`Currently in ${classLabel(student)}`} />

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="current-class">
                  Current Class
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={classCode(student)}
                  readOnly
                  id="current-class"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="promote-to">
                  Promote To
                </label>
                <select
                  className="form-select"
                  id="promote-to"
                  name="promoteTo"
                  value={promoteForm.values.promoteTo}
                  onChange={promoteForm.handleChange}
                  onBlur={promoteForm.handleBlur}
                >
                  <option value="">Select class</option>
                  {promoteClasses.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                {fieldError(promoteForm.errors.promoteTo, promoteForm.touched.promoteTo)}
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="academic-year-2">
                  Academic Year
                </label>
                <select
                  className="form-select"
                  id="academic-year-2"
                  name="academicYear"
                  value={promoteForm.values.academicYear}
                  onChange={promoteForm.handleChange}
                  onBlur={promoteForm.handleBlur}
                >
                  <option value="">Select</option>
                  {promoteYears.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                {fieldError(promoteForm.errors.academicYear, promoteForm.touched.academicYear)}
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="result-status">
                  Result Status
                </label>
                <select
                  className="form-select"
                  id="result-status"
                  name="resultStatus"
                  value={promoteForm.values.resultStatus}
                  onChange={promoteForm.handleChange}
                >
                  {promoteResults.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="remarks">
                  Remarks
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Optional remarks"
                  id="remarks"
                  name="remarks"
                  value={promoteForm.values.remarks}
                  onChange={promoteForm.handleChange}
                />
              </div>
            </div>
          </Modal>
        </>
      ) : null}
    </>
  );
};

export default StudentModals;
