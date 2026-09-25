import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicationsFor } from '../../lib/library';
import { getDictionary, isLocale, LOCALES, type Locale } from '../../lib/i18n';
import LibraryList from './LibraryList';

export const dynamicParams = false;
export function generateStaticParams() { return LOCALES.map(lang => ({ lang })); }
export function generateMetadata({ params }: { params: { lang: string } }): Metadata { if (!isLocale(params.lang)) notFound(); return { title: `Biblioteca · Regeneración Nº 132`, description: 'Reflexiones y textos autorizados de Regeneración Nº 132.', alternates: { canonical: `/${params.lang}/biblioteca` } }; }

export default function Library({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound(); const lang: Locale = params.lang; const items = publicationsFor(lang); const dictionary = getDictionary(lang);
  return <main className="library-page"><div className="wrap"><Link className="back-link" href={`/${lang}#biblioteca`}>← {dictionary.pages.biblioteca.label}</Link><div className="kicker">{dictionary.pages.biblioteca.label}</div><h1>Biblioteca de Regeneración Nº 132</h1><p className="intro">Textos autorizados para la reflexión, el estudio y la cultura.</p><Suspense fallback={null}><LibraryList lang={lang} items={items}/></Suspense></div></main>;
}
