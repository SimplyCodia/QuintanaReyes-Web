'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, RefreshCw, Filter, Plus, Pencil, Trash2 } from 'lucide-react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { FilterAltOff as FilterAltOffIcon } from '@mui/icons-material';
import {
  getBlogPostsAdmin,
  deleteBlogPost,
} from '@/lib/admin/api';
import {
  BlogPostSummary,
  EstadoBlog,
} from '@/lib/admin/types';
import { formatDate } from '@/lib/admin/utils';
import { useAuth } from '@/lib/admin/auth';

const ESTADO_LABELS: Record<EstadoBlog, string> = {
  BORRADOR: 'Borrador',
  PROGRAMADO: 'Programado',
  PUBLICADO: 'Activo',
  ARCHIVADO: 'Archivado',
};

const ESTADO_STYLES: Record<EstadoBlog, { bg: string; color: string }> = {
  BORRADOR: { bg: '#F0F0F0', color: '#6B6B6B' },
  PROGRAMADO: { bg: '#E8F1FB', color: '#4A90E2' },
  PUBLICADO: { bg: '#E6F7EC', color: '#2F8F58' },
  ARCHIVADO: { bg: '#FCEFE2', color: '#B0651E' },
};

const ESTADOS: EstadoBlog[] = ['BORRADOR', 'PROGRAMADO', 'PUBLICADO', 'ARCHIVADO'];

export function BlogAdminPage() {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [filtered, setFiltered] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [confirmDelete, setConfirmDelete] = useState<BlogPostSummary | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getBlogPostsAdmin({ limit: 100 });
      setPosts(result.data);
    } catch {
      setError('No se pudieron cargar los articulos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let result = posts;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.titulo_es.toLowerCase().includes(q) ||
          (p.titulo_en ?? '').toLowerCase().includes(q) ||
          (p.extracto_es ?? '').toLowerCase().includes(q) ||
          p.slug_es.toLowerCase().includes(q) ||
          (p.slug_en ?? '').toLowerCase().includes(q),
      );
    }
    if (estadoFilter) result = result.filter((p) => p.estado === estadoFilter);
    if (categoriaFilter)
      result = result.filter((p) => p.categoria_es === categoriaFilter || p.categoria_en === categoriaFilter);
    setFiltered(result);
    setPage(0);
  }, [posts, search, estadoFilter, categoriaFilter]);

  const clearFilters = () => {
    setSearch('');
    setEstadoFilter('');
    setCategoriaFilter('');
  };

  const hasFilters = search || estadoFilter || categoriaFilter;

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      setDeleting(true);
      await deleteBlogPost(confirmDelete.id);
      setConfirmDelete(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el articulo.');
    } finally {
      setDeleting(false);
    }
  };

  const categorias = Array.from(
    new Set(
      posts.flatMap((p) => [p.categoria_es, p.categoria_en]).filter((c): c is string => !!c),
    ),
  ).sort();

  const paginatedRows = filtered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
            Blog
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
            {filtered.length} articulo{filtered.length !== 1 ? 's' : ''}
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
            component={Link}
            href="/admin/blog/nuevo"
            variant="contained"
            color="primary"
            startIcon={<Plus size={16} />}
            sx={{ textTransform: 'none', bgcolor: '#C9A449', color: '#0E0E0E', '&:hover': { bgcolor: '#8C6F2A', color: '#FFFFFF' } }}
          >
            Nuevo Blog
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid #E6E6E6', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: { sm: 'center' } }}>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por titulo, extracto o slug..."
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
                {ESTADOS.map((e) => (
                  <MenuItem key={e} value={e}>
                    {ESTADO_LABELS[e]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={categoriaFilter}
                label="Categoria"
                onChange={(e) => setCategoriaFilter(e.target.value)}
              >
                <MenuItem value="">Todas las categorias</MenuItem>
                {categorias.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
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
                ? 'No se encontraron articulos con los filtros aplicados.'
                : 'No hay articulos registrados todavia.'}
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FAFAF7' }}>
                    <TableCell sx={headStyle}>Titulo</TableCell>
                    <TableCell sx={headStyle}>Categoria</TableCell>
                    <TableCell sx={headStyle}>Estado</TableCell>
                    <TableCell sx={headStyle}>Fecha publicacion</TableCell>
                    <TableCell sx={headStyle}>Autor</TableCell>
                    <TableCell sx={headStyle} align="right">
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRows.map((p) => {
                    const estadoStyle = ESTADO_STYLES[p.estado];
                    return (
                      <TableRow
                        key={p.id}
                        sx={{ '&:hover': { bgcolor: '#FAFAF7' }, transition: 'background-color 0.15s' }}
                      >
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#1A1A1A' }}>
                            {p.titulo_es}
                          </Typography>
                          {p.titulo_en && (
                            <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block' }}>
                              EN: {p.titulo_en}
                            </Typography>
                          )}
                          <Typography variant="caption" sx={{ color: '#6B6B6B', fontFamily: 'monospace' }}>
                            /{p.slug_es}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#1A1A1A' }}>
                            {p.categoria_es || <span style={{ color: '#C0C0C0', fontStyle: 'italic' }}>—</span>}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ESTADO_LABELS[p.estado]}
                            size="small"
                            sx={{
                              bgcolor: estadoStyle.bg,
                              color: estadoStyle.color,
                              fontWeight: 600,
                              fontSize: '0.6875rem',
                              height: 24,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                            {p.fechaPublicacion ? formatDate(p.fechaPublicacion) : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                            {p.autor}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Editar">
                            <IconButton
                              component={Link}
                              href={`/admin/blog/editar?id=${p.id}`}
                              size="small"
                              sx={{ color: '#C9A449' }}
                            >
                              <Pencil size={16} />
                            </IconButton>
                          </Tooltip>
                          {isAdmin && (
                            <Tooltip title="Eliminar">
                              <IconButton
                                size="small"
                                sx={{ color: '#E84855' }}
                                onClick={() => setConfirmDelete(p)}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
              labelRowsPerPage="Filas por pagina:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
              sx={{ borderTop: '1px solid #F0F0F0' }}
            />
          </>
        )}
      </Paper>

      {/* Delete confirmation */}
      <Dialog open={!!confirmDelete} onClose={() => !deleting && setConfirmDelete(null)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Eliminar articulo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta accion eliminara permanentemente el articulo
            {confirmDelete ? ` "${confirmDelete.titulo_es}"` : ''}. No se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)} disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            color="error"
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const headStyle = {
  color: '#6B6B6B',
  fontSize: '0.6875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
} as const;
