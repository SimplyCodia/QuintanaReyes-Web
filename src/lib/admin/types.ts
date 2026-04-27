export enum Rol {
  ADMIN = 'ADMIN',
  ABOGADO = 'ABOGADO',
}

export enum TipoCaso {
  FAMILIA = 'FAMILIA',
  ADMINISTRATIVO = 'ADMINISTRATIVO',
  CORPORATIVO = 'CORPORATIVO',
  CIVIL = 'CIVIL',
  PENAL = 'PENAL',
  LABORAL = 'LABORAL',
  MIGRATORIO = 'MIGRATORIO',
}

export enum EstadoSolicitud {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  ATENDIDA = 'ATENDIDA',
  ARCHIVADA = 'ARCHIVADA',
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
  ultimoAcceso: string | null;
  fechaCreacion: string;
}

export interface Solicitud {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  tipoCaso: TipoCaso;
  mensaje: string | null;
  estado: EstadoSolicitud;
  notasInternas: string | null;
  asignadoAId: string | null;
  asignadoNombre: string | null;
  origen: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface HistorialEstado {
  id: string;
  solicitudId: string;
  estadoAnterior: EstadoSolicitud | null;
  estadoNuevo: EstadoSolicitud;
  usuarioId: string | null;
  usuarioNombre: string | null;
  comentario: string | null;
  fecha: string;
}

export interface AuditLog {
  id: string;
  usuarioId: string | null;
  usuarioNombre: string | null;
  accion: string;
  entidad: string | null;
  entidadId: string | null;
  metadata: Record<string, unknown> | null;
  fecha: string;
}

export interface SolicitudDetalle extends Solicitud {
  historial: HistorialEstado[];
}

export interface DashboardStats {
  totalSolicitudes: number;
  pendientes: number;
  enProceso: number;
  atendidasMes?: number;
  atendidas?: number;
  nuevasHoy?: number;
  solicitudesHoy?: number;
  nuevasSemana?: number;
  solicitudesSemana?: number;
  [key: string]: number | undefined;
}

export interface SolicitudesPorDia {
  fecha: string;
  cantidad: number;
}

export interface DistribucionPorArea {
  area: TipoCaso;
  cantidad: number;
  porcentaje: number;
}

// ── Blog ──────────────────────────────────────────────────────────
export type EstadoBlog = 'BORRADOR' | 'PROGRAMADO' | 'PUBLICADO' | 'ARCHIVADO';

export interface BlogPostInput {
  titulo_es: string;
  titulo_en?: string;
  extracto_es?: string | null;
  extracto_en?: string | null;
  contenido_es: string;
  contenido_en?: string;
  categoria_es?: string | null;
  categoria_en?: string | null;
  tags_es?: string[];
  tags_en?: string[];
  imagenDestacada?: string | null;
  imagenDestacadaMime?: string | null;
  autor: string;
  estado: EstadoBlog;
  fechaPublicacion?: string | null;
}

export interface BlogPost extends BlogPostInput {
  id: number;
  slug_es: string;
  slug_en: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPorId: number | null;
}

/**
 * Lighter shape returned by the admin listing endpoint (no contenido fields).
 */
export type BlogPostSummary = Omit<BlogPost, 'contenido_es' | 'contenido_en'>;

/**
 * Projected shape returned by the public API (?lang=es|en).
 * The backend aliases the bilingual fields into locale-neutral names.
 */
export interface BlogPostPublic {
  id: number;
  titulo: string;
  slug: string;
  /** Both slugs are exposed so the client can build language-switcher URLs. */
  slug_es: string | null;
  slug_en: string | null;
  extracto: string | null;
  contenido: string;
  categoria: string | null;
  tags: string[];
  imagenDestacada?: string | null;
  imagenDestacadaMime?: string | null;
  autor: string;
  estado: EstadoBlog;
  fechaPublicacion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPorId: number | null;
}
