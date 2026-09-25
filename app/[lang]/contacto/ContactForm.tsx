'use client';

import { FormEvent, useRef, useState } from 'react';
import { normalize, validate, LIMITS, type FieldErrors, type ValidationError } from '../../lib/contact';
import type { Dictionary, Locale } from '../../lib/i18n';

type FormContent = Dictionary['contact']['form'];
type ApiError = keyof FormContent['errors'];

export default function ContactForm({ lang, content }: { lang: Locale; content: FormContent }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');
  const busy = useRef(false);
  const started = useRef(Date.now());
  const alertRef = useRef<HTMLDivElement>(null);

  const focusFirst = (form: HTMLFormElement, fieldErrors: FieldErrors) => {
    const key = Object.keys(fieldErrors)[0];
    if (key) (form.elements.namedItem(key) as HTMLElement | null)?.focus();
    else alertRef.current?.focus();
  };

  const errorText = (field: keyof FieldErrors, error: ValidationError) => {
    const messages = content.validation[field] as Partial<Record<ValidationError['code'], string>>;
    const template = messages[error.code] || content.validation.generic;
    return template.replace('{max}', String(error.max ?? ''));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
    const fieldErrors = validate(normalize(raw));
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) {
      setStatus('error');
      setMessage(content.reviewFields);
      setTimeout(() => focusFirst(form, fieldErrors), 0);
      return;
    }
    if (process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true') {
      setStatus('error');
      setMessage(content.errors.unavailable);
      setTimeout(() => alertRef.current?.focus(), 0);
      return;
    }
    busy.current = true;
    setStatus('sending');
    setMessage('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...raw, locale: lang, startedAt: started.current }),
      });
      const json = await response.json().catch(() => ({}));
      if (response.ok && json.ok) {
        setStatus('sent');
        return;
      }
      const apiFields: FieldErrors = json.fields || {};
      setErrors(apiFields);
      setStatus('error');
      const code = typeof json.error === 'string' && json.error in content.errors ? json.error as ApiError : 'sendFailed';
      setMessage(content.errors[code]);
      setTimeout(() => focusFirst(form, apiFields), 0);
    } catch {
      setStatus('error');
      setMessage(content.errors.connection);
      setTimeout(() => alertRef.current?.focus(), 0);
    } finally {
      busy.current = false;
    }
  }

  const fieldError = (key: keyof FieldErrors) => errors[key] ? <span id={`${key}-err`} className="field-error">{errorText(key, errors[key]!)}</span> : null;
  const accessibility = (key: keyof FieldErrors) => ({ 'aria-invalid': errors[key] ? true : undefined, 'aria-describedby': errors[key] ? `${key}-err` : undefined });

  if (status === 'sent') return <div className="success" role="status" tabIndex={-1} ref={element => element?.focus()}>{content.success}</div>;

  return <form className="form" onSubmit={submit} noValidate aria-busy={status === 'sending'}>
    {status === 'error' && message && <div className="form-error" role="alert" tabIndex={-1} ref={alertRef}>{message}</div>}
    <label>{content.labels.reason}<select required name="reason" defaultValue="" {...accessibility('reason')}>
      <option value="">{content.reasonPlaceholder}</option>
      <option value="conocer">{content.reasons.conocer}</option>
      <option value="visitar">{content.reasons.visitar}</option>
      <option value="general">{content.reasons.general}</option>
    </select>{fieldError('reason')}</label>
    <label>{content.labels.name}<input required name="name" autoComplete="name" maxLength={LIMITS.name} {...accessibility('name')}/>{fieldError('name')}</label>
    <label>{content.labels.email}<input required type="email" name="email" autoComplete="email" maxLength={LIMITS.email} {...accessibility('email')}/>{fieldError('email')}</label>
    <label>{content.labels.phone}<input required type="tel" name="phone" autoComplete="tel" maxLength={LIMITS.phone} {...accessibility('phone')}/>{fieldError('phone')}</label>
    <label>{content.labels.city}<input required name="city" autoComplete="address-level2" maxLength={LIMITS.city} {...accessibility('city')}/>{fieldError('city')}</label>
    <label>{content.labels.message}<textarea name="message" maxLength={LIMITS.message} {...accessibility('message')}/>{fieldError('message')}</label>
    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}><label>{content.honeypot}<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <button className="button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? content.sending : content.submit}</button>
    <small>{content.legal.data}</small>
    <small>{content.legal.processing}</small>
  </form>;
}
