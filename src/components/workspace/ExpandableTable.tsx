import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ColumnDef } from './types';

export interface ExpandableTableProps<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  getId: (row: T) => string;

  selected: string[];
  onToggleSelect: (id: string) => void;
  allShownSelected: boolean;
  onToggleSelectAll: () => void;
  /** Drop the leading checkbox column entirely. */
  selectable?: boolean;

  expanded: string[];
  onToggleExpand: (id: string) => void;
  /** Omit to render no expander column and no detail rows. */
  renderDetail?: (row: T) => ReactNode;

  sort: string;
  ascending?: boolean;
  onSort: (id: string) => void;

  /** Right-aligned actions cell, outside the column definitions. */
  renderActions?: (row: T) => ReactNode;
  actionsLabel?: string;

  selectAllLabel?: string;
  /** The template's `<caption class="visually-hidden">` line. */
  caption?: string;
}

function ExpandableTable<T>({
  rows,
  columns,
  getId,
  selected,
  onToggleSelect,
  allShownSelected,
  onToggleSelectAll,
  selectable = true,
  expanded,
  onToggleExpand,
  renderDetail,
  sort,
  ascending = true,
  onSort,
  renderActions,
  actionsLabel = 'Actions',
  selectAllLabel = 'Select all',
  caption,
}: ExpandableTableProps<T>) {
  const alignOf = (column: ColumnDef<T>) =>
    column.align === 'end' ? 'text-end' : column.align === 'center' ? 'text-center' : '';

  const leadingColumns = (selectable ? 1 : 0) + (renderDetail ? 1 : 0);
  const colSpan = leadingColumns + columns.length + (renderActions ? 1 : 0);

  return (
    <div className="data-table">
      <table className="table align-middle">
        {caption ? <caption className="visually-hidden">{caption}</caption> : null}
        <thead>
          <tr>
            {selectable ? (
              <th className="dt-pin">
                <input
                  type="checkbox"
                  className="dt-check"
                  aria-label={selectAllLabel}
                  checked={allShownSelected}
                  onChange={onToggleSelectAll}
                />
              </th>
            ) : null}
            {renderDetail ? <th /> : null}
            {columns.map((column) => {
              if (!column.sortable) {
                return (
                  <th className={alignOf(column) || undefined} key={column.id}>
                    {column.label}
                  </th>
                );
              }
              const active = sort === column.id;
              const classes = ['dt-sortable'];
              if (active) classes.push(ascending ? 'dt-sort-asc' : 'dt-sort-desc');
              if (alignOf(column)) classes.push(alignOf(column));
              return (
                /*
                 * The click lives on the `<th>`, as in the template —
                 * `<th class="dt-sortable">Label<i class="… dt-sort-ic ms-1"/></th>`.
                 * A wrapping `<button>` would add a node the theme never styles.
                 */
                <th
                  className={classes.join(' ')}
                  key={column.id}
                  aria-sort={active ? (ascending ? 'ascending' : 'descending') : 'none'}
                  tabIndex={0}
                  onClick={() => onSort(column.id)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    onSort(column.id);
                  }}
                >
                  {column.label}
                  <i
                    className={`ti ${
                      active && !ascending ? 'ti-arrow-narrow-down' : 'ti-arrow-narrow-up'
                    } dt-sort-ic ms-1`}
                  />
                </th>
              );
            })}
            {renderActions ? <th className="text-end">{actionsLabel}</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getId(row);
            const open = expanded.includes(id);
            return (
              <Fragment key={id}>
                <tr className="dt-row">
                  {selectable ? (
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check"
                        aria-label="Select row"
                        checked={selected.includes(id)}
                        onChange={() => onToggleSelect(id)}
                      />
                    </td>
                  ) : null}
                  {renderDetail ? (
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-expanded={open}
                        aria-label="Toggle details"
                        onClick={() => onToggleExpand(id)}
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                  ) : null}
                  {columns.map((column) => {
                    const classes = [alignOf(column), column.cellClassName ?? '']
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <td className={classes || undefined} key={column.id}>
                        {column.render(row)}
                      </td>
                    );
                  })}
                  {renderActions ? <td className="text-end">{renderActions(row)}</td> : null}
                </tr>

                {renderDetail ? (
                  <tr className={`dt-detail${open ? ' open' : ''}`}>
                    <td colSpan={colSpan} className="p-0">
                      <div className={`collapse${open ? ' show' : ''}`}>
                        <div className="p-3">{renderDetail(row)}</div>
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
}

export default ExpandableTable;
