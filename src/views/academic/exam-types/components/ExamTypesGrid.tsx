import type { CardMenuItem, ExamType } from '../data/examTypes.data';
import ExamTypeCard from './ExamTypeCard';

export interface ExamTypeGroup {
  key: string;
  /** Empty when grouping is cleared, which suppresses the heading. */
  title: string;
  icon: string;
  rows: ExamType[];
}

export interface ExamTypesGridProps {
  groups: ExamTypeGroup[];
  revealed: boolean;
  menuOpen: string | null;
  onOpenMenu: (id: string | null) => void;
  onMenuAction: (item: CardMenuItem, row: ExamType) => void;
  onAdd: () => void;
  onClearFilters: () => void;
}

const ExamTypesGrid = ({
  groups,
  revealed,
  menuOpen,
  onOpenMenu,
  onMenuAction,
  onAdd,
  onClearFilters,
}: ExamTypesGridProps) => {
  const isEmpty = groups.every((group) => group.rows.length === 0);

  if (isEmpty) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <span className="avatar avatar-xl bg-primary-transparent text-primary rounded-circle mb-3">
            <i className="ti ti-file-certificate fs-24" />
          </span>
          <h5 className="mb-1">No Exam Types Found</h5>
          <p className="text-muted mb-3">
            No exam type matches the current search and filters. Clear the filters or add a new exam
            type for this session.
          </p>
          <div className="d-inline-flex align-items-center gap-2">
            <button type="button" className="btn btn-light" onClick={onClearFilters}>
              Clear filters
            </button>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              onClick={onAdd}
            >
              <i className="ti ti-square-rounded-plus me-1" />
              Add Exam Type
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <div key={group.key}>
          {group.title ? (
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h6 className="mb-0 fs-14 fw-medium d-flex align-items-center">
                <i className={`${group.icon} me-1 text-muted`} />
                {group.title}
                <span className="badge badge-soft-primary ms-2">{group.rows.length}</span>
              </h6>
            </div>
          ) : null}
          <div className="row">
            {group.rows.map((row) => (
              <div className="col-12 col-xxl-3 col-xl-4 col-md-6 d-flex" key={row.id}>
                <ExamTypeCard
                  row={row}
                  revealed={revealed}
                  menuOpen={menuOpen === row.id}
                  onOpenMenu={onOpenMenu}
                  onMenuAction={onMenuAction}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default ExamTypesGrid;
