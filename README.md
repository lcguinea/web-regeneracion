# Regeneración Nº 132

Primera versión funcional del sitio oficial de la R.·.L.·.S.·. Regeneración Nº 132.

## Arquitectura

Next.js con App Router y TypeScript, preparado para desplegar en Vercel sin servicios obligatorios. El contenido vive separado de los componentes en `content/`; `es.json` es la base y `ca.json`, `en.json`, `fr.json` e `it.json` quedan preparados para futuras traducciones.

## Arranque local

```bash
npm install
npm run dev
```

No se envían formularios ni correos reales. El formulario muestra una confirmación simulada. No se han implementado Actualidad, Actividades ni Área privada. La historia y biblioteca quedan señalizadas como contenido pendiente cuando corresponde.
