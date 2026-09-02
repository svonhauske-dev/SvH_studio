/* El único movimiento del sitio: el capítulo que se abre.

   Sin JavaScript los paneles quedan abiertos en el HTML, así que el
   contenido siempre es alcanzable. El script les pone [hidden] al cargar. */
(function () {
  var suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var capitulos = [];

  /* Espera a que termine un scroll suave. scrollend es lo correcto; el
     temporizador es el respaldo para navegadores que aún no lo tienen. */
  function alTerminarElScroll(fn) {
    var hecho = false;
    function una() { if (hecho) return; hecho = true; removeEventListener('scrollend', una); fn(); }
    addEventListener('scrollend', una, { once: true });
    setTimeout(una, 900);
  }

  document.querySelectorAll('button.row[aria-controls]').forEach(function (fila) {
    var panel = document.getElementById(fila.getAttribute('aria-controls'));
    if (!panel) return;

    var etiqueta = fila.querySelector('.v'),
        cierre   = panel.querySelector('[data-cierra]'),
        cap      = { fila: fila, panel: panel, abierta: false };
    capitulos.push(cap);

    /* La portada pesa y va en lazy. Si empieza a cargar hasta el clic, el
       panel se abre vacío y la imagen entra de golpe a media animación.
       Se adelanta la carga al primer roce del cursor o del foco. */
    var adelantada = false;
    function adelantar() {
      if (adelantada) return;
      adelantada = true;
      panel.querySelectorAll('img[loading="lazy"]').forEach(function (img) { img.loading = 'eager'; });
    }
    fila.addEventListener('pointerenter', adelantar);
    fila.addEventListener('focus', adelantar);

    function estado(abierta) {
      cap.abierta = abierta;
      fila.setAttribute('aria-expanded', String(abierta));
      panel.hidden = !abierta;
      /* Cerrado, el panel sigue en el DOM. Sin inert sus enlaces se
         alcanzaban con Tab y el foco desaparecía de la pantalla. */
      panel.inert = !abierta;
      if (etiqueta) etiqueta.firstChild.nodeValue = abierta ? 'Cerrar' : 'Ver';
    }
    cap.estado = estado;
    estado(false);

    fila.addEventListener('click', function () {
      if (cap.abierta) { cerrar(cap); return; }
      adelantar();

      var otros = capitulos.filter(function (o) { return o !== cap && o.abierta; });

      /* Se abre primero. El panel va DEBAJO de su fila, así que abrirlo no
         mueve la fila: el destino del scroll queda fijo desde el cuadro uno. */
      estado(true);

      /* El otro capítulo se cierra HASTA EL FINAL, no al principio. Cerrarlo
         antes quita dos mil píxeles por encima de esta fila y la avienta de
         golpe — ése era el brinco. Y compensar ahí no siempre alcanza,
         porque puede no haber scroll suficiente arriba para corregir.
         Cerrándolo cuando la fila ya está pegada al borde superior, la
         corrección siempre cabe y no se ve. */
      function cerrarLosOtros() {
        if (!otros.length) return;
        var antes = fila.getBoundingClientRect().top;
        otros.forEach(function (o) { o.estado(false); });
        var despues = fila.getBoundingClientRect().top;
        if (despues !== antes) scrollBy(0, despues - antes);
      }

      if (!suave) { fila.scrollIntoView({ block: 'start' }); cerrarLosOtros(); return; }
      fila.scrollIntoView({ block: 'start', behavior: 'smooth' });
      alTerminarElScroll(cerrarLosOtros);
    });

    function cerrar(c) {
      c.estado(false);
      /* Al cerrar desaparece todo lo de abajo y el scroll se acomoda solo.
         Aquí el corte seco es lo correcto: cerrar debe sentirse firme. */
      c.fila.scrollIntoView({ block: 'start' });
      c.fila.focus();
    }

    if (cierre) cierre.addEventListener('click', function () { cerrar(cap); });
  });
})();
