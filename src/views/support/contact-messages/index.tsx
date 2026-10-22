import { useCallback, useEffect, useState, type FormEvent } from 'react';
import Modal from '@components/ui/Modal';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ContentPageHeader from '../../content/shared/ContentPageHeader';
import DeleteModal from '../../content/shared/DeleteModal';
import { RowMenu, SelectBox } from '../../content/shared/ListBits';
import ListToolbar from '../../content/shared/ListToolbar';
import { useList } from '../../content/shared/useList';
import type { ContactMessage } from './data/contactMessages.data';
import { dateOptions, MESSAGES, nameOptions, refOf } from './data/contactMessages.data';

const routes = all_routes;

const ContactMessages = () => {
  const { toasts, push, dismiss } = useToasts();

  const [rows, setRows] = useState<ContactMessage[]>(MESSAGES);
  const [dialog, setDialog] = useState<'add' | 'edit' | null>(null);
  const [editing, setEditing] = useState<ContactMessage | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'selected' | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!dialog) return;
    const source = dialog === 'edit' ? editing : null;
    setName(source?.name ?? '');
    setPhone(source?.phone ?? '');
    setEmail(source?.email ?? '');
    setMessage(source?.message ?? '');
    setDate(source?.date ?? '');
  }, [dialog, editing]);

  const matches = useCallback((row: ContactMessage, filters: Record<string, string>) => {
    if (filters.name && row.name !== filters.name) return false;
    if (filters.date && row.date !== filters.date) return false;
    return true;
  }, []);

  const sortKey = useCallback((row: ContactMessage) => row.name, []);
  const list = useList<ContactMessage>({ rows, getId: (row) => row.id, matches, sortKey });

  const deleteCount =
    pendingDelete === 'selected' ? list.selected.length : pendingDelete === null ? 0 : 1;

  const confirmDelete = () => {
    const going =
      pendingDelete === 'selected' ? list.selected : pendingDelete === null ? [] : [pendingDelete];
    setRows((current) => current.filter((row) => !going.includes(row.id)));
    list.clearSelection();
    setPendingDelete(null);
    push(going.length > 1 ? `${going.length} messages deleted` : 'Message deleted');
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const draft = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      message: message.trim(),
      date,
    };
    if (dialog === 'edit' && editing) {
      setRows((current) => current.map((row) => (row.id === editing.id ? { ...row, ...draft } : row)));
      push(`${draft.name}'s message saved`);
    } else {
      setRows((current) => [{ id: draft.email || `message-${current.length}`, ...draft }, ...current]);
      push(`${draft.name}'s message added`);
    }
    setDialog(null);
    setEditing(null);
  };

  const body = (
    <div className="row">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="cm-name">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="cm-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="cm-phone">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="cm-phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="cm-email">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="cm-email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label" htmlFor="cm-date">
            Date
          </label>
          <input
            type="text"
            className="form-control"
            id="cm-date"
            placeholder="25 Mar 2024"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </div>
      <div className="col-md-12">
        <div className="mb-0">
          <label className="form-label" htmlFor="cm-message">
            Message
          </label>
          <textarea
            className="form-control"
            rows={3}
            id="cm-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const footer = (label: string) => (
    <>
      <ActionLink
        className="btn btn-light me-2"
        onClick={() => {
          setDialog(null);
          setEditing(null);
        }}
      >
        Cancel
      </ActionLink>
      <button type="submit" className="btn btn-primary">
        {label}
      </button>
    </>
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <ContentPageHeader
            title="Contact Messages"
            section="Support"
            dashboardTo={routes.adminDashboard}
            addLabel="Add Message"
            onAdd={() => {
              setEditing(null);
              setDialog('add');
            }}
            onRefresh={() => {
              setRows(MESSAGES);
              list.resetFilters();
              list.clearSelection();
              push('Messages refreshed');
            }}
            onExport={(format) =>
              push(`Messages exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)
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
              title="Contact Messages List"
              fields={[
                { id: 'name', label: 'Name', options: nameOptions },
                { id: 'date', label: 'Date', options: dateOptions },
              ]}
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
                          id="cm-select-all"
                          checked={list.allSelected}
                          onChange={list.toggleAll}
                          label="Select all rows"
                        />
                      </th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.visible.map((row, index) => (
                      <tr key={row.id}>
                        <td>
                          <SelectBox
                            id={`cm-select-${row.id}`}
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
                            {refOf(index)}
                          </ActionLink>
                        </td>
                        <td>{row.name}</td>
                        <td>{row.phone}</td>
                        <td>{row.email}</td>
                        <td>{row.message}</td>
                        <td>{row.date}</td>
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
                        <td colSpan={8} className="text-center py-4 text-muted fs-13">
                          No messages match this filter.
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

      <Modal
        open={dialog === 'add'}
        onClose={() => setDialog(null)}
        title="Add Message"
        onSubmit={save}
        footer={footer('Add Message')}
      >
        {body}
      </Modal>

      <Modal
        open={dialog === 'edit'}
        onClose={() => {
          setDialog(null);
          setEditing(null);
        }}
        title="Edit Message"
        onSubmit={save}
        footer={footer('Save Changes')}
      >
        {body}
      </Modal>

      <DeleteModal
        open={pendingDelete !== null}
        count={deleteCount}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="contactMessagesToasts" />
    </>
  );
};

export default ContactMessages;
