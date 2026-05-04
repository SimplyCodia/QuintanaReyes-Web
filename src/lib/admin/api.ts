import type {
  User,
  Solicitud,
  SolicitudDetalle,
  DashboardStats,
  SolicitudesPorDia,
  DistribucionPorArea,
  AuditLog,
  BlogPost,
  BlogPostSummary,
  BlogPostInput,
  BlogPostPublic,
  Cliente,
  ClienteDetalle,
  Comentario,
  Notificacion,
} from './types';
import type { Locale } from '@/lib/i18n';

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
  const qs = days ? `?dias=${days}` : '';
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

// Blog (admin)

export async function getBlogPostsAdmin(filters?: {
  estado?: string;
  categoria?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: BlogPostSummary[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams();
  if (filters?.estado) params.set('estado', filters.estado);
  if (filters?.categoria) params.set('categoria', filters.categoria);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  const result = await request<{
    success: boolean;
    data: BlogPostSummary[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`/blog/admin/all${qs ? `?${qs}` : ''}`);
  return { data: result.data, pagination: result.pagination };
}

export async function getBlogPostById(id: number): Promise<BlogPost> {
  const result = await request<{ success: boolean; data: BlogPost }>(`/blog/admin/${id}`);
  return result.data;
}

export async function createBlogPost(data: BlogPostInput): Promise<BlogPost> {
  const result = await request<{ success: boolean; data: BlogPost }>('/blog', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function updateBlogPost(
  id: number,
  data: Partial<BlogPostInput>,
): Promise<BlogPost> {
  const result = await request<{ success: boolean; data: BlogPost }>(`/blog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteBlogPost(id: number): Promise<void> {
  await request(`/blog/${id}`, { method: 'DELETE' });
}

// Blog (public)

export async function getPublicBlogPosts(
  filters?: {
    categoria?: string;
    search?: string;
    page?: number;
    limit?: number;
  },
  lang?: Locale,
): Promise<{
  data: BlogPostPublic[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const params = new URLSearchParams();
  if (filters?.categoria) params.set('categoria', filters.categoria);
  if (filters?.search) params.set('search', filters.search);
  if (filters?.page) params.set('page', String(filters.page));
  if (filters?.limit) params.set('limit', String(filters.limit));
  if (lang) params.set('lang', lang);
  const qs = params.toString();
  const result = await request<{
    success: boolean;
    data: BlogPostPublic[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`/blog${qs ? `?${qs}` : ''}`);
  return { data: result.data, pagination: result.pagination };
}

export async function getPublicBlogPostBySlug(slug: string, lang?: Locale): Promise<BlogPostPublic> {
  const qs = lang ? `?lang=${lang}` : '';
  const result = await request<{ success: boolean; data: BlogPostPublic }>(
    `/blog/${encodeURIComponent(slug)}${qs}`,
  );
  return result.data;
}

// Audit

export async function getAuditLogs(limit?: number): Promise<AuditLog[]> {
  const qs = limit ? `?limit=${limit}` : '';
  const result = await request<{ success: boolean; data: AuditLog[] }>(`/audit${qs}`);
  return result.data;
}

// Clientes

export async function getClientes(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{
  data: Cliente[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  const result = await request<{
    success: boolean;
    data: Cliente[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>(`/clientes${qs ? `?${qs}` : ''}`);
  return { data: result.data, pagination: result.pagination };
}

export async function getClienteById(id: number): Promise<ClienteDetalle> {
  const result = await request<{ success: boolean; data: ClienteDetalle }>(`/clientes/${id}`);
  return result.data;
}

export async function createCliente(data: {
  nombre: string;
  telefono: string;
  email: string;
  notas?: string;
}): Promise<Cliente> {
  const result = await request<{ success: boolean; data: Cliente }>('/clientes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function updateCliente(id: number, data: Record<string, unknown>): Promise<Cliente> {
  const result = await request<{ success: boolean; data: Cliente }>(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.data;
}

export async function deleteCliente(id: number): Promise<void> {
  await request<{ success: boolean }>(`/clientes/${id}`, { method: 'DELETE' });
}

export async function createSolicitudAdmin(data: {
  nombre: string;
  telefono: string;
  email: string;
  tipoCaso: string;
  mensaje?: string;
  origen: string;
  clienteId?: number | null;
}): Promise<Solicitud> {
  const result = await request<{ success: boolean; data: Solicitud }>('/solicitudes/admin', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return result.data;
}

// Comentarios

export async function getComentarios(solicitudId: string | number) {
  return request<{ data: Comentario[] }>(`/solicitudes/${solicitudId}/comentarios`);
}

export async function createComentario(
  solicitudId: string | number,
  data: { contenido: string; parentId?: number | null },
) {
  return request<{ data: Comentario }>(`/solicitudes/${solicitudId}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

// Notificaciones

export async function getNotificaciones(params?: { limit?: number; soloNoLeidas?: boolean }) {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.soloNoLeidas) query.set('soloNoLeidas', '1');
  const qs = query.toString();
  return request<{ data: Notificacion[]; totalNoLeidas: number }>(
    `/notificaciones${qs ? `?${qs}` : ''}`,
  );
}

export async function getNotificacionesUnreadCount(): Promise<{ totalNoLeidas: number }> {
  return request<{ totalNoLeidas: number }>('/notificaciones/unread-count');
}

export async function marcarNotificacionLeida(id: number) {
  return request<{ success: boolean }>(`/notificaciones/${id}/leer`, { method: 'PUT' });
}

export async function marcarTodasNotificacionesLeidas() {
  return request<{ success: boolean }>('/notificaciones/leer-todas', { method: 'PUT' });
}
