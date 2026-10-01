import { Fragment, useEffect, useState } from 'react';
import Modal from '@components/ui/Modal';
import Offcanvas from '@components/ui/Offcanvas';
import DateField from '@components/ui/DateField';
import { ActionLink } from '@components/workspace';
import type { Template } from '../data/templates.data';
import {
  ACADEMIC_YEAR,
  assignmentOptions,
  auditOf,
  BAND_COLOURS,
  BARCODE_OPTIONS,
  cardSizeOptions,
  componentsLabelOf,
  EDITORS,
  EFFECTIVE_FROM,
  LOGO_PLACEMENTS,
  orientationOptions,
  perSheetOf,
  photographFrameOf,
  QR_OPTIONS,
  RECIPIENT_GROUPS,
  recipientTypeOptions,
  REVERSE_FIELDS,
  SECONDARY_FIELDS,
  sheetRunOf,
  sidesOf,
  sizeOf,
  templateOptions,
  tintOf,
  updatedByOf,
  versionOf,
  WATERMARKS,
  lastUpdatedOf,
} from '../data/templates.data';

export type TemplateModalId =
  | 'create'
  | 'edit'
  | 'duplicate'
  | 'preview'
  | 'default'
  | 'assign'
  | 'view';

export interface TemplateModalsProps {
  active: TemplateModalId | null;
  onClose: () => void;
  row: Template | null;
  panelOpen: boolean;
  onClosePanel: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
}

/* ----------------------------- Small helpers ----------------------------- */

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

const Select = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map((option) => (
      <option key={option}>{option}</option>
    ))}
  </select>
);

const Row = ({
  label,
  value,
  last = false,
}: {
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{label}</span>
    <span className="fs-13 fw-medium text-end">{value}</span>
  </div>
);

const Tile = ({
  title,
  note,
  icon,
  tint,
}: {
  title: string;
  note: string;
  icon: string;
  tint: string;
}) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
    <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded flex-shrink-0`}>
      <i className={icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h6 className="fs-13 mb-0 text-truncate">{title}</h6>
      <span className="fs-12 text-muted text-truncate d-block">{note}</span>
    </div>
  </div>
);

/** The bordered template card each dialog opens on. */
const TemplateCard = ({
  row,
  rows,
}: {
  row: Template;
  rows: { label: string; value: string }[];
}) => (
  <div className="border rounded p-3 mb-3">
    <div className="d-flex align-items-center mb-3">
      <span
        className={`avatar avatar-md bg-${tintOf(row)}-transparent text-${tintOf(row)} rounded flex-shrink-0`}
      >
        <i className={row.orientation === 'Portrait' ? 'ti ti-id' : 'ti ti-credit-card'} />
      </span>
      <div className="ms-2">
        <h5 className="fs-14 mb-0">{row.name}</h5>
        <span className="fs-12 text-muted">
          {row.code} · {versionOf(row)} · {row.orientation}
        </span>
      </div>
    </div>
    {rows.map((entry, index) => (
      <Row
        key={entry.label}
        label={entry.label}
        value={entry.value}
        last={index === rows.length - 1}
      />
    ))}
  </div>
);

const Footer = ({ icon, label, onClose }: { icon: string; label: string; onClose: () => void }) => (
  <>
    <ActionLink className="btn btn-light me-2" onClick={onClose}>
      Cancel
    </ActionLink>
    <button type="submit" className="btn btn-primary d-inline-flex align-items-center">
      <i className={`${icon} me-1`} />
      {label}
    </button>
  </>
);

const useForm = <T extends Record<string, string>>(defaults: T, open: boolean) => {
  const [values, setValues] = useState<T>(defaults);
  const initial = JSON.stringify(defaults);

  useEffect(() => {
    if (open) setValues(JSON.parse(initial) as T);
  }, [open, initial]);

  const set = (key: keyof T) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return [values, set] as const;
};

const Segment = ({
  name,
  label,
  options,
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="custom-btn-group custom-btn-group-fill mb-3" role="group" aria-label={label}>
    {options.map((option) => {
      const id = `${name}-${option.replace(/\s+/g, '-').toLowerCase()}`;
      return (
        <Fragment key={option}>
          <input
            type="radio"
            className="btn-check"
            name={name}
            id={id}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <label className="btn" htmlFor={id}>
            {option}
          </label>
        </Fragment>
      );
    })}
  </div>
);

const Check = ({
  id,
  label,
  checked,
  onChange,
  last = false,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  last?: boolean;
}) => (
  <div className={`form-check ${last ? 'mb-0' : 'mb-2'}`}>
    <input
      className="form-check-input"
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <label className="form-check-label fs-13" htmlFor={id}>
      {label}
    </label>
  </div>
);

/* -------------------------------- Dialogs -------------------------------- */

const TemplateModals = ({
  active,
  onClose,
  row,
  panelOpen,
  onClosePanel,
  onToast,
}: TemplateModalsProps) => {
  const submit = (message: string) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast(message, 'success');
    onClose();
  };

  const [flags, setFlags] = useState<Record<string, boolean>>({
    publishNow: false,
    paperProof: true,
    recordRevision: true,
    saveDraft: true,
    carryHistory: false,
    keepPrinted: true,
    tellOffice: true,
    proofFirst: true,
    alsoDefault: false,
  });
  const toggle = (key: string) => () => setFlags((current) => ({ ...current, [key]: !current[key] }));

  const editing = active === 'edit';

  const [layout, setLayout] = useForm(
    {
      orientation: row?.orientation ?? orientationOptions[0],
      code: editing ? (row?.code ?? '') : '',
      name: editing ? (row?.name ?? '') : '',
      recipientType: row?.recipientType ?? recipientTypeOptions[0],
      size: row?.size ?? cardSizeOptions[0],
      band: row?.band ?? BAND_COLOURS[0],
      photograph: row ? photographFrameOf(row) : '',
      nameBlock: row?.components[1]?.place ?? '',
      secondary: SECONDARY_FIELDS[0],
      reverse: REVERSE_FIELDS[0],
      logo: LOGO_PLACEMENTS[0],
      watermark: row?.watermark ?? WATERMARKS[0],
      qr: row?.qr ?? QR_OPTIONS[0],
      barcode: row?.barcode ?? BARCODE_OPTIONS[0],
      encoded: row?.encoded ?? '',
      version: row ? versionOf(row) : 'v1.0',
      lastUpdated: EFFECTIVE_FROM,
      updatedBy: EDITORS[1],
      changeNote: '',
      notes: editing ? (row?.notes ?? '') : '',
    },
    active === 'create' || active === 'edit',
  );

  const [duplicate, setDuplicate] = useForm(
    {
      scope: 'Full Layout',
      source: row ? `${row.code} · ${row.name}` : templateOptions[0],
      name: row ? `${row.name} copy` : '',
      version: 'v0.1',
      recipientType: row?.recipientType ?? recipientTypeOptions[0],
      size: row?.size ?? cardSizeOptions[0],
      why: 'Starting point for a revised layout. The original stays published and in use.',
    },
    active === 'duplicate',
  );

  const [defaults, setDefaults] = useForm(
    {
      template: row ? `${row.code} · ${row.name}` : templateOptions[0],
      group: RECIPIENT_GROUPS[0],
      effectiveFrom: EFFECTIVE_FROM,
      reason:
        'New default for the group. Existing printed cards keep the template they were printed with.',
    },
    active === 'default',
  );

  const [assign, setAssign] = useForm(
    {
      by: 'Class',
      template: row ? `${row.code} · ${row.name}` : templateOptions[0],
      target: row?.assignedTo ?? assignmentOptions[0],
      effectiveFrom: EFFECTIVE_FROM,
      assignedBy: EDITORS[0],
      applyTo: 'New cards only',
      notes:
        'Applies to cards generated from the effective date. Existing cards are untouched until they are reprinted.',
    },
    active === 'assign',
  );

  return (
    <>
      {/* --------------------------- Create / Edit --------------------------- */}
      <Modal
        open={active === 'create' || active === 'edit'}
        onClose={onClose}
        title={editing ? 'Edit Template' : 'Create Template'}
        subtitle={
          editing && row
            ? `${row.code} • ${row.name} • ${versionOf(row)} ${row.status.toLowerCase()}`
            : 'Lay out a new card design and save it as a draft'
        }
        headerAvatar={{ icon: editing ? 'ti ti-edit' : 'ti ti-layout', tint: 'primary' }}
        dialogClassName="modal-lg"
        onSubmit={submit(editing ? 'Template saved as a new revision.' : 'Template created as a draft.')}
        footer={
          <Footer
            icon={editing ? 'ti ti-check' : 'ti ti-plus'}
            label={editing ? 'Save Changes' : 'Create Template'}
            onClose={onClose}
          />
        }
      >
        {editing ? (
          <p className="fs-13 text-muted">
            Saving a change to a published template creates a new version. Cards already printed
            keep the version they were printed with.
          </p>
        ) : (
          <>
            <p className="mb-2 fs-13 text-muted">Orientation</p>
            <Segment
              name="tpl-orientation"
              label="Orientation"
              options={orientationOptions}
              value={layout.orientation}
              onChange={setLayout('orientation')}
            />
          </>
        )}
        <div className="row g-3">
          <Field label="Template Code">
            <input
              type="text"
              className="form-control"
              value={layout.code}
              onChange={(event) => setLayout('code')(event.target.value)}
              placeholder="Generated on save"
            />
          </Field>
          <Field label="Template Name">
            <input
              type="text"
              className="form-control"
              value={layout.name}
              onChange={(event) => setLayout('name')(event.target.value)}
            />
          </Field>
          <Field label="Recipient Type" span="col-md-4">
            <Select
              value={layout.recipientType}
              onChange={setLayout('recipientType')}
              options={recipientTypeOptions}
            />
          </Field>
          <Field label="Card Size" span="col-md-4">
            <Select value={layout.size} onChange={setLayout('size')} options={cardSizeOptions} />
          </Field>
          <Field label="Band Colour" span="col-md-4">
            <Select value={layout.band} onChange={setLayout('band')} options={BAND_COLOURS} />
          </Field>

          <div className="col-12">
            <h6 className="fs-14 mb-2">Layout</h6>
          </div>
          <Field label="Photograph Frame">
            <input
              type="text"
              className="form-control"
              value={layout.photograph}
              onChange={(event) => setLayout('photograph')(event.target.value)}
            />
          </Field>
          <Field label="Name Block">
            <input
              type="text"
              className="form-control"
              value={layout.nameBlock}
              onChange={(event) => setLayout('nameBlock')(event.target.value)}
            />
          </Field>
          <Field label="Secondary Field">
            <Select
              value={layout.secondary}
              onChange={setLayout('secondary')}
              options={SECONDARY_FIELDS}
            />
          </Field>
          <Field label="Reverse Face">
            <Select value={layout.reverse} onChange={setLayout('reverse')} options={REVERSE_FIELDS} />
          </Field>

          <div className="col-12">
            <h6 className="fs-14 mb-2">Branding &amp; Codes</h6>
          </div>
          <Field label="Logo Placement">
            <Select value={layout.logo} onChange={setLayout('logo')} options={LOGO_PLACEMENTS} />
          </Field>
          <Field label="Watermark">
            <Select value={layout.watermark} onChange={setLayout('watermark')} options={WATERMARKS} />
          </Field>
          <Field label="QR Code">
            <Select value={layout.qr} onChange={setLayout('qr')} options={QR_OPTIONS} />
          </Field>
          <Field label="Barcode">
            <Select value={layout.barcode} onChange={setLayout('barcode')} options={BARCODE_OPTIONS} />
          </Field>
          <Field label="Encoded Data" span="col-12">
            <input
              type="text"
              className="form-control"
              value={layout.encoded}
              onChange={(event) => setLayout('encoded')(event.target.value)}
            />
          </Field>

          <div className="col-12">
            <h6 className="fs-14 mb-2">Publishing</h6>
          </div>
          <Field label="Version" span="col-md-4">
            <input
              type="text"
              className="form-control"
              value={layout.version}
              onChange={(event) => setLayout('version')(event.target.value)}
            />
          </Field>
          <Field label="Last Updated" span="col-md-4">
            <DateField value={layout.lastUpdated} onChange={setLayout('lastUpdated')} />
          </Field>
          <Field label="Updated By" span="col-md-4">
            <Select value={layout.updatedBy} onChange={setLayout('updatedBy')} options={EDITORS} />
          </Field>
          <Field label="Change Note" span="col-12">
            <input
              type="text"
              className="form-control"
              value={layout.changeNote}
              onChange={(event) => setLayout('changeNote')(event.target.value)}
            />
          </Field>
          <Field label="Internal Notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={layout.notes}
              onChange={(event) => setLayout('notes')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            {editing ? (
              <Check
                id="tpl-record"
                label="Record this revision on the version history"
                checked={flags.recordRevision}
                onChange={toggle('recordRevision')}
                last
              />
            ) : (
              <>
                <Check
                  id="tpl-publish"
                  label="Publish straight away rather than saving as a draft"
                  checked={flags.publishNow}
                  onChange={toggle('publishNow')}
                />
                <Check
                  id="tpl-proof"
                  label="Print a paper proof before assigning any records"
                  checked={flags.paperProof}
                  onChange={toggle('paperProof')}
                  last
                />
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* ----------------------------- Duplicate ----------------------------- */}
      <Modal
        open={active === 'duplicate'}
        onClose={onClose}
        title="Duplicate Template"
        onSubmit={submit('Template duplicated. The copy opens as a draft.')}
        footer={<Footer icon="ti ti-copy" label="Duplicate Template" onClose={onClose} />}
      >
        {row ? (
          <TemplateCard
            row={row}
            rows={[
              { label: 'Cards', value: String(row.cards) },
              { label: 'Card Size', value: row.size },
              { label: 'Components', value: componentsLabelOf(row) },
              { label: 'Copies Everything Except', value: 'Assignments and default flag' },
            ]}
          />
        ) : null}
        <p className="mb-2 fs-13 text-muted">Copy scope</p>
        <Segment
          name="dup-scope"
          label="Copy scope"
          options={['Full Layout', 'Front Face Only', 'Branding Only']}
          value={duplicate.scope}
          onChange={setDuplicate('scope')}
        />
        <div className="row g-3">
          <Field label="Template to Copy" span="col-12">
            <Select
              value={duplicate.source}
              onChange={setDuplicate('source')}
              options={templateOptions}
            />
          </Field>
          <Field label="New Template Name">
            <input
              type="text"
              className="form-control"
              value={duplicate.name}
              onChange={(event) => setDuplicate('name')(event.target.value)}
            />
          </Field>
          <Field label="New Version">
            <input
              type="text"
              className="form-control"
              value={duplicate.version}
              onChange={(event) => setDuplicate('version')(event.target.value)}
            />
          </Field>
          <Field label="Recipient Type">
            <Select
              value={duplicate.recipientType}
              onChange={setDuplicate('recipientType')}
              options={recipientTypeOptions}
            />
          </Field>
          <Field label="Card Size">
            <Select
              value={duplicate.size}
              onChange={setDuplicate('size')}
              options={cardSizeOptions}
            />
          </Field>
          <Field label="Why This Copy" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={duplicate.why}
              onChange={(event) => setDuplicate('why')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="dup-draft"
              label="Save the copy as a draft"
              checked={flags.saveDraft}
              onChange={toggle('saveDraft')}
            />
            <Check
              id="dup-history"
              label="Carry the original version history across"
              checked={flags.carryHistory}
              onChange={toggle('carryHistory')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Preview ------------------------------ */}
      <Modal
        open={active === 'preview'}
        onClose={onClose}
        title="Preview Template"
        dialogClassName="modal-lg"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Close
            </ActionLink>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              onClick={() => {
                onToast('Opening the assignment for this template');
                onClose();
              }}
            >
              <i className="ti ti-users me-1" />
              Assign This Template
            </button>
          </>
        }
      >
        {row ? (
          <>
            <div className="row g-3">
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Front Face</h6>
                <div className="border rounded p-3">
                  <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                    <span
                      className={`avatar avatar-md bg-${tintOf(row)}-transparent text-${tintOf(row)} rounded flex-shrink-0`}
                    >
                      <i className="ti ti-school" />
                    </span>
                    <div className="overflow-hidden">
                      <h6 className="fs-13 mb-0">PreSkool School</h6>
                      <span className="fs-12 text-muted">
                        {row.recipientType} card · {ACADEMIC_YEAR}
                      </span>
                    </div>
                    <span className={`badge badge-soft-${tintOf(row)} ms-auto`}>{row.band}</span>
                  </div>
                  {row.components
                    .filter((part) => !/reverse/i.test(part.place))
                    .map((part) => (
                      <Row key={part.name} label={part.name} value={part.place} />
                    ))}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fs-14 mb-2">Reverse Face</h6>
                <div className="border rounded p-3">
                  <Row label="Machine readable" value={`${row.qr} · ${row.barcode}`} />
                  <Row label="Encoded Data" value={row.encoded} />
                  <Row label="Watermark" value={row.watermark} />
                  {row.components
                    .filter((part) => /reverse/i.test(part.place))
                    .map((part) => (
                      <Row key={part.name} label={part.name} value={part.place} />
                    ))}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
              <span className={`badge badge-soft-${tintOf(row)}`}>
                {row.code} · {versionOf(row)}
              </span>
              <span className="badge badge-soft-secondary">
                {row.size.split(' · ')[0]} · {perSheetOf(row)} per A4 sheet
              </span>
              <span className="badge badge-soft-info">{sidesOf(row)}</span>
              <span className="badge badge-soft-secondary">3 mm bleed</span>
            </div>
          </>
        ) : null}
      </Modal>

      {/* ---------------------------- Set default ---------------------------- */}
      <Modal
        open={active === 'default'}
        onClose={onClose}
        title="Set as Default"
        onSubmit={submit('Default template updated for the group.')}
        footer={<Footer icon="ti ti-star" label="Set as Default" onClose={onClose} />}
      >
        <p className="fs-13 text-muted">
          Only one template can be the default for a recipient group. The current default is
          replaced, not removed.
        </p>
        {row ? (
          <TemplateCard
            row={row}
            rows={[
              { label: 'Status', value: row.status },
              {
                label: 'Recipient Group',
                value: row.assignedTo
                  ? `${row.recipientType} · ${row.assignedTo.toLowerCase()}`
                  : row.recipientType,
              },
              {
                label: 'Current Default',
                value: row.isDefault ? `${row.code} · this template` : 'None for this group',
              },
              {
                label: 'Blocked By',
                value: row.status === 'Active' ? 'Nothing outstanding' : `${row.status} sign off`,
              },
            ]}
          />
        ) : null}
        <div className="row g-3">
          <Field label="Template" span="col-12">
            <Select
              value={defaults.template}
              onChange={setDefaults('template')}
              options={templateOptions}
            />
          </Field>
          <Field label="Recipient Group">
            <Select
              value={defaults.group}
              onChange={setDefaults('group')}
              options={RECIPIENT_GROUPS}
            />
          </Field>
          <Field label="Effective From">
            <DateField value={defaults.effectiveFrom} onChange={setDefaults('effectiveFrom')} />
          </Field>
          <Field label="Reason" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={defaults.reason}
              onChange={(event) => setDefaults('reason')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="def-keep"
              label="Leave already printed cards on their original template"
              checked={flags.keepPrinted}
              onChange={toggle('keepPrinted')}
            />
            <Check
              id="def-tell"
              label="Tell the school office that the default has changed"
              checked={flags.tellOffice}
              onChange={toggle('tellOffice')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------ Assign ------------------------------- */}
      <Modal
        open={active === 'assign'}
        onClose={onClose}
        title="Assign Template"
        onSubmit={submit('Template assigned. New cards print from it.')}
        footer={<Footer icon="ti ti-users" label="Assign Template" onClose={onClose} />}
      >
        {row ? (
          <TemplateCard
            row={row}
            rows={[
              { label: 'Cards', value: String(row.cards) },
              { label: 'Assigned To', value: row.assignedTo ?? 'Not assigned' },
              {
                label: 'Card Size',
                value: `${row.size.split(' · ')[0]} · ${perSheetOf(row)} per A4 sheet`,
              },
              { label: 'Sheets For Current Run', value: sheetRunOf(row) },
            ]}
          />
        ) : null}
        <p className="mb-2 fs-13 text-muted">Assign by</p>
        <Segment
          name="asg-by"
          label="Assign by"
          options={['Class', 'Department', 'Custom Group']}
          value={assign.by}
          onChange={setAssign('by')}
        />
        <div className="row g-3">
          <Field label="Template" span="col-12">
            <Select
              value={assign.template}
              onChange={setAssign('template')}
              options={templateOptions}
            />
          </Field>
          <Field label="Assign To">
            <Select
              value={assign.target}
              onChange={setAssign('target')}
              options={assignmentOptions}
            />
          </Field>
          <Field label="Effective From">
            <DateField value={assign.effectiveFrom} onChange={setAssign('effectiveFrom')} />
          </Field>
          <Field label="Assigned By">
            <Select value={assign.assignedBy} onChange={setAssign('assignedBy')} options={EDITORS} />
          </Field>
          <Field label="Apply To">
            <Select
              value={assign.applyTo}
              onChange={setAssign('applyTo')}
              options={['New cards only', 'New cards and reprints', 'All cards on the next run']}
            />
          </Field>
          <Field label="Assignment Notes" span="col-12">
            <textarea
              className="form-control"
              rows={2}
              value={assign.notes}
              onChange={(event) => setAssign('notes')(event.target.value)}
            />
          </Field>
          <div className="col-12">
            <Check
              id="asg-proof"
              label="Print a paper proof before the first batch run"
              checked={flags.proofFirst}
              onChange={toggle('proofFirst')}
            />
            <Check
              id="asg-default"
              label="Also make this the default for the group"
              checked={flags.alsoDefault}
              onChange={toggle('alsoDefault')}
              last
            />
          </div>
        </div>
      </Modal>

      {/* ------------------------------- View -------------------------------- */}
      <Modal
        open={active === 'view'}
        onClose={onClose}
        title={row?.code ?? 'Template'}
        subtitle={row ? `${row.name} • ${versionOf(row)} • ${row.orientation}` : undefined}
        headerAvatar={{ icon: 'ti ti-layout', tint: 'primary' }}
        dialogClassName="modal-lg"
        footer={
          <>
            <ActionLink className="btn btn-light me-2" onClick={onClose}>
              Close
            </ActionLink>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              onClick={() => {
                onToast('Duplicating this template');
                onClose();
              }}
            >
              <i className="ti ti-copy me-1" />
              Duplicate
            </button>
          </>
        }
      >
        {row ? (
          <div className="row g-4">
            <div className="col-12">
              <div className="d-flex align-items-center gap-2 border rounded p-3">
                <span
                  className={`avatar avatar-lg bg-${tintOf(row)}-transparent text-${tintOf(row)} rounded flex-shrink-0`}
                >
                  <i className={row.orientation === 'Portrait' ? 'ti ti-id' : 'ti ti-credit-card'} />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h5 className="fs-14 mb-0">{row.name}</h5>
                  <span className="fs-12 text-muted">
                    {row.assignedTo ?? 'Not assigned'} · {row.band} band ·{' '}
                    {row.size.split(' · ')[0]}
                  </span>
                </div>
                {row.isDefault ? <span className="badge badge-soft-info">Default</span> : null}
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Layout</h6>
              <Row label="Version" value={versionOf(row)} />
              <Row label="Last Updated" value={lastUpdatedOf(row)} />
              <Row label="Orientation" value={row.orientation} />
              <Row label="Card Size" value={row.size} />
              <Row label="Components" value={componentsLabelOf(row)} last />
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Codes</h6>
              <Row label="QR Code" value={row.qr} />
              <Row label="Barcode" value={row.barcode} />
              <Row label="Gate Reader" value={row.gateReader} />
              <Row label="Library Reader" value={row.libraryReader} />
              <Row label="Sheets" value={sheetRunOf(row)} last />
            </div>
            <div className="col-12">
              <h6 className="fs-14 mb-2">Version History</h6>
              <div className="table-responsive">
                <table className="table table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>Version</th>
                      <th>Date</th>
                      <th>Change</th>
                      <th>By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.history.map((entry) => (
                      <tr key={entry.version}>
                        <td className="fs-13">{entry.version}</td>
                        <td className="fs-13">{entry.date}</td>
                        <td className="fs-13 text-muted">{entry.change}</td>
                        <td className="fs-13 text-muted">{entry.by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Layout Components</h6>
              {row.components.map((part) => (
                <Tile
                  key={part.name}
                  title={part.name}
                  note={part.place}
                  icon="ti ti-layout-grid"
                  tint="info"
                />
              ))}
            </div>
            <div className="col-md-6">
              <h6 className="fs-14 mb-2">Internal Notes</h6>
              <p className="fs-13 text-muted mb-0">{row.notes}</p>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* --------------------------- Template panel -------------------------- */}
      <Offcanvas
        open={panelOpen}
        onClose={onClosePanel}
        title="Template Details"
        placement="end"
        labelledById="tplPanelLabel"
        footer={
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
              onClick={() => {
                onToast('Opening the card preview');
                onClosePanel();
              }}
            >
              <i className="ti ti-photo me-1" />
              Preview
            </button>
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => {
                onClosePanel();
                onToast('Opening the template for editing');
              }}
            >
              <i className="ti ti-edit me-1" />
              Edit
            </button>
          </div>
        }
      >
        {row ? (
          <>
            <h6 className="fs-14 mb-2">Template Information</h6>
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
              <span
                className={`avatar avatar-md bg-${tintOf(row)}-transparent text-${tintOf(row)} rounded flex-shrink-0`}
              >
                <i className={row.orientation === 'Portrait' ? 'ti ti-id' : 'ti ti-credit-card'} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{row.name}</h6>
                <span className="fs-12 text-muted">
                  {row.code} · {versionOf(row)} · {row.orientation}
                </span>
              </div>
              {row.isDefault ? <span className="badge badge-soft-info">Default</span> : null}
            </div>
            <Row label="Recipient Type" value={row.recipientType} />
            <Row label="Card Size" value={row.size} />
            <Row label="Band Colour" value={row.band} />
            <Row label="Status" value={row.status} last />

            <h6 className="fs-14 mb-2 mt-4">Layout Components</h6>
            {row.components.map((part) => (
              <Tile
                key={part.name}
                title={part.name}
                note={part.place}
                icon="ti ti-layout-grid"
                tint={tintOf(row)}
              />
            ))}

            <h6 className="fs-14 mb-2 mt-4">Assigned Records</h6>
            {row.breakdown.length > 0 ? (
              <div className="table-responsive mb-3">
                <table className="table table-nowrap mb-0">
                  <thead>
                    <tr>
                      <th>Scope</th>
                      <th>Cards</th>
                      <th>Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.breakdown.map((entry) => (
                      <tr key={entry.scope}>
                        <td className="fs-13">{entry.scope}</td>
                        <td className="fs-13">{entry.cards}</td>
                        <td className="fs-13">{entry.isDefault ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                <Row label="Assigned To" value={row.assignedTo ?? 'No records assigned'} />
                <Row label="Scope" value={row.scope ?? '—'} />
                <Row label="Cards Carrying This Template" value={String(row.cards)} last />
              </>
            )}

            <h6 className="fs-14 mb-2 mt-4">Print Configuration</h6>
            <Row label="Stock" value={sizeOf(row.size).stock} />
            <Row label="Per A4 Sheet" value={String(perSheetOf(row))} />
            <Row label="Sides" value={sidesOf(row)} />
            <Row label="Sheets Today" value={sheetRunOf(row)} last />

            <h6 className="fs-14 mb-2 mt-4">Version History</h6>
            {row.history.map((entry) => (
              <Tile
                key={entry.version}
                title={`${entry.version} · ${entry.change}`}
                note={`${entry.date} · ${entry.by}`}
                icon="ti ti-git-commit"
                tint="purple"
              />
            ))}

            <h6 className="fs-14 mb-2 mt-4">Audit Trail</h6>
            {auditOf(row).map((entry) => (
              <Tile
                key={entry.title}
                title={entry.title}
                note={entry.note}
                icon="ti ti-history"
                tint="info"
              />
            ))}
            <p className="fs-12 text-muted mb-0 mt-3">
              Last touched by {updatedByOf(row)} on {lastUpdatedOf(row)}.
            </p>
          </>
        ) : null}
      </Offcanvas>
    </>
  );
};

export default TemplateModals;
