import { Link, useLocation } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';

const routes = all_routes;

export interface SettingsIndexLink {
  to: string;
  icon: string;
  label: string;
}

export const SETTINGS_INDEX: SettingsIndexLink[] = [
  { to: routes.schoolProfile, icon: 'ti ti-building', label: 'School Profile' },
  { to: routes.academicYear, icon: 'ti ti-calendar', label: 'Academic Year' },
  { to: routes.classSettings, icon: 'ti ti-school', label: 'Class Settings' },
  { to: routes.subjectSettings, icon: 'ti ti-book', label: 'Subject Settings' },
  { to: routes.gradingRules, icon: 'ti ti-award', label: 'Grading Rules' },
  { to: routes.examSettings, icon: 'ti ti-file-certificate', label: 'Exam Settings' },
  { to: routes.paymentSettings, icon: 'ti ti-credit-card', label: 'Payment Settings' },
  { to: routes.themeSettings, icon: 'ti ti-palette', label: 'Theme Settings' },
  { to: routes.backupRestore, icon: 'ti ti-database', label: 'Backup & Restore' },
];

const SettingsIndexNav = () => {
  const { pathname } = useLocation();

  return (
    <div className="card settings-index-card flex-fill mb-3 mb-lg-0">
      <div className="card-header">
        <h4 className="mb-0 fs-16 fw-medium">Settings</h4>
      </div>
      <div className="settings-index-nav">
        {SETTINGS_INDEX.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`settings-index-link${pathname === link.to ? ' active' : ''}`}
          >
            <span className="settings-index-ic">
              <i className={link.icon} />
            </span>
            <span className="settings-index-label">{link.label}</span>
            <i className="ti ti-chevron-right settings-index-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SettingsIndexNav;
