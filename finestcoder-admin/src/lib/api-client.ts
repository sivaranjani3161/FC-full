import { API_BASE } from '@/constants/api';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const { body, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${normalized}`, {
    ...rest,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const message =
      typeof payload === 'object' && payload && 'error' in payload
        ? String((payload as { error: string }).error)
        : res.statusText;
    throw new ApiError(message || 'Request failed', res.status, payload);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function apiUpload(path: string, formData: FormData): Promise<{ url: string }> {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const res = await fetch(`${API_BASE}${normalized}`, {
    method: 'POST',
    body: formData,
    cache: 'no-store',
  });
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new ApiError('Upload failed', res.status, payload);
  }
  return res.json();
}
