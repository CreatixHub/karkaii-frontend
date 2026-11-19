/**
 * Every API path in one place.
 *
 * Paths are relative to `VITE_API_BASE_URL` — never include the host here.
 * When the backend renames a route, this is the only file that changes.
 */

export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    switchOrganization: '/auth/switch-organization',
    changePassword: '/auth/change-password',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  organizations: {
    create: '/organizations',
  },

  classes: {
    list: '/classes',
  },

  reports: {
    schoolStrength: '/reports/school-strength',
  },

  admissions: {
    list: '/admissions',
    create: '/admissions',
    detail: (id: string) => `/admissions/${id}`,
    accept: (id: string) => `/admissions/${id}/accept`,
  },

  students: {
    list: '/students',
    me: '/students/me',
    create: '/students',
    detail: (id: string) => `/students/${id}`,
    update: (id: string) => `/students/${id}`,
    remove: (id: string) => `/students/${id}`,
  },

  dashboard: {
    admin: '/dashboard/admin',
    teacher: '/dashboard/teacher',
    student: '/dashboard/student',
    parent: '/dashboard/parent',
  },
} as const;