import type { MetadataRoute } from 'next';
import { languageAlternates, LOCALES, localizedPath } from './lib/i18n';

const ORIGIN = 'https://regeneracion132.es';
const absoluteAlternates = (page: '' | 'contacto' = '') => ({
  languages: Object.fromEntries(
    Object.entries(languageAlternates(page)).map(([language, path]) => [language, `${ORIGIN}${path}`]),
  ),
});

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap(locale => [
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
}
