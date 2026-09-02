# svh.studio

Sitio de SvH Studio — Sofía von Hauske. Sitios web a la medida para
restaurantes, cafés y bares en la Ciudad de México.

HTML, CSS y JavaScript planos. Sin build, sin dependencias.

## Estructura

    index.html      El sitio completo: frontispicio + índice.
    tokens.css      Sistema de diseño. Color, tipo, espacio, movimiento.
    site.css        Estilos. Depende de tokens.css.
    index.js        El único movimiento del sitio: la fila que se abre.
    images/jabali/  Fotografía del lugar, en WebP y JPEG a tres anchos.

## La dirección: "Índice"

No hay portada, ni menú, ni botón de llamada a la acción. Un frontispicio
—una frase y una línea de crédito— y de ahí un índice tipográfico con
filetes. El precio va en la primera pantalla, no escondido al final.

**El estudio no tiene color de acento.** El único color del sitio es el del
lugar del cliente, que entra por la fila al abrirse (`--lugar`).

**La regla de imagen es de valor, no de matiz.** Cada lugar abre con una
imagen oscura a sangre; las claras viven dentro de la página, sin marco,
sin sombra y sin esquina redondeada.

## Para agregar un lugar

1. Deja las imágenes en `images/<lugar>/` en WebP y JPEG.
2. Duplica el bloque `button.row` + `div.panel` de Jabalí en `index.html`.
3. Pon el color de la marca del cliente en `style="--lugar:#XXXXXX"` en el
   `button.row` y en el `div.panel`. Todo lo de adentro lo hereda: el hover,
   la barra abierta, el fondo de la foto y la barra de cierre.
4. Enlaza los dos con `aria-controls` / `id`.

## Dos anchos, y sólo dos

La columna y la pantalla. Una fila cerrada pertenece al índice y mide la
columna. Al abrirse, el proyecto sale del índice: la barra se va a pantalla
completa y arrastra la fotografía con ella, mientras el texto de adentro
sigue colgando del eje del índice con `--edge`. El capítulo cierra con la
barra gemela, para que se vea dónde termina.

## Pendientes

- [ ] **Número de WhatsApp.** `index.html` trae `52XXXXXXXXXX` de relleno.
- [ ] **Correo.** Está `hola@svh.studio`; confirmar cuál se publica.
- [ ] **Derechos de la fotografía de la finca.** `finca-*` viene de
      `finca-2.jpg` del repo de Jabalí. En ese mismo repo, `finca-1.jpg` y
      `finca-coyametla.jpg` son el mismo archivo y traen quemada la marca de
      agua *© Copyright H. Fadanelli*. Confirmar por escrito que `finca-2`
      es de uso libre antes de difundir el sitio.
- [ ] **Madrizza.** Cambiar "En construcción" por su fila abierta al salir.
- [ ] **Dominio.** Apuntar `svh.studio` al proyecto en Vercel.
