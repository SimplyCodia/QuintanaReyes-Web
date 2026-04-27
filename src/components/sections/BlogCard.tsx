'use client';

import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import { BlogPostPublic } from '@/lib/admin/types';
import { getBase64ImageSrc } from '@/lib/image-utils';
import { Locale, t } from '@/lib/i18n';

interface BlogCardProps {
  post: BlogPostPublic;
  locale: Locale;
}

function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return '';
  const date = new Date(iso);
  return date.toLocaleDateString(locale === 'es' ? 'es-PA' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const href = `/${locale}/blog/${encodeURIComponent(post.slug)}`;
  const hasImage = !!post.imagenDestacada;
  const imageSrc = hasImage
    ? getBase64ImageSrc(post.imagenDestacada, post.imagenDestacadaMime)
    : null;

  return (
    <article className="group flex flex-col h-full border border-[#E6E6E6] bg-white hover:border-[#C9A449] transition-colors duration-300">
      <Link href={href} className="block aspect-[16/10] overflow-hidden bg-[#FAFAF7] relative">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={post.titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#C9A449]/40">
            <Newspaper className="w-14 h-14" />
          </div>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-6">
        {post.categoria && (
          <p className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-[#C9A449] mb-3">
            {post.categoria}
          </p>
        )}

        <h3 className="font-serif text-xl sm:text-2xl text-[#0E0E0E] leading-snug mb-3 group-hover:text-[#8C6F2A] transition-colors duration-300">
          <Link href={href}>{post.titulo}</Link>
        </h3>

        {post.extracto && (
          <p className="font-sans text-sm text-[#6B6B6B] leading-relaxed mb-5 line-clamp-3">
            {post.extracto}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 pt-4 border-t border-[#E6E6E6]">
          <div className="font-sans text-xs text-[#6B6B6B]">
            <p className="font-medium text-[#1A1A1A]">{post.autor}</p>
            <p>{formatDate(post.fechaPublicacion, locale)}</p>
          </div>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 font-sans text-xs tracking-widest uppercase font-semibold text-[#C9A449] hover:text-[#8C6F2A] transition-colors duration-300"
          >
            {t(locale, 'Leer', 'Read')}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </article>
  );
}
