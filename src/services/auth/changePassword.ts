import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/** Changes the signed-in user's password on the server. */
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  try {
    await apiClient.post(endpoints.auth.changePassword, payload);
  } catch (err) {
    throw err instanceof Error ? err : new Error('Could not change the password');
  }
}