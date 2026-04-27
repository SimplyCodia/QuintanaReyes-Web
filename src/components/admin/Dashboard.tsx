'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  FileText,
  Clock,
  Loader,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Skeleton,
  Alert,
  Box,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import {
  getDashboardStats,
  getSolicitudesPorDia,
  getDistribucionPorArea,
  getSolicitudes,
} from '@/lib/admin/api';
import { useAuth } from '@/lib/admin/auth';
import {
  DashboardStats,
  SolicitudesPorDia,
  DistribucionPorArea,
  Solicitud,
  EstadoSolicitud,
  TipoCaso,
} from '@/lib/admin/types';
import { formatDate, getGreeting } from '@/lib/admin/utils';

const AREA_COLORS: Record<TipoCaso, string> = {
  [TipoCaso.FAMILIA]: '#C9A449',
  [TipoCaso.ADMINISTRATIVO]: '#4A90E2',
  [TipoCaso.CORPORATIVO]: '#50C878',
  [TipoCaso.CIVIL]: '#E84855',
  [TipoCaso.PENAL]: '#9B6B9E',
  [TipoCaso.LABORAL]: '#F2994A',
  [TipoCaso.MIGRATORIO]: '#56CCF2',
};

const AREA_LABELS: Record<TipoCaso, string> = {
  [TipoCaso.FAMILIA]: 'Familia',
  [TipoCaso.ADMINISTRATIVO]: 'Administrativo',
  [TipoCaso.CORPORATIVO]: 'Corporativo',
  [TipoCaso.CIVIL]: 'Civil',
  [TipoCaso.PENAL]: 'Penal',
  [TipoCaso.LABORAL]: 'Laboral',
  [TipoCaso.MIGRATORIO]: 'Migratorio',
};

const ESTADO_CHIP_COLOR: Record<
  EstadoSolicitud,
  'warning' | 'info' | 'success' | 'default'
> = {
  [EstadoSolicitud.PENDIENTE]: 'warning',
  [EstadoSolicitud.EN_PROCESO]: 'info',
  [EstadoSolicitud.ATENDIDA]: 'success',
  [EstadoSolicitud.ARCHIVADA]: 'default',
};

const ESTADO_LABELS: Record<EstadoSolicitud, string> = {
  [EstadoSolicitud.PENDIENTE]: 'Pendiente',
  [EstadoSolicitud.EN_PROCESO]: 'En Proceso',
  [EstadoSolicitud.ATENDIDA]: 'Atendida',
  [EstadoSolicitud.ARCHIVADA]: 'Archivada',
};

export function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [porDia, setPorDia] = useState<SolicitudesPorDia[]>([]);
  const [distribucion, setDistribucion] = useState<DistribucionPorArea[]>([]);
  const [recientes, setRecientes] = useState<Solicitud[]>([]);
  const [mias, setMias] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [statsData, porDiaData, distribucionData, todasResult] = await Promise.all([
          getDashboardStats(),
          getSolicitudesPorDia(),
          getDistribucionPorArea(),
          getSolicitudes(),
        ]);
        setStats(statsData);
        setPorDia(porDiaData);
        setDistribucion(distribucionData);
        const sorted = [...todasResult.data].sort(
          (a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        setRecientes(sorted.slice(0, 5));
        if (user) {
          setMias(sorted.filter((s) => s.asignadoAId === user.id).slice(0, 5));
        }
      } catch {
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton variant="text" width={280} height={36} />
          <Skeleton variant="text" width={200} height={20} sx={{ mt: 0.5 }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={88} />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton variant="rounded" height={280} className="xl:col-span-2" />
          <Skeleton variant="rounded" height={280} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton variant="rounded" height={300} />
          <Skeleton variant="rounded" height={300} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  const kpis = [
    {
      label: 'Total Solicitudes',
      value: stats?.totalSolicitudes ?? 0,
      icon: FileText,
      iconColor: '#C9A449',
      iconBg: 'rgba(201, 164, 73, 0.1)',
    },
    {
      label: 'Pendientes',
      value: stats?.pendientes ?? 0,
      icon: Clock,
      iconColor: '#F59E0B',
      iconBg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'En Proceso',
      value: stats?.enProceso ?? 0,
      icon: Loader,
      iconColor: '#3B82F6',
      iconBg: 'rgba(59, 130, 246, 0.1)',
    },
    {
      label: 'Atendidas',
      value: stats?.atendidas ?? stats?.atendidasMes ?? 0,
      icon: CheckCircle,
      iconColor: '#10B981',
      iconBg: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  const chartData = porDia.map((d) => ({
    fecha: new Date(d.fecha).toLocaleDateString('es-PA', { day: '2-digit', month: '2-digit' }),
    cantidad: (d as unknown as { total?: number }).total ?? d.cantidad ?? 0,
  }));

  const pieData = distribucion.map((d) => {
    const raw = d as unknown as { tipoCaso?: string; total?: number };
    const area = (d.area ?? raw.tipoCaso ?? '') as TipoCaso;
    return {
      name: AREA_LABELS[area] ?? area,
      value: raw.total ?? d.cantidad ?? 0,
      color: AREA_COLORS[area] ?? '#999',
    };
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
          {getGreeting()}, {user?.nombre?.split(' ')[0] ?? 'Usuario'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B6B6B', mt: 0.5 }}>
          Resumen del panel de administración
        </Typography>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: kpi.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={20} color={kpi.iconColor} />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>
                      {kpi.value}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B6B6B', mt: 0.25, display: 'block' }}>
                      {kpi.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card
          elevation={0}
          sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}
          className="xl:col-span-2"
        >
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp size={16} color="#C9A449" />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                  Solicitudes por Día (últimos 30 días)
                </Typography>
              </Box>
            }
            sx={{ pb: 0 }}
          />
          <CardContent>
            {chartData.length === 0 ? (
              <Box
                sx={{
                  height: 210,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                  Sin datos disponibles
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: 10, fill: '#6B6B6B' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#6B6B6B' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E6E6E6',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#1A1A1A', fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cantidad"
                    stroke="#C9A449"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#C9A449' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={16} color="#C9A449" />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                  Distribución por Área
                </Typography>
              </Box>
            }
            sx={{ pb: 0 }}
          />
          <CardContent>
            {pieData.length === 0 ? (
              <Box
                sx={{
                  height: 210,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                  Sin datos disponibles
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E6E6E6',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Últimas 5 solicitudes */}
        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
          <CardHeader
            title={
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                Últimas Solicitudes
              </Typography>
            }
            action={
              <Button
                component={Link}
                href="/admin/solicitudes"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                size="small"
                sx={{
                  color: '#C9A449',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { bgcolor: 'rgba(201,164,73,0.08)' },
                }}
              >
                Ver todas
              </Button>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: 1, px: 0, '&:last-child': { pb: 0 } }}>
            {recientes.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: '#6B6B6B', textAlign: 'center', py: 4, px: 3 }}
              >
                No hay solicitudes aún
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { bgcolor: '#FAFAF7', borderBottom: '1px solid #E6E6E6' } }}>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Cliente
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Área
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Fecha
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recientes.map((s) => (
                    <TableRow
                      key={s.id}
                      onClick={() => router.push(`/admin/solicitudes/detalle/?id=${s.id}`)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#FAFAF7' },
                        '&:hover td:first-of-type .sol-name': { color: '#C9A449' },
                      }}
                    >
                      <TableCell>
                        <Typography
                          className="sol-name"
                          variant="body2"
                          sx={{ fontWeight: 500, color: '#1A1A1A', fontSize: '0.8125rem', transition: 'color 0.15s' }}
                          noWrap
                        >
                          {s.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                          {AREA_LABELS[s.tipoCaso] ?? s.tipoCaso}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ESTADO_LABELS[s.estado]}
                          color={ESTADO_CHIP_COLOR[s.estado]}
                          size="small"
                          sx={{ fontSize: '0.6875rem', height: 22 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                          {formatDate(s.fechaCreacion)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Asignadas a mí */}
        <Card elevation={0} sx={{ border: '1px solid #E6E6E6', borderRadius: 2 }}>
          <CardHeader
            title={
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1A1A1A' }}>
                Asignadas a Mí
              </Typography>
            }
            action={
              <Button
                component={Link}
                href="/admin/solicitudes"
                endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                size="small"
                sx={{
                  color: '#C9A449',
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': { bgcolor: 'rgba(201,164,73,0.08)' },
                }}
              >
                Ver todas
              </Button>
            }
            sx={{ pb: 0 }}
          />
          <CardContent sx={{ pt: 1, px: 0, '&:last-child': { pb: 0 } }}>
            {mias.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: '#6B6B6B', textAlign: 'center', py: 4, px: 3 }}
              >
                No tienes solicitudes asignadas
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { bgcolor: '#FAFAF7', borderBottom: '1px solid #E6E6E6' } }}>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Cliente
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Área
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Estado
                    </TableCell>
                    <TableCell sx={{ color: '#6B6B6B', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Fecha
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mias.map((s) => (
                    <TableRow
                      key={s.id}
                      onClick={() => router.push(`/admin/solicitudes/detalle/?id=${s.id}`)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#FAFAF7' },
                        '&:hover td:first-of-type .sol-name': { color: '#C9A449' },
                      }}
                    >
                      <TableCell>
                        <Typography
                          className="sol-name"
                          variant="body2"
                          sx={{ fontWeight: 500, color: '#1A1A1A', fontSize: '0.8125rem', transition: 'color 0.15s' }}
                          noWrap
                        >
                          {s.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                          {AREA_LABELS[s.tipoCaso] ?? s.tipoCaso}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ESTADO_LABELS[s.estado]}
                          color={ESTADO_CHIP_COLOR[s.estado]}
                          size="small"
                          sx={{ fontSize: '0.6875rem', height: 22 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ color: '#6B6B6B', whiteSpace: 'nowrap' }}>
                          {formatDate(s.fechaCreacion)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
