import type { MetadataRoute } from 'next';
import { languageAlternates, LOCALES, localizedPath } from './lib/i18n';
import { allPublications } from './lib/library';

const ORIGIN = 'https://regeneracion132.es';
const absoluteAlternates = (page: '' | 'contacto' = '') => ({
  languages: Object.fromEntries(
    Object.entries(languageAlternates(page)).map(([language, path]) => [language, `${ORIGIN}${path}`]),
  ),
});

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = LOCALES.flatMap(locale => [
    {
      url: `${ORIGIN}${localizedPath(locale)}`,
      lastModified: new Date(),
      alternates: absoluteAlternates(),
    },
    {
      url: `${ORIGIN}${localizedPath(locale, 'contacto')}`,
      lastModified: new Date(),
      alternates: absoluteAlternates('contacto'),
    },
  ]);
  const articles = allPublications().map(item => ({ url: `${ORIGIN}/${item.language}/biblioteca/${item.slug}`, lastModified: new Date(item.date) }));
  return [...pages, ...LOCALES.map(locale => ({ url: `${ORIGIN}/${locale}/biblioteca`, lastModified: new Date() })), ...articles];
}
