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
  { label: 'General', value: 'general' },
  { label: 'Destacado', value: 'destacado' },
] as const;

const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: 'jdds97/neu-studio',
      }
    : { kind: 'local' },
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
    processSteps: collection({
      label: 'Pasos del proceso',
      slugField: 'title',
      path: 'src/content/process/*',
      schema: {
        title: fields.slug({ name: { label: 'Titulo del paso' } }),
        description: fields.text({ label: 'Descripcion del paso' }),
        order: fields.integer({ label: 'Orden (01, 02...)', defaultValue: 0 }),
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
        phone: fields.text({ label: 'Telefono (con formato)', defaultValue: '+34 695 149 305' }),
        phoneRaw: fields.text({ label: 'Telefono (sin espacios)', defaultValue: '+34695149305' }),
        whatsapp: fields.text({ label: 'WhatsApp (solo numeros)', defaultValue: '34695149305' }),
        whatsappMessage: fields.text({
          label: 'Mensaje predeterminado WhatsApp',
          defaultValue: 'Hola, me gustaria pedir informacion sobre un tatuaje',
        }),
        email: fields.text({ label: 'Email' }),
        schedule: fields.text({ label: 'Horario', multiline: true }),
        googleMapsUrl: fields.url({ label: 'Google Maps URL' }),
        googleMapsEmbed: fields.text({ label: 'Google Maps Embed URL', multiline: false }),
        googleRating: fields.text({ label: 'Nota Google', defaultValue: '5.0' }),
        googleReviewCount: fields.text({ label: 'Numero de resenias', defaultValue: '12' }),
        instagram: fields.url({ label: 'Instagram URL' }),
        instagramHandle: fields.text({ label: 'Instagram handle (ej: @neu.studio_)', defaultValue: '@neu.studio_' }),
        tiktok: fields.url({ label: 'TikTok URL' }),
        tiktokHandle: fields.text({ label: 'TikTok handle (ej: @neu.studio_)', defaultValue: '@neu.studio_' }),
        facebook: fields.url({ label: 'Facebook URL' }),
      },
    }),
    home: singleton({
      label: 'Pagina de inicio',
      path: 'src/content/home',
      schema: {
        // Hero
        heroTitle: fields.text({ label: 'Hero - Titulo (h1 oculto)', defaultValue: 'NEU STUDIO' }),
        heroSubtitle: fields.text({ label: 'Hero - Subtitulo', defaultValue: 'Estudio de tatuaje en Dos Hermanas, Sevilla' }),
        heroImage: fields.image({
          label: 'Hero - Logo/Imagen',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        heroCtaPrimary: fields.text({ label: 'Hero - Boton primario', defaultValue: 'Reservar cita' }),
        heroCtaPrimaryUrl: fields.text({ label: 'Hero - URL boton primario', defaultValue: '/contacto' }),
        heroCtaSecondary: fields.text({ label: 'Hero - Boton secundario', defaultValue: 'Ver galeria' }),
        heroCtaSecondaryUrl: fields.text({ label: 'Hero - URL boton secundario', defaultValue: '/galeria' }),
        // Marquee
        marqueeItems: fields.text({
          label: 'Marquee - Estilos (separados por coma)',
          defaultValue: 'Fineline, Realismo, Blackwork, Color, Composicion, Cover-up, Microrealismo, Freehand, Lettering, Geometrico, Neotradicional, Minimalista',
          multiline: true,
        }),
        // Services section
        servicesLabel: fields.text({ label: 'Servicios - Etiqueta', defaultValue: 'Servicios' }),
        servicesTitle: fields.text({ label: 'Servicios - Titulo', defaultValue: 'Nuestros servicios' }),
        servicesCta: fields.text({ label: 'Servicios - Boton CTA', defaultValue: 'Contactar' }),
        // Gallery section
        galleryLabel: fields.text({ label: 'Galeria - Etiqueta', defaultValue: 'Galeria' }),
        galleryTitle: fields.text({ label: 'Galeria - Titulo', defaultValue: 'Trabajos destacados' }),
        galleryLink: fields.text({ label: 'Galeria - Enlace ver mas', defaultValue: 'Ver toda la galeria' }),
        galleryCta: fields.text({ label: 'Galeria - Boton CTA', defaultValue: 'Contactar' }),
        // Artists section
        artistsLabel: fields.text({ label: 'Artistas - Etiqueta', defaultValue: 'Artistas' }),
        artistsTitle: fields.text({ label: 'Artistas - Titulo', defaultValue: 'Nuestro equipo' }),
        artistsLink: fields.text({ label: 'Artistas - Enlace ver mas', defaultValue: 'Ver todos' }),
        artistsCta: fields.text({ label: 'Artistas - Boton CTA', defaultValue: 'Contactar' }),
        // Process section
        processLabel: fields.text({ label: 'Proceso - Etiqueta', defaultValue: 'Proceso' }),
        processTitle: fields.text({ label: 'Proceso - Titulo', defaultValue: 'Como trabajamos' }),
        // Testimonials section
        testimonialsLabel: fields.text({ label: 'Testimonios - Etiqueta', defaultValue: 'Testimonios' }),
        testimonialsTitle: fields.text({ label: 'Testimonios - Titulo', defaultValue: 'Lo que dicen nuestros clientes' }),
        // FAQ section
        faqLabel: fields.text({ label: 'FAQ - Etiqueta', defaultValue: 'FAQ' }),
        faqTitle: fields.text({ label: 'FAQ - Titulo', defaultValue: 'Preguntas frecuentes' }),
        // CTA final
        ctaTitle: fields.text({ label: 'CTA - Titulo', defaultValue: 'Listo para tu proximo tatuaje?' }),
        ctaSubtitle: fields.text({ label: 'CTA - Subtitulo', defaultValue: 'Contactanos y da vida a tu idea con nuestros artistas' }),
        ctaButton: fields.text({ label: 'CTA - Boton', defaultValue: 'Contactar' }),
        ctaButtonUrl: fields.text({ label: 'CTA - URL boton', defaultValue: '/contacto' }),
      },
    }),
    galleryPage: singleton({
      label: 'Pagina de galeria',
      path: 'src/content/gallery-page',
      schema: {
        label: fields.text({ label: 'Etiqueta', defaultValue: 'Galeria' }),
        title: fields.text({ label: 'Titulo', defaultValue: 'Nuestros trabajos' }),
        description: fields.text({
          label: 'Descripcion',
          defaultValue: 'Explora los trabajos de nuestros artistas. Cada pieza es unica y personalizada.',
        }),
        emptyState: fields.text({ label: 'Texto sin contenido', defaultValue: 'Proximamente subiremos nuestros trabajos' }),
        loadMoreText: fields.text({ label: 'Boton cargar mas', defaultValue: 'Ver mas trabajos' }),
        filterStyles: fields.text({
          label: 'Estilos del filtro (separados por coma)',
          defaultValue: 'Todos, Fineline, Realismo, Color, Blackwork, Composicion, Freehand, Mascotas, Florales, Microrealismo, Curados',
          multiline: true,
        }),
      },
    }),
    artistsPage: singleton({
      label: 'Pagina de artistas',
      path: 'src/content/artists-page',
      schema: {
        label: fields.text({ label: 'Etiqueta', defaultValue: 'Artistas' }),
        title: fields.text({ label: 'Titulo', defaultValue: 'Nuestro equipo' }),
      },
    }),
    bookingPage: singleton({
      label: 'Pagina de reservas',
      path: 'src/content/booking-page',
      schema: {
        label: fields.text({ label: 'Etiqueta', defaultValue: 'Reservas' }),
        title: fields.text({ label: 'Titulo', defaultValue: 'Reservar cita' }),
        description: fields.text({
          label: 'Descripcion',
          defaultValue: 'Elige artista, tipo de sesion y horario. Las sesiones varian entre 2 y 8 horas segun el trabajo.',
        }),
        calcomUrl: fields.text({ label: 'URL Cal.com', defaultValue: 'neu-studio/tattoo' }),
      },
    }),
    contactPage: singleton({
      label: 'Pagina de contacto',
      path: 'src/content/contact-page',
      schema: {
        label: fields.text({ label: 'Etiqueta', defaultValue: 'Contacto' }),
        title: fields.text({ label: 'Titulo', defaultValue: 'Hablemos' }),
        // Form labels
        formNameLabel: fields.text({ label: 'Formulario - Campo nombre', defaultValue: 'Nombre *' }),
        formEmailLabel: fields.text({ label: 'Formulario - Campo email', defaultValue: 'Email *' }),
        formPhoneLabel: fields.text({ label: 'Formulario - Campo telefono', defaultValue: 'Telefono' }),
        formMessageLabel: fields.text({ label: 'Formulario - Campo mensaje', defaultValue: 'Mensaje *' }),
        formSubmitButton: fields.text({ label: 'Formulario - Boton enviar', defaultValue: 'Enviar mensaje' }),
        formSuccessMessage: fields.text({
          label: 'Formulario - Mensaje exito',
          defaultValue: 'Mensaje enviado. Te contactaremos pronto.',
        }),
        formErrorMessage: fields.text({
          label: 'Formulario - Mensaje error',
          defaultValue: 'Error al enviar. Intentalo de nuevo o contactanos por WhatsApp.',
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
