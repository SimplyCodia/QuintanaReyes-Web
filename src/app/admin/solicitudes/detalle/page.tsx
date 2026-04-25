'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/lib/admin/auth';
import { LoginPage } from '@/components/admin/LoginPage';
import { Sidebar } from '@/components/admin/Sidebar';
import { SolicitudDetalle } from '@/components/admin/SolicitudDetalle';

function DetalleContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';

  if (!id) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#6B6B6B]">No se especificó una solicitud.</p>
      </div>
    );
  }

  return <SolicitudDetalle solicitudId={id} />;
}

export default function AdminSolicitudDetallePage() {
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
        <Suspense fallback={<div className="flex items-center justify-center h-64"><p className="text-[#6B6B6B]">Cargando...</p></div>}>
          <DetalleContent />
        </Suspense>
      </main>
    </div>
  );
}
