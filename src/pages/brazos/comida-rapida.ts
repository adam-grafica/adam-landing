import type { RubroConfig } from './types';

export const comidaRapida: RubroConfig = {
  slug: 'comida-rapida',
  nombre: 'Comida Rápida',
  emoji: '🍔',
  tagline: 'Food & Delivery',
  descripcionCorta:
    'Restaurantes, food trucks, cafeterías, botillerías con comida. Atraemos clientes y movemos pedidos.',
  descripcionLarga:
    'Restaurantes de comida rápida, food trucks y locales con delivery que quieren verse como una cadena premium sin gastar agencia. Fotografía cinematográfica, posts para redes y diseño que convierte.',

  heroEyebrow: '🍔 Para locales de comida rápida',
  heroHeadline: [
    'Tu local se verá como un',
    'Burger King',
    'en 2 horas.',
  ],
  heroSubheadline:
    'Pack completo de branding visual para locales de comida: 10 posts, rediseño de logo, video reel, fotos de producto y carta menú. Desde $29.990.',

  painPoints: [
    'Pierdes 20-30% de cada venta en comisiones de Rappi, PedidosYa, Uber Eats.',
    'Tus fotos de comida se ven amateurs vs las cadenas.',
    'No tienes tiempo para publicar 5 posts por semana.',
    'Tu logo y carta parecen de los 90s.',
    'Dependes 100% de apps de delivery — sin canal directo.',
    'Gastas $750K/mes en una agencia o no tienes ninguna.',
  ],

  soluciones: [
    {
      emoji: '🎨',
      titulo: 'Rediseño de logo profesional',
      descripcion:
        'Logo moderno, listo para Instagram, Rappi, Google Maps, tarjeta, delantal. 3 opciones para elegir.',
    },
    {
      emoji: '📱',
      titulo: '10 posts para redes + 10 stories',
      descripcion:
        '5 posts por semana × 2 semanas. Contenido listo para que publiques sin esfuerzo. Diseño cinematográfico.',
    },
    {
      emoji: '🎬',
      titulo: 'Video Reel 30 segundos',
      descripcion:
        'Tu plato estrella en movimiento. Listo para Reels y TikTok. Genera hambre con toma cinematográfica.',
    },
    {
      emoji: '📸',
      titulo: '5 fotos de producto profesionales',
      descripcion:
        'De amateur a cinematográfico. Para Google Maps, menú digital, Rappi, PedidosYa, catálogo WhatsApp.',
    },
    {
      emoji: '📄',
      titulo: 'Rediseño de carta menú',
      descripcion:
        'Carta PDF profesional con tu logo, fotos y precios. Lista para imprimir o enviar por WhatsApp.',
    },
    {
      emoji: '⚡',
      titulo: 'Entrega en 2 horas',
      descripcion:
        'Desde que agendas, en 2 horas tienes todo el material en tu correo. Sin esperas, sin reuniones eternas.',
    },
  ],

  testimonios: [
    {
      nombre: 'Carlos Mendoza',
      cargo: 'Dueño de Sazón Peruano',
      quote:
        'Me triplicaron las ventas en 30 días. Las fotos del menú cambiaron todo — Rappi y los pedidos directos se multiplicaron.',
    },
    {
      nombre: 'Felipe Soto',
      cargo: 'Dueño de Burguer Garage',
      quote:
        'Pasé de fotos de celular a parecer Burger King. Los clientes me dicen "se ve profesional". Pedidos directos por WhatsApp se triplicaron.',
    },
    {
      nombre: 'Andrea Pérez',
      cargo: 'Food truck Las Brasas',
      quote:
        'Antes publicaba 1 vez por semana porque no tenía material. Ahora tengo 2 meses de contenido hecho. Mi Instagram explotó.',
    },
  ],

  ctaLabel: 'Quiero mi Pack Enganche',
  ctaWhatsapp: 'https://wa.me/569XXXXXXXX?text=Hola%20ADAM%20GR%C3%81FICA%2C%20quiero%20el%20Pack%20Enganche%20%2429.990',

  color: {
    primary: '#0066FF',
    accent: '#00D4FF',
  },

  stats: [
    { numero: '2 hrs', label: 'entrega' },
    { numero: '$29.990', label: 'precio único' },
    { numero: '20+', label: 'piezas visuales' },
    { numero: '24/7', label: 'soporte WhatsApp' },
  ],

  ofertaPrincipal: {
    titulo: 'Pack Enganche — Tu local se ve como agencia',
    precio: '$29.990',
    precioOriginal: '$149.990',
    tiempo: 'Entrega en 2 horas',
    incluye: [
      '🎨 Rediseño de logo (3 opciones)',
      '📱 10 posts + 10 stories',
      '🎬 1 video reel 30 segundos',
      '📸 5 fotos de producto',
      '📄 Rediseño de carta menú',
    ],
  },

  ejemplos: [
    {
      nombre: 'Hamburguesa',
      antes: '/assets/burger-antes.jpg',
      despues: '/assets/burger-despues.jpg',
    },
    {
      nombre: 'Papas Fritas',
      antes: '/assets/papas-antes.jpg',
      despues: '/assets/papas-despues.jpg',
    },
    {
      nombre: 'Sushi',
      antes: '/assets/sushi-antes.jpg',
      despues: '/assets/sushi-despues.jpg',
    },
  ],
};
