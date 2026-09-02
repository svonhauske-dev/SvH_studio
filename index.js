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

    /* Cerrar es el mismo viaje al revés: primero se sube a la fila, y sólo
       al llegar se corre el telón en reversa. Así el desplome de cuatro mil
       píxeles vuelve a ocurrir fuera de pantalla, igual que al abrir. */
    function cerrar(c) {
      if (c.cerrando) return;
      c.cerrando = true;

      var margen = parseFloat(getComputedStyle(c.fila).scrollMarginTop) || 0;

      function replegar() {
        if (!suave) { rematar(); return; }
        c.panel.classList.add('cerrando');
        var telon = c.panel.querySelector('.open');
        if (!telon) { rematar(); return; }
        telon.addEventListener('animationend', rematar, { once: true });
        setTimeout(rematar, 700);            /* respaldo */
      }

      var rematado = false;
      function rematar() {
        if (rematado) return;
        rematado = true;
        c.panel.classList.remove('cerrando');
        c.estado(false);
        c.cerrando = false;
        c.fila.focus({ preventScroll: true });
      }

      var falta = c.fila.getBoundingClientRect().top - margen;
      if (!suave || Math.abs(falta) < 4) { scrollBy(0, falta); replegar(); return; }
      deslizarHasta(scrollY + falta, replegar);
    }

    if (cierre) cierre.addEventListener('click', function () { cerrar(cap); });
  });
})();

/* La dirección se copia al tocarla. Es el respaldo del mailto, que se cae
   sin ruido cuando el navegador no tiene con qué abrir el correo. */
(function () {
  var boton = document.querySelector('[data-copiar]');
  if (!boton) return;
  var original = boton.textContent, temporizador;

  function avisar(texto) {
    clearTimeout(temporizador);
    boton.textContent = texto;
    boton.dataset.hecho = '';
    temporizador = setTimeout(function () {
      boton.textContent = original;
      delete boton.dataset.hecho;
    }, 1800);
  }

  /* Si el navegador niega el portapapeles —pasa cuando la pestaña no tiene
     el foco— hay que decirlo y dejar el texto seleccionado. Antes el
     respaldo volvía a mostrar la dirección, que se ve idéntica al estado
     normal: el usuario no se enteraba de que había fallado. */
  function aMano() {
    try {
      var r = document.createRange();
      r.selectNodeContents(boton);
      var sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
    } catch (e) {}
    avisar('Cópiala a mano');
  }

  boton.addEventListener('click', function () {
    var texto = boton.getAttribute('data-copiar');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(function () { avisar('Copiado'); }, aMano);
      return;
    }
    /* Respaldo para navegadores sin portapapeles moderno. */
    var caja = document.createElement('textarea');
    caja.value = texto;
    caja.setAttribute('readonly', '');
    caja.style.cssText = 'position:fixed;top:-1000px';
    document.body.appendChild(caja);
    caja.select();
    try { document.execCommand('copy'); avisar('Copiado'); } catch (e) { aMano(); }
    document.body.removeChild(caja);
  });
})();
