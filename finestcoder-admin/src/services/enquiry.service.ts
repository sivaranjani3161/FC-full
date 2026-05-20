import { apiRequest } from '@/lib/api-client';

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'CONVERTED' | 'CLOSED';

export type Enquiry = {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  status: EnquiryStatus;
  courseId?: number | null;
  course?: { id: number; title: string; slug: string };
  createdAt?: string;
};

export const enquiryService = {
  list: () => apiRequest<Enquiry[]>('/enquiries'),
  updateStatus: (id: number, status: EnquiryStatus) =>
    apiRequest<Enquiry>(`/enquiries/${id}`, { method: 'PUT', body: { status } }),
  remove: (id: number) =>
    apiRequest<{ success: boolean }>(`/enquiries/${id}`, { method: 'DELETE' }),
};
