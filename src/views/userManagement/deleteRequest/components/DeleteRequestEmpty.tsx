export interface DeleteRequestEmptyProps {
  onResetFilters: () => void;
}

const DeleteRequestEmpty = ({ onResetFilters }: DeleteRequestEmptyProps) => (
  <div className="card-empty" id="darEmpty">
    <div className="card-empty-art">
      <i className="ti ti-user-check" />
    </div>
    <h4 className="fs-16 fw-medium">No Delete Requests Found</h4>
    <p>All user accounts are currently active. Adjust your filters to see more results.</p>
    <button type="button" className="btn btn-light" onClick={onResetFilters}>
      <i className="ti ti-rotate me-1" />
      Reset filters
    </button>
  </div>
);

export default DeleteRequestEmpty;
