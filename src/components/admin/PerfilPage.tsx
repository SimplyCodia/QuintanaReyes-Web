'use client';

import {
  Card,
  CardContent,
  Avatar,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import {
  PersonOutlined,
  MailOutlined,
  ShieldOutlined,
  CalendarTodayOutlined,
  AccessTimeOutlined,
  FingerprintOutlined,
  CheckCircleOutlined,
  CancelOutlined,
} from '@mui/icons-material';
import { useAuth } from '@/lib/admin/auth';
import { Rol } from '@/lib/admin/types';
import { formatDate, formatDateTime } from '@/lib/admin/utils';

export function PerfilPage() {
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.rol === Rol.ADMIN;

  const profileDetails = [
    {
      icon: PersonOutlined,
      label: 'Nombre completo',
      value: user.nombre,
      mono: false,
    },
    {
      icon: MailOutlined,
      label: 'Correo electrónico',
      value: user.email,
      mono: false,
    },
    {
      icon: ShieldOutlined,
      label: 'Rol',
      value: isAdmin ? 'Administrador' : 'Abogado',
      mono: false,
    },
    {
      icon: CalendarTodayOutlined,
      label: 'Miembro desde',
      value: formatDate(user.fechaCreacion),
      mono: false,
    },
    ...(user.ultimoAcceso
      ? [
          {
            icon: AccessTimeOutlined,
            label: 'Último acceso',
            value: formatDateTime(user.ultimoAcceso),
            mono: false,
          },
        ]
      : []),
    {
      icon: FingerprintOutlined,
      label: 'ID de usuario',
      value: user.id,
      mono: true,
    },
  ];

  const permissions = [
    { label: 'Ver solicitudes', allowed: true },
    { label: 'Gestionar solicitudes', allowed: true },
    { label: 'Ver dashboard', allowed: true },
    { label: 'Gestionar usuarios', allowed: isAdmin },
    { label: 'Ver auditoría', allowed: isAdmin },
    { label: 'Configuración del sistema', allowed: isAdmin },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
          Mi Perfil
        </Typography>
        <Typography variant="body2" color="#6B6B6B" sx={{ mt: 0.5 }}>
          Información de tu cuenta
        </Typography>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Avatar card */}
        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3 }}>
          <CardContent
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              '&:last-child': { pb: 4 },
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#C9A449',
                color: '#0E0E0E',
                width: 80,
                height: 80,
                fontSize: '2rem',
                fontWeight: 700,
                mb: 2,
              }}
            >
              {user.nombre.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
              {user.nombre}
            </Typography>
            <Typography variant="body2" color="#6B6B6B" sx={{ mt: 0.5, mb: 2 }}>
              {user.email}
            </Typography>
            <Divider sx={{ width: '100%', mb: 2, borderColor: '#F0F0F0' }} />
            <div className="flex flex-col gap-2 w-full items-center">
              <Chip
                label={isAdmin ? 'Administrador' : 'Abogado'}
                size="small"
                sx={
                  isAdmin
                    ? { bgcolor: 'rgba(99,102,241,0.1)', color: '#4f46e5', fontWeight: 500 }
                    : { bgcolor: '#F0F0F0', color: '#6B6B6B', fontWeight: 500 }
                }
              />
              <Chip
                label={user.activo ? 'Cuenta activa' : 'Cuenta inactiva'}
                size="small"
                icon={
                  user.activo ? (
                    <CheckCircleOutlined sx={{ fontSize: '14px !important' }} />
                  ) : (
                    <CancelOutlined sx={{ fontSize: '14px !important' }} />
                  )
                }
                sx={
                  user.activo
                    ? {
                        bgcolor: 'rgba(16,185,129,0.1)',
                        color: '#059669',
                        fontWeight: 500,
                        '& .MuiChip-icon': { color: '#059669' },
                      }
                    : {
                        bgcolor: 'rgba(239,68,68,0.1)',
                        color: '#dc2626',
                        fontWeight: 500,
                        '& .MuiChip-icon': { color: '#dc2626' },
                      }
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Details card */}
        <Card
          elevation={0}
          sx={{ border: '1px solid #E6E6E6', borderRadius: 3, gridColumn: 'span 2' }}
          className="xl:col-span-2"
        >
          <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A", mb: 2 }}>
              Detalles de la cuenta
            </Typography>
            <List disablePadding dense>
              {profileDetails.map((detail, index) => (
                <Box key={detail.label}>
                  <ListItem disableGutters sx={{ py: 1.5, alignItems: 'flex-start' }}>
                    <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(201,164,73,0.1)',
                          width: 32,
                          height: 32,
                        }}
                      >
                        <detail.icon sx={{ color: '#C9A449', fontSize: 16 }} />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="caption" color="#6B6B6B" sx={{ display: 'block' }}>
                          {detail.label}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="#1A1A1A"
                          sx={{
                            fontWeight: 500,
                            ...(detail.mono
                              ? {
                                  fontFamily: 'monospace',
                                  fontSize: '0.75rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '100%',
                                  display: 'block',
                                }
                              : {}),
                          }}
                        >
                          {detail.value}
                        </Typography>
                      }
                      disableTypography
                    />
                  </ListItem>
                  {index < profileDetails.length - 1 && (
                    <Divider sx={{ borderColor: '#F0F0F0' }} />
                  )}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      </div>

      {/* Permissions card */}
      <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A", mb: 2 }}>
            Permisos y acceso
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {permissions.map((perm) => (
              <Box
                key={perm.label}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  px: 1.5,
                  py: 1.25,
                  borderRadius: 2,
                  bgcolor: '#FAFAF7',
                  border: '1px solid #F0F0F0',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: perm.allowed ? '#10b981' : '#E6E6E6',
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: perm.allowed ? '#1A1A1A' : '#C0C0C0' }}
                >
                  {perm.label}
                </Typography>
              </Box>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
