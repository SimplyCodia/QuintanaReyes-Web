'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, ChevronRight, Filter } from 'lucide-react';
import {
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Chip,
  Button,
  Paper,
  Typography,
  Skeleton,
  Alert,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterAltOff as FilterAltOffIcon,
} from '@mui/icons-material';
import { getSolicitudes } from '@/lib/admin/api';
import { Solicitud, EstadoSolicitud, TipoCaso } from '@/lib/admin/types';
import { formatDate } from '@/lib/admin/utils';

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

export function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [filtered, setFiltered] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getSolicitudes();
      const sorted = [...result.data].sort(
        (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
      );
      setSolicitudes(sorted);
    } catch {
      setError('No se pudieron cargar las solicitudes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let result = solicitudes;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.nombre.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.telefono.includes(q)
      );
    }
    if (estadoFilter) {
      result = result.filter((s) => s.estado === estadoFilter);
    }
    if (tipoFilter) {
      result = result.filter((s) => s.tipoCaso === tipoFilter);
    }
    setFiltered(result);
    setPage(0);
  }, [solicitudes, search, estadoFilter, tipoFilter]);

  const clearFilters = () => {
    setSearch('');
    setEstadoFilter('');
    setTipoFilter('');
  };

  const hasFilters = search || estadoFilter || tipoFilter;

  const paginatedRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
            Solicitudes
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
            {filtered.length} solicitud{filtered.length !== 1 ? 'es' : ''} encontrada
            {filtered.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={load}
          disabled={loading}
          startIcon={
            <RefreshCw
              size={16}
              style={{
                animation: loading ? 'spin 1s linear infinite' : 'none',
              }}
            />
          }
          sx={{ textTransform: 'none', flexShrink: 0 }}
        >
          Actualizar
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{ p: 2, border: '1px solid #E6E6E6', borderRadius: 2 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { sm: 'center' },
          }}
        >
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o teléfono..."
            size="small"
            sx={{ flex: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#6B6B6B" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
            <Filter size={16} color="#6B6B6B" />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={estadoFilter}
                label="Estado"
                onChange={(e) => setEstadoFilter(e.target.value)}
              >
                <MenuItem value="">Todos los estados</MenuItem>
                {Object.values(EstadoSolicitud).map((e) => (
                  <MenuItem key={e} value={e}>
                    {ESTADO_LABELS[e]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Área</InputLabel>
              <Select
                value={tipoFilter}
                label="Área"
                onChange={(e) => setTipoFilter(e.target.value)}
              >
                <MenuItem value="">Todas las áreas</MenuItem>
                {Object.values(TipoCaso).map((t) => (
                  <MenuItem key={t} value={t}>
                    {TIPO_LABELS[t]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {hasFilters && (
              <Tooltip title="Limpiar filtros">
                <IconButton size="small" onClick={clearFilters} color="default">
                  <FilterAltOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Table */}
      <Paper elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="text" height={52} sx={{ mb: 0.5 }} />
            ))}
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        ) : filtered.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
              {hasFilters
                ? 'No se encontraron solicitudes con los filtros aplicados.'
                : 'No hay solicitudes registradas.'}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FAFAF7' }}>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', width: 90 }}>
                      Ref.
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Cliente
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Área
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Asignado a
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Fecha
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((s) => (
                    <TableRow
                      key={s.id}
                      sx={{
                        '&:hover': { bgcolor: '#FAFAF7' },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#C9A449', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          QR-{String(s.id).padStart(5, '0')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A' }}>
                          {s.nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                          {s.email}
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
                        {s.asignadoNombre ? (
                          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                            {s.asignadoNombre}
                          </Typography>
                        ) : (
                          <Typography variant="caption" sx={{ color: '#C0C0C0', fontStyle: 'italic' }}>
                            Sin asignar
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                          {formatDate(s.fechaCreacion)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          className="ver-detalle-btn"
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
            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50]}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} de ${count}`
              }
              sx={{ borderTop: '1px solid #F0F0F0' }}
            />
          </>
        )}
      </Paper>
    </div>
  );
}
