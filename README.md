# Regeneración Nº 132

Primera versión funcional del sitio oficial de la R.·.L.·.S.·. Regeneración Nº 132.

## Arquitectura

Next.js con App Router y TypeScript, preparado para desplegar en Vercel sin servicios obligatorios. El contenido vive separado de los componentes en `content/`; `es.json` es la fuente de verdad y `ca.json`, `en.json`, `fr.json` e `it.json` contienen las versiones completas en valenciano, inglés, francés e italiano. Las rutas públicas son `/es`, `/va`, `/en`, `/fr` e `/it`; consulta [`docs/i18n.md`](docs/i18n.md).

## Arranque local

```bash
npm install
npm run dev
```

El formulario intenta enviar por Resend desde el servidor cuando sus variables de entorno están configuradas; la configuración real de dominio y correo sigue pendiente. No se han implementado Actualidad, Actividades ni Área privada. La historia y biblioteca quedan señalizadas como contenido pendiente cuando corresponde.
