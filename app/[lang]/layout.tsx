import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '../Header';
import { getDictionary, isLocale, LOCALES, LOCALE_CONFIG } from '../lib/i18n';
import '../globals.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export default function LocaleLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const dictionary = getDictionary(params.lang);
  return <html lang={LOCALE_CONFIG[params.lang].htmlLang}>
    <body>
      <Header lang={params.lang} dictionary={dictionary}/>
      {children}
      <footer className="footer">
        <div className="wrap">
          <div className="brand">
            <Image src="/Logo_Regeneracion_132.png" alt={dictionary.media.logoAlt} width={46} height={46}/>
            <span>{dictionary.site.footerName}</span>
          </div>
          <small>{dictionary.footer.location}<br/>{dictionary.footer.disclaimer}</small>
        </div>
      </footer>
    </body>
  </html>;
}
