import { workflowRequestId, workflowSteps, warningNotices } from '../data/deleteRequest.data';

const ApprovalWorkflow = () => (
  <div className="closure-page">
    <div className="row g-3">
      {/* Approval Workflow */}
      <div className="col-12 col-xl-8 d-flex">
        <div className="card flex-fill mb-0">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
            <h5 className="mb-0 d-flex align-items-center">
              <i className="ti ti-route text-primary me-2" />
              Approval Workflow
            </h5>
            <span className="badge badge-soft-primary">Request {workflowRequestId}</span>
          </div>
          <div className="card-body">
            <div className="closure-flow">
              {workflowSteps.map((step) => (
                <div className={`closure-step ${step.state}`} key={step.id}>
                  <span className="closure-step-icon">
                    <i className={step.icon} />
                  </span>
                  <p className="closure-step-title">{step.title}</p>
                  <p className="closure-step-meta">{step.meta}</p>
                  <span className="closure-step-review">
                    <i className={step.reviewerIcon} />
                    {step.reviewer}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Warning panel */}
      <div className="col-12 col-xl-4 d-flex">
        <div className="warning-panel flex-fill">
          <div className="warning-panel-head">
            <span className="warning-panel-icon">
              <i className="ti ti-alert-triangle" />
            </span>
            <div>
              <h5 className="mb-0">Before You Approve</h5>
              <span className="fs-12 text-muted">Compliance &amp; data-protection notice</span>
            </div>
          </div>
          <ul className="warning-panel-list">
            {warningNotices.map((notice) => (
              <li key={notice.id}>
                <i className={notice.icon} />
                <span>
                  {notice.lead}
                  <b>{notice.strong}</b>
                  {notice.tail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default ApprovalWorkflow;
