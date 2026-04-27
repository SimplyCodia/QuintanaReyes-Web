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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '@/lib/admin/auth';
import { detectInjection, isValidEmail } from '@/lib/sanitize';

export function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingrese su correo y contraseña.');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Ingrese un correo electrónico válido.');
      return;
    }

    if (detectInjection(email)) {
      setError('Se detectó contenido no permitido en el correo.');
      return;
    }

    if (detectInjection(password)) {
      setError('Se detectó contenido no permitido en la contraseña.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
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
        <Paper elevation={4} sx={{ borderRadius: 3, p: 4 }}>
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
              onKeyDown={handleKeyDown}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              fullWidth
              size="small"
              disabled={loading}
              slotProps={{ htmlInput: { maxLength: 255 } }}
              sx={{
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px white inset',
                  WebkitTextFillColor: '#0E0E0E',
                },
              }}
            />
            <TextField
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              autoComplete="current-password"
              fullWidth
              size="small"
              disabled={loading}
              sx={{
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px white inset',
                  WebkitTextFillColor: '#0E0E0E',
                },
              }}
              slotProps={{
                htmlInput: { maxLength: 128 },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
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
            {loading ? <CircularProgress size={20} sx={{ color: 'inherit' }} /> : 'Ingresar'}
          </Button>
        </Paper>

        {/* spacer */}
        <Box sx={{ mt: 3 }} />
      </Box>
    </Box>
  );
}
