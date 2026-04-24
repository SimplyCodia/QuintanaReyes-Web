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
  Collapse,
  IconButton,
  Typography,
  Skeleton,
  Alert,
  Paper,
  Button,
  Box,
  Tooltip,
} from '@mui/material';
import {
  ShieldOutlined,
  RefreshOutlined,
  KeyboardArrowDownOutlined,
  KeyboardArrowUpOutlined,
} from '@mui/icons-material';
import { getAuditLogs } from '@/lib/admin/api';
import { AuditLog } from '@/lib/admin/types';
import { formatDateTime } from '@/lib/admin/utils';

export function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAuditLogs(200);
      setLogs(data);
    } catch {
      setError('No se pudieron cargar los registros de auditoría.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <ShieldOutlined sx={{ color: '#C9A449', mt: 0.5 }} />
          <div>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
              Auditoría
            </Typography>
            <Typography variant="body2" color="#6B6B6B" sx={{ mt: 0.5 }}>
              Registro de todas las acciones del sistema
            </Typography>
          </div>
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

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3, overflow: 'hidden' }}>
        {loading ? (
          <CardContent sx={{ p: 3 }}>
            {[...Array(5)].map((_, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <Skeleton width={120} height={14} />
                <Skeleton width={100} height={14} />
                <Skeleton width={80} height={24} />
                <Skeleton width={80} height={14} />
                <Skeleton width={90} height={14} />
                <Skeleton width={24} height={24} variant="circular" />
              </Box>
            ))}
          </CardContent>
        ) : logs.length === 0 ? (
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" color="#6B6B6B">
              No hay registros de auditoría.
            </Typography>
          </CardContent>
        ) : (
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#FAFAF7' }}>
                  {['Fecha', 'Usuario', 'Acción', 'Entidad', 'ID Entidad', ''].map((h) => (
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
                {logs.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const hasMetadata =
                    log.metadata && Object.keys(log.metadata).length > 0;

                  return (
                    <>
                      <TableRow
                        key={log.id}
                        onClick={() => hasMetadata && toggleExpand(log.id)}
                        sx={{
                          cursor: hasMetadata ? 'pointer' : 'default',
                          '&:hover': { bgcolor: hasMetadata ? '#FAFAF7' : 'inherit' },
                          transition: 'background-color 0.15s',
                        }}
                      >
                        <TableCell sx={{ py: 1.5, whiteSpace: 'nowrap' }}>
                          <Typography variant="caption" color="#6B6B6B">
                            {formatDateTime(log.fecha)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" color="#1A1A1A">
                            {log.usuarioNombre ?? (
                              <Box component="span" sx={{ color: '#C0C0C0', fontStyle: 'italic', fontSize: '0.7rem' }}>
                                Sistema
                              </Box>
                            )}
                          </Typography>
                          {log.usuarioId && (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#C0C0C0',
                                fontFamily: 'monospace',
                                fontSize: '0.65rem',
                                display: 'block',
                                maxWidth: 120,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {log.usuarioId}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip
                            label={log.accion}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(201,164,73,0.1)',
                              color: '#B8933A',
                              fontWeight: 500,
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          {log.entidad ? (
                            <Typography variant="body2" color="#6B6B6B">
                              {log.entidad}
                            </Typography>
                          ) : (
                            <Typography variant="caption" color="#C0C0C0" sx={{ fontStyle: "italic" }}>
                              —
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#C0C0C0',
                              fontFamily: 'monospace',
                              maxWidth: 120,
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {log.entidadId ?? '—'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          {hasMetadata && (
                            <Tooltip title={isExpanded ? 'Ocultar metadata' : 'Ver metadata'}>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(log.id);
                                }}
                                sx={{ color: '#6B6B6B', '&:hover': { color: '#1A1A1A' } }}
                              >
                                {isExpanded ? (
                                  <KeyboardArrowUpOutlined fontSize="small" />
                                ) : (
                                  <KeyboardArrowDownOutlined fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>

                      {hasMetadata && (
                        <TableRow key={`${log.id}-meta`}>
                          <TableCell colSpan={6} sx={{ py: 0, border: 0, bgcolor: '#FAFAF7' }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ px: 2.5, py: 2 }}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#6B6B6B',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    fontSize: '0.65rem',
                                    display: 'block',
                                    mb: 1,
                                  }}
                                >
                                  Metadata
                                </Typography>
                                <Box
                                  component="pre"
                                  sx={{
                                    bgcolor: '#0E0E0E',
                                    color: '#C9A449',
                                    borderRadius: 2,
                                    p: 2,
                                    overflowX: 'auto',
                                    fontSize: '0.7rem',
                                    lineHeight: 1.6,
                                    fontFamily: 'monospace',
                                    m: 0,
                                  }}
                                >
                                  {JSON.stringify(log.metadata, null, 2)}
                                </Box>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    </div>
  );
}
