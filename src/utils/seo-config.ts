export const SITE_URL = 'https://neustudio.es';

export const SEO_METADATA = {
  keywords: 'estudio tatuaje, tatuajes dos hermanas, tatuaje sevilla, fineline, realismo, blackwork, tatuaje personalizado, neu studio, tattoo dos hermanas',
  author: 'Neu Studio',
  robots: 'index, follow',
  themeColor: '#2A2AEE',
} as const;

export const BUSINESS_INFO = {
  name: 'Neu Studio',
  legalName: 'Neu Studio',
  address: {
    street: 'Av. de España, 110L',
    postalCode: '41704',
    locality: 'Dos Hermanas',
    region: 'Sevilla',
    country: 'ES',
  },
  phone: '+34695149305',
  phoneDisplay: '+34 695 149 305',
  whatsapp: '34695149305',
  email: 'info@neustudio.es',
  schedule: {
    display: 'Lun-Sab 10:00-20:00',
    structured: ['Mo-Sa 10:00-20:00'],
  },
  geo: { lat: 37.2846, lng: -5.9232 },
  instagram: 'https://instagram.com/neu.studio_',
  tiktok: 'https://tiktok.com/@neu.studio_',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Neu+Studio+Av+de+España+110L+41704+Dos+Hermanas+Sevilla',
  googleMapsEmbed: 'https://www.google.com/maps?q=Av+de+España+110L+41704+Dos+Hermanas+Sevilla+Neu+Studio&output=embed&hl=es',
  priceRange: '$$',
  rating: {
    value: 5.0,
    count: 12,
  },
} as const;

export const PAGE_SEO = {
  home: {
    title: 'Estudio de Tatuaje en Dos Hermanas, Sevilla',
    description: 'Estudio de tatuaje profesional en Dos Hermanas, Sevilla. Fineline, realismo, color, blackwork y mas. Reserva tu cita online.',
  },
  artistas: {
    title: 'Nuestros Tatuadores | Artistas de Tatuaje en Sevilla',
    description: 'Artistas de tatuaje en Neu Studio, Dos Hermanas. Especialistas en fineline, realismo, composicion y mas estilos.',
  },
  galeria: {
    title: 'Galeria de Tatuajes | Trabajos de Neu Studio Sevilla',
    description: 'Galeria de tatuajes: fineline, realismo, blackwork, color y mas. Trabajos de Neu Studio en Dos Hermanas.',
  },
  contacto: {
    title: 'Contacto y Ubicacion | Neu Studio Dos Hermanas',
    description: 'Contacta con Neu Studio. Av. de Espana 110L, Dos Hermanas. WhatsApp: +34 695 149 305.',
  },
  reservar: {
    title: 'Reservar Cita de Tatuaje | Neu Studio Sevilla',
    description: 'Reserva tu cita de tatuaje online en Neu Studio. Consulta disponibilidad y elige tu artista.',
  },
  avisoLegal: {
    title: 'Aviso Legal',
    description: 'Aviso legal de Neu Studio, estudio de tatuaje en Dos Hermanas, Sevilla.',
    noindex: true,
  },
  privacidad: {
    title: 'Politica de Privacidad',
    description: 'Politica de privacidad de Neu Studio.',
    noindex: true,
  },
  cookies: {
    title: 'Politica de Cookies',
    description: 'Politica de cookies de Neu Studio.',
    noindex: true,
  },
} as const;
