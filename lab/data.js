/* Laboratorio: los cinco proyectos como datos, para probar patrones. */
window.PROYECTOS = [
  { k:'jabali', n:'Jabalí', c:'#4F0D00', tag:'Café de especialidad · Tienda con pedidos por WhatsApp · Panel',
    ctx:'La Hacienda El Jabalí lleva tres generaciones sembrando café en Zongolica, y sus pedidos siempre han pasado por WhatsApp.',
    hizo:['Marca: colores y tipografía','El pedido llega escrito a WhatsApp','Inventario y precios desde su panel'],
    url:'https://www.jabali.mx', dom:'jabali.mx' },
  { k:'madrizza', n:'Madrizza', c:'#2A5280', tag:'Pizzería de barrio · Logotipo, carta y pedidos',
    ctx:'Abrieron dentro de un mercado y todavía no tenían logotipo.',
    hizo:['Logotipo y color','Carta con precios, pensada para el celular','Pedido por Uber Eats y Rappi'],
    url:'https://madrizza.vercel.app', dom:'madrizza' },
  { k:'coyametla', n:'Finca Coyametla', c:'#57573C', tag:'Finca de café · Sitio en español e inglés',
    ctx:'Coyametla le vende grano a tostadores de México y de fuera.',
    hizo:['Español e inglés, escrito para cada uno','La historia de la finca, desde 1830','Galería de la finca'],
    url:'https://finca-coyametla.vercel.app/es', dom:'finca coyametla' },
  { k:'elalgo', n:'El Algo', c:'#27120D', tick:'#D33D24', tag:'Wine bar, antes de abrir · Sitio sobre la marca de IS A JAR',
    ctx:'Un bar donde eliges la botella y te sirves tú, que todavía no abre. El sitio va sobre la marca de IS A JAR.',
    hizo:['Cómo funciona, en tres pasos','Una copa que se llena mientras bajas','Listo para Google antes de abrir'],
    url:'https://www.elalgo.mx', dom:'elalgo.mx' },
  { k:'celita', n:'Celita', c:'#896545', tag:'Café y pan en la Condesa · Carta y cómo llegar',
    ctx:'Un café en Pachuca 13, en la Condesa, sobre la marca de Acuña Studio.',
    hizo:['La carta con precios, como la impresa','Cómo llegar en Google o Apple Maps','Se comparte por WhatsApp con su propia tarjeta'],
    url:'https://www.celita.mx', dom:'celita.mx' }
];

/* El color del lugar inunda la pantalla desde el toque, y luego navega. */
window.inundar = function (e, color, href) {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { location.href = href; return; }
  var x = e.clientX || innerWidth / 2, y = e.clientY || innerHeight / 2;
  var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  var d = document.createElement('div');
  d.style.cssText = 'position:fixed;z-index:99;border-radius:50%;pointer-events:none;background:' + color +
    ';left:' + (x - r) + 'px;top:' + (y - r) + 'px;width:' + 2 * r + 'px;height:' + 2 * r + 'px;transform:scale(0);transition:transform .5s cubic-bezier(.65,0,.35,1)';
  document.body.appendChild(d);
  requestAnimationFrame(function () { requestAnimationFrame(function () { d.style.transform = 'scale(1)'; }); });
  setTimeout(function () { location.href = href; }, 480);
};
window.pagina = function (k) { return '/lab/proyecto.html?p=' + k; };
/* Al volver con "atrás" la página sale del bfcache con la mancha puesta. */
addEventListener('pageshow', function (e) { if (e.persisted) document.querySelectorAll('body > div[style*="border-radius:50%"]').forEach(function (d) { d.remove(); }); });
