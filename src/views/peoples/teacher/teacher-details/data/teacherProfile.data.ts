export const teacherProfile = {
  id: 'T849126',
  name: 'Teresa',
  avatar: 'assets/img/teachers/teacher-01.jpg',
  status: 'Active',
  designation: 'Senior Teacher',
  department: 'Science',
  qualification: 'M.Sc, B.Ed',
  employment: 'Permanent',
  joined: '25 May 2024',
  joinedShort: '25 May 24',
  experience: '9 yrs',
  office: '2nd Floor',
  classSection: 'III, A',
  subject: 'Physics',
  gender: 'Female',
  bloodGroup: 'O +ve',
  house: 'Red',
  languageKnown: 'English',
  languages: ['English', 'Spanish'],
  phone: '+1 46548 84498',
  email: 'jan@example.com',
  panNumber: '343445954908',
  hostel: {
    name: 'HI-Hostel, Floor',
    room: '25',
  },
  transport: {
    route: 'Newyork',
    busNumber: 'AM 54548',
    pickupPoint: 'Cincinatti',
  },
};

export type TeacherProfile = typeof teacherProfile;

/**
 * The "Login Details" dialog every teacher profile page ships in its footer.
 *
 * The template hardcodes a *student* identity here — `student-01.jpg`, "Janet",
 * "III, A" and a parent/student credential pair — on all five teacher pages.
 * The values are kept verbatim rather than silently corrected to Teresa.
 */
export const loginDetails = {
  avatar: 'assets/img/students/student-01.jpg',
  name: 'Janet',
  classSection: 'III, A',
  credentials: [
    { userType: 'Parent', userName: 'parent53', password: 'parent@53' },
    { userType: 'Student', userName: 'student20', password: 'stdt@53' },
  ],
};
