import { apiRequest } from '@/lib/api-client';
import type { AdminUser } from '@/types/user';

export const userService = {
  list: () => apiRequest<AdminUser[]>('/users'),
  create: (payload: { email: string; name: string; roleId: number }) =>
    apiRequest<AdminUser>('/users', { method: 'POST', body: payload }),
  update: (
    id: number,
    payload: Partial<{ email: string; name: string; roleId: number; status: string }>,
  ) => apiRequest<AdminUser>(`/users/${id}`, { method: 'PUT', body: payload }),
  remove: (id: number) => apiRequest<void>(`/users/${id}`, { method: 'DELETE' }),
};
