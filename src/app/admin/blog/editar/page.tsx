'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/admin/auth';
import { LoginPage } from '@/components/admin/LoginPage';
import { Sidebar } from '@/components/admin/Sidebar';
import { BlogForm } from '@/components/admin/BlogForm';
import { getBlogPostById } from '@/lib/admin/api';
import { BlogPost } from '@/lib/admin/types';
import { Alert } from '@mui/material';

function EditarContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    getBlogPostById(parseInt(id))
      .then(setPost)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'No se pudo cargar el articulo.'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#6B6B6B]">No se especifico un articulo.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#6B6B6B]">Cargando articulo...</p>
      </div>
    );
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!post) return null;

  return <BlogForm post={post} />;
}

export default function EditarBlogPostPage() {
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
          <EditarContent />
        </Suspense>
      </main>
    </div>
  );
}
