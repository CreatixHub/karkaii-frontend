import { apiClient } from '@services/api/client';

export type FilePurpose = 'admission_photo' | 'student_photo';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export interface UploadedFile {
  id: string | number;
  [key: string]: unknown;
}

/** Returns an error message when the file is not an acceptable photo, otherwise null. */
export function checkImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'Photo must be a JPG, PNG or WebP image.';
  if (file.size > MAX_IMAGE_BYTES) return 'Photo must be 5 MB or smaller.';
  return null;
}

/** Uploads an image as a raw body and returns the stored file record (with its id). */
export async function uploadImage(file: File, purpose: FilePurpose): Promise<UploadedFile> {
  const problem = checkImage(file);
  if (problem) throw new Error(problem);
  return apiClient.post<UploadedFile>('/files', file, {
    query: { purpose, filename: file.name },
    headers: { 'Content-Type': file.type },
    rawBody: true,
  });
}