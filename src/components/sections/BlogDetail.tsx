'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { BlogPostPublic } from '@/lib/admin/types';
import { getPublicBlogPostBySlug } from '@/lib/admin/api';
import { getBase64ImageSrc } from '@/lib/image-utils';
import { Locale, t } from '@/lib/i18n';
import { FadeIn } from '@/components/ui/FadeIn';
import { useRegisterAlternateLink } from '@/components/layout/AlternateLinkContext';

interface BlogDetailProps {
  slug: string;
  locale: Locale;
}

function formatDate(iso: string | null, locale: Locale): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(locale === 'es' ? 'es-PA' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function BlogDetail({ slug, locale }: BlogDetailProps) {
  const [post, setPost] = useState<BlogPostPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getPublicBlogPostBySlug(slug, locale)
      .then(setPost)
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : t(locale, 'Articulo no encontrado.', 'Article not found.'),
        ),
      )
      .finally(() => setLoading(false));
  }, [slug, locale]);

  const sanitizedHtml = useMemo(() => {
    if (!post?.contenido) return '';
    return DOMPurify.sanitize(post.contenido, { USE_PROFILES: { html: true } });
  }, [post?.contenido]);

  // Build the language-switcher URL: when on /es/blog/<slug-es>, point EN to the
  // matching /en/blog/<slug-en> (and vice-versa). Falls back to the listing if
  // the post is not translated in the other language.
  const alternateHref = useMemo(() => {
    if (!post) return null;
    const otherLocale: Locale = locale === 'es' ? 'en' : 'es';
    const otherSlug = otherLocale === 'es' ? post.slug_es : post.slug_en;
    return otherSlug ? `/${otherLocale}/blog/${otherSlug}` : `/${otherLocale}/blog`;
  }, [post, locale]);
  useRegisterAlternateLink(alternateHref);

  const blogHref = `/${locale}/blog`;

  if (loading) {
    return (
      <section className="bg-white py-20 sm:py-28">
        <div className="container mx-auto px-6 max-w-[860px]">
          <div className="animate-pulse space-y-6">
            <div className="h-3 bg-[#F0F0F0] w-32" />
            <div className="h-12 bg-[#F0F0F0] w-3/4" />
            <div className="aspect-[16/9] bg-[#F0F0F0]" />
            <div className="space-y-3">
              <div className="h-4 bg-[#F0F0F0]" />
              <div className="h-4 bg-[#F0F0F0]" />
              <div className="h-4 bg-[#F0F0F0] w-2/3" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="bg-white py-20 sm:py-28">
        <div className="container mx-auto px-6 max-w-[860px] text-center space-y-6">
          <h1 className="font-serif text-4xl text-[#0E0E0E]">
            {t(locale, 'Articulo no encontrado', 'Article not found')}
          </h1>
          <p className="text-[#6B6B6B] font-sans">
            {error ||
              t(
                locale,
                'El articulo que buscas no esta disponible.',
                'The article you are looking for is not available.',
              )}
          </p>
          <Link
            href={blogHref}
            className="inline-flex items-center gap-2 font-sans text-sm tracking-widest uppercase font-semibold text-[#C9A449] hover:text-[#8C6F2A]"
          >
            <ArrowLeft className="w-4 h-4" />
            {t(locale, 'Volver al blog', 'Back to blog')}
          </Link>
        </div>
      </section>
    );
  }

  const heroSrc = post.imagenDestacada
    ? getBase64ImageSrc(post.imagenDestacada, post.imagenDestacadaMime)
    : null;

  return (
    <article className="bg-white">
      {/* Hero */}
      <section className="relative bg-[#0E0E0E] text-white">
        {heroSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroSrc}
            alt={post.titulo}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="relative container mx-auto px-6 max-w-[1024px] py-24 sm:py-32">
          <FadeIn>
            <Link
              href={blogHref}
              className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase font-semibold text-white/80 hover:text-[#C9A449] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t(locale, 'Volver al blog', 'Back to blog')}
            </Link>
            {post.categoria && (
              <p className="font-sans text-xs tracking-[0.2em] uppercase font-semibold text-[#C9A449] mb-4">
                {post.categoria}
              </p>
            )}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-3xl mb-6">
              {post.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80 font-sans">
              <span className="inline-flex items-center gap-2">
                <User className="w-4 h-4 text-[#C9A449]" />
                {post.autor}
              </span>
              {post.fechaPublicacion && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C9A449]" />
                  {formatDate(post.fechaPublicacion, locale)}
                </span>
              )}
              {post.tags.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#C9A449]" />
                  {post.tags.join(', ')}
                </span>
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-6 max-w-[760px]">
          {post.extracto && (
            <FadeIn>
              <p className="font-serif text-xl sm:text-2xl text-[#1C1C1C] leading-relaxed border-l-2 border-[#C9A449] pl-6 mb-12">
                {post.extracto}
              </p>
            </FadeIn>
          )}
          <FadeIn>
            <div
              className="blog-content font-sans text-[#1C1C1C] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </FadeIn>

          <div className="mt-16 pt-8 border-t border-[#E6E6E6] flex justify-center">
            <Link
              href={blogHref}
              className="inline-flex items-center gap-2 font-sans text-sm tracking-widest uppercase font-semibold text-[#C9A449] hover:text-[#8C6F2A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t(locale, 'Volver al blog', 'Back to blog')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
