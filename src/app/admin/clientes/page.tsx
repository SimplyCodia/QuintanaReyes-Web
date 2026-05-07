'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/admin/auth';
import { LoginPage } from '@/components/admin/LoginPage';
import { Sidebar } from '@/components/admin/Sidebar';
import { ClientesPage } from '@/components/admin/ClientesPage';

export default function AdminClientesPage() {
  const { isAuthenticated, isLimited, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && isLimited) {
      router.replace('/admin/solicitudes');
    }
  }, [loading, isAuthenticated, isLimited, router]);

  if (loading || (isAuthenticated && isLimited)) {
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
        <ClientesPage />
      </main>
    </div>
  );
}
