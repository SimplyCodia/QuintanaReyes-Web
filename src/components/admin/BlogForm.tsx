'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  Chip,
  Stack,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import 'dayjs/locale/en';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { BlogPost, BlogPostInput, EstadoBlog } from '@/lib/admin/types';
import { createBlogPost, updateBlogPost } from '@/lib/admin/api';
import { fileToBase64, getBase64ImageSrc } from '@/lib/image-utils';
import { useAuth } from '@/lib/admin/auth';
import { generateSlug } from '@/lib/admin/slug';

const QuillEditor = dynamic(
  () => import('@/components/admin/QuillEditor').then((m) => m.QuillEditor),
  { ssr: false },
);

interface BlogFormProps {
  post?: BlogPost;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

const ESTADO_LABELS: Record<EstadoBlog, string> = {
  BORRADOR: 'Borrador',
  PROGRAMADO: 'Programado',
  PUBLICADO: 'Activo',
  ARCHIVADO: 'Archivado',
};

type LangTab = 0 | 1;

function isContenidoEmpty(html: string): boolean {
  const trimmed = html.trim();
  return trimmed.length === 0 || trimmed === '<p><br></p>';
}

function isLangComplete(titulo: string, contenido: string): boolean {
  return titulo.trim().length > 0 && !isContenidoEmpty(contenido);
}

export function BlogForm({ post }: BlogFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!post;

  const [activeTab, setActiveTab] = useState<LangTab>(0);

  const [tituloEs, setTituloEs] = useState(post?.titulo_es ?? '');
  const [tituloEn, setTituloEn] = useState(post?.titulo_en ?? '');
  const [extractoEs, setExtractoEs] = useState(post?.extracto_es ?? '');
  const [extractoEn, setExtractoEn] = useState(post?.extracto_en ?? '');
  const [contenidoEs, setContenidoEs] = useState(post?.contenido_es ?? '');
  const [contenidoEn, setContenidoEn] = useState(post?.contenido_en ?? '');
  const [categoriaEs, setCategoriaEs] = useState(post?.categoria_es ?? '');
  const [categoriaEn, setCategoriaEn] = useState(post?.categoria_en ?? '');
  const [tagsInputEs, setTagsInputEs] = useState((post?.tags_es ?? []).join(', '));
  const [tagsInputEn, setTagsInputEn] = useState((post?.tags_en ?? []).join(', '));

  const [autor, setAutor] = useState(post?.autor ?? user?.nombre ?? '');
  const [estado, setEstado] = useState<EstadoBlog>(post?.estado ?? 'BORRADOR');
  const [fechaPublicacion, setFechaPublicacion] = useState<Dayjs | null>(
    post?.fechaPublicacion ? dayjs(post.fechaPublicacion) : null,
  );

  const [imagenBase64, setImagenBase64] = useState<string | null>(post?.imagenDestacada ?? null);
  const [imagenMime, setImagenMime] = useState<string | null>(post?.imagenDestacadaMime ?? null);
  const [imagenSizeKB, setImagenSizeKB] = useState<number | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!post && !autor && user?.nombre) setAutor(user.nombre);
  }, [post, autor, user]);

  const slugPreviewEs = useMemo(() => generateSlug(tituloEs), [tituloEs]);
  const slugPreviewEn = useMemo(() => generateSlug(tituloEn), [tituloEn]);

  const previewSrc = useMemo(
    () => (imagenBase64 ? getBase64ImageSrc(imagenBase64, imagenMime) : null),
    [imagenBase64, imagenMime],
  );

  const esComplete = isLangComplete(tituloEs, contenidoEs);
  const enComplete = isLangComplete(tituloEn, contenidoEn);
  const esTabIncomplete = !esComplete;
  const enTabIncomplete = !enComplete;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_MIME.includes(file.type)) {
      setError('Formato no permitido. Use JPEG, PNG o WebP.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('La imagen excede 5MB.');
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setImagenBase64(base64);
      setImagenMime(file.type);
      setImagenSizeKB(Math.round(file.size / 1024));
      setError('');
    } catch {
      setError('No se pudo leer la imagen.');
    }
  };

  const removeImage = () => {
    setImagenBase64(null);
    setImagenMime(null);
    setImagenSizeKB(null);
  };

  const handleSubmit = async (overrideEstado?: EstadoBlog) => {
    setError('');

    if (!tituloEs.trim()) {
      setActiveTab(0);
      return setError('El titulo en espanol es requerido (tab ES).');
    }
    if (isContenidoEmpty(contenidoEs)) {
      setActiveTab(0);
      return setError('El contenido en espanol es requerido (tab ES).');
    }
    if (!tituloEn.trim()) {
      setActiveTab(1);
      return setError('El titulo en ingles es requerido (tab EN).');
    }
    if (isContenidoEmpty(contenidoEn)) {
      setActiveTab(1);
      return setError('El contenido en ingles es requerido (tab EN).');
    }
    if (!autor.trim()) {
      setActiveTab(0);
      return setError('El autor es requerido.');
    }

    const finalEstado = overrideEstado ?? estado;
    if (finalEstado === 'PROGRAMADO' && !fechaPublicacion) {
      setActiveTab(0);
      return setError('Para programar el blog debe indicar una fecha de publicacion.');
    }

    const parseTags = (s: string) =>
      s
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

    const payload: BlogPostInput = {
      titulo_es: tituloEs.trim(),
      titulo_en: tituloEn.trim(),
      extracto_es: extractoEs.trim() || null,
      extracto_en: extractoEn.trim() || null,
      contenido_es: contenidoEs,
      contenido_en: contenidoEn,
      categoria_es: categoriaEs.trim() || null,
      categoria_en: categoriaEn.trim() || null,
      tags_es: parseTags(tagsInputEs),
      tags_en: parseTags(tagsInputEn),
      autor: autor.trim(),
      estado: finalEstado,
      fechaPublicacion:
        finalEstado === 'PROGRAMADO' && fechaPublicacion
          ? fechaPublicacion.toISOString()
          : null,
    };

    if (!isEdit) {
      if (imagenBase64) {
        payload.imagenDestacada = imagenBase64;
        payload.imagenDestacadaMime = imagenMime ?? undefined;
      }
    } else {
      const original = post?.imagenDestacada ?? null;
      if (imagenBase64 !== original) {
        payload.imagenDestacada = imagenBase64;
        payload.imagenDestacadaMime = imagenMime;
      }
    }

    try {
      setSubmitting(true);
      if (isEdit && post) {
        await updateBlogPost(post.id, payload);
      } else {
        await createBlogPost(payload);
      }
      router.push('/admin/blog');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el blog.');
    } finally {
      setSubmitting(false);
    }
  };

  const dayjsLocale = activeTab === 0 ? 'es' : 'en';

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjsLocale}>
      <div className="space-y-6">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            component={Link}
            href="/admin/blog"
            startIcon={<ArrowLeft size={16} />}
            sx={{ textTransform: 'none', color: '#6B6B6B' }}
          >
            Volver al listado
          </Button>
        </Box>

        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
            {isEdit ? 'Editar blog' : 'Nuevo blog'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
            {isEdit
              ? 'Actualiza el contenido o el estado del blog.'
              : 'Completa los campos para publicar un nuevo blog.'}
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Paper elevation={0} sx={{ p: 3, border: '1px solid #E6E6E6', borderRadius: 2 }}>
          <Stack spacing={3}>
            {/* Language tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={(_, v: LangTab) => setActiveTab(v)}
                sx={{ minHeight: 40 }}
              >
                <Tab
                  label={
                    <Badge
                      color="warning"
                      variant="dot"
                      invisible={!esTabIncomplete}
                      sx={{ '& .MuiBadge-dot': { right: -6, top: 4 } }}
                    >
                      Espanol (ES)
                    </Badge>
                  }
                  sx={{ textTransform: 'none', minHeight: 40 }}
                />
                <Tab
                  label={
                    <Badge
                      color="warning"
                      variant="dot"
                      invisible={!enTabIncomplete}
                      sx={{ '& .MuiBadge-dot': { right: -6, top: 4 } }}
                    >
                      Ingles (EN)
                    </Badge>
                  }
                  sx={{ textTransform: 'none', minHeight: 40 }}
                />
              </Tabs>
            </Box>

            {/* ES panel */}
            {activeTab === 0 && (
              <Stack spacing={2.5}>
                <TextField
                  label="Titulo (ES) *"
                  value={tituloEs}
                  onChange={(e) => setTituloEs(e.target.value)}
                  fullWidth
                  required
                  slotProps={{ htmlInput: { maxLength: 300 } }}
                />
                <TextField
                  label="Slug (ES) — preview"
                  value={slugPreviewEs}
                  fullWidth
                  helperText="Se genera automaticamente desde el titulo."
                  slotProps={{ input: { readOnly: true } }}
                  sx={{ '& .MuiInputBase-input': { color: '#6B6B6B' } }}
                />
                <TextField
                  label="Extracto (ES)"
                  value={extractoEs}
                  onChange={(e) => setExtractoEs(e.target.value)}
                  multiline
                  minRows={2}
                  maxRows={4}
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                  helperText={`${extractoEs.length}/500`}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#1A1A1A' }}>
                    Contenido (ES) *
                  </Typography>
                  <QuillEditor
                    value={contenidoEs}
                    onChange={setContenidoEs}
                    placeholder="Escribe el contenido en espanol..."
                    minHeight={280}
                  />
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Categoria (ES)"
                    value={categoriaEs}
                    onChange={(e) => setCategoriaEs(e.target.value)}
                    fullWidth
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                  />
                  <TextField
                    label="Tags ES (separados por coma)"
                    value={tagsInputEs}
                    onChange={(e) => setTagsInputEs(e.target.value)}
                    fullWidth
                    placeholder="derecho, familia, pension"
                  />
                </Stack>
              </Stack>
            )}

            {/* EN panel */}
            {activeTab === 1 && (
              <Stack spacing={2.5}>
                <TextField
                  label="Title (EN)"
                  value={tituloEn}
                  onChange={(e) => setTituloEn(e.target.value)}
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 300 } }}
                />
                <TextField
                  label="Slug (EN) — preview"
                  value={slugPreviewEn}
                  fullWidth
                  helperText="Se genera automaticamente desde el titulo."
                  slotProps={{ input: { readOnly: true } }}
                  sx={{ '& .MuiInputBase-input': { color: '#6B6B6B' } }}
                />
                <TextField
                  label="Excerpt (EN)"
                  value={extractoEn}
                  onChange={(e) => setExtractoEn(e.target.value)}
                  multiline
                  minRows={2}
                  maxRows={4}
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 500 } }}
                  helperText={`${extractoEn.length}/500`}
                />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#1A1A1A' }}>
                    Content (EN)
                  </Typography>
                  <QuillEditor
                    value={contenidoEn}
                    onChange={setContenidoEn}
                    placeholder="Write content in English..."
                    minHeight={280}
                  />
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Category (EN)"
                    value={categoriaEn}
                    onChange={(e) => setCategoriaEn(e.target.value)}
                    fullWidth
                    slotProps={{ htmlInput: { maxLength: 100 } }}
                  />
                  <TextField
                    label="Tags EN (comma separated)"
                    value={tagsInputEn}
                    onChange={(e) => setTagsInputEn(e.target.value)}
                    fullWidth
                    placeholder="law, family, pension"
                  />
                </Stack>
              </Stack>
            )}

            {/* Shared fields — only editable from the ES tab */}
            <Box>
              {activeTab === 1 && (
                <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', mb: 1 }}>
                  Estos campos se editan desde el tab Espanol (ES).
                </Typography>
              )}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm:
                      estado === 'PROGRAMADO'
                        ? 'repeat(3, minmax(0, 1fr))'
                        : 'repeat(2, minmax(0, 1fr))',
                  },
                  gap: 2,
                }}
              >
                <TextField
                  label="Autor *"
                  value={autor}
                  onChange={(e) => setAutor(e.target.value)}
                  fullWidth
                  required
                  size="small"
                  disabled={activeTab === 1}
                  slotProps={{ htmlInput: { maxLength: 200 } }}
                />
                <FormControl fullWidth size="small" disabled={activeTab === 1}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={estado}
                    label="Estado"
                    onChange={(e) => setEstado(e.target.value as EstadoBlog)}
                  >
                    {(Object.keys(ESTADO_LABELS) as EstadoBlog[]).map((e) => (
                      <MenuItem key={e} value={e}>
                        {ESTADO_LABELS[e]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {estado === 'PROGRAMADO' && (
                  <DateTimePicker
                    label="Fecha de publicacion"
                    value={fechaPublicacion}
                    onChange={(val) => setFechaPublicacion(val)}
                    disabled={activeTab === 1}
                    sx={{ width: '100%' }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        size: 'small',
                      },
                    }}
                  />
                )}
              </Box>
            </Box>

            {/* Image upload — shared across languages, edited from ES tab only */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#1A1A1A' }}>
                Imagen destacada
              </Typography>
              {activeTab === 1 && (
                <Typography variant="caption" sx={{ color: '#6B6B6B', display: 'block', mb: 1 }}>
                  La imagen se gestiona desde el tab Espanol (ES).
                </Typography>
              )}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Upload size={16} />}
                  disabled={activeTab === 1}
                  sx={{ textTransform: 'none' }}
                >
                  Seleccionar imagen
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
                {previewSrc && (
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewSrc}
                      alt="Vista previa"
                      style={{ maxWidth: 320, maxHeight: 200, border: '1px solid #E6E6E6', borderRadius: 8 }}
                    />
                    <Chip
                      label={
                        imagenSizeKB
                          ? `${imagenSizeKB} KB · ${imagenMime ?? ''}`
                          : imagenMime ?? 'imagen actual'
                      }
                      size="small"
                      sx={{ position: 'absolute', bottom: 8, left: 8, bgcolor: 'rgba(0,0,0,0.65)', color: 'white' }}
                    />
                    <Button
                      size="small"
                      onClick={removeImage}
                      startIcon={<X size={14} />}
                      disabled={activeTab === 1}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'rgba(255,255,255,0.92)',
                        textTransform: 'none',
                        color: '#E84855',
                        minWidth: 'auto',
                        '&:hover': { bgcolor: 'white' },
                      }}
                    >
                      Quitar
                    </Button>
                  </Box>
                )}
              </Stack>
              <Typography variant="caption" sx={{ color: '#6B6B6B', mt: 1, display: 'block' }}>
                Maximo 5MB. JPEG, PNG o WebP. Se comprime automaticamente al guardar.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/admin/blog"
            variant="outlined"
            sx={{ textTransform: 'none' }}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleSubmit('BORRADOR')}
            disabled={submitting}
            sx={{ textTransform: 'none' }}
          >
            Guardar como borrador
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSubmit()}
            disabled={submitting}
            sx={{
              textTransform: 'none',
              bgcolor: '#C9A449',
              color: '#0E0E0E',
              '&:hover': { bgcolor: '#8C6F2A', color: '#FFFFFF' },
            }}
          >
            {submitting ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Publicar'}
          </Button>
        </Box>
      </div>
    </LocalizationProvider>
  );
}
