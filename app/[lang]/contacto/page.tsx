import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata, getDictionary, isLocale, LOCALES } from '../../lib/i18n';
import ContactForm from './ContactForm';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  if (!isLocale(params.lang)) notFound();
  return buildMetadata(params.lang, 'contact');
}

export default function ContactPage({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const data = getDictionary(params.lang);
  return <main className="page"><div className="wrap">
    <div className="kicker">{data.contact.label}</div>
    <h1>{data.contact.title}</h1>
    <p className="intro">{data.contact.body}</p>
    <ContactForm lang={params.lang} content={data.contact.form}/>
  </div></main>;
}
