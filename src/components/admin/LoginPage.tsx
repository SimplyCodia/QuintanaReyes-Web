'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react';
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
          <Box
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#C9A449',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Scale size={28} color="#0E0E0E" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: '#E6E6E6',
              fontWeight: 600,
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            Quintana Reyes &amp; Asociados
          </Typography>
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

        <Typography
          variant="caption"
          sx={{ color: '#6B6B6B', display: 'block', textAlign: 'center', mt: 3 }}
        >
          &copy; {new Date().getFullYear()} Quintana Reyes &amp; Asociados
        </Typography>
      </Box>
    </Box>
  );
}
