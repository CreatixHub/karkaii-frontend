import { skills } from '../../data/alumniProfile.data';

const SkillsPane = () => (
  <div>
    <h5 className="mb-3">Skills</h5>
    {skills.map((skill) => (
      <span className="badge badge-light text-dark me-2 mb-2" key={skill}>
        {skill}
      </span>
    ))}
  </div>
);

export default SkillsPane;
