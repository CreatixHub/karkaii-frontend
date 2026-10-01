import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

import { SidebarData } from "../../data/json/sidebarData";
import { schoolWorkspaces } from "../../data/json/sidebarBrandData";
import ImageWithBasePath from "../imageWithBasePath";
import { setExpandMenu } from "../../data/redux/sidebarSlice";
import {
  resetAllMode,
  setDataLayout,
  setDataTheme,
} from "../../data/redux/themeSettingSlice";
import usePreviousRoute from "./usePreviousRoute";
import { all_routes } from "@/routes/all_routes";
import "../../../style/icon/tabler-icons/webfont/tabler-icons.css";

type MenuItem = {
  label: string;
  icon?: string;
  badge?: string;
  submenu?: boolean;
  submenuItems?: MenuItem[];
  link?: string;
  external?: boolean;
  themeSetting?: boolean;
};

type MenuSection = {
  label: string;
  submenuHdr?: string;
  submenuItems: MenuItem[];
};

const sections = SidebarData as unknown as MenuSection[];

/**
 * What each layout demo link applies. `dark_data_theme` lives in `dataTheme`,
 * not `dataLayout`, so the two are dispatched separately — sending it through
 * `setDataLayout` leaves `data-theme` untouched and blanks `data-layout`.
 *
 * Default clears the theme as well, so returning to it from Dark restores the
 * light palette; the other layouts share `dataLayout` and so replace each other.
 */
const LAYOUT_DEMO: Record<string, { layout?: string; theme?: string }> = {
  Default: { layout: "default_layout", theme: "default_data_theme" },
  Mini: { layout: "mini_layout" },
  Box: { layout: "boxed_layout" },
  Dark: { theme: "dark_data_theme" },
  RTL: { layout: "rtl" },
};

/**
 * Every label on the path from a section down to `pathname`.
 * Used to auto-open the branch containing the active route, matching the
 * `subdrop`/`active` behaviour of the template's script.js.
 */
const findActiveTrail = (items: MenuItem[], pathname: string): string[] => {
  for (const item of items) {
    if (item.link && !item.external && item.link === pathname) return [item.label];
    if (item.submenuItems) {
      const rest = findActiveTrail(item.submenuItems, pathname);
      if (rest.length) return [item.label, ...rest];
    }
  }
  return [];
};

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const previousLocation = usePreviousRoute();
  const routes = all_routes;

  // Labels of every currently expanded submenu, at any depth.
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const activeTrail = useMemo(() => {
    for (const section of sections) {
      const trail = findActiveTrail(section.submenuItems, location.pathname);
      if (trail.length) return trail;
    }
    return [];
  }, [location.pathname]);

  // Open the branch that contains the active route on navigation.
  useEffect(() => {
    if (activeTrail.length) setOpenMenus(activeTrail.slice(0, -1));
  }, [activeTrail]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    document.querySelector(".main-wrapper")?.classList.remove("slide-nav");
  }, [location.pathname]);

  // Leaving a layout demo page resets the theme overrides it applied.
  useEffect(() => {
    const layoutPages = [
      routes.layoutDark,
      routes.layoutRtl,
      routes.layoutMini,
      routes.layoutBox,
      routes.layoutDefault,
    ];
    const isCurrent = layoutPages.some((p) => location.pathname.includes(p));
    const wasPrevious =
      previousLocation &&
      layoutPages.some((p) => previousLocation.pathname.includes(p));
    if (wasPrevious && !isCurrent) dispatch(resetAllMode());
  }, [location, previousLocation, dispatch, routes]);

  const toggleMenu = (label: string, depth: number) => {
    setOpenMenus((prev) => {
      // Accordion: only one branch open per depth.
      const next = prev.slice(0, depth);
      return prev[depth] === label ? next : [...next, label];
    });
  };

  const onMouseEnter = () => dispatch(setExpandMenu(true));
  const onMouseLeave = () => dispatch(setExpandMenu(false));

  const renderItems = (items: MenuItem[], depth: number) =>
    items.map((item) => {
      const hasSub = Boolean(item.submenuItems?.length);
      const isOpen = openMenus[depth] === item.label;
      const isActive = activeTrail[depth] === item.label;

      // Arrow class differs per nesting level, matching the template markup.
      const arrowClass =
        depth === 0
          ? "menu-arrow"
          : depth === 1
          ? "menu-arrow inside-submenu"
          : "menu-arrow inside-submenu inside-submenu-two";

      // li class differs per nesting level, matching the template markup.
      const liClass = !hasSub
        ? ""
        : depth === 0
        ? "submenu"
        : depth === 1
        ? "submenu submenu-two"
        : "submenu submenu-two submenu-three";

      const anchorClass = [
        hasSub && isOpen ? "subdrop" : "",
        isActive ? "active" : "",
        depth > 0 && !hasSub ? "" : "",
      ]
        .filter(Boolean)
        .join(" ");

      if (item.external) {
        return (
          <li key={item.label}>
            <a href={item.link} target="_blank" rel="noreferrer">
              {item.icon && <i className={item.icon} />}
              <span>{item.label}</span>
              {item.badge && (
                <span className="badge-soft-bordered ms-auto">{item.badge}</span>
              )}
            </a>
          </li>
        );
      }

      return (
        <li className={liClass} key={item.label}>
          <Link
            to={hasSub ? "#" : item.link || "#"}
            className={anchorClass}
            aria-current={!hasSub && isActive ? "page" : undefined}
            onClick={() => {
              if (hasSub) toggleMenu(item.label, depth);
              if (item.themeSetting) {
                const demo = LAYOUT_DEMO[item.label];
                if (demo?.layout) dispatch(setDataLayout(demo.layout));
                if (demo?.theme) dispatch(setDataTheme(demo.theme));
              }
            }}
          >
            {item.icon && <i className={item.icon} />}
            <span>{item.label}</span>
            {item.badge && (
              <span className="badge-soft-bordered ms-auto">{item.badge}</span>
            )}
            {hasSub && <span className={arrowClass} />}
          </Link>

          {hasSub && (
            <ul style={{ display: isOpen ? "block" : "none" }}>
              {renderItems(item.submenuItems as MenuItem[], depth + 1)}
            </ul>
          )}
        </li>
      );
    });

  return (
    <div
      className="sidebar"
      id="sidebar"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="sidebar-inner mui-native-scroll">
        <div id="sidebar-menu" className="sidebar-menu">
          {/* School workspace */}
          <div className="mui-side-brand dropdown">
            <button
              type="button"
              className="mui-brand-card dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Switch school"
            >
              <span className="mui-brand-logo">
                <ImageWithBasePath
                  src="assets/img/icons/global-img.svg"
                  alt="School"
                />
              </span>
              <span className="mui-brand-meta d-flex flex-column gap-1">
                <span className="mui-brand-name">Global International</span>
                <span className="mui-brand-sub">School Management</span>
              </span>
              <i className="ti ti-selector mui-brand-caret" />
            </button>
            <div className="dropdown-menu mui-brand-menu">
              <div className="mui-brand-head">Switch School</div>
              {schoolWorkspaces.map((school) => (
                <Link
                  key={school.name}
                  to={school.active ? routes.adminDashboard : "#"}
                  className={`mui-brand-item${school.active ? " active" : ""}`}
                >
                  {school.image ? (
                    <span className="mui-bi-logo">
                      <ImageWithBasePath src={school.image} alt="" />
                    </span>
                  ) : (
                    <span
                      className="mui-bi-logo mui-bi-letter"
                      style={{ "--bl": school.color } as React.CSSProperties}
                    >
                      {school.letter}
                    </span>
                  )}
                  <span className="mui-bi-meta">
                    <b>{school.name}</b>
                    <small>{school.campus}</small>
                  </span>
                  {school.active && <i className="ti ti-check mui-bi-check" />}
                </Link>
              ))}
              <div className="mui-brand-divider" />
              <Link to="#" className="mui-brand-add">
                <span className="mui-bi-add">
                  <i className="ti ti-plus" />
                </span>
                Add new school
              </Link>
            </div>
          </div>

          <nav aria-label="Main">
            <ul>
              {sections.map((section) => (
                <li key={section.label}>
                  <h6 className="submenu-hdr">
                    <span>{section.submenuHdr ?? section.label}</span>
                  </h6>
                  <ul>{renderItems(section.submenuItems, 0)}</ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar Footer — user profile */}
      <div className="mui-side-footer">
        <div className="dropdown">
          <button
            type="button"
            className="mui-side-user dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="Account menu"
          >
            <ImageWithBasePath
              src="assets/img/profiles/avatar-27.jpg"
              alt="User avatar"
            />
            <span className="mui-su-meta">
              <span className="mui-su-name">Kevin Larry</span>
              <span className="mui-su-role">Administrator</span>
            </span>
            <i className="ti ti-selector mui-su-caret" />
          </button>
          <div
            className="dropdown-menu dropdown-menu-end p-2"
            style={{ minWidth: 220 }}
          >
            <Link
              className="dropdown-item rounded-2 d-flex align-items-center"
              to={routes.profile}
            >
              <i className="ti ti-user-circle me-2" />
              My Profile
            </Link>
            <Link
              className="dropdown-item rounded-2 d-flex align-items-center"
              to={routes.profilesettings}
            >
              <i className="ti ti-settings me-2" />
              Settings
            </Link>
            <hr className="my-2" />
            <Link
              className="dropdown-item rounded-2 d-flex align-items-center text-danger"
              to={routes.login}
            >
              <i className="ti ti-logout me-2" />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
