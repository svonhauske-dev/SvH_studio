/* El único movimiento del sitio: la fila que se abre.
   Sin JS la fila queda cerrada y el sitio sigue siendo legible y completo,
   así que el panel arranca oculto en el HTML y aquí sólo se alterna. */
document.querySelectorAll('button.row[aria-controls]').forEach(function (fila) {
  var panel = document.getElementById(fila.getAttribute('aria-controls'));
  if (!panel) return;

  var etiqueta = fila.querySelector('.v');

  fila.addEventListener('click', function () {
    var abierta = fila.getAttribute('aria-expanded') === 'true';
    fila.setAttribute('aria-expanded', String(!abierta));
    panel.hidden = abierta;
    if (etiqueta) etiqueta.textContent = abierta ? 'Ver' : 'Cerrar';

    if (abierta) {
      fila.scrollIntoView({ block: 'nearest' });
    }
  });
});
