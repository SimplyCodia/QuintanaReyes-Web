'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { useAuth } from '@/lib/admin/auth';

export function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingrese su correo y contraseña.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Credenciales incorrectas. Intente nuevamente.');
      } else {
        setError('Credenciales incorrectas. Intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0E0E0E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 360 }}>
        {/* Logo */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo/logo_qr_asociados-dorado.webp"
            alt="Quintana Reyes & Asociados"
            style={{ height: 80, width: 'auto', objectFit: 'contain', marginBottom: 8 }}
          />
          <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
            Panel de Administración
          </Typography>
        </Box>

        {/* Card */}
        <Paper
          elevation={4}
          sx={{ borderRadius: 3, p: 4 }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#0E0E0E',
              fontWeight: 600,
              textAlign: 'center',
              mb: 3,
              fontSize: '1.0625rem',
            }}
          >
            Iniciar sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              fullWidth
              size="small"
              disabled={loading}
            />
            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              fullWidth
              size="small"
              disabled={loading}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{ mt: 3.5, py: 1.25, fontWeight: 600 }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: 'inherit' }} />
            ) : (
              'Ingresar'
            )}
          </Button>
        </Paper>

        {/* spacer */}
        <Box sx={{ mt: 3 }} />
      </Box>
    </Box>
  );
}
