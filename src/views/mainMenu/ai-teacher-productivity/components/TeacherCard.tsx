import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { TeacherModalId } from '../data/modals.data';
import type { ProductivityTeacher } from '../data/teachers.data';

export interface TeacherCardProps {
  teacher: ProductivityTeacher;
  onOpenWorkspace: (teacher: ProductivityTeacher) => void;
  onOpenModal: (modal: TeacherModalId, teacher: ProductivityTeacher) => void;
}

const TeacherCard = ({ teacher, onOpenWorkspace, onOpenModal }: TeacherCardProps) => (
  <div className="col-xl-4 col-md-6">
    <div className="tch-card">
      <div className="tch-card-head">
        <span className="avatar avatar-xl avatar-rounded flex-shrink-0">
          <ImageWithBasePath src={teacher.avatar} alt={teacher.name} />
        </span>
        <div className="overflow-hidden">
          <p className="tch-card-name text-truncate">{teacher.name}</p>
          <p className="fs-12 text-muted mb-0">{teacher.department}</p>
        </div>
        <span className="tch-card-score">
          <b>
            {teacher.score}
            <small>/100</small>
          </b>
        </span>
      </div>

      <div className="tch-card-body">
        <div className="d-flex flex-wrap gap-2">
          <span className="tch-pill">
            <i className="ti ti-book" />
            {teacher.subjects}
          </span>
          <span className="tch-pill is-note">
            <i className="ti ti-bulb" />
            {teacher.style}
          </span>
        </div>

        <div>
          <span className="tch-lbl mb-1">Teaching profile</span>
          {teacher.facets.map((facet) => (
            <span className="tch-facet" key={facet.label}>
              <span>{facet.label}</span>
              <span
                className={`tch-facet-bar ${facet.tone ? `${facet.tone} ` : ''}aix-p-${facet.value}`}
              />
              <b>{facet.value}</b>
            </span>
          ))}
        </div>

        <p className="fs-12 text-muted mb-0">
          <i className="ti ti-sparkles me-1 text-primary" />
          {teacher.note}
        </p>

        <div className="d-flex align-items-center justify-content-between gap-2 pt-3 border-top">
          <span className="tch-pill is-ai">
            <i className="ti ti-sparkles" />
            {teacher.confidence}% confidence
          </span>
          <span className="fs-12 text-muted">Reviewed {teacher.reviewed}</span>
        </div>
      </div>

      <div className="tch-card-foot">
        <button
          type="button"
          className="btn btn-sm btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
          onClick={() => onOpenWorkspace(teacher)}
        >
          <i className="ti ti-layout-sidebar-right-expand me-1" />
          Open AI Workspace
        </button>
        <span title="View teaching insights">
          <button
            type="button"
            className="tch-ico"
            aria-label="View teaching insights"
            onClick={() => onOpenWorkspace(teacher)}
          >
            <i className="ti ti-bulb" />
          </button>
        </span>
        <span title="Generate coaching plan">
          <button
            type="button"
            className="tch-ico"
            aria-label="Generate coaching plan"
            onClick={() => onOpenModal('coaching_plan', teacher)}
          >
            <i className="ti ti-route" />
          </button>
        </span>
        <span title="Compare teachers">
          <button
            type="button"
            className="tch-ico"
            aria-label="Compare teachers"
            onClick={() => onOpenModal('compare_teachers', teacher)}
          >
            <i className="ti ti-git-compare" />
          </button>
        </span>
      </div>
    </div>
  </div>
);

export default TeacherCard;
