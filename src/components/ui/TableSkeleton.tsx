export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const TableSkeleton = ({
  rows = 5,
  columns = 5,
  className = '',
}: TableSkeletonProps) => (
  <div className={`table-responsive ${className}`} aria-hidden="true">
    <table className="table">
      <tbody className="placeholder-glow">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: columns }, (_, columnIndex) => (
              <td key={columnIndex}>
                <span className="placeholder col-8 rounded" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TableSkeleton;
