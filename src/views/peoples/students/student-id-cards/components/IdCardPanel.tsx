import Offcanvas from '@components/ui/Offcanvas';
import {
  panelAudit,
  panelConfigurationRows,
  panelMilestones,
  panelReaders,
  panelStudentRows,
  panelTimeline,
} from '../data/idCardModals.data';
import type { LabelledValue, PanelEvent } from '../data/idCardModals.data';

const PanelRow = ({ row, last }: { row: LabelledValue; last: boolean }) => (
  <div className={`d-flex align-items-center justify-content-between ${last ? 'mb-0' : 'mb-2'}`}>
    <span className="fs-13 text-muted">{row.label}</span>
    {row.badge ? (
      <span className={`badge ${row.badge}`}>{row.value}</span>
    ) : (
      <span className="fs-13 fw-medium">{row.value}</span>
    )}
  </div>
);

const PanelEntry = ({ event, last }: { event: PanelEvent; last: boolean }) => (
  <div className={`d-flex align-items-center gap-2 border rounded p-2 ${last ? 'mb-3' : 'mb-2'}`}>
    <span className={`avatar avatar-sm ${event.tint} rounded flex-shrink-0`}>
      <i className={event.icon} />
    </span>
    <div className="flex-fill overflow-hidden">
      <h6 className="fs-13 mb-0">{event.title}</h6>
      <span className="fs-12 text-muted">{event.meta}</span>
    </div>
  </div>
);

export interface IdCardPanelProps {
  open: boolean;
  onClose: () => void;
  onPrint: () => void;
  onPreview: () => void;
}

const IdCardPanel = ({ open, onClose, onPrint, onPreview }: IdCardPanelProps) => (
  <Offcanvas open={open} onClose={onClose} title="ID Card Details" labelledById="id_panel_lbl">
    <h6 className="fs-14 mb-2">Student Information</h6>
    <div className="d-flex align-items-center mb-3">
      <span className="avatar avatar-lg bg-primary-transparent text-primary rounded flex-shrink-0">
        <i className="ti ti-school fs-20" />
      </span>
      <div className="ms-2">
        <h6 className="mb-0">Rohan Desai</h6>
        <span className="fs-12 text-muted">AD9889014 · Class IX · Section C</span>
      </div>
      <span className="badge badge-soft-info ms-auto">Replacement</span>
    </div>
    <div className="border rounded p-3 mb-3">
      {panelStudentRows.map((row, index) => (
        <PanelRow key={row.label} row={row} last={index === panelStudentRows.length - 1} />
      ))}
    </div>

    <h6 className="fs-14 mb-2">Card Preview</h6>
    <div className="border rounded p-3 mb-3">
      <div className="d-flex align-items-center gap-2 mb-3">
        <span className="avatar avatar-lg bg-primary-transparent text-primary rounded flex-shrink-0">
          <i className="ti ti-user fs-20" />
        </span>
        <div className="overflow-hidden">
          <h6 className="fs-14 mb-0">Rohan Desai</h6>
          <span className="fs-12 text-muted">Class IX · Section C</span>
        </div>
        <span className="badge badge-soft-primary ms-auto">Everest</span>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fs-12 text-muted">Card No.</span>
        <span className="fs-13 fw-medium">IDC-2026-0241</span>
      </div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="fs-12 text-muted">Valid To</span>
        <span className="fs-13 fw-medium">31 Mar 2027</span>
      </div>
      <div className="d-flex align-items-center gap-2 border-top pt-2">
        <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
          <i className="ti ti-qrcode" />
        </span>
        <span className="fs-12 text-muted">AD9889014-0241</span>
      </div>
    </div>

    <h6 className="fs-14 mb-2">Card Configuration</h6>
    <div className="border rounded p-3 mb-3">
      {panelConfigurationRows.map((row, index) => (
        <PanelRow key={row.label} row={row} last={index === panelConfigurationRows.length - 1} />
      ))}
    </div>

    <div className="row g-2 mb-3">
      {panelMilestones.map((milestone) => (
        <div className="col-4" key={milestone.id}>
          <div className="border rounded p-2 text-center">
            <span className="fs-12 text-muted d-block mb-1">{milestone.label}</span>
            <h6 className={milestone.valueClass}>{milestone.value}</h6>
          </div>
        </div>
      ))}
    </div>

    <h6 className="fs-14 mb-2">Issue Timeline</h6>
    {panelTimeline.map((event, index) => (
      <PanelEntry key={event.title} event={event} last={index === panelTimeline.length - 1} />
    ))}

    <h6 className="fs-14 mb-2">Verification Details</h6>
    <div className="table-responsive border rounded mb-3">
      <table className="table table-nowrap mb-0">
        <thead className="table-light">
          <tr>
            <th className="fs-13">Reader</th>
            <th className="fs-13">Scope</th>
            <th className="fs-13">Status</th>
          </tr>
        </thead>
        <tbody>
          {panelReaders.map((row) => (
            <tr key={row.reader}>
              <td className="fs-13">{row.reader}</td>
              <td className="fs-13">{row.scope}</td>
              <td>
                <span className={`badge ${row.badge}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <h6 className="fs-14 mb-2">Audit History</h6>
    {panelAudit.map((event, index) => (
      <PanelEntry key={event.title} event={event} last={index === panelAudit.length - 1} />
    ))}

    <div className="d-flex gap-2">
      <button type="button" className="btn btn-primary flex-fill" onClick={onPrint}>
        <i className="ti ti-printer me-1" />
        Print Card
      </button>
      <button type="button" className="btn btn-outline-light bg-white" onClick={onPreview}>
        <i className="ti ti-photo me-1" />
        Preview
      </button>
    </div>
  </Offcanvas>
);

export default IdCardPanel;
