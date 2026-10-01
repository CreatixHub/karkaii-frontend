import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

export type TeacherProfileTab = 'details' | 'routine' | 'leaves' | 'salary' | 'library';

const tabs: { id: TeacherProfileTab; label: string; icon: string; to: string }[] = [
  { id: 'details', label: 'Teacher Details', icon: 'ti ti-school', to: routes.teacherDetails },
  { id: 'routine', label: 'Routine', icon: 'ti ti-table-options', to: routes.teachersRoutine },
  { id: 'leaves', label: 'Leave & Attendance', icon: 'ti ti-calendar-due', to: routes.teacherLeaves },
  { id: 'salary', label: 'Salary', icon: 'ti ti-report-money', to: routes.teacherSalary },
  { id: 'library', label: 'Library', icon: 'ti ti-bookmark-edit', to: routes.teacherLibrary },
];

const TeacherProfileTabs = ({ current }: { current: TeacherProfileTab }) => (
  <ul className="nav nav-tabs nav-tabs-bottom mb-4">
    {tabs.map((tab) => (
      <li key={tab.id}>
        <Link to={tab.to} className={`nav-link${current === tab.id ? ' active' : ''}`}>
          <i className={`${tab.icon} me-2`} />
          {tab.label}
        </Link>
      </li>
    ))}
  </ul>
);

export default TeacherProfileTabs;
