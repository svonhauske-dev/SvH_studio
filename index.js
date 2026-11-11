/* La tira de Trabajo.

   El deslizamiento es nativo (scroll-snap): sin este script la tira funciona
   igual con el pulgar y se ve todo el texto. Lo que agrega el script es lo
   que el CSS no sabe: cuál lámina está al frente, para que la página tome
   su color, el contador diga dónde vas y las flechas sepan a dónde ir. */
(function () {
  var tira = document.querySelector('.tira');
  if (!tira) return;
  var laminas = [].slice.call(tira.querySelectorAll('.lamina')),
      cuerpo  = document.body,
      cont    = document.querySelector('.trabajo .cont'),
      flechas = [].slice.call(document.querySelectorAll('.flecha')),
      tema    = document.querySelector('meta[name="theme-color"]'),
      suave   = !matchMedia('(prefers-reduced-motion: reduce)').matches,
      actual  = -1;

  function marcar(i) {
    if (i === actual) return;
    actual = i;
    var l = laminas[i], cs = l.style;
    /* Las vecinas esconden su texto con visibility, así que sus enlaces
       tampoco se alcanzan con Tab. No se usa inert: bloquearía el toque
       que las trae al frente. */
    laminas.forEach(function (o, j) { o.classList.toggle('activa', j === i); });
    cuerpo.style.setProperty('--lugar', cs.getPropertyValue('--lugar'));
    var fondo = cs.getPropertyValue('--fondo');
    if (fondo) cuerpo.style.setProperty('--fondo', fondo); else cuerpo.style.removeProperty('--fondo');
    if (tema) tema.content = fondo || cs.getPropertyValue('--lugar');
    if (cont) cont.textContent = (i + 1) + '/' + laminas.length;
    flechas.forEach(function (f) {
      var a = i + Number(f.dataset.paso);
      f.disabled = a < 0 || a >= laminas.length;
    });
  }

  function ir(i) {
    i = Math.max(0, Math.min(laminas.length - 1, i));
    var l = laminas[i];
    tira.scrollTo({ left: l.offsetLeft - (tira.clientWidth - l.offsetWidth) / 2,
                    behavior: suave ? 'smooth' : 'auto' });
  }

  /* La del frente es la que cruza la línea vertical del centro. */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) marcar(laminas.indexOf(e.target)); });
  }, { root: tira, rootMargin: '0px -49% 0px -49%' });
  laminas.forEach(function (l, i) {
    io.observe(l);
    /* Una vecina se toca para traerla al frente; no abre nada. */
    l.addEventListener('click', function (e) {
      if (i !== actual) { e.preventDefault(); ir(i); }
    });
  });

  /* Las flechas sólo aparecen con cursor: en el celular sobra el pulgar. */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches)
    flechas.forEach(function (f) { f.hidden = false; });
  flechas.forEach(function (f) {
    f.addEventListener('click', function () { ir(actual + Number(f.dataset.paso)); });
  });
  tira.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); ir(actual - 1); }
  });

  marcar(0);
  /* La transición de color se enciende hasta después de la primera pintura,
     que ya viene teñida desde el HTML. */
  requestAnimationFrame(function () { requestAnimationFrame(function () { cuerpo.classList.add('vivo'); }); });
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
