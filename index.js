/* La tira de Trabajo.

   El deslizamiento es nativo (scroll-snap): sin este script la tira se
   desliza igual con el pulgar y se lee todo el texto. El script agrega lo
   que el CSS no sabe: dónde está cada lámina respecto al centro, cuadro a
   cuadro. De ese número salen la escala, el celular que se corre, el pie
   de foto, los puntos y el color de la página, que se mezcla entre dos
   clientes mientras deslizas en vez de cambiar al llegar. */
(function () {
  var tira = document.querySelector('.tira');
  if (!tira) return;
  var laminas = [].slice.call(tira.querySelectorAll('.lamina')),
      cuerpo  = document.body,
      puntos  = [].slice.call(document.querySelectorAll('.punto')),
      flechas = [].slice.call(document.querySelectorAll('.flecha')),
      tema    = document.querySelector('meta[name="theme-color"]'),
      suave   = !matchMedia('(prefers-reduced-motion: reduce)').matches,
      actual  = 0, pedido = false;

  /* El color de cada lámina como RGB, para mezclar a mano: color-mix() en
     una propiedad registrada no se interpola igual en todos los motores. */
  var colores = laminas.map(function (l) {
    var hex = (l.style.getPropertyValue('--fondo') || l.style.getPropertyValue('--lugar')).trim();
    return [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16); });
  });
  function mezcla(a, b, t) {
    return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')';
  }

  function medir() {
    pedido = false;
    /* Las láminas se alinean al borde izquierdo de la columna, así que la
       posición es simplemente cuántas láminas se ha deslizado la tira. */
    var pos = Math.max(0, Math.min(laminas.length - 1, tira.scrollLeft / paso()));

    laminas.forEach(function (l, i) {
      var d = i - pos, ad = Math.min(1, Math.abs(d));
      l.style.setProperty('--d', d.toFixed(4));
      l.style.setProperty('--ad', ad.toFixed(4));
      if (puntos[i]) puntos[i].style.setProperty('--p', (1 - ad).toFixed(4));
    });

    var i0 = Math.floor(pos), i1 = Math.min(laminas.length - 1, i0 + 1);
    cuerpo.style.setProperty('--pagina', mezcla(colores[i0], colores[i1], pos - i0));
    marcar(Math.round(pos));
  }
  function pedir() { if (!pedido) { pedido = true; requestAnimationFrame(medir); } }

  /* Lo discreto —quién está al frente— cambia sólo al cruzar la mitad. */
  function marcar(i) {
    if (i === actual && laminas[i].classList.contains('activa')) return;
    actual = i;
    var l = laminas[i];
    laminas.forEach(function (o, j) { o.classList.toggle('activa', j === i); });
    puntos.forEach(function (p, j) {
      if (j === i) p.setAttribute('aria-current', 'true'); else p.removeAttribute('aria-current');
    });
    cuerpo.style.setProperty('--lugar', l.style.getPropertyValue('--lugar'));
    if (tema) tema.content = l.style.getPropertyValue('--fondo') || l.style.getPropertyValue('--lugar');
    flechas.forEach(function (f) {
      var a = i + Number(f.dataset.paso);
      f.disabled = a < 0 || a >= laminas.length;
    });
  }

  function paso() {
    return laminas.length > 1 ? laminas[1].offsetLeft - laminas[0].offsetLeft : 1;
  }
  function ir(i) {
    i = Math.max(0, Math.min(laminas.length - 1, i));
    tira.scrollTo({ left: laminas[i].offsetLeft - laminas[0].offsetLeft,
                    behavior: suave ? 'smooth' : 'auto' });
  }

  tira.addEventListener('scroll', pedir, { passive: true });
  addEventListener('resize', pedir);

  /* ARRASTRAR CON EL MOUSE. En el celular el pulgar ya lo hace; con mouse
     la tira no se movía más que con flechas. Se suelta el snap mientras se
     arrastra y, al soltar, la velocidad decide si avanza una lámina. */
  var arr = null, recienArrastro = false;
  tira.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    arr = { x: e.clientX, s: tira.scrollLeft, t: e.timeStamp, v: 0, lx: e.clientX, lt: e.timeStamp, movio: false };
  });
  addEventListener('pointermove', function (e) {
    if (!arr) return;
    var dx = e.clientX - arr.x;
    if (!arr.movio && Math.abs(dx) < 4) return;
    if (!arr.movio) { arr.movio = true; tira.classList.add('arrastre'); }
    tira.scrollLeft = arr.s - dx;
    var dt = e.timeStamp - arr.lt;
    if (dt > 0) arr.v = (e.clientX - arr.lx) / dt;
    arr.lx = e.clientX; arr.lt = e.timeStamp;
  });
  addEventListener('pointerup', function () {
    if (!arr) return;
    var a = arr; arr = null;
    if (!a.movio) return;
    recienArrastro = true;
    setTimeout(function () { recienArrastro = false; }, 50);
    var pos  = tira.scrollLeft / paso(),
        dest = Math.abs(a.v) > .35 ? (a.v < 0 ? Math.ceil(pos) : Math.floor(pos)) : Math.round(pos);
    tira.classList.remove('arrastre');
    ir(dest);
  });

  laminas.forEach(function (l, i) {
    /* Una vecina se toca para traerla al frente; no abre nada. */
    l.addEventListener('click', function (e) {
      if (recienArrastro) { e.preventDefault(); e.stopPropagation(); return; }
      if (i !== actual) { e.preventDefault(); ir(i); }
    }, true);
  });
  puntos.forEach(function (p) { p.addEventListener('click', function () { ir(Number(p.dataset.ir)); }); });
  flechas.forEach(function (f) {
    f.addEventListener('click', function () { ir(actual + Number(f.dataset.paso)); });
  });
  tira.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); ir(actual - 1); }
  });

  medir();
})();

/* El resto de la página sube al entrar en pantalla, una vez. */
(function () {
  var els = document.querySelectorAll('.revela');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('visto'); });
    return;
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  els.forEach(function (e) { io.observe(e); });
})();

/* La hora en la Ciudad de México, con los dos puntos latiendo. */
(function () {
  var el = document.querySelector('.hora');
  if (!el || !window.Intl) return;
  var fmt = new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false,
                                               timeZone: 'America/Mexico_City' });
  function poner() {
    var partes = fmt.formatToParts(new Date()),
        h = partes.find(function (p) { return p.type === 'hour'; }).value,
        m = partes.find(function (p) { return p.type === 'minute'; }).value;
    el.innerHTML = '· ' + h + '<span class="dos">:</span>' + m;
    el.classList.add('lista');
  }
  poner();
  setInterval(poner, 15000);
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
    avisar('Copiar a mano');
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
