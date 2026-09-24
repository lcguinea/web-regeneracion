export const REASONS = ['conocer', 'visitar', 'general'] as const;
export type ContactReason = (typeof REASONS)[number];
export type ContactInput = { reason: string; name: string; email: string; phone: string; city: string; message: string };
export type ValidationError = { code: 'required' | 'invalid' | 'max'; max?: number };
export type FieldErrors = Partial<Record<keyof ContactInput, ValidationError>>;
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
  if (!(REASONS as readonly string[]).includes(v.reason)) e.reason = { code: 'invalid' };
  if (!v.name) e.name = { code: 'required' };
  else if (v.name.length > LIMITS.name) e.name = { code: 'max', max: LIMITS.name };
  if (!v.email) e.email = { code: 'required' };
  else if (v.email.length > LIMITS.email || !/^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/.test(v.email)) e.email = { code: 'invalid' };
  if (!v.phone) e.phone = { code: 'required' };
  else if (v.phone.length > LIMITS.phone || !/^\+?[0-9 ().-]{6,}$/.test(v.phone) || (v.phone.match(/\d/g) || []).length < 6) e.phone = { code: 'invalid' };
  if (!v.city) e.city = { code: 'required' };
  else if (v.city.length > LIMITS.city) e.city = { code: 'max', max: LIMITS.city };
  if (v.message.length > LIMITS.message) e.message = { code: 'max', max: LIMITS.message };
  return e;
}
