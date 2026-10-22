import { useState } from 'react';

export interface InterviewPaneProps {
  onSchedule: () => void;
  onSaveFeedback: (score: string, remarks: string) => void;
}

const InterviewPane = ({ onSchedule, onSaveFeedback }: InterviewPaneProps) => {
  const [score, setScore] = useState('');
  const [remarks, setRemarks] = useState('');

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0">Interview Schedule</h5>
        <button type="button" className="btn btn-sm btn-primary" onClick={onSchedule}>
          <i className="ti ti-calendar-event me-1" />
          Schedule
        </button>
      </div>
      <div className="alert alert-info d-flex align-items-center" role="alert">
        <i className="ti ti-info-circle me-2" />
        <span>No interview has been scheduled yet.</span>
      </div>
      <h6 className="mb-2">Panel Feedback</h6>
      <div className="mb-3">
        <label className="form-label" htmlFor="score-out-of-10">
          Score (out of 10)
        </label>
        <input
          type="number"
          className="form-control"
          placeholder="0"
          min={0}
          max={10}
          id="score-out-of-10"
          value={score}
          onChange={(event) => setScore(event.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor="remarks">
          Remarks
        </label>
        <textarea
          rows={3}
          className="form-control"
          placeholder="Interview remarks"
          id="remarks"
          value={remarks}
          onChange={(event) => setRemarks(event.target.value)}
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={() => onSaveFeedback(score, remarks)}>
        Save Feedback
      </button>
    </div>
  );
};

export default InterviewPane;
