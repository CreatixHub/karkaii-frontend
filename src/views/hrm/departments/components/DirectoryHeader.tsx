export interface DirectoryHeaderProps {
  /** Reflects `#dept_select_all`; true when every visible card is ticked. */
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  count: number;
}

const DirectoryHeader = ({ allSelected, onSelectAll, count }: DirectoryHeaderProps) => (
  <div className="d-flex align-items-center justify-content-between mb-3">
    <div className="form-check mb-0">
      <input
        className="form-check-input"
        type="checkbox"
        id="dept_select_all"
        checked={allSelected}
        onChange={(event) => onSelectAll(event.target.checked)}
      />
      <label className="form-check-label fs-13 text-muted ms-1" htmlFor="dept_select_all">
        Select all
      </label>
    </div>
    <span className="badge badge-soft-primary">{count} Departments</span>
  </div>
);

export default DirectoryHeader;
