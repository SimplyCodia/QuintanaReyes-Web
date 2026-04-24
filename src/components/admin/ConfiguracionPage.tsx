'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Box,
  Paper,
} from '@mui/material';
import {
  StorageOutlined,
  MailOutlined,
  SecurityOutlined,
  InfoOutlined,
  CheckCircleOutlined,
  LockOutlined,
  HttpsOutlined,
  SpeedOutlined,
  PublicOutlined,
} from '@mui/icons-material';

interface ConfigItem {
  label: string;
  value: string;
  status?: 'ok' | 'info';
}

interface ConfigCardProps {
  icon: React.ElementType;
  title: string;
  items: ConfigItem[];
}

function ConfigCard({ icon: Icon, title, items }: ConfigCardProps) {
  return (
    <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3, height: '100%' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'rgba(201,164,73,0.1)', width: 40, height: 40 }}>
            <Icon sx={{ color: '#C9A449', fontSize: 20 }} />
          </Avatar>
        }
        title={
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
            {title}
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 2 }}>
        <List disablePadding dense>
          {items.map((item, index) => (
            <Box key={item.label}>
              <ListItem disableGutters sx={{ py: 1 }}>
                <ListItemText
                  primary={
                    <Typography variant="caption" color="#6B6B6B">
                      {item.label}
                    </Typography>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
                  {item.status === 'ok' ? (
                    <Chip
                      icon={<CheckCircleOutlined sx={{ fontSize: '14px !important' }} />}
                      label={item.value}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(16,185,129,0.1)',
                        color: '#059669',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        '& .MuiChip-icon': { color: '#059669' },
                      }}
                    />
                  ) : (
                    <Typography variant="caption" sx={{ fontWeight: 500, color: "#1A1A1A" }}>
                      {item.value}
                    </Typography>
                  )}
                </Box>
              </ListItem>
              {index < items.length - 1 && <Divider sx={{ borderColor: '#F0F0F0' }} />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

export function ConfiguracionPage() {
  const cards: ConfigCardProps[] = [
    {
      icon: StorageOutlined,
      title: 'Base de Datos',
      items: [
        { label: 'Motor', value: 'MySQL 8.0' },
        { label: 'Estado', value: 'Conectado', status: 'ok' },
        { label: 'ORM', value: 'Prisma' },
        { label: 'Pool de conexiones', value: 'Activo', status: 'ok' },
      ],
    },
    {
      icon: MailOutlined,
      title: 'Correo Electrónico',
      items: [
        { label: 'Proveedor', value: 'Nodemailer' },
        { label: 'Estado', value: 'Configurado', status: 'ok' },
        { label: 'Protocolo', value: 'SMTP / TLS' },
        { label: 'Notificaciones', value: 'Habilitadas', status: 'ok' },
      ],
    },
    {
      icon: SecurityOutlined,
      title: 'Seguridad',
      items: [
        { label: 'Autenticación', value: 'JWT', status: 'ok' },
        { label: 'Hash de contraseñas', value: 'bcrypt (salt 12)', status: 'ok' },
        { label: 'Rate limiting', value: 'Activo', status: 'ok' },
        { label: 'CORS', value: 'Configurado', status: 'ok' },
      ],
    },
    {
      icon: InfoOutlined,
      title: 'Sistema',
      items: [
        { label: 'Aplicación', value: 'Quintana Reyes & Asociados' },
        { label: 'Versión', value: '1.0.0' },
        { label: 'Framework', value: 'NestJS + Next.js 16' },
        { label: 'Entorno', value: process.env.NODE_ENV ?? 'production' },
      ],
    },
  ];

  const securityFeatures = [
    { icon: LockOutlined, label: 'Tokens JWT firmados con clave secreta' },
    { icon: HttpsOutlined, label: 'Contraseñas hasheadas con bcrypt (salt 12)' },
    { icon: SpeedOutlined, label: 'Rate limiting para prevenir ataques de fuerza bruta' },
    { icon: PublicOutlined, label: 'CORS configurado para dominios autorizados' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
          Configuración
        </Typography>
        <Typography variant="body2" color="#6B6B6B" sx={{ mt: 0.5 }}>
          Información del sistema y estado de los servicios
        </Typography>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card) => (
          <ConfigCard key={card.title} {...card} />
        ))}
      </div>

      {/* Security features */}
      <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 3 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'rgba(201,164,73,0.1)', width: 40, height: 40 }}>
              <SecurityOutlined sx={{ color: '#C9A449', fontSize: 20 }} />
            </Avatar>
          }
          title={
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1A1A1A" }}>
              Características de seguridad activas
            </Typography>
          }
          sx={{ pb: 0 }}
        />
        <CardContent sx={{ pt: 1 }}>
          <List dense disablePadding>
            {securityFeatures.map((feature, index) => (
              <Box key={feature.label}>
                <ListItem disableGutters sx={{ py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <feature.icon sx={{ color: '#C9A449', fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" color="#1A1A1A">
                        {feature.label}
                      </Typography>
                    }
                  />
                  <Chip
                    label="Activo"
                    size="small"
                    sx={{
                      bgcolor: 'rgba(16,185,129,0.1)',
                      color: '#059669',
                      fontWeight: 500,
                      fontSize: '0.65rem',
                      flexShrink: 0,
                    }}
                  />
                </ListItem>
                {index < securityFeatures.length - 1 && (
                  <Divider sx={{ borderColor: '#F0F0F0' }} />
                )}
              </Box>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Footer note */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          bgcolor: 'rgba(201,164,73,0.05)',
          border: '1px solid rgba(201,164,73,0.2)',
          borderRadius: 3,
        }}
      >
        <Typography variant="caption" color="#6B6B6B" sx={{ lineHeight: 1.6 }}>
          Esta página muestra información de solo lectura sobre la configuración del sistema.
          Para modificar parámetros de configuración, edite las variables de entorno en el
          servidor o contacte al administrador del sistema.
        </Typography>
      </Paper>
    </div>
  );
}
