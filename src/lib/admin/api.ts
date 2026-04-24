import type {
  User,
  Solicitud,
  SolicitudDetalle,
  DashboardStats,
  SolicitudesPorDia,
  DistribucionPorArea,
  AuditLog,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('qr_token') : null;
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers as Record<string, string>) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data as { message?: string }).message || 'Error en la solicitud');
  return data as T;
}

// Auth

export async function login(
  email: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const data = await request<{ success: boolean; data: { user: User; token: string } }>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    },
  );
  return data.data;
}

export async function logout(): Promise<void> {
  await request('/auth/logout', { method: 'POST' }).catch(() => {});
}

export async function getCurrentUser(): Promise<User> {
  const data = await request<{ success: boolean; data: User }>('/auth/me');
  return data.data;
}

// Solicitudes

export async function getSolicitudes(filters?: {
  estado?: string;
  tipoCaso?: string;
  asignadoAId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Solicitud[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams();
  if (filters?.estado) params.set('estado', filters.estado);
  if (filters?.tipoCaso) params.set('tipoCaso', filters.tipoCaso);
  if (filters?.asignadoAId) params.set('asignadoAId', filters.asignadoAId);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  const result = await request<{
    success: boolean;
    data: Solicitud[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`/solicitudes${qs ? `?${qs}` : ''}`);
  return { data: result.data, pagination: result.pagination };
}

export async function getSolicitudById(id: string): Promise<SolicitudDetalle> {
  const result = await request<{ success: boolean; data: SolicitudDetalle }>(
    `/solicitudes/${id}`,
  );
  return result.data;
}

export async function updateSolicitud(
  id: string,
  data: Record<string, unknown>,
): Promise<Solicitud> {
  const result = await request<{ success: boolean; data: Solicitud }>(`/solicitudes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.data;
}

// Users

export async function getUsers(): Promise<User[]> {
  const result = await request<{ success: boolean; data: User[] }>('/users');
  return result.data;
}

export async function createUser(data: Record<string, unknown>): Promise<User> {
  const result = await request<{ success: boolean; data: User }>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function updateUser(id: string, data: Record<string, unknown>): Promise<User> {
  const result = await request<{ success: boolean; data: User }>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.data;
}

// Dashboard

export async function getDashboardStats(): Promise<DashboardStats> {
  const result = await request<{ success: boolean; data: DashboardStats }>('/dashboard/stats');
  return result.data;
}

export async function getSolicitudesPorDia(days?: number): Promise<SolicitudesPorDia[]> {
  const qs = days ? `?days=${days}` : '';
  const result = await request<{ success: boolean; data: SolicitudesPorDia[] }>(
    `/dashboard/solicitudes-por-dia${qs}`,
  );
  return result.data;
}

export async function getDistribucionPorArea(): Promise<DistribucionPorArea[]> {
  const result = await request<{ success: boolean; data: DistribucionPorArea[] }>(
    '/dashboard/distribucion-por-area',
  );
  return result.data;
}

// Audit

export async function getAuditLogs(limit?: number): Promise<AuditLog[]> {
  const qs = limit ? `?limit=${limit}` : '';
  const result = await request<{ success: boolean; data: AuditLog[] }>(`/audit${qs}`);
  return result.data;
}
