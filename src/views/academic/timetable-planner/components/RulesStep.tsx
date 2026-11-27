import { useCallback, useEffect, useMemo, useState } from 'react';
import { plannerMessage, sectionLabel } from '@services/timetable/planner.api';
import type { Rule, RuleKey, RuleLevel, RuleSet, Rules } from '@services/timetable/planner.api';
import type { StepProps } from '../types';

interface RuleInfo {
  key: RuleKey;
  title: string;
  help: string;
  kind: 'number' | 'flag';
  unit?: string;
  scope: 'teacher' | 'class';
}

const RULES: RuleInfo[] = [
  { key: 'teacherMaxPerDay', title: 'Most periods a teacher teaches in a day', help: 'Stops one teacher carrying a whole day.', kind: 'number', unit: 'periods', scope: 'teacher' },
  { key: 'teacherLongDays', title: 'Long days a teacher may have each week', help: 'A long day is one period over the daily maximum (for example 7 when the maximum is 6). Extra long days beyond this count as overloaded. Has no effect when the daily maximum is Critical.', kind: 'number', unit: 'long days', scope: 'teacher' },
  { key: 'teacherMinFreePerDay', title: 'Free periods per teacher per day', help: 'Set to 1 and Critical to reserve prep time. Unavailable periods do not count as free, and shorter days have a lower teaching limit.', kind: 'number', unit: 'free', scope: 'teacher' },
  { key: 'teacherMaxInRow', title: 'Most periods a teacher teaches in a row', help: 'A break between lessons ends the run.', kind: 'number', unit: 'in a row', scope: 'teacher' },
  { key: 'teacherNoGaps', title: 'No gaps in a teacher’s day', help: 'Avoids a free period stranded between two lessons.', kind: 'flag', scope: 'teacher' },
  { key: 'classNoGaps', title: 'No free periods between lessons for a class', help: 'Students are not left waiting mid-day.', kind: 'flag', scope: 'class' },
  { key: 'classStartsPeriod1', title: 'Classes start in period 1', help: 'Lessons are packed from the start of the day.', kind: 'flag', scope: 'class' },
  { key: 'subjectSpread', title: 'Most lessons of one subject in a day', help: 'Set a Critical limit to enforce the exact value. The built-in default adapts to the weekly lesson count.', kind: 'number', unit: 'a day', scope: 'class' },
  { key: 'dayBalance', title: 'Even load across the week', help: 'Avoids a heavy Monday and a light Friday.', kind: 'flag', scope: 'class' },
];

const LEVELS: { id: RuleLevel; label: string; help: string }[] = [
  { id: 'critical', label: 'Critical', help: 'Never broken. A lesson stays unplaced instead.' },
  { id: 'high', label: 'High', help: 'Strongly preferred.' },
  { id: 'medium', label: 'Medium', help: 'Preferred.' },
  { id: 'low', label: 'Low', help: 'Nice to have.' },
  { id: 'off', label: 'Off', help: 'Ignored.' },
];

interface RowProps {
  info: RuleInfo;
  rule: Rule;
  onChange: (rule: Rule) => void;
  onRemove?: () => void;
}

const RuleRow = ({ info, rule, onChange, onRemove }: RowProps) => (
  <div className="d-flex align-items-center gap-3 py-2 border-bottom flex-wrap">
    <div style={{ flex: '1 1 260px' }}>
      <div className="fw-medium fs-14">{info.title}</div>
      <div className="text-muted fs-12">{info.help}</div>
    </div>
    <div style={{ width: 130 }}>
      {info.kind === 'number' ? (
        <div className="input-group input-group-sm">
          <input type="number" min={1} max={20} className="form-control" aria-label={`${info.title}: value`} value={Number(rule.value)} onChange={(e) => onChange({ ...rule, value: Math.max(1, Number(e.target.value) || 1) })} />
          <span className="input-group-text">{info.unit}</span>
        </div>
      ) : (
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" role="switch" id={`flag-${info.key}`} aria-label={`${info.title}: on`} checked={Boolean(rule.value)} onChange={(e) => onChange({ ...rule, value: e.target.checked })} />
          <label className="form-check-label fs-13" htmlFor={`flag-${info.key}`}>{rule.value ? 'On' : 'Off'}</label>
        </div>
      )}
    </div>
    <div style={{ width: 130 }}>
      <select className="form-select form-select-sm" aria-label={`${info.title}: how much it matters`} value={rule.level} onChange={(e) => onChange({ ...rule, level: e.target.value as RuleLevel })}>
        {LEVELS.map((l) => (
          <option key={l.id} value={l.id}>{l.label}</option>
        ))}
      </select>
    </div>
    {onRemove ? (
      <button type="button" className="btn btn-sm btn-link text-danger p-0" aria-label={`Remove ${info.title}`} onClick={onRemove}><i className="ti ti-x" /></button>
    ) : null}
  </div>
);

const RulesStep = ({ api, state, reload, notify, setEdits }: StepProps) => {
  const [rules, setRules] = useState<Rules>(() => structuredClone(state.rules));
  const [saving, setSaving] = useState(false);
  const [addTeacher, setAddTeacher] = useState('');
  const [addSection, setAddSection] = useState('');

  useEffect(() => setRules(structuredClone(state.rules)), [state.rules]);
  const dirty = useMemo(() => JSON.stringify(rules) !== JSON.stringify(state.rules), [rules, state.rules]);

  const effective = (key: RuleKey): Rule => rules.defaults[key] ?? state.lookups.defaultRules[key];
  const setDefault = (key: RuleKey, rule: Rule) => setRules((r) => ({ ...r, defaults: { ...r.defaults, [key]: rule } }));

  const setOverride = (scope: 'teachers' | 'sections', id: string, key: RuleKey, rule: Rule | null) =>
    setRules((r) => {
      const set: RuleSet = { ...(r[scope][id] ?? {}) };
      if (rule) set[key] = rule;
      else delete set[key];
      const next = { ...r[scope] };
      if (Object.keys(set).length) next[id] = set;
      else delete next[id];
      return { ...r, [scope]: next };
    });

  const save = useCallback(async () => {
    if (saving) return false;
    setSaving(true);
    try {
      await api.saveRules(rules);
      await reload();
      notify('Rules saved.', 'success');
      return true;
    } catch (error) {
      notify(plannerMessage(error, 'Could not save the rules.'), 'danger');
      return false;
    } finally {
      setSaving(false);
    }
  }, [api, notify, reload, rules, saving]);

  useEffect(() => {
    setEdits(dirty || saving ? { saving, save } : null);
    return () => setEdits(null);
  }, [dirty, save, saving, setEdits]);

  const overrideBlock = (scope: 'teachers' | 'sections', label: string, options: { id: string; label: string }[], adding: string, setAdding: (v: string) => void, applies: RuleInfo['scope']) => {
    const infos = RULES.filter((r) => r.scope === applies);
    const entries = Object.entries(rules[scope]);
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h6 className="mb-1">{label} with their own settings</h6>
          <p className="text-muted fs-13">Everyone follows the settings above unless listed here.</p>
          <div className="d-flex gap-2 mb-3">
            <select className="form-select form-select-sm" aria-label={`Add ${label.toLowerCase()}`} value={adding} onChange={(e) => setAdding(e.target.value)}>
              <option value="">Choose…</option>
              {options.filter((o) => !rules[scope][o.id]).map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
            <button type="button" className="btn btn-sm btn-outline-light bg-white text-nowrap" disabled={!adding} onClick={() => { setOverride(scope, adding, infos[0].key, { ...effective(infos[0].key) }); setAdding(''); }}>
              Add
            </button>
          </div>
          {entries.length === 0 ? <div className="text-muted fs-13">None.</div> : null}
          {entries.map(([id, set]) => (
            <div key={id} className="border rounded p-3 mb-2">
              <div className="d-flex justify-content-between mb-1">
                <b>{options.find((o) => o.id === id)?.label ?? id}</b>
                <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={() => setRules((r) => { const next = { ...r[scope] }; delete next[id]; return { ...r, [scope]: next }; })}>Use everyone’s settings</button>
              </div>
              {infos.filter((i) => set[i.key]).map((i) => (
                <RuleRow key={i.key} info={i} rule={set[i.key] as Rule} onChange={(rule) => setOverride(scope, id, i.key, rule)} onRemove={() => setOverride(scope, id, i.key, null)} />
              ))}
              <select className="form-select form-select-sm mt-2 w-auto" aria-label="Add another rule" value="" onChange={(e) => e.target.value && setOverride(scope, id, e.target.value as RuleKey, { ...effective(e.target.value as RuleKey) })}>
                <option value="">+ another rule</option>
                {infos.filter((i) => !set[i.key]).map((i) => (
                  <option key={i.key} value={i.key}>{i.title}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h5 className="mb-1">Rules</h5>
          <p className="text-muted mb-0 fs-13">Tell the generator what matters. Critical rules are never broken; the rest are weighed against each other.</p>
        </div>
        <button type="button" className="btn btn-primary" disabled={!dirty || saving} onClick={() => void save()}>
          {saving ? 'Saving…' : 'Save rules'}
        </button>
      </div>

      <div className="alert alert-light border fs-13 d-flex gap-3 flex-wrap">
        {LEVELS.map((l) => (
          <span key={l.id}><b>{l.label}</b> — {l.help}</span>
        ))}
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h6 className="mb-1">Teachers — everyone</h6>
          {RULES.filter((r) => r.scope === 'teacher').map((info) => (
            <RuleRow key={info.key} info={info} rule={effective(info.key)} onChange={(rule) => setDefault(info.key, rule)} />
          ))}
        </div>
      </div>
      {overrideBlock('teachers', 'Teachers', state.lookups.staff.map((s) => ({ id: s.id, label: s.name })), addTeacher, setAddTeacher, 'teacher')}

      <div className="card mb-3">
        <div className="card-body">
          <h6 className="mb-1">Classes — everyone</h6>
          {RULES.filter((r) => r.scope === 'class').map((info) => (
            <RuleRow key={info.key} info={info} rule={effective(info.key)} onChange={(rule) => setDefault(info.key, rule)} />
          ))}
        </div>
      </div>
      {overrideBlock('sections', 'Classes', state.lookups.sections.filter((s) => !s.excluded).map((s) => ({ id: s.id, label: sectionLabel(state.lookups.sections, s.id) })), addSection, setAddSection, 'class')}
    </div>
  );
};

export default RulesStep;
