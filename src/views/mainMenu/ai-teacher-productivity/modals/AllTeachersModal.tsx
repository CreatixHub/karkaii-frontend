import { useMemo, useState } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { AixModal } from './AixModal';
import type { ProductivityTeacher, TeacherSort } from '../data/teachers.data';
import {
  TOTAL_TEACHERS,
  departments,
  engagementOf,
  teacherSorts,
  teachers,
  teachingStyles,
  workloadOf,
} from '../data/teachers.data';

export interface AllTeachersModalProps {
  onClose: () => void;
  onOpenWorkspace: (teacher: ProductivityTeacher) => void;
  onExportAll: () => void;
}

const AllTeachersModal = ({ onClose, onOpenWorkspace, onExportAll }: AllTeachersModalProps) => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(departments[0]);
  const [style, setStyle] = useState(teachingStyles[0]);
  const [sort, setSort] = useState<TeacherSort>(teacherSorts[0]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return teachers
      .filter((teacher) => {
        if (term) {
          const haystack = [teacher.name, teacher.department, teacher.subjects]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(term)) return false;
        }
        if (department !== departments[0] && teacher.department !== department) return false;
        if (style !== teachingStyles[0] && teacher.style !== style) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'Sort: Engagement') return engagementOf(b) - engagementOf(a);
        if (sort === 'Sort: Workload') return workloadOf(b) - workloadOf(a);
        return b.score - a.score;
      });
  }, [search, department, style, sort]);

  return (
    <AixModal
      open
      onClose={onClose}
      id="all_teachers"
      eyebrow="Workspace"
      title="All Teachers"
      dialogClass="modal-xl"
      footer={
        <div className="modal-footer justify-content-between">
          <span className="fs-13 text-muted">
            Showing <span className="fw-medium text-dark">{rows.length}</span> of{' '}
            <span className="fw-medium text-dark">{TOTAL_TEACHERS}</span> teachers
          </span>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            onClick={onExportAll}
          >
            <i className="ti ti-file-export me-1" />
            Export all
          </button>
        </div>
      }
    >
      <div className="modal-body">
        <div className="row g-2 mb-3">
          <div className="col-lg-4 col-md-6">
            <div className="input-icon-start position-relative">
              <span className="input-icon-addon">
                <i className="ti ti-search" />
              </span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search teacher, department or subject"
                aria-label="Search teacher, department or subject"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="All departments"
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
            >
              {departments.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-3 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="All teaching styles"
              value={style}
              onChange={(event) => setStyle(event.target.value)}
            >
              {teachingStyles.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-lg-2 col-md-6">
            <select
              className="form-select lh-base"
              aria-label="Sort: Productivity"
              value={sort}
              onChange={(event) => setSort(event.target.value as TeacherSort)}
            >
              {teacherSorts.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Teacher</th>
                <th>Department</th>
                <th>Subjects</th>
                <th>Teaching style</th>
                <th>Score</th>
                <th>Engagement</th>
                <th>AI confidence</th>
                <th>Last review</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <span className="d-inline-flex align-items-center gap-2">
                      <span className="avatar avatar-xs avatar-rounded flex-shrink-0">
                        <ImageWithBasePath src={teacher.avatar} alt={teacher.name} />
                      </span>
                      <span className="fs-13 text-dark">{teacher.name}</span>
                    </span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{teacher.department}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{teacher.subjects}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{teacher.style}</span>
                  </td>
                  <td>
                    <span className="fs-13 fw-medium text-dark">{teacher.score}</span>
                  </td>
                  <td>
                    <span className="fs-13 text-dark">{engagementOf(teacher)}</span>
                  </td>
                  <td>
                    <span className="tch-pill is-ai">{teacher.confidence}%</span>
                  </td>
                  <td>
                    <span className="fs-13 text-muted">{teacher.reviewed}</span>
                  </td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => onOpenWorkspace(teacher)}
                    >
                      <i className="ti ti-layout-sidebar-right-expand me-1" />
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AixModal>
  );
};

export default AllTeachersModal;
