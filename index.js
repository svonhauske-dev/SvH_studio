/* El único movimiento del sitio: el capítulo que se abre.

   Sin JavaScript los paneles quedan abiertos en el HTML, así que el
   contenido siempre es alcanzable. El script los cierra al cargar. */
(function () {
  var suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var capitulos = [];

  document.querySelectorAll('button.row[aria-controls]').forEach(function (fila) {
    var panel = document.getElementById(fila.getAttribute('aria-controls'));
    if (!panel) return;

    var etiqueta = fila.querySelector('.v'),
        cierre   = panel.querySelector('[data-cierra]'),
        cap      = { fila: fila, panel: panel, etiqueta: etiqueta, abierta: false };
    capitulos.push(cap);

    /* La portada pesa y va en lazy. Si empieza a cargar hasta el clic, el
       panel se abre vacío y la imagen aparece de golpe a media animación.
       Se adelanta la carga en cuanto el cursor o el foco tocan la fila. */
    var adelantada = false;
    function adelantar() {
      if (adelantada) return;
      adelantada = true;
      panel.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
        img.loading = 'eager';
      });
    }
    fila.addEventListener('pointerenter', adelantar);
    fila.addEventListener('focus', adelantar);

    function estado(abierta) {
      cap.abierta = abierta;
      fila.setAttribute('aria-expanded', String(abierta));
      panel.dataset.open = String(abierta);
      /* Cerrado el panel sigue en el DOM con alto 0. Sin inert, sus enlaces
         se podían alcanzar con Tab: el foco desaparecía de la pantalla. */
      panel.inert = !abierta;
      if (etiqueta) etiqueta.firstChild.nodeValue = abierta ? 'Cerrar' : 'Ver';
    }
    cap.estado = estado;
    estado(false);

    fila.addEventListener('click', function () {
      if (cap.abierta) { cerrar(cap); return; }
      adelantar();
      /* Un capítulo a la vez: dos abiertos rompen la lectura del índice. */
      capitulos.forEach(function (o) { if (o !== cap && o.abierta) o.estado(false); });
      /* Primero se acomoda el scroll, luego se abre. Animar el alto y hacer
         scroll suave al mismo tiempo es lo que se veía roto: el destino del
         scroll se movía mientras el panel crecía. */
      scrollTo({ top: fila.getBoundingClientRect().top + scrollY - 16, behavior: 'auto' });
      requestAnimationFrame(function () { estado(true); });
    });

    function cerrar(c) {
      c.estado(false);
      c.fila.scrollIntoView({ block: 'nearest', behavior: suave ? 'smooth' : 'auto' });
      c.fila.focus();
    }

    if (cierre) cierre.addEventListener('click', function () { cerrar(cap); });
  });
})();
