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
  atendidasMes: number;
  solicitudesHoy: number;
  solicitudesSemana: number;
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
