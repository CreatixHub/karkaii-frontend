import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ColumnId, ParentRow, SortKey } from '../data/parentsList.data';
import { tableHeaders } from '../data/parentsList.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes;

export interface ParentTableProps {
  rows: ParentRow[];
  columns: Record<ColumnId, boolean>;
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
  openMenu: string | null;
  onOpenMenu: (id: string | null) => void;
  onView: (row: ParentRow) => void;
  onEdit: (row: ParentRow) => void;
  onMessage: (row: ParentRow) => void;
  onDelete: (row: ParentRow) => void;
  onPrint: () => void;
}

const ParentTable = ({
  rows,
  columns,
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
  openMenu,
  onOpenMenu,
  onView,
  onEdit,
  onMessage,
  onDelete,
  onPrint,
}: ParentTableProps) => {
  const visibleColumnCount = tableHeaders.filter((header) => columns[header.id]).length;
  // Expand toggle + select box + the visible data columns + the actions cell.
  const colSpan = visibleColumnCount + 3;

  const headerClass = (key?: SortKey) => {
    if (!key) return undefined;
    if (sort !== key) return 'dt-sortable';
    return `dt-sortable ${sortAsc ? 'dt-sort-asc' : 'dt-sort-desc'}`;
  };

  return (
    <div className="data-table">
      <table className="table">
        <caption className="visually-hidden">
          Parent list with status, linked child, phone, email and date added
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all parents"
                checked={allChecked}
                ref={(node) => {
                  if (node) node.indeterminate = someChecked && !allChecked;
                }}
                onChange={(event) => onToggleAll(event.target.checked)}
              />
            </th>
            {tableHeaders.map((header) =>
              columns[header.id] ? (
                <th
                  key={header.id}
                  className={headerClass(header.sort)}
                  onClick={header.sort ? () => onSort(header.sort as SortKey) : undefined}
                >
                  {header.label}
                  {header.sort ? <i className="ti ti-arrows-sort dt-sort-ic" /> : null}
                  {header.resize ? <span className="dt-resize" /> : null}
                </th>
              ) : null,
            )}
            <th className="text-end card-actions-row">Actions</th>
          </tr>
        </thead>
        <tbody id="clsBody">
          {rows.map((row) => {
            const isOpen = expanded.includes(row.id);

            return [
              <tr className={`dt-row${isOpen ? ' expanded' : ''}`} key={row.id}>
                <td>
                  <button
                    type="button"
                    className="dt-expand"
                    aria-label={`Expand ${row.name}`}
                    aria-expanded={isOpen}
                    onClick={() => onToggleExpand(row.id)}
                  >
                    <i className="ti ti-chevron-right" />
                  </button>
                </td>
                <td className="dt-pin">
                  <input
                    type="checkbox"
                    className="dt-check row-select-cell"
                    aria-label={`Select ${row.name}`}
                    checked={selected.includes(row.id)}
                    onChange={() => onToggleSelect(row.id)}
                  />
                </td>
                {columns.parent ? (
                  <td>
                    <div className="dt-user">
                      <a
                        href="#"
                        className="dt-avatar"
                        onClick={(event) => {
                          event.preventDefault();
                          onView(row);
                        }}
                      >
                        <ImageWithBasePath src={row.avatar} alt={row.name} />
                      </a>
                      <div>
                        <a
                          href="#"
                          className="dt-name"
                          onClick={(event) => {
                            event.preventDefault();
                            onView(row);
                          }}
                        >
                          {row.name}
                        </a>
                        <div className="dt-sub">
                          <span className="link-primary">{row.id}</span>
                          <span className="dt-dot">•</span>
                          <span>Added {row.addedOn}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                ) : null}
                {columns.status ? (
                  <td>
                    <span className={`dt-pill ${row.statusClass}`}>
                      <span className="dt-pill-dot" />
                      {row.status}
                    </span>
                  </td>
                ) : null}
                {columns.child ? (
                  <td>
                    <div className="dt-user">
                      <Link to={routes.studentDetail} className="dt-avatar">
                        <ImageWithBasePath src={row.child.avatar} alt={row.child.name} />
                      </Link>
                      <div>
                        <Link to={routes.studentDetail} className="dt-name">
                          {row.child.name}
                        </Link>
                        <div className="dt-sub">
                          <span>{row.child.classLabel}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                ) : null}
                {columns.phone ? <td>{row.phone}</td> : null}
                {columns.email ? (
                  <td>
                    <a href={`mailto:${row.email}`} className="link-primary">
                      {row.email}
                    </a>
                  </td>
                ) : null}
                {columns.added ? <td>{row.addedOn}</td> : null}
                <td>
                  <div className="dt-actions">
                    <ActionLink
                      className="dt-ib"
                      title="View"
                      ariaLabel="View"
                      onClick={() => onView(row)}
                    >
                      <i className="ti ti-eye" />
                    </ActionLink>
                    <ActionLink
                      className="dt-ib"
                      title="Edit"
                      ariaLabel="Edit"
                      onClick={() => onEdit(row)}
                    >
                      <i className="ti ti-edit" />
                    </ActionLink>
                    <ActionLink
                      className="dt-ib"
                      title="Message"
                      ariaLabel="Message"
                      onClick={() => onMessage(row)}
                    >
                      <i className="ti ti-message" />
                    </ActionLink>
                    <a href={`tel:${row.phone}`} className="dt-ib" title="Call" aria-label="Call">
                      <i className="ti ti-phone" />
                    </a>
                    <div className="dropdown">
                      <ActionLink
                        className="dt-ib"
                        title="More"
                        ariaLabel="More actions"
                        ariaExpanded={openMenu === row.id}
                        onClick={() => onOpenMenu(openMenu === row.id ? null : row.id)}
                      >
                        <i className="ti ti-dots-vertical" />
                      </ActionLink>
                      <div className={`dropdown-menu dropdown-menu-end${openMenu === row.id ? ' show' : ''}`}>
                        <button type="button" className="dropdown-item" onClick={() => onView(row)}>
                          <i className="ti ti-eye" />
                          View
                        </button>
                        <button type="button" className="dropdown-item" onClick={() => onEdit(row)}>
                          <i className="ti ti-edit" />
                          Edit
                        </button>
                        <button type="button" className="dropdown-item" onClick={() => onMessage(row)}>
                          <i className="ti ti-message" />
                          Message
                        </button>
                        <a className="dropdown-item" href={`mailto:${row.email}`}>
                          <i className="ti ti-mail" />
                          Email
                        </a>
                        <a className="dropdown-item" href={`tel:${row.phone}`}>
                          <i className="ti ti-phone" />
                          Call
                        </a>
                        <Link className="dropdown-item" to={routes.studentDetail}>
                          <i className="ti ti-users" />
                          View Children
                        </Link>
                        <button type="button" className="dropdown-item" onClick={onPrint}>
                          <i className="ti ti-printer" />
                          Print
                        </button>
                        <hr className="dropdown-divider" />
                        <button type="button" className="dropdown-item text-danger" onClick={() => onDelete(row)}>
                          <i className="ti ti-trash-x" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>,
              <tr className={`dt-detail${isOpen ? ' open' : ''}`} key={`${row.id}-detail`}>
                <td colSpan={colSpan}>
                  <div className="dt-detail-inner">
                    <div className="row g-4">
                      <div className="col-xl-3 col-md-6">
                        <h6 className="details-heading">
                          <i className="ti ti-address-book" />
                          Contact
                        </h6>
                        <p className="fs-12 text-muted mb-1">
                          <i className="ti ti-phone me-1" />
                          {row.phone}
                        </p>
                        <p className="fs-12 text-muted mb-1">
                          <i className="ti ti-mail me-1" />
                          {row.email}
                        </p>
                        <h6 className="details-heading mt-3">
                          <i className="ti ti-map-pin" />
                          Address
                        </h6>
                        <p className="fs-12 text-muted mb-0">{row.address}</p>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="details-heading">
                          <i className="ti ti-users" />
                          Children
                        </h6>
                        <div className="details-line">
                          <ImageWithBasePath src={row.child.avatar} alt={row.child.name} />
                          <span>
                            <b>{row.child.name}</b>
                            <em>{row.child.classLabel}</em>
                          </span>
                          <Link to={routes.studentDetail} className="compact-icon-button" aria-label="View profile">
                            <i className="ti ti-arrow-right" />
                          </Link>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="details-heading">
                          <i className="ti ti-id" />
                          Details
                        </h6>
                        <ul className="list-unstyled fs-12 mb-0">
                          <li className="d-flex align-items-center justify-content-between py-1">
                            <span className="text-muted">Parent ID</span>
                            <span className="fw-medium">{row.id}</span>
                          </li>
                          <li className="d-flex align-items-center justify-content-between py-1">
                            <span className="text-muted">Added on</span>
                            <span className="fw-medium">{row.addedOn}</span>
                          </li>
                          <li className="d-flex align-items-center justify-content-between py-1">
                            <span className="text-muted">Relationship</span>
                            <span className="fw-medium">{row.relationship}</span>
                          </li>
                          <li className="d-flex align-items-center justify-content-between py-1">
                            <span className="text-muted">Occupation</span>
                            <span className="fw-medium">{row.occupation}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="details-heading">
                          <i className="ti ti-notes" />
                          Quick Note
                        </h6>
                        <p className="fs-12 text-muted mb-2">No notes added yet.</p>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-light bg-white btn-sm flex-fill"
                            onClick={() => onView(row)}
                          >
                            <i className="ti ti-user me-1" />
                            Full Profile
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm flex-fill"
                            onClick={() => onMessage(row)}
                          >
                            <i className="ti ti-message me-1" />
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>,
            ];
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ParentTable;
