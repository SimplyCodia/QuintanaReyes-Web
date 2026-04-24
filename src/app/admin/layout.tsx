'use client';

import { AdminAuthProvider } from '@/lib/admin/auth';
import { ThemeRegistry } from '@/lib/admin/ThemeRegistry';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeRegistry>
      <AdminAuthProvider>
        <div className="min-h-screen bg-[#FAFAF7]">
          {children}
        </div>
      </AdminAuthProvider>
    </ThemeRegistry>
  );
}
