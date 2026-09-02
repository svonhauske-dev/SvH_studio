/* El único movimiento del sitio: la fila que se abre.

   Sin JavaScript el panel queda abierto en el HTML, así que el contenido
   siempre es alcanzable. El script lo cierra al cargar y a partir de ahí
   anima el alto con grid-template-rows, que recorta como telón. */
document.querySelectorAll('button.row[aria-controls]').forEach(function (fila) {
  var panel = document.getElementById(fila.getAttribute('aria-controls'));
  if (!panel) return;

  var etiqueta = fila.querySelector('.v');

  function estado(abierta) {
    fila.setAttribute('aria-expanded', String(abierta));
    panel.dataset.open = String(abierta);
    panel.setAttribute('aria-hidden', String(!abierta));
    if (etiqueta) etiqueta.textContent = abierta ? 'Cerrar' : 'Ver';
  }

  estado(false);

  fila.addEventListener('click', function () {
    var abierta = fila.getAttribute('aria-expanded') === 'true';
    estado(!abierta);
    if (abierta) fila.scrollIntoView({ block: 'nearest' });
  });
});
