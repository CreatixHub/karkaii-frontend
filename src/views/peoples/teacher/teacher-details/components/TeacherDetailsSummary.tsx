import { summaryCards } from '../data/teacherDetailsWorkspace.data';

const TeacherDetailsSummary = () => (
  <div className="row g-3 mb-3">
    {summaryCards.map((card) => (
      <div className="col-12 col-md-6 col-xl-3 d-flex" key={card.id}>
        <div className="card card-hover w-100 mb-0">
          <div className="card-body p-3">
            <span className={`avatar avatar-md ${card.tone} rounded-circle flex-shrink-0 mb-2`}>
              <i className={`${card.icon} fs-20`} />
            </span>
            <p className="mb-1 text-muted fs-12">{card.label}</p>
            {card.emphasis ? (
              <h5 className="mb-0 fs-15">{card.value}</h5>
            ) : (
              <h6 className="mb-0">{card.value}</h6>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default TeacherDetailsSummary;
