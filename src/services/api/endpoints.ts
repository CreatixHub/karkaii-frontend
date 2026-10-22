/**
 * Every API path in one place.
 *
 * Paths are relative to `VITE_API_BASE_URL` — never include the host here.
 * When the backend renames a route, this is the only file that changes.
 */

export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  students: {
    list: '/students',
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
