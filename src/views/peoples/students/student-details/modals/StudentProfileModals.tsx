import { useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { useForm } from '@hooks/useForm';
import { email as emailRule, required } from '@utils/validation';
import type { ConfirmOptions, ProfileAction, ProfileModalId } from '../data/studentProfileActions';
import type { PaymentTarget } from '../components/panes/FeesPane';
import {
  collectPaymentTypes,
  feesGroups,
  feesTypes,
} from '../../student-grid/data/studentModals.data';

const MEETING_WITH = ['Class Teacher', 'Both Parents', 'Father', 'Mother', 'Counsellor'];
const HOMEWORK_SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Geography'];

const PAY_METHODS = [
  { id: 'card', icon: 'ti ti-credit-card', label: 'Card' },
  { id: 'upi', icon: 'ti ti-qrcode', label: 'UPI' },
  { id: 'netbank', icon: 'ti ti-building-bank', label: 'Net Banking' },
];

const ID_CARD_ROWS = [
  { key: 'Admission No', value: 'AD1256589' },
  { key: 'Class', value: 'III - A' },
  { key: 'Date of Birth', value: '25 Jan 2008' },
  { key: 'Blood Group', value: 'O +ve', valueClass: 'text-danger' },
];

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const fieldError = (message?: string, touched?: boolean) =>
  message && touched ? <div className="invalid-feedback d-block">{message}</div> : null;

const submitLabel = (busy: boolean, children: React.ReactNode) =>
  busy ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" />
      Processing…
    </>
  ) : (
    children
  );

export interface StudentProfileModalsProps {
  active: ProfileModalId | null;
  onClose: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info') => void;
  onAction: (action: ProfileAction) => void;
  confirm: ConfirmOptions | null;
  onConfirm: () => void;
  payment: PaymentTarget;
  onPaid: (payment: PaymentTarget) => void;
}

const StudentProfileModals = ({
  active,
  onClose,
  onToast,
  onAction,
  confirm,
  onConfirm,
  payment,
  onPaid,
}: StudentProfileModalsProps) => {
  const [payMethod, setPayMethod] = useState('card');

  const settle = (message: string, reset: () => void) => {
    onToast(message, 'success');
    reset();
    onClose();
  };

  /* -------------------------------- Message -------------------------------- */
  const messageForm = useForm<{ subject: string; body: string }, void>({
    initialValues: { subject: '', body: '' },
    validationSchema: {
      subject: required('Please enter a subject.'),
      body: required('Please enter a message.'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => settle('Message sent to parent', messageForm.reset),
  });

  /* --------------------------------- Email --------------------------------- */
  const emailForm = useForm<{ to: string; subject: string; body: string }, void>({
    initialValues: { to: 'robert.d@example.com', subject: '', body: '' },
    validationSchema: {
      to: emailRule('Please enter a valid email.'),
      subject: required('Please enter a subject.'),
      body: required('Please enter a message.'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => settle('Email sent successfully', emailForm.reset),
  });

  /* -------------------------------- Meeting -------------------------------- */
  const meetingForm = useForm<{ title: string; date: string; time: string; with: string }, void>({
    initialValues: { title: '', date: '', time: '', with: MEETING_WITH[0] },
    validationSchema: {
      title: required('Please enter a title.'),
      date: required('Select a date.'),
      time: required('Select a time.'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => settle('Meeting scheduled', meetingForm.reset),
  });

  /* ------------------------------- Homework -------------------------------- */
  const homeworkForm = useForm<
    { subject: string; due: string; title: string; desc: string },
    void
  >({
    initialValues: { subject: '', due: '', title: '', desc: '' },
    validationSchema: {
      subject: required('Choose a subject.'),
      due: required('Select a due date.'),
      title: required('Please enter a title.'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => settle('Homework assigned', homeworkForm.reset),
  });

  /* ---------------------------------- Pay ---------------------------------- */
  const payForm = useForm<{ card: string; name: string; expiry: string; cvv: string }, void>({
    initialValues: { card: '', name: '', expiry: '', cvv: '' },
    validationSchema: {
      card: required('Enter a valid card number.'),
      name: required('Enter the name on the card.'),
      expiry: required('Enter the expiry.'),
      cvv: required('Enter the CVV.'),
    },
    onSubmit: async () => undefined,
    onSuccess: () => {
      onPaid(payment);
      settle('Payment successful — receipt generated.', payForm.reset);
    },
  });

  /* ------------------------------ Collect fees ----------------------------- */
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
    void
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
    onSubmit: async () => undefined,
    onSuccess: () => settle('Fees collected successfully', collectForm.reset),
  });

  const cancelButton = (
    <button type="button" className="btn btn-light" onClick={onClose}>
      Cancel
    </button>
  );

  return (
    <>
      {/* ------------------------------ Message ------------------------------ */}
      <Modal
        open={active === 'message'}
        onClose={onClose}
        title="Message Parent"
        titleIcon="ti ti-message"
        formClassName="vform"
        onSubmit={messageForm.handleSubmit}
        footer={
          <>
            {cancelButton}
            <button type="submit" className="btn btn-primary submit" disabled={messageForm.isSubmitting}>
              {submitLabel(
                messageForm.isSubmitting,
                <>
                  <i className="ti ti-send me-1" />
                  Send Message
                </>,
              )}
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="recipient">
            Recipient
          </label>
          <input
            type="text"
            className="form-control"
            value="Robert Daniel (Parent of Janet Daniel)"
            readOnly
            id="recipient"
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="subject">
            Subject <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="subject"
            placeholder="Enter subject"
            id="subject"
            value={messageForm.values.subject}
            onChange={messageForm.handleChange}
            onBlur={messageForm.handleBlur}
          />
          {fieldError(messageForm.errors.subject, messageForm.touched.subject)}
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="message">
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            name="body"
            rows={4}
            placeholder="Type your message…"
            id="message"
            value={messageForm.values.body}
            onChange={messageForm.handleChange}
            onBlur={messageForm.handleBlur}
          />
          {fieldError(messageForm.errors.body, messageForm.touched.body)}
        </div>
      </Modal>

      {/* ------------------------------- Email ------------------------------- */}
      <Modal
        open={active === 'email'}
        onClose={onClose}
        title="Send Email"
        titleIcon="ti ti-mail"
        formClassName="vform"
        onSubmit={emailForm.handleSubmit}
        footer={
          <>
            {cancelButton}
            <button type="submit" className="btn btn-primary submit" disabled={emailForm.isSubmitting}>
              {submitLabel(
                emailForm.isSubmitting,
                <>
                  <i className="ti ti-send me-1" />
                  Send Email
                </>,
              )}
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="to">
            To <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="form-control"
            name="to"
            id="to"
            value={emailForm.values.to}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
          />
          {fieldError(emailForm.errors.to, emailForm.touched.to)}
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="subject-2">
            Subject <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="subject"
            placeholder="Enter subject"
            id="subject-2"
            value={emailForm.values.subject}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
          />
          {fieldError(emailForm.errors.subject, emailForm.touched.subject)}
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="message-2">
            Message <span className="text-danger">*</span>
          </label>
          <textarea
            className="form-control"
            name="body"
            rows={4}
            placeholder="Type your email…"
            id="message-2"
            value={emailForm.values.body}
            onChange={emailForm.handleChange}
            onBlur={emailForm.handleBlur}
          />
          {fieldError(emailForm.errors.body, emailForm.touched.body)}
        </div>
      </Modal>

      {/* -------------------------------- Call ------------------------------- */}
      <Modal
        open={active === 'call'}
        onClose={onClose}
        title="Call Parent"
        hideHeader
        dialogClassName="modal-sm"
        bodyClassName="text-center p-4"
      >
        <>
          <span className="avatar avatar-xl rounded-circle flex-shrink-0 bg-success-transparent text-success mb-3 mx-auto d-flex align-items-center justify-content-center">
            <i className="ti ti-phone fs-24" />
          </span>
          <h5 className="mb-1">Robert Daniel</h5>
          <p className="text-muted mb-1">Parent / Guardian</p>
          <h4 className="mb-3">+1 809 095 5468</h4>
          <div className="d-flex justify-content-center gap-2">
            {cancelButton}
            <button type="button" className="btn btn-success call-now" onClick={onClose}>
              <i className="ti ti-phone-call me-1" />
              Call Now
            </button>
          </div>
        </>
      </Modal>

      {/* ------------------------------ Meeting ------------------------------ */}
      <Modal
        open={active === 'meeting'}
        onClose={onClose}
        title="Schedule Meeting"
        titleIcon="ti ti-calendar-plus"
        formClassName="vform"
        onSubmit={meetingForm.handleSubmit}
        footer={
          <>
            {cancelButton}
            <button type="submit" className="btn btn-primary submit" disabled={meetingForm.isSubmitting}>
              {submitLabel(
                meetingForm.isSubmitting,
                <>
                  <i className="ti ti-calendar-check me-1" />
                  Schedule
                </>,
              )}
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="e.g. Parent-Teacher Meeting"
            id="title"
            value={meetingForm.values.title}
            onChange={meetingForm.handleChange}
            onBlur={meetingForm.handleBlur}
          />
          {fieldError(meetingForm.errors.title, meetingForm.touched.title)}
        </div>
        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label" htmlFor="date">
              Date <span className="text-danger">*</span>
            </label>
            <DateField
              placeholder="Select"
              id="date"
              onChange={(dateString) =>
                meetingForm.setFieldValue('date', dateString as string)
              }
            />
            {fieldError(meetingForm.errors.date, meetingForm.touched.date)}
          </div>
          <div className="col-6 mb-3">
            <label className="form-label" htmlFor="time">
              Time <span className="text-danger">*</span>
            </label>
            <input
              type="time"
              className="form-control"
              name="time"
              id="time"
              value={meetingForm.values.time}
              onChange={meetingForm.handleChange}
              onBlur={meetingForm.handleBlur}
            />
            {fieldError(meetingForm.errors.time, meetingForm.touched.time)}
          </div>
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="with">
            With
          </label>
          <select
            className="form-select"
            name="with"
            id="with"
            value={meetingForm.values.with}
            onChange={meetingForm.handleChange}
          >
            {MEETING_WITH.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* ------------------------------ Homework ----------------------------- */}
      <Modal
        open={active === 'homework'}
        onClose={onClose}
        title="Assign Homework"
        titleIcon="ti ti-notebook"
        formClassName="vform"
        onSubmit={homeworkForm.handleSubmit}
        footer={
          <>
            {cancelButton}
            <button type="submit" className="btn btn-primary submit" disabled={homeworkForm.isSubmitting}>
              {submitLabel(
                homeworkForm.isSubmitting,
                <>
                  <i className="ti ti-check me-1" />
                  Assign
                </>,
              )}
            </button>
          </>
        }
      >
        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label" htmlFor="subject-3">
              Subject <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              name="subject"
              id="subject-3"
              value={homeworkForm.values.subject}
              onChange={homeworkForm.handleChange}
              onBlur={homeworkForm.handleBlur}
            >
              <option value="">Select</option>
              {HOMEWORK_SUBJECTS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            {fieldError(homeworkForm.errors.subject, homeworkForm.touched.subject)}
          </div>
          <div className="col-6 mb-3">
            <label className="form-label" htmlFor="due-date">
              Due Date <span className="text-danger">*</span>
            </label>
            <DateField
              placeholder="Select"
              id="due-date"
              onChange={(dateString) => homeworkForm.setFieldValue('due', dateString as string)}
            />
            {fieldError(homeworkForm.errors.due, homeworkForm.touched.due)}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="title-2">
            Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="e.g. Algebra Worksheet 6"
            id="title-2"
            value={homeworkForm.values.title}
            onChange={homeworkForm.handleChange}
            onBlur={homeworkForm.handleBlur}
          />
          {fieldError(homeworkForm.errors.title, homeworkForm.touched.title)}
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="instructions">
            Instructions
          </label>
          <textarea
            className="form-control"
            name="desc"
            rows={3}
            placeholder="Optional details…"
            id="instructions"
            value={homeworkForm.values.desc}
            onChange={homeworkForm.handleChange}
          />
        </div>
      </Modal>

      {/* ------------------------------ ID Card ------------------------------ */}
      <Modal
        open={active === 'idcard'}
        onClose={onClose}
        title="Student ID Card"
        titleIcon="ti ti-id"
        footer={
          <>
            <button type="button" className="btn btn-light" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onAction('print')}>
              <i className="ti ti-printer me-1" />
              Print ID
            </button>
          </>
        }
      >
        <div className="idcard">
          <div className="idcard-head">
            <span className="idcard-logo">
              <i className="ti ti-school" />
            </span>
            <div className="idcard-brand">
              <h5 className="fs-15">PRESKOOL ACADEMY</h5>
              <span>Excellence in Education</span>
            </div>
            <div className="idcard-wave" />
          </div>
          <div className="idcard-photo-wrap">
            <ImageWithBasePath src="assets/img/students/student-01.jpg" alt="Janet Daniel" />
          </div>
          <div className="idcard-identity">
            <h5>Janet Daniel</h5>
            <span className="idcard-role">STUDENT</span>
          </div>
          <div className="idcard-info">
            {ID_CARD_ROWS.map((row) => (
              <div className="idcard-row" key={row.key}>
                <span>{row.key}</span>
                <b className={row.valueClass}>{row.value}</b>
              </div>
            ))}
          </div>
          <div className="idcard-barcode">
            <div className="idcard-bars" />
            <span>AD1256589</span>
          </div>
          <div className="idcard-foot">
            <i className="ti ti-map-pin" />
            123 Education Blvd &nbsp;·&nbsp; Valid till 31 Mar 2025
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Confirm ------------------------------ */}
      <Modal
        open={active === 'confirm'}
        onClose={onClose}
        title={confirm?.title ?? 'Are you sure?'}
        hideHeader
        bodyClassName="text-center p-4"
      >
        <>
          <span
            className={`avatar avatar-icon avatar-xl avatar-rounded bg-${confirm?.variant ?? 'danger'}-transparent`}
          >
            <i className={confirm?.icon ?? 'ti ti-alert-triangle'} />
          </span>
          <h4 className="confirm-title mt-3">{confirm?.title ?? 'Are you sure?'}</h4>
          <p className="confirm-text text-muted">
            {confirm?.text ?? 'This action cannot be undone.'}
          </p>
          <div className="d-flex justify-content-center gap-2">
            {cancelButton}
            <button
              type="button"
              className={`btn btn-${confirm?.variant ?? 'danger'} confirm-ok`}
              onClick={onConfirm}
            >
              {confirm?.okLabel ?? 'Confirm'}
            </button>
          </div>
        </>
      </Modal>

      {/* -------------------------------- Pay -------------------------------- */}
      <Modal
        open={active === 'pay'}
        onClose={onClose}
        title="Secure Payment"
        titleIcon="ti ti-credit-card"
        formClassName="vform"
        onSubmit={payForm.handleSubmit}
      >
        <div className="payment-summary">
          <div>
            <span>Paying for</span>
            <b className="payment-for">{payment.label}</b>
          </div>
          <div className="payment-amt">
            $<span className="payment-amount">{payment.amount.toLocaleString()}</span>
          </div>
        </div>

        <label className="profile-lbl mt-3">Payment Method</label>
        <div className="paymethods">
          {PAY_METHODS.map((method) => (
            <label className="payment-method" key={method.id}>
              <input
                type="radio"
                name="payMethod"
                value={method.id}
                checked={payMethod === method.id}
                onChange={() => setPayMethod(method.id)}
              />
              <span className="payment-method-b">
                <i className={method.icon} />
                {method.label}
              </span>
            </label>
          ))}
        </div>

        <div className="payment-fields">
          <div className="mb-2">
            <label className="profile-lbl" htmlFor="card-number">
              Card Number
            </label>
            <input
              type="text"
              className="form-control"
              inputMode="numeric"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              id="card-number"
              name="card"
              value={payForm.values.card}
              onChange={payForm.handleChange}
              onBlur={payForm.handleBlur}
            />
            {fieldError(payForm.errors.card, payForm.touched.card)}
          </div>
          <div className="row g-2">
            <div className="col-7">
              <label className="profile-lbl" htmlFor="name-on-card">
                Name on Card
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Robert Daniel"
                id="name-on-card"
                name="name"
                value={payForm.values.name}
                onChange={payForm.handleChange}
                onBlur={payForm.handleBlur}
              />
              {fieldError(payForm.errors.name, payForm.touched.name)}
            </div>
            <div className="col-3">
              <label className="profile-lbl" htmlFor="expiry">
                Expiry
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="MM/YY"
                maxLength={5}
                id="expiry"
                name="expiry"
                value={payForm.values.expiry}
                onChange={payForm.handleChange}
                onBlur={payForm.handleBlur}
              />
            </div>
            <div className="col-2">
              <label className="profile-lbl" htmlFor="cvv">
                CVV
              </label>
              <input
                type="password"
                autoComplete="current-password"
                className="form-control"
                maxLength={4}
                placeholder="•••"
                id="cvv"
                name="cvv"
                value={payForm.values.cvv}
                onChange={payForm.handleChange}
                onBlur={payForm.handleBlur}
              />
            </div>
          </div>
        </div>

        <div className="payment-secure">
          <i className="ti ti-lock-check" />
          256-bit SSL encrypted · PCI-DSS compliant
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-3 submit" disabled={payForm.isSubmitting}>
          {submitLabel(
            payForm.isSubmitting,
            <>
              Pay $<span className="payment-amount">{payment.amount.toLocaleString()}</span>
            </>,
          )}
        </button>
      </Modal>

      {/* ---------------------------- Collect Fees --------------------------- */}
      <Modal
        open={active === 'collectFees'}
        onClose={onClose}
        title="Collect Fees"
        dialogClassName="modal-lg"
        titleAccessory={<span className="badge badge-sm bg-primary ms-2">AD1256589</span>}
        onSubmit={collectForm.handleSubmit}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
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
                  <ImageWithBasePath src="assets/img/students/student-01.jpg" alt="Janet" />
                </span>
                <span className="d-flex flex-column">
                  <span className="text-dark">Janet</span>III, A
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
    </>
  );
};

export default StudentProfileModals;
