import { NextResponse } from 'next/server';
import { normalize, validate } from '../../lib/contact';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY = 16 * 1024;
const MIN_FILL_MS = 2000;
const hits = new Map<string, number[]>(); // best-effort por instancia
const WINDOW = 10 * 60 * 1000;
const MAX_HITS = 5;

const json = (body: object, status: number) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function limited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) hits.forEach((v, k) => { if (!v.some(t => now - t < WINDOW)) hits.delete(k); });
  return list.length > MAX_HITS;
}

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!key || !to || !from) {
    console.error('[contact] configuración de correo ausente');
    return json({ ok: false, error: 'El envío no está disponible en este momento. Inténtalo más tarde.' }, 503);
  }

  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return json({ ok: false, error: 'Solicitud no permitida.' }, 403);
  if (!(req.headers.get('content-type') || '').includes('application/json')) return json({ ok: false, error: 'Solicitud no válida.' }, 415);

  const text = await req.text();
  if (text.length > MAX_BODY) return json({ ok: false, error: 'Solicitud demasiado grande.' }, 413);
  let raw: Record<string, unknown>;
  try {
    const p = JSON.parse(text);
    if (!p || typeof p !== 'object' || Array.isArray(p)) throw new Error();
    raw = p;
  } catch {
    return json({ ok: false, error: 'Solicitud no válida.' }, 400);
  }

  // Honeypot y tiempo mínimo: respuesta de éxito simulada, sin enviar nada.
  const started = Number(raw.startedAt);
  if ((typeof raw.website === 'string' && raw.website !== '') || (Number.isFinite(started) && Date.now() - started < MIN_FILL_MS)) {
    return json({ ok: true }, 200);
  }

  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (limited(ip)) return json({ ok: false, error: 'Demasiados intentos. Inténtalo más tarde.' }, 429);

  const v = normalize(raw);
  const errors = validate(v);
  if (Object.keys(errors).length) return json({ ok: false, error: 'Revisa los campos marcados.', fields: errors }, 422);

  const html = `<h2>Nueva consulta desde la web</h2><p><b>Motivo:</b> ${esc(v.reason)}</p><p><b>Nombre:</b> ${esc(v.name)}</p><p><b>Correo:</b> ${esc(v.email)}</p><p><b>Teléfono:</b> ${esc(v.phone)}</p><p><b>Residencia:</b> ${esc(v.city)}</p><p><b>Mensaje:</b><br>${esc(v.message || '(sin mensaje)').replace(/\n/g, '<br>')}</p>`;
  const plain = `Motivo: ${v.reason}\nNombre: ${v.name}\nCorreo: ${v.email}\nTeléfono: ${v.phone}\nResidencia: ${v.city}\n\nMensaje:\n${v.message || '(sin mensaje)'}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: v.email, subject: `Consulta web: ${v.reason}`, html, text: plain }),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) {
      console.error('[contact] proveedor de correo respondió', r.status);
      return json({ ok: false, error: 'No se pudo enviar tu consulta. Inténtalo de nuevo más tarde.' }, 502);
    }
  } catch {
    console.error('[contact] fallo de red con proveedor de correo');
    return json({ ok: false, error: 'No se pudo enviar tu consulta. Inténtalo de nuevo más tarde.' }, 502);
  }
  return json({ ok: true }, 200);
}

export function GET() {
  return json({ ok: false, error: 'Método no permitido.' }, 405);
}
