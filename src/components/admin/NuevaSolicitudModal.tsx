'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Alert,
  Box,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import { createSolicitudAdmin } from '@/lib/admin/api';
import { Cliente, TipoCaso, ORIGEN_OPTIONS } from '@/lib/admin/types';
import {
  detectInjection,
  isValidEmail,
  isValidPhone,
  isValidName,
} from '@/lib/sanitize';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  cliente?: Cliente;
}

const TIPO_LABELS: Record<TipoCaso, string> = {
  [TipoCaso.FAMILIA]: 'Derecho de Familia',
  [TipoCaso.ADMINISTRATIVO]: 'Derecho Administrativo',
  [TipoCaso.CORPORATIVO]: 'Derecho Corporativo',
  [TipoCaso.CIVIL]: 'Derecho Civil',
  [TipoCaso.PENAL]: 'Derecho Penal',
  [TipoCaso.LABORAL]: 'Derecho Laboral',
  [TipoCaso.MIGRATORIO]: 'Derecho Migratorio',
};

interface FormErrors {
  origen?: string;
  nombre?: string;
  telefono?: string;
  email?: string;
  tipoCaso?: string;
  mensaje?: string;
}

export function NuevaSolicitudModal({ open, onClose, onCreated, cliente }: Props) {
  const [origen, setOrigen] = useState('');
  const [nombre, setNombre] = useState(cliente?.nombre ?? '');
  const [telefono, setTelefono] = useState(cliente?.telefono ?? '');
  const [email, setEmail] = useState(cliente?.email ?? '');
  const [tipoCaso, setTipoCaso] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setOrigen('');
    setNombre(cliente?.nombre ?? '');
    setTelefono(cliente?.telefono ?? '');
    setEmail(cliente?.email ?? '');
    setTipoCaso('');
    setMensaje('');
    setErrors({});
    setSubmitError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!origen) {
      newErrors.origen = 'El origen es requerido.';
    }

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido.';
    } else if (!isValidName(nombre.trim())) {
      newErrors.nombre = 'El nombre contiene caracteres no válidos.';
    } else if (detectInjection(nombre)) {
      newErrors.nombre = 'El nombre contiene contenido no permitido.';
    }

    if (!telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido.';
    } else if (!isValidPhone(telefono.trim())) {
      newErrors.telefono = 'El teléfono no tiene un formato válido.';
    } else if (detectInjection(telefono)) {
      newErrors.telefono = 'El teléfono contiene contenido no permitido.';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo es requerido.';
    } else if (!isValidEmail(email.trim())) {
      newErrors.email = 'El correo no tiene un formato válido.';
    } else if (detectInjection(email)) {
      newErrors.email = 'El correo contiene contenido no permitido.';
    }

    if (!tipoCaso) {
      newErrors.tipoCaso = 'El tipo de caso es requerido.';
    }

    if (mensaje && detectInjection(mensaje)) {
      newErrors.mensaje = 'El mensaje contiene contenido no permitido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setSubmitError('');
      await createSolicitudAdmin({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        tipoCaso,
        mensaje: mensaje.trim() || undefined,
        origen,
        clienteId: cliente ? cliente.id : null,
      });
      resetForm();
      onCreated();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'No se pudo crear la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: '#1A1A1A', pb: 1 }}>
        Nueva Solicitud
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {submitError && (
            <Alert severity="error" sx={{ borderRadius: 1.5 }}>
              {submitError}
            </Alert>
          )}

          <FormControl size="small" fullWidth error={!!errors.origen}>
            <InputLabel>Origen *</InputLabel>
            <Select
              value={origen}
              label="Origen *"
              onChange={(e) => setOrigen(e.target.value)}
            >
              {ORIGEN_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
            {errors.origen && <FormHelperText>{errors.origen}</FormHelperText>}
          </FormControl>

          <TextField
            label="Nombre *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!!cliente}
            size="small"
            fullWidth
            error={!!errors.nombre}
            helperText={errors.nombre}
          />

          <TextField
            label="Teléfono *"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            disabled={!!cliente}
            size="small"
            fullWidth
            error={!!errors.telefono}
            helperText={errors.telefono}
          />

          <TextField
            label="Correo Electrónico *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!!cliente}
            size="small"
            fullWidth
            type="email"
            error={!!errors.email}
            helperText={errors.email}
          />

          <FormControl size="small" fullWidth error={!!errors.tipoCaso}>
            <InputLabel>Tipo de Caso *</InputLabel>
            <Select
              value={tipoCaso}
              label="Tipo de Caso *"
              onChange={(e) => setTipoCaso(e.target.value)}
            >
              {Object.values(TipoCaso).map((t) => (
                <MenuItem key={t} value={t}>
                  {TIPO_LABELS[t]}
                </MenuItem>
              ))}
            </Select>
            {errors.tipoCaso && <FormHelperText>{errors.tipoCaso}</FormHelperText>}
          </FormControl>

          <TextField
            label="Mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={3}
            placeholder="Descripción breve del caso (opcional)..."
            error={!!errors.mensaje}
            helperText={errors.mensaje}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="text"
          sx={{ textTransform: 'none', color: '#6B6B6B' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : undefined}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {loading ? 'Creando...' : 'Crear Solicitud'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
