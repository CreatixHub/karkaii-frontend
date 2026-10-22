import { aiRecords } from '../data/productivity.data';
import type { TeacherModalId } from '../data/modals.data';

export interface ExplainableAiProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const ExplainableAi = ({ onOpenModal }: ExplainableAiProps) => (
  <div className="mb-5">
    {aiRecords.map((record) => (
      <div className={`tch-record ${record.tone}`} key={record.id}>
        <div className="tch-record-head">
          <p className="tch-record-obs">
            <i className={`${record.icon} me-2 text-muted`} />
            {record.observation}
          </p>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className={`tch-pill ${record.verdictTone}`}>{record.verdict}</span>
            <span className="tch-pill is-ai">
              <i className="ti ti-sparkles" />
              {record.confidence}% confidence
            </span>
          </div>
        </div>

        <div className="tch-dl">
          <div className="tch-dt">AI reasoning</div>
          <p className="tch-dd">{record.reasoning}</p>

          <div className="tch-dt">Supporting evidence</div>
          <div className="tch-dd">
            {record.evidence.map((item) => (
              <span className="tch-ev" key={item}>
                <i className="ti ti-point-filled" />
                <span>{item}</span>
              </span>
            ))}
          </div>

          <div className="tch-dt">Impact</div>
          <p className="tch-dd">{record.impact}</p>

          <div className="tch-dt">Suggested improvement</div>
          <div className="tch-dd">
            <p className="mb-3">{record.improvement}</p>
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => onOpenModal('coaching_plan')}
            >
              <i className="ti ti-plus me-1" />
              Add to coaching plan
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ExplainableAi;
