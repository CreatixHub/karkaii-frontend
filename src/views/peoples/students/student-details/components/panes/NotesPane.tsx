import { useState } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { BlockHeading } from '../primitives';

export interface ProfileNote {
  id: string;
  category: 'counsel' | 'academic' | 'behaviour' | 'health';
  categoryLabel: string;
  author: string;
  role: string;
  photo: string;
  date: string;
  private: boolean;
  text: string;
}

const CATEGORIES: { key: ProfileNote['category']; label: string; icon?: string }[] = [
  { key: 'counsel', label: 'Counselling', icon: 'ti ti-messages' },
  { key: 'academic', label: 'Academic' },
  { key: 'behaviour', label: 'Behaviour' },
  { key: 'health', label: 'Health' },
];

const INITIAL_NOTES: ProfileNote[] = [
  {
    id: 'n1',
    category: 'counsel',
    categoryLabel: 'Counselling',
    author: 'Ms. Rita Owen',
    role: 'Counsellor',
    photo: 'assets/img/teachers/teacher-02.jpg',
    date: '20 Nov 2024',
    private: true,
    text: 'Discussed time-management strategies. Janet is receptive and set a goal to submit homework a day early. Follow-up in two weeks.',
  },
  {
    id: 'n2',
    category: 'academic',
    categoryLabel: 'Academic',
    author: 'Mr. Teresa Susan',
    role: 'Class Teacher',
    photo: 'assets/img/teachers/teacher-01.jpg',
    date: '08 Nov 2024',
    private: false,
    text: 'Strong improvement in Mathematics. Encouraged her to mentor a peer struggling with fractions.',
  },
  {
    id: 'n3',
    category: 'behaviour',
    categoryLabel: 'Behaviour',
    author: 'Ms. Rita Owen',
    role: 'Counsellor',
    photo: 'assets/img/teachers/teacher-03.jpg',
    date: '14 Oct 2024',
    private: true,
    text: 'Recognised for calm conduct in assembly. No behavioural concerns this term.',
  },
  {
    id: 'n4',
    category: 'health',
    categoryLabel: 'Health',
    author: 'Dr. Anita Rao',
    role: 'Medical Officer',
    photo: 'assets/img/teachers/teacher-05.jpg',
    date: '02 Jul 2024',
    private: true,
    text: 'Sick-bay visit for mild fever; parent informed and student sent home. Advised rest.',
  },
];

export interface NotesPaneProps {
  onToast: (message: string, variant?: 'success' | 'danger' | 'info') => void;
}

const NotesPane = ({ onToast }: NotesPaneProps) => {
  const [notes, setNotes] = useState<ProfileNote[]>(INITIAL_NOTES);
  const [showPrivate, setShowPrivate] = useState(true);
  const [draft, setDraft] = useState('');
  const [category, setCategory] = useState<ProfileNote['category']>('counsel');
  const [isPrivate, setIsPrivate] = useState(true);

  const addNote = () => {
    const text = draft.trim();
    if (!text) {
      onToast('Write a note first.', 'danger');
      return;
    }

    const label = CATEGORIES.find((item) => item.key === category)?.label ?? 'Note';
    setNotes((current) => [
      {
        id: `new-${current.length}`,
        category,
        categoryLabel: label,
        author: 'You',
        role: 'Staff',
        photo: 'assets/img/profiles/avatar-27.jpg',
        date: 'Just now',
        private: isPrivate,
        text,
      },
      ...current,
    ]);
    setDraft('');
    onToast('Note added to the log.', 'success');
  };

  const visible = notes.filter((note) => showPrivate || !note.private);

  return (
    <div id="profile-pane-notes" className="tab-pane-block active" data-pane="notes" role="tabpanel">
      <div className="staff-bar mb-3">
        <span className="avatar avatar-icon avatar-md bg-warning">
          <i className="ti ti-lock" />
        </span>
        <div className="staff-bar-txt">
          <b>Staff-only Notes</b>
          <span>
            Private log visible to teachers &amp; counsellors. Not shown on the parent portal.
          </span>
        </div>
        <label className="switch ms-auto">
          <input
            type="checkbox"
            id="notesPrivateView"
            checked={showPrivate}
            onChange={(event) => setShowPrivate(event.target.checked)}
          />
          <span className="switch-track" />
          <span className="switch-lbl">Private view</span>
        </label>
      </div>

      <div className="note-composer mb-4">
        <div className="note-composer-top">
          <ImageWithBasePath src="assets/img/profiles/avatar-27.jpg" alt="You" />
          <textarea
            className="form-control"
            rows={2}
            placeholder="Add a counsellor / teacher note about Janet…"
            aria-label="Add a counsellor / teacher note about Janet…"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
        </div>
        <div className="note-composer-foot">
          <div className="profile-chip-set">
            {CATEGORIES.map((item) => (
              <button
                type="button"
                key={item.key}
                className={`profile-chip${category === item.key ? ' solid' : ''}`}
                onClick={() => setCategory(item.key)}
              >
                {item.icon ? <i className={`${item.icon} me-1`} /> : null}
                {item.label}
              </button>
            ))}
          </div>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <label className="visibility">
              <input
                type="checkbox"
                id="notePrivate"
                checked={isPrivate}
                onChange={(event) => setIsPrivate(event.target.checked)}
              />
              <i className="ti ti-lock" />
              <span>Private</span>
            </label>
            <button
              type="button"
              className="profile-button profile-button-sm profile-button-primary"
              onClick={addNote}
            >
              <i className="ti ti-plus" />
              Add Note
            </button>
          </div>
        </div>
      </div>

      <BlockHeading icon="ti ti-notebook" sub={`${notes.length} entries`}>
        Counsellor &amp; Teacher Log{' '}
      </BlockHeading>
      <div className="profile-notes" id="spNotesList">
        {visible.map((note) => (
          <div className={`profile-note c-${note.category}`} key={note.id}>
            <span className="avatar avatar-40 avatar-r-10">
              <ImageWithBasePath src={note.photo} alt={note.author} />
            </span>
            <div className="note-main">
              <div className="note-top">
                <b>{note.author}</b>
                <span className="note-role">{note.role}</span>
                <span className={`badge-cat ${note.category}`}>{note.categoryLabel}</span>
                {note.private ? (
                  <span className="note-vis">
                    <i className="ti ti-lock" />
                    Private
                  </span>
                ) : (
                  <span className="note-vis shared">
                    <i className="ti ti-users" />
                    Shared
                  </span>
                )}
                <span className="note-date ms-auto">{note.date}</span>
              </div>
              <p>{note.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPane;
