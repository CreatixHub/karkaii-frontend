import { BlockHeading, ChipSet, MetaList } from '../primitives';
import type { MetaRow } from '../../data/studentProfile.data';

const ACADEMIC_INFO: MetaRow[] = [
  { key: 'Admission Date', value: '18 Mar 2024' },
  { key: 'Admission No', value: 'AD1256589' },
  { key: 'Roll No', value: '35013' },
  { key: 'Class / Section', value: 'III - A' },
  { key: 'Batch', value: '2024 Morning' },
  { key: 'Academic Year', value: '2024 / 2025' },
  { key: 'House', value: 'Red House' },
  { key: 'Class Teacher', value: 'Mr. Teresa Susan' },
  { key: 'Previous School', value: 'Oxford Matriculation, TX' },
  { key: 'Roll of Honour', value: '3 times' },
];

const SUBJECTS = ['English', 'Mathematics', 'Science', 'History', 'Geography', 'Physical Ed.'];
const ELECTIVES = ['Computer Science', 'Music', 'Art & Craft'];

const OverviewPane = () => (
  <div id="profile-pane-overview" className="tab-pane-block active" data-pane="overview" role="tabpanel">
    <BlockHeading icon="ti ti-info-circle">Academic Information</BlockHeading>
    <MetaList rows={ACADEMIC_INFO} className="mb-3" />

    <BlockHeading icon="ti ti-book">Subjects</BlockHeading>
    <ChipSet chips={SUBJECTS.map((label) => ({ label, solid: true }))} className="mb-3" />

    <BlockHeading icon="ti ti-star">Elective Subjects</BlockHeading>
    <ChipSet chips={ELECTIVES.map((label) => ({ label }))} />
  </div>
);

export default OverviewPane;
