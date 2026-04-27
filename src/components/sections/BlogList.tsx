'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { BlogPostPublic } from '@/lib/admin/types';
import { getPublicBlogPosts } from '@/lib/admin/api';
import { Locale, t } from '@/lib/i18n';
import { FadeIn } from '@/components/ui/FadeIn';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { BlogCard } from './BlogCard';

interface BlogListProps {
  locale: Locale;
}

const PAGE_SIZE = 9;

export function BlogList({ locale }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPostPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const result = await getPublicBlogPosts(
        {
          page,
          limit: PAGE_SIZE,
          search: activeSearch || undefined,
          categoria: categoria || undefined,
        },
        locale,
      );
      setPosts(result.data);
      setTotalPages(result.pagination.totalPages || 1);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t(locale, 'No se pudieron cargar los articulos.', 'Could not load articles.'),
      );
    } finally {
      setLoading(false);
    }
  }, [page, activeSearch, categoria, locale]);

  useEffect(() => {
    load();
  }, [load]);

  const categorias = Array.from(
    new Set(posts.map((p) => p.categoria).filter((c): c is string => !!c)),
  ).sort();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(search.trim());
  };

  return (
    <section className="bg-[#FAFAF7] py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <SectionEyebrow>{t(locale, 'Conocimiento Legal', 'Legal Insights')}</SectionEyebrow>
          <SectionTitle>{t(locale, 'Blog', 'Blog')}</SectionTitle>
          <p className="font-sans text-sm sm:text-base text-[#6B6B6B] leading-relaxed">
            {t(
              locale,
              'Articulos, analisis y notas legales redactadas por nuestro equipo para ayudarle a entender mejor sus derechos y oportunidades.',
              'Articles, analysis and legal notes written by our team to help you better understand your rights and opportunities.',
            )}
          </p>
        </FadeIn>

        {/* Filters */}
        <FadeIn className="mb-10">
          <form
            onSubmit={onSubmit}
            className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t(locale, 'Buscar articulos...', 'Search articles...')}
                className="w-full pl-9 pr-3 py-2.5 border border-[#E6E6E6] bg-white font-sans text-sm focus:outline-none focus:border-[#C9A449] transition-colors"
              />
            </div>
            {categorias.length > 0 && (
              <select
                value={categoria}
                onChange={(e) => {
                  setPage(1);
                  setCategoria(e.target.value);
                }}
                className="px-3 py-2.5 border border-[#E6E6E6] bg-white font-sans text-sm focus:outline-none focus:border-[#C9A449] transition-colors"
              >
                <option value="">{t(locale, 'Todas las categorias', 'All categories')}</option>
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
            <button
              type="submit"
              className="bg-[#C9A449] text-[#0E0E0E] hover:bg-[#8C6F2A] hover:text-white transition-colors duration-300 px-6 py-2.5 font-sans text-xs tracking-widest uppercase font-semibold"
            >
              {t(locale, 'Buscar', 'Search')}
            </button>
          </form>
        </FadeIn>

        {/* States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border border-[#E6E6E6] bg-white animate-pulse"
              >
                <div className="aspect-[16/10] bg-[#F0F0F0]" />
                <div className="p-6 space-y-3">
                  <div className="h-3 bg-[#F0F0F0] w-1/3" />
                  <div className="h-5 bg-[#F0F0F0] w-3/4" />
                  <div className="h-3 bg-[#F0F0F0] w-full" />
                  <div className="h-3 bg-[#F0F0F0] w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-[#E84855] font-sans text-sm">{error}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-[#6B6B6B] font-sans text-sm py-16">
            {t(
              locale,
              'No hay articulos publicados todavia.',
              'No articles published yet.',
            )}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <FadeIn key={post.id} delay={Math.min(i * 60, 360)}>
                  <BlogCard post={post} locale={locale} />
                </FadeIn>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-[#E6E6E6] font-sans text-xs uppercase tracking-widest font-semibold text-[#1C1C1C] hover:border-[#C9A449] hover:text-[#C9A449] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E6E6E6] disabled:hover:text-[#1C1C1C]"
                >
                  {t(locale, 'Anterior', 'Previous')}
                </button>
                <span className="font-sans text-xs text-[#6B6B6B] px-3">
                  {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-[#E6E6E6] font-sans text-xs uppercase tracking-widest font-semibold text-[#1C1C1C] hover:border-[#C9A449] hover:text-[#C9A449] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#E6E6E6] disabled:hover:text-[#1C1C1C]"
                >
                  {t(locale, 'Siguiente', 'Next')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
