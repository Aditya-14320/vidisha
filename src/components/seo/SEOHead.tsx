import React, { useEffect } from 'react';
import { SITE_URL, buildBreadcrumbSchema } from '../../utils/schemaGenerator';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'business.business' | 'profile';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, any> | Array<Record<string, any>>;
  breadcrumbs?: BreadcrumbItem[];
  noIndex?: boolean;
}

const DEFAULT_TITLE = 'Vidisha City – Discover Local Businesses in Vidisha, Madhya Pradesh';
const DEFAULT_DESC =
  'Discover the best local businesses in Vidisha. Explore restaurants, hotels, doctors, coaching institutes, gyms and more with Vidisha City.';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

function setMetaTag(selector: string, attr: 'name' | 'property', attrValue: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLdScript(id: string, data: any) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function removeElement(selector: string) {
  const el = document.querySelector(selector);
  if (el) {
    el.remove();
  }
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_IMAGE,
  twitterCard = 'summary_large_image',
  structuredData,
  breadcrumbs,
  noIndex = false,
}) => {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // 2. Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Robots
    if (noIndex) {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag(
        'meta[name="robots"]',
        'name',
        'robots',
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );
    }

    // 4. Canonical URL
    const canonicalUrl = canonical
      ? canonical.startsWith('http')
        ? canonical
        : `${SITE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`
      : typeof window !== 'undefined'
      ? `${SITE_URL}${window.location.pathname}`
      : SITE_URL;
    setCanonical(canonicalUrl);

    // 5. Open Graph Meta Tags
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Vidisha City');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_IN');

    // 6. Twitter Card Meta Tags
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', twitterCard);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // 7. Google Search Console Verification
    const gscVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
    if (gscVerification && gscVerification !== '%VITE_GOOGLE_SITE_VERIFICATION%') {
      setMetaTag('meta[name="google-site-verification"]', 'name', 'google-site-verification', gscVerification);
    }

    // 8. Structured Data JSON-LD
    if (structuredData) {
      setJsonLdScript('seo-structured-data', structuredData);
    } else {
      removeElement('#seo-structured-data');
    }

    // 9. Breadcrumbs JSON-LD
    if (breadcrumbs && breadcrumbs.length > 0) {
      setJsonLdScript('seo-breadcrumbs', buildBreadcrumbSchema(breadcrumbs));
    } else {
      removeElement('#seo-breadcrumbs');
    }
  }, [title, description, canonical, ogType, ogImage, twitterCard, structuredData, breadcrumbs, noIndex]);

  return null;
};
