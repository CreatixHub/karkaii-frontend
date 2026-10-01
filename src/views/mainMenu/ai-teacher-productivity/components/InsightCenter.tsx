import { insightNotes } from '../data/productivity.data';

const InsightCenter = () => (
  <div className="row g-4 mb-4">
    {insightNotes.map((note) => (
      <div className="col-xl-4 col-md-6" key={note.id}>
        <div className="tch-note">
          <p className="tch-note-title">{note.title}</p>
          <p className="fs-12 text-muted mb-0">{note.body}</p>
        </div>
      </div>
    ))}
  </div>
);

export default InsightCenter;
