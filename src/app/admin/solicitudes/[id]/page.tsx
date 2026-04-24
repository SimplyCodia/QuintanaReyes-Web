'use client';

import { use } from 'react';
import { useAuth } from '@/lib/admin/auth';
import { LoginPage } from '@/components/admin/LoginPage';
import { Sidebar } from '@/components/admin/Sidebar';
import { SolicitudDetalle } from '@/components/admin/SolicitudDetalle';

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminSolicitudDetallePage({ params }: Props) {
  const { id } = use(params);
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <p className="text-[#6B6B6B]">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage />;

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-0 flex-1 p-8">
        <SolicitudDetalle solicitudId={id} />
      </main>
    </div>
  );
}
