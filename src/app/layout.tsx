import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quintana Reyes & Asociados | Firma Legal en Panamá',
  description:
    'Firma de abogados en Panamá especializada en soluciones legales integrales.',
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: [{ url: '/images/og-image.png', width: 1200, height: 630 }],
  },
};

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
