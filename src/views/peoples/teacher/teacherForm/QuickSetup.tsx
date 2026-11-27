import { useState } from 'react';
import { createSubjectQuick, type SubjectKind } from '@services/staff/staff.api';

import { SUBJECT_TYPES } from '@services/subjects/subjects.api';

// "Mathematics" -> "MATH" (can be edited; must be 2-20 letters/digits)
const makeCode = (name: string) => name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();

type Props = { onDone?: () => void };

const QuickSetup = ({ onDone }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [kind, setKind] = useState<SubjectKind>('core');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const addSubject = async () => {
    const trimmed = name.trim();
    const finalCode = (code.trim() || makeCode(trimmed)).toUpperCase();
    if (trimmed.length < 2) return setMessage({ type: 'error', text: 'Enter the subject name.' });
    setBusy(true);
    setMessage(null);
    try {
      await createSubjectQuick({ code: finalCode, name: trimmed, subjectType: kind });
      setName('');
      setCode('');
      setMessage({ type: 'ok', text: `Subject "${trimmed}" added.` });
      onDone?.();
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Could not add the subject' });
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <div className="mb-3">
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => setOpen(true)}>
          Subject missing? Add it here
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded p-3 mb-3 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Add a subject</strong>
        <button type="button" className="btn btn-link btn-sm" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>

      {message && (
        <div className={`alert ${message.type === 'ok' ? 'alert-success' : 'alert-danger'} py-2`}>{message.text}</div>
      )}

      <div className="row g-2 align-items-end">
        <div className="col-md-5">
          <label className="form-label">Subject name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mathematics" />
        </div>
        <div className="col-md-3">
          <label className="form-label">Code</label>
          <input
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={makeCode(name) || 'MATH'}
          />
        </div>
        <div className="col-md-2">
          <label className="form-label">Type</label>
          <select className="form-select" value={kind} onChange={(e) => setKind(e.target.value as SubjectKind)}>
            {SUBJECT_TYPES.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-primary w-100" disabled={busy} onClick={addSubject}>
            {busy ? 'Saving...' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSetup;