import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildMetadata, getDictionary, isLocale, LOCALES, type Locale } from '../lib/i18n';
import { withBasePath } from '../lib/basePath';

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  if (!isLocale(params.lang)) notFound();
  return buildMetadata(params.lang, 'home');
}

const Section = ({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) => <section id={id} className={`section ${className}`}><div className="wrap">{children}</div></section>;

export default function Home({ params }: { params: { lang: string } }) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
  const data = getDictionary(lang);
  const p = data.pages;
  return <main>
    <section id="hero" className="hero"><div className="wrap hero-grid"><div><div className="eyebrow">{data.home.eyebrow}</div><h1>{data.home.title}</h1><p>{data.home.intro}</p><div className="actions"><Link className="button" href={`/${lang}#conocernos`}>{data.home.cta} ↗</Link><Link className="button alt" href={`/${lang}#la-logia`}>{data.home.secondary}</Link></div></div><div className="image-frame image-hero"><Image src={withBasePath("/images/hero-arquitectura-valenciana.png")} alt={data.media.heroAlt} fill sizes="(max-width: 380px) calc(100vw - 40px), (max-width: 800px) calc(100vw - 56px), 42vw" priority/></div></div></section>
    <Section id="la-logia"><div className="split"><div><div className="kicker">{p.regeneracion.label}</div><h2>{p.regeneracion.title}</h2></div><div><p className="prose">{p.regeneracion.body}</p><div className="facts">{p.regeneracion.facts.map(x => <div className="fact" key={x[0]}><b>{x[0]}</b><span>{x[1]}</span></div>)}</div></div></div></Section>
    <Section id="historia" className="band"><div className="split image-split"><div className="image-frame image-history"><Image src={withBasePath("/images/historia-piedra-luz.png")} alt={data.media.historyAlt} fill sizes="(max-width: 380px) calc(100vw - 40px), (max-width: 800px) calc(100vw - 56px), 42vw"/></div><div><div className="kicker">{p.historia.label}</div><h2>{p.historia.title}</h2><p className="prose">{p.historia.body}</p><div className="notice">{data.ui.pendingNotice}</div></div></div></Section>
    <Section id="masoneria"><div className="section-heading"><div className="kicker">{p.masoneria.label}</div><h2>{p.masoneria.title}</h2><p className="intro">{p.masoneria.body}</p></div><div className="grid3">{p.masoneria.items.map((x, i) => <article className="card" key={x[0]}><div className="num">0{i + 1}</div><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></Section>
    <Section id="trabajo" className="band"><div className="split image-split"><div><div className="kicker">{p.trabajo.label}</div><h2>{p.trabajo.title}</h2><p className="prose">{p.trabajo.body}</p></div><div className="image-frame image-work"><Image src={withBasePath("/images/trabajo-estudio-geometria.png")} alt={data.media.workAlt} fill sizes="(max-width: 380px) calc(100vw - 40px), (max-width: 800px) calc(100vw - 56px), 58vw"/></div></div></Section>
    <Section id="biblioteca"><div className="split"><div><div className="kicker">{p.biblioteca.label}</div><h2>{p.biblioteca.title}</h2></div><div><p className="prose">{p.biblioteca.body}</p><Link className="button" href={`/${lang}/biblioteca`}>Abrir la Biblioteca →</Link><div className="image-frame image-library"><Image src={withBasePath("/images/biblioteca-libros-estudio.png")} alt={data.media.libraryAlt} fill sizes="(max-width: 380px) calc(100vw - 40px), (max-width: 800px) calc(100vw - 56px), 58vw"/></div></div></div></Section>
    <Section id="conocernos" className="band"><div className="section-heading"><div className="kicker">{p.conocernos.label}</div><h2>{p.conocernos.title}</h2><p className="intro">{p.conocernos.body}</p></div><div className="grid3">{p.conocernos.items.map(x => <article className="card" key={x[0]}><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div><Link className="button" href={`/${lang}#contacto`}>{data.ui.writeToLodge} →</Link></Section>
    <Section id="faq"><div className="split"><div><div className="kicker">{p.faq.label}</div><h2>{p.faq.title}</h2><p className="prose">{p.faq.body}</p></div><div className="items">{p.faq.items.map(x => <article className="item" key={x[0]}><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></div></Section>
    <section id="contacto" className="contact-cta"><div className="wrap"><div className="kicker">{data.home.contact.label}</div><h2>{data.home.contact.title}</h2><p>{data.home.contact.body}</p><Link className="button" href={`/${lang}/contacto`}>{data.home.contact.button} →</Link></div></section>
  </main>;
}
