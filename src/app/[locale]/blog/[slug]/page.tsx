import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';
import { BASE_URL } from '@/data/seo';
import { BlogDetail } from '@/components/sections/BlogDetail';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface PublishedPostSummary {
  slug: string;
  titulo: string;
  extracto: string | null;
  slug_es?: string | null;
  slug_en?: string | null;
}

// Slug used to satisfy Next 16's `output: export` requirement that dynamic
// routes always emit at least one prerendered path. The runtime BlogDetail
// will hit the API, fail to find this slug and render the not-found UI.
const FALLBACK_SLUG = '_placeholder';

/**
 * Pre-render every published article at build time. Required by `output: export`
 * (Next.js 16 errors out if a dynamic route's generateStaticParams returns an
 * empty array). Pairs each locale with the slugs that exist for THAT locale —
 * /es/ never gets paired with an EN-only slug (the API has no mapping). When
 * the API is unreachable or has no posts, we still emit one placeholder per
 * locale so the export succeeds.
 */
export async function generateStaticParams() {
  const { es, en } = await fetchPublishedSlugsByLocale();
  const params: Array<{ locale: string; slug: string }> = [];
  for (const slug of es) params.push({ locale: 'es', slug });
  for (const slug of en) params.push({ locale: 'en', slug });
  if (es.length === 0) params.push({ locale: 'es', slug: FALLBACK_SLUG });
  if (en.length === 0) params.push({ locale: 'en', slug: FALLBACK_SLUG });
  return params;
}

async function fetchPublishedSlugsByLocale(): Promise<{ es: string[]; en: string[] }> {
  const fetchLang = async (lang: 'es' | 'en'): Promise<string[]> => {
    try {
      const res = await fetch(`${API_BASE}/blog?limit=200&lang=${lang}`, {
        cache: 'no-store',
      });
      if (!res.ok) return [];
      const json = (await res.json()) as { data?: PublishedPostSummary[] };
      const slugs = new Set<string>();
      for (const p of json.data ?? []) {
        // The list endpoint projects `slug` to the requested lang, but also
        // exposes `slug_es`/`slug_en` so we can be defensive.
        const target = lang === 'es' ? p.slug_es ?? p.slug : p.slug_en ?? p.slug;
        if (target) slugs.add(target);
      }
      return Array.from(slugs);
    } catch {
      return [];
    }
  };

  const [es, en] = await Promise.all([fetchLang('es'), fetchLang('en')]);
  return { es, en };
}

async function fetchPostMeta(slug: string, locale: string): Promise<PublishedPostSummary | null> {
  try {
    const res = await fetch(
      `${API_BASE}/blog/${encodeURIComponent(slug)}?lang=${locale}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: PublishedPostSummary };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const meta = await fetchPostMeta(slug, locale);
  const title = meta?.titulo
    ? `${meta.titulo} | Quintana Reyes & Asociados`
    : 'Blog | Quintana Reyes & Asociados';
  const description =
    meta?.extracto ||
    'Articulo del blog de Quintana Reyes & Asociados.';

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/${locale}/blog/${slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${locale}/blog/${slug}`,
      type: 'article',
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  return <BlogDetail slug={slug} locale={locale as Locale} />;
}
