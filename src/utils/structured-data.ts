import { BUSINESS_INFO, SITE_URL } from './seo-config';

export function getTattooParlorSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    name: BUSINESS_INFO.name,
    image: `${SITE_URL}/images/og-default.jpg`,
    url: SITE_URL,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    priceRange: BUSINESS_INFO.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.locality,
      addressRegion: BUSINESS_INFO.address.region,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.geo.lat,
      longitude: BUSINESS_INFO.geo.lng,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '20:00',
    },
    sameAs: [
      BUSINESS_INFO.instagram,
      BUSINESS_INFO.tiktok,
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: BUSINESS_INFO.rating.value,
      reviewCount: BUSINESS_INFO.rating.count,
      bestRating: 5,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de tatuaje',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tatuaje personalizado',
            description: 'Diseno y tatuaje personalizado en cualquier estilo',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cover-up',
            description: 'Cobertura de tatuajes existentes',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Retoque',
            description: 'Retoques y mejoras de tatuajes',
          },
        },
      ],
    },
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BUSINESS_INFO.name,
    url: SITE_URL,
    description: 'Estudio de tatuaje profesional en Dos Hermanas, Sevilla.',
    inLanguage: 'es',
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getPersonSchema(artist: {
  name: string;
  specialties: string[];
  photo?: string;
  slug: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    jobTitle: 'Tatuador',
    worksFor: {
      '@type': 'TattooParlor',
      name: BUSINESS_INFO.name,
    },
    knowsAbout: artist.specialties,
    ...(artist.photo && { image: `${SITE_URL}${artist.photo}` }),
    url: `${SITE_URL}/artistas/${artist.slug}`,
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
