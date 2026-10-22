import { Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ColumnDef } from './types';

export interface CardTableProps<T> {
  rows: T[];
  columns: ColumnDef<T>[];
  getId: (row: T) => string;

  selected: string[];
  onToggleSelect: (id: string) => void;
  allShownSelected: boolean;
  onToggleSelectAll: () => void;

  expanded: string[];
  onToggleExpand: (id: string) => void;
  renderDetail?: (row: T) => ReactNode;

  sort: string;
  ascending?: boolean;
  onSort: (id: string) => void;

  renderActions?: (row: T) => ReactNode;
  actionsLabel?: string;

  /** Accessible name for the select-all box, e.g. "Select all fee types". */
  selectAllLabel?: string;
  /** `<caption class="visually-hidden">` text; the template gives each page one. */
  caption?: string;
  /** Builds the per-row checkbox label, e.g. `Select ${row.name}`. */
  rowLabel?: (row: T) => string;
}

function CardTable<T>({
  rows,
  columns,
  getId,
  selected,
  onToggleSelect,
  allShownSelected,
  onToggleSelectAll,
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
  rowLabel,
}: CardTableProps<T>) {
  const leadingColumns = 1 + (renderDetail ? 1 : 0);
  const colSpan = leadingColumns + columns.length + (renderActions ? 1 : 0);

  return (
    <div className="data-table dt-cards">
      <table className="table">
        {caption ? <caption className="visually-hidden">{caption}</caption> : null}
        <thead>
          <tr>
            {renderDetail ? <th className="card-expand-toggle" /> : null}
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                aria-label={selectAllLabel}
                checked={allShownSelected}
                onChange={onToggleSelectAll}
              />
            </th>
            {columns.map((column) => {
              if (!column.sortable) {
                return (
                  <th className={column.align === 'end' ? 'text-end' : undefined} key={column.id}>
                    {column.label}
                    <span className="dt-resize" />
                  </th>
                );
              }
              const active = sort === column.id;
              const classes = ['dt-sortable'];
              if (active) classes.push(ascending ? 'dt-sort-asc' : 'dt-sort-desc');
              if (column.align === 'end') classes.push('text-end');
              return (
                /*
                 * The click lives on the `<th>`, as it does in the template —
                 * `<th class="dt-sortable" data-cls-sort="…">Label <i/></th>`.
                 * Wrapping the label in a `<button>` adds an element the theme
                 * never styles and brings Bootstrap's own line-height and
                 * padding into the header cell. `tabIndex` and the key handler
                 * keep it operable without that extra node.
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
                  {column.label} <i className="ti ti-arrows-sort dt-sort-ic" />
                  <span className="dt-resize" />
                </th>
              );
            })}
            {renderActions ? <th className="text-end card-actions-row">{actionsLabel}</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getId(row);
            const open = expanded.includes(id);
            return (
              <Fragment key={id}>
                <tr className="dt-row">
                  {renderDetail ? (
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-expanded={open}
                        aria-label={rowLabel ? `Expand ${rowLabel(row)}` : 'Toggle details'}
                        onClick={() => onToggleExpand(id)}
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                  ) : null}
                  <td className="dt-pin">
                    <input
                      type="checkbox"
                      className="dt-check row-select-cell"
                      aria-label={rowLabel ? rowLabel(row) : 'Select row'}
                      checked={selected.includes(id)}
                      onChange={() => onToggleSelect(id)}
                    />
                  </td>
                  {columns.map((column) => {
                    const classes = [column.align === 'end' ? 'text-end' : '', column.cellClassName ?? '']
                      .filter(Boolean)
                      .join(' ');
                    return (
                      <td className={classes || undefined} key={column.id}>
                        {column.render(row)}
                      </td>
                    );
                  })}
                  {renderActions ? <td>{renderActions(row)}</td> : null}
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

export default CardTable;
