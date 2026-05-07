'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Typography,
  Avatar,
  Skeleton,
  IconButton,
  Tooltip,
  Alert,
  Paper,
  Box,
} from '@mui/material';
import {
  PersonOutlined,
  PersonAddOutlined,
  PersonOffOutlined,
  AdminPanelSettingsOutlined,
  RefreshOutlined,
  CheckCircleOutlined,
  DoNotDisturbOutlined,
} from '@mui/icons-material';
import { getUsers, updateUser } from '@/lib/admin/api';
import { User, Rol } from '@/lib/admin/types';
import { formatDate, formatDateTime } from '@/lib/admin/utils';

const ROL_LABELS: Record<Rol, string> = {
  [Rol.ADMIN]: 'Administrador',
  [Rol.ABOGADO]: 'Abogado',
  [Rol.ASISTENTE]: 'Asistente',
  [Rol.LIMITED]: 'Limitado',
};

export function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError('No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActivo = async (user: User) => {
    try {
      setTogglingId(user.id);
      setError('');
      const updated = await updateUser(user.id, { activo: !user.activo });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setSuccessMsg(
        `Usuario ${updated.activo ? 'activado' : 'desactivado'} exitosamente.`
      );
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch {
      setError('No se pudo actualizar el usuario.');
    } finally {
      setTogglingId(null);
    }
  };

  const total = users.length;
  const activos = users.filter((u) => u.activo).length;
  const admins = users.filter((u) => u.rol === Rol.ADMIN).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
            Usuarios
          </Typography>
          <Typography variant="body2" color="#6B6B6B" sx={{ mt: 0.5 }}>
            Gestión de usuarios del sistema
          </Typography>
        </div>
        <Button
          variant="outlined"
          startIcon={<RefreshOutlined />}
          onClick={load}
          disabled={loading}
          sx={{
            borderColor: '#E6E6E6',
            color: '#6B6B6B',
            '&:hover': { borderColor: '#C9A449', color: '#C9A449', bgcolor: 'transparent' },
          }}
        >
          Actualizar
        </Button>
      </div>

      {successMsg && (
        <Alert
          severity="success"
          icon={<CheckCircleOutlined fontSize="small" />}
          sx={{ borderRadius: 2 }}
          onClose={() => setSuccessMsg('')}
        >
          {successMsg}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <div className="flex items-center gap-4">
              <Avatar sx={{ bgcolor: 'rgba(201,164,73,0.1)', width: 44, height: 44 }}>
                <PersonOutlined sx={{ color: '#C9A449' }} />
              </Avatar>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
                  {loading ? <Skeleton width={32} /> : total}
                </Typography>
                <Typography variant="caption" color="#6B6B6B">
                  Total usuarios
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <div className="flex items-center gap-4">
              <Avatar sx={{ bgcolor: 'rgba(16,185,129,0.1)', width: 44, height: 44 }}>
                <PersonAddOutlined sx={{ color: '#10b981' }} />
              </Avatar>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
                  {loading ? <Skeleton width={32} /> : activos}
                </Typography>
                <Typography variant="caption" color="#6B6B6B">
                  Activos
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <div className="flex items-center gap-4">
              <Avatar sx={{ bgcolor: 'rgba(139,92,246,0.1)', width: 44, height: 44 }}>
                <AdminPanelSettingsOutlined sx={{ color: '#8b5cf6' }} />
              </Avatar>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A1A1A" }}>
                  {loading ? <Skeleton width={32} /> : admins}
                </Typography>
                <Typography variant="caption" color="#6B6B6B">
                  Administradores
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <CardContent sx={{ p: 3 }}>
            {[...Array(4)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Skeleton variant="circular" width={32} height={32} />
                <div className="flex-1">
                  <Skeleton width="40%" height={18} />
                  <Skeleton width="60%" height={14} />
                </div>
                <Skeleton width={80} height={24} />
                <Skeleton width={70} height={24} />
                <Skeleton width={90} height={14} />
                <Skeleton width={80} height={32} />
              </Box>
            ))}
          </CardContent>
        ) : users.length === 0 ? (
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" color="#6B6B6B">
              No hay usuarios registrados.
            </Typography>
          </CardContent>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#FAFAF7' }}>
                  {['Usuario', 'Rol', 'Estado', 'Último acceso', 'Creado', ''].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#6B6B6B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #E6E6E6',
                        py: 1.5,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow
                    key={u.id}
                    sx={{
                      '&:hover': { bgcolor: '#FAFAF7' },
                      transition: 'background-color 0.15s',
                    }}
                  >
                    <TableCell sx={{ py: 1.5 }}>
                      <div className="flex items-center gap-3">
                        <Avatar
                          sx={{
                            bgcolor: '#C9A449',
                            color: '#0E0E0E',
                            width: 32,
                            height: 32,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {u.nombre.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#1A1A1A" }}>
                            {u.nombre}
                          </Typography>
                          <Typography variant="caption" color="#6B6B6B">
                            {u.email}
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={ROL_LABELS[u.rol]}
                        size="small"
                        sx={
                          u.rol === Rol.ADMIN
                            ? { bgcolor: 'rgba(99,102,241,0.1)', color: '#4f46e5', fontWeight: 500, fontSize: '0.7rem' }
                            : { bgcolor: '#F0F0F0', color: '#6B6B6B', fontWeight: 500, fontSize: '0.7rem' }
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Chip
                        label={u.activo ? 'Activo' : 'Inactivo'}
                        size="small"
                        sx={
                          u.activo
                            ? { bgcolor: 'rgba(16,185,129,0.1)', color: '#059669', fontWeight: 500, fontSize: '0.7rem' }
                            : { bgcolor: 'rgba(239,68,68,0.1)', color: '#dc2626', fontWeight: 500, fontSize: '0.7rem' }
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      {u.ultimoAcceso ? (
                        <Typography variant="caption" color="#6B6B6B">
                          {formatDateTime(u.ultimoAcceso)}
                        </Typography>
                      ) : (
                        <Typography variant="caption" color="#C0C0C0" sx={{ fontStyle: "italic" }}>
                          Nunca
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                      <Typography variant="caption" color="#6B6B6B">
                        {formatDate(u.fechaCreacion)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Tooltip title={u.activo ? 'Desactivar usuario' : 'Activar usuario'}>
                        <span>
                          <IconButton
                            size="small"
                            disabled={togglingId === u.id}
                            onClick={() => toggleActivo(u)}
                            sx={
                              u.activo
                                ? {
                                    color: '#dc2626',
                                    border: '1px solid rgba(220,38,38,0.2)',
                                    borderRadius: 1.5,
                                    '&:hover': { bgcolor: 'rgba(220,38,38,0.05)' },
                                  }
                                : {
                                    color: '#059669',
                                    border: '1px solid rgba(5,150,105,0.2)',
                                    borderRadius: 1.5,
                                    '&:hover': { bgcolor: 'rgba(5,150,105,0.05)' },
                                  }
                            }
                          >
                            {u.activo ? (
                              <PersonOffOutlined sx={{ fontSize: 16 }} />
                            ) : (
                              <CheckCircleOutlined sx={{ fontSize: 16 }} />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </div>
  );
}
