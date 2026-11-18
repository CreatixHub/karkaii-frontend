import type { LiveProfile } from '../data/teacherProfileLive';

export interface TeacherDetailsSummaryProps {
  profile: LiveProfile;
}

const TeacherDetailsSummary = ({ profile }: TeacherDetailsSummaryProps) => {
  const cards = [
    {
      id: 'sections',
      tone: 'bg-primary-transparent text-primary',
      icon: 'ti ti-school',
      label: 'Classes Assigned',
      value: String(profile.sectionCount),
    },
    {
      id: 'subjects',
      tone: 'bg-success-transparent text-success',
      icon: 'ti ti-book',
      label: 'Subjects Taught',
      value: String(profile.subjectCount),
    },
    {
      id: 'experience',
      tone: 'bg-warning-transparent text-warning',
      icon: 'ti ti-award',
      label: 'Experience',
      value: profile.experience,
    },
    {
      id: 'employment',
      tone: 'bg-info-transparent text-info',
      icon: 'ti ti-briefcase',
      label: 'Employment',
      value: profile.employmentType,
    },
  ];

  return (
    <div className="row g-3 mb-3">
      {cards.map((card) => (
        <div className="col-12 col-md-6 col-xl-3 d-flex" key={card.id}>
          <div className="card card-hover w-100 mb-0">
            <div className="card-body p-3">
              <span className={`avatar avatar-md ${card.tone} rounded-circle flex-shrink-0 mb-2`}>
                <i className={`${card.icon} fs-20`} />
              </span>
              <p className="mb-1 text-muted fs-12">{card.label}</p>
              <h5 className="mb-0 fs-15">{card.value}</h5>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherDetailsSummary;