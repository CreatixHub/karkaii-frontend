import { Fragment } from 'react';
import type { DetailRow, EmptyBlock, IdCard, IdCardAction, TimelineEntry } from '../data/idCards.data';
import { ActionLink } from '@components/workspace';

export interface IdCardRowProps {
  card: IdCard;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  columns: Record<string, boolean>;
  onAction: (action: IdCardAction, card: IdCard) => void;
}

/** A `label / value` line, with the value optionally rendered as a badge. */
const InfoRow = ({ row, last }: { row: DetailRow; last: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{row.label}</span>
    <span className="fs-13 fw-medium text-end">
      {row.badge ? <span className={`badge ${row.badge}`}>{row.value}</span> : row.value}
    </span>
  </div>
);

const Placeholder = ({ block }: { block: EmptyBlock }) => (
  <div className="border rounded p-3 text-center">
    <span className={`avatar avatar-md ${block.tint} rounded mb-2`}>
      <i className={block.icon} />
    </span>
    <p className="fs-13 text-muted mb-0">{block.title}</p>
    <span className="fs-12 text-muted">{block.hint}</span>
  </div>
);

const HistoryEntry = ({ entry }: { entry: TimelineEntry }) => (
  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2">
    <span className={`avatar avatar-sm ${entry.tint} rounded flex-shrink-0`}>
      <i className={entry.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
      <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
    </div>
  </div>
);

const IdCardRow = ({
  card,
  selected,
  onToggleSelect,
  expanded,
  onToggleExpand,
  columns,
  onAction,
}: IdCardRowProps) => {
  const { detail } = card;
  const visibleColumns = Object.keys(columns).filter((key) => columns[key]).length;

  return (
    <Fragment>
      <tr className="dt-row">
        <td className="dt-pin">
          <input
            type="checkbox"
            className="dt-check"
            aria-label="Select row"
            checked={selected}
            onChange={() => onToggleSelect(card.id)}
          />
        </td>
        <td>
          <button
            type="button"
            className="dt-expand"
            aria-expanded={expanded}
            aria-controls={card.id}
            aria-label="Toggle ID card details"
            onClick={() => onToggleExpand(card.id)}
          >
            <i className="ti ti-chevron-right" />
          </button>
        </td>
        {columns.student ? (
          <td>
            <div className="dt-user">
              <span className={`avatar avatar-md ${card.avatarTint} rounded flex-shrink-0 me-2`}>
                <i className="ti ti-school" />
              </span>
              <div>
                <ActionLink className="dt-name" onClick={() => onAction('view', card)}>
                  {card.name}
                </ActionLink>
                <div className="dt-sub flex-nowrap text-nowrap">{card.sub}</div>
              </div>
            </div>
          </td>
        ) : null}
        {columns.admissionNo ? (
          <td>
            <span className="fs-13 fw-medium">{card.admissionNo}</span>
          </td>
        ) : null}
        {columns.class ? (
          <td>
            <span className="badge badge-soft-secondary">{card.className}</span>
          </td>
        ) : null}
        {columns.section ? (
          <td>
            <span className="badge badge-soft-secondary">{card.section}</span>
          </td>
        ) : null}
        {columns.cardNumber ? (
          <td className="text-nowrap">
            <ActionLink className="fw-medium" onClick={() => onAction('panel', card)}>
              {card.cardNo}
            </ActionLink>
            <span className="fs-12 text-muted d-block">{card.template}</span>
          </td>
        ) : null}
        {columns.generatedOn ? (
          <td>
            <span className={`d-block ${card.generated.dateClass} text-nowrap`}>
              {card.generated.date}
            </span>
            {card.generated.ago ? (
              <span className="fs-12 text-muted d-block text-nowrap">{card.generated.ago}</span>
            ) : null}
            <span className={`fs-12 ${card.generated.noteClass} text-nowrap`}>
              {card.generated.note}
            </span>
          </td>
        ) : null}
        {columns.issueDate ? (
          <td>
            <span className={`d-block ${card.issue.dateClass} text-nowrap`}>{card.issue.date}</span>
            {card.issue.ago ? (
              <span className="fs-12 text-muted d-block text-nowrap">{card.issue.ago}</span>
            ) : null}
            <span className={`fs-12 ${card.issue.noteClass} text-nowrap`}>{card.issue.note}</span>
          </td>
        ) : null}
        {columns.cardStatus ? (
          <td>
            <span className={`dt-pill ${card.cardStatus.pill}`}>
              <span className="dt-pill-dot" />
              {card.cardStatus.label}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{card.cardStatus.note}</span>
          </td>
        ) : null}
        {columns.issueStatus ? (
          <td>
            <span className={`badge ${card.issueStatus.badge}`}>{card.issueStatus.label}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">
              {card.issueStatus.note}
            </span>
          </td>
        ) : null}
        <td>
          <div className="dt-actions">
            <ActionLink
              className="dt-ib"
              ariaLabel="Preview ID card"
              onClick={() => onAction('preview', card)}
            >
              <i className="ti ti-eye" />
            </ActionLink>
            <ActionLink
              className="dt-ib"
              ariaLabel="Generate ID card"
              onClick={() => onAction('generate', card)}
            >
              <i className="ti ti-id" />
            </ActionLink>
            <ActionLink
              className="dt-ib success"
              ariaLabel="Print ID card"
              onClick={() => onAction('print', card)}
            >
              <i className="ti ti-printer" />
            </ActionLink>
            <ActionLink
              className="dt-ib"
              ariaLabel="Issue ID card"
              onClick={() => onAction('issue', card)}
            >
              <i className="ti ti-circle-check" />
            </ActionLink>
            <ActionLink
              className="dt-ib danger"
              ariaLabel="Replace lost card"
              onClick={() => onAction('replace', card)}
            >
              <i className="ti ti-refresh" />
            </ActionLink>
          </div>
        </td>
      </tr>

      <tr className={`dt-detail${expanded ? ' open' : ''}`}>
        <td colSpan={visibleColumns + 3}>
          <div className={`collapse${expanded ? ' show' : ''}`} id={card.id}>
            <div className="p-4">
              <div className="row g-4">
                {/* Student Profile */}
                <div className="col-xl-3 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-user text-primary me-1" />
                    Student Profile
                  </h6>
                  {detail.profile.map((row, index) => (
                    <InfoRow key={row.label} row={row} last={index === detail.profile.length - 1} />
                  ))}
                </div>

                {/* ID Card Preview */}
                <div className="col-xl-3 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-id text-info me-1" />
                    ID Card Preview
                  </h6>
                  {detail.proof ? (
                    <div className="border rounded p-3">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span
                          className={`avatar avatar-lg ${detail.proof.avatarTint} rounded flex-shrink-0`}
                        >
                          <i className="ti ti-user fs-20" />
                        </span>
                        <div className="overflow-hidden">
                          <h6 className="fs-14 mb-0 text-truncate">{detail.proof.name}</h6>
                          <span className="fs-12 text-muted d-block">
                            {detail.proof.classSection}
                          </span>
                        </div>
                        <span className={`badge ${detail.proof.houseBadge} ms-auto`}>
                          {detail.proof.house}
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fs-12 text-muted">Admission No.</span>
                        <span className="fs-13 fw-medium">{detail.proof.admissionNo}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fs-12 text-muted">Card No.</span>
                        <span className="fs-13 fw-medium">{detail.proof.cardNo}</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="fs-12 text-muted">Valid To</span>
                        <span className="fs-13 fw-medium">{detail.proof.validTo}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 border-top pt-2">
                        <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                          <i className="ti ti-qrcode" />
                        </span>
                        <span className="fs-12 text-muted text-truncate">{detail.proof.barcode}</span>
                      </div>
                    </div>
                  ) : null}
                  {detail.proofEmpty ? <Placeholder block={detail.proofEmpty} /> : null}
                </div>

                {/* Card Information */}
                <div className="col-xl-3 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-file-description text-warning me-1" />
                    Card Information
                  </h6>
                  {detail.cardInfo.map((row, index) => (
                    <InfoRow key={row.label} row={row} last={index === detail.cardInfo.length - 1} />
                  ))}
                </div>

                {/* Print History */}
                <div className="col-xl-3 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-printer text-purple me-1" />
                    Print History
                  </h6>
                  {detail.printEntries.map((entry) => (
                    <HistoryEntry key={entry.title} entry={entry} />
                  ))}
                  {detail.printRuns ? (
                    <InfoRow row={{ label: 'Print Runs', value: detail.printRuns }} last />
                  ) : null}
                  {detail.printEmpty ? <Placeholder block={detail.printEmpty} /> : null}
                </div>

                {/* Issue History */}
                <div className="col-xl-3 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-circle-check text-success me-1" />
                    Issue History
                  </h6>
                  {detail.issueEntries.map((entry) => (
                    <HistoryEntry key={entry.title} entry={entry} />
                  ))}
                  {detail.issuedOn ? (
                    <InfoRow row={{ label: 'Issued On', value: detail.issuedOn }} last />
                  ) : null}
                  {detail.issueEmpty ? <Placeholder block={detail.issueEmpty} /> : null}
                </div>

                {/* Replacement Records */}
                <div className="col-xl-3 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-refresh text-danger me-1" />
                    Replacement Records
                  </h6>
                  {detail.replacementRows.map((row, index) => (
                    <InfoRow
                      key={row.label}
                      row={row}
                      last={index === detail.replacementRows.length - 1}
                    />
                  ))}
                  {detail.replacementEntry ? <HistoryEntry entry={detail.replacementEntry} /> : null}
                  {detail.replacementEmpty ? <Placeholder block={detail.replacementEmpty} /> : null}
                </div>

                {/* QR & Barcode Details */}
                <div className="col-xl-3 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-qrcode text-secondary me-1" />
                    QR &amp; Barcode Details
                  </h6>
                  {detail.qrRows.map((row, index) => (
                    <InfoRow key={row.label} row={row} last={index === detail.qrRows.length - 1} />
                  ))}
                  {detail.qrEmpty ? <Placeholder block={detail.qrEmpty} /> : null}
                </div>

                {/* Internal Notes */}
                <div className="col-xl-3 col-md-6">
                  <h6 className="fs-14 mb-3">
                    <i className="ti ti-note text-secondary me-1" />
                    Internal Notes
                  </h6>
                  <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                    {detail.noteBadges.map((badge) => (
                      <span className={`badge ${badge.className}`} key={badge.label}>
                        {badge.label}
                      </span>
                    ))}
                  </div>
                  <p className="fs-13 text-muted mb-3">{detail.note}</p>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    {detail.actions.map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        className={action.className}
                        onClick={() => onAction(action.action, card)}
                      >
                        <i className={`${action.icon} me-1`} />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </Fragment>
  );
};

export default IdCardRow;
