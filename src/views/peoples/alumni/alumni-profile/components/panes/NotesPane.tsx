import { useState } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { notes } from '../../data/alumniProfile.data';

export interface NotesPaneProps {
  onAddNote: () => void;
}

const NotesPane = ({ onAddNote }: NotesPaneProps) => {
  const [note, setNote] = useState('');

  return (
    <div>
      <h5 className="mb-3">Notes</h5>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows={3}
          placeholder="Add a note..."
          aria-label="Add a note…"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <div className="text-end mt-2">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              setNote('');
              onAddNote();
            }}
          >
            Add Note
          </button>
        </div>
      </div>
      <ul className="list-unstyled">
        {notes.map((item, index) => (
          <li className={`d-flex${index < notes.length - 1 ? ' mb-3' : ' mb-0'}`} key={item.text}>
            <span className="avatar avatar-sm rounded-circle flex-shrink-0 me-2">
              <ImageWithBasePath src={item.avatar} alt="" />
            </span>
            <div>
              <p className="mb-0 text-dark">{item.text}</p>
              <small className="text-muted">{item.by}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesPane;
