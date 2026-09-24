import type { Metadata } from 'next';
import es from '../../content/es.json';
import ca from '../../content/ca.json';
import en from '../../content/en.json';
import fr from '../../content/fr.json';
import it from '../../content/it.json';

export const LOCALES = ['es', 'va', 'en', 'fr', 'it'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

export type Dictionary = typeof es;

export const LOCALE_CONFIG: Record<Locale, {
  contentFile: string;
  htmlLang: string;
  hreflang: string;
  openGraphLocale: string;
}> = {
  es: { contentFile: 'es.json', htmlLang: 'es', hreflang: 'es', openGraphLocale: 'es_ES' },
  va: { contentFile: 'ca.json', htmlLang: 'ca-ES-valencia', hreflang: 'ca', openGraphLocale: 'ca_ES' },
  en: { contentFile: 'en.json', htmlLang: 'en', hreflang: 'en', openGraphLocale: 'en_GB' },
  fr: { contentFile: 'fr.json', htmlLang: 'fr', hreflang: 'fr', openGraphLocale: 'fr_FR' },
  it: { contentFile: 'it.json', htmlLang: 'it', hreflang: 'it', openGraphLocale: 'it_IT' },
};

const dictionaries: Record<Locale, Dictionary> = {
  es,
  va: ca as Dictionary,
  en: en as Dictionary,
  fr: fr as Dictionary,
  it: it as Dictionary,
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function localizedPath(locale: Locale, page: '' | 'contacto' = '') {
  return `/${locale}${page ? `/${page}` : ''}`;
}

export function languageAlternates(page: '' | 'contacto' = ''): Record<string, string> {
  const languages = Object.fromEntries(
    LOCALES.map(locale => [LOCALE_CONFIG[locale].hreflang, localizedPath(locale, page)]),
  );
  return { ...languages, 'x-default': localizedPath(DEFAULT_LOCALE, page) };
}

export function buildMetadata(locale: Locale, page: 'home' | 'contact'): Metadata {
  const dictionary = getDictionary(locale);
  const localized = dictionary.metadata[page];
  const pathname = localizedPath(locale, page === 'contact' ? 'contacto' : '');
  return {
    metadataBase: new URL('https://regeneracion132.es'),
    title: localized.title,
    description: localized.description,
    alternates: {
      canonical: pathname,
      languages: languageAlternates(page === 'contact' ? 'contacto' : ''),
    },
    openGraph: {
      title: localized.openGraph.title,
      description: localized.openGraph.description,
      locale: LOCALE_CONFIG[locale].openGraphLocale,
      alternateLocale: LOCALES.filter(item => item !== locale).map(item => LOCALE_CONFIG[item].openGraphLocale),
      url: pathname,
      siteName: dictionary.site.name,
      images: [{ url: '/Logo_Regeneracion_132.png', alt: dictionary.media.logoAlt }],
      type: 'website',
    },
  };
}
