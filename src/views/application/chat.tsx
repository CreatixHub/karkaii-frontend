import  { useEffect, useState } from "react";

import { Link, useLocation } from "react-router-dom";
import { all_routes } from "@/routes/all_routes";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../../../node_modules/react-perfect-scrollbar/dist/css/styles.css";
import React from "react";


const Chat = () => {

  const useBodyClass = (className: string) => {
    const location = useLocation();

    useEffect(() => {
      if (location.pathname === "/application/chat") {
        document.body.classList.add(className);
      } else {
        document.body.classList.remove(className);
      }
      return () => {
        document.body.classList.remove(className);
      };
    }, [location.pathname, className]);
  };
  useBodyClass("app-chat");

  const routes = all_routes;
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [isShow, setShow] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showEmoji2, setShowEmoji2] = useState(false);
  const [isVisible, setIsVisible] = useState(false);



  const handleShowClass = () => {
    setShow(true);
  };

  const handleShowremoveClass = () => {
    setShow(false);
  };

  const handleAddVisible = () => {
    setIsVisible(true);
  };

  const handleRemoveVisible = () => {
    setIsVisible(false);
  };
  const profile = {
    loop: true,
    margin: 15,
    items: 5,
    nav: false,
    dots: false,
    autoplay: false,
    slidesToShow: 5,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 3,
        },
      },
    ],
  };

  return (
    <>
      <div className="main-chat-blk">
        <div className="main-wrapper">
          <div className="page-wrapper chat-page-wrapper">
            <div className="content">
              {/* sidebar group */}
              <div className="sidebar-group left-sidebar chat_sidebar">
                {/* Chats sidebar */}
          
                <div
                  id="chats"
                  className="left-sidebar-wrap sidebar active slimscroll"
                >
                
                    <div className="slimscroll-active-sidebar">
                      {/* Left Chat Title */}
                      <div className="left-chat-title all-chats d-flex justify-content-between align-items-center">
                        <div className="setting-title-head">
                          <h4> All Chats</h4>
                        </div>
                        <div className="add-section">
                          <ul>
                            <li>
                              <Link to="#" className="user-chat-search-btn">
                                <i className="bx bx-search" />
                              </Link>
                            </li>
                            <li>
                              <div className="chat-action-btns">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                  >
                                    <i className="bx bx-dots-vertical-rounded" />
                                  </Link>
                                  <div className="dropdown-menu dropdown-menu-end">
                                    <Link to="#" className="dropdown-item ">
                                      <span>
                                        <i className="bx bx-message-rounded-add" />
                                      </span>
                                      New Chat{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-user-circle" />
                                      </span>
                                      Create Group
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-user-plus" />
                                      </span>
                                      Invite Others
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                          {/* Chat Search */}
                          <div className="user-chat-search">
                            <form>
                              <span className="form-control-feedback">
                                <i className="bx bx-search" />
                              </span>
                              <input
                                type="text"
                                name="chat-search"
                                placeholder="Search"
                                className="form-control"
                              />
                              <div className="user-close-btn-chat">
                                <span className="material-icons">close</span>
                              </div>
                            </form>
                          </div>
                          {/* /Chat Search */}
                        </div>
                      </div>
                      {/* /Left Chat Title */}
                      {/* Top Online Contacts */}
                      <div className="top-online-contacts p-4 pb-0">
                        <div className="fav-title">
                          <h5>Online Now</h5>
                          <Link to="#">View All</Link>
                        </div>
                        <Slider {...profile}>
                          <div className="top-contacts-box me-1">
                            <div className="avatar avatar-lg avatar-online">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-02.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="top-contacts-box  me-1">
                            <div className="avatar avatar-lg avatar-online">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-01.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="top-contacts-box me-1">
                            <div className="avatar avatar-lg avatar-online">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-07.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="top-contacts-box me-1">
                            <div className="avatar avatar-lg avatar-online">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-05.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="top-contacts-box me-1">
                            <div className="avatar avatar-lg avatar-online">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-03.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                          <div className="top-contacts-box me-1">
                            <div className="avatar avatar-lg avatar-online">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-02.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                        </Slider>
                      </div>
                      {/* /Top Online Contacts */}
                      <div className="sidebar-body chat-body" id="chatsidebar">
                        {/* Left Chat Title */}
                        {/* <div className="d-flex justify-content-between align-items-center ps-0 pe-0">
                          <div className="fav-title pin-chat">
                            <h5>Pinned Chat</h5>
                          </div>
                        </div> */}
                        <h5 className="mb-3">Pinned Chat</h5>
                        {/* /Left Chat Title */}
                        <>
                          <ul className="mb-3">
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg avatar-online me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-02.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Mark Villiams
                                    </h6>
                                    <p className="text-truncate">
                                      Have you called them?
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      10:20 PM
                                    </small>
                                    <div className="chat-pin">
                                      <i className="bx bx-pin me-2" />
                                      <i className="bx bx-check-double" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-01.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Elizabeth Sosa
                                    </h6>
                                    <p className="text-truncate">
                                      <span className="animate-typing-col me-1">
                                        Typing
                                        <span className="dot me-1 ms-1" />
                                        <span className="dot me-1" />
                                        <span className="dot" />
                                      </span>
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      Yesterday
                                    </small>
                                    <div className="chat-pin">
                                      <i className="bx bx-pin me-2" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg avatar-online me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-05.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Michael Howard
                                    </h6>
                                    <p className="text-truncate">Thank you</p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      10:20 PM
                                    </small>
                                    <div>
                                      <i className="bx bx-pin me-2" />
                                      <i className="bx bx-check-double" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          </ul>
                          {/* Left Chat Title */}
                          <h5 className="mb-3">Recent Chat</h5>
                          {/* /Left Chat Title */}
                          <ul className="user-list">
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg avatar-online me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-03.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Horace Keene
                                    </h6>
                                    <p className="text-truncate">
                                      Have you called them?
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      Just Now
                                    </small>
                                    <div>
                                      <span className="badge bg-primary rounded-circle p-1 fs-8">
                                        11
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg avatar-online me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-04.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Hollis Tran
                                    </h6>
                                    <p className="text-truncate">
                                      <i className="bx bx-video me-1" />
                                      Video
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      Yesterday
                                    </small>
                                    <div>
                                      <i className="bx bx-check-double" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg avatar-online me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-15.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      James Albert
                                    </h6>
                                    <p className="text-truncate">
                                      Project Tools.doc
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      10:20 PM
                                    </small>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg avatar-online me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-09.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Debra Jones
                                    </h6>
                                    <p className="text-truncate">
                                      <i className="bx bx-microphone me-1" />
                                      Audio
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      12:30 PM
                                    </small>
                                    <div>
                                      <i className="bx bx-check-double text-success" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg  me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-07.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Dina Brown
                                    </h6>
                                    <p className="text-truncate">
                                      Have you called them?
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      Yesterday
                                    </small>
                                    <div>
                                      <i className="bx bx-microphone-off" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg  me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-08.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Judy Mercer
                                    </h6>
                                    <p className="text-truncate text-danger">
                                      <i className="bx bx-phone-incoming me-1" />
                                      Missed Call
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      25/July/23
                                    </small>
                                  </div>
                                </div>
                              </Link>
                            </li>
                            <li className="user-list-item">
                              <Link
                                to="#"
                                className="p-2 border rounded d-block mb-2"
                              >
                                <div className="d-flex align-items-center">
                                  <div className="avatar  avatar-lg  me-2 flex-shrink-0">
                                    <ImageWithBasePath
                                      src="assets/img/profiles/avatar-06.jpg"
                                      className="rounded-circle"
                                      alt="image"
                                    />
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden me-2">
                                    <h6 className="mb-1 text-truncate">
                                      Richard Ohare
                                    </h6>
                                    <p className="text-truncate">
                                      <i className="bx bx-image-alt me-1" />
                                      Photo
                                    </p>
                                  </div>
                                  <div className="flex-shrink-0 align-self-start text-end">
                                    <small className="text-muted">
                                      27/06/24
                                    </small>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          </ul>
                        </>
                      </div>
                    </div>
             
                </div>
               
                {/* / Chats sidebar */}
              </div>
              {/* /Sidebar group */}

              {/* Chat */}
              <div className="chat chat-messages" id="middle">
                <div className="slimscroll">
                  <PerfectScrollbar>
                    <div className="chat-header">
                      <div className="user-details">
                        <div className="d-lg-none">
                          <ul className="list-inline mt-2 me-2">
                            <li className="list-inline-item">
                              <Link
                                className="text-muted px-0 left_sides"
                                to="#"
                                data-chat="open"
                              >
                                <i className="fas fa-arrow-left" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                        <div className="avatar avatar-lg me-2">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-02.jpg"
                            className="rounded-circle"
                            alt="image"
                          />
                        </div>
                        <div>
                          <h6>Mark Villiams</h6>
                          <small className="last-seen">
                            Last Seen at 07:15 PM
                          </small>
                        </div>
                      </div>
                      <div className="chat-options ">
                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <Link
                              to="#"
                              className="btn btn-outline-light chat-search-btn"
                              data-bs-toggle="tooltip"
                              data-bs-placement="bottom"
                              title="Search"
                              onClick={handleShowClass}
                            >
                              <i className="bx bx-search" />
                            </Link>
                          </li>
                          <li className="list-inline-item">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id={`tooltip-${routes.videoCall}`}>
                                  Video Call
                                </Tooltip>
                              }
                            >
                              <Link
                                to={routes.videoCall}
                                className="btn btn-outline-light"
                              >
                                <i className="bx bx-video" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li className="list-inline-item">
                            <OverlayTrigger
                              placement="bottom"
                              overlay={
                                <Tooltip id={`tooltip-${routes.audioCall}`}>
                                  Voice Call
                                </Tooltip>
                              }
                            >
                              <Link
                                to={routes.audioCall}
                                className="btn btn-outline-light"
                              >
                                <i className="bx bx-phone" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li className="list-inline-item dream_profile_menu">
                            <Link
                              to="#"
                              className="btn btn-outline-light not-chat-user"
                              onClick={handleAddVisible}
                            >
                              <i className="bx bx-info-circle" />
                            </Link>
                          </li>
                          <li className="list-inline-item">
                            <Link
                              className="btn btn-outline-light no-bg"
                              to="#"
                              data-bs-toggle="dropdown"
                            >
                              <i className="bx bx-dots-vertical-rounded" />
                            </Link>
                            <div className="dropdown-menu dropdown-menu-end">
                              <Link to="#" className="dropdown-item ">
                                <span>
                                  <i className="bx bx-x" />
                                </span>
                                Close Chat{" "}
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-volume-mute" />
                                </span>
                                Mute Notification
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-time-five" />
                                </span>
                                Disappearing Message
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-brush-alt" />
                                </span>
                                Clear Message
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-trash-alt" />
                                </span>
                                Delete Chat
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-dislike" />
                                </span>
                                Report
                              </Link>
                              <Link to="#" className="dropdown-item">
                                <span>
                                  <i className="bx bx-block" />
                                </span>
                                Block
                              </Link>
                            </div>
                          </li>
                        </ul>
                      </div>
                      {/* Chat Search */}
                      <div
                        className={
                          isShow ? "chat-search visible-chat" : "chat-search"
                        }
                      >
                        <form>
                          <span
                            className="form-control-feedback"
                            onClick={handleShowClass}
                          >
                            <i className="bx bx-search" />
                          </span>
                          <input
                            type="text"
                            name="chat-search"
                            placeholder="Search Chats"
                            className="form-control"
                          />
                          <div
                            className="close-btn-chat"
                            onClick={handleShowremoveClass}
                          >
                            <i className="fa fa-close" />
                          </div>
                        </form>
                      </div>
                      {/* /Chat Search */}
                    </div>

                    <div className="chat-body">
                      <div className="messages">
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content">
                              Hello <Link to="#">@Alex</Link> Thank you for the
                              beautiful web design ahead schedule.
                              <div className="emoj-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${
                                        showEmoji ? "d-block" : ""
                                      } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="chat-line">
                          <span className="chat-date">Today, July 24</span>
                        </div>
                        <div className="chats chats-right">
                          <div className="chat-content">
                            <div className="chat-profile-name text-end">
                              <h6>
                                Alex Smith<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content ">
                              <div className="emoj-group rig-emoji-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${
                                        showEmoji ? "d-block" : ""
                                      } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="chat-voice-group">
                                <ul>
                                  <li>
                                    <Link to="#">
                                      <span>
                                        <ImageWithBasePath
                                          src="assets/img/icons/play-01.svg"
                                          alt="image"
                                        />
                                      </span>
                                    </Link>
                                  </li>
                                  <li>
                                    <ImageWithBasePath
                                      src="assets/img/icons/voice.svg"
                                      alt="image"
                                    />
                                  </li>
                                  <li>0:05</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-10.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                        </div>
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                                <span className="check-star">
                                  <i className="bx bxs-star" />
                                </span>
                              </h6>
                              <div className="chat-action-btns ms-2">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bxs-star" />
                                      </span>
                                      Unstar Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content award-link chat-award-link">
                              <Link to="#" className="mb-1">
                                https://www.youtube.com/watch?v=GCmL3mS0Psk
                              </Link>
                              <ImageWithBasePath
                                src="assets/img/sending-img.png"
                                alt="img"
                              />
                              <div className="emoj-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${
                                        showEmoji ? "d-block" : ""
                                      } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="chats chats-right">
                          <div className="chat-content">
                            <div className="chat-profile-name justify-content-end">
                              <h6>
                                Alex Smith<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content fancy-msg-box">
                              <div className="emoj-group wrap-emoji-group ">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${
                                        showEmoji ? "d-block" : ""
                                      } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                              <div className="download-col">
                                <ul className="nav mb-0">
                                  <Lightbox
                                    open={open1}
                                    close={() => setOpen1(false)}
                                    slides={[
                                      {
                                        src: "/assets/img/media/media-02.jpg",
                                      },
                                      {
                                        src: "/assets/img/media/media-03.jpg",
                                      },
                                      {
                                        src: "/assets/img/media/media-01.jpg",
                                      },
                                    ]}
                                  />
                                  <li>
                                    <div className="image-download-col">
                                      <Link
                                        onClick={() => setOpen1(true)}
                                        to="#"
                                        data-fancybox="gallery"
                                        className="fancybox"
                                      >
                                        <ImageWithBasePath
                                          src="assets/img/media/media-02.jpg"
                                          alt=""
                                        />
                                      </Link>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="image-download-col ">
                                      <Link
                                        onClick={() => setOpen1(true)}
                                        to="#"
                                        data-fancybox="gallery"
                                        className="fancybox"
                                      >
                                        <ImageWithBasePath
                                          src="assets/img/media/media-03.jpg"
                                          alt=""
                                        />
                                      </Link>
                                    </div>
                                  </li>
                                  <li>
                                    <div className="image-download-col image-not-download">
                                      <Link
                                        onClick={() => setOpen1(true)}
                                        to="assets/img/media/media-01.jpg"
                                        data-fancybox="gallery"
                                        className="fancybox"
                                      >
                                        <ImageWithBasePath src="assets/img/media/media-01.jpg" />
                                        <span>10+</span>
                                      </Link>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-10.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                        </div>
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content review-files">
                              <p className="d-flex align-items-center">
                                Please check and review the files
                                <span className="ms-1 d-flex">
                                  <ImageWithBasePath
                                    src="assets/img/icons/smile-chat.svg"
                                    alt="Icon"
                                  />
                                </span>
                              </p>
                              <div className="file-download d-flex align-items-center mb-0">
                                <div className="file-type d-flex align-items-center justify-content-center me-2">
                                  <i className="bx bxs-file-doc" />
                                </div>
                                <div className="file-details">
                                  <span className="file-name">
                                    Landing_page_V1.doc
                                  </span>
                                  <ul>
                                    <li>80 Bytes</li>
                                    <li>
                                      <Link to="#">Download</Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="emoj-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${
                                        showEmoji ? "d-block" : ""
                                      } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="like-chat-grp">
                              <ul>
                                <li className="like-chat">
                                  <Link to="#">
                                    2
                                    <ImageWithBasePath
                                      src="assets/img/icons/like.svg"
                                      alt="Icon"
                                    />
                                  </Link>
                                </li>
                                <li className="comment-chat">
                                  <Link to="#">
                                    2
                                    <ImageWithBasePath
                                      src="assets/img/icons/heart.svg"
                                      alt="Icon"
                                    />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content">
                              Thank you for your support
                              <div className="emoj-group">
                                <ul>
                                  <li className="emoj-action">
                                    <Link
                                      to="#"
                                      onClick={() => setShowEmoji(!showEmoji)}
                                    >
                                      <i className="bx bx-smile" />
                                    </Link>
                                    <div
                                      onClick={() => setShowEmoji(false)}
                                      className={`${
                                        showEmoji ? "d-block" : ""
                                      } emoj-group-list`}
                                    >
                                      <ul>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-01.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-02.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-03.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-04.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#">
                                            <ImageWithBasePath
                                              src="assets/img/icons/emoj-icon-05.svg"
                                              alt="Icon"
                                            />
                                          </Link>
                                        </li>
                                        <li className="add-emoj">
                                          <Link to="#">
                                            <i className="bx bx-plus" />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </li>
                                  <li>
                                    <Link to="#">
                                      <i className="bx bx-share" />
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="chats">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content chat-cont-type">
                            <div className="chat-profile-name chat-type-wrapper">
                              <p>Mark Villiams Typing...</p>
                            </div>
                          </div>
                        </div>
                        <div className="chats forward-chat-msg">
                          <div className="chat-avatar">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              className="rounded-circle dreams_chat"
                              alt="image"
                            />
                          </div>
                          <div className="chat-content">
                            <div className="chat-profile-name">
                              <h6>
                                Mark Villiams<span>8:16 PM</span>
                              </h6>
                              <div className="chat-action-btns ms-3">
                                <div className="chat-action-col">
                                  <Link
                                    className="#"
                                    to="#"
                                    data-bs-toggle="dropdown"
                                  >
                                    <i className="bx bx-dots-horizontal-rounded" />
                                  </Link>
                                  <div className="dropdown-menu chat-drop-menu dropdown-menu-end">
                                    <Link
                                      to="#"
                                      className="dropdown-item message-info-left"
                                    >
                                      <span>
                                        <i className="bx bx-info-circle" />
                                      </span>
                                      Message Info{" "}
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-share" />
                                      </span>
                                      Reply
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-smile" />
                                      </span>
                                      React
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#forward-message"
                                    >
                                      <span>
                                        <i className="bx bx-reply" />
                                      </span>
                                      Forward
                                    </Link>
                                    <Link to="#" className="dropdown-item">
                                      <span>
                                        <i className="bx bx-star" />
                                      </span>
                                      Star Message
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#report-user"
                                    >
                                      <span>
                                        <i className="bx bx-dislike" />
                                      </span>
                                      Report
                                    </Link>
                                    <Link
                                      to="#"
                                      className="dropdown-item"
                                      data-bs-toggle="modal"
                                      data-bs-target="#delete-message"
                                    >
                                      <span>
                                        <i className="bx bx-trash" />
                                      </span>
                                      Delete
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="message-content">
                              Thank you for your support
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </PerfectScrollbar>
                </div>
                <div className="chat-footer">
                  <form>
                    <div className="smile-foot">
                      <div className="chat-action-btns">
                        <div className="chat-action-col">
                          <Link
                            className="action-circle"
                            to="#"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bx bx-dots-vertical-rounded" />
                          </Link>
                          <div className="dropdown-menu dropdown-menu-end">
                            <Link to="#" className="dropdown-item ">
                              <span>
                                <i className="bx bx-file" />
                              </span>
                              Document
                            </Link>
                            <Link to="#" className="dropdown-item">
                              <span>
                                <i className="bx bx-camera" />
                              </span>
                              Camera
                            </Link>
                            <Link to="#" className="dropdown-item">
                              <span>
                                <i className="bx bx-image" />
                              </span>
                              Gallery
                            </Link>
                            <Link to="#" className="dropdown-item">
                              <span>
                                <i className="bx bx-volume-full" />
                              </span>
                              Audio
                            </Link>
                            <Link to="#" className="dropdown-item">
                              <span>
                                <i className="bx bx-map" />
                              </span>
                              Location
                            </Link>
                            <Link to="#" className="dropdown-item">
                              <span>
                                <i className="bx bx-user-pin" />
                              </span>
                              Contact
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="smile-foot emoj-action-foot">
                      <Link
                        to="#"
                        className="action-circle"
                        onClick={() => setShowEmoji2(!showEmoji2)}
                      >
                        <i className="bx bx-smile" />
                      </Link>
                      <div
                        className="emoj-group-list-foot down-emoji-circle"
                        onClick={() => setShowEmoji2(false)}
                        style={{ display: showEmoji2 ? "block" : "none" }}
                      >
                        <ul>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/icons/emoj-icon-01.svg"
                                alt="Icon"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/icons/emoj-icon-02.svg"
                                alt="Icon"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/icons/emoj-icon-03.svg"
                                alt="Icon"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/icons/emoj-icon-04.svg"
                                alt="Icon"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <ImageWithBasePath
                                src="assets/img/icons/emoj-icon-05.svg"
                                alt="Icon"
                              />
                            </Link>
                          </li>
                          <li className="add-emoj">
                            <Link to="#">
                              <i className="bx bx-plus" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="smile-foot">
                      <Link to="#" className="action-circle">
                        <i className="bx bx-microphone-off" />
                      </Link>
                    </div>
                    <input
                      type="text"
                      className="form-control chat_form"
                      placeholder="Type your message here..."
                    />
                    <div className="form-buttons">
                      <button className="btn send-btn" type="submit">
                        <i className="bx bx-paper-plane" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              {/* /Chat */}
              {/* Right sidebar */}
              <div
                className={
                  isVisible
                    ? "right-sidebar right_sidebar_profile right-side-contact show-right-sidebar"
                    : "right-sidebar right_sidebar_profile right-side-contact hide-right-sidebar"
                }
                id="middle1"
              >
                <div className="right-sidebar-wrap active">
                  <div className="slimscroll">
                    <PerfectScrollbar>
                      <div className="left-chat-title d-flex justify-content-between align-items-center border-bottom-0">
                        <div className="fav-title mb-0">
                          <h6>Contact Info</h6>
                        </div>
                        <div className="contact-close_call text-end">
                          <Link to="#" className="close_profile close-star">
                            <i className="bx bxs-star" />
                          </Link>
                          <Link
                            to="#"
                            className="close_profile close-trash"
                            onClick={handleRemoveVisible}
                          >
                            <i className="bx bx-trash" />
                          </Link>
                        </div>
                      </div>
                      <div className="sidebar-body">
                        <div className="mt-0 right_sidebar_logo">
                          <div className="text-center right-sidebar-profile">
                            <figure className="avatar avatar-xl mb-3">
                              <ImageWithBasePath
                                src="assets/img/profiles/avatar-02.jpg"
                                className="rounded-circle"
                                alt="image"
                              />
                            </figure>
                            <h5 className="profile-name">Mark Villiams</h5>
                            <div className="last-seen-profile">
                              <span>last seen at 07:15 PM</span>
                            </div>
                            <div className="chat-options chat-option-profile">
                              <ul className="list-inline">
                                <li className="list-inline-item">
                                  <Link
                                    to="audio-call"
                                    className="btn btn-outline-light "
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Voice Call"
                                  >
                                    <i className="bx bx-phone" />
                                  </Link>
                                </li>
                                <li className="list-inline-item ">
                                  <Link
                                    to="video-call"
                                    className="btn btn-outline-light profile-open"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Video Call"
                                  >
                                    <i className="bx bx-video" />
                                  </Link>
                                </li>
                                <li className="list-inline-item">
                                  <Link
                                    to="#"
                                    className="btn btn-outline-light"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="Chat"
                                  >
                                    <i className="bx bx-message-square-dots" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="chat-member-details">
                            <div className="member-details">
                              <ul>
                                <li>
                                  <h5>Bio</h5>
                                </li>
                                <li>
                                  <h6>Phone</h6>
                                  <span>555-555-21541</span>
                                </li>
                                <li>
                                  <h6>Email Address</h6>
                                  <span>info@example.com</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="right-sidebar-head share-media">
                        <div className="share-media-blk">
                          <h5>Shared Media</h5>
                          <Link to="#">View All</Link>
                        </div>
                        <div className="about-media-tabs">
                          <nav>
                            <div className="nav nav-tabs " id="nav-tab">
                              <Link
                                className="nav-item nav-link active"
                                id="nav-home-tab"
                                data-bs-toggle="tab"
                                to="#info"
                              >
                                Photos
                              </Link>
                              <Link
                                className="nav-item nav-link"
                                id="nav-profile-tab1"
                                data-bs-toggle="tab"
                                to="#Participants"
                              >
                                Videos
                              </Link>
                              <Link
                                className="nav-item nav-link"
                                id="nav-profile-tab2"
                                data-bs-toggle="tab"
                                to="#media"
                              >
                                File
                              </Link>
                              <Link
                                className="nav-item nav-link"
                                id="nav-profile-tab3"
                                data-bs-toggle="tab"
                                to="#link"
                              >
                                Link
                              </Link>
                            </div>
                          </nav>
                          <div className="tab-content pt-0" id="nav-tabContent">
                            <div
                              className="tab-pane fade show active"
                              id="info"
                            >
                              <ul className="nav share-media-img mb-0">
                                <Lightbox
                                  open={open2}
                                  close={() => setOpen2(false)}
                                  slides={[
                                    {
                                      src: "/assets/img/media/media-01.jpg",
                                    },
                                    {
                                      src: "/assets/img/media/media-02.jpg",
                                    },
                                    {
                                      src: "/assets/img/media/media-03.jpg",
                                    },
                                    {
                                      src: "/assets/img/media/media-04.jpg",
                                    },
                                    {
                                      src: "/assets/img/media/media-02.jpg",
                                    },
                                  ]}
                                />
                                <li>
                                  <Link
                                    onClick={() => setOpen2(true)}
                                    to="#"
                                    data-fancybox="gallery"
                                    className="fancybox"
                                  >
                                    <ImageWithBasePath
                                      src="assets/img/media/media-01.jpg"
                                      alt=""
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() => setOpen2(true)}
                                    to="#"
                                    data-fancybox="gallery"
                                    className="fancybox"
                                  >
                                    <ImageWithBasePath
                                      src="assets/img/media/media-02.jpg"
                                      alt=""
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() => setOpen2(true)}
                                    to="#"
                                    data-fancybox="gallery"
                                    className="fancybox"
                                  >
                                    <ImageWithBasePath
                                      src="assets/img/media/media-03.jpg"
                                      alt=""
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() => setOpen2(true)}
                                    to="#"
                                    data-fancybox="gallery"
                                    className="fancybox"
                                  >
                                    <ImageWithBasePath
                                      src="assets/img/media/media-04.jpg"
                                      alt=""
                                    />
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    onClick={() => setOpen2(true)}
                                    to="#"
                                    data-fancybox="gallery"
                                    className="fancybox"
                                  >
                                    <ImageWithBasePath
                                      src="assets/img/media/media-05.jpg"
                                      alt=""
                                    />
                                  </Link>
                                </li>
                                <li className="blur-media">
                                  <Link
                                    onClick={() => setOpen2(true)}
                                    to="#"
                                    data-fancybox="gallery"
                                    className="fancybox"
                                  >
                                    <ImageWithBasePath
                                      src="assets/img/media/media-02.jpg"
                                      alt=""
                                    />
                                  </Link>
                                  <span>+10</span>
                                </li>
                              </ul>
                            </div>
                            <div className="tab-pane fade" id="Participants">
                              <ul className="nav share-media-img mb-0">
                                <li>
                                  <Link  to="#">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-01.jpg"
                                      alt="img"
                                    />
                                    <span>
                                      <i className="bx bx-play-circle" />
                                    </span>
                                  </Link>
                                  
                                </li>
                                <li>
                                  <Link  to="#">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-02.jpg"
                                      alt="img"
                                    />
                                    <span>
                                      <i className="bx bx-play-circle" />
                                    </span>
                                  </Link>
                                  
                                </li>
                                <li>
                                  <Link  to="#">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-03.jpg"
                                      alt="img"
                                    />
                                    <span>
                                      <i className="bx bx-play-circle" />
                                    </span>
                                  </Link>
                                 
                                </li>
                                <li>
                                  <Link  to="#">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-04.jpg"
                                      alt="img"
                                    />
                                    <span>
                                      <i className="bx bx-play-circle" />
                                    </span>
                                  </Link>
                                 
                                </li>
                                <li>
                                  <Link  to="#">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-05.jpg"
                                      alt="img"
                                    />
                                    <span>
                                      <i className="bx bx-play-circle" />
                                    </span>
                                  </Link>
                                 
                                 
                                </li>
                                <li className="blur-media">
                                  <Link  to="#">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-03.jpg"
                                      alt="img"
                                    />
                                  </Link>
                               
                                  <span>+10</span>
                                </li>
                              </ul>
                            </div>
                            <div className="tab-pane fade" id="media">
                              <div className="media-file">
                                <div className="media-doc-blk">
                                  <span>
                                    <i className="bx bxs-file-doc" />
                                  </span>
                                  <div className="document-detail">
                                    <h6>Landing_page_V1.doc</h6>
                                    <ul>
                                      <li>12 Mar 2023</li>
                                      <li>246.3 KB</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="media-download">
                                  <Link to="#">
                                    <i className="bx bx-download" />
                                  </Link>
                                </div>
                              </div>
                              <div className="media-file">
                                <div className="media-doc-blk">
                                  <span>
                                    <i className="bx bxs-file-pdf" />
                                  </span>
                                  <div className="document-detail">
                                    <h6>Design Guideless.pdf</h6>
                                    <ul>
                                      <li>12 Mar 2023</li>
                                      <li>246.3 KB</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="media-download">
                                  <Link to="#">
                                    <i className="bx bx-download" />
                                  </Link>
                                </div>
                              </div>
                              <div className="media-file">
                                <div className="media-doc-blk">
                                  <span>
                                    <i className="bx bxs-file" />
                                  </span>
                                  <div className="document-detail">
                                    <h6>sample site.txt</h6>
                                    <ul>
                                      <li>12 Mar 2023</li>
                                      <li>246.3 KB</li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="media-download">
                                  <Link to="#">
                                    <i className="bx bx-download" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="tab-pane fade" id="link">
                              <div className="media-link-grp">
                                <div className="link-img">
                                  <Link to="#">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-link-01.jpg"
                                      alt="Img"
                                    />
                                  </Link>
                                </div>
                                <div className="media-link-detail">
                                  <h6>
                                    <Link to="#">Digital Marketing Guide</Link>
                                  </h6>
                                  <span>
                                    <Link to="#">
                                      https://elements.envato.com/all-items/blog
                                    </Link>
                                  </span>
                                </div>
                              </div>
                              <div className="media-link-grp mb-0">
                                <div className="link-img">
                                  <Link to="#">
                                    <ImageWithBasePath
                                      src="assets/img/media/media-link-02.jpg"
                                      alt="Img"
                                    />
                                  </Link>
                                </div>
                                <div className="media-link-detail">
                                  <h6>
                                    <Link to="#">Blog Post</Link>
                                  </h6>
                                  <span>
                                    <Link to="#">
                                      https://elements.envato.com/blog-post-TXQ5FB8
                                    </Link>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="chat-message-grp">
                        <ul>
                          <li>
                            <Link to="#" className="star-message-left">
                              <div className="stared-group">
                                <span className="star-message">
                                  <i className="bx bx-star" />
                                </span>
                                <h6>Starred Messages</h6>
                              </div>
                              <div className="count-group">
                                <span>10</span>
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <div className="stared-group">
                                <span className="mute-message">
                                  {" "}
                                  <i className="bx bx-microphone-off" />
                                </span>
                                <h6>Mute Notifications</h6>
                              </div>
                              <div className="count-group">
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <div className="stared-group">
                                <span className="block-message">
                                  {" "}
                                  <i className="bx bx-x-circle" />
                                </span>
                                <h6>Block User</h6>
                              </div>
                              <div className="count-group">
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <div className="stared-group">
                                <span className="report-message">
                                  {" "}
                                  <i className="bx bx-user-x" />
                                </span>
                                <h6>Report User</h6>
                              </div>
                              <div className="count-group">
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <div className="stared-group">
                                <span className="delete-message">
                                  {" "}
                                  <i className="bx bx-trash-alt" />
                                </span>
                                <h6>Delete Chat</h6>
                              </div>
                              <div className="count-group">
                                <i className="bx bx-chevron-right" />
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </PerfectScrollbar>
                  </div>
                </div>
              </div>
              {/* Right sidebar */}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Chat;
