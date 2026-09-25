'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CATEGORIES } from '../../lib/categories';
import type { Publication } from '../../lib/library';
import type { Locale } from '../../lib/i18n';

export default function LibraryList({ lang, items }: { lang: Locale; items: Publication[] }) {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('categoria') || undefined;
  const filtered = categoria ? items.filter(item => item.category === categoria) : items;

  return <>
    <nav className="category-filter" aria-label="Filtrar por categoría">
      <Link href={`/${lang}/biblioteca`} aria-current={!categoria ? 'page' : undefined}>Todas</Link>
      {CATEGORIES.map(category => <Link key={category} href={`/${lang}/biblioteca?categoria=${category}`} aria-current={categoria === category ? 'page' : undefined}>{category}</Link>)}
    </nav>
    {filtered.length
      ? <div className="library-grid">{filtered.map(item => <article className="library-card" key={item.slug}>
          <div className="kicker">{item.category} · <time dateTime={item.date}>{item.date}</time></div>
          <h2><Link href={`/${lang}/biblioteca/${item.slug}`}>{item.title}</Link></h2>
          <p>{item.excerpt}</p>
          <Link className="text-link" href={`/${lang}/biblioteca/${item.slug}`}>Leer texto →</Link>
        </article>)}</div>
      : <div className="empty-state"><h2>La biblioteca aún está preparando sus primeros textos.</h2><p>No hay publicaciones disponibles en este idioma o categoría.</p></div>}
  </>;
}
