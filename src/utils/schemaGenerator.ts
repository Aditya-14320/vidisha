/**
 * Schema.org JSON-LD Structured Data Generator
 * Produces valid, Google-compliant structured data for LocalBusiness, WebSite, Breadcrumbs, etc.
 */

import { Business } from '../types';

export const SITE_URL = 'https://vidishacity.in';

/**
 * Maps category IDs or names to Schema.org LocalBusiness sub-types
 */
export function getSchemaTypeForCategory(categoryId?: string, categorySlug?: string): string {
  const cat = (categoryId || categorySlug || '').toLowerCase();
  
  if (cat.includes('restaurant') || cat.includes('cafe') || cat.includes('food') || cat.includes('bakery')) {
    return 'Restaurant';
  }
  if (cat.includes('hotel') || cat.includes('resort') || cat.includes('lodge')) {
    return 'LodgingBusiness';
  }
  if (cat.includes('doctor') || cat.includes('hospital') || cat.includes('clinic') || cat.includes('dentist')) {
    return 'MedicalBusiness';
  }
  if (cat.includes('salon') || cat.includes('beauty') || cat.includes('spa')) {
    return 'HealthAndBeautyBusiness';
  }
  if (cat.includes('gym') || cat.includes('fitness')) {
    return 'ExerciseGym';
  }
  if (cat.includes('school') || cat.includes('coaching') || cat.includes('education')) {
    return 'EducationalOrganization';
  }
  if (cat.includes('clothing') || cat.includes('fashion') || cat.includes('jewelry') || cat.includes('jewel') || cat.includes('store') || cat.includes('shop') || cat.includes('electronics')) {
    return 'Store';
  }
  if (cat.includes('repair') || cat.includes('service') || cat.includes('cleaning') || cat.includes('plumb')) {
    return 'HomeAndConstructionBusiness';
  }
  if (cat.includes('bank') || cat.includes('finance') || cat.includes('insurance')) {
    return 'FinancialService';
  }
  if (cat.includes('auto') || cat.includes('car') || cat.includes('bike')) {
    return 'AutomotiveBusiness';
  }

  return 'LocalBusiness';
}

/**
 * Builds Schema.org LocalBusiness JSON-LD
 */
export function buildLocalBusinessSchema(business: Business): Record<string, any> {
  const schemaType = getSchemaTypeForCategory(business.categoryId, business.categorySlug);
  const businessUrl = `${SITE_URL}/business/${business.slug || business.id}`;
  
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    '@id': `${businessUrl}#business`,
    name: business.name,
    description: business.description,
    url: businessUrl,
    telephone: business.phone || business.whatsapp || undefined,
    image: business.coverImageUrl || business.gallery?.[0] || `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address,
      addressLocality: business.locality || 'Vidisha',
      addressRegion: 'Madhya Pradesh',
      postalCode: '464001',
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: 'Vidisha',
      containedInPlace: {
        '@type': 'State',
        name: 'Madhya Pradesh',
      },
    },
  };

  if (business.coordinates?.lat && business.coordinates?.lng) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.coordinates.lat,
      longitude: business.coordinates.lng,
    };
  }

  if (business.priceRange) {
    schema.priceRange = business.priceRange;
  }

  if (business.rating && business.reviewCount && business.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating,
      reviewCount: business.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (business.openingHours && typeof business.openingHours === 'string') {
    schema.openingHours = business.openingHours;
  }

  if (business.websiteUrl) {
    schema.sameAs = [business.websiteUrl];
  }

  return schema;
}

/**
 * Builds Schema.org BreadcrumbList JSON-LD
 */
export function buildBreadcrumbSchema(items: Array<{ name: string; url: string }>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Builds Schema.org ItemList JSON-LD for category listing pages
 */
export function buildItemListSchema(
  listName: string,
  items: Array<{ name: string; url: string }>
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Builds Schema.org FAQPage JSON-LD
 */
export function buildFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
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

/**
 * Builds Schema.org WebSite & Organization structured data
 */
export function buildWebSiteSchema(): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: 'Vidisha City',
        description: 'Discover the best local businesses in Vidisha. Explore restaurants, hotels, doctors, coaching institutes, gyms and more with Vidisha City.',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
        inLanguage: 'en-IN',
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Vidisha City',
        url: `${SITE_URL}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
        },
        areaServed: {
          '@type': 'City',
          name: 'Vidisha',
          containedInPlace: {
            '@type': 'State',
            name: 'Madhya Pradesh',
          },
        },
      },
    ],
  };
}
