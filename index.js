/* El único movimiento del sitio: el capítulo que se abre.

   Sin JavaScript los paneles quedan abiertos en el HTML, así que el
   contenido siempre es alcanzable. El script les pone [hidden] al cargar. */
(function () {
  var suave = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var capitulos = [];

  /* Scroll con curva propia.

     El scroll suave nativo de Chrome tiene una curva fija que no se puede
     editar: para distancias largas arranca a más de cien píxeles por cuadro
     y frena de golpe. Se lee como un tirón, no como un deslizamiento.

     Éste usa la misma salida cúbica que el resto del sitio y una duración
     proporcional a la distancia. Se cancela al primer toque o rueda del
     usuario: nunca hay que pelearse con la página. */
  function deslizarHasta(destino, listo) {
    var y0 = scrollY,
        dy = destino - y0,
        ms = Math.min(980, Math.max(520, Math.abs(dy) * 0.85)),
        t0 = performance.now(),
        vivo = true;

    function rendirse() { vivo = false; }
    addEventListener('wheel', rendirse, { once: true, passive: true });
    addEventListener('touchstart', rendirse, { once: true, passive: true });

    function limpiar() {
      removeEventListener('wheel', rendirse);
      removeEventListener('touchstart', rendirse);
    }

    (function paso(ahora) {
      if (!vivo) { limpiar(); listo(); return; }
      var t = Math.min(1, (ahora - t0) / ms),
          /* Entrada y salida cúbica: arranca desde cero y llega a cero. La
             salida sola partía a 94 px por cuadro, que se siente como
             tirón. La respuesta inmediata ya la da la fila al pintarse. */
          e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      scrollTo(0, y0 + dy * e);
      if (t < 1) requestAnimationFrame(paso);
      else { limpiar(); listo(); }
    })(t0);
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

      /* Respuesta inmediata: la fila toma el color del lugar en el mismo
         cuadro del toque, aunque el capítulo todavía no exista. Cuesta un
         píxel de alto y evita que el toque se sienta muerto. */
      fila.classList.add('armada');

      var otros = capitulos.filter(function (o) { return o !== cap && o.abierta; });
      var margen = parseFloat(getComputedStyle(fila).scrollMarginTop) || 0;

      /* Abrir un panel de cuatro mil píxeles desplaza de un tirón todo lo
         que está debajo. Correrlo a 60 fps no lo arregla: el salto es real.
         La única forma de que no se vea es que la fila ya esté pegada al
         borde superior cuando el capítulo aparece — así todo lo que se
         desplaza queda fuera de pantalla. Por eso el scroll va PRIMERO. */
      function abrirYa() {
        fila.classList.remove('armada');
        estado(true);
        if (!otros.length) return;
        var antes = fila.getBoundingClientRect().top;
        otros.forEach(function (o) { o.estado(false); });
        var despues = fila.getBoundingClientRect().top;
        if (despues !== antes) scrollBy(0, despues - antes);
      }

      var falta = fila.getBoundingClientRect().top - margen;
      if (!suave || Math.abs(falta) < 4) { scrollBy(0, falta); abrirYa(); return; }
      deslizarHasta(scrollY + falta, abrirYa);
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
