'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useAuth } from '@/lib/admin/auth';
import { LoginPage } from '@/components/admin/LoginPage';
import { Sidebar } from '@/components/admin/Sidebar';
import { ClienteDetalle } from '@/components/admin/ClienteDetalle';

function DetalleContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const id = idParam ? parseInt(idParam, 10) : NaN;

  if (!idParam || isNaN(id)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#6B6B6B]">No se especificó un cliente.</p>
      </div>
    );
  }

  return <ClienteDetalle clienteId={id} />;
}

export default function AdminClienteDetallePage() {
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
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-64">
              <p className="text-[#6B6B6B]">Cargando...</p>
            </div>
          }
        >
          <DetalleContent />
        </Suspense>
      </main>
    </div>
  );
}
