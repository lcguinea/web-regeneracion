# Sistema visual de Regeneración Nº 132

Este documento registra el rediseño exclusivamente visual del sitio: el
estado de partida, el sistema de tokens aplicado y lo que queda por
comprobar en navegador. No describe cambios de contenido, rutas ni lógica,
porque no los hay.

## Limitación de la iteración anterior: sin auditoría en navegador

En la iteración anterior no fue posible renderizar el sitio en un navegador, así
que no existen capturas «antes» ni «después». No se ha inventado ninguna.
Se intentó por tres vías:

1. **Navegador MCP de Argos** (`argos_navegador`): solo accede a `localhost`
   y a la web, y rechaza `file://` («Access to "file:" protocol is blocked»).
   Para usarlo hace falta un servidor local.
2. **Servidor local** (`next dev` / `next start`): el lanzador durable de
   Argos lo rechazó con `capacidad_no_concedida`, porque `next` usa
   `servidor_local` y esa capacidad no está concedida en esta misión. No se
   ha levantado ningún servidor fuera de ese canal.
3. **Chrome headless por CLI** sobre copias del HTML prerenderizado de
   `.next/server/app` con rutas reescritas a `file://`: Chrome aborta con
   `Failed to create socket directory` / `Failed to create a ProcessSingleton`
   porque el sandbox no le deja crear el socket en el directorio temporal del
   sistema. Pasó lo mismo al lanzarlo desde el canal durable.

El diagnóstico que sigue se ha hecho leyendo el código (`app/globals.css`,
layouts y componentes) y calculando el contraste WCAG de cada pareja de
colores con la fórmula de luminancia relativa. El script de auditoría
preparado para cuando haya navegador (`estado/auditoria-visual/auditar.py`,
fuera de git) reescribe el HTML prerenderizado, simula el menú abierto, los
errores del formulario y el foco, y mide el desbordamiento horizontal y las
proporciones de las imágenes.

## Diagnóstico antes

Estado en `b2743c2`. Todo el estilo vive en `app/globals.css` (4 líneas
minificadas), importado desde `app/[lang]/layout.tsx`.

### Paleta real

| Variable | Hex | Uso |
| --- | --- | --- |
| `--ink` | `#17211f` | Texto, fondo del hero, del CTA de contacto y del footer. Es un verde-negro, no carbón ni azul. |
| `--muted` | `#66716c` | Texto secundario (prosa, cards, nav). |
| `--cream` | `#f4f1ea` | Bandas alternas y texto claro sobre oscuro. |
| `--paper` | `#fbfaf7` | Superficie principal. |
| `--gold` | `#b48a45` | Eyebrows, kickers, numerales, filetes de card, marcos de imagen **y fondo de todos los botones primarios**. |
| `--line` | `#d9d2c5` | Filetes y bordes de inputs. |
| sueltos | `#c8ccc5`, `#89928c`, `#eee7d9`, `#5b503f`, `#e8efe8`, `#65826a`, `#8a2c2c`, `#f5e6e6`, `#5c1e1e`, `white`, `rgba(251,250,247,.96)`, `rgba(180,138,69,.1)` | Colores ad hoc fuera de las variables. |

### Tipografía

- Se declaran `'Libre Baskerville'` (títulos) y `'DM Sans'` (cuerpo), pero
  **ninguna de las dos se carga**: no hay `next/font`, `<link>` ni `@import`.
  El navegador cae a la serif y la sans genéricas del sistema (Times y
  Helvetica en macOS), sin fallbacks intermedios.
- Los `h3` de cards y FAQ usan `Georgia` directamente, y el glifo del hero
  `Georgia` con `font` abreviado: tres familias serif distintas según el
  componente.
- No hay escala: tamaños sueltos con `clamp()` distintos en cada regla
  (`40–76px`, `32–58px`, `20–23px`, `19–21px`, `17–19px`, `16–17px`, `14px`,
  `13–14px`, `12px`, `11px`, `10–11px`, `9px`). Títulos en peso 700, que con
  Times resultan pesados. El cuerpo se queda en el valor por defecto
  (16 px) sin interlineado global.
- La navegación de escritorio va a `10–11px` y el selector de idioma a
  `9px`: por debajo de un tamaño cómodo de lectura.

### Componentes

- **Header**: sticky, 88 px, fondo `rgba(251,250,247,.96)` y borde inferior.
  Como el propio `<header>` lleva la clase `.wrap` (máx. 1160 px), el fondo
  y el filete solo cubren esa anchura: en pantallas anchas el contenido pasa
  visible por los laterales del header al hacer scroll. Logo a 46×46 con
  `object-fit: contain`, correcto.
- **Menú móvil**: `☰` sin tamaño mínimo de área táctil, sin borde ni estado
  de foco. El panel desplegado no tiene separación visual respecto del
  contenido salvo el filete.
- **Hero**: fondo `--ink` plano, `min-height: 610px`, titular en Libre
  Baskerville/Times 700 hasta 76 px, imagen enmarcada con borde dorado.
  Glifo `∴` de 360 px en Georgia al 10 % de opacidad en la esquina superior
  derecha (240 px en móvil, desplazado fuera del borde): se lee como
  ornamento esotérico más que como detalle discreto.
- **Botones**: fondo dorado `#b48a45` con texto blanco en 700. El secundario
  del hero es transparente con borde dorado. Sin radio, sin estado hover ni
  focus propios.
- **Cards**: filete dorado superior, numeral dorado `01/02/03`, `h3` en
  Georgia 700. Sin separación respecto al botón que las sigue en
  «¿Quieres conocernos?» (el botón queda pegado a la rejilla).
- **Biblioteca en portada**: el botón y la imagen se apilan sin margen entre
  ellos.
- **Filetes y divisores**: `--line` en hechos, FAQ y header; dorado en cards
  y marcos. Mezcla sin criterio de cuándo es dorado y cuándo neutro.
- **Notice**: fondo `#eee7d9`, filete dorado izquierdo, texto `#5b503f`.
- **Marcos de imagen**: borde dorado de 1 px, `object-fit: cover` con
  `object-position` por imagen. Sin tratamiento que unifique la temperatura
  de las cuatro fotografías.
- **Formulario**: labels de 12 px en 700, inputs con fondo blanco y borde
  `#d9d2c5`, errores en rojo `#8a2c2c`, éxito en verde `#e8efe8`. Los
  `<small>` legales no tienen estilo.
- **Página de contacto, Biblioteca y artículo**: las clases `page`,
  `library-page`, `back-link`, `category-filter`, `library-grid`,
  `library-card`, `text-link`, `empty-state`, `article-page`,
  `article-author`, `article-excerpt` y `article-body` **no tienen ninguna
  regla CSS**. El `h1` de esas páginas sale con el estilo por defecto del
  navegador, el filtro de categorías es una fila de enlaces sin separación y
  no hay margen superior entre el header y el contenido.
- **CTA de contacto y footer**: fondo `--ink`, texto `#c8ccc5`; el `small`
  del footer en `#89928c`.

### Estados interactivos

- No existe ningún estilo `:focus` ni `:focus-visible`. Solo queda el anillo
  por defecto del navegador, que sobre los fondos oscuros del hero, CTA y
  footer apenas se distingue.
- Solo hay `:hover` en los enlaces de navegación (pasan a dorado, 3,0:1).
  Botones, cards, enlaces de Biblioteca, selector de idioma e inputs no
  tienen hover.
- `html { scroll-behavior: smooth }` se aplica sin respetar
  `prefers-reduced-motion`.

### Contraste medido (WCAG 2.x)

| Pareja | Ratio | Resultado |
| --- | --- | --- |
| Texto blanco sobre botón dorado `#fff / #b48a45` | 3,15:1 | **Falla AA** (texto de 11–12 px) |
| Kicker dorado sobre `--paper` `#b48a45 / #fbfaf7` | 3,02:1 | **Falla AA** (11 px) |
| Kicker dorado sobre `--cream` `#b48a45 / #f4f1ea` | 2,79:1 | **Falla AA** |
| Hover de navegación dorado sobre `--paper` | 3,02:1 | **Falla AA** (10–11 px) |
| `--muted` sobre `--cream` `#66716c / #f4f1ea` | 4,49:1 | **Falla AA** por poco (prosa en bandas) |
| `--muted` sobre `--paper` `#66716c / #fbfaf7` | 4,86:1 | Pasa AA justo |
| Borde de input `#d9d2c5 / #fbfaf7` | 1,44:1 | **Falla 1.4.11** (mínimo 3:1 para el límite del control) |
| Eyebrow dorado sobre `--ink` | 5,23:1 | Pasa |
| Texto del hero `#c8ccc5 / #17211f` | 10,13:1 | Pasa |
| `small` del footer `#89928c / #17211f` | 5,15:1 | Pasa |
| Notice `#5b503f / #eee7d9` | 6,41:1 | Pasa |

### Problemas detectados

1. Foco visible ausente en enlaces, botones, inputs y `menu-toggle`.
2. Dorado usado como gran superficie (fondo de botón) con texto blanco que
   no llega a AA.
3. Kickers, eyebrows y hover de navegación en dorado sobre claro por debajo
   de 4,5:1.
4. `--muted` sobre `--cream` por debajo de AA.
5. Bordes de input por debajo de 3:1.
6. Fuentes declaradas pero nunca cargadas, sin fallbacks razonables, y tres
   serif distintas mezcladas.
7. Sin escala tipográfica ni de espaciado: una veintena de valores sueltos
   repetidos (`18px`, `20px`, `22px`, `23px`, `24px`, `30px`, `35px`, `36px`,
   `38px`, `42px`…).
8. Páginas de contacto, Biblioteca y artículo sin estilos propios.
9. Fondo del header limitado a 1160 px en pantallas anchas.
10. Glifo `∴` demasiado presente para el tono sobrio buscado.
11. Botones pegados a la rejilla o a la imagen en «¿Quieres conocernos?» y
    en la Biblioteca de portada.
12. `scroll-behavior: smooth` sin `prefers-reduced-motion`.
13. El verde-negro de `--ink` y el dorado cálido acercan el conjunto a la
    plantilla genérica «crema + serif + acento cálido», sin el azul tinta ni
    el carbón que pide la identidad institucional.

## Sistema visual aplicado

Todo el sistema está en `app/globals.css`. Se conservan todos los nombres de
clase que usa el marcado (comprobado: ninguna clase de `app/**/*.tsx` queda
sin regla y ninguna de las reglas anteriores desaparece). Los breakpoints
siguen siendo `800px` y `380px`, con el mismo comportamiento: menú
desplegable, rejillas a una columna, imágenes de `image-split` al final,
header de 78 px y botones a ancho completo en el más estrecho.

### Principios

- Piedra clara como superficie, carbón para leer, azul tinta para la
  autoridad (hero, CTA de contacto, botones) y oro envejecido solo como
  filete, numeral, eyebrow o marca de estado actual. El oro nunca es fondo.
- Un único gesto reconocible: el **marco doble** de las imágenes (filete de
  oro exterior y filete de piedra interior a 10 px, como un paspartú o una
  moldura de sillería), repetido con la misma lógica en el filete corto que
  precede a cada eyebrow/kicker. Todo lo demás es silencioso.
- Titulares en serif de peso regular, sin negrita: la gravedad viene del
  tamaño y del interlineado, no del peso.
- Radios casi nulos (2 px), sin sombras salvo el menú móvil desplegado, sin
  degradados decorativos. El único `linear-gradient` es un recurso técnico
  de dos colores planos para pintar el fondo y el filete del header a sangre
  completa.
- El glifo `∴` del hero se mantiene, más pequeño (288 px, 192 px en móvil) y
  al 5,5 % de opacidad, en la serif del sistema.

### Tokens

| Familia | Tokens | Propósito |
| --- | --- | --- |
| `--color-` | `stone` `#f3f2ed`, `stone-deep` `#e9e6de`, `paper` `#fbfaf7` | Superficie principal, bandas alternas, campos y avisos. |
| | `charcoal` `#1d1f22`, `charcoal-deep` `#1b1c1f`, `text` | Texto principal; fondo del footer. |
| | `ink` `#18202e`, `ink-raised` `#1f2a3d` | Azul tinta: hero, CTA de contacto, botones; su hover. |
| | `muted` `#4c5057` | Texto secundario (7,23:1 sobre piedra, 6,50:1 sobre banda, 7,76:1 sobre papel). |
| | `on-dark` `#f3f2ed`, `on-dark-muted` `#c9ccd2`, `on-dark-subtle` `#9a9ea6` | Texto sobre tinta y carbón. |
| | `gold` `#a88a5a` | Oro envejecido decorativo: filetes, marcos, marcadores de lista. Nunca texto. |
| | `gold-text` `#7a5c2e` | Oro para texto pequeño sobre claro (kickers, numerales): 5,51:1 sobre piedra, 4,96:1 sobre banda. |
| | `gold-on-dark` `#c3a877` | Oro sobre tinta/carbón (eyebrow, foco en oscuro): 7,15:1. |
| | `rule`, `rule-strong`, `rule-on-dark`, `rule-on-charcoal` | Filetes neutros, borde de campos (3,53:1 sobre el papel del campo, 3,28:1 sobre piedra), filetes sobre oscuro. |
| | `glyph`, `frame-inner`, `header`, `hover-on-dark` | Glifo del hero, filete interior de imágenes, fondo del header, hover sobre oscuro. |
| | `notice-text`, `error*`, `success*`, `focus` | Aviso, estados del formulario y color del anillo de foco (tinta en claro, oro en oscuro). |
| `--font-` | `serif`, `sans` | Se mantienen `Libre Baskerville` y `DM Sans` como primera opción (ver «Tipografía») con fallbacks de la misma naturaleza. |
| | `weight-regular/medium/semibold/bold` | Pesos permitidos. |
| `--text-` | `3xs` … `3xl`, `3xl-compact`, `nav`, `button`, `input`, `glyph*` | Escala: 9 · 10 · 12 · 14 · **17 (cuerpo)** · 17–19 · 20–23 · 24–32 · 32–56 · 40–76 px. `input` nunca baja de 16 px para evitar el zoom de iOS. |
| | `leading-tight/heading/snug/normal/relaxed/reading` | Interlineados 1,08 · 1,15 · 1,3 · 1,55 · 1,7 · 1,75. |
| | `tracking-display/label/ui`, `measure`, `measure-reading` | Tracking de titulares (−0,012 em), etiquetas (0,14 em) y UI (0,04 em); medida de línea 65/68 ch. |
| `--space-` | `1`…`9` (4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 px) | Escala base de márgenes y rellenos. |
| | `section`, `section-compact`, `page-top`, `grid`, `split`, `gutter*` | Ritmo vertical de secciones y páginas interiores; separación de rejillas. |
| | `header*`, `hero*`, `heading-max`, `form-max`, `target*`, `logo*`, `nav-*`, `switcher*`, `rule-mark`, `underline`, `textarea`, `frame-inset`, `action-min`, `focus-offset*` | Medidas de componente conservadas o nombradas (88/78 px de header, 610 px de hero, 46/40 px de logo, 48/44 px de área táctil…). |
| `--radius-` | `none`, `sm` (2 px) | Imágenes rectas; botones, campos y filtros casi rectos. |
| `--border-` | `hairline`, `strong`, `ink`, `on-charcoal`, `gold`, `gold-on-dark`, `accent`, `frame`, `frame-inner`, `status`, `status-width`, `focus-width` | Filetes neutros, borde de campos, filetes de oro, marco doble de imagen, borde de estado, grosor del foco. |
| `--shadow-` | `menu` | Separación del menú móvil desplegado respecto al contenido. |
| `--motion-` | `fast` | Única duración de transición (150 ms). Queda fuera de las siete familias pedidas porque no encaja en ninguna; se anula con `prefers-reduced-motion`. |

### Tipografía

No existía mecanismo de carga de fuentes: `Libre Baskerville` y `DM Sans`
estaban declaradas pero nunca se cargaban. Incorporar `next/font/google`
requeriría red durante `next build` y tocar el layout, así que se mantienen
las dos familias como primera opción (se usarán si están instaladas) y se
añaden fallbacks coherentes: Baskerville (macOS), Baskerville Old Face
(Windows), Iowan Old Style, Palatino y Georgia para la serif; Avenir Next,
Segoe UI y Helvetica Neue para la sans. Se eliminan las llamadas directas a
`Georgia`: todos los títulos usan `--font-serif`. Si se quiere garantizar la
misma tipografía en todos los equipos, el paso siguiente es autoalojar los
`.woff2` en `public/` con `@font-face` (no requiere red en el build).

### Cambios por componente

- **Header**: fondo piedra al 97 % y filete inferior a sangre completa en
  cualquier anchura (antes solo 1160 px). Enlaces con subrayado de oro al
  hover; métricas del nav (10–11 px, huecos) sin cambios para no arriesgar
  desbordamiento sin poder medirlo. Idioma activo en negrita con subrayado
  de oro.
- **Menú móvil**: botón de 44×44 px con borde, estado abierto marcado,
  panel con sombra y enlaces a 14 px en carbón (antes 10 px en gris).
- **Hero**: azul tinta plano, filete de oro tenue abajo, titular serif
  regular 40–76 px, texto a 17–19 px, relleno vertical para que en móvil no
  toque los bordes. Botón principal invertido (piedra sobre tinta, 14,58:1) y
  secundario de contorno.
- **Botones**: tinta con texto piedra (14,58:1), hover con borde de oro,
  48 px de alto mínimo, radio 2 px. Separación añadida cuando siguen a una
  rejilla, a la prosa o preceden a una imagen.
- **Cards, FAQ y hechos**: filete de oro en cards, numerales en serif con
  cifras antiguas, filetes neutros en listas con borde superior de cierre.
- **Notice**: fondo papel, filete de oro de 2 px, texto 9,82:1.
- **Imágenes**: marco doble, `object-fit: cover` y `object-position`
  originales, saturación al 88 % para unificar la temperatura de las cuatro
  fotografías. El logo sigue a 46/40 px con `object-fit: contain`.
- **Formulario**: labels 14 px, campos de 48 px con borde de 3,53:1,
  hover y foco visibles, error con borde y barra interior roja, éxito y error
  global con barra de estado, botón a ancho completo en móvil.
- **Contacto, Biblioteca y artículo**: estilos nuevos para clases que ya
  existían sin regla (relleno superior, `h1`, enlace de vuelta, filtro de
  categorías con el actual en tinta, rejilla de dos columnas, estado vacío,
  cuerpo de lectura en serif a 68 ch).
- **CTA de contacto y footer**: tinta y carbón respectivamente, filetes de
  oro tenue, texto secundario ≥ 6,34:1.
- **Estados**: `:focus-visible` con anillo de 2 px en enlaces, botones,
  campos, `menu-toggle` y elementos con `tabindex` (tinta en claro, oro en
  oscuro); `:hover` en navegación, botones, filtros, enlaces de Biblioteca y
  campos; `scroll-behavior` y transiciones desactivados con
  `prefers-reduced-motion: reduce`.

## Cambios no aplicados

Nada de lo siguiente se ha tocado porque exigiría cambiar marcado o
contenido; queda como propuesta:

- Las flechas `↗` y `→` de los botones y enlaces forman parte del texto en
  `app/[lang]/page.tsx` y en la Biblioteca; no se pueden quitar solo con CSS.
- El icono del menú es el carácter `☰`; sustituirlo por un icono dibujado
  exige cambiar el componente `Header`.
- Varios textos de la Biblioteca y del botón «Abrir la Biblioteca →» están
  escritos en español dentro de los componentes y no pasan por los
  diccionarios; es un asunto de i18n, no visual.
- La numeración `01/02/03` de las cards de «Masonería» está en el marcado;
  se ha mantenido y solo se ha refinado su presentación.
- El brief pide que el dorado tenga «mucha» importancia; la tarea pide
  usarlo con moderación. Se ha seguido la tarea: el oro está presente en
  todos los filetes y marcas, pero nunca como superficie.

## Pendiente de verificar en navegador

Ninguna de estas comprobaciones se ha podido hacer en esta iteración (ver
«Limitación de esta iteración»). Hay que revisarlas con un servidor local
(`npm run build && npm run start`) antes de dar el rediseño por cerrado:

| Página | Viewports | Qué mirar |
| --- | --- | --- |
| `/es` (home completa) | 1440, 1024, 820, 390, 360 px | Desbordamiento horizontal, hero contenido en móvil, legibilidad del titular, glifo `∴` discreto, marco doble de las cuatro imágenes sin deformación, ritmo entre secciones. |
| Navegación de escritorio | 801, 900, 1024, 1160, 1440 px | Que el nav (8 enlaces + selector) no desborde entre 801 y ~1100 px en los cinco idiomas; hover y foco con teclado. |
| Menú móvil | 390 y 360 px | Botón `☰` 44×44, panel desplegado con sombra, enlaces a 14 px, selector de idioma, foco con teclado, cierre al navegar. |
| `/es/contacto` | 1440 y 390 px | Labels, campos de 48 px, foco, errores de validación (enviar vacío), error de red, estado de éxito, botón deshabilitado mientras envía, sin zoom al enfocar en iOS. |
| `/es/biblioteca` | 1440 y 390 px | Enlace de vuelta, filtro de categorías (actual en tinta), estado vacío y, cuando haya publicaciones, rejilla y tarjetas. |
| Artículo de Biblioteca | 1440 y 390 px | Solo cuando exista un `.md` publicado en `content/biblioteca/`; hoy no hay ninguno. |
| `/es`, `/va`, `/en`, `/fr`, `/it` | 1440 y 390 px | Que las cinco portadas y sus `/contacto` rinden igual, con textos más largos (fr, it) sin cortes ni desbordes. |
| Contraste real | — | Repetir con una herramienta (axe, Lighthouse) los ratios calculados aquí sobre el render final. |

## Verificación de esta iteración

Iteración del 25-09-2026 sobre `b2743c2`. Evidencia fuera de git en
`estado/auditoria-visual/` y en el canal durable
`estado/esperas/c7c3e5cc248a4e11af012b96b5c789db/`.

### Qué se pudo ejecutar

| Comprobación | Resultado |
| --- | --- |
| `npm run build` (lanzador durable, `build-prod`) | Exit 0. Compila, pasa el chequeo de tipos y genera 19 páginas estáticas. |
| `npm run build` tras los últimos ajustes de CSS (`build-final`) | Exit 0. «Compiled successfully», «Generating static pages (19/19)». El CSS compilado de `.next/static/css/` contiene los tokens nuevos. |
| `python3 tests/test_i18n.py` (lanzador durable, `test-i18n`) | Exit 0, salida `OK i18n`. Es la única prueba de `tests/`; no se ha ejecutado ninguna suite completa. |
| Verificación estática del CSS | Ver más abajo y `estado/auditoria-visual/verificacion-estatica.txt`. |
| Contraste WCAG de los tokens | Calculado con `estado/auditoria-visual/contraste.py`; resultados en `estado/auditoria-visual/contraste-despues.txt`. |

### Qué no se pudo ejecutar

- **Servidor local.** El lanzador aceptó `npx next start -p 3132`, pero el
  proceso terminó con código 1:
  `Error: listen EPERM: operation not permitted 0.0.0.0:3132`.
  Se repitió una vez limitado a loopback (`npx next start -H 127.0.0.1 -p 3132`)
  y falló igual: `Error: listen EPERM: operation not permitted 127.0.0.1:3132`.
  El sandbox no deja abrir un puerto de escucha. No se buscaron otras vías
  fuera de los canales concedidos.
- **Auditoría en navegador (después).** Sin servidor, el navegador de Argos
  no tiene nada que cargar (`net::ERR_CONNECTION_REFUSED at http://localhost:3132/es`),
  y ya se sabía que rechaza `file://`. **No hay capturas del después.** No se
  midió overflow horizontal, no se abrió el menú móvil, no se envió el
  formulario vacío, no se recorrió el foco con teclado ni se comprobó el nav
  entre 801 y 1100 px. Todo eso sigue **sin verificar**.
- **Evidencia del antes.** No se creó el worktree de HEAD: compilarlo
  habría funcionado, pero servirlo choca con el mismo `EPERM`, así que no
  habría aportado capturas. La única evidencia del antes sigue siendo el
  diagnóstico por lectura de código de este documento y el intento fallido de
  la iteración anterior (`estado/auditoria-visual/antes/resultado.json`, que
  registra el error de Chrome headless).

### Comprobación de las cinco rutas idiomáticas

Sin navegador, solo se comprobó el resultado del build:

- `/es`, `/va`, `/en`, `/fr` e `/it` se prerenderizan como HTML en
  `.next/server/app/`, con `lang` `es`, `ca-ES-valencia`, `en`, `fr` e `it`,
  y contienen `header wrap`, `hero`, `contact-cta` y `footer`.
- Las cinco `/<idioma>/contacto` se prerenderizan.
- `/<idioma>/biblioteca` figura en la tabla de rutas del build, pero no genera
  HTML estático porque la página lee `searchParams` y se renderiza en cada
  petición. No depende de este cambio y no se ha visto en navegador.
- `tests/test_i18n.py` pasa.

El diff solo toca `app/globals.css`, así que el marcado, las rutas y los
diccionarios son idénticos a los de HEAD.

### Verificación estática

- Todas las clases usadas en `app/**/*.tsx` tienen regla en
  `app/globals.css`.
- Los 78 selectores de HEAD siguen presentes, sin cambios, entre los 145
  actuales.
- Fuera de `:root` no queda ningún color literal, ninguna `font-family` que
  no sea `var(--font-*)` y ningún `font-size` que no sea `var(--text-*)`.
  Quedan en píxeles literales solo los grosores de 1 px de filetes y
  subrayados, la altura de 1 px del filete de eyebrow/kicker y el píxel del
  degradado técnico del header.
- El oro nunca es fondo: ninguna declaración `background` usa un token
  `gold`.
- Logo: `.brand img` a 46×46 (40×40 por debajo de 380 px) con
  `object-fit: contain`. El PNG es cuadrado (1254×1254), así que no se
  deforma.
- `git diff --check`: limpio.

### Defectos corregidos en esta iteración

- Se convierten en tokens los valores sueltos que quedaban fuera de `:root`:
  `--border-ink` (borde del botón), `--border-on-charcoal` (filete del
  `small` del footer), `--space-focus-offset` y
  `--space-focus-offset-field` (desplazamiento del anillo de foco),
  `--border-status-width` (barra de error del campo y borde de estado) y
  `--space-action-min` (base flexible de los botones del hero en móvil).
- Se quita un `;` sobrante antes de `}` en `.form label`.
- Se corrigen las cifras de contraste de este documento con el cálculo
  real: `muted` 7,23:1 sobre piedra, `gold-text` 5,51:1 sobre piedra,
  botón 14,58:1, borde de campo 3,53:1 sobre papel (3,28:1 sobre piedra),
  aviso 9,82:1, `small` del footer 6,34:1.

No se ha corregido ningún defecto visual observado en render, porque no
hubo render.

### Riesgos pendientes

- Toda la tabla de «Pendiente de verificar en navegador» sigue abierta.
  Para cerrarla hace falta permitir la escucha en un puerto local
  (`sandbox.network.allowLocalBinding: true` en la configuración del
  sandbox, a decisión del usuario) y repetir la auditoría.
- El nav de escritorio conserva las métricas de HEAD, pero la serif de
  fallback cambia el ancho del bloque de marca; no se ha medido si desborda
  entre 801 y 1100 px en fr/it.
- `.hero h1` pasa a `max-width: 14ch` en móvil. Con `overflow-wrap:
  break-word` no debería desbordar, pero no se ha visto el corte de línea
  en fr/it.
- La tipografía depende de las fuentes instaladas en cada equipo (ver
  «Tipografía»).
