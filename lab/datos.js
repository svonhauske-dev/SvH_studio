/* Laboratorio de direcciones: los cinco proyectos como datos. */
window.P = [
  { k:'jabali', n:'Jabalí', c:'#4F0D00', ano:'2026', url:'https://www.jabali.mx',
    ctx:'Tres generaciones de café en la sierra de Zongolica. Una tienda que entrega cada pedido a WhatsApp, ya escrito.',
    hizo:['Tienda en línea','Pedidos por WhatsApp','Panel de inventario'] },
  { k:'madrizza', n:'Madrizza', c:'#2A5280', ano:'2026', url:'https://madrizza.vercel.app',
    ctx:'Una pizzería de barrio dentro de un mercado. Logotipo, color y una carta pensada para el teléfono.',
    hizo:['Logotipo','Carta digital','Pedidos por Uber Eats y Rappi'] },
  { k:'coyametla', n:'Finca Coyametla', c:'#57573C', ano:'2026', url:'https://finca-coyametla.vercel.app/es',
    ctx:'Una finca de 1830 que vende a tostadores de México y del extranjero. Dos idiomas, escritos para cada mercado.',
    hizo:['Bilingüe ES/EN','Historia de la finca','Galería'] },
  { k:'elalgo', n:'El Algo', c:'#27120D', ano:'2026', url:'https://www.elalgo.mx',
    ctx:'Un wine bar donde cada quien elige su botella y se sirve. El sitio lo explica antes de abrir, sobre la identidad de IS A JAR.',
    hizo:['Preapertura','Animación ligada al scroll','Cómo funciona, en tres pasos'] },
  { k:'celita', n:'Celita', c:'#7A5A3D', ano:'2026', url:'https://www.celita.mx',
    ctx:'Café y pan en la Condesa. Carta, horario y cómo llegar en una sola página, sobre la identidad de Acuña Studio.',
    hizo:['Carta digital','Tarjeta para WhatsApp','Animación SVG'] }
];
window.esc = function (k, w) { return '/images/sitios/' + k + '-esc-' + (w || 1600) + '.webp'; };
window.mov = function (k) { return '/images/sitios/' + k + '-mov-600.webp'; };
