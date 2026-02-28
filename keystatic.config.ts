import { config, fields, collection, singleton } from '@keystatic/core';

const STYLES = [
  { label: 'Fineline', value: 'fineline' },
  { label: 'Realismo', value: 'realismo' },
  { label: 'Color', value: 'color' },
  { label: 'Blackwork', value: 'blackwork' },
  { label: 'Composicion', value: 'composicion' },
  { label: 'Freehand', value: 'freehand' },
  { label: 'Mascotas', value: 'mascotas' },
  { label: 'Florales', value: 'florales' },
  { label: 'Microrealismo', value: 'microrealismo' },
  { label: 'Curados', value: 'curados' },
] as const;

export default config({
  storage: { kind: 'local' },
  collections: {
    artists: collection({
      label: 'Artistas',
      slugField: 'name',
      path: 'src/content/artists/*',
      format: { contentField: 'bio' },
      schema: {
        name: fields.slug({ name: { label: 'Nombre artistico' } }),
        photo: fields.image({
          label: 'Foto retrato',
          directory: 'public/images/artists',
          publicPath: '/images/artists/',
        }),
        bio: fields.markdoc({ label: 'Bio' }),
        specialties: fields.multiselect({
          label: 'Especialidades',
          options: [...STYLES],
        }),
        instagram: fields.url({ label: 'Instagram' }),
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
      },
    }),
    gallery: collection({
      label: 'Galeria',
      slugField: 'title',
      path: 'src/content/gallery/*',
      schema: {
        title: fields.slug({ name: { label: 'Titulo' } }),
        image: fields.image({
          label: 'Imagen',
          directory: 'public/images/gallery',
          publicPath: '/images/gallery/',
        }),
        artist: fields.relationship({
          label: 'Artista',
          collection: 'artists',
        }),
        style: fields.select({
          label: 'Estilo',
          options: [...STYLES],
          defaultValue: 'fineline',
        }),
        featured: fields.checkbox({
          label: 'Destacada en home',
          defaultValue: false,
        }),
      },
    }),
    services: collection({
      label: 'Servicios',
      slugField: 'name',
      path: 'src/content/services/*',
      format: { contentField: 'description' },
      schema: {
        name: fields.slug({ name: { label: 'Nombre del servicio' } }),
        description: fields.markdoc({ label: 'Descripcion' }),
        price: fields.text({ label: 'Precio orientativo', defaultValue: 'Consultar' }),
        duration: fields.text({ label: 'Duracion aproximada' }),
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
      },
    }),
    testimonials: collection({
      label: 'Testimonios',
      slugField: 'clientName',
      path: 'src/content/testimonials/*',
      schema: {
        clientName: fields.slug({ name: { label: 'Nombre del cliente' } }),
        text: fields.text({ label: 'Texto de la resenia', multiline: true }),
        stars: fields.integer({ label: 'Estrellas', defaultValue: 5, validation: { min: 1, max: 5 } }),
        source: fields.select({
          label: 'Fuente',
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Instagram', value: 'instagram' },
          ],
          defaultValue: 'google',
        }),
      },
    }),
    faq: collection({
      label: 'Preguntas Frecuentes',
      slugField: 'question',
      path: 'src/content/faq/*',
      format: { contentField: 'answer' },
      schema: {
        question: fields.slug({ name: { label: 'Pregunta' } }),
        answer: fields.markdoc({ label: 'Respuesta' }),
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: 'Configuracion del sitio',
      path: 'src/content/site',
      schema: {
        studioName: fields.text({ label: 'Nombre del estudio', defaultValue: 'Neu Studio' }),
        address: fields.text({ label: 'Direccion' }),
        phone: fields.text({ label: 'Telefono' }),
        whatsapp: fields.text({ label: 'WhatsApp' }),
        email: fields.text({ label: 'Email' }),
        schedule: fields.text({ label: 'Horario', multiline: true }),
        googleMapsUrl: fields.url({ label: 'Google Maps URL' }),
        googleRating: fields.text({ label: 'Nota Google', defaultValue: '5.0' }),
        googleReviewCount: fields.text({ label: 'Numero de resenias', defaultValue: '0' }),
        instagram: fields.url({ label: 'Instagram' }),
        tiktok: fields.url({ label: 'TikTok' }),
        facebook: fields.url({ label: 'Facebook' }),
      },
    }),
    home: singleton({
      label: 'Pagina de inicio',
      path: 'src/content/home',
      schema: {
        heroTitle: fields.text({ label: 'Titulo hero', defaultValue: 'NEU STUDIO' }),
        heroSubtitle: fields.text({ label: 'Subtitulo hero', defaultValue: 'Estudio de tatuaje en Dos Hermanas' }),
        heroImage: fields.image({
          label: 'Imagen hero',
          directory: 'public/images',
          publicPath: '/images/',
        }),
      },
    }),
    legal: singleton({
      label: 'Paginas legales',
      path: 'src/content/legal',
      schema: {
        avisoLegal: fields.markdoc({ label: 'Aviso legal' }),
        privacidad: fields.markdoc({ label: 'Politica de privacidad' }),
        cookies: fields.markdoc({ label: 'Politica de cookies' }),
      },
    }),
  },
});
