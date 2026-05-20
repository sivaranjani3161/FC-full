import { apiUpload } from '@/lib/api-client';

export const uploadService = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiUpload('/upload', formData);
  },
};
