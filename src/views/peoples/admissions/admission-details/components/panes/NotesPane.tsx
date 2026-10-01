import { useState } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { NoteEntry } from '../../data/admissionDetails.data';
import { notes as initialNotes } from '../../data/admissionDetails.data';

export interface NotesPaneProps {
  onAddNote: (text: string) => void;
}

const NotesPane = ({ onAddNote }: NotesPaneProps) => {
  const [draft, setDraft] = useState('');
  const [notes, setNotes] = useState<NoteEntry[]>(initialNotes);

  const addNote = () => {
    if (!draft.trim()) return;
    setNotes((current) => [
      { avatar: 'assets/img/profiles/avatar-01.jpg', text: draft.trim(), meta: 'You · Just now' },
      ...current,
    ]);
    onAddNote(draft.trim());
    setDraft('');
  };

  return (
    <div>
      <h5 className="mb-3">Notes</h5>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows={3}
          placeholder="Add a note..."
          aria-label="Add a note..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <div className="text-end mt-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={addNote}>
            Add Note
          </button>
        </div>
      </div>
      <ul className="list-unstyled">
        {notes.map((note, index) => (
          <li className={index === notes.length - 1 ? 'd-flex mb-0' : 'd-flex mb-3'} key={`${note.meta}-${index}`}>
            <span className="avatar avatar-sm rounded-circle flex-shrink-0 me-2">
              <ImageWithBasePath src={note.avatar} alt="" />
            </span>
            <div>
              <p className="mb-0 text-dark">{note.text}</p>
              <small className="text-muted">{note.meta}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesPane;
