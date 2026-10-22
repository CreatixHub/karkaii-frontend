import { useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import type { SalaryStructure, StructureStatus } from '../data/salaryStructure.data';
import {
  formCategoryOptions,
  formDepartmentOptions,
  formFrequencyOptions,
  formStatusOptions,
  grossSalary,
  money,
  netSalary,
  totalDeductions,
  totalEarnings,
} from '../data/salaryStructure.data';

export type StructureModalId = 'add' | 'edit' | 'view' | 'duplicate';

export interface StructureDraft {
  name: string;
  code: string;
  category: string;
  department: string;
  basic: string;
  earnings: string;
  deductions: string;
  frequency: string;
  effectiveFrom: string;
  status: StructureStatus;
  notes: string;
}

export const emptyDraft: StructureDraft = {
  name: '',
  code: '',
  category: formCategoryOptions[0],
  department: formDepartmentOptions[0],
  basic: '',
  earnings: '',
  deductions: '',
  frequency: formFrequencyOptions[0],
  effectiveFrom: '',
  status: 'Active',
  notes: '',
};

export const draftFrom = (structure: SalaryStructure): StructureDraft => ({
  name: structure.name,
  code: structure.code,
  category: structure.category,
  department: structure.department,
  basic: String(structure.basic),
  earnings: String(totalEarnings(structure)),
  deductions: String(totalDeductions(structure)),
  frequency: structure.frequency,
  effectiveFrom: structure.effectiveFrom,
  status: structure.status,
  notes: structure.notes,
});

export interface StructureModalsProps {
  active: StructureModalId | null;
  structure: SalaryStructure | null;
  onClose: () => void;
  onCreate: (draft: StructureDraft) => void;
  onUpdate: (draft: StructureDraft) => void;
  onDuplicate: (name: string, code: string) => void;
}

interface FormProps {
  draft: StructureDraft;
  onChange: (patch: Partial<StructureDraft>) => void;
  suffix: string;
}

const StructureForm = ({ draft, onChange, suffix }: FormProps) => {
  const text = (
    key: keyof StructureDraft,
    label: string,
    placeholder?: string,
    className = 'col-md-6',
  ) => (
    <div className={className}>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${String(key)}${suffix}`}>
          {label}
        </label>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          id={`${String(key)}${suffix}`}
          value={draft[key] as string}
          onChange={(event) => onChange({ [key]: event.target.value } as Partial<StructureDraft>)}
        />
      </div>
    </div>
  );

  const select = (key: keyof StructureDraft, label: string, options: string[]) => (
    <div className="col-md-6">
      <div className="mb-3">
        <label className="form-label" htmlFor={`${String(key)}${suffix}`}>
          {label}
        </label>
        <select
          className="form-select"
          id={`${String(key)}${suffix}`}
          value={draft[key] as string}
          onChange={(event) => onChange({ [key]: event.target.value } as Partial<StructureDraft>)}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="row">
      {text('name', 'Structure Name', 'e.g. Senior Teacher Grade I')}
      {text('code', 'Structure Code', 'SS-006')}
      {select('category', 'Employee Category', formCategoryOptions)}
      {select('department', 'Department', formDepartmentOptions)}
      {text('basic', 'Basic Salary', '0.00')}
      {text('earnings', 'Total Earnings', '0.00')}
      {text('deductions', 'Total Deductions', '0.00')}
      {select('frequency', 'Payroll Frequency', formFrequencyOptions)}
      {text('effectiveFrom', 'Effective From', '01 Apr 2026')}
      {select('status', 'Status', formStatusOptions)}
      <div className="col-md-12">
        <div className="mb-0">
          <label className="form-label" htmlFor={`notes${suffix}`}>
            Salary Notes
          </label>
          <textarea
            className="form-control"
            rows={2}
            placeholder="Optional notes shown on the structure breakdown"
            id={`notes${suffix}`}
            value={draft.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

const StructureModals = ({
  active,
  structure,
  onClose,
  onCreate,
  onUpdate,
  onDuplicate,
}: StructureModalsProps) => {
  const [addDraft, setAddDraft] = useState<StructureDraft>(emptyDraft);
  const [editDraft, setEditDraft] = useState<StructureDraft>(emptyDraft);
  const [dupName, setDupName] = useState('');
  const [dupCode, setDupCode] = useState('');

  useEffect(() => {
    if (active === 'add') setAddDraft(emptyDraft);
  }, [active]);

  useEffect(() => {
    if (active === 'edit' && structure) setEditDraft(draftFrom(structure));
  }, [active, structure]);

  useEffect(() => {
    if (active === 'duplicate' && structure) {
      setDupName(`${structure.name} (Copy)`);
      setDupCode('');
    }
  }, [active, structure]);

  const footer = (label: string) => (
    <>
      <button type="button" className="btn btn-light me-2" onClick={onClose}>
        Cancel
      </button>
      <button type="submit" className="btn btn-primary">
        {label}
      </button>
    </>
  );

  return (
    <>
      {/* Add Salary Structure */}
      <Modal
        open={active === 'add'}
        onClose={onClose}
        title="Add Salary Structure"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate(addDraft);
        }}
        footer={footer('Add Structure')}
      >
        <StructureForm
          draft={addDraft}
          onChange={(patch) => setAddDraft((current) => ({ ...current, ...patch }))}
          suffix=""
        />
      </Modal>

      {/* Edit Salary Structure */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Salary Structure"
        dialogClassName="modal-lg"
        onSubmit={(event) => {
          event.preventDefault();
          onUpdate(editDraft);
        }}
        footer={footer('Save Changes')}
      >
        <StructureForm
          draft={editDraft}
          onChange={(patch) => setEditDraft((current) => ({ ...current, ...patch }))}
          suffix="-2"
        />
      </Modal>

      {/* View Breakdown */}
      <Modal
        open={active === 'view' && structure !== null}
        onClose={onClose}
        title="Salary Breakdown"
        dialogClassName="modal-lg"
        footer={
          <button type="button" className="btn btn-light" onClick={onClose}>
            Close
          </button>
        }
      >
        {structure ? (
          <>
            <div className="d-flex align-items-center mb-3 pb-3 border-bottom">
              <span
                className={`avatar avatar-lg bg-${structure.tint}-transparent text-${structure.tint} rounded me-3`}
              >
                <i className="ti ti-briefcase fs-20" />
              </span>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h5 className="mb-0">{structure.name}</h5>
                  <span className="badge badge-soft-bordered">{structure.code}</span>
                </div>
                <p className="mb-0 text-muted fs-13">
                  {structure.category} · {structure.department} · {structure.frequency}
                </p>
              </div>
            </div>

            <div className="row g-3 mb-3">
              {[
                { label: 'Basic Salary', value: money(structure.basic), tone: '' },
                { label: 'Earnings', value: `+${money(totalEarnings(structure))}`, tone: 'text-success' },
                { label: 'Deductions', value: `−${money(totalDeductions(structure))}`, tone: 'text-danger' },
                { label: 'Net Salary', value: money(netSalary(structure)), tone: 'fw-medium' },
              ].map((tile) => (
                <div className="col-6 col-md-3" key={tile.label}>
                  <div className="border rounded p-3 text-center h-100">
                    <p className="fs-12 text-muted mb-1">{tile.label}</p>
                    <h6 className={`mb-0 ${tile.tone}`}>{tile.value}</h6>
                  </div>
                </div>
              ))}
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <h6 className="fs-14 mb-3">
                  <i className="ti ti-trending-up text-success me-1" />
                  Earnings
                </h6>
                {structure.earnings.map((item) => (
                  <div className="d-flex align-items-center justify-content-between mb-2" key={item.label}>
                    <span className="fs-13 text-muted">{item.label}</span>
                    <span className="fs-13 fw-medium">{money(item.amount)}</span>
                  </div>
                ))}
                <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
                  <span className="fs-13 fw-medium">Gross Salary</span>
                  <span className="fs-13 fw-medium">{money(grossSalary(structure))}</span>
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-14 mb-3">
                  <i className="ti ti-trending-down text-danger me-1" />
                  Deductions
                </h6>
                {structure.deductions.map((item) => (
                  <div className="d-flex align-items-center justify-content-between mb-2" key={item.label}>
                    <span className="fs-13 text-muted">{item.label}</span>
                    <span className="fs-13 fw-medium">{money(item.amount)}</span>
                  </div>
                ))}
                <div className="d-flex align-items-center justify-content-between border-top pt-2 mt-2">
                  <span className="fs-13 fw-medium">Net Salary</span>
                  <span className="fs-13 fw-medium">{money(netSalary(structure))}</span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </Modal>

      {/* Duplicate Structure */}
      <Modal
        open={active === 'duplicate' && structure !== null}
        onClose={onClose}
        title="Duplicate Structure"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate(dupName, dupCode);
        }}
        footer={footer('Duplicate')}
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="new-structure-name">
            New Structure Name
          </label>
          <input
            type="text"
            className="form-control"
            id="new-structure-name"
            value={dupName}
            onChange={(event) => setDupName(event.target.value)}
          />
        </div>
        <div className="mb-0">
          <label className="form-label" htmlFor="new-structure-code">
            New Structure Code
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="SS-006"
            id="new-structure-code"
            value={dupCode}
            onChange={(event) => setDupCode(event.target.value)}
          />
        </div>
      </Modal>
    </>
  );
};

export default StructureModals;
