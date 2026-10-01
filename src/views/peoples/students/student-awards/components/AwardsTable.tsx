import { Fragment } from 'react';
import type { Achievement } from '../data/achievements.data';
import type { AwardModalId, Density, SortKey } from '../data/awardsWorkspace.data';
import { headerCells } from '../data/awardsWorkspace.data';
import AwardDetailPanel from './AwardDetailPanel';
import { ActionLink } from '@components/workspace';

const SORTABLE_COLUMNS: Record<string, SortKey | undefined> = {
  id: 'id',
  student: 'student',
  date: 'date',
  level: 'level',
};

export interface AwardsTableProps {
  rows: Achievement[];
  visibleColumns: Record<string, boolean>;
  density: Density;
  selected: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: () => void;
  expanded: string[];
  onToggleExpand: (id: string) => void;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  onOpenModal: (modal: AwardModalId) => void;
  onOpenPanel: () => void;
}

const AwardsTable = ({
  rows,
  visibleColumns,
  density,
  selected,
  onToggleSelect,
  onToggleAll,
  expanded,
  onToggleExpand,
  sort,
  onSort,
  onOpenModal,
  onOpenPanel,
}: AwardsTableProps) => {
  const show = (id: string) => visibleColumns[id] ?? true;
  const allSelected = rows.length > 0 && rows.every((row) => selected.includes(row.id));

  return (
    <div className={`data-table density-${density}`}>
      <table className="table align-middle">
        <thead>
          <tr>
            <th className="dt-pin">
              <input
                type="checkbox"
                className="dt-check"
                aria-label="Select all"
                checked={allSelected}
                onChange={onToggleAll}
              />
            </th>
            <th />
            {headerCells.map((cell) =>
              show(cell.id) ? (
                <th
                  key={cell.id}
                  className={
                    cell.sortable
                      ? `dt-sortable${SORTABLE_COLUMNS[cell.id] === sort ? ' dt-sort-asc' : ''}`
                      : undefined
                  }
                  onClick={
                    cell.sortable && SORTABLE_COLUMNS[cell.id]
                      ? () => onSort(SORTABLE_COLUMNS[cell.id] as SortKey)
                      : undefined
                  }
                >
                  {cell.label}
                  {cell.sortable ? <i className="ti ti-arrow-narrow-up dt-sort-ic ms-1" /> : null}
                </th>
              ) : null,
            )}
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Fragment key={row.id}>
              <tr className="dt-row">
                <td className="dt-pin">
                  <input
                    type="checkbox"
                    className="dt-check"
                    aria-label="Select row"
                    checked={selected.includes(row.id)}
                    onChange={() => onToggleSelect(row.id)}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="dt-expand"
                    aria-expanded={expanded.includes(row.id)}
                    aria-controls={row.collapseId}
                    aria-label="Toggle achievement details"
                    onClick={() => onToggleExpand(row.id)}
                  >
                    <i className="ti ti-chevron-right" />
                  </button>
                </td>
                {show('id') ? (
                  <td>
                    <button type="button" className="fw-medium" onClick={onOpenPanel}>
                      {row.id}
                    </button>
                  </td>
                ) : null}
                {show('student') ? (
                  <td>
                    <div className="dt-user">
                      <span className={`avatar avatar-md ${row.avatar} rounded flex-shrink-0 me-2`}>
                        <i className="ti ti-school" />
                      </span>
                      <div>
                        <ActionLink
                          className="dt-name"
                          onClick={() => onOpenModal('view')}
                        >
                          {row.student}
                        </ActionLink>
                        <div className="dt-sub flex-nowrap text-nowrap">{row.studentSub}</div>
                      </div>
                    </div>
                  </td>
                ) : null}
                {show('admission') ? (
                  <td>
                    <span className="fs-13 fw-medium">{row.admissionNo}</span>
                  </td>
                ) : null}
                {show('class') ? (
                  <td>
                    <span className="badge badge-soft-secondary">{row.studentClass}</span>
                  </td>
                ) : null}
                {show('title') ? (
                  <td className="text-nowrap">
                    <span className="fs-13 fw-medium d-block">{row.title}</span>
                    <span className="fs-12 text-muted">{row.event}</span>
                  </td>
                ) : null}
                {show('category') ? (
                  <td>
                    <span className={`badge ${row.category.className}`}>
                      <i className={`${row.category.icon} me-1`} />
                      {row.category.label}
                    </span>
                  </td>
                ) : null}
                {show('level') ? (
                  <td>
                    <span className={`badge ${row.level.className}`}>{row.level.label}</span>
                    <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                      {row.level.meta}
                    </span>
                  </td>
                ) : null}
                {show('date') ? (
                  <td>
                    <span className={row.awardDate.valueClass}>{row.awardDate.value}</span>
                    <span className="fs-12 text-muted d-block text-nowrap">
                      {row.awardDate.event}
                    </span>
                    <span className={row.awardDate.agoClass}>{row.awardDate.ago}</span>
                  </td>
                ) : null}
                {show('issued') ? (
                  <td className="text-nowrap">
                    <span className="fs-13 fw-medium d-block">{row.issuedBy.name}</span>
                    <span className="fs-12 text-muted">{row.issuedBy.role}</span>
                  </td>
                ) : null}
                {show('status') ? (
                  <td>
                    <span className={`dt-pill ${row.status.pillClass}`}>
                      <span className="dt-pill-dot" />
                      {row.status.label}
                    </span>
                    <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                      {row.status.meta}
                    </span>
                  </td>
                ) : null}
                <td>
                  <div className="dt-actions">
                    <ActionLink
                      className="dt-ib"
                      ariaLabel="View achievement"
                      onClick={() => onOpenModal('view')}
                    >
                      <i className="ti ti-eye" />
                    </ActionLink>
                    <ActionLink
                      className="dt-ib"
                      ariaLabel="Edit achievement"
                      onClick={() => onOpenModal('edit')}
                    >
                      <i className="ti ti-edit" />
                    </ActionLink>
                    <ActionLink
                      className="dt-ib success"
                      ariaLabel="Upload certificate"
                      onClick={() => onOpenModal('upload')}
                    >
                      <i className="ti ti-upload" />
                    </ActionLink>
                    <ActionLink
                      className="dt-ib"
                      ariaLabel="Nominate student"
                      onClick={() => onOpenModal('nominate')}
                    >
                      <i className="ti ti-star" />
                    </ActionLink>
                    <ActionLink
                      className="dt-ib"
                      ariaLabel="Print award"
                      onClick={() => onOpenModal('print')}
                    >
                      <i className="ti ti-printer" />
                    </ActionLink>
                  </div>
                </td>
              </tr>
              {expanded.includes(row.id) ? (
                <AwardDetailPanel
                  id={row.collapseId}
                  detail={row.detail}
                  onOpenModal={onOpenModal}
                  onOpenPanel={onOpenPanel}
                />
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AwardsTable;
