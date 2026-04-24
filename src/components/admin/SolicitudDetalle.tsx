'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Archive,
  Save,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Divider,
  Typography,
  Alert,
  Snackbar,
  Box,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { getSolicitudById, updateSolicitud, getUsers } from '@/lib/admin/api';
import {
  SolicitudDetalle as SolicitudDetalleType,
  EstadoSolicitud,
  TipoCaso,
  User as UserType,
} from '@/lib/admin/types';
import { formatDate, formatDateTime } from '@/lib/admin/utils';

interface Props {
  solicitudId: string;
}

const ESTADO_CHIP_COLOR: Record<
  EstadoSolicitud,
  'warning' | 'info' | 'success' | 'default'
> = {
  [EstadoSolicitud.PENDIENTE]: 'warning',
  [EstadoSolicitud.EN_PROCESO]: 'info',
  [EstadoSolicitud.ATENDIDA]: 'success',
  [EstadoSolicitud.ARCHIVADA]: 'default',
};

const ESTADO_LABELS: Record<EstadoSolicitud, string> = {
  [EstadoSolicitud.PENDIENTE]: 'Pendiente',
  [EstadoSolicitud.EN_PROCESO]: 'En Proceso',
  [EstadoSolicitud.ATENDIDA]: 'Atendida',
  [EstadoSolicitud.ARCHIVADA]: 'Archivada',
};

const TIPO_LABELS: Record<TipoCaso, string> = {
  [TipoCaso.FAMILIA]: 'Familia',
  [TipoCaso.ADMINISTRATIVO]: 'Administrativo',
  [TipoCaso.CORPORATIVO]: 'Corporativo',
  [TipoCaso.CIVIL]: 'Civil',
  [TipoCaso.PENAL]: 'Penal',
  [TipoCaso.LABORAL]: 'Laboral',
  [TipoCaso.MIGRATORIO]: 'Migratorio',
};

const ESTADO_ICONS: Record<EstadoSolicitud, React.ElementType> = {
  [EstadoSolicitud.PENDIENTE]: Clock,
  [EstadoSolicitud.EN_PROCESO]: AlertCircle,
  [EstadoSolicitud.ATENDIDA]: CheckCircle,
  [EstadoSolicitud.ARCHIVADA]: Archive,
};

export function SolicitudDetalle({ solicitudId }: Props) {
  const [solicitud, setSolicitud] = useState<SolicitudDetalleType | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);

  const [estado, setEstado] = useState<EstadoSolicitud | ''>('');
  const [asignadoAId, setAsignadoAId] = useState('');
  const [notasInternas, setNotasInternas] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [data, usersData] = await Promise.all([
        getSolicitudById(solicitudId),
        getUsers(),
      ]);
      setSolicitud(data);
      setEstado(data.estado);
      setAsignadoAId(data.asignadoAId ?? '');
      setNotasInternas(data.notasInternas ?? '');
      setUsers(usersData);
    } catch {
      setError('No se pudo cargar la solicitud.');
    } finally {
      setLoading(false);
    }
  }, [solicitudId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async () => {
    if (!solicitud) return;
    try {
      setSaving(true);
      setError('');
      const updated = await updateSolicitud(solicitudId, {
        estado: estado as EstadoSolicitud,
        asignadoAId: asignadoAId || null,
        notasInternas: notasInternas || null,
      });
      setSolicitud((prev) => (prev ? { ...prev, ...updated } : prev));
      setSnackOpen(true);
    } catch {
      setError('No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="text" width={240} height={32} />
        </Box>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <Skeleton variant="rounded" height={180} />
            <Skeleton variant="rounded" height={140} />
            <Skeleton variant="rounded" height={240} />
          </div>
          <div className="space-y-6">
            <Skeleton variant="rounded" height={320} />
            <Skeleton variant="rounded" height={180} />
          </div>
        </div>
      </div>
    );
  }

  if (error && !solicitud) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!solicitud) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          component={Link}
          href="/admin/solicitudes"
          startIcon={<ArrowLeft size={16} />}
          variant="text"
          size="small"
          sx={{
            color: '#6B6B6B',
            textTransform: 'none',
            '&:hover': { color: '#1A1A1A', bgcolor: 'transparent' },
          }}
        >
          Volver
        </Button>
        <Divider orientation="vertical" flexItem sx={{ borderColor: '#E6E6E6' }} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
              {solicitud.nombre}
            </Typography>
            <Chip
              label={ESTADO_LABELS[solicitud.estado]}
              color={ESTADO_CHIP_COLOR[solicitud.estado]}
              size="small"
              sx={{ fontSize: '0.6875rem', height: 24 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
            {TIPO_LABELS[solicitud.tipoCaso]} &middot; Recibida el {formatDate(solicitud.fechaCreacion)}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          icon={<AlertCircle size={18} />}
          sx={{ borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Client info + Message + History */}
        <div className="xl:col-span-2 space-y-6">
          {/* Client info */}
          <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <User size={16} color="#C9A449" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                    Información del Cliente
                  </Typography>
                </Box>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={User} label="Nombre" value={solicitud.nombre} />
                <InfoRow icon={Phone} label="Teléfono" value={solicitud.telefono} />
                <InfoRow icon={Mail} label="Correo" value={solicitud.email} />
                <InfoRow
                  icon={ESTADO_ICONS[solicitud.estado]}
                  label="Estado"
                  value={ESTADO_LABELS[solicitud.estado]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          {solicitud.mensaje && (
            <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MessageSquare size={16} color="#C9A449" />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                      Mensaje del Cliente
                    </Typography>
                  </Box>
                }
                sx={{ pb: 1 }}
              />
              <CardContent>
                <Typography
                  variant="body2"
                  sx={{ color: '#1A1A1A', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}
                >
                  {solicitud.mensaje}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* History Timeline */}
          <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Clock size={16} color="#C9A449" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                    Historial de Estados
                  </Typography>
                </Box>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              {solicitud.historial.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                  Sin historial registrado.
                </Typography>
              ) : (
                <Box
                  component="ol"
                  sx={{
                    position: 'relative',
                    borderLeft: '1px solid #E6E6E6',
                    ml: 1,
                    pl: 0,
                    listStyle: 'none',
                    m: 0,
                    p: 0,
                  }}
                >
                  {[...solicitud.historial]
                    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                    .map((h, idx, arr) => {
                      const NuevoIcon = ESTADO_ICONS[h.estadoNuevo];
                      return (
                        <Box
                          component="li"
                          key={h.id}
                          sx={{
                            ml: 3,
                            position: 'relative',
                            pb: idx < arr.length - 1 ? 3 : 0,
                          }}
                        >
                          {/* Dot */}
                          <Box
                            sx={{
                              position: 'absolute',
                              left: -22,
                              top: 2,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              bgcolor: '#C9A449',
                              border: '2px solid white',
                              boxShadow: '0 0 0 1px #C9A449',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <NuevoIcon size={10} color="white" />
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A' }}>
                                {h.estadoAnterior
                                  ? `${ESTADO_LABELS[h.estadoAnterior]} → ${ESTADO_LABELS[h.estadoNuevo]}`
                                  : `Creada como ${ESTADO_LABELS[h.estadoNuevo]}`}
                              </Typography>
                              <Chip
                                label={ESTADO_LABELS[h.estadoNuevo]}
                                color={ESTADO_CHIP_COLOR[h.estadoNuevo]}
                                size="small"
                                sx={{ fontSize: '0.625rem', height: 20 }}
                              />
                            </Box>
                            {h.comentario && (
                              <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', mt: 0.5 }}>
                                {h.comentario}
                              </Typography>
                            )}
                            <Typography variant="caption" sx={{ color: '#C0C0C0', display: 'block', mt: 0.25 }}>
                              {h.usuarioNombre ?? 'Sistema'} &middot; {formatDateTime(h.fecha)}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Management sidebar */}
        <div className="space-y-6">
          <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
            <CardHeader
              title={
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                  Gestión
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={estado}
                    label="Estado"
                    onChange={(e) => setEstado(e.target.value as EstadoSolicitud)}
                  >
                    {Object.values(EstadoSolicitud).map((e) => (
                      <MenuItem key={e} value={e}>
                        {ESTADO_LABELS[e]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <InputLabel>Asignar a</InputLabel>
                  <Select
                    value={asignadoAId}
                    label="Asignar a"
                    onChange={(e) => setAsignadoAId(e.target.value)}
                  >
                    <MenuItem value="">Sin asignar</MenuItem>
                    {users.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Notas Internas"
                  value={notasInternas}
                  onChange={(e) => setNotasInternas(e.target.value)}
                  placeholder="Notas visibles solo para el equipo..."
                  multiline
                  rows={4}
                  size="small"
                  fullWidth
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                  fullWidth
                  startIcon={
                    saving ? (
                      <CircularProgress size={16} sx={{ color: 'inherit' }} />
                    ) : (
                      <Save size={16} />
                    )
                  }
                  sx={{ fontWeight: 600, textTransform: 'none' }}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Meta info */}
          <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
            <CardHeader
              title={
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                  Detalles
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Box component="dl" sx={{ m: 0 }}>
                <MetaRow label="ID" value={solicitud.id} mono />
                <MetaRow label="Área de práctica" value={TIPO_LABELS[solicitud.tipoCaso]} />
                <MetaRow label="Fecha de creación" value={formatDateTime(solicitud.fechaCreacion)} />
                <MetaRow label="Última actualización" value={formatDateTime(solicitud.fechaActualizacion)} />
                {solicitud.origen && (
                  <MetaRow label="Origen" value={solicitud.origen} />
                )}
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Snackbar for save success */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity="success"
          icon={<CheckCircle size={18} />}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          Cambios guardados exitosamente.
        </Alert>
      </Snackbar>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 1.5,
          bgcolor: 'rgba(201,164,73,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mt: 0.25,
        }}
      >
        <Icon size={16} color="#C9A449" />
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#1A1A1A', fontWeight: 500, mt: 0.25 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function MetaRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <Box component="div" sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
      <Typography component="dt" variant="caption" sx={{ color: '#6B6B6B', display: 'block' }}>
        {label}
      </Typography>
      <Typography
        component="dd"
        variant="body2"
        sx={{
          color: '#1A1A1A',
          mt: 0.25,
          ml: 0,
          ...(mono ? { fontFamily: 'monospace', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
