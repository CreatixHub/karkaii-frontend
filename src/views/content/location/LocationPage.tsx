import { useCallback, useState, type ReactNode } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ContentPageHeader from '../shared/ContentPageHeader';
import DeleteModal from '../shared/DeleteModal';
import { RowMenu, SelectBox } from '../shared/ListBits';
import ListToolbar from '../shared/ListToolbar';
import type { FilterFieldDef } from '../shared/ListToolbar';
import { useList } from '../shared/useList';
import type { LocationStatus } from './data/location.data';
import { statusTint } from './data/location.data';

/** A row as the table needs it, whatever depth of the register it came from. */
export interface LocationRow {
  id: string;
  ref: string;
  name: string;
  status: LocationStatus;
  /** The name columns between the reference and the status, in order. */
  cells: string[];
}

export interface LocationPageProps {
  title: string;
  cardTitle: string;
  /** The noun the dialogs and toasts use, e.g. "Country". */
  noun: string;
  plural: string;
  /** Column headings after the reference and before Status. */
  columnLabels: string[];
  rows: LocationRow[];
  fields: FilterFieldDef[];
  /** Whether a row survives the applied filters. */
  matches: (row: LocationRow, filters: Record<string, string>) => boolean;
  /** Used to keep ids unique between the three pages. */
  scope: string;
  /**
   * The add/edit dialog, rendered by the page that knows what it asks for. It
   * is handed the row being edited, or null when adding.
   */
  renderDialog: (args: {
    open: 'add' | 'edit' | null;
    row: LocationRow | null;
    onClose: () => void;
    onSaved: (message: string) => void;
  }) => ReactNode;
}

const routes = all_routes;

const LocationPage = ({
  title,
  cardTitle,
  noun,
  plural,
  columnLabels,
  rows: initialRows,
  fields,
  matches,
  scope,
  renderDialog,
}: LocationPageProps) => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<LocationRow[]>(initialRows);
  const [dialog, setDialog] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<LocationRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'selected' | null>(null);

  const sortKey = useCallback((row: LocationRow) => row.name, []);
  const list = useList<LocationRow>({ rows, getId: (row) => row.id, matches, sortKey });

  const deleteCount =
    pendingDelete === 'selected' ? list.selected.length : pendingDelete === null ? 0 : 1;

  const confirmDelete = () => {
    const going =
      pendingDelete === 'selected' ? list.selected : pendingDelete === null ? [] : [pendingDelete];
    setRows((current) => current.filter((row) => !going.includes(row.id)));
    list.clearSelection();
    setPendingDelete(null);
    push(going.length > 1 ? `${going.length} ${plural} deleted` : `${noun} deleted`);
  };

  const columnCount = columnLabels.length + 4;

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ContentPageHeader
            title={title}
            section="Location"
            dashboardTo={routes.adminDashboard}
            addLabel={`Add ${noun}`}
            onAdd={() => {
              setEditing(null);
              setDialog('add');
            }}
            onRefresh={() => {
              setRows(initialRows);
              list.resetFilters();
              list.clearSelection();
              push(`${cardTitle} refreshed`);
            }}
            onExport={(format) =>
              push(`${cardTitle} exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)
            }
            extra={
              list.selected.length === 0 ? null : (
                <div className="pe-1 mb-2">
                  <button
                    type="button"
                    className="btn btn-danger d-inline-flex align-items-center me-1"
                    onClick={() => setPendingDelete('selected')}
                  >
                    <i className="ti ti-trash-x me-1" />
                    Delete {list.selected.length}
                  </button>
                </div>
              )
            }
          />

          <div className="card">
            <ListToolbar
              title={cardTitle}
              fields={fields}
              filters={list.filters}
              onApply={list.applyFilters}
              onReset={list.resetFilters}
              sort={list.sort}
              onSort={list.setSort}
            />
            <div className="card-body p-0 py-3">
              <div className="custom-datatable-filter table-responsive">
                <table className="table">
                  <thead className="thead-light">
                    <tr>
                      <th className="no-sort">
                        <SelectBox
                          id={`${scope}-select-all`}
                          checked={list.allSelected}
                          onChange={list.toggleAll}
                          label="Select all rows"
                        />
                      </th>
                      <th>ID</th>
                      {columnLabels.map((label) => (
                        <th key={label}>{label}</th>
                      ))}
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.visible.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <SelectBox
                            id={`${scope}-select-${row.id}`}
                            checked={list.isSelected(row.id)}
                            onChange={(checked) => list.toggleRow(row.id, checked)}
                            label={`Select ${row.name}`}
                          />
                        </td>
                        <td>
                          <ActionLink
                            className="link-primary"
                            onClick={() => {
                              setEditing(row);
                              setDialog('edit');
                            }}
                          >
                            {row.ref}
                          </ActionLink>
                        </td>
                        {row.cells.map((cell, index) => (
                          <td key={columnLabels[index] ?? index}>{cell}</td>
                        ))}
                        <td>
                          <span
                            className={`badge badge-soft-${statusTint(row.status)} d-inline-flex align-items-center`}
                          >
                            <i className="ti ti-circle-filled fs-5 me-1" />
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <RowMenu
                            label={`Actions for ${row.name}`}
                            items={[
                              {
                                id: 'edit',
                                label: 'Edit',
                                icon: 'ti ti-edit-circle',
                                onSelect: () => {
                                  setEditing(row);
                                  setDialog('edit');
                                },
                              },
                              {
                                id: 'delete',
                                label: 'Delete',
                                icon: 'ti ti-trash-x',
                                onSelect: () => setPendingDelete(row.id),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                    {list.visible.length === 0 ? (
                      <tr>
                        <td colSpan={columnCount} className="text-center py-4 text-muted fs-13">
                          No {plural} match this filter.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderDialog({
        open: dialog,
        row: editing,
        onClose: () => {
          setDialog(null);
          setEditing(null);
        },
        onSaved: (message) => {
          push(message);
          setDialog(null);
          setEditing(null);
        },
      })}

      <DeleteModal
        open={pendingDelete !== null}
        count={deleteCount}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id={`${scope}Toasts`} />
    </>
  );
};

export default LocationPage;
