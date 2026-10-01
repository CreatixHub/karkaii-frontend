import { useCallback, useMemo, useState } from 'react';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  PageHeader,
  useWorkspace,
  WorkspaceShell,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import CertificateModals from './modals/CertificateModals';
import type { CertificateModalId } from './modals/CertificateModals';
import type { Certificate } from './data/certificates.data';
import {
  ACADEMIC_YEAR,
  academicYearOptions,
  certificates as seededCertificates,
  checksLabelOf,
  countByStatus,
  countVerified,
  holderOptions,
  isIssuedOf,
  issuedAgoOf,
  issuerOptions,
  searchIndexOf,
  statusNoteOf,
  statusOf,
  statusOptions,
  statusPill,
  TOTAL_CERTIFICATES,
  ISSUED_TOTAL,
  PENDING_APPROVAL,
  VERIFIED_TOTAL,
  REISSUED,
  SUPERSEDED,
  typeOf,
  typeOptions,
  validToOf,
  verificationOf,
  verificationOptions,
} from './data/certificates.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'type', label: 'Certificate Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'holder', label: 'Holder Type', kind: 'select', chipLabel: 'Holder', options: holderOptions },
  {
    id: 'year',
    label: 'Academic Year',
    kind: 'select',
    chipLabel: 'Year',
    options: academicYearOptions,
    defaultValue: '',
    initialValue: ACADEMIC_YEAR,
  },
  { id: 'status', label: 'Certificate Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'verification', label: 'Verification', kind: 'select', chipLabel: 'Verification', options: verificationOptions },
  { id: 'issuer', label: 'Issued By', kind: 'select', chipLabel: 'Issuer', options: issuerOptions },
  { id: 'from', label: 'From Date', kind: 'date', chipLabel: 'From' },
  { id: 'to', label: 'To Date', kind: 'date', chipLabel: 'To' },
];

const sortOptions: SortOption[] = [
  { id: 'id', label: 'Certificate ID', icon: 'ti ti-hash' },
  { id: 'holder', label: 'Holder (A–Z)', icon: 'ti ti-abc' },
  { id: 'issued', label: 'Issue date', icon: 'ti ti-calendar' },
  { id: 'type', label: 'Certificate type', icon: 'ti ti-certificate' },
  { id: 'status', label: 'Status', icon: 'ti ti-flag' },
];

const savedViews: SavedView[] = [
  { id: 'all', label: 'All Certificates', icon: 'ti ti-layout-list', count: TOTAL_CERTIFICATES },
  { id: 'pending', label: 'Pending Approval', icon: 'ti ti-clock', count: PENDING_APPROVAL },
  { id: 'unprinted', label: 'Approved, Not Printed', icon: 'ti ti-printer', count: 12 },
  { id: 'reissued', label: 'Reissued Certificates', icon: 'ti ti-refresh', count: REISSUED },
  { id: 'revoked', label: 'Revoked Certificates', icon: 'ti ti-ban', count: 9 },
];

const CertificateRecords = () => {
  const [rows, setRows] = useState<Certificate[]>(seededCertificates);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<CertificateModalId | null>(null);
  const [modalRow, setModalRow] = useState<Certificate | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Certificate | null, modal: CertificateModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback((row: Certificate) => {
    setModalRow(row);
    setPanelOpen(true);
  }, []);

  const columns = useMemo<ColumnDef<Certificate>[]>(
    () => [
      {
        id: 'id',
        label: 'Certificate ID',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openPanel(row)}>
            {row.id}
          </ActionLink>
        ),
      },
      {
        id: 'holder',
        label: 'Holder',
        sortable: true,
        toggleable: false,
        render: (row) => (
          <div className="dt-user">
            <span
              className={`avatar avatar-md bg-${row.holderType === 'Staff' ? 'teal' : 'info'}-transparent text-${row.holderType === 'Staff' ? 'teal' : 'info'} rounded flex-shrink-0 me-2`}
            >
              <i className={row.holderType === 'Staff' ? 'ti ti-briefcase' : 'ti ti-school'} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>
                {row.holder}
              </ActionLink>
              <div className="dt-sub flex-nowrap text-nowrap">
                {row.holderRef} · {row.holderClass}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'holderType',
        label: 'Type',
        sortable: true,
        render: (row) => (
          <span className={`badge badge-soft-${row.holderType === 'Staff' ? 'teal' : 'info'}`}>
            {row.holderType}
          </span>
        ),
      },
      {
        id: 'certificate',
        label: 'Certificate',
        sortable: true,
        cellClassName: 'text-nowrap',
        render: (row) => {
          const type = typeOf(row.typeId);
          return (
            <>
              <span className={`badge badge-soft-${type.tint}`}>
                <i className={`${type.icon} me-1`} />
                {type.name}
              </span>
              <span className="d-block fs-12 text-muted mt-1">{row.reason}</span>
            </>
          );
        },
      },
      {
        id: 'year',
        label: 'Academic Year',
        render: () => <span className="badge badge-soft-secondary">{ACADEMIC_YEAR}</span>,
      },
      {
        id: 'issued',
        label: 'Issued',
        sortable: true,
        render: (row) => {
          const validTo = validToOf(row);
          return (
            <>
              <span className="d-block fs-13 fw-medium text-nowrap">{row.issuedOn ?? '—'}</span>
              <span className="fs-12 text-muted d-block text-nowrap">{issuedAgoOf(row)}</span>
              <span className="fs-12 text-muted text-nowrap">
                {validTo ? `Valid to ${validTo}` : row.issuedOn ? 'No expiry' : 'Prints on approval'}
              </span>
            </>
          );
        },
      },
      {
        id: 'issuer',
        label: 'Issued By',
        cellClassName: 'text-nowrap',
        render: (row) => (
          <>
            <span className="fs-13 fw-medium d-block">{row.issuedBy ?? '—'}</span>
            <span className="fs-12 text-muted">{row.issuerRole ?? 'Not yet issued'}</span>
          </>
        ),
      },
      {
        id: 'verification',
        label: 'Verification',
        render: (row) => {
          const verification = verificationOf(row);
          return (
            <>
              <span className={`badge badge-soft-${verification.tint}`}>{verification.label}</span>
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                {checksLabelOf(row)}
              </span>
              <span className="d-block fs-12 text-muted text-nowrap">
                {row.checkedOn ? `Last checked ${row.checkedOn.split(' ').slice(0, 2).join(' ')}` : 'Not yet checked'}
              </span>
            </>
          );
        },
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => {
          const status = statusOf(row);
          return (
            <>
              <span className={`dt-pill ${statusPill(status)}`}>
                <span className="dt-pill-dot" />
                {status}
              </span>
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                {statusNoteOf(row)}
              </span>
            </>
          );
        },
      },
    ],
    [openModal, openPanel],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: TOTAL_CERTIFICATES },
      { id: 'issued', label: 'Issued', icon: 'ti ti-file-check', count: rows.filter(isIssuedOf).length },
      { id: 'pending', label: 'Pending', icon: 'ti ti-clock', count: countByStatus(rows, 'Pending Approval') },
      { id: 'verified', label: 'Verified', icon: 'ti ti-shield-check', count: countVerified(rows) },
      { id: 'reissued', label: 'Reissued', icon: 'ti ti-refresh', count: countByStatus(rows, 'Reissued') },
      { id: 'revoked', label: 'Revoked', icon: 'ti ti-ban', count: countByStatus(rows, 'Revoked') },
    ],
    [rows],
  );

  const workspace = useWorkspace<Certificate>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.type && typeOf(row.typeId).name !== filters.type) return false;
      if (filters.holder && row.holderType !== filters.holder) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters.verification && verificationOf(row).label !== filters.verification) return false;
      if (filters.issuer && row.issuedBy !== filters.issuer) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'issued') return isIssuedOf(row);
      if (quick === 'pending') return statusOf(row) === 'Pending Approval';
      if (quick === 'verified') return verificationOf(row).label === 'Verified';
      if (quick === 'reissued') return statusOf(row) === 'Reissued';
      if (quick === 'revoked') return statusOf(row) === 'Revoked';
      return true;
    },
    compare: (a, b, sort) => {
      if (sort === 'holder') return a.holder.localeCompare(b.holder);
      if (sort === 'issued') return (b.issuedOn ?? '').localeCompare(a.issuedOn ?? '');
      if (sort === 'type') return typeOf(a.typeId).name.localeCompare(typeOf(b.typeId).name);
      if (sort === 'status') return statusOf(a).localeCompare(statusOf(b));
      return a.id.localeCompare(b.id);
    },
    defaultSort: 'id',
    defaultQuick: 'all',
    pageSize: 8,
  });

  /**
   * The strip counts the whole register of 412 certificates, not the eight the
   * grid shows, so the five totals are register figures. The two shares are
   * derived against them rather than typed a second time.
   */
  const summary: SummaryItem[] = [
    {
      id: 'total',
      tint: 'primary',
      icon: 'ti ti-certificate',
      label: 'Total Certificates',
      value: String(TOTAL_CERTIFICATES),
      hint: `academic year ${ACADEMIC_YEAR}`,
    },
    {
      id: 'issued',
      tint: 'success',
      icon: 'ti ti-file-check',
      label: 'Issued',
      value: String(ISSUED_TOTAL),
      hint: `${Math.round((ISSUED_TOTAL / TOTAL_CERTIFICATES) * 100)}% of the register`,
    },
    {
      id: 'pending',
      tint: 'warning',
      icon: 'ti ti-clock',
      label: 'Pending Approval',
      value: String(PENDING_APPROVAL),
      hint: 'awaiting a signatory',
    },
    {
      id: 'verified',
      tint: 'info',
      icon: 'ti ti-shield-check',
      label: 'Verified',
      value: String(VERIFIED_TOTAL),
      hint: `of ${ISSUED_TOTAL} issued certificates`,
    },
    {
      id: 'reissued',
      tint: 'purple',
      icon: 'ti ti-refresh',
      label: 'Reissued',
      value: String(REISSUED),
      hint: `${SUPERSEDED} originals superseded`,
    },
  ];

  const renderDetail = useCallback(
    (row: Certificate) => (
      <div className="row g-4">
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Record</h6>
          <p className="fs-13 text-muted mb-1">{typeOf(row.typeId).name}</p>
          <p className="fs-13 text-muted mb-1">{row.reason}</p>
          <p className="fs-13 text-muted mb-0">
            {row.holder} · {row.holderRef}
          </p>
        </div>
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Issue</h6>
          <p className="fs-13 text-muted mb-1">{row.issuedOn ?? 'Not yet issued'}</p>
          <p className="fs-13 text-muted mb-1">{issuedAgoOf(row)}</p>
          <p className="fs-13 text-muted mb-0">{validToOf(row) ? `Valid to ${validToOf(row)}` : 'No expiry'}</p>
        </div>
        <div className="col-md-4">
          <h6 className="fs-14 mb-2">Verification and use</h6>
          <p className="fs-13 text-muted mb-1">{checksLabelOf(row)}</p>
          <p className="fs-13 text-muted mb-1">
            {row.downloads} downloads · {row.prints} prints
          </p>
          <p className="fs-13 text-muted mb-0">{statusNoteOf(row) || statusOf(row)}</p>
        </div>
      </div>
    ),
    [],
  );

  const rowActions = useCallback(
    (row: Certificate) => (
      <div className="dt-actions">
        <ActionLink className="dt-ib" ariaLabel="View certificate" onClick={() => openModal(row, 'view')}>
          <i className="ti ti-eye" />
        </ActionLink>
        <ActionLink className="dt-ib" ariaLabel="Edit certificate" onClick={() => openModal(row, 'edit')}>
          <i className="ti ti-edit" />
        </ActionLink>
        <ActionLink
          className="dt-ib success"
          ariaLabel="Approve certificate"
          onClick={() => openModal(row, 'approve')}
        >
          <i className="ti ti-check" />
        </ActionLink>
        <ActionLink className="dt-ib" ariaLabel="Verify certificate" onClick={() => openModal(row, 'verify')}>
          <i className="ti ti-shield-check" />
        </ActionLink>
        <ActionLink className="dt-ib" ariaLabel="Print certificate" onClick={() => openModal(row, 'print')}>
          <i className="ti ti-printer" />
        </ActionLink>
      </div>
    ),
    [openModal],
  );

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Certificate Records"
            section="Achievements"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'verify')}
                  >
                    <i className="ti ti-shield-check me-2" />
                    Verify
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ExportMenu
                    printLabel="Print Certificate Register"
                    onExport={(format: ExportFormat) => {
                      push(`Certificate records exported as ${format.toUpperCase()}`);
                    }}
                  />
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'generate')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />
                    Generate Certificate
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={TOTAL_CERTIFICATES}
            workspaceId="certificateRecords"
            searchPlaceholder="Certificate, holder, admission number or reason…"
            searchLabel="Search certificates"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="certificates"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`academic year ${ACADEMIC_YEAR}`}
            onRefresh={() => {
              setRows(seededCertificates);
              push('Certificate records refreshed');
            }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-certificate-off"
            emptyTitle="No certificates match your filters"
            emptyBody="Clear a filter or widen the certificate type to see more records."
            summary={summary}
          />
        </div>
      </div>

      <CertificateModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        row={modalRow}
        panelOpen={panelOpen}
        onClosePanel={() => setPanelOpen(false)}
        onToast={push}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="certificateRecordsToasts" />
    </>
  );
};

export default CertificateRecords;
