'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Skeleton,
  Avatar,
  Tooltip,
  Divider,
} from '@mui/material';
import { Reply, X } from 'lucide-react';
import { getComentarios, createComentario } from '@/lib/admin/api';
import type { Comentario } from '@/lib/admin/types';
import { useAuth } from '@/lib/admin/auth';

interface Props {
  solicitudId: string;
}

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

function fullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-PA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function NotasTab({ solicitudId }: Props) {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [contenido, setContenido] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number; nombre: string } | null>(null);

  const fetchComentarios = useCallback(async () => {
    try {
      const result = await getComentarios(solicitudId);
      setComentarios(result.data);
    } catch {
      // silently fail — comments are non-critical
    } finally {
      setLoading(false);
    }
  }, [solicitudId]);

  useEffect(() => {
    fetchComentarios();
  }, [fetchComentarios]);

  const handlePost = async () => {
    const trimmed = contenido.trim();
    if (!trimmed) return;
    try {
      setPosting(true);
      await createComentario(solicitudId, {
        contenido: trimmed,
        parentId: replyTo?.id ?? null,
      });
      setContenido('');
      setReplyTo(null);
      await fetchComentarios();
    } catch {
      // leave text so user can retry
    } finally {
      setPosting(false);
    }
  };

  // Separate top-level from replies
  const topLevel = comentarios.filter((c) => c.parentId === null);
  const repliesMap = comentarios.reduce<Record<number, Comentario[]>>((acc, c) => {
    if (c.parentId !== null) {
      if (!acc[c.parentId]) acc[c.parentId] = [];
      acc[c.parentId].push(c);
    }
    return acc;
  }, {});

  return (
    <Box sx={{ p: 2.5 }}>
      {/* Comment list */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
              <Skeleton variant="circular" width={32} height={32} sx={{ flexShrink: 0 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="40%" height={16} />
                <Skeleton variant="text" width="80%" height={14} sx={{ mt: 0.5 }} />
                <Skeleton variant="text" width="60%" height={14} />
              </Box>
            </Box>
          ))}
        </Box>
      ) : topLevel.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#6B6B6B', textAlign: 'center', py: 3 }}>
          Aún no hay notas. Sé el primero en agregar una.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {topLevel
            .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime())
            .map((comentario) => (
              <Box key={comentario.id}>
                <CommentItem
                  comentario={comentario}
                  onReply={() => setReplyTo({ id: comentario.id, nombre: comentario.usuarioNombre })}
                />
                {/* Replies indented */}
                {repliesMap[comentario.id] && (
                  <Box
                    sx={{
                      ml: 5,
                      mt: 1.5,
                      borderLeft: '2px solid #E6E6E6',
                      pl: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    {repliesMap[comentario.id]
                      .sort((a, b) => new Date(a.fechaCreacion).getTime() - new Date(b.fechaCreacion).getTime())
                      .map((reply) => (
                        <CommentItem
                          key={reply.id}
                          comentario={reply}
                          onReply={() =>
                            setReplyTo({ id: comentario.id, nombre: reply.usuarioNombre })
                          }
                        />
                      ))}
                  </Box>
                )}
              </Box>
            ))}
        </Box>
      )}

      {/* Divider before input */}
      <Divider sx={{ my: 2.5, borderColor: '#E6E6E6' }} />

      {/* Reply context banner */}
      {replyTo && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'rgba(201,164,73,0.08)',
            border: '1px solid rgba(201,164,73,0.25)',
            borderRadius: 1.5,
            px: 1.5,
            py: 0.75,
            mb: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Reply size={14} color="#C9A449" />
            <Typography variant="caption" sx={{ color: '#C9A449', fontWeight: 500 }}>
              Respondiendo a {replyTo.nombre}
            </Typography>
          </Box>
          <Box
            component="button"
            onClick={() => setReplyTo(null)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              p: 0,
              cursor: 'pointer',
              color: '#6B6B6B',
              '&:hover': { color: '#1A1A1A' },
            }}
          >
            <X size={14} />
          </Box>
        </Box>
      )}

      {/* New comment input */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#C9A449',
            color: '#fff',
            fontSize: '0.8125rem',
            fontWeight: 700,
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
        </Avatar>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder="Agregar una nota..."
            multiline
            rows={2}
            size="small"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handlePost();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.8125rem',
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#C9A449',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              disabled={posting || !contenido.trim()}
              onClick={handlePost}
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.8125rem',
                bgcolor: '#C9A449',
                color: '#0E0E0E',
                '&:hover': { bgcolor: '#B8933A' },
                '&.Mui-disabled': { bgcolor: 'rgba(201,164,73,0.3)', color: '#fff' },
              }}
            >
              {posting ? 'Publicando...' : 'Comentar'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function CommentItem({
  comentario,
  onReply,
}: {
  comentario: Comentario;
  onReply: () => void;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
      <Avatar
        sx={{
          width: 32,
          height: 32,
          bgcolor: '#C9A449',
          color: '#fff',
          fontSize: '0.8125rem',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {comentario.usuarioNombre.charAt(0).toUpperCase()}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            component="span"
            sx={{ fontWeight: 700, color: '#1A1A1A', fontSize: '0.8125rem' }}
          >
            {comentario.usuarioNombre}
          </Typography>
          <Tooltip title={fullDate(comentario.fechaCreacion)} placement="top" arrow>
            <Typography
              component="span"
              sx={{ color: '#6B6B6B', fontSize: '0.6875rem', cursor: 'default' }}
            >
              {timeAgo(comentario.fechaCreacion)}
            </Typography>
          </Tooltip>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: '#1A1A1A',
            fontSize: '0.8125rem',
            lineHeight: 1.6,
            mt: 0.25,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {comentario.contenido}
        </Typography>
        <Box
          component="button"
          onClick={onReply}
          sx={{
            background: 'none',
            border: 'none',
            p: 0,
            mt: 0.5,
            cursor: 'pointer',
            color: '#C9A449',
            fontSize: '0.6875rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <Reply size={12} />
          Responder
        </Box>
      </Box>
    </Box>
  );
}
