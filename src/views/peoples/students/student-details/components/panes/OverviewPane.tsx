import { BlockHeading, ChipSet, MetaList } from '../primitives';
import { academicInformation, profileState } from '../../data/studentProfile.data';

const SUBJECTS = ['English', 'Mathematics', 'Science', 'History', 'Geography', 'Physical Ed.'];
const ELECTIVES = ['Computer Science', 'Music', 'Art & Craft'];

const OverviewPane = () => (
  <div id="profile-pane-overview" className="tab-pane-block active" data-pane="overview" role="tabpanel">
    <BlockHeading icon="ti ti-info-circle">Academic Information</BlockHeading>
    <MetaList rows={academicInformation} className="mb-3" />

    {profileState.live ? null : (
      <>
        <BlockHeading icon="ti ti-book">Subjects</BlockHeading>
        <ChipSet chips={SUBJECTS.map((label) => ({ label, solid: true }))} className="mb-3" />

        <BlockHeading icon="ti ti-star">Elective Subjects</BlockHeading>
        <ChipSet chips={ELECTIVES.map((label) => ({ label }))} />
      </>
    )}
  </div>
);

export default OverviewPane;