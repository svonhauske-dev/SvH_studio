# svh.studio

Sitio de SvH Studio — Sofía von Hauske. Sitios web a la medida para
restaurantes, cafés y bares en la Ciudad de México.

HTML, CSS y JavaScript planos. Sin build, sin dependencias.

## Estructura

    index.html      El sitio completo: frontispicio + índice.
    404.html        La misma retícula, una entrada que no existe.
    fonts.css       Tipografía autoalojada + respaldos con métricas medidas.
    fonts/          64 KB de woff2, subconjunto latino. Sin terceros.
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

- [ ] **Dominio.** Apuntar `svh.studio` al proyecto en Vercel.
- [ ] **Madrizza.** Cambiar "En construcción" por su fila abierta al salir:
      duplicar el bloque `button.row` + `div.panel` de Jabalí y poner el
      color de la marca en `--lugar` de los dos.
- [ ] **WhatsApp.** Fuera del sitio a propósito: no se publica un número
      personal. Cuando haya una línea aparte con WhatsApp Business, entra
      como una fila más del grupo *Escríbeme*.

## Accesibilidad y rendimiento — verificado, no supuesto

Medido en el navegador con emulación de dispositivo real (375 / 768 / 1024 /
1440 / 1920), no estimado:

- Todo el texto pasa WCAG AA. `--svh-dim` está en `.62` porque es el mínimo
  con holgura sobre el papel (5.21:1); a `.54` daba 4.02:1 y reprobaba.
- El panel cerrado lleva `inert`: sus enlaces no se alcanzan con Tab.
- Blancos táctiles de 44px. Anillo de foco invertido sobre el color del lugar.
- Las imágenes llevan dimensiones intrínsecas y los respaldos tipográficos
  llevan `size-adjust` medido, así que no hay salto de maquetación.
- `svh` en vez de `vh` para que la foto no salte con la barra del navegador.
- Cero peticiones a terceros. Cero errores de consola. Cero desbordamiento
  horizontal en ningún ancho.

## Fotografía

Las imágenes de Jabalí las entregó la clienta y hay permiso de uso.
No usar `finca-1.jpg` ni `finca-coyametla.jpg` del repo de Jabalí: son el
mismo archivo y traen quemada una marca de agua de terceros.
