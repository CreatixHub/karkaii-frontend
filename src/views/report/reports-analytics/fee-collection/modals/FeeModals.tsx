import { useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { FeeRecord } from '../data/feeCollection.data';
import {
  ACADEMIC_YEAR,
  annualFeeOf,
  balanceOf,
  categoryOptions,
  chargeableDaysOf,
  classLabelOf,
  classOptions,
  collectionRateOf,
  concessionOf,
  daysOverdueOf,
  fineOf,
  futureInstallmentsOf,
  GRACE_DAYS,
  grossAnnualOf,
  LATE_FEE_PER_DAY,
  overdueBandOf,
  overdueOptions,
  paidToDateOf,
  REGISTER_DATE,
  REPORT_RANGE,
  rupees,
  scholarshipOf,
  sectionOptions,
  shortRupees,
  statusOf,
  statusPill,
  statusTint,
  totalPayableOf,
} from '../data/feeCollection.data';

export type FeeModalId =
  | 'generate'
  | 'compare'
  | 'export'
  | 'print'
  | 'share'
  | 'template'
  | 'receipt'
  | 'payment'
  | 'outstanding'
  | 'ledger';

export interface FeeModalsProps {
  active: FeeModalId | null;
  onClose: () => void;
  row: FeeRecord | null;
  rows: FeeRecord[];
  selected: FeeRecord[];
  registerTotal: number;
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  onSendReminder: (id: string) => void;
}

const Field = ({
  label,
  children,
  span = 'col-md-6',
}: {
  label: string;
  children: React.ReactNode;
  span?: string;
}) => (
  <div className={span}>
    <label className="form-label">{label}</label>
    {children}
  </div>
);

const Select = ({ options }: { options: string[] }) => (
  <select className="form-select" defaultValue={options[0]}>
    {options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
);

const Switch = ({ label, on = false, id }: { label: string; on?: boolean; id: string }) => (
  <div className="form-check form-switch mb-2">
    <input className="form-check-input" type="checkbox" role="switch" id={id} defaultChecked={on} />
    <label className="form-check-label fs-13" htmlFor={id}>
      {label}
    </label>
  </div>
);

const Radios = ({ name, options }: { name: string; options: string[] }) => (
  <div className="custom-btn-group custom-btn-group-fill custom-btn-group-sm" role="group">
    {options.map((option, index) => (
      <span key={option}>
        <input type="radio" className="btn-check" name={name} id={`${name}-${index}`} defaultChecked={index === 0} />
        <label className="btn" htmlFor={`${name}-${index}`}>
          {option}
        </label>
      </span>
    ))}
  </div>
);

const StudentStrip = ({ row }: { row: FeeRecord }) => (
  <div className="d-flex align-items-center gap-3 border rounded p-3 mb-3">
    <span className="avatar avatar-lg rounded flex-shrink-0">
      <ImageWithBasePath src={row.image} alt={row.student} className="rounded" />
    </span>
    <div className="flex-fill">
      <h6 className="fs-15 mb-0">{row.student}</h6>
      <span className="fs-12 text-muted">
        {row.admission} · {classLabelOf(row)} · {row.feeCategory}
      </span>
    </div>
    <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
      <span className="dt-pill-dot" />
      {statusOf(row)}
    </span>
  </div>
);

const FeeModals = ({
  active,
  onClose,
  row,
  rows,
  selected,
  registerTotal,
  panelOpen,
  onClosePanel,
  onToast,
  onSendReminder,
}: FeeModalsProps) => {
  const [comparison, setComparison] = useState('Class');
  const [metric, setMetric] = useState('Collection rate');
  const [reminderNote, setReminderNote] = useState('');

  const detail = row ?? rows[0] ?? null;
  const owing = row ?? rows.find((item) => balanceOf(item) > 0) ?? rows[0] ?? null;
  const paidRecord = row ?? rows.find((item) => statusOf(item) === 'Paid') ?? rows[0] ?? null;

  /* ------------------------------ Report figures ---------------------------- */

  const totals = useMemo(() => {
    const billed = rows.reduce((total, item) => total + item.billed, 0);
    const collected = rows.reduce((total, item) => total + item.paid + (item.waived ?? 0), 0);
    const outstanding = rows.reduce((total, item) => total + balanceOf(item), 0);
    return { billed, collected, outstanding, rate: collectionRateOf(rows) };
  }, [rows]);

  /** The outstanding split across the bands the More Filters panel offers. */
  const outstandingBands = useMemo(() => {
    const owed = rows.filter((item) => balanceOf(item) > 0);
    const total = owed.reduce((sum, item) => sum + balanceOf(item), 0) || 1;
    const bands = ['Not yet due', ...overdueOptions];
    return bands.map((band) => {
      const group = owed.filter((item) => (overdueBandOf(item) || 'Not yet due') === band);
      const amount = group.reduce((sum, item) => sum + balanceOf(item), 0);
      return { band, amount, share: Math.round((amount / total) * 1000) / 10, count: group.length };
    });
  }, [rows]);

  const classRows = useMemo(
    () =>
      [...new Set(rows.map((item) => item.className))].sort().map((className) => {
        const group = rows.filter((item) => item.className === className);
        return {
          className,
          billed: group.reduce((total, item) => total + item.billed, 0),
          collected: group.reduce((total, item) => total + item.paid + (item.waived ?? 0), 0),
          rate: collectionRateOf(group),
        };
      }),
    [rows],
  );

  const categoryRows = useMemo(
    () =>
      [...new Set(rows.map((item) => item.feeCategory))].sort().map((category) => {
        const group = rows.filter((item) => item.feeCategory === category);
        return {
          category,
          billed: group.reduce((total, item) => total + item.billed, 0),
          rate: collectionRateOf(group),
        };
      }),
    [rows],
  );

  /* ------------------------------- Comparison ------------------------------- */

  const comparisonRows = useMemo(() => {
    const keyOf = (item: FeeRecord) => {
      switch (comparison) {
        case 'Fee category':
          return item.feeCategory;
        case 'Payment method':
          return item.method;
        case 'Month':
          return item.dueDate.split(' ').slice(1).join(' ');
        default:
          return item.className;
      }
    };

    const readOn = (group: FeeRecord[]) => {
      if (metric === 'Amount collected') return group.reduce((total, item) => total + item.paid, 0);
      if (metric === 'Outstanding balance') return group.reduce((total, item) => total + balanceOf(item), 0);
      if (metric === 'Defaulter count') return group.filter((item) => daysOverdueOf(item) > 0).length;
      return collectionRateOf(group) ?? 0;
    };

    const groups = new Map<string, FeeRecord[]>();
    rows.forEach((item) => {
      const key = keyOf(item);
      groups.set(key, [...(groups.get(key) ?? []), item]);
    });

    const isMoney = metric === 'Amount collected' || metric === 'Outstanding balance';
    const list = [...groups.entries()].map(([label, group]) => {
      const value = readOn(group);
      /* Last year is the same ledger without this year's part payments. */
      const previous = readOn(group.map((item) => ({ ...item, paid: Math.round(item.paid * 0.94) })));
      return {
        label,
        a: isMoney ? shortRupees(value) : `${value}${metric === 'Collection rate' ? '%' : ''}`,
        b: isMoney ? shortRupees(previous) : `${previous}${metric === 'Collection rate' ? '%' : ''}`,
        change: Math.round((value - previous) * 10) / 10,
        isMoney,
      };
    });
    return list;
  }, [comparison, metric, rows]);

  const footerButtons = (label: string, icon: string, onConfirm: () => void) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </button>
      <button type="button" className="btn btn-primary" onClick={onConfirm}>
        <i className={`${icon} me-1`} />
        {label}
      </button>
    </>
  );

  const confirm = (message: string) => () => {
    onClose();
    onToast(message);
  };

  return (
    <>
      {/* ---------------------------- Generate Report ---------------------------- */}
      <Modal
        open={active === 'generate'}
        onClose={onClose}
        title="Generate Fee Report"
        dialogClassName="modal-lg"
        footer={footerButtons('Generate Report', 'ti ti-player-play', confirm('Fee report generated'))}
      >
        <p className="text-muted fs-13 mb-3">
          Build a collection report from the ledger for the selected period
        </p>
        <div className="border rounded p-3 mb-3">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
            <div>
              <h6 className="fs-14 mb-0">{REPORT_RANGE.replace(' - ', ' – ')}</h6>
              <span className="fs-12 text-muted">
                {rows.length} fee records · {shortRupees(totals.billed)} billed
              </span>
            </div>
            <span className="badge badge-soft-success">
              <i className="ti ti-lock me-1" />
              Ledger Closed to {REGISTER_DATE}
            </span>
          </div>
          <div className="row g-2 fs-13">
            <div className="col-sm-6">
              <span className="text-muted">Collected</span>{' '}
              <span className="fw-medium">
                {shortRupees(totals.collected)} · {totals.rate}%
              </span>
            </div>
            <div className="col-sm-6">
              <span className="text-muted">Outstanding</span>{' '}
              <span className="fw-medium">
                {shortRupees(totals.outstanding)} across {rows.filter((item) => balanceOf(item) > 0).length}{' '}
                records
              </span>
            </div>
          </div>
        </div>
        <div className="row g-3">
          <Field label="Report Name" span="col-12">
            <input type="text" className="form-control" defaultValue="Fee Collection Report" />
          </Field>
          <Field label="Report Type">
            <Select
              options={[
                'Collection Report',
                'Outstanding Report',
                'Defaulter Report',
                'Concession Report',
                'Scholarship Report',
                'Day Book',
              ]}
            />
          </Field>
          <Field label="Academic Year">
            <Select options={[ACADEMIC_YEAR, '2025-2026']} />
          </Field>
          <Field label="From Date">
            <DateField value="01-04-2026" onChange={() => undefined} format="d-m-Y" id="fc-from" />
          </Field>
          <Field label="To Date">
            <DateField value="31-07-2026" onChange={() => undefined} format="d-m-Y" id="fc-to" />
          </Field>
          <Field label="Class" span="col-md-4">
            <Select options={['All classes', ...classOptions]} />
          </Field>
          <Field label="Section" span="col-md-4">
            <Select options={['All sections', ...sectionOptions]} />
          </Field>
          <Field label="Fee Category" span="col-md-4">
            <Select options={['All categories', ...categoryOptions]} />
          </Field>
          <Field label="Payment Method">
            <Select options={['All methods', 'Digital only', 'Cash only', 'Cheque and DD']} />
          </Field>
          <Field label="Collection Status">
            <Select options={['All status', 'Paid', 'Partially Paid', 'Pending', 'Overdue']} />
          </Field>
        </div>
      </Modal>

      {/* ---------------------------- Compare Reports ---------------------------- */}
      <Modal
        open={active === 'compare'}
        onClose={onClose}
        title="Compare Reports"
        dialogClassName="modal-lg"
        footer={footerButtons('Run Comparison', 'ti ti-arrows-diff', confirm('Comparison run'))}
      >
        <div className="row g-3 mb-3">
          <Field label="Report A">
            <Select options={['Apr – Jul 2026 · current', 'Term 1 · Apr 2026']} />
          </Field>
          <Field label="Report B">
            <Select options={['Apr – Jul 2025', 'Apr – Jul 2026 · current']} />
          </Field>
          <Field label="Compare By">
            <select
              className="form-select"
              value={comparison}
              onChange={(event) => setComparison(event.target.value)}
            >
              {['Class', 'Fee category', 'Payment method', 'Month'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
          <Field label="Metric">
            <select className="form-select" value={metric} onChange={(event) => setMetric(event.target.value)}>
              {['Collection rate', 'Amount collected', 'Outstanding balance', 'Defaulter count'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="table-responsive border rounded">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>{comparison}</th>
                <th className="text-center">Report A</th>
                <th className="text-center">Report B</th>
                <th className="text-center">Change</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((item) => (
                <tr key={item.label}>
                  <td className="fs-13">{item.label}</td>
                  <td className="text-center fs-13">{item.a}</td>
                  <td className="text-center fs-13">{item.b}</td>
                  <td className="text-center">
                    <span className={`badge badge-soft-${item.change >= 0 ? 'success' : 'danger'}`}>
                      <i className={`ti ti-arrow-${item.change >= 0 ? 'up' : 'down'} me-1`} />
                      {item.isMoney ? shortRupees(Math.abs(item.change)) : Math.abs(item.change)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* ------------------------------ Export Report ---------------------------- */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export Report"
        footer={footerButtons('Export', 'ti ti-file-export', confirm(`${rows.length} records exported`))}
      >
        <div className="row g-3">
          <Field label="Format" span="col-12">
            <Radios name="fc-format" options={['PDF', 'Excel', 'CSV']} />
          </Field>
          <div className="col-12">
            <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Report</span>
                <span className="fw-medium">Fee Collection Report</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Period</span>
                <span className="fw-medium">{REPORT_RANGE.replace(' - ', ' – ')}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Records</span>
                <span className="fw-medium">
                  {selected.length} selected of {registerTotal.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>
          <Field label="Rows To Export">
            <Select options={['Selected records only', 'Current page', 'All filtered records', 'All records']} />
          </Field>
          <Field label="Columns">
            <Select options={['Visible columns', 'All columns', 'Amounts only']} />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter', 'Legal']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Landscape', 'Portrait']} />
          </Field>
          <Field label="File Name" span="col-md-4">
            <input type="text" className="form-control" defaultValue="fee-collection-apr-jul" />
          </Field>
          <div className="col-12">
            <Switch id="fc-ex-strip" label="Include the revenue summary strip" on />
            <Switch id="fc-ex-sub" label="Add subtotal and grand total rows" on />
            <Switch id="fc-ex-head" label="Print on the school letterhead" on />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Print Report ----------------------------- */}
      <Modal
        open={active === 'print'}
        onClose={onClose}
        title="Print Report"
        footer={footerButtons('Print', 'ti ti-printer', () => {
          onClose();
          window.print();
        })}
      >
        <div className="border rounded p-3 mb-3">
          <h6 className="fs-14 mb-1">Fee Collection Report</h6>
          <span className="fs-12 text-muted">
            {REPORT_RANGE.replace(' - ', ' – ')} · {shortRupees(totals.collected)} collected
          </span>
          <div className="row g-2 fs-13 mt-2">
            <div className="col-6">
              <span className="text-muted">Pages</span>{' '}
              <span className="fw-medium">{Math.max(1, Math.ceil(rows.length / 20))}</span>
            </div>
            <div className="col-6">
              <span className="text-muted">Records</span>{' '}
              <span className="fw-medium">{rows.length} rows</span>
            </div>
          </div>
        </div>
        <div className="row g-3">
          <Field label="Printer">
            <Select options={['Accounts office · HP LaserJet', 'Front desk · Canon iR', 'Save as PDF']} />
          </Field>
          <Field label="Copies">
            <input type="number" className="form-control" defaultValue={1} min={1} />
          </Field>
          <Field label="Page Size" span="col-md-4">
            <Select options={['A4', 'Letter', 'Legal']} />
          </Field>
          <Field label="Orientation" span="col-md-4">
            <Select options={['Landscape', 'Portrait']} />
          </Field>
          <Field label="Page Range" span="col-md-4">
            <Select options={['All pages', 'Current page', 'Selected records only']} />
          </Field>
          <div className="col-12">
            <Switch id="fc-pr-head" label="Repeat the column header on every page" on />
            <Switch id="fc-pr-sub" label="Print subtotals at each class break" on />
            <Switch id="fc-pr-sign" label="Leave a signature block for the accounts head" />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Share Report ----------------------------- */}
      <Modal
        open={active === 'share'}
        onClose={onClose}
        title="Share Report"
        footer={footerButtons('Share Report', 'ti ti-share', confirm('Report shared'))}
      >
        <div className="row g-3">
          <Field label="Share through" span="col-12">
            <Radios name="fc-share" options={['Email', 'Portal', 'Link']} />
          </Field>
          <div className="col-12">
            <ul className="list-unstyled fs-13 border rounded p-3 mb-0">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Report</span>
                <span className="fw-medium">Fee Collection Report</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Records Included</span>
                <span className="fw-medium">
                  {selected.length} selected of {registerTotal.toLocaleString()}
                </span>
              </li>
            </ul>
          </div>
          <Field label="Share With" span="col-12">
            <Select
              options={[
                'Principal and the finance committee',
                'Trustee board',
                'Class teachers of the selected sections',
                'Guardians of the selected students',
              ]}
            />
          </Field>
          <Field label="Access">
            <Select options={['View only', 'View and download']} />
          </Field>
          <Field label="Link Expires">
            <Select options={['In 7 days', 'In 30 days', 'Never']} />
          </Field>
          <Field label="Message" span="col-12">
            <textarea
              className="form-control"
              rows={3}
              defaultValue={`Collections stand at ${totals.rate}% for the period. ${shortRupees(
                totals.outstanding,
              )} is outstanding across ${rows.filter((item) => balanceOf(item) > 0).length} records.`}
            />
          </Field>
          <div className="col-12">
            <Switch id="fc-sh-names" label="Include student names in the shared copy" on />
            <Switch id="fc-sh-audit" label="Record the share in the report audit history" on />
          </div>
        </div>
      </Modal>

      {/* --------------------------- Save Report Template ------------------------ */}
      <Modal
        open={active === 'template'}
        onClose={onClose}
        title="Save Report Template"
        footer={footerButtons('Save Template', 'ti ti-bookmark-plus', confirm('Template saved'))}
      >
        <div className="border rounded p-3 mb-3">
          <span className="fs-12 text-muted d-block mb-2">Current parameters</span>
          <div className="d-flex flex-wrap gap-1">
            {[
              'Collection report',
              ACADEMIC_YEAR,
              REPORT_RANGE.replace(' - ', ' – '),
              `${rows.length} records`,
              `${rows.filter((item) => balanceOf(item) > 0).length} with a balance`,
            ].map((chip) => (
              <span className="badge badge-soft-secondary" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="row g-3">
          <Field label="Template Name" span="col-12">
            <input type="text" className="form-control" defaultValue="Monthly collection — all classes" />
          </Field>
          <Field label="Visibility">
            <Select options={['Only me', 'Accounts team', 'Principal and finance committee']} />
          </Field>
          <Field label="Category">
            <Select options={['Collections', 'Outstanding', 'Audit', 'Board reporting']} />
          </Field>
          <Field label="Description" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              defaultValue="Run on the first working day of each month once the previous ledger is locked."
            />
          </Field>
          <div className="col-12">
            <Switch id="fc-tpl-cols" label="Save the column visibility and sort order" on />
            <Switch id="fc-tpl-filters" label="Save the active filters and date range" on />
            <Switch id="fc-tpl-default" label="Make this the default view for this page" />
          </div>
        </div>
      </Modal>

      {/* -------------------------------- Receipt -------------------------------- */}
      <Modal
        open={active === 'receipt' && paidRecord !== null}
        onClose={onClose}
        title={paidRecord?.receipt ?? 'Receipt'}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-outline-light bg-white me-2" onClick={() => window.print()}>
              <i className="ti ti-printer me-1" />
              Print Receipt
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Receipt emailed')}>
              <i className="ti ti-mail me-1" />
              Email Receipt
            </button>
          </>
        }
      >
        {paidRecord ? (
          <>
            <p className="fs-12 text-muted mb-3">
              Issued {paidRecord.receiptDate} · {paidRecord.student} · {paidRecord.admission}
            </p>
            <ul className="list-unstyled fs-13 border rounded p-3 mb-3">
              {[
                { label: 'Student', value: `${paidRecord.student} · ${classLabelOf(paidRecord)}` },
                { label: 'Academic Year', value: ACADEMIC_YEAR },
                { label: 'Installment', value: paidRecord.feeNote },
                { label: 'Collected By', value: paidRecord.methodNote },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>

            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Particulars</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fs-13">
                      {paidRecord.feeCategory} · {paidRecord.feeNote.split(' · ')[0]}
                    </td>
                    <td className="text-end fs-13">
                      {rupees(Math.round(grossAnnualOf(paidRecord) / paidRecord.installments))}
                    </td>
                  </tr>
                  {paidRecord.concessionRate ? (
                    <tr>
                      <td className="fs-13">{paidRecord.concessionLabel}</td>
                      <td className="text-end fs-13">
                        − {rupees(Math.round(concessionOf(paidRecord) / paidRecord.installments))}
                      </td>
                    </tr>
                  ) : null}
                  {paidRecord.scholarshipRate ? (
                    <tr>
                      <td className="fs-13">{paidRecord.scholarshipLabel}</td>
                      <td className="text-end fs-13">
                        − {rupees(Math.round(scholarshipOf(paidRecord) / paidRecord.installments))}
                      </td>
                    </tr>
                  ) : null}
                  <tr>
                    <td className="fs-13">Late fine</td>
                    <td className="text-end fs-13">{rupees(fineOf(paidRecord))}</td>
                  </tr>
                  <tr className="fw-semibold">
                    <td className="fs-13">Amount Paid</td>
                    <td className="text-end fs-13">{rupees(paidRecord.paid)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <ul className="list-unstyled fs-13 mb-0">
              {[
                { label: 'Payment Method', value: paidRecord.method },
                { label: 'Paid On', value: paidRecord.receiptDate ?? '—' },
                { label: 'Status', value: statusOf(paidRecord) === 'Paid' ? 'Cleared' : statusOf(paidRecord) },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Modal>

      {/* ---------------------------- Payment Details ---------------------------- */}
      <Modal
        open={active === 'payment' && detail !== null}
        onClose={onClose}
        title="Payment Details"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Receipt opened')}>
              <i className="ti ti-receipt me-1" />
              View Receipt
            </button>
          </>
        }
      >
        {detail ? (
          <>
            <div className="row g-2 text-center mb-3">
              {[
                { label: 'Billed', value: rupees(detail.billed) },
                { label: 'Paid', value: rupees(detail.paid) },
                { label: 'Balance', value: rupees(balanceOf(detail)) },
              ].map((item) => (
                <div className="col-4" key={item.label}>
                  <div className="border rounded py-2">
                    <h6 className="fs-15 mb-0">{item.value}</h6>
                    <span className="fs-12 text-muted">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <ul className="list-unstyled fs-13 border rounded p-3 mb-3">
              {[
                { label: 'Method', value: `${detail.method} · ${detail.methodNote}` },
                { label: 'Receipt', value: detail.receipt ?? 'Not raised' },
                { label: 'Gateway Fee', value: `${rupees(0)} · borne by school` },
                { label: 'Bank Account', value: 'School Current · XXXX 4417' },
              ].map((item) => (
                <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
                  <span className="text-muted">{item.label}</span>
                  <span className="fw-medium">{item.value}</span>
                </li>
              ))}
            </ul>
            <h6 className="fs-14 mb-2">Allocation</h6>
            <div className="table-responsive border rounded mb-0">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Head</th>
                    <th className="text-end">Allocated</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fs-13">
                      {detail.feeCategory} · {detail.feeNote.split(' · ')[0]}
                    </td>
                    <td className="text-end fs-13">{rupees(detail.paid)}</td>
                    <td>
                      <span className={`badge badge-soft-${statusTint[statusOf(detail)]}`}>
                        {statusOf(detail)}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="fs-13">Late fine</td>
                    <td className="text-end fs-13">{rupees(fineOf(detail))}</td>
                    <td className="fs-12 text-muted">
                      {fineOf(detail) === 0 ? 'Not applicable' : `${chargeableDaysOf(detail)} chargeable days`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* -------------------------- Outstanding Details -------------------------- */}
      <Modal
        open={active === 'outstanding' && owing !== null}
        onClose={onClose}
        title="Outstanding Details"
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={() => {
              if (!owing) return;
              onSendReminder(owing.id);
              onClose();
              onToast(`Reminder sent to ${owing.guardian}`);
            }}>
              <i className="ti ti-bell me-1" />
              Send Reminder
            </button>
          </>
        }
      >
        {owing ? (
          <>
            <StudentStrip row={owing} />
            {daysOverdueOf(owing) > 0 ? (
              <div className="alert alert-soft-danger fs-13 d-flex align-items-center gap-2">
                <i className="ti ti-alert-triangle" />
                {daysOverdueOf(owing)} days overdue. A late fine of {rupees(LATE_FEE_PER_DAY)} a day runs from
                the end of the {GRACE_DAYS}-day grace period.
              </div>
            ) : null}

            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Head</th>
                    <th className="text-center">Due Date</th>
                    <th className="text-end">Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {owing.breakdown
                    .filter((line) => line.amount !== null && line.amount > 0)
                    .map((line) => (
                      <tr key={line.label}>
                        <td className="fs-13">{line.label}</td>
                        <td className="text-center fs-13">{owing.extensionTo ?? owing.dueDate}</td>
                        <td className="text-end fs-13">{rupees(line.amount as number)}</td>
                        <td>
                          <span className={`badge badge-soft-${statusTint[statusOf(owing)]}`}>
                            {statusOf(owing)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {fineOf(owing) > 0 ? (
                    <tr>
                      <td className="fs-13">Late fine · {chargeableDaysOf(owing)} chargeable days</td>
                      <td className="text-center fs-13">Accruing</td>
                      <td className="text-end fs-13">{rupees(fineOf(owing))}</td>
                      <td>
                        <span className="badge badge-soft-warning">Accruing</span>
                      </td>
                    </tr>
                  ) : null}
                  <tr className="fw-semibold">
                    <td className="fs-13" colSpan={2}>
                      Total Payable
                    </td>
                    <td className="text-end fs-13">{rupees(totalPayableOf(owing))}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row g-3">
              <Field label="Reminder Channel">
                <Select options={['SMS and email', 'Email only', 'SMS only', 'Phone call · log manually']} />
              </Field>
              <Field label="Follow Up By">
                <DateField value="07-08-2026" onChange={() => undefined} format="d-m-Y" id="fc-followup" />
              </Field>
              <Field label="Reminder Note" span="col-12">
                <textarea
                  className="form-control"
                  rows={2}
                  value={reminderNote}
                  onChange={(event) => setReminderNote(event.target.value)}
                  placeholder={`Balance of ${rupees(totalPayableOf(owing))} outstanding on ${owing.feeCategory}.`}
                />
              </Field>
              <div className="col-12">
                <Switch id="fc-rm-statement" label="Attach the outstanding statement" on />
                <Switch id="fc-rm-link" label="Include an online payment link" on />
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* ----------------------------- Student Ledger ---------------------------- */}
      <Modal
        open={active === 'ledger' && detail !== null}
        onClose={onClose}
        title={detail?.student ?? 'Ledger'}
        dialogClassName="modal-lg"
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={confirm('Ledger exported')}>
              <i className="ti ti-file-export me-1" />
              Export Ledger
            </button>
          </>
        }
      >
        {detail ? (
          <>
            <p className="fs-12 text-muted mb-3">
              {detail.admission} · {classLabelOf(detail)} · Fee ledger {ACADEMIC_YEAR}
            </p>
            <div className="row g-2 text-center mb-3">
              {[
                { label: 'Annual Fee', value: rupees(annualFeeOf(detail)) },
                { label: 'Paid', value: rupees(paidToDateOf(detail)) },
                { label: 'Balance', value: rupees(futureInstallmentsOf(detail) + balanceOf(detail)) },
                { label: 'Overdue', value: rupees(daysOverdueOf(detail) > 0 ? balanceOf(detail) : 0) },
              ].map((item) => (
                <div className="col-6 col-md-3" key={item.label}>
                  <div className="border rounded py-2">
                    <h6 className="fs-15 mb-0">{item.value}</h6>
                    <span className="fs-12 text-muted">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <h6 className="fs-14 mb-2">Ledger Entries</h6>
            <div className="table-responsive border rounded mb-3">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Particulars</th>
                    <th>Receipt</th>
                    <th className="text-end">Debit</th>
                    <th className="text-end">Credit</th>
                    <th className="text-end">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    /* The ledger is posted, not written: raise, credit, then pay. */
                    let running = grossAnnualOf(detail);
                    const lines: {
                      date: string;
                      what: string;
                      receipt: string;
                      debit: number | null;
                      credit: number | null;
                      balance: number;
                    }[] = [
                      {
                        date: '1 Apr 2026',
                        what: 'Annual fee raised',
                        receipt: '—',
                        debit: grossAnnualOf(detail),
                        credit: null,
                        balance: running,
                      },
                    ];
                    if (concessionOf(detail) > 0) {
                      running -= concessionOf(detail);
                      lines.push({
                        date: '1 Apr 2026',
                        what: detail.concessionLabel ?? 'Concession',
                        receipt: '—',
                        debit: null,
                        credit: concessionOf(detail),
                        balance: running,
                      });
                    }
                    [...detail.payments].reverse().forEach((payment) => {
                      running -= payment.amount;
                      lines.push({
                        date: payment.date,
                        what: `Payment · ${payment.method}`,
                        receipt: payment.receipt ?? '—',
                        debit: null,
                        credit: payment.amount,
                        balance: running,
                      });
                    });
                    return lines.map((line) => (
                      <tr key={`${line.date}-${line.what}`}>
                        <td className="fs-13 text-nowrap">{line.date}</td>
                        <td className="fs-13">{line.what}</td>
                        <td className="fs-12 text-muted">{line.receipt}</td>
                        <td className="text-end fs-13">{line.debit === null ? '—' : rupees(line.debit)}</td>
                        <td className="text-end fs-13">{line.credit === null ? '—' : rupees(line.credit)}</td>
                        <td className="text-end fs-13">{rupees(line.balance)}</td>
                      </tr>
                    ));
                  })()}
                  <tr className="fw-semibold">
                    <td className="fs-13" colSpan={5}>
                      Closing Balance · {REGISTER_DATE}
                    </td>
                    <td className="text-end fs-13">
                      {rupees(annualFeeOf(detail) - paidToDateOf(detail))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h6 className="fs-14 mb-2">Installment Schedule</h6>
            <div className="table-responsive border rounded mb-0">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Installment</th>
                    <th className="text-center">Due Date</th>
                    <th className="text-end">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.schedule.map((item) => (
                    <tr key={`${item.label}-${item.due}`}>
                      <td className="fs-13">{item.label}</td>
                      <td className="text-center fs-13">{item.due}</td>
                      <td className="text-end fs-13">{rupees(item.amount)}</td>
                      <td>
                        <span className="badge badge-soft-secondary">{item.state}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </Modal>

      {/* -------------------------- Revenue Analysis panel ----------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Revenue Analysis"
        className="offcanvas-lg"
        titleAccessory={
          <span className="fs-12 text-muted">
            {REPORT_RANGE.replace(' - ', ' – ')} · {ACADEMIC_YEAR} · {rows.length} records
          </span>
        }
      >
        <h6 className="fs-14 mb-2">Collection Performance</h6>
        <ul className="list-unstyled fs-13 mb-4">
          {[
            { label: 'Billed', value: shortRupees(totals.billed) },
            { label: 'Collected', value: shortRupees(totals.collected) },
            { label: 'Rate', value: totals.rate === null ? '—' : `${totals.rate}%` },
            { label: 'Outstanding', value: shortRupees(totals.outstanding) },
            {
              label: 'Records With A Balance',
              value: `${rows.filter((item) => balanceOf(item) > 0).length} of ${rows.length}`,
            },
          ].map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
              <span className="text-muted">{item.label}</span>
              <span className="fw-medium">{item.value}</span>
            </li>
          ))}
        </ul>

        <h6 className="fs-14 mb-2">Outstanding Analysis</h6>
        <ul className="list-unstyled mb-4">
          {outstandingBands
            .filter((band) => band.amount > 0)
            .map((band) => (
              <li className="mb-3" key={band.band}>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-13">{band.band}</span>
                  <span className="fs-12 text-muted">
                    {shortRupees(band.amount)} · {band.share}%
                  </span>
                </div>
                <div className="meter meter-primary">
                  <span style={{ width: `${band.share}%` }} />
                </div>
              </li>
            ))}
          {outstandingBands.every((band) => band.amount === 0) ? (
            <li className="fs-13 text-muted">Nothing is outstanding on this report.</li>
          ) : null}
        </ul>

        <h6 className="fs-14 mb-2">Class-wise Collections</h6>
        <div className="table-responsive border rounded mb-4">
          <table className="table table-sm align-middle mb-0">
            <thead>
              <tr>
                <th>Class</th>
                <th className="text-end">Billed</th>
                <th className="text-end">Collected</th>
                <th className="text-center">Rate</th>
              </tr>
            </thead>
            <tbody>
              {classRows.map((item) => (
                <tr key={item.className}>
                  <td className="fs-13">{item.className}</td>
                  <td className="text-end fs-13">{shortRupees(item.billed)}</td>
                  <td className="text-end fs-13">{shortRupees(item.collected)}</td>
                  <td className="text-center fs-13">{item.rate === null ? '—' : `${item.rate}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h6 className="fs-14 mb-2">Fee Category Analysis</h6>
        <ul className="list-unstyled fs-13 mb-0">
          {categoryRows.map((item) => (
            <li className="d-flex align-items-center justify-content-between py-1" key={item.category}>
              <span>{item.category}</span>
              <span className="fw-medium">
                {shortRupees(item.billed)}
                <span className="text-muted ms-1">· {item.rate === null ? '—' : `${item.rate}%`}</span>
              </span>
            </li>
          ))}
        </ul>
      </Offcanvas>
    </>
  );
};

export default FeeModals;
