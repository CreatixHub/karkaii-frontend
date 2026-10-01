import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ClassroomIntelligence from './components/ClassroomIntelligence';
import CoachingCenter from './components/CoachingCenter';
import CommandCenter from './components/CommandCenter';
import ExplainableAi from './components/ExplainableAi';
import GrowthCenter from './components/GrowthCenter';
import InsightCenter from './components/InsightCenter';
import IntelligenceCenter from './components/IntelligenceCenter';
import JourneyPath from './components/JourneyPath';
import SectionBand from './components/SectionBand';
import TeacherCard from './components/TeacherCard';
import TeachingCopilot from './components/TeachingCopilot';
import type { StageAction } from './data/productivity.data';
import type { TeacherModalId } from './data/modals.data';
import type { ProductivityTeacher } from './data/teachers.data';
import { TOTAL_TEACHERS, departments, teachers } from './data/teachers.data';
import TeacherProductivityModals from './modals/TeacherProductivityModals';
import TeacherWorkspace from './modals/TeacherWorkspace';

const routes = all_routes;

const AiTeacherProductivity = () => {
  const [department, setDepartment] = useState(departments[0]);
  const [departmentOpen, setDepartmentOpen] = useState(false);

  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspaceTeacher, setWorkspaceTeacher] = useState<ProductivityTeacher>(teachers[0]);

  const [activeModal, setActiveModal] = useState<TeacherModalId | null>(null);
  const [modalTeacher, setModalTeacher] = useState<ProductivityTeacher>(teachers[0]);

  const { toasts, push, dismiss } = useToasts();

  // The template's department dropdown was decorative; it filters the grid now.
  const shown = useMemo(
    () =>
      department === departments[0]
        ? teachers
        : teachers.filter((teacher) => teacher.department === department),
    [department],
  );

  const openWorkspace = useCallback((teacher: ProductivityTeacher) => {
    setActiveModal(null);
    setWorkspaceTeacher(teacher);
    setWorkspaceOpen(true);
  }, []);

  const openModal = useCallback((modal: TeacherModalId, teacher?: ProductivityTeacher) => {
    setModalTeacher(teacher ?? teachers[0]);
    setActiveModal(modal);
  }, []);

  const runStageAction = useCallback(
    (target: StageAction['target']) => {
      if (target === 'workspace') openWorkspace(teachers[0]);
      else openModal(target);
    },
    [openModal, openWorkspace],
  );

  // Close the department menu on an outside click, as Bootstrap's dropdown does.
  useEffect(() => {
    if (!departmentOpen) return;
    const close = () => setDepartmentOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [departmentOpen]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Teacher Productivity Center
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.aiCommandCenter}>AI</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teacher Productivity
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  aria-expanded={departmentOpen}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => setDepartmentOpen((open) => !open)}
                >
                  <i className="ti ti-building me-2" />
                  {department}
                </button>
                <ul className={`dropdown-menu dropdown-menu-end p-3${departmentOpen ? ' show' : ''}`}>
                  {departments.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className={`dropdown-item rounded-1${department === item ? ' active' : ''}`}
                        onClick={() => {
                          setDepartment(item);
                          setDepartmentOpen(false);
                        }}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openWorkspace(teachers[0])}
              >
                <i className="ti ti-layout-sidebar-right-expand me-1" />
                Open Workspace
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* 1. AI Teaching Command Center */}
          <CommandCenter onAction={runStageAction} />
          {/* /AI Teaching Command Center */}

          {/* 2. Teacher Intelligence Workspace */}
          <SectionBand
            n="02"
            title="Teacher Intelligence Workspace"
            sub="Every teacher the engine reviewed, with the profile it built rather than a ranking."
          >
            <button
              type="button"
              className="btn btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => openModal('compare_teachers')}
            >
              <i className="ti ti-git-compare me-1" />
              Compare teachers
            </button>
          </SectionBand>

          <div className="row g-4">
            {shown.map((teacher) => (
              <TeacherCard
                key={teacher.id}
                teacher={teacher}
                onOpenWorkspace={openWorkspace}
                onOpenModal={openModal}
              />
            ))}
          </div>

          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-4 mb-5">
            <span className="fs-13 text-muted">
              Showing <span className="fw-medium text-dark">{shown.length}</span> of{' '}
              <span className="fw-medium text-dark">{TOTAL_TEACHERS}</span> teachers
            </span>
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center"
              onClick={() => openModal('all_teachers')}
            >
              <i className="ti ti-layout-list me-1" />
              View All Teachers
            </button>
          </div>
          {/* /Teacher Intelligence Workspace */}

          {/* 3. Explainable AI */}
          <SectionBand
            n="03"
            title="Why the AI Reached These Findings"
            sub="Six findings, each recorded the way an appraisal note would be: reasoning, evidence, impact, then what to do."
          />
          <ExplainableAi onOpenModal={openModal} />
          {/* /Explainable AI */}

          {/* 4. Teaching Intelligence Center */}
          <SectionBand
            n="04"
            title="Teaching Intelligence Center"
            sub="Nine dimensions the engine models school-wide. The ring shows where each currently stands."
          />
          <IntelligenceCenter />
          {/* /Teaching Intelligence Center */}

          {/* 5. AI Coaching Center */}
          <SectionBand
            n="05"
            title="AI Coaching Center"
            sub="Coaching, not appraisal. Ranked by what each returns against the time it asks of a teacher."
          />
          <CoachingCenter onOpenModal={openModal} />
          {/* /AI Coaching Center */}

          {/* 6. Classroom Intelligence */}
          <SectionBand
            n="06"
            title="Classroom Intelligence"
            sub="What the engine noticed across every classroom that no single observation would show."
          />
          <ClassroomIntelligence />
          {/* /Classroom Intelligence */}

          {/* 7. AI Teaching Copilot */}
          <SectionBand
            n="07"
            title="Teaching Copilot"
            sub="Seven things the copilot can draft from the review record. Everything arrives as a draft for you to edit."
          />
          <TeachingCopilot onOpenModal={openModal} />
          {/* /AI Teaching Copilot */}

          {/* 8. Teaching Journey */}
          <SectionBand
            n="08"
            title="Teaching Journey"
            sub="The full arc of one coaching case, from the first engine review to the point it closes."
          />
          <div className="card mb-5">
            <div className="card-body">
              <JourneyPath />
            </div>
          </div>
          {/* /Teaching Journey */}

          {/* 9. Professional Growth Center */}
          <SectionBand
            n="09"
            title="Professional Growth Center"
            sub="Where the teaching staff stands on development, credentials and readiness."
          />
          <GrowthCenter />
          {/* /Professional Growth Center */}

          {/* 10. AI Insight Center */}
          <SectionBand
            n="10"
            title="AI Insight Center"
            sub="Seven conclusions drawn across all 42 teachers, written as intelligence rather than as figures."
          />
          <InsightCenter />
          {/* /AI Insight Center */}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Teacher Intelligence Workspace (single, reusable) */}
      <TeacherWorkspace
        open={workspaceOpen}
        teacher={workspaceTeacher}
        onClose={() => setWorkspaceOpen(false)}
        onOpenModal={openModal}
      />

      {/* The page's nine dialogs */}
      <TeacherProductivityModals
        active={activeModal}
        teacher={modalTeacher}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onOpenModal={openModal}
        onOpenWorkspace={openWorkspace}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="tchToast" />
    </>
  );
};

export default AiTeacherProductivity;
