'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  Box,
} from '@mui/material';
import { useAuth } from '@/lib/admin/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Solicitudes', href: '/admin/solicitudes', icon: FileText },
  { label: 'Usuarios', href: '/admin/usuarios', icon: Users, adminOnly: true },
  { label: 'Auditoría', href: '/admin/auditoria', icon: Shield, adminOnly: true },
  { label: 'Configuración', href: '/admin/configuracion', icon: Settings, adminOnly: true },
];

const DRAWER_WIDTH = 256;

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#0E0E0E',
          borderRight: '1px solid #1C1C1C',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2.5,
          borderBottom: '1px solid #1C1C1C',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#C9A449',
            borderRadius: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Scale size={18} color="#0E0E0E" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              color: '#E6E6E6',
              fontWeight: 600,
              fontSize: '0.7rem',
              lineHeight: 1.3,
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Quintana Reyes
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#6B6B6B',
              fontSize: '0.625rem',
              lineHeight: 1.3,
              display: 'block',
            }}
          >
            &amp; Asociados
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1, py: 1, overflowY: 'auto' }} disablePadding>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.25 }}>
              <Tooltip title={item.label} placement="right" arrow>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  selected={active}
                  sx={{
                    borderRadius: 1.5,
                    py: 1,
                    px: 1.5,
                    '&.Mui-selected': {
                      bgcolor: '#C9A449',
                      color: '#0E0E0E',
                      '&:hover': { bgcolor: '#B8933A' },
                      '& .MuiListItemIcon-root': { color: '#0E0E0E' },
                    },
                    '&:not(.Mui-selected)': {
                      color: '#E6E6E6',
                      '&:hover': { bgcolor: '#1C1C1C' },
                      '& .MuiListItemIcon-root': { color: '#E6E6E6' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Icon size={16} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{ '& .MuiListItemText-primary': { fontSize: '0.8125rem', fontWeight: 500 } }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* User section */}
      <Box sx={{ borderTop: '1px solid #1C1C1C', p: 1, flexShrink: 0 }}>
        <Tooltip title="Mi perfil" placement="right" arrow>
          <ListItemButton
            component={Link}
            href="/admin/perfil"
            selected={pathname === '/admin/perfil'}
            sx={{
              borderRadius: 1.5,
              py: 1,
              px: 1.5,
              mb: 0.25,
              '&.Mui-selected': {
                bgcolor: '#C9A449',
                '&:hover': { bgcolor: '#B8933A' },
                '& .MuiListItemText-primary': { color: '#0E0E0E' },
                '& .MuiListItemText-secondary': { color: '#0E0E0E99' },
              },
              '&:not(.Mui-selected)': {
                '&:hover': { bgcolor: '#1C1C1C' },
                '& .MuiListItemText-primary': { color: '#E6E6E6' },
                '& .MuiListItemText-secondary': { color: '#6B6B6B' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: '#C9A449',
                  color: '#0E0E0E',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                {user?.nombre?.charAt(0).toUpperCase() ?? <User size={12} />}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              primary={user?.nombre ?? 'Usuario'}
              secondary={user?.rol === 'ADMIN' ? 'Administrador' : 'Abogado'}
              sx={{
                '& .MuiListItemText-primary': { fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                '& .MuiListItemText-secondary': { fontSize: '0.625rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
              }}
            />
          </ListItemButton>
        </Tooltip>

        <Tooltip title="Cerrar sesión" placement="right" arrow>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 1.5,
              py: 1,
              px: 1.5,
              color: '#E6E6E6',
              '&:hover': { bgcolor: '#1C1C1C' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: '#E6E6E6' }}>
              <LogOut size={16} />
            </ListItemIcon>
            <ListItemText
              primary="Cerrar sesión"
              sx={{ '& .MuiListItemText-primary': { fontSize: '0.8125rem', fontWeight: 500 } }}
            />
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
