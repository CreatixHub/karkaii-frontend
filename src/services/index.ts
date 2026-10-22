/**
 * Service layer entry point.
 *
 * Components and hooks import services from here (or from the domain folder),
 * never the mock/http implementations directly.
 */

export { apiClient, createService, endpoints } from './api';
export { ApiError, getUserMessage, toApiError } from './api';

export { authService, tokenStorage } from './auth';
export type { AuthService, AuthSession, AuthUser, LoginCredentials } from './auth';

export { studentsService } from './students';
export type { Student, StudentsService } from './students';

export { dashboardService } from './dashboard';
export type { AdminDashboard, DashboardService } from './dashboard';
