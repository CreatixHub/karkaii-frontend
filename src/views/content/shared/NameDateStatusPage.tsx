import { useCallback, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ContentPageHeader from './ContentPageHeader';
import DeleteModal from './DeleteModal';
import { RowMenu, SelectBox } from './ListBits';
import ListToolbar from './ListToolbar';
import type { FilterFieldDef } from './ListToolbar';
import NameStatusModals from './NameStatusModals';
import type { NameStatusDialog, NameStatusDraft } from './NameStatusModals';
import { useList } from './useList';

const routes = all_routes;

export type EntryStatus = 'Active' | 'Inactive';

export interface NameDateEntry {
  id: string;
  name: string;
  addedOn: string;
  status: EntryStatus;
}

/** Green for what is live, red for what is not. */
export const statusTint = (status: EntryStatus) => (status === 'Active' ? 'success' : 'danger');

export const slugify = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export interface NameDateStatusPageProps {
  /** The page title and breadcrumb leaf, e.g. "Blog Categories". */
  title: string;
  /** The card's own heading, e.g. "Categories List". */
  cardTitle: string;
  /** The noun the dialogs and toasts use, e.g. "Category". */
  noun: string;
  /** Its plural, for the "3 categories deleted" toast. */
  plural: string;
  /** What the first column is called, e.g. "Category" or "Tags". */
  columnLabel: string;
  rows: NameDateEntry[];
  /** The label the filter form gives the name facet. */
  filterLabel: string;
  /** Used to keep checkbox and toast ids unique between the two pages. */
  scope: string;
}

const NameDateStatusPage = ({
  title,
  cardTitle,
  noun,
  plural,
  columnLabel,
  rows: initialRows,
  filterLabel,
  scope,
}: NameDateStatusPageProps) => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<NameDateEntry[]>(initialRows);
  const [dialog, setDialog] = useState<NameStatusDialog>(null);
  const [editing, setEditing] = useState<NameDateEntry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'selected' | null>(null);

  /** Each facet offers what the register actually holds. */
  const fields: FilterFieldDef[] = [
    { id: 'name', label: filterLabel, options: initialRows.map((row) => row.name) },
    {
      id: 'added',
      label: 'Added Date',
      options: [...new Set(initialRows.map((row) => row.addedOn))],
    },
    { id: 'status', label: 'Status', options: ['Active', 'Inactive'] },
  ];

  const matches = useCallback((row: NameDateEntry, filters: Record<string, string>) => {
    if (filters.name && row.name !== filters.name) return false;
    if (filters.added && row.addedOn !== filters.added) return false;
    if (filters.status && row.status !== filters.status) return false;
    return true;
  }, []);

  const sortKey = useCallback((row: NameDateEntry) => row.name, []);
  const list = useList<NameDateEntry>({ rows, getId: (row) => row.id, matches, sortKey });

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

  const save = (draft: NameStatusDraft) => {
    const status: EntryStatus = draft.active ? 'Active' : 'Inactive';
    if (dialog === 'edit' && editing) {
      setRows((current) =>
        current.map((row) => (row.id === editing.id ? { ...row, name: draft.name, status } : row)),
      );
      push(`${draft.name} saved`);
    } else {
      setRows((current) => [
        {
          id: slugify(draft.name) || `${scope}-${current.length}`,
          name: draft.name,
          addedOn: 'Today',
          status,
        },
        ...current,
      ]);
      push(`${draft.name} added`);
    }
    setDialog(null);
    setEditing(null);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ContentPageHeader
            title={title}
            section="Content"
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
                      <th>{columnLabel}</th>
                      <th>Added on</th>
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
                        <td className="text-gray-9">{row.name}</td>
                        <td className="text-gray-9">{row.addedOn}</td>
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
                        <td colSpan={5} className="text-center py-4 text-muted fs-13">
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

      <NameStatusModals
        open={dialog}
        noun={noun}
        value={editing ? { name: editing.name, active: editing.status === 'Active' } : null}
        onClose={() => {
          setDialog(null);
          setEditing(null);
        }}
        onSave={save}
      />

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

export default NameDateStatusPage;
