import { useState } from 'react';
import DateField from '@components/ui/DateField';
import Modal from '@components/ui/Modal';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AlumniModalId } from '../data/alumni.data';
import {
  alumnusOptions,
  chapterModalOptions,
  chapterTypeOptions,
  coordinatorOptions,
  departmentOptions,
  durationOptions,
  editChapterOptions,
  editCountryOptions,
  eventTypeOptions,
  focusAreaOptions,
  graduationYearModalOptions,
  inviteToOptions,
  mentorFormatOptions,
  openToAudienceOptions,
  opportunityCategoryOptions,
  organiserOptions,
  postedByOptions,
  preferredMentorOptions,
  registerCountryOptions,
  registerIndustryOptions,
  studentOptions,
  templateOptions,
} from '../data/alumni.data';


const cancelLink = (onClose: () => void) => (
  <a href="#" className="btn btn-light me-2" onClick={(event) => { event.preventDefault(); onClose(); }}>
    Cancel
  </a>
);

export interface AlumniModalsProps {
  active: AlumniModalId | null;
  onClose: () => void;
  onToast: (message: string) => void;
}

const AlumniModals = ({ active, onClose, onToast }: AlumniModalsProps) => {
  /* ----------------------------- Register Alumni ----------------------------- */
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regYear, setRegYear] = useState(graduationYearModalOptions[0]);
  const [regDept, setRegDept] = useState(departmentOptions[0]);
  const [regChapter, setRegChapter] = useState(chapterModalOptions[0]);
  const [regPosition, setRegPosition] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regIndustry, setRegIndustry] = useState(registerIndustryOptions[0]);
  const [regCountry, setRegCountry] = useState(registerCountryOptions[0]);
  const [regMentor, setRegMentor] = useState(true);
  const [regRecruit, setRegRecruit] = useState(false);
  const [regSpeak, setRegSpeak] = useState(false);

  const submitRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Alumni registered successfully');
    onClose();
  };

  /* ------------------------------- Edit Alumni ------------------------------- */
  const [editName, setEditName] = useState('Arun Krishnan');
  const [editEmail, setEditEmail] = useState('arun.k@example.com');
  const [editPosition, setEditPosition] = useState('Principal Engineer');
  const [editCompany, setEditCompany] = useState('Google');
  const [editChapter, setEditChapter] = useState(editChapterOptions[0]);
  const [editCountry, setEditCountry] = useState(editCountryOptions[0]);
  const [editSkills, setEditSkills] = useState('Distributed Systems, Go, Kubernetes, Mentoring');
  const [editBio, setEditBio] = useState('Platform engineer with thirteen years building large-scale distributed systems.');

  const submitEdit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Alumni profile updated');
    onClose();
  };

  /* ------------------------------ Create Chapter ------------------------------ */
  const [chapName, setChapName] = useState('');
  const [chapType, setChapType] = useState(chapterTypeOptions[0]);
  const [chapLocation, setChapLocation] = useState('');
  const [chapCoordinator, setChapCoordinator] = useState(coordinatorOptions[0]);
  const [chapLaunchDate, setChapLaunchDate] = useState('');
  const [chapDescription, setChapDescription] = useState('');
  const [chapOpen, setChapOpen] = useState(true);

  const submitChapter = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Chapter created successfully');
    onClose();
  };

  /* ------------------------------- Create Event ------------------------------- */
  const [evTitle, setEvTitle] = useState('');
  const [evType, setEvType] = useState(eventTypeOptions[0]);
  const [evOrganiser, setEvOrganiser] = useState(organiserOptions[0]);
  const [evDate, setEvDate] = useState('');
  const [evStartTime, setEvStartTime] = useState('');
  const [evVenue, setEvVenue] = useState('');
  const [evCapacity, setEvCapacity] = useState('');
  const [evDescription, setEvDescription] = useState('');
  const [evRsvp, setEvRsvp] = useState(true);

  const submitEvent = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Event created successfully');
    onClose();
  };

  /* ---------------------------- Create Opportunity ---------------------------- */
  const [opTitle, setOpTitle] = useState('');
  const [opCategory, setOpCategory] = useState(opportunityCategoryOptions[0]);
  const [opOrganisation, setOpOrganisation] = useState('');
  const [opLocation, setOpLocation] = useState('');
  const [opDeadline, setOpDeadline] = useState('');
  const [opPostedBy, setOpPostedBy] = useState(postedByOptions[0]);
  const [opOpenTo, setOpOpenTo] = useState(openToAudienceOptions[0]);
  const [opDetails, setOpDetails] = useState('');

  const submitOpportunity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Opportunity published successfully');
    onClose();
  };

  /* ------------------------------ Invite Alumni ------------------------------ */
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteTo, setInviteTo] = useState(inviteToOptions[0]);
  const [inviteTemplate, setInviteTemplate] = useState(templateOptions[0]);
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteRemind, setInviteRemind] = useState(true);

  const submitInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Invitations sent successfully');
    onClose();
  };

  /* ------------------------------ Request Mentor ------------------------------ */
  const [mentorStudent, setMentorStudent] = useState(studentOptions[0]);
  const [mentorPreferred, setMentorPreferred] = useState(preferredMentorOptions[0]);
  const [mentorFocus, setMentorFocus] = useState(focusAreaOptions[0]);
  const [mentorFormat, setMentorFormat] = useState(mentorFormatOptions[0]);
  const [mentorDuration, setMentorDuration] = useState(durationOptions[0]);
  const [mentorWhy, setMentorWhy] = useState('');

  const submitMentor = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Mentor request sent');
    onClose();
  };

  /* ---------------------------- Share Success Story --------------------------- */
  const [storyHeadline, setStoryHeadline] = useState('');
  const [storyAlumnus, setStoryAlumnus] = useState(alumnusOptions[0]);
  const [storyAward, setStoryAward] = useState('');
  const [storyCompany, setStoryCompany] = useState('');
  const [storyPublishOn, setStoryPublishOn] = useState('');
  const [storyCoverPhoto, setStoryCoverPhoto] = useState('');
  const [storyBody, setStoryBody] = useState('');
  const [storyFeature, setStoryFeature] = useState(true);

  const submitStory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onToast('Success story published');
    onClose();
  };

  return (
    <>
      {/* Register Alumni Modal */}
      <Modal
        open={active === 'register'}
        onClose={onClose}
        title="Register Alumni"
        titleIcon="ti ti-user-plus"
        dialogClassName="modal-lg"
        onSubmit={submitRegister}
        footer={
          <>
            {cancelLink(onClose)}
            <button type="submit" className="btn btn-primary">
              Register Alumni
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="full-name">
              Full name
            </label>
            <input type="text" className="form-control" placeholder="Enter full name" id="full-name" value={regName} onChange={(e) => setRegName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="email-address">
              Email address
            </label>
            <input type="email" className="form-control" placeholder="name@example.com" id="email-address" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="phone">
              Phone
            </label>
            <input type="text" className="form-control" placeholder="+91 00000 00000" id="phone" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="graduation-year">
              Graduation year
            </label>
            <select className="form-select" id="graduation-year" value={regYear} onChange={(e) => setRegYear(e.target.value)}>
              {graduationYearModalOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="department-2">
              Department
            </label>
            <select className="form-select" id="department-2" value={regDept} onChange={(e) => setRegDept(e.target.value)}>
              {departmentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="chapter-2">
              Chapter
            </label>
            <select className="form-select" id="chapter-2" value={regChapter} onChange={(e) => setRegChapter(e.target.value)}>
              {chapterModalOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="current-position">
              Current position
            </label>
            <input type="text" className="form-control" placeholder="e.g. Software Engineer" id="current-position" value={regPosition} onChange={(e) => setRegPosition(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="company">
              Company
            </label>
            <input type="text" className="form-control" placeholder="Enter organisation" id="company" value={regCompany} onChange={(e) => setRegCompany(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="industry-2">
              Industry
            </label>
            <select className="form-select" id="industry-2" value={regIndustry} onChange={(e) => setRegIndustry(e.target.value)}>
              {registerIndustryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="country-2">
              Country
            </label>
            <select className="form-select" id="country-2" value={regCountry} onChange={(e) => setRegCountry(e.target.value)}>
              {registerCountryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <span className="metric-label">Open to</span>
            <div className="d-flex flex-wrap gap-4 mt-1">
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="alx_reg_mentor" checked={regMentor} onChange={(e) => setRegMentor(e.target.checked)} />
                <label className="form-check-label" htmlFor="alx_reg_mentor">
                  Mentoring
                </label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="alx_reg_recruit" checked={regRecruit} onChange={(e) => setRegRecruit(e.target.checked)} />
                <label className="form-check-label" htmlFor="alx_reg_recruit">
                  Recruitment
                </label>
              </div>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="alx_reg_speak" checked={regSpeak} onChange={(e) => setRegSpeak(e.target.checked)} />
                <label className="form-check-label" htmlFor="alx_reg_speak">
                  Speaking
                </label>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Alumni Modal */}
      <Modal
        open={active === 'edit'}
        onClose={onClose}
        title="Edit Alumni"
        titleIcon="ti ti-edit"
        dialogClassName="modal-lg"
        onSubmit={submitEdit}
        footer={
          <>
            {cancelLink(onClose)}
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </>
        }
      >
        <div className="d-flex align-items-center gap-3 mb-4">
          <ImageWithBasePath src="assets/img/profiles/avatar-01.jpg" className="rounded-2" width={56} height={56} alt="Arun Krishnan" />
          <div>
            <a href="#" className="btn btn-outline-light bg-white btn-sm fw-medium" onClick={(event) => event.preventDefault()}>
              <i className="ti ti-upload me-1" />
              Change photo
            </a>
            <p className="fs-12 text-muted mb-0 mt-1">JPG or PNG, up to 2 MB</p>
          </div>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="full-name-2">
              Full name
            </label>
            <input type="text" className="form-control" id="full-name-2" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="email-address-2">
              Email address
            </label>
            <input type="email" className="form-control" id="email-address-2" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="current-position-2">
              Current position
            </label>
            <input type="text" className="form-control" id="current-position-2" value={editPosition} onChange={(e) => setEditPosition(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="company-2">
              Company
            </label>
            <input type="text" className="form-control" id="company-2" value={editCompany} onChange={(e) => setEditCompany(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="chapter-3">
              Chapter
            </label>
            <select className="form-select" id="chapter-3" value={editChapter} onChange={(e) => setEditChapter(e.target.value)}>
              {editChapterOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="country-3">
              Country
            </label>
            <select className="form-select" id="country-3" value={editCountry} onChange={(e) => setEditCountry(e.target.value)}>
              {editCountryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="skills">
              Skills
            </label>
            <input type="text" className="form-control" id="skills" value={editSkills} onChange={(e) => setEditSkills(e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="bio">
              Bio
            </label>
            <textarea className="form-control" rows={3} id="bio" value={editBio} onChange={(e) => setEditBio(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Create Chapter Modal */}
      <Modal
        open={active === 'chapter'}
        onClose={onClose}
        title="Create Chapter"
        titleIcon="ti ti-flag-3"
        onSubmit={submitChapter}
        footer={
          <>
            {cancelLink(onClose)}
            <button type="submit" className="btn btn-primary">
              Create Chapter
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="chapter-name">
              Chapter name
            </label>
            <input type="text" className="form-control" placeholder="e.g. Hyderabad Chapter" id="chapter-name" value={chapName} onChange={(e) => setChapName(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="type">
              Type
            </label>
            <select className="form-select" id="type" value={chapType} onChange={(e) => setChapType(e.target.value)}>
              {chapterTypeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input type="text" className="form-control" placeholder="City, country" id="location" value={chapLocation} onChange={(e) => setChapLocation(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="coordinator">
              Coordinator
            </label>
            <select className="form-select" id="coordinator" value={chapCoordinator} onChange={(e) => setChapCoordinator(e.target.value)}>
              {coordinatorOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="launch-date">
              Launch date
            </label>
            <DateField
              placeholder="Select date"
              id="launch-date"
              value={chapLaunchDate}
              onChange={(dateString) => setChapLaunchDate(dateString as string)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea className="form-control" rows={3} placeholder="What is this chapter for?" id="description" value={chapDescription} onChange={(e) => setChapDescription(e.target.value)} />
          </div>
          <div className="col-12">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="alx_ch_open" checked={chapOpen} onChange={(e) => setChapOpen(e.target.checked)} />
              <label className="form-check-label" htmlFor="alx_ch_open">
                Open for members to join immediately
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Create Event Modal */}
      <Modal
        open={active === 'event'}
        onClose={onClose}
        title="Create Event"
        titleIcon="ti ti-calendar-plus"
        dialogClassName="modal-lg"
        onSubmit={submitEvent}
        footer={
          <>
            {cancelLink(onClose)}
            <button type="submit" className="btn btn-primary">
              Create Event
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="event-title">
              Event title
            </label>
            <input type="text" className="form-control" placeholder="e.g. Annual Alumni Reunion 2027" id="event-title" value={evTitle} onChange={(e) => setEvTitle(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="event-type">
              Event type
            </label>
            <select className="form-select" id="event-type" value={evType} onChange={(e) => setEvType(e.target.value)}>
              {eventTypeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="organiser">
              Organiser
            </label>
            <select className="form-select" id="organiser" value={evOrganiser} onChange={(e) => setEvOrganiser(e.target.value)}>
              {organiserOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="date">
              Date
            </label>
            <DateField
              placeholder="Select date"
              id="date"
              value={evDate}
              onChange={(dateString) => setEvDate(dateString as string)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="start-time">
              Start time
            </label>
            <input type="text" className="form-control" placeholder="6:30 PM" id="start-time" value={evStartTime} onChange={(e) => setEvStartTime(e.target.value)} />
          </div>
          <div className="col-md-8">
            <label className="form-label" htmlFor="venue">
              Venue
            </label>
            <input type="text" className="form-control" placeholder="Venue or meeting link" id="venue" value={evVenue} onChange={(e) => setEvVenue(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input type="number" className="form-control" placeholder="500" id="capacity" value={evCapacity} onChange={(e) => setEvCapacity(e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="description-2">
              Description
            </label>
            <textarea className="form-control" rows={3} placeholder="Tell alumni what to expect" id="description-2" value={evDescription} onChange={(e) => setEvDescription(e.target.value)} />
          </div>
          <div className="col-12">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="alx_ev_rsvp" checked={evRsvp} onChange={(e) => setEvRsvp(e.target.checked)} />
              <label className="form-check-label" htmlFor="alx_ev_rsvp">
                Open RSVP as soon as the event is published
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Create Opportunity Modal */}
      <Modal
        open={active === 'opportunity'}
        onClose={onClose}
        title="Create Opportunity"
        titleIcon="ti ti-briefcase"
        dialogClassName="modal-lg"
        onSubmit={submitOpportunity}
        footer={
          <>
            {cancelLink(onClose)}
            <button type="submit" className="btn btn-primary">
              Publish Opportunity
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input type="text" className="form-control" placeholder="e.g. Graduate Software Engineer" id="title" value={opTitle} onChange={(e) => setOpTitle(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="category">
              Category
            </label>
            <select className="form-select" id="category" value={opCategory} onChange={(e) => setOpCategory(e.target.value)}>
              {opportunityCategoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="organisation">
              Organisation
            </label>
            <input type="text" className="form-control" placeholder="Enter organisation" id="organisation" value={opOrganisation} onChange={(e) => setOpOrganisation(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="location-2">
              Location
            </label>
            <input type="text" className="form-control" placeholder="City or Remote" id="location-2" value={opLocation} onChange={(e) => setOpLocation(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="application-deadline">
              Application deadline
            </label>
            <DateField
              placeholder="Select date"
              id="application-deadline"
              value={opDeadline}
              onChange={(dateString) => setOpDeadline(dateString as string)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="posted-by">
              Posted by
            </label>
            <select className="form-select" id="posted-by" value={opPostedBy} onChange={(e) => setOpPostedBy(e.target.value)}>
              {postedByOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="open-to-2">
              Open to
            </label>
            <select className="form-select" id="open-to-2" value={opOpenTo} onChange={(e) => setOpOpenTo(e.target.value)}>
              {openToAudienceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="details">
              Details
            </label>
            <textarea className="form-control" rows={4} placeholder="Responsibilities, eligibility and how to apply" id="details" value={opDetails} onChange={(e) => setOpDetails(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Invite Alumni Modal */}
      <Modal
        open={active === 'invite'}
        onClose={onClose}
        title="Invite Alumni"
        titleIcon="ti ti-mail-star"
        onSubmit={submitInvite}
        footer={
          <>
            {cancelLink(onClose)}
            <button type="submit" className="btn btn-primary">
              Send Invitations
            </button>
          </>
        }
      >
        <div className="mb-3">
          <label className="form-label" htmlFor="email-addresses">
            Email addresses
          </label>
          <textarea className="form-control" rows={3} placeholder="Separate multiple addresses with a comma" id="email-addresses" value={inviteEmails} onChange={(e) => setInviteEmails(e.target.value)} />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="invite-to">
              Invite to
            </label>
            <select className="form-select" id="invite-to" value={inviteTo} onChange={(e) => setInviteTo(e.target.value)}>
              {inviteToOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="template">
              Template
            </label>
            <select className="form-select" id="template" value={inviteTemplate} onChange={(e) => setInviteTemplate(e.target.value)}>
              {templateOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="personal-message">
              Personal message
            </label>
            <textarea className="form-control" rows={3} placeholder="Add a short note (optional)" id="personal-message" value={inviteMessage} onChange={(e) => setInviteMessage(e.target.value)} />
          </div>
          <div className="col-12">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="alx_inv_remind" checked={inviteRemind} onChange={(e) => setInviteRemind(e.target.checked)} />
              <label className="form-check-label" htmlFor="alx_inv_remind">
                Send a reminder after 7 days if there is no response
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Request Mentor Modal */}
      <Modal
        open={active === 'mentor'}
        onClose={onClose}
        title="Request Mentor"
        titleIcon="ti ti-compass"
        onSubmit={submitMentor}
        footer={
          <>
            {cancelLink(onClose)}
            <button type="submit" className="btn btn-primary">
              Send Request
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="student">
              Student
            </label>
            <select className="form-select" id="student" value={mentorStudent} onChange={(e) => setMentorStudent(e.target.value)}>
              {studentOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="preferred-mentor">
              Preferred mentor
            </label>
            <select className="form-select" id="preferred-mentor" value={mentorPreferred} onChange={(e) => setMentorPreferred(e.target.value)}>
              {preferredMentorOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="focus-area">
              Focus area
            </label>
            <select className="form-select" id="focus-area" value={mentorFocus} onChange={(e) => setMentorFocus(e.target.value)}>
              {focusAreaOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="format">
              Format
            </label>
            <select className="form-select" id="format" value={mentorFormat} onChange={(e) => setMentorFormat(e.target.value)}>
              {mentorFormatOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="duration">
              Duration
            </label>
            <select className="form-select" id="duration" value={mentorDuration} onChange={(e) => setMentorDuration(e.target.value)}>
              {durationOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="why-this-student">
              Why this student
            </label>
            <textarea className="form-control" rows={3} placeholder="Give the mentor some context" id="why-this-student" value={mentorWhy} onChange={(e) => setMentorWhy(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Share Success Story Modal */}
      <Modal
        open={active === 'story'}
        onClose={onClose}
        title="Share Success Story"
        titleIcon="ti ti-sparkles"
        dialogClassName="modal-lg"
        onSubmit={submitStory}
        footer={
          <>
            {cancelLink(onClose)}
            <button type="submit" className="btn btn-primary">
              Publish Story
            </button>
          </>
        }
      >
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="headline">
              Headline
            </label>
            <input type="text" className="form-control" placeholder="One line that captures the achievement" id="headline" value={storyHeadline} onChange={(e) => setStoryHeadline(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="alumnus">
              Alumnus
            </label>
            <select className="form-select" id="alumnus" value={storyAlumnus} onChange={(e) => setStoryAlumnus(e.target.value)}>
              {alumnusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="award-or-recognition">
              Award or recognition
            </label>
            <input type="text" className="form-control" placeholder="e.g. Distinguished Alumnus 2026" id="award-or-recognition" value={storyAward} onChange={(e) => setStoryAward(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="company-3">
              Company
            </label>
            <input type="text" className="form-control" placeholder="Enter organisation" id="company-3" value={storyCompany} onChange={(e) => setStoryCompany(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="publish-on">
              Publish on
            </label>
            <DateField
              placeholder="Select date"
              id="publish-on"
              value={storyPublishOn}
              onChange={(dateString) => setStoryPublishOn(dateString as string)}
            />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="cover-photo">
              Cover photo
            </label>
            <input
              type="file"
              className="form-control"
              id="cover-photo"
              onChange={(e) => setStoryCoverPhoto(e.target.files?.[0]?.name ?? '')}
            />
            {storyCoverPhoto ? <p className="fs-12 text-muted mb-0 mt-1">{storyCoverPhoto}</p> : null}
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="story">
              Story
            </label>
            <textarea className="form-control" rows={4} placeholder="Write the story in two or three short paragraphs" id="story" value={storyBody} onChange={(e) => setStoryBody(e.target.value)} />
          </div>
          <div className="col-12">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="alx_st_feature" checked={storyFeature} onChange={(e) => setStoryFeature(e.target.checked)} />
              <label className="form-check-label" htmlFor="alx_st_feature">
                Mark as featured in Alumni Spotlight
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AlumniModals;
