import type { LineItem, SalaryStructure } from '../data/salaryStructure.data';
import { ActionLink } from '@components/workspace';
import {
  grossSalary,
  money,
  netSalary,
  statusPill,
  totalDeductions,
  totalEarnings,
} from '../data/salaryStructure.data';

export interface StructureRowProps {
  structure: SalaryStructure;
  expanded: boolean;
  onToggleExpand: () => void;
  selected: boolean;
  onToggleSelect: () => void;
  onView: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
}

const AmountList = ({ items }: { items: LineItem[] }) => (
  <>
    {items.map((item, index) => (
      <div
        className={`d-flex align-items-center justify-content-between${index === items.length - 1 ? '' : ' mb-2'}`}
        key={item.label}
      >
        <span className="fs-13 text-muted">{item.label}</span>
        <span className="fs-13 fw-medium">{money(item.amount)}</span>
      </div>
    ))}
  </>
);

const StructureRow = ({
  structure,
  expanded,
  onToggleExpand,
  selected,
  onToggleSelect,
  onView,
  onEdit,
  onDuplicate,
  onArchive,
}: StructureRowProps) => {
  const detailId = `sd_${structure.code.replace('SS-', '')}`;

  return (
    <>
      <tr className="dt-row">
        <td className="dt-pin">
          <input
            type="checkbox"
            className="dt-check"
            aria-label={`Select ${structure.name}`}
            checked={selected}
            onChange={onToggleSelect}
          />
        </td>
        <td>
          <button
            type="button"
            className="dt-expand"
            aria-expanded={expanded}
            aria-controls={detailId}
            aria-label="Toggle breakdown"
            onClick={onToggleExpand}
          >
            <i className="ti ti-chevron-right" />
          </button>
        </td>
        <td>
          <div className="dt-user">
            <span className={`avatar avatar-sm bg-${structure.tint}-transparent text-${structure.tint} rounded me-2`}>
              <i className="ti ti-briefcase" />
            </span>
            <div>
              <ActionLink
                className="dt-name"
                onClick={onView}
              >
                {structure.name}
              </ActionLink>
              <div className="dt-sub">
                {structure.code}
                <span className="dt-dot">•</span>
                {structure.frequency}
              </div>
            </div>
          </div>
        </td>
        <td>{structure.category}</td>
        <td>{structure.department}</td>
        <td className="text-end">{money(structure.basic)}</td>
        <td className="text-end text-success">+{money(totalEarnings(structure))}</td>
        <td className="text-end text-danger">−{money(totalDeductions(structure))}</td>
        <td className="text-end">{money(grossSalary(structure))}</td>
        <td className="text-end fw-medium">{money(netSalary(structure))}</td>
        <td>{structure.effectiveFrom}</td>
        <td>
          <span className={`dt-pill ${statusPill[structure.status]}`}>
            <span className="dt-pill-dot" />
            {structure.status}
          </span>
        </td>
        <td className="fs-13 text-muted">{structure.lastUpdated}</td>
        <td>
          <div className="dt-actions">
            <ActionLink
              className="dt-ib"
              ariaLabel="View breakdown"
              onClick={onView}
            >
              <i className="ti ti-eye" />
            </ActionLink>
            <ActionLink
              className="dt-ib"
              ariaLabel="Edit"
              onClick={onEdit}
            >
              <i className="ti ti-edit" />
            </ActionLink>
            <ActionLink
              className="dt-ib"
              ariaLabel="Duplicate"
              onClick={onDuplicate}
            >
              <i className="ti ti-copy" />
            </ActionLink>
            <ActionLink
              className="dt-ib danger"
              ariaLabel="Archive"
              onClick={onArchive}
            >
              <i className="ti ti-archive" />
            </ActionLink>
          </div>
        </td>
      </tr>

      <tr className="dt-detail">
        <td colSpan={14}>
          <div className={`collapse${expanded ? ' show' : ''}`} id={detailId}>
            <div className="p-4">
              <div className="row g-4">
                <div className="col-xl-4 col-md-6">
                  <h4 className="fs-14 mb-3 fw-medium">
                    <i className="ti ti-trending-up text-success me-1" />
                    Earnings Breakdown
                  </h4>
                  <AmountList items={structure.earnings} />
                </div>
                <div className="col-xl-4 col-md-6">
                  <h5 className="fs-14 mb-3">
                    <i className="ti ti-trending-down text-danger me-1" />
                    Deduction Breakdown
                  </h5>
                  <AmountList items={structure.deductions} />
                </div>
                {structure.employer.length > 0 ? (
                  <div className="col-xl-4 col-md-6">
                    <h6 className="fs-14 mb-3">
                      <i className="ti ti-building-bank text-info me-1" />
                      Employer Contributions
                    </h6>
                    <AmountList items={structure.employer} />
                  </div>
                ) : null}
                <div className="col-xl-4 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-id-badge-2 text-primary me-1" />
                    Applicable Designations
                  </h6>
                  <div className="d-flex flex-wrap gap-1">
                    {structure.designations.map((designation) => (
                      <span className="badge badge-soft-primary fs-10" key={designation}>
                        {designation}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-xl-4 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-calendar-repeat text-purple me-1" />
                    Payroll Frequency
                  </h6>
                  <p className="fs-13 mb-1">{structure.frequencyNote}</p>
                  <p className="fs-12 text-muted mb-0">{structure.frequencySub}</p>
                </div>
                <div className="col-xl-4 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-note text-warning me-1" />
                    Salary Notes
                  </h6>
                  <p className="fs-13 mb-0">{structure.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default StructureRow;
