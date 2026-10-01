import { BlockHeading, Counter } from '../primitives';

const STATS = [
  { id: 'issued', accent: 'accent-primary', icon: 'ti ti-book', count: 3, label: 'Issued' },
  { id: 'returned', accent: 'accent-success', icon: 'ti ti-book-upload', count: 24, label: 'Returned' },
  { id: 'overdue', accent: 'accent-danger', icon: 'ti ti-alert-triangle', count: 1, label: 'Overdue' },
  { id: 'reserved', accent: 'accent-info', icon: 'ti ti-bookmark', count: 2, label: 'Reserved' },
];

const ISSUED = [
  {
    id: 'garden',
    overdue: true,
    initial: 'S',
    tint: 'bg-pink',
    title: 'The Secret Garden',
    author: 'F. H. Burnett',
    issued: 'Issued 02 Dec',
    due: 'Due 16 Dec · 6 days late',
    dueClass: 'text-danger',
    pill: 'bad',
    status: 'Overdue',
  },
  {
    id: 'matilda',
    initial: 'M',
    tint: 'bg-warning',
    title: 'Matilda',
    author: 'Roald Dahl',
    issued: 'Issued 20 Dec',
    due: 'Due 03 Jan',
    dueClass: '',
    pill: 'ok',
    status: 'On time',
  },
  {
    id: 'time',
    initial: 'A',
    tint: 'bg-purple',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    issued: 'Issued 28 Dec',
    due: 'Due 11 Jan',
    dueClass: '',
    pill: 'ok',
    status: 'On time',
  },
];

const RESERVATIONS = [
  { id: 'hp', initial: 'H', tint: 'bg-primary', title: 'Harry Potter I', author: 'J. K. Rowling', queue: 'Queue #1' },
  { id: 'hobbit', initial: 'T', tint: 'bg-teal', title: 'The Hobbit', author: 'J. R. R. Tolkien', queue: 'Queue #2' },
];

const READING = [
  { id: 'charlotte', title: "Charlotte's Web", stars: 5 },
  { id: 'jungle', title: 'The Jungle Book', stars: 4 },
  { id: 'wonder', title: 'Wonder', stars: 5 },
];

export interface LibraryPaneProps {
  revealed: boolean;
  onRenew: (title: string) => void;
}

const LibraryPane = ({ revealed, onRenew }: LibraryPaneProps) => (
  <div id="profile-pane-library" className="tab-pane-block active" data-pane="library" role="tabpanel">
    <div className="fee-stats library-stats mb-4">
      {STATS.map((stat) => (
        <div className={`fee-stat ${stat.accent}`} key={stat.id}>
          <span className="avatar avatar-icon avatar-accent-soft">
            <i className={stat.icon} />
          </span>
          <div className="fee-stat-body">
            <div className="v">
              <Counter value={stat.count} revealed={revealed} />
            </div>
            <div className="l">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="row g-3">
      <div className="col-12 col-lg-12">
        <BlockHeading icon="ti ti-book">Issued Books</BlockHeading>
        <div className="books">
          {ISSUED.map((book) => (
            <div className={`profile-book${book.overdue ? ' overdue' : ''}`} key={book.id}>
              <span className={`avatar avatar-initial ${book.tint}`}>{book.initial}</span>
              <div className="book-main">
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
                <div className="book-meta">
                  <span>
                    <i className="ti ti-calendar-plus" />
                    {book.issued}
                  </span>
                  <span className={book.dueClass}>
                    <i className="ti ti-clock-hour-3" />
                    {book.due}
                  </span>
                </div>
              </div>
              <div className="book-side">
                <span className={`profile-pill ${book.pill}`}>{book.status}</span>
                <button
                  type="button"
                  className="profile-button profile-button-sm"
                  onClick={() => onRenew(book.title)}
                >
                  <i className="ti ti-refresh" />
                  Renew
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-12">
        <BlockHeading icon="ti ti-bookmark">Reservations</BlockHeading>
        <div className="books mb-4">
          {RESERVATIONS.map((book) => (
            <div className="profile-book resv" key={book.id}>
              <span className={`avatar avatar-initial ${book.tint}`}>{book.initial}</span>
              <div className="book-main">
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
              </div>
              <span className="profile-queue">{book.queue}</span>
            </div>
          ))}
        </div>

        <BlockHeading icon="ti ti-history">Reading History</BlockHeading>
        <div className="reading-history">
          {READING.map((book) => (
            <div className="reading-mini" key={book.id}>
              <span className="avatar avatar-icon avatar-md avatar-accent-soft">
                <i className="ti ti-book-2" />
              </span>
              <div className="flex-grow-1">
                <b>{book.title}</b>
                <div className="star-rating">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={index < book.stars ? 'ti ti-star-filled' : 'ti ti-star'}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default LibraryPane;
