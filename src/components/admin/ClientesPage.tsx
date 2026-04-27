'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, ChevronRight, UserPlus } from 'lucide-react';
import {
  TextField,
  InputAdornment,
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
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  PersonOutlined,
  PeopleAltOutlined,
} from '@mui/icons-material';
import { getClientes } from '@/lib/admin/api';
import { Cliente } from '@/lib/admin/types';
import { formatDate } from '@/lib/admin/utils';
import { NuevoClienteModal } from './NuevoClienteModal';

export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtered, setFiltered] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getClientes();
      const sorted = [...result.data].sort(
        (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime(),
      );
      setClientes(sorted);
    } catch {
      setError('No se pudieron cargar los clientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let result = clientes;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.telefono.includes(q),
      );
    }
    setFiltered(result);
    setPage(0);
  }, [clientes, search]);

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const nuevasSemana = clientes.filter(
    (c) => new Date(c.fechaCreacion).getTime() >= oneWeekAgo,
  ).length;

  const paginatedRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
            Clientes
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
            {filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado
            {filtered.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
          <Button
            variant="outlined"
            onClick={load}
            disabled={loading}
            startIcon={
              <RefreshCw
                size={16}
                style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
              />
            }
            sx={{ textTransform: 'none' }}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UserPlus size={16} />}
            onClick={() => setModalOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Nuevo Cliente
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <div className="flex items-center gap-4">
              <Avatar sx={{ bgcolor: 'rgba(201,164,73,0.1)', width: 44, height: 44 }}>
                <PeopleAltOutlined sx={{ color: '#C9A449' }} />
              </Avatar>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                  {loading ? <Skeleton width={32} /> : clientes.length}
                </Typography>
                <Typography variant="caption" color="#6B6B6B">
                  Total clientes
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <div className="flex items-center gap-4">
              <Avatar sx={{ bgcolor: 'rgba(16,185,129,0.1)', width: 44, height: 44 }}>
                <PersonOutlined sx={{ color: '#10b981' }} />
              </Avatar>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A1A' }}>
                  {loading ? <Skeleton width={32} /> : nuevasSemana}
                </Typography>
                <Typography variant="caption" color="#6B6B6B">
                  Nuevos esta semana
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #E6E6E6', borderRadius: 2 }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, correo o teléfono..."
          size="small"
          fullWidth
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
              {search
                ? 'No se encontraron clientes con los filtros aplicados.'
                : 'No hay clientes registrados.'}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FAFAF7' }}>
                    <TableCell
                      sx={{
                        color: '#6B6B6B',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Nombre
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
                      Teléfono
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
                      Solicitudes
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
                      Fecha Creación
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((c) => (
                    <TableRow
                      key={c.id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#FAFAF7' },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A' }}>
                          {c.nombre}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                          {c.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#1A1A1A' }}>
                          {c.telefono}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={c.totalSolicitudes ?? 0}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(201,164,73,0.1)',
                            color: '#C9A449',
                            fontWeight: 600,
                            fontSize: '0.6875rem',
                            height: 24,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}
                        >
                          {formatDate(c.fechaCreacion)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          component={Link}
                          href={`/admin/clientes/detalle?id=${c.id}`}
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
                          Ver
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
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
              sx={{ borderTop: '1px solid #F0F0F0' }}
            />
          </>
        )}
      </Paper>

      <NuevoClienteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={load}
      />
    </div>
  );
}
