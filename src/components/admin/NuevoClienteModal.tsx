'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import { createCliente } from '@/lib/admin/api';
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
}

interface FormErrors {
  nombre?: string;
  telefono?: string;
  email?: string;
  notas?: string;
}

export function NuevoClienteModal({ open, onClose, onCreated }: Props) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [notas, setNotas] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setNombre('');
    setTelefono('');
    setEmail('');
    setNotas('');
    setErrors({});
    setSubmitError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

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

    if (notas && detectInjection(notas)) {
      newErrors.notas = 'Las notas contienen contenido no permitido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setSubmitError('');
      await createCliente({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        notas: notas.trim() || undefined,
      });
      resetForm();
      onCreated();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'No se pudo crear el cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: '#1A1A1A', pb: 1 }}>
        Nuevo Cliente
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {submitError && (
            <Alert severity="error" sx={{ borderRadius: 1.5 }}>
              {submitError}
            </Alert>
          )}

          <TextField
            label="Nombre *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            size="small"
            fullWidth
            autoFocus
            error={!!errors.nombre}
            helperText={errors.nombre}
          />

          <TextField
            label="Teléfono *"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            size="small"
            fullWidth
            error={!!errors.telefono}
            helperText={errors.telefono}
          />

          <TextField
            label="Correo Electrónico *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            fullWidth
            type="email"
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            size="small"
            fullWidth
            multiline
            rows={3}
            placeholder="Notas adicionales sobre el cliente (opcional)..."
            error={!!errors.notas}
            helperText={errors.notas}
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
          {loading ? 'Creando...' : 'Crear Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
