/* El único movimiento del sitio: el capítulo que se abre.

   Sin JavaScript el panel queda abierto en el HTML, así que el contenido
   siempre es alcanzable. El script lo cierra al cargar y a partir de ahí
   anima el alto con grid-template-rows, que recorta como telón. */
(function () {
  var suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('button.row[aria-controls]').forEach(function (fila) {
    var panel = document.getElementById(fila.getAttribute('aria-controls'));
    if (!panel) return;

    var etiqueta = fila.querySelector('.v'),
        flecha   = etiqueta && etiqueta.querySelector('.fl'),
        cierre   = panel.querySelector('[data-cierra]');

    function estado(abierta) {
      fila.setAttribute('aria-expanded', String(abierta));
      panel.dataset.open = String(abierta);
      /* Cerrado el panel sigue en el DOM con alto 0. Sin inert, sus enlaces
         se podían alcanzar con Tab: el foco desaparecía de la pantalla. */
      panel.inert = !abierta;
      if (etiqueta) {
        etiqueta.firstChild.nodeValue = abierta ? 'Cerrar' : 'Ver';
        if (flecha) flecha.textContent = '↓';
      }
    }

    estado(false);

    /* Al abrir, el capítulo viene hacia ti: la fila sube al borde superior
       para que la fotografía llene la pantalla sin que tengas que buscarla. */
    fila.addEventListener('click', function () {
      var abierta = fila.getAttribute('aria-expanded') === 'true';
      estado(!abierta);
      if (!abierta) {
        requestAnimationFrame(function () {
          var y = fila.getBoundingClientRect().top + scrollY - 16;
          scrollTo({ top: y, behavior: suave ? 'smooth' : 'auto' });
        });
      } else {
        fila.scrollIntoView({ block: 'nearest' });
      }
    });

    /* Salir del capítulo hacia el precio: cierra primero, para no dejar un
       proyecto abierto a la espalda del visitante. */
    var alPrecio = panel.querySelector('[data-cierra-y-va]');
    if (alPrecio) {
      alPrecio.addEventListener('click', function () { estado(false); });
    }

    /* La barra de cierre devuelve al índice, en el mismo lugar del que saliste. */
    if (cierre) {
      cierre.addEventListener('click', function () {
        estado(false);
        var y = fila.getBoundingClientRect().top + scrollY - 16;
        scrollTo({ top: y, behavior: suave ? 'smooth' : 'auto' });
        fila.focus();
      });
    }
  });
})();
