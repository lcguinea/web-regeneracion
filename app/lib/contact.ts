export const REASONS = ['Quiero conocer la Masonería', 'Soy masón y quiero visitar', 'Consulta general'] as const;
export type ContactInput = { reason: string; name: string; email: string; phone: string; city: string; message: string };
export type FieldErrors = Partial<Record<keyof ContactInput, string>>;
export const LIMITS = { name: 100, email: 254, phone: 30, city: 100, message: 2000 } as const;

const clean = (v: unknown, max: number, multiline = false) => {
  if (typeof v !== 'string') return '';
  // eslint-disable-next-line no-control-regex
  let s = v.normalize('NFC').replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, ' ');
  s = multiline ? s.replace(/\r\n?/g, '\n').trim() : s.replace(/\s+/g, ' ').trim();
  return s.length > max + 1 ? s.slice(0, max + 1) : s;
};

export function normalize(raw: Record<string, unknown>): ContactInput {
  return {
    reason: clean(raw.reason, 60),
    name: clean(raw.name, LIMITS.name),
    email: clean(raw.email, LIMITS.email).toLowerCase(),
    phone: clean(raw.phone, LIMITS.phone),
    city: clean(raw.city, LIMITS.city),
    message: clean(raw.message, LIMITS.message, true),
  };
}

export function validate(v: ContactInput): FieldErrors {
  const e: FieldErrors = {};
  if (!(REASONS as readonly string[]).includes(v.reason)) e.reason = 'Selecciona un motivo de contacto.';
  if (!v.name) e.name = 'Indica tu nombre.';
  else if (v.name.length > LIMITS.name) e.name = `Máximo ${LIMITS.name} caracteres.`;
  if (!v.email) e.email = 'Indica tu correo electrónico.';
  else if (v.email.length > LIMITS.email || !/^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/.test(v.email)) e.email = 'Introduce un correo electrónico válido.';
  if (!v.phone) e.phone = 'Indica tu teléfono.';
  else if (v.phone.length > LIMITS.phone || !/^\+?[0-9 ().-]{6,}$/.test(v.phone) || (v.phone.match(/\d/g) || []).length < 6) e.phone = 'Introduce un teléfono válido.';
  if (!v.city) e.city = 'Indica tu ciudad de residencia.';
  else if (v.city.length > LIMITS.city) e.city = `Máximo ${LIMITS.city} caracteres.`;
  if (v.message.length > LIMITS.message) e.message = `Máximo ${LIMITS.message} caracteres.`;
  return e;
}
