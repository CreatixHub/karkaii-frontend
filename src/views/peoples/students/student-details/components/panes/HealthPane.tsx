import { BlockHeading, ProfileEvent, ProfileRemark } from '../primitives';
import type { ProfileAction } from '../../data/studentProfileActions';

const VITALS = [
  { id: 'height', accent: 'accent-danger', icon: 'ti ti-ruler-2', value: '142', unit: 'cm', label: 'Height' },
  { id: 'weight', accent: 'accent-info', icon: 'ti ti-weight', value: '36', unit: 'kg', label: 'Weight' },
  { id: 'bmi', accent: 'accent-success', icon: 'ti ti-heartbeat', value: '17.9', label: 'BMI · Normal' },
  { id: 'blood', accent: 'accent-danger', icon: 'ti ti-droplet', value: 'O+', label: 'Blood Group' },
  { id: 'vision', accent: 'accent-warning', icon: 'ti ti-eye', value: '6 / 6', label: 'Vision' },
  { id: 'dental', accent: 'accent-purple', icon: 'ti ti-dental', value: 'Good', label: 'Dental' },
];

const IMMUNIZATION = [
  { vaccine: 'MMR', dose: '2 of 2', date: '14 Apr 2021', pill: 'ok', icon: 'ti ti-check', status: 'Completed' },
  { vaccine: 'DPT Booster', dose: 'Booster', date: '09 Sep 2022', pill: 'ok', icon: 'ti ti-check', status: 'Completed' },
  { vaccine: 'Hepatitis B', dose: '3 of 3', date: '21 Jan 2020', pill: 'ok', icon: 'ti ti-check', status: 'Completed' },
  { vaccine: 'Influenza (annual)', dose: '2024–25', date: 'Due 15 Aug 2025', pill: 'warn', icon: 'ti ti-clock', status: 'Due Soon' },
  { vaccine: 'Typhoid', dose: 'Booster', date: 'Overdue', pill: 'bad', icon: 'ti ti-alert-triangle', status: 'Overdue' },
];

const CONDITIONS = [
  { id: 'peanut', severity: 'sev-high', icon: 'ti ti-nut', title: 'Peanut Allergy', detail: 'Severe · anaphylaxis risk', pill: 'bad', level: 'High' },
  { id: 'asthma', severity: 'sev-mid', icon: 'ti ti-lungs', title: 'Asthma', detail: 'Mild · exercise-induced', pill: 'warn', level: 'Medium' },
  { id: 'myopia', severity: 'sev-low', icon: 'ti ti-eyeglass', title: 'Myopia', detail: 'Corrected with lenses', pill: 'info', level: 'Low' },
];

const CHECKUPS = [
  { id: 'annual', tone: 'sub-teal', date: { day: '12', month: 'Nov' }, title: 'Annual Health Screening', detail: 'Height/weight normal · vision 6/6 · no concerns', pill: 'ok', status: 'Cleared' },
  { id: 'dental', tone: 'sub-green', date: { day: '18', month: 'Aug' }, title: 'Dental Camp', detail: 'No cavities · routine cleaning advised', pill: 'ok', status: 'Healthy' },
  { id: 'sickbay', tone: 'sub-amber', date: { day: '02', month: 'Jul' }, title: 'Sick Bay Visit', detail: 'Mild fever · sent home · recovered', pill: 'warn', status: 'Resolved' },
];

const STEPS = [
  { n: '1', title: 'Allergic Reaction', text: 'Administer EpiPen from bag, call school nurse & parent immediately.' },
  { n: '2', title: 'Asthma Attack', text: 'Use Salbutamol inhaler, keep upright, monitor breathing.' },
  { n: '3', title: 'Escalation', text: 'If no improvement in 5 min, call emergency services (911).' },
];

export interface HealthPaneProps {
  onAction: (action: ProfileAction) => void;
  onDownloadDoc: (name: string) => void;
}

const HealthPane = ({ onAction, onDownloadDoc }: HealthPaneProps) => (
  <div id="profile-pane-health" className="tab-pane-block active" data-pane="health" role="tabpanel">
    <div className="profile-tile-head mb-3">
      <BlockHeading icon="ti ti-heartbeat" className="mb-0" sub="Last checkup 12 Nov 2024">
        Health &amp; Wellness{' '}
      </BlockHeading>
      <div className="d-flex gap-2 flex-wrap">
        <button
          type="button"
          className="profile-button profile-button-sm"
          onClick={() => onDownloadDoc('Health Card')}
        >
          <i className="ti ti-download" />
          Health Card
        </button>
        <button
          type="button"
          className="profile-button profile-button-sm"
          onClick={() => onAction('call')}
        >
          <i className="ti ti-phone" />
          Call Nurse
        </button>
      </div>
    </div>

    {/* Emergency banner */}
    <div className="emergency mb-4">
      <span className="avatar avatar-icon bg-danger">
        <i className="ti ti-urgent" />
      </span>
      <div className="emergency-body">
        <b>Emergency Protocol · Allergy Alert</b>
        <span>
          Severe <strong>peanut allergy</strong> — carries EpiPen. Mild asthma (inhaler in bag).
          Blood group <strong>O+</strong>.
        </span>
      </div>
      <div className="emergency-contact">
        <div>
          <span className="l">Emergency Contact</span>
          <b>Robert Daniel · +1 809 095 5468</b>
        </div>
        <button
          type="button"
          className="profile-button profile-button-sm profile-button-primary"
          onClick={() => onAction('call')}
        >
          <i className="ti ti-phone-call" />
          Call
        </button>
      </div>
    </div>

    <BlockHeading icon="ti ti-activity-heartbeat">Vitals &amp; Measurements</BlockHeading>
    <div className="vital-group mb-4">
      {VITALS.map((vital) => (
        <div className="vital" key={vital.id}>
          <span className={`ic ${vital.accent}`}>
            <i className={vital.icon} />
          </span>
          <div className="tx">
            <b>
              {vital.value} {vital.unit ? <small>{vital.unit}</small> : null}
            </b>
            <span>{vital.label}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="row g-3 mb-4">
      <div className="col-12 col-lg-12">
        <BlockHeading icon="ti ti-vaccine">Immunization History</BlockHeading>
        <div className="exam-table">
          <div className="exam-row vaccination-row head">
            <span>Vaccine</span>
            <span>Dose</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {IMMUNIZATION.map((row) => (
            <div className="exam-row vaccination-row" key={row.vaccine}>
              <span className="ex-name">{row.vaccine}</span>
              <span>{row.dose}</span>
              <span className="ex-date">{row.date}</span>
              <span>
                <span className={`profile-pill ${row.pill}`}>
                  <i className={row.icon} />
                  {row.status}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-12">
        <BlockHeading icon="ti ti-alert-hexagon">Allergies &amp; Conditions</BlockHeading>
        <div className="mb-3">
          {CONDITIONS.map((condition) => (
            <div className={`profile-condition ${condition.severity}`} key={condition.id}>
              <span className="avatar avatar-icon avatar-md bg-light text-muted">
                <i className={condition.icon} />
              </span>
              <div className="condition-body">
                <b>{condition.title}</b>
                <span>{condition.detail}</span>
              </div>
              <span className={`profile-pill ${condition.pill} ms-auto`}>{condition.level}</span>
            </div>
          ))}
        </div>

        <BlockHeading icon="ti ti-pill">Current Medication</BlockHeading>
        <div className="profile-condition sev-low">
          <span className="avatar avatar-icon avatar-md bg-light text-muted">
            <i className="ti ti-first-aid-kit" />
          </span>
          <div className="condition-body">
            <b>Salbutamol Inhaler</b>
            <span>As needed · in school bag</span>
          </div>
        </div>
      </div>
    </div>

    <BlockHeading icon="ti ti-stethoscope">Medical Checkup History</BlockHeading>
    <div className="mb-4">
      {CHECKUPS.map((checkup, index) => (
        <ProfileEvent
          key={checkup.id}
          tone={checkup.tone}
          className={index < CHECKUPS.length - 1 ? 'mb-2' : ''}
          date={checkup.date}
          title={checkup.title}
          detail={checkup.detail}
          end={<span className={`profile-pill ${checkup.pill} ms-auto`}>{checkup.status}</span>}
        />
      ))}
    </div>

    <BlockHeading icon="ti ti-list-check">Emergency Response Steps</BlockHeading>
    <div className="row g-3 mb-4">
      {STEPS.map((step) => (
        <div className="col-md-4" key={step.n}>
          <div className="profile-step">
            <span className="step-n">{step.n}</span>
            <div>
              <b>{step.title}</b>
              <p>{step.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    <ProfileRemark
      className="remark-teal"
      text="Overall healthy and active. Ensure influenza and typhoid boosters are updated before the new term. Allergy protocol is well managed by staff and family."
      author={{
        photo: 'assets/img/teachers/teacher-05.jpg',
        name: 'Dr. Anita Rao',
        role: 'School Medical Officer',
      }}
      end={
        <span className="profile-pill ok ms-auto">
          <i className="ti ti-calendar-check" />
          12 Nov 2024
        </span>
      }
    />
  </div>
);

export default HealthPane;
