import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allPublications, findPublication, markdownToHtml, translationsOf } from '../../../lib/library';
import { isLocale, LOCALES, LOCALE_CONFIG, type Locale } from '../../../lib/i18n';
export const dynamicParams = false;
export function generateStaticParams() {
  const params = allPublications().map(item => ({ lang: item.language, slug: item.slug }));
  // output: 'export' requires at least one static param per dynamic route;
  // keep a harmless placeholder (never linked, resolves to notFound()) while biblioteca has no articles yet.
  return params.length ? params : [{ lang: 'es', slug: '__sin-publicaciones__' }];
}
export function generateMetadata({ params }: { params: { lang: string; slug: string } }): Metadata { if (!isLocale(params.lang)) notFound(); const item = findPublication(params.lang, params.slug); if (!item) notFound(); const alternates = Object.fromEntries(translationsOf(item).map(other => [LOCALE_CONFIG[other.language].hreflang, `/${other.language}/biblioteca/${other.slug}`])); return { title: item.title, description: item.excerpt, alternates: { canonical: `/${params.lang}/biblioteca/${item.slug}`, ...(Object.keys(alternates).length > 1 ? { languages: alternates } : {}) }, openGraph: { title: item.title, description: item.excerpt, type: 'article', publishedTime: item.date, authors: item.author ? [item.author] : undefined } }; }
export default function Article({ params }: { params: { lang: string; slug: string } }) { if (!isLocale(params.lang)) notFound(); const item = findPublication(params.lang as Locale, params.slug); if (!item) notFound(); return <main className="article-page"><div className="wrap"><Link className="back-link" href={`/${params.lang}/biblioteca`}>← Biblioteca</Link><article><div className="kicker">{item.category} · <time dateTime={item.date}>{item.date}</time></div><h1>{item.title}</h1>{item.author && <p className="article-author">{item.author}</p>}<p className="article-excerpt">{item.excerpt}</p><div className="article-body" dangerouslySetInnerHTML={{ __html: markdownToHtml(item.body) }} /></article></div></main>; }
