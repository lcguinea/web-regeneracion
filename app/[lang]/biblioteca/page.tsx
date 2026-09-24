import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATEGORIES, publicationsFor } from '../../lib/library';
import { getDictionary, isLocale, LOCALES, type Locale } from '../../lib/i18n';

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata { if (!isLocale(params.lang)) notFound(); return { title: `Biblioteca · Regeneración Nº 132`, description: 'Reflexiones y textos autorizados de Regeneración Nº 132.', alternates: { canonical: `/${params.lang}/biblioteca` } }; }

export default function Library({ params, searchParams }: { params: { lang: string }; searchParams?: { categoria?: string } }) {
  if (!isLocale(params.lang)) notFound(); const lang: Locale = params.lang; const items = publicationsFor(lang, searchParams?.categoria); const dictionary = getDictionary(lang);
  return <main className="library-page"><div className="wrap"><Link className="back-link" href={`/${lang}#biblioteca`}>← {dictionary.pages.biblioteca.label}</Link><div className="kicker">{dictionary.pages.biblioteca.label}</div><h1>Biblioteca de Regeneración Nº 132</h1><p className="intro">Textos autorizados para la reflexión, el estudio y la cultura.</p><nav className="category-filter" aria-label="Filtrar por categoría"><Link href={`/${lang}/biblioteca`} aria-current={!searchParams?.categoria ? 'page' : undefined}>Todas</Link>{CATEGORIES.map(category => <Link key={category} href={`/${lang}/biblioteca?categoria=${category}`} aria-current={searchParams?.categoria === category ? 'page' : undefined}>{category}</Link>)}</nav>{items.length ? <div className="library-grid">{items.map(item => <article className="library-card" key={item.slug}><div className="kicker">{item.category} · <time dateTime={item.date}>{item.date}</time></div><h2><Link href={`/${lang}/biblioteca/${item.slug}`}>{item.title}</Link></h2><p>{item.excerpt}</p><Link className="text-link" href={`/${lang}/biblioteca/${item.slug}`}>Leer texto →</Link></article>)}</div> : <div className="empty-state"><h2>La biblioteca aún está preparando sus primeros textos.</h2><p>No hay publicaciones disponibles en este idioma o categoría.</p></div>}</div></main>;
}
