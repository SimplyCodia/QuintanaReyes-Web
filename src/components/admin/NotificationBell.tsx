'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button,
} from '@mui/material';
import {
  getNotificaciones,
  getNotificacionesUnreadCount,
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas,
} from '@/lib/admin/api';
import type { Notificacion } from '@/lib/admin/types';

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Justo ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `Hace ${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es-PA', { day: '2-digit', month: 'short', year: 'numeric' });
}

const COUNT_POLL_INTERVAL = 10_000;

export function NotificationBell() {
  const router = useRouter();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [totalNoLeidas, setTotalNoLeidas] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const prevCountRef = useRef(0);

  const fetchNotificaciones = useCallback(async () => {
    try {
      const result = await getNotificaciones({ limit: 20 });
      setNotificaciones(result.data);
      setTotalNoLeidas(result.totalNoLeidas);
      prevCountRef.current = result.totalNoLeidas;
    } catch {
      // silent — bell is non-critical
    }
  }, []);

  // Two-tier polling: lightweight count every 10s, full fetch only when count changes
  useEffect(() => {
    // Initial full fetch
    fetchNotificaciones();

    const pollCount = async () => {
      try {
        const { totalNoLeidas: count } = await getNotificacionesUnreadCount();
        setTotalNoLeidas(count);
        if (count !== prevCountRef.current) {
          prevCountRef.current = count;
          fetchNotificaciones();
        }
      } catch {
        // silent
      }
    };

    const id = setInterval(pollCount, COUNT_POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchNotificaciones]);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickNotificacion = async (n: Notificacion) => {
    handleClose();
    if (!n.leida) {
      try {
        await marcarNotificacionLeida(n.id);
        setNotificaciones((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, leida: true } : item)),
        );
        setTotalNoLeidas((prev) => Math.max(0, prev - 1));
      } catch {
        // ignore
      }
    }
    if (n.entidadId !== null && n.entidad === 'solicitudes') {
      router.push(`/admin/solicitudes/detalle?id=${n.entidadId}`);
    }
  };

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasNotificacionesLeidas();
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      setTotalNoLeidas(0);
    } catch {
      // ignore
    }
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        aria-describedby={popoverId}
        onClick={handleOpen}
        size="small"
        sx={{
          color: '#9A9A9A',
          '&:hover': { color: '#E6E6E6', bgcolor: '#1C1C1C' },
        }}
      >
        <Badge
          badgeContent={totalNoLeidas > 0 ? totalNoLeidas : undefined}
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#C9A449',
              color: '#0E0E0E',
              fontSize: '0.6rem',
              fontWeight: 700,
              minWidth: 16,
              height: 16,
              padding: '0 4px',
            },
          }}
        >
          <Bell size={18} />
        </Badge>
      </IconButton>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 340,
              maxHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 2,
              border: '1px solid #E6E6E6',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Popover header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: '1px solid #E6E6E6',
            flexShrink: 0,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
            Notificaciones
            {totalNoLeidas > 0 && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: '#C9A449',
                  color: '#0E0E0E',
                  borderRadius: 10,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  minWidth: 18,
                  height: 18,
                  px: 0.5,
                }}
              >
                {totalNoLeidas}
              </Box>
            )}
          </Typography>
          {totalNoLeidas > 0 && (
            <Button
              size="small"
              variant="text"
              onClick={handleMarcarTodas}
              sx={{
                fontSize: '0.6875rem',
                color: '#C9A449',
                textTransform: 'none',
                fontWeight: 500,
                p: 0,
                minWidth: 0,
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Marcar todas como leídas
            </Button>
          )}
        </Box>

        {/* Scrollable notification list */}
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          {notificaciones.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
              <Typography variant="body2" sx={{ color: '#9A9A9A' }}>
                No hay notificaciones
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notificaciones.map((n, idx) => (
                <Box key={n.id}>
                  <ListItem
                    alignItems="flex-start"
                    onClick={() => handleClickNotificacion(n)}
                    sx={{
                      px: 2,
                      py: 1.25,
                      cursor: 'pointer',
                      bgcolor: n.leida ? 'transparent' : 'rgba(201,164,73,0.05)',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                      gap: 1.5,
                    }}
                  >
                    {/* Unread indicator dot */}
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: n.leida ? 'transparent' : '#C9A449',
                        flexShrink: 0,
                        mt: 0.75,
                      }}
                    />
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: n.leida ? 400 : 700,
                            color: '#1A1A1A',
                            fontSize: '0.8125rem',
                            lineHeight: 1.4,
                          }}
                        >
                          {n.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.25 }}>
                          {n.mensaje && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#6B6B6B',
                                fontSize: '0.75rem',
                                display: 'block',
                                lineHeight: 1.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {n.mensaje}
                            </Typography>
                          )}
                          <Typography
                            variant="caption"
                            sx={{ color: '#C0C0C0', fontSize: '0.6875rem', display: 'block', mt: 0.25 }}
                          >
                            {timeAgo(n.fechaCreacion)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {idx < notificaciones.length - 1 && (
                    <Divider sx={{ borderColor: '#F0F0F0' }} />
                  )}
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
}
