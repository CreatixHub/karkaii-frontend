import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { LibraryBook } from '../../data/teacherLibrary.data';

const LibraryBookCard = ({ book }: { book: LibraryBook }) => (
  <div className="col-xxl-4 col-md-6 d-flex">
    <div className="card mb-3 flex-fill">
      <div className="card-body">
        <span className="avatar avatar-xl mb-3">
          <ImageWithBasePath src={book.cover} className="img-fluid rounded" alt="img" />
        </span>
        <h6 className="mb-3">{book.title}</h6>
        <div className="row">
          <div className="col-sm-6">
            <div className="mb-3">
              <span className="fs-12 mb-1">Book taken on </span>
              <p className="text-dark">{book.takenOn}</p>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="mb-3">
              <span className="fs-12 mb-1">Last Date</span>
              <p className="text-dark">{book.lastDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LibraryBookCard;
