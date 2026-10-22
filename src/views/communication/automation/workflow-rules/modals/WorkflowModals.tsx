import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Modal from '@components/ui/Modal';
import type { Module, Priority, TriggerType, Workflow } from '../data/workflows.data';
import {
  actionCountOf,
  collisionOptions,
  conditionCountOf,
  exportFormatOptions,
  moduleOptions,
  ownerOptions,
  priorityOptions,
  triggerOnOptions,
  triggerOptions,
} from '../data/workflows.data';
import { workflowTemplates } from '../data/reference.data';

export type WorkflowModalId = 'create' | 'duplicate' | 'import' | 'export' | 'delete';

export interface WorkflowDraft {
  name: string;
  module: Module;
  description: string;
  triggerType: TriggerType;
  triggerOn: string;
  priority: Priority;
  owner: string;
  template: string;
  runOnce: boolean;
  logRuns: boolean;
}

export const emptyDraft: WorkflowDraft = {
  name: '', module: 'Fees', description: '', triggerType: 'Record created',
  triggerOn: triggerOnOptions[0], priority: 'Normal', owner: 'Me',
  template: '— Blank rule —', runOnce: true, logRuns: true,
};

export interface DuplicatePayload {
  name: string;
  module: Module;
  copyConditions: boolean;
  copyActions: boolean;
  copyRunConfig: boolean;
}

export interface ImportPayload {
  onCollision: string;
  mapFields: boolean;
  includeRunConfig: boolean;
}

export interface ExportPayload {
  scope: string;
  format: string;
  includeDefinitions: boolean;
  includeDisabled: boolean;
  includeHistory: boolean;
}

export interface WorkflowModalsProps {
  active: WorkflowModalId | null;
  row: Workflow | null;
  /** How many rules the current filter covers, for the export scope. */
  matchCount: number;
  totalCount: number;
  onClose: () => void;
  onCreate: (draft: WorkflowDraft) => void;
  onDuplicate: (payload: DuplicatePayload) => void;
  onImport: (payload: ImportPayload) => void;
  onExport: (payload: ExportPayload) => void;
  onDelete: () => void;
}

const Switch = ({
  id, title, note, value, onChange,
}: {
  id: string; title: string; note: ReactNode; value: boolean; onChange: (next: boolean) => void;
}) => (
  <div className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
    <div>
      <h6 className="fs-13 mb-0">{title}</h6>
      <span className="fs-12 text-muted">{note}</span>
    </div>
    <div className="form-check form-switch mb-0">
      <input
        className="form-check-input" type="checkbox" role="switch" id={id}
        checked={value} onChange={(event) => onChange(event.target.checked)}
      />
      <label className="form-check-label visually-hidden" htmlFor={id}>{title}</label>
    </div>
  </div>
);

const WorkflowModals = ({
  active, row, matchCount, totalCount, onClose, onCreate, onDuplicate, onImport, onExport,
  onDelete,
}: WorkflowModalsProps) => {
  const [draft, setDraft] = useState<WorkflowDraft>(emptyDraft);

  const [copyName, setCopyName] = useState('');
  const [copyModule, setCopyModule] = useState<Module>('Fees');
  const [copyConditions, setCopyConditions] = useState(true);
  const [copyActions, setCopyActions] = useState(true);
  const [copyRunConfig, setCopyRunConfig] = useState(false);

  const [onCollision, setOnCollision] = useState(collisionOptions[0]);
  const [mapFields, setMapFields] = useState(true);
  const [includeRunConfig, setIncludeRunConfig] = useState(false);

  const [scope, setScope] = useState('current');
  const [format, setFormat] = useState(exportFormatOptions[0]);
  const [includeDefinitions, setIncludeDefinitions] = useState(true);
  const [includeDisabled, setIncludeDisabled] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(false);

  useEffect(() => {
    if (active === 'create') setDraft(emptyDraft);
    if (!row) return;
    if (active === 'duplicate') {
      setCopyName(`${row.name} (copy)`);
      setCopyModule(row.module);
      setCopyConditions(true);
      setCopyActions(true);
      setCopyRunConfig(false);
    }
  }, [active, row]);

  const field = (key: keyof WorkflowDraft, value: string | boolean) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const scopeLabel = scope === 'current' ? `Current filter — ${matchCount} rules`
    : scope === 'all' ? `All ${totalCount} rules`
      : scope === 'enabled' ? 'Enabled only' : 'Selected module';

  return (
    <>
      {/* Create */}
      <Modal
        open={active === 'create'}
        onClose={onClose}
        title="Create workflow"
        dialogClassName="modal-lg"
        onSubmit={(event) => { event.preventDefault(); onCreate(draft); }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create &amp; add conditions</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          A new rule is created disabled. Nothing runs against real records until you enable it.
        </p>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label" htmlFor="wfx-c-name">Workflow name</label>
            <input
              type="text" className="form-control" id="wfx-c-name"
              placeholder="e.g. Late fee on overdue invoice"
              value={draft.name} onChange={(event) => field('name', event.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wfx-c-mod">Module</label>
            <select
              className="form-select" id="wfx-c-mod"
              value={draft.module} onChange={(event) => field('module', event.target.value)}
            >
              {moduleOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="wfx-c-desc">Description</label>
            <textarea
              className="form-control" id="wfx-c-desc" rows={2}
              placeholder="What this rule does, and why it exists. Future you will need this."
              value={draft.description} onChange={(event) => field('description', event.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="wfx-c-trg">Trigger type</label>
            <select
              className="form-select" id="wfx-c-trg"
              value={draft.triggerType} onChange={(event) => field('triggerType', event.target.value)}
            >
              {triggerOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="wfx-c-when">Trigger on</label>
            <select
              className="form-select" id="wfx-c-when"
              /* A scheduled rule fires on the clock, not on a record. */
              disabled={draft.triggerType === 'Scheduled'}
              value={draft.triggerType === 'Scheduled' ? 'A schedule' : draft.triggerOn}
              onChange={(event) => field('triggerOn', event.target.value)}
            >
              {draft.triggerType === 'Scheduled' ? <option>A schedule</option> : null}
              {triggerOnOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wfx-c-pri">Priority</label>
            <select
              className="form-select" id="wfx-c-pri"
              value={draft.priority} onChange={(event) => field('priority', event.target.value)}
            >
              {priorityOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wfx-c-own">Owner</label>
            <select
              className="form-select" id="wfx-c-own"
              value={draft.owner} onChange={(event) => field('owner', event.target.value)}
            >
              {ownerOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="wfx-c-tpl">Start from a template</label>
            <select
              className="form-select" id="wfx-c-tpl"
              value={draft.template} onChange={(event) => field('template', event.target.value)}
            >
              <option>— Blank rule —</option>
              {workflowTemplates.map((entry) => <option key={entry.name}>{entry.name}</option>)}
            </select>
          </div>
          <div className="col-12">
            <Switch
              id="wfx-c-once" title="Run once per record"
              note="Prevents the same record being acted on twice"
              value={draft.runOnce} onChange={(next) => field('runOnce', next)}
            />
            <Switch
              id="wfx-c-log" title="Log every run"
              note="Off only for very high-frequency rules"
              value={draft.logRuns} onChange={(next) => field('logRuns', next)}
            />
          </div>
        </div>
      </Modal>

      {/* Duplicate */}
      <Modal
        open={active === 'duplicate' && row !== null}
        onClose={onClose}
        title="Duplicate workflow"
        onSubmit={(event) => {
          event.preventDefault();
          onDuplicate({
            name: copyName, module: copyModule, copyConditions, copyActions, copyRunConfig,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Duplicate</button>
          </>
        }
      >
        {row ? (
          <>
            <p className="fs-12 text-muted mb-3">
              The copy is created disabled, with no execution history.
            </p>
            <div className="row g-3 mb-3">
              <div className="col-md-8">
                <label className="form-label" htmlFor="wfx-d-name">New name</label>
                <input
                  type="text" className="form-control" id="wfx-d-name"
                  value={copyName} onChange={(event) => setCopyName(event.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label" htmlFor="wfx-d-mod">Module</label>
                <select
                  className="form-select" id="wfx-d-mod"
                  value={copyModule} onChange={(event) => setCopyModule(event.target.value as Module)}
                >
                  {moduleOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
            </div>
            {/* Counted off the rule being copied. */}
            <Switch
              id="wfx-d-c" title="Copy conditions"
              note={`${conditionCountOf(row)} condition${conditionCountOf(row) === 1 ? '' : 's'}`}
              value={copyConditions} onChange={setCopyConditions}
            />
            <Switch
              id="wfx-d-a" title="Copy actions"
              note={`${actionCountOf(row)} enabled, ${row.actions.length - actionCountOf(row)} disabled`}
              value={copyActions} onChange={setCopyActions}
            />
            <Switch
              id="wfx-d-r" title="Copy run configuration"
              note="Run-once, logging and retry settings"
              value={copyRunConfig} onChange={setCopyRunConfig}
            />
          </>
        ) : null}
      </Modal>

      {/* Import */}
      <Modal
        open={active === 'import'}
        onClose={onClose}
        title="Import rules"
        onSubmit={(event) => {
          event.preventDefault();
          onImport({ onCollision, mapFields, includeRunConfig });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Import rules</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          Imported rules always arrive disabled, whatever state they were exported in.
        </p>
        <div className="border rounded text-center p-4 mb-3">
          <span className="avatar avatar-lg bg-primary-transparent text-primary rounded-circle mb-2">
            <i className="ti ti-file-upload fs-20" />
          </span>
          <h6 className="fs-14 mb-1">Drop a workflow file here</h6>
          <p className="fs-12 text-muted mb-2">
            JSON exported from this or another branch, up to 2 MB. Rules referencing fields that do
            not exist here are reported, not silently skipped.
          </p>
          <input type="file" className="form-control" aria-label="Workflow file" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="wfx-i-col">On name collision</label>
          <select
            className="form-select" id="wfx-i-col"
            value={onCollision} onChange={(event) => setOnCollision(event.target.value)}
          >
            {collisionOptions.map((option) => <option key={option}>{option}</option>)}
          </select>
          {/* Overwriting replaces a live rule's definition. */}
          {onCollision === 'Overwrite' ? (
            <span className="fs-12 text-danger">
              An existing rule with the same name will be replaced, conditions and all.
            </span>
          ) : null}
        </div>
        <Switch
          id="wfx-i-map" title="Map missing fields" note="Prompts for each unmatched field"
          value={mapFields} onChange={setMapFields}
        />
        <Switch
          id="wfx-i-run" title="Include run configuration" note="Run-once, logging and retries"
          value={includeRunConfig} onChange={setIncludeRunConfig}
        />
      </Modal>

      {/* Export */}
      <Modal
        open={active === 'export'}
        onClose={onClose}
        title="Export rules"
        onSubmit={(event) => {
          event.preventDefault();
          onExport({
            scope: scopeLabel, format, includeDefinitions, includeDisabled, includeHistory,
          });
        }}
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Export</button>
          </>
        }
      >
        <p className="fs-12 text-muted mb-3">
          A portable copy of the rule definitions. No record data leaves with them.
        </p>
        <div className="row g-3 mb-3">
          <div className="col-md-7">
            <label className="form-label" htmlFor="wfx-x-scope">Scope</label>
            <select
              className="form-select" id="wfx-x-scope"
              value={scope} onChange={(event) => setScope(event.target.value)}
            >
              {/* Counted from the filter that is actually applied. */}
              <option value="current">Current filter — {matchCount} rules</option>
              <option value="all">All {totalCount} rules</option>
              <option value="enabled">Enabled only</option>
              <option value="module">Selected module</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label" htmlFor="wfx-x-format">Format</label>
            <select
              className="form-select" id="wfx-x-format"
              value={format} onChange={(event) => setFormat(event.target.value)}
            >
              {exportFormatOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </div>
        </div>
        <Switch
          id="wfx-x-c" title="Include conditions and actions"
          note="Without them the export is a list of names"
          value={includeDefinitions} onChange={setIncludeDefinitions}
        />
        <Switch
          id="wfx-x-d" title="Include disabled rules" note="Drafts and paused rules"
          value={includeDisabled} onChange={setIncludeDisabled}
        />
        <Switch
          id="wfx-x-h" title="Include execution history" note="Adds roughly 8 MB"
          value={includeHistory} onChange={setIncludeHistory}
        />
      </Modal>

      {/* Delete */}
      <Modal
        open={active === 'delete' && row !== null}
        onClose={onClose}
        title=""
        footer={
          <>
            <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
            <button type="button" className="btn btn-danger" onClick={onDelete}>Delete workflow</button>
          </>
        }
      >
        {row ? (
          <div className="text-center">
            <span className="avatar avatar-xl bg-danger-transparent text-danger rounded-circle mb-3">
              <i className="ti ti-trash fs-24" />
            </span>
            <h5 className="mb-2">Delete {row.name}?</h5>
            <p className="text-muted mb-0">
              {row.runs > 0
                ? `This rule has run ${row.runs.toLocaleString()} times this month. Deleting it does not undo anything it has already done.`
                : 'This rule has never run.'}
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default WorkflowModals;
