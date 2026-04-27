'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  Save,
  Trash2,
  PlusCircle,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Chip,
  Divider,
  Typography,
  Alert,
  Snackbar,
  Box,
  CircularProgress,
  Skeleton,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { getClienteById, updateCliente, deleteCliente } from '@/lib/admin/api';
import { ClienteDetalle as ClienteDetalleType, EstadoSolicitud, TipoCaso, Solicitud } from '@/lib/admin/types';
import { formatDate, formatDateTime } from '@/lib/admin/utils';
import { useAuth } from '@/lib/admin/auth';
import {
  detectInjection,
  isValidEmail,
  isValidPhone,
  isValidName,
} from '@/lib/sanitize';
import { NuevaSolicitudModal } from './NuevaSolicitudModal';
import { useRouter } from 'next/navigation';

interface Props {
  clienteId: number;
}

const ESTADO_CHIP_COLOR: Record<EstadoSolicitud, 'warning' | 'info' | 'success' | 'default'> = {
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

interface EditErrors {
  nombre?: string;
  telefono?: string;
  email?: string;
}

export function ClienteDetalle({ clienteId }: Props) {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const [cliente, setCliente] = useState<ClienteDetalleType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [solicitudModalOpen, setSolicitudModalOpen] = useState(false);

  // Edit form state
  const [editNombre, setEditNombre] = useState('');
  const [editTelefono, setEditTelefono] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editNotas, setEditNotas] = useState('');
  const [editErrors, setEditErrors] = useState<EditErrors>({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getClienteById(clienteId);
      setCliente(data);
      setEditNombre(data.nombre);
      setEditTelefono(data.telefono);
      setEditEmail(data.email);
      setEditNotas(data.notas ?? '');
    } catch {
      setError('No se pudo cargar el cliente.');
    } finally {
      setLoading(false);
    }
  }, [clienteId]);

  useEffect(() => {
    load();
  }, [load]);

  const validateEdit = (): boolean => {
    const newErrors: EditErrors = {};

    if (!editNombre.trim()) {
      newErrors.nombre = 'El nombre es requerido.';
    } else if (!isValidName(editNombre.trim())) {
      newErrors.nombre = 'El nombre contiene caracteres no válidos.';
    } else if (detectInjection(editNombre)) {
      newErrors.nombre = 'El nombre contiene contenido no permitido.';
    }

    if (!editTelefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido.';
    } else if (!isValidPhone(editTelefono.trim())) {
      newErrors.telefono = 'El teléfono no tiene un formato válido.';
    } else if (detectInjection(editTelefono)) {
      newErrors.telefono = 'El teléfono contiene contenido no permitido.';
    }

    if (!editEmail.trim()) {
      newErrors.email = 'El correo es requerido.';
    } else if (!isValidEmail(editEmail.trim())) {
      newErrors.email = 'El correo no tiene un formato válido.';
    } else if (detectInjection(editEmail)) {
      newErrors.email = 'El correo contiene contenido no permitido.';
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!cliente || !validateEdit()) return;
    try {
      setSaving(true);
      setError('');
      const updated = await updateCliente(clienteId, {
        nombre: editNombre.trim(),
        telefono: editTelefono.trim(),
        email: editEmail.trim(),
        notas: editNotas.trim() || null,
      });
      setCliente((prev) => (prev ? { ...prev, ...updated } : prev));
      setSnackOpen(true);
    } catch {
      setError('No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError('');
      await deleteCliente(clienteId);
      setDeleteDialogOpen(false);
      router.push('/admin/clientes');
    } catch {
      setError('No se pudo eliminar el cliente.');
      setDeleteDialogOpen(false);
    } finally {
      setDeleting(false);
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
            <Skeleton variant="rounded" height={320} />
          </div>
          <div className="space-y-6">
            <Skeleton variant="rounded" height={340} />
          </div>
        </div>
      </div>
    );
  }

  if (error && !cliente) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!cliente) return null;

  const solicitudesOrdenadas = [...(cliente.solicitudes ?? [])].sort(
    (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          component={Link}
          href="/admin/clientes"
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
            {cliente.nombre}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
            {cliente.email} &middot; Cliente desde {formatDate(cliente.fechaCreacion)}
          </Typography>
        </Box>
        {isAdmin && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<Trash2 size={15} />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ textTransform: 'none', flexShrink: 0 }}
          >
            Eliminar cliente
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Client info */}
        <div className="xl:col-span-2 space-y-6">
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
                <InfoRow icon={User} label="Nombre" value={cliente.nombre} />
                <InfoRow icon={Phone} label="Teléfono" value={cliente.telefono} />
                <InfoRow icon={Mail} label="Correo" value={cliente.email} />
                {cliente.notas && (
                  <InfoRow icon={FileText} label="Notas" value={cliente.notas} />
                )}
              </div>
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                  Última actualización: {formatDateTime(cliente.fechaActualizacion)}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Solicitudes */}
          <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileText size={16} color="#C9A449" />
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                      Solicitudes ({solicitudesOrdenadas.length})
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<PlusCircle size={14} />}
                    onClick={() => setSolicitudModalOpen(true)}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    Nueva Solicitud
                  </Button>
                </Box>
              }
              sx={{ pb: 1 }}
            />
            <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
              {solicitudesOrdenadas.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Este cliente no tiene solicitudes registradas.
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#FAFAF7' }}>
                        <TableCell
                          sx={{
                            color: '#6B6B6B',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            width: 90,
                          }}
                        >
                          Ref.
                        </TableCell>
                        <TableCell
                          sx={{
                            color: '#6B6B6B',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Área
                        </TableCell>
                        <TableCell
                          sx={{
                            color: '#6B6B6B',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Estado
                        </TableCell>
                        <TableCell
                          sx={{
                            color: '#6B6B6B',
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Fecha
                        </TableCell>
                        <TableCell />
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {solicitudesOrdenadas.map((s: Solicitud) => (
                        <TableRow
                          key={s.id}
                          sx={{
                            '&:hover': { bgcolor: '#FAFAF7' },
                            transition: 'background-color 0.15s',
                          }}
                        >
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: '#C9A449',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                              }}
                            >
                              QR-{String(s.id).padStart(5, '0')}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#1A1A1A' }}>
                              {TIPO_LABELS[s.tipoCaso] ?? s.tipoCaso}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ESTADO_LABELS[s.estado]}
                              color={ESTADO_CHIP_COLOR[s.estado]}
                              size="small"
                              sx={{ fontSize: '0.6875rem', height: 24 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}
                            >
                              {formatDate(s.fechaCreacion)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              component={Link}
                              href={`/admin/solicitudes/detalle?id=${s.id}`}
                              size="small"
                              endIcon={<ChevronRight size={13} />}
                              sx={{
                                color: '#C9A449',
                                fontSize: '0.75rem',
                                textTransform: 'none',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                '&:hover': { bgcolor: 'rgba(201,164,73,0.08)' },
                              }}
                            >
                              Ver detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Edit form */}
        <div className="space-y-6">
          <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
            <CardHeader
              title={
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                  Editar Cliente
                </Typography>
              }
              sx={{ pb: 1 }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Nombre"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  size="small"
                  fullWidth
                  error={!!editErrors.nombre}
                  helperText={editErrors.nombre}
                />
                <TextField
                  label="Teléfono"
                  value={editTelefono}
                  onChange={(e) => setEditTelefono(e.target.value)}
                  size="small"
                  fullWidth
                  error={!!editErrors.telefono}
                  helperText={editErrors.telefono}
                />
                <TextField
                  label="Correo Electrónico"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  size="small"
                  fullWidth
                  type="email"
                  error={!!editErrors.email}
                  helperText={editErrors.email}
                />
                <TextField
                  label="Notas"
                  value={editNotas}
                  onChange={(e) => setEditNotas(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Notas adicionales sobre el cliente..."
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
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
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
                <MetaRow label="ID" value={String(cliente.id)} mono />
                <MetaRow
                  label="Solicitudes totales"
                  value={String(cliente.totalSolicitudes ?? solicitudesOrdenadas.length)}
                />
                <MetaRow label="Fecha de creación" value={formatDateTime(cliente.fechaCreacion)} />
                <MetaRow
                  label="Última actualización"
                  value={formatDateTime(cliente.fechaActualizacion)}
                />
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1A1A1A' }}>Eliminar cliente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar al cliente <strong>{cliente.nombre}</strong>? Esta
            acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="text"
            disabled={deleting}
            sx={{ textTransform: 'none', color: '#6B6B6B' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : <Trash2 size={15} />
            }
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nueva Solicitud Modal */}
      <NuevaSolicitudModal
        open={solicitudModalOpen}
        onClose={() => setSolicitudModalOpen(false)}
        onCreated={load}
        cliente={cliente}
      />

      {/* Snackbar */}
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
          ...(mono
            ? {
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }
            : {}),
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
