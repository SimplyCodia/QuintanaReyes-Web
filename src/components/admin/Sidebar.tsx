'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Scale,
  LayoutDashboard,
  FileText,
  Newspaper,
  Users,
  Shield,
  Settings,
  User,
  LogOut,
  Contact,
} from 'lucide-react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Divider,
  Typography,
} from '@mui/material';
import { useAuth } from '@/lib/admin/auth';
import { NotificationBell } from './NotificationBell';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Solicitudes', href: '/admin/solicitudes', icon: FileText },
  { label: 'Clientes', href: '/admin/clientes', icon: Contact },
  { label: 'Blog', href: '/admin/blog', icon: Newspaper },
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2.5, borderBottom: '1px solid #1C1C1C', flexShrink: 0 }}>
        <Box sx={{ width: 36, height: 36, bgcolor: '#C9A449', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Scale size={20} color="#0E0E0E" />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: '#FAFAF7', fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.2, display: 'block', letterSpacing: '0.02em' }}>
            Quintana Reyes
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B6B6B', fontSize: '0.65rem', lineHeight: 1.2, display: 'block' }}>
            Abogados &amp; Asociados
          </Typography>
        </Box>
        <NotificationBell />
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, px: 1.5, py: 2, overflowY: 'auto' }} disablePadding>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={active}
                sx={{
                  borderRadius: 1.5,
                  py: 1.25,
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: '#C9A449',
                    color: '#0E0E0E',
                    '&:hover': { bgcolor: '#B8933A' },
                    '& .MuiListItemIcon-root': { color: '#0E0E0E' },
                    '& .MuiListItemText-primary': { color: '#0E0E0E', fontWeight: 600 },
                  },
                  '&:not(.Mui-selected)': {
                    color: '#E6E6E6',
                    '&:hover': { bgcolor: '#1C1C1C' },
                    '& .MuiListItemIcon-root': { color: '#9A9A9A' },
                    '& .MuiListItemText-primary': { color: '#E6E6E6' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User section */}
      <Divider sx={{ borderColor: '#1C1C1C' }} />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          component={Link}
          href="/admin/perfil"
          selected={pathname === '/admin/perfil'}
          sx={{
            borderRadius: 1.5,
            py: 1.25,
            px: 2,
            mb: 0.5,
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
          <ListItemIcon sx={{ minWidth: 40 }}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                bgcolor: pathname === '/admin/perfil' ? '#0E0E0E' : '#C9A449',
                color: pathname === '/admin/perfil' ? '#C9A449' : '#0E0E0E',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {user?.nombre?.charAt(0).toUpperCase() ?? <User size={14} />}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            primary={user?.nombre ?? 'Usuario'}
            secondary={user?.rol === 'ADMIN' ? 'Administrador' : 'Abogado'}
            sx={{
              '& .MuiListItemText-primary': { fontSize: '0.8rem', fontWeight: 600 },
              '& .MuiListItemText-secondary': { fontSize: '0.65rem' },
            }}
          />
        </ListItemButton>

        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 1.5,
            py: 1,
            px: 2,
            '&:hover': { bgcolor: '#1C1C1C' },
            '& .MuiListItemIcon-root': { color: '#9A9A9A' },
            '& .MuiListItemText-primary': { color: '#9A9A9A' },
            '&:hover .MuiListItemIcon-root': { color: '#E84855' },
            '&:hover .MuiListItemText-primary': { color: '#E84855' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <LogOut size={18} />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar sesión"
            sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem', fontWeight: 500 } }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
