import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import {
  setDataLayout,
  setDataTheme,
} from "../../data/redux/themeSettingSlice";
import {
  setExpandMenu,
  setMobileSidebar,
} from "../../data/redux/sidebarSlice";
import ImageWithBasePath from "../imageWithBasePath";
import { all_routes } from "@/routes/all_routes";
import {
  academicYears,
  addNewActions,
  appTiles,
  currentAcademicYear,
  DOCS_URL,
  languages,
  messages,
  notifications,
} from "../../data/json/headerData";

const Header = () => {
  const routes = all_routes;
  const dispatch = useDispatch();
  const location = useLocation();

  const dataTheme = useSelector((state: any) => state.themeSetting.dataTheme);
  const dataLayout = useSelector((state: any) => state.themeSetting.dataLayout);
  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );

  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationTab, setNotificationTab] = useState("All");

  const isDark = dataTheme === "dark_data_theme";
  const unreadCount = notifications.filter((n) => n.unread).length;
  const unreadMessages = messages.filter((m) => m.unread > 0).length;

  const visibleNotifications = notifications.filter((n) =>
    notificationTab === "Unread" ? n.unread : true
  );

  const toggleMobileSidebar = () => dispatch(setMobileSidebar(!mobileSidebar));
  const onMouseEnter = () => dispatch(setExpandMenu(true));
  const onMouseLeave = () => dispatch(setExpandMenu(false));

  const handleToggleMiniSidebar = () => {
    const next = dataLayout === "mini_layout" ? "default_layout" : "mini_layout";
    dispatch(setDataLayout(next));
    localStorage.setItem("dataLayout", next);
  };

  const setTheme = (theme: "default_data_theme" | "dark_data_theme") =>
    dispatch(setDataTheme(theme));

  const openSearch = () =>
    document.dispatchEvent(new CustomEvent("mui-search-open"));

  return (
    <>
      {/* Header */}
      <div className="header">
        {/* Logo */}
        <div
          className="header-left active"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <Link to={routes.adminDashboard} className="logo logo-normal">
            <ImageWithBasePath src="assets/img/logo.svg" alt="Logo" />
          </Link>
          <Link to={routes.adminDashboard} className="logo-small">
            <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
          </Link>
          <Link to={routes.adminDashboard} className="dark-logo">
            <ImageWithBasePath src="assets/img/logo-dark.svg" alt="Logo" />
          </Link>
          <Link id="toggle_btn" to="#" onClick={handleToggleMiniSidebar}>
            <i className="ti ti-menu-deep" />
          </Link>
        </div>
        {/* /Logo */}

        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>

        <div className="header-user">
          <div className="nav user-menu">
            {/* Search */}
            <div className="nav-item nav-search-inputs me-auto">
              <div className="top-nav-search">
                <Link to="#" className="responsive-search" onClick={openSearch}>
                  <i className="fa fa-search" />
                </Link>
                <form
                  action="#"
                  className="dropdown"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="searchinputs" id="dropdownMenuClickable">
                    <input
                      type="text"
                      placeholder="Search students, staff, invoices..."
                      onFocus={openSearch}
                      readOnly
                    />
                    <div className="search-addon">
                      <span className="mui-search-kbd">
                        <span className="mui-kbd-key">&#8984;</span>
                        <span className="mui-kbd-key">K</span>
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* /Search */}

            <div className="d-flex align-items-center">
              {/* Academic Year */}
              <div className="dropdown me-2 mui-hide-sm d-none d-xxl-inline-flex">
                <Link
                  to="#"
                  className="top-year btn btn-outline-light fw-normal bg-white d-flex align-items-center p-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="ti ti-calendar-due me-1" />
                  Academic Year : {currentAcademicYear}
                </Link>
                <div className="dropdown-menu dropdown-menu-end ay-menu">
                  <div className="ay-head">
                    <h6>Academic Year</h6>
                    <span className="ay-sub">Switch the active session</span>
                  </div>
                  <div className="ay-list">
                    {academicYears.map((year) => (
                      <Link
                        key={year.year}
                        to="#"
                        className={`ay-item${year.active ? " active" : ""}`}
                      >
                        <span className="ay-ic">
                          <i
                            className={
                              year.active
                                ? "ti ti-calendar-star"
                                : "ti ti-calendar"
                            }
                          />
                        </span>
                        <span className="ay-txt">
                          <span className="ay-yr">{year.year}</span>
                          <span className="ay-st">{year.status}</span>
                        </span>
                        {year.active ? (
                          <span className="ay-badge">Active</span>
                        ) : (
                          <i className="ti ti-chevron-right ay-arrow" />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Language */}
              <div className="pe-1 ms-1">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white btn-icon d-flex align-items-center me-1 p-2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="lang-trigger-flag">
                      <ImageWithBasePath
                        src="assets/img/flags/us.png"
                        alt="Language"
                      />
                    </span>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end lang-menu">
                    <div className="lang-head">
                      <h6>Language</h6>
                      <span className="lang-sub">Choose your language</span>
                    </div>
                    <div className="lang-list">
                      {languages.map((lang) => (
                        <Link
                          key={lang.name}
                          to="#"
                          className={`lang-item${lang.active ? " active" : ""}`}
                        >
                          <span className="lang-flag">
                            <ImageWithBasePath src={lang.flag} alt={lang.name} />
                          </span>
                          <span className="lang-txt">
                            <span className="lang-name">{lang.name}</span>
                            <span className="lang-native">{lang.native}</span>
                          </span>
                          <i className="ti ti-check lang-check" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Add New */}
              <div className="pe-1">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white btn-icon me-1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="ti ti-square-rounded-plus" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-right anew-menu">
                    <div className="anew-head">
                      <div>
                        <h6>Add New</h6>
                        <span className="anew-sub">Quickly create a record</span>
                      </div>
                      <span className="anew-badge">
                        <i className="ti ti-bolt" />
                      </span>
                    </div>
                    <div className="anew-list">
                      {addNewActions.map((action) => (
                        <Link
                          key={action.title}
                          to={action.link}
                          className="anew-item"
                        >
                          <span className={`anew-ic ${action.tone}`}>
                            <i className={action.icon} />
                          </span>
                          <span className="anew-txt">
                            <span className="anew-t">{action.title}</span>
                            <span className="anew-s">{action.subtitle}</span>
                          </span>
                          <i className="ti ti-chevron-right anew-arrow" />
                        </Link>
                      ))}
                    </div>
                    <div className="anew-foot">
                      <Link to="#">
                        View all options <i className="ti ti-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme toggle */}
              {!location.pathname.includes(routes.layoutDark) && (
                <div className="pe-1">
                  <Link
                    to="#"
                    id="dark-mode-toggle"
                    className={`dark-mode-toggle btn btn-outline-light bg-white btn-icon me-1${
                      isDark ? "" : " activate"
                    }`}
                    onClick={() => setTheme("dark_data_theme")}
                    style={{ display: isDark ? "none" : "" }}
                  >
                    <i className="ti ti-moon" />
                  </Link>
                  <Link
                    to="#"
                    id="light-mode-toggle"
                    className={`dark-mode-toggle btn btn-outline-light bg-white btn-icon me-1${
                      isDark ? " activate" : ""
                    }`}
                    onClick={() => setTheme("default_data_theme")}
                    style={{ display: isDark ? "" : "none" }}
                  >
                    <i className="ti ti-brightness-up" />
                  </Link>
                </div>
              )}

              {/* Notifications */}
              <div
                className={`pe-1 ${
                  notificationVisible ? "notification-item-show" : ""
                }`}
                id="notification_item"
              >
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-icon position-relative me-1"
                  id="notification_popup"
                  onClick={() => setNotificationVisible(!notificationVisible)}
                >
                  <i className="ti ti-bell" />
                  <span className="notification-status-dot" />
                  <span className="mui-count">{unreadCount}</span>
                </Link>
                <div className="dropdown-menu dropdown-menu-end notification-dropdown ntf-panel">
                  <div className="ntf-head">
                    <div className="ntf-head-top">
                      <div>
                        <h6>Notifications</h6>
                        <span className="ntf-sub">
                          You have {unreadCount} unread messages
                        </span>
                      </div>
                      <Link
                        to="#"
                        className="ntf-readall"
                        title="Mark all as read"
                      >
                        <i className="ti ti-checks" />
                      </Link>
                    </div>
                    <div className="ntf-tabs">
                      {["All", "Unread", "Alerts"].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          className={`ntf-tab${
                            notificationTab === tab ? " active" : ""
                          }`}
                          onClick={() => setNotificationTab(tab)}
                        >
                          {tab}
                          {tab === "Unread" && <span>{unreadCount}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="noti-content ntf-list">
                    {visibleNotifications.map((item, index) => (
                      <Link
                        to={routes.activity}
                        className={`ntf-item${item.unread ? " unread" : ""}`}
                        key={index}
                      >
                        <span className="avatar avatar-42 avatar-rounded">
                          <ImageWithBasePath src={item.avatar} alt="Profile" />
                          <span className={`ntf-badge ${item.badgeTone}`}>
                            <i className={item.badgeIcon} />
                          </span>
                        </span>
                        <div className="ntf-body">
                          {item.text}
                          <span className="ntf-time">
                            <i className="ti ti-clock" />
                            {item.time}
                          </span>
                          {item.actions && (
                            <div className="ntf-actions">
                              <span className="btn btn-light btn-sm">Deny</span>
                              <span className="btn btn-primary btn-sm">
                                Approve
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="ntf-dot" />
                      </Link>
                    ))}
                  </div>
                  <div className="ntf-foot">
                    <Link to={routes.activity}>
                      View all notifications <i className="ti ti-arrow-right" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="pe-1">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white btn-icon position-relative me-1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="ti ti-brand-hipchat" />
                    <span className="chat-status-dot" />
                    <span className="mui-count">{messages.length + 1}</span>
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end msg-panel">
                    <div className="msg-head">
                      <div className="msg-head-top">
                        <div>
                          <h6>Messages</h6>
                          <span className="msg-sub">
                            {unreadMessages} unread conversations
                          </span>
                        </div>
                        <Link
                          to={routes.chat}
                          className="msg-compose"
                          title="New message"
                        >
                          <i className="ti ti-pencil-plus" />
                        </Link>
                      </div>
                      <div className="msg-search">
                        <i className="ti ti-search" />
                        <input type="text" placeholder="Search messages..." />
                      </div>
                    </div>
                    <div className="noti-content msg-list">
                      {messages.map((msg) => (
                        <Link
                          to={routes.chat}
                          className={`msg-item${msg.unread ? " unread" : ""}`}
                          key={msg.name}
                        >
                          <span className="avatar avatar-44 avatar-rounded">
                            <ImageWithBasePath src={msg.avatar} alt="" />
                            <span
                              className={`avatar-status avatar-status-sm avatar-status-inset ${msg.status}`}
                            />
                          </span>
                          <div className="msg-body">
                            <div className="msg-row1">
                              <span className="msg-name">{msg.name}</span>
                              <span className="msg-time">{msg.time}</span>
                            </div>
                            <p className="msg-prev">{msg.preview}</p>
                          </div>
                          {msg.unread > 0 && (
                            <span className="msg-unread">{msg.unread}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                    <div className="msg-foot">
                      <Link to={routes.chat} className="btn btn-primary w-100">
                        Open Inbox
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apps Launcher */}
              <div className="pe-1 mui-hide-sm">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white btn-icon me-1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    title="Apps"
                  >
                    <i className="ti ti-layout-grid" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end apps-panel">
                    <div className="apps-head">
                      <div>
                        <h6>Apps</h6>
                        <span className="apps-sub">
                          Jump to a workspace app
                        </span>
                      </div>
                      <Link to="#" className="apps-custom" title="Customize">
                        <i className="ti ti-settings" />
                      </Link>
                    </div>
                    <div className="apps-grid">
                      {appTiles.map((app) => (
                        <Link
                          key={app.label}
                          to={app.link}
                          className="apps-tile"
                        >
                          <span className={`apps-ic ${app.tone}`}>
                            <i className={app.icon} />
                          </span>
                          <span className="apps-lbl">{app.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="apps-foot">
                      <Link to="#">
                        Browse all apps <i className="ti ti-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div className="dropdown ms-1">
                <Link
                  to="#"
                  className="dropdown-toggle mui-profile-toggle d-flex align-items-center"
                  data-bs-toggle="dropdown"
                >
                  <span className="avatar avatar-md rounded online">
                    <ImageWithBasePath
                      src="assets/img/profiles/avatar-27.jpg"
                      alt="Img"
                      className="img-fluid"
                    />
                  </span>
                </Link>
                <div
                  className="dropdown-menu mui-profile-drop p-0"
                  style={{ minWidth: 288 }}
                >
                  <div className="mui-profile-head">
                    <span className="avatar avatar-md online avatar-rounded">
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-27.jpg"
                        alt="img"
                      />
                    </span>
                    <div className="mui-profile-id">
                      <h6 className="mb-0">Kevin Larry</h6>
                      <span className="mui-profile-mail">
                        kevin.larry@preskool.com
                      </span>
                    </div>
                    <span className="mui-profile-role">Admin</span>
                  </div>
                  <div className="mui-profile-body">
                    <Link className="dropdown-item" to={routes.profile}>
                      <i className="ti ti-user-circle" />
                      My Profile
                    </Link>
                    <Link className="dropdown-item" to={routes.profilesettings}>
                      <i className="ti ti-settings" />
                      Settings
                    </Link>
                    <Link className="dropdown-item" to={routes.activity}>
                      <i className="ti ti-activity" />
                      Activity
                      <span className="badge bg-primary rounded-pill ms-auto">
                        3
                      </span>
                    </Link>
                    <Link
                      className="dropdown-item"
                      to={routes.membershipTransaction}
                    >
                      <i className="ti ti-wallet" />
                      Billing
                    </Link>
                    <Link className="dropdown-item" to={routes.rolesPermissions}>
                      <i className="ti ti-shield-lock" />
                      Privacy &amp; Security
                    </Link>
                    <hr className="my-2" />
                    <a
                      className="dropdown-item"
                      href={DOCS_URL}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <i className="ti ti-help-circle" />
                      Help Center
                    </a>
                    <Link className="dropdown-item text-danger" to={routes.login}>
                      <i className="ti ti-login" />
                      Logout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-end">
            <Link className="dropdown-item" to={routes.profile}>
              My Profile
            </Link>
            <Link className="dropdown-item" to={routes.profilesettings}>
              Settings
            </Link>
            <Link className="dropdown-item" to={routes.login}>
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
      {/* /Header */}
    </>
  );
};

export default Header;
