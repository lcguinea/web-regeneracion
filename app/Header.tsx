'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LOCALES, LOCALE_CONFIG, type Dictionary, type Locale } from './lib/i18n';
import { withBasePath } from './lib/basePath';

type HeaderProps = { lang: Locale; dictionary: Dictionary };

export default function Header({ lang, dictionary }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = dictionary.navigation.items;

  const pathFor = (locale: Locale) => {
    const localized = pathname.replace(/^\/(es|va|en|fr|it)(?=\/|$)/, `/${locale}`);
    const path = localized === pathname && !pathname.startsWith(`/${lang}`) ? `/${locale}` : localized;
    return withBasePath(path);
  };

  const preserveHash = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.hash) event.currentTarget.href += window.location.hash;
    setOpen(false);
  };

  return <header className="header wrap">
    <Link className="brand" href={`/${lang}`} onClick={() => setOpen(false)}>
      <Image src={withBasePath('/Logo_Regeneracion_132.png')} alt={dictionary.media.logoAlt} width={46} height={46}/>
      <span>{dictionary.site.headerName}<br/>{dictionary.site.headerNumber}</span>
    </Link>
    <button className="menu-toggle" aria-label={open ? dictionary.navigation.closeMenu : dictionary.navigation.openMenu} aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
    <nav className={open ? 'nav nav-open' : 'nav'} aria-label={dictionary.navigation.mainLabel}>
      <div className="nav-links">
        {links.map(([id, label]) => <Link key={id} href={`/${lang}#${id}`} onClick={() => setOpen(false)}>{label}</Link>)}
      </div>
      <div className="language-switcher" role="group" aria-label={dictionary.ui.languageSelector}>
        {LOCALES.map(locale => <a
          key={locale}
          href={pathFor(locale)}
          hrefLang={LOCALE_CONFIG[locale].hreflang}
          lang={LOCALE_CONFIG[locale].htmlLang}
          aria-current={locale === lang ? 'page' : undefined}
          title={dictionary.ui.languages[locale]}
          onClick={preserveHash}
        >{locale.toUpperCase()}</a>)}
      </div>
    </nav>
  </header>;
}
