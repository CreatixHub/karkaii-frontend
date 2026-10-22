import { Fragment } from 'react';
import type {
  ColumnDef,
  HomeworkModalId,
  RowMenuItem,
  SortKey,
  TabConfig,
  TabRow,
  TrackingRow,
} from '../data/homework.data';
import type { CellContext } from './HomeworkCells';
import {
  HomeworkCells,
  HomeworkDetail,
  LateCells,
  SubmissionCells,
  SubmissionDetail,
  TrackingCells,
} from './HomeworkCells';

export interface HomeworkTableProps {
  tab: TabConfig;
  rows: TabRow[];
  hiddenColumns: string[];
  sort: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
  selected: string[];
  onToggleSelect: (id: string) => void;
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: (checked: boolean) => void;
  expanded: string[];
  onToggleExpand: (id: string) => void;
  rowMenuOpen: string | null;
  onRowMenu: (id: string | null) => void;
  onOpenModal: (modal: HomeworkModalId, row: TabRow) => void;
  onInspect: (row: TrackingRow) => void;
  onAction: (id: string, row: TabRow) => void;
  onMenuAction: (item: RowMenuItem, row: TabRow) => void;
}

/** The label the expand button announces, whichever grid it belongs to. */
const rowLabel = (row: TabRow) => (row.kind === 'homework' || row.kind === 'tracking' ? row.name : row.student);

const HomeworkTable = ({
  tab,
  rows,
  hiddenColumns,
  sort,
  sortAsc,
  onSort,
  selected,
  onToggleSelect,
  allChecked,
  someChecked,
  onToggleAll,
  expanded,
  onToggleExpand,
  rowMenuOpen,
  onRowMenu,
  onOpenModal,
  onInspect,
  onAction,
  onMenuAction,
}: HomeworkTableProps) => {
  const visible = (id: string) => !hiddenColumns.includes(id);
  const columns: ColumnDef[] = tab.columns.filter((column) => visible(column.id));

  // Leading structural cells (chevron, checkbox) plus the trailing Actions column.
  const leading = (tab.expandToggle ? 1 : 0) + (tab.selectable ? 1 : 0);
  const colspan = leading + columns.length + 1;

  const sortClass = (key: SortKey | null) => {
    if (!key || sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  const ctx: CellContext = {
    visible,
    onOpenModal,
    onInspect,
    onAction,
    onMenuAction,
    rowMenuOpen,
    onRowMenu,
  };

  return (
    <div className={tab.tableClass}>
      <table className="table">
        <caption className="visually-hidden">{tab.caption}</caption>
        <thead>
          <tr>
            {tab.expandToggle ? <th className="card-expand-toggle" /> : null}
            {tab.selectable ? (
              <th className="dt-pin card-select">
                <input
                  type="checkbox"
                  className="dt-check"
                  id="hwAll"
                  aria-label={`Select all ${tab.noun}`}
                  checked={allChecked}
                  ref={(node) => {
                    if (node) node.indeterminate = someChecked && !allChecked;
                  }}
                  onChange={(event) => onToggleAll(event.target.checked)}
                />
              </th>
            ) : null}
            {columns.map((column) => (
              <th
                key={column.id}
                className={column.sort ? `dt-sortable${sortClass(column.sort)}` : undefined}
                onClick={column.sort ? () => onSort(column.sort as SortKey) : undefined}
              >
                {column.label}
                {column.sort ? <i className="ti ti-arrows-sort dt-sort-ic" /> : null}
                <span className="dt-resize" />
              </th>
            ))}
            <th className="text-end card-actions-row">Actions</th>
          </tr>
        </thead>
        <tbody id={tab.id === 'homework' ? 'clsBody' : undefined}>
          {rows.map((row) => {
            const isOpen = expanded.includes(row.id);
            const isSelected = selected.includes(row.id);

            return (
              <Fragment key={row.id}>
                <tr
                  className={
                    row.kind === 'homework'
                      ? `dt-row${isOpen ? ' expanded' : ''}${isSelected ? ' dt-selected' : ''}`
                      : undefined
                  }
                >
                  {tab.expandToggle ? (
                    <td>
                      <button
                        type="button"
                        className={tab.expandToggle}
                        aria-label={`Expand ${rowLabel(row)}`}
                        aria-expanded={isOpen}
                        onClick={() => onToggleExpand(row.id)}
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                  ) : null}

                  {tab.selectable ? (
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check row-select-cell"
                        aria-label={`Select ${rowLabel(row)}`}
                        checked={isSelected}
                        onChange={() => onToggleSelect(row.id)}
                      />
                    </td>
                  ) : null}

                  {row.kind === 'homework' ? <HomeworkCells row={row} ctx={ctx} /> : null}
                  {row.kind === 'tracking' ? <TrackingCells row={row} ctx={ctx} /> : null}
                  {row.kind === 'submission' ? <SubmissionCells row={row} ctx={ctx} /> : null}
                  {row.kind === 'late' ? <LateCells row={row} ctx={ctx} /> : null}
                </tr>

                {row.kind === 'homework' ? (
                  <tr className={`dt-detail${isOpen ? ' open' : ''}`}>
                    <td colSpan={colspan}>
                      <HomeworkDetail row={row} ctx={ctx} />
                    </td>
                  </tr>
                ) : null}

                {row.kind === 'submission' ? (
                  <tr>
                    <td colSpan={colspan} className="p-0 border-0">
                      <div className={`collapse${isOpen ? ' show' : ''}`} id={row.id}>
                        <SubmissionDetail row={row} />
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HomeworkTable;
