# Formulario de contacto: arquitectura y despliegue

## Flujo
`app/contacto/page.tsx` (cliente) valida con `app/lib/contact.ts` y hace POST JSON a `/api/contact`
(`app/api/contact/route.ts`, Node runtime, solo servidor). El servidor revalida con las mismas reglas,
normaliza y envía un correo vía API REST de Resend (`fetch`, sin dependencias nuevas). Sin base de datos.

## Protecciones
Honeypot `website`, tiempo mínimo de rellenado (2 s), comprobación de Origin, límite de tamaño (16 KB),
límite por IP best-effort en memoria (5 / 10 min; por instancia, no global), escapado HTML, sin CAPTCHA.
Logs: solo códigos de estado, nunca datos personales. Si falta configuración: 503 sin enviar nada.

## Variables (Vercel > Settings > Environment Variables; ver `.env.example`)
- `RESEND_API_KEY`: clave API de Resend (solo servidor, sin prefijo `NEXT_PUBLIC_`).
- `CONTACT_TO_EMAIL`: correo del Secretario (destinatario).
- `CONTACT_FROM_EMAIL`: remitente de un dominio verificado en Resend.

## Pendientes que aporta el titular
Cuenta Resend (plan gratuito), dominio verificado (DNS SPF/DKIM), correo del Secretario y remitente.
Política de privacidad completa: falta identidad del responsable, base jurídica, plazo de conservación,
derechos y contacto de privacidad. El texto actual junto al botón es informativo y breve.
