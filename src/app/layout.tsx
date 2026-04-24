import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quintana Reyes & Asociados | Firma Legal en Panamá',
  description:
    'Firma de abogados en Panamá especializada en soluciones legales integrales.',
};

// suppressHydrationWarning is set on <html> because the locale layout
// updates the lang attribute dynamically based on the [locale] segment.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
