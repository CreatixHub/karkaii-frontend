import { Fragment, useState } from 'react';
import DateField from '@components/ui/DateField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Modal from '@components/ui/Modal';
import CommonSelect from '@core/common/commonSelect';
import type { IdCardModalId } from '../data/idCards.data';
import type { LabelledValue, SegmentOption } from '../data/idCardModals.data';
import {
  academicYearOptions,
  bloodGroupOptions,
  bulkClassOptions,
  bulkSectionOptions,
  bulkSelections,
  cardOptions,
  classOptions,
  generateTemplates,
  handedToOptions,
  houseOptions,
  modalDates,
  printJobs,
  printRunReference,
  readerAccessOptions,
  replacementReasons,
  sectionOptions,
  sheetLayoutOptions,
  signatureOptions,
  staffOptions,
  templateOptions,
  viewCardInformation,
  viewLifecycle,
  viewMilestones,
  viewVerification,
} from '../data/idCardModals.data';

dayjs.extend(customParseFormat);


const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

/** Every switch in the seven dialogs, with the template's checked state. */
const defaultSwitches: Record<string, boolean> = {
  gidQr: true,
  gidQueue: true,
  blkSkip: true,
  blkExisting: false,
  pidQr: true,
  pidLog: true,
  issReader: true,
  issNotify: true,
  repBlock: true,
  repPrint: true,
};

/** Text and date fields that ship with a value in the template. */
const defaultFields: Record<string, string> = {
  gidNo: '',
  gidName: 'Ishaan Verma',
  gidAdm: '',
  gidGuard: '',
  gidPhone: '',
  gidNotes: '',
  validTo: modalDates.validTo,
  generatedOn: modalDates.generatedOn,
  bulkGeneratedOn: modalDates.generatedOn,
  bulkReference: printRunReference,
  printReference: printRunReference,
  printDate: modalDates.printDate,
  issueDate: modalDates.issueDate,
  acknowledgement: '',
  handoverNotes:
    'Card checked against the admission record before handover. Reader access activated on issue.',
  newCardNumber: '',
  reportedOn: modalDates.reportedOn,
  replacementFee: '',
  circumstances:
    'Reported lost by the guardian. The card was last used at the main gate reader on 28 Jul.',
};

export interface IdCardModalsProps {
  active: IdCardModalId | null;
  onClose: () => void;
  onOpen: (modal: IdCardModalId) => void;
  onOpenPanel: () => void;
  onToast: (message: string) => void;
}

const IdCardModals = ({ active, onClose, onOpen, onOpenPanel, onToast }: IdCardModalsProps) => {
  const [switches, setSwitches] = useState(defaultSwitches);
  const [fields, setFields] = useState(defaultFields);
  const [selects, setSelects] = useState<Record<string, string>>({
    class: classOptions[0],
    section: sectionOptions[0],
    template: templateOptions[0],
    house: houseOptions[0],
    bloodGroup: bloodGroupOptions[0],
    academicYear: academicYearOptions[0],
    signature: signatureOptions[0],
    readerAccess: readerAccessOptions[0],
    bulkClass: bulkClassOptions[0],
    bulkSection: bulkSectionOptions[0],
    bulkTemplate: templateOptions[0],
    printCard: cardOptions[0],
    printedBy: staffOptions[0],
    sheetLayout: sheetLayoutOptions[0],
    issueCard: cardOptions[0],
    issuedBy: staffOptions[0],
    replaceCard: cardOptions[0],
    raisedBy: staffOptions[0],
  });
  const [segments, setSegments] = useState<Record<string, string>>({
    gid_tpl: generateTemplates[0].id,
    blk_sel: bulkSelections[0].id,
    pid_job: printJobs[0].id,
    iss_to: handedToOptions[0].id,
    rep_why: replacementReasons[0].id,
  });

  const setField = (id: string, value: string) =>
    setFields((current) => ({ ...current, [id]: value }));

  const setSelect = (id: string, value: string) =>
    setSelects((current) => ({ ...current, [id]: value }));

  const toggle = (id: string) =>
    setSwitches((current) => ({ ...current, [id]: !current[id] }));

  const settle = (message: string) => (event: React.FormEvent) => {
    event.preventDefault();
    onToast(message);
    onClose();
  };

  const cancel = (
    <button type="button" className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </button>
  );

  const select = (id: string, inputId: string, options: string[]) => (
    <CommonSelect
      inputId={inputId}
      options={toOptions(options)}
      value={selects[id] ? { value: selects[id], label: selects[id] } : null}
      onChange={(option) => setSelect(id, option?.value ?? '')}
    />
  );

  const segment = (name: string, label: string, options: SegmentOption[]) => (
    <div className="custom-btn-group custom-btn-group-fill mb-3" role="group" aria-label={label}>
      {options.map((option) => (
        <Fragment key={option.id}>
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={option.id}
            checked={segments[name] === option.id}
            onChange={() => setSegments((current) => ({ ...current, [name]: option.id }))}
          />
          <label className="btn" htmlFor={option.id}>
            {option.icon ? <i className={option.icon} /> : null}
            {option.label}
          </label>
        </Fragment>
      ))}
    </div>
  );

  const switchRow = (id: string, label: string, last = false) => (
    <div className={`form-check form-switch ${last ? 'mb-0' : 'mb-2'}`}>
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={id}
        checked={switches[id]}
        onChange={() => toggle(id)}
      />
      <label className="form-check-label fs-13" htmlFor={id}>
        {label}
      </label>
    </div>
  );

  const summaryRow = (row: LabelledValue, last: boolean) => (
    <div
      className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}
      key={row.label}
    >
      <span className="fs-13 text-muted">{row.label}</span>
      {row.badge ? (
        <span className={`badge ${row.badge}`}>{row.value}</span>
      ) : (
        <span className="fs-13 fw-medium">{row.value}</span>
      )}
    </div>
  );

  const datePicker = (id: string, field: string) => (
    <DateField
      id={id}
      value={fields[field]}
      onChange={(dateString) => setField(field, dateString as string)}
    />
  );

  return (
    <>
      {/* Generate ID Card */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate ID Card"
        titleIcon="ti ti-id"
        titleAccessory={
          <p className="mb-0 fs-12 text-muted">
            Create a card record and queue it for the next print run
          </p>
        }
        dialogClassName="modal-lg"
        onSubmit={settle('ID card generated')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              Generate ID Card
            </button>
          </>
        }
      >
        <div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
          <i className="ti ti-alert-triangle me-2" />
          <span className="fs-13">
            A studio photograph must be on file before a card can be generated.
          </span>
        </div>
        <p className="mb-2 fs-13 text-muted">Card template</p>
        {segment('gid_tpl', 'Card template', generateTemplates)}
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="gidNo">
                Card Number
              </label>
              <input
                type="text"
                className="form-control"
                id="gidNo"
                placeholder="Generated on save"
                value={fields.gidNo}
                onChange={(event) => setField('gidNo', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="gidName">
                Student
              </label>
              <input
                type="text"
                className="form-control"
                id="gidName"
                placeholder="e.g. Meera Iyer"
                value={fields.gidName}
                onChange={(event) => setField('gidName', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="gidAdm">
                Admission No.
              </label>
              <input
                type="text"
                className="form-control"
                id="gidAdm"
                placeholder="e.g. AD9893660"
                value={fields.gidAdm}
                onChange={(event) => setField('gidAdm', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="class-2">
                Class
              </label>
              {select('class', 'class-2', classOptions)}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="section-2">
                Section
              </label>
              {select('section', 'section-2', sectionOptions)}
            </div>
          </div>
          <div className="col-md-12">
            <hr className="my-2" />
            <p className="fs-13 fw-medium mb-2">Card Design</p>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="template">
                Template
              </label>
              {select('template', 'template', templateOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="house-2">
                House
              </label>
              {select('house', 'house-2', houseOptions)}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="blood-group">
                Blood Group
              </label>
              {select('bloodGroup', 'blood-group', bloodGroupOptions)}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="academic-year-2">
                Academic Year
              </label>
              {select('academicYear', 'academic-year-2', academicYearOptions)}
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label className="form-label" htmlFor="valid-to">
                Valid To
              </label>
              {datePicker('valid-to', 'validTo')}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="photograph">
                Photograph
              </label>
              <input type="file" className="form-control" id="photograph" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="signature-block">
                Signature Block
              </label>
              {select('signature', 'signature-block', signatureOptions)}
            </div>
          </div>
          <div className="col-md-12">
            <hr className="my-2" />
            <p className="fs-13 fw-medium mb-2">Guardian &amp; Access</p>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="gidGuard">
                Guardian
              </label>
              <input
                type="text"
                className="form-control"
                id="gidGuard"
                placeholder="e.g. Mrs. Latha Iyer"
                value={fields.gidGuard}
                onChange={(event) => setField('gidGuard', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="gidPhone">
                Emergency Contact
              </label>
              <input
                type="text"
                className="form-control"
                id="gidPhone"
                placeholder="e.g. +1 55 3390 8827"
                value={fields.gidPhone}
                onChange={(event) => setField('gidPhone', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="reader-access">
                Reader Access
              </label>
              {select('readerAccess', 'reader-access', readerAccessOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="generated-on">
                Generated On
              </label>
              {datePicker('generated-on', 'generatedOn')}
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="gidNotes">
                Internal Notes
              </label>
              <textarea
                className="form-control"
                rows={2}
                id="gidNotes"
                placeholder="Visible to the school office only"
                value={fields.gidNotes}
                onChange={(event) => setField('gidNotes', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            {switchRow('gidQr', 'Print a QR code and barcode on the card face')}
            {switchRow('gidQueue', 'Add to the next batch print run', true)}
          </div>
        </div>
      </Modal>

      {/* Bulk Generate ID Cards */}
      <Modal
        open={active === 'bulkGenerate'}
        onClose={onClose}
        title="Bulk Generate ID Cards"
        onSubmit={settle('Cards queued for generation')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-id me-1" />
              Generate Cards
            </button>
          </>
        }
      >
        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center mb-3">
            <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0">
              <i className="ti ti-users" />
            </span>
            <div className="ms-2">
              <h5 className="fs-14 mb-0">Academic year 2026-2027</h5>
              <span className="fs-12 text-muted">1,248 students on roll</span>
            </div>
            <div className="ms-auto text-end">
              <span className="fs-12 text-muted d-block">Generated</span>
              <span className="badge badge-soft-info">1,196</span>
            </div>
          </div>
          {summaryRow({ label: 'Cards Outstanding', value: '52 students' }, false)}
          {summaryRow({ label: 'Blocked By', value: 'Missing photograph' }, false)}
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
            <span className="fs-13 fw-medium">Ready to Generate</span>
            <span className="fs-13 fw-semibold text-success">0 of 52</span>
          </div>
        </div>
        <p className="mb-2 fs-13 text-muted">Selection</p>
        {segment('blk_sel', 'Selection', bulkSelections)}
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="class-3">
                Class
              </label>
              {select('bulkClass', 'class-3', bulkClassOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="section-3">
                Section
              </label>
              {select('bulkSection', 'section-3', bulkSectionOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="template-2">
                Template
              </label>
              {select('bulkTemplate', 'template-2', templateOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="generated-on-2">
                Generated On
              </label>
              {datePicker('generated-on-2', 'bulkGeneratedOn')}
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="print-run-reference">
                Print Run Reference
              </label>
              <input
                type="text"
                className="form-control"
                id="print-run-reference"
                value={fields.bulkReference}
                onChange={(event) => setField('bulkReference', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            {switchRow('blkSkip', 'Skip students without a studio photograph on file')}
            {switchRow('blkExisting', 'Regenerate cards that already exist for this session', true)}
          </div>
        </div>
      </Modal>

      {/* Preview ID Card */}
      <Modal
        open={active === 'preview'}
        onClose={onClose}
        title="Preview ID Card"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onOpen('print')}>
              <i className="ti ti-printer me-1" />
              Print This Card
            </button>
          </>
        }
      >
        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
            <span className="avatar avatar-lg bg-primary-transparent text-primary rounded flex-shrink-0">
              <i className="ti ti-school fs-20" />
            </span>
            <div className="overflow-hidden">
              <h5 className="fs-14 mb-0">Karkaii School</h5>
              <span className="fs-12 text-muted">Student Identity Card · 2026-2027</span>
            </div>
            <span className="badge badge-soft-primary ms-auto">Everest</span>
          </div>
          <div className="d-flex align-items-center gap-3 mb-3">
            <span className="avatar avatar-xl bg-info-transparent text-info rounded flex-shrink-0">
              <i className="ti ti-user fs-24" />
            </span>
            <div className="overflow-hidden">
              <h6 className="fs-15 mb-1">Ananya Rao</h6>
              <span className="fs-13 text-muted d-block">Class X · Section B</span>
              <span className="fs-12 text-muted">AD9887402 · O positive</span>
            </div>
          </div>
          {summaryRow({ label: 'Card No.', value: 'IDC-2026-0118' }, false)}
          {summaryRow({ label: 'Guardian', value: 'Mrs. Kavita Rao' }, false)}
          {summaryRow({ label: 'Emergency', value: '+1 55 2298 6614' }, false)}
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="fs-13 text-muted">Valid To</span>
            <span className="fs-13 fw-medium">31 Mar 2027</span>
          </div>
          <div className="d-flex align-items-center gap-2 border-top pt-3">
            <span className="avatar avatar-md bg-secondary-transparent text-secondary rounded flex-shrink-0">
              <i className="ti ti-qrcode" />
            </span>
            <div className="overflow-hidden">
              <span className="fs-12 text-muted d-block">Barcode</span>
              <span className="fs-13 fw-medium">AD9887402-0118</span>
            </div>
            <span className="badge badge-soft-success ms-auto">Reader active</span>
          </div>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <span className="badge badge-soft-info">Senior card, blue band</span>
          <span className="badge badge-soft-secondary">A4 sheet, 8 cards per page</span>
          <span className="badge badge-soft-success">Ready to print</span>
        </div>
      </Modal>

      {/* Print ID Card */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print ID Card"
        onSubmit={settle('Card sent to the printer')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-printer me-1" />
              Print Card
            </button>
          </>
        }
      >
        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center mb-3">
            <span className="avatar avatar-md bg-success-transparent text-success rounded flex-shrink-0">
              <i className="ti ti-school" />
            </span>
            <div className="ms-2">
              <h5 className="fs-14 mb-0">Meera Iyer</h5>
              <span className="fs-12 text-muted">IDC-2026-0248 · Class V · Section A</span>
            </div>
            <div className="ms-auto text-end">
              <span className="fs-12 text-muted d-block">Card Status</span>
              <span className="badge badge-soft-warning">Print Queued</span>
            </div>
          </div>
          {summaryRow({ label: 'Generated', value: '28 Jul 2026' }, false)}
          {summaryRow({ label: 'Photograph', value: 'Retake, 24 Jul 2026' }, false)}
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
            <span className="fs-13 fw-medium">Next Batch Run</span>
            <span className="fs-13 fw-semibold text-info">4 Aug 2026</span>
          </div>
        </div>
        <p className="mb-2 fs-13 text-muted">Print job</p>
        {segment('pid_job', 'Print job', printJobs)}
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="card">
                Card
              </label>
              {select('printCard', 'card', cardOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="print-run-reference-2">
                Print Run Reference
              </label>
              <input
                type="text"
                className="form-control"
                id="print-run-reference-2"
                value={fields.printReference}
                onChange={(event) => setField('printReference', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="print-date">
                Print Date
              </label>
              {datePicker('print-date', 'printDate')}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="printed-by">
                Printed By
              </label>
              {select('printedBy', 'printed-by', staffOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="sheet-layout">
                Sheet Layout
              </label>
              {select('sheetLayout', 'sheet-layout', sheetLayoutOptions)}
            </div>
          </div>
          <div className="col-md-12">
            {switchRow('pidQr', 'Include the QR code, barcode and signature block')}
            {switchRow('pidLog', 'Record the run on the card print history', true)}
          </div>
        </div>
      </Modal>

      {/* Issue ID Card */}
      <Modal
        open={active === 'issue'}
        onClose={onClose}
        title="Issue ID Card"
        onSubmit={settle('Card issued')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-circle-check me-1" />
              Issue Card
            </button>
          </>
        }
      >
        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center mb-3">
            <span className="avatar avatar-md bg-warning-transparent text-warning rounded flex-shrink-0">
              <i className="ti ti-id" />
            </span>
            <div className="ms-2">
              <h5 className="fs-14 mb-0">Cards waiting at the office</h5>
              <span className="fs-12 text-muted">Printed but not yet handed over</span>
            </div>
            <div className="ms-auto text-end">
              <span className="fs-12 text-muted d-block">Pending</span>
              <span className="badge badge-soft-warning">33</span>
            </div>
          </div>
          {summaryRow({ label: 'Printed', value: '1,164 cards' }, false)}
          {summaryRow({ label: 'Issued', value: '1,131 cards' }, false)}
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
            <span className="fs-13 fw-medium">Difference</span>
            <span className="fs-13 fw-semibold text-warning">33 to hand over</span>
          </div>
        </div>
        <p className="mb-2 fs-13 text-muted">Handed to</p>
        {segment('iss_to', 'Handed to', handedToOptions)}
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="card-2">
                Card
              </label>
              {select('issueCard', 'card-2', cardOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="issue-date">
                Issue Date
              </label>
              {datePicker('issue-date', 'issueDate')}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="issued-by">
                Issued By
              </label>
              {select('issuedBy', 'issued-by', staffOptions)}
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="acknowledgement">
                Acknowledgement
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Name of the person signing for the card"
                id="acknowledgement"
                value={fields.acknowledgement}
                onChange={(event) => setField('acknowledgement', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="handover-notes">
                Handover Notes
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Written to the issue history"
                id="handover-notes"
                value={fields.handoverNotes}
                onChange={(event) => setField('handoverNotes', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            {switchRow('issReader', 'Activate the card at the gate and library readers')}
            {switchRow('issNotify', 'Inform the guardian that the card has been issued', true)}
          </div>
        </div>
      </Modal>

      {/* Replace Lost Card */}
      <Modal
        open={active === 'replace'}
        onClose={onClose}
        title="Replace Lost Card"
        onSubmit={settle('Replacement raised')}
        footer={
          <>
            {cancel}
            <button type="submit" className="btn btn-primary">
              <i className="ti ti-refresh me-1" />
              Raise Replacement
            </button>
          </>
        }
      >
        <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
          <i className="ti ti-alert-triangle me-2" />
          <span className="fs-13">
            The lost card is blocked at every reader as soon as the replacement is raised. It cannot
            be reactivated.
          </span>
        </div>
        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center mb-3">
            <span className="avatar avatar-md bg-danger-transparent text-danger rounded flex-shrink-0">
              <i className="ti ti-id-off" />
            </span>
            <div className="ms-2">
              <h5 className="fs-14 mb-0">Kabir Shah</h5>
              <span className="fs-12 text-muted">IDC-2026-0163 · Class VI · Section B</span>
            </div>
            <div className="ms-auto text-end">
              <span className="fs-12 text-muted d-block">Status</span>
              <span className="badge badge-soft-danger">Reported Lost</span>
            </div>
          </div>
          {summaryRow({ label: 'Originally Issued', value: '16 Jun 2026' }, false)}
          {summaryRow({ label: 'Reported Lost', value: '29 Jul 2026' }, false)}
          <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
            <span className="fs-13 fw-medium">Replacement Fee</span>
            <span className="fs-13 fw-semibold text-warning">Payable at the office</span>
          </div>
        </div>
        <p className="mb-2 fs-13 text-muted">Replacement reason</p>
        {segment('rep_why', 'Replacement reason', replacementReasons)}
        <div className="row">
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="card-being-replaced">
                Card Being Replaced
              </label>
              {select('replaceCard', 'card-being-replaced', cardOptions)}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="new-card-number">
                New Card Number
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Generated on save"
                id="new-card-number"
                value={fields.newCardNumber}
                onChange={(event) => setField('newCardNumber', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="reported-on">
                Reported On
              </label>
              {datePicker('reported-on', 'reportedOn')}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="replacement-fee">
                Replacement Fee
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Amount collected"
                id="replacement-fee"
                value={fields.replacementFee}
                onChange={(event) => setField('replacementFee', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label" htmlFor="raised-by">
                Raised By
              </label>
              {select('raisedBy', 'raised-by', staffOptions)}
            </div>
          </div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label" htmlFor="circumstances">
                Circumstances
              </label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Written to the replacement record"
                id="circumstances"
                value={fields.circumstances}
                onChange={(event) => setField('circumstances', event.target.value)}
              />
            </div>
          </div>
          <div className="col-md-12">
            {switchRow('repBlock', 'Block the old card at every reader immediately')}
            {switchRow('repPrint', 'Queue the replacement for a single card print', true)}
          </div>
        </div>
      </Modal>

      {/* View ID Card Details */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title="IDC-2026-0118"
        titleIcon="ti ti-id"
        titleAccessory={
          <p className="mb-0 fs-12 text-muted">
            Ananya Rao &nbsp;•&nbsp; Class X, Section B &nbsp;•&nbsp; 2026-2027
          </p>
        }
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={() => onOpen('preview')}>
              <i className="ti ti-photo me-1" />
              Preview Card
            </button>
            <button type="button" className="btn btn-primary" onClick={onOpenPanel}>
              <i className="ti ti-id me-1" />
              Open ID Card Panel
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
          <span className="avatar avatar-lg bg-primary-transparent text-primary rounded flex-shrink-0">
            <i className="ti ti-school fs-20" />
          </span>
          <div>
            <h5 className="mb-0 fs-15">Ananya Rao</h5>
            <span className="fs-12 text-muted">AD9887402 · Everest House · O positive</span>
          </div>
          <span className="badge badge-soft-success ms-auto">Issued</span>
        </div>
        <div className="row g-3 mb-3">
          {viewMilestones.map((milestone) => (
            <div className="col-md-3" key={milestone.id}>
              <div className="d-flex align-items-center gap-2 border rounded p-3 h-100">
                <span className={`avatar avatar-md ${milestone.tint} rounded flex-shrink-0`}>
                  <i className={milestone.icon} />
                </span>
                <div className="overflow-hidden">
                  <span className="fs-12 text-muted d-block">{milestone.label}</span>
                  <h6 className="fs-14 mb-0 text-truncate">{milestone.value}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <h6 className="fs-13 mb-2">Card Information</h6>
            <div className="border rounded p-3">
              {viewCardInformation.map((row, index) =>
                summaryRow(row, index === viewCardInformation.length - 1),
              )}
            </div>
          </div>
          <div className="col-md-6">
            <h6 className="fs-13 mb-2">Verification</h6>
            <div className="border rounded p-3">
              {viewVerification.map((row, index) =>
                summaryRow(row, index === viewVerification.length - 1),
              )}
            </div>
          </div>
        </div>
        <h6 className="fs-13 mb-2">Card Lifecycle</h6>
        <div className="table-responsive border rounded mb-3">
          <table className="table table-nowrap mb-0">
            <thead className="table-light">
              <tr>
                <th className="fs-13">Date</th>
                <th className="fs-13">Event</th>
                <th className="fs-13">By</th>
              </tr>
            </thead>
            <tbody>
              {viewLifecycle.map((row) => (
                <tr key={row.event}>
                  <td className="fs-13">{row.date}</td>
                  <td>
                    <span className={`badge ${row.eventBadge}`}>{row.event}</span>
                  </td>
                  <td className="fs-13">{row.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h6 className="fs-13 mb-1">Internal Notes</h6>
        <p className="fs-13 text-muted mb-0">
          Card carries library and laboratory access. Reprint not required this session.
        </p>
      </Modal>
    </>
  );
};

export default IdCardModals;
