# Biblioteca / Reflexiones

Las publicaciones viven en `content/biblioteca/` como archivos Markdown versionados. No requieren CMS ni cambios en React.

## Añadir una publicación

Crear un archivo `.md` con `slug`, `title`, `language` (`es`, `va`, `en`, `fr` o `it`), una categoría autorizada (`Filosofia`, `Historia`, `Simbolismo`, `Arte`, `Sociedad` o `Masoneria`), `date` ISO, `excerpt` y `status` (`published` o `draft`). `author` es opcional. El cuerpo admite Markdown sencillo; el renderizador escapa el texto y no permite HTML arbitrario.

Los borradores no se incluyen en listados, rutas ni sitemap.

## Añadir una traducción

Crear otro archivo con su idioma y slug propio, repitiendo el valor de `translationGroup` del original. Solo se crearán alternates `hreflang` entre publicaciones publicadas que compartan ese grupo; una ausencia de traducción se muestra como estado vacío.
