'use client';

import { useAuth } from '@/lib/admin/auth';
import { LoginPage } from '@/components/admin/LoginPage';
import { Sidebar } from '@/components/admin/Sidebar';
import { AuditoriaPage } from '@/components/admin/AuditoriaPage';

export default function AdminAuditoriaPage() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
        <p className="text-[#6B6B6B]">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginPage />;

  if (!isAdmin) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="ml-0 flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-[#1A1A1A]">Acceso restringido</p>
            <p className="text-[#6B6B6B] text-sm mt-1">
              No tienes permisos para acceder a esta sección.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-0 flex-1 p-8">
        <AuditoriaPage />
      </main>
    </div>
  );
}
