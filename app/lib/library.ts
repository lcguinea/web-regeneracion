import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from './i18n';

export const CATEGORIES = ['Filosofia', 'Historia', 'Simbolismo', 'Arte', 'Sociedad', 'Masoneria'] as const;
export type Category = (typeof CATEGORIES)[number];
export type Publication = { slug: string; title: string; language: Locale; category: Category; date: string; author?: string; excerpt: string; body: string; status: 'published' | 'draft'; translationGroup?: string };

const CONTENT_DIR = path.join(process.cwd(), 'content', 'biblioteca');
const field = (value: string, key: string) => {
  const match = value.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '') || '';
};

function parseFile(file: string): Publication {
  const raw = fs.readFileSync(file, 'utf8');
  const [, frontmatter = '', body = ''] = raw.split(/^---\s*$/m);
  const category = field(frontmatter, 'category') as Category;
  const status = field(frontmatter, 'status') as Publication['status'];
  if (!CATEGORIES.includes(category) || !['published', 'draft'].includes(status)) throw new Error(`Frontmatter inválido en ${file}`);
  return { slug: field(frontmatter, 'slug'), title: field(frontmatter, 'title'), language: field(frontmatter, 'language') as Locale, category, date: field(frontmatter, 'date'), author: field(frontmatter, 'author') || undefined, excerpt: field(frontmatter, 'excerpt'), body: body.trim(), status, translationGroup: field(frontmatter, 'translationGroup') || undefined };
}

export function allPublications(): Publication[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md')).map(file => parseFile(path.join(CONTENT_DIR, file))).filter(item => item.status === 'published').sort((a, b) => b.date.localeCompare(a.date));
}
export function publicationsFor(locale: Locale, category?: string) { return allPublications().filter(item => item.language === locale && (!category || item.category === category)); }
export function findPublication(locale: Locale, slug: string) { return allPublications().find(item => item.language === locale && item.slug === slug); }
export function translationsOf(item: Publication) { return item.translationGroup ? allPublications().filter(other => other.translationGroup === item.translationGroup) : [item]; }

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
export function markdownToHtml(markdown: string) {
  return markdown.split(/\n\s*\n/).map(block => {
    const lines = block.split('\n');
    if (lines.every(line => /^[-*] /.test(line))) return `<ul>${lines.map(line => `<li>${escapeHtml(line.slice(2))}</li>`).join('')}</ul>`;
    if (lines.length === 1 && /^#{1,3} /.test(lines[0])) { const level = lines[0].match(/^#+/)![0].length; return `<h${level}>${escapeHtml(lines[0].slice(level + 1))}</h${level}>`; }
    return `<p>${lines.map(escapeHtml).join('<br />')}</p>`;
  }).join('\n');
}
