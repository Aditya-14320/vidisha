/**
 * Dynamic XML Sitemap Generator for Vidisha City Directory
 * Builds valid Google XML sitemaps using active categories, SEO routes, and approved business listings.
 */

import { Business, Category } from '../types';
import { SITE_URL } from '../utils/schemaGenerator';
import { SEO_CATEGORY_PAGES } from '../data/seoCategoryData';

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const SitemapService = {
  /**
   * Generates a complete array of valid sitemap URL entries
   */
  generateUrlList(businesses: Business[] = [], categories: Category[] = []): SitemapUrlEntry[] {
    const today = new Date().toISOString().split('T')[0];
    const urls: SitemapUrlEntry[] = [];

    // 1. Core Homepage
    urls.push({
      loc: `${SITE_URL}/`,
      lastmod: today,
      changefreq: 'daily',
      priority: 1.0,
    });

    // 2. High-Intent Category SEO Landing Pages
    Object.values(SEO_CATEGORY_PAGES).forEach((cat) => {
      urls.push({
        loc: `${SITE_URL}${cat.path}`,
        lastmod: today,
        changefreq: 'daily',
        priority: 0.9,
      });
    });

    // 3. Category Directory & Individual Categories
    urls.push({
      loc: `${SITE_URL}/categories`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    });

    categories.forEach((cat) => {
      if (cat.slug) {
        urls.push({
          loc: `${SITE_URL}/category/${cat.slug}`,
          lastmod: today,
          changefreq: 'weekly',
          priority: 0.8,
        });
      }
    });

    // 4. Special Discovery & Transactional Pages
    urls.push({
      loc: `${SITE_URL}/offers`,
      lastmod: today,
      changefreq: 'daily',
      priority: 0.8,
    });

    urls.push({
      loc: `${SITE_URL}/list-your-business`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
    });

    urls.push({
      loc: `${SITE_URL}/pricing`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
    });

    urls.push({
      loc: `${SITE_URL}/advertise`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.7,
    });

    // 5. Approved Business Profiles
    // Exclude unapproved, pending, rejected, or admin entries
    const seenBusinessSlugs = new Set<string>();
    businesses
      .filter((b) => b && b.approvalStatus === 'approved')
      .forEach((b) => {
        const slug = (b.slug || b.id || '').trim();
        if (slug && !seenBusinessSlugs.has(slug)) {
          seenBusinessSlugs.add(slug);
          urls.push({
            loc: `${SITE_URL}/business/${slug}`,
            lastmod: b.updatedAt ? b.updatedAt.split('T')[0] : today,
            changefreq: 'weekly',
            priority: 0.8,
          });
        }
      });

    // 6. Policy & Information Pages
    urls.push({
      loc: `${SITE_URL}/contact`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.4,
    });

    urls.push({
      loc: `${SITE_URL}/listing-policy`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.4,
    });

    urls.push({
      loc: `${SITE_URL}/privacy`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.3,
    });

    urls.push({
      loc: `${SITE_URL}/terms`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.3,
    });

    return urls;
  },

  /**
   * Generates standard XML string from URL list
   */
  generateSitemapXml(businesses: Business[] = [], categories: Category[] = []): string {
    const urls = this.generateUrlList(businesses, categories);

    const xmlLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
      '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
      '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    ];

    urls.forEach((u) => {
      xmlLines.push('  <url>');
      xmlLines.push(`    <loc>${u.loc}</loc>`);
      if (u.lastmod) {
        xmlLines.push(`    <lastmod>${u.lastmod}</lastmod>`);
      }
      xmlLines.push(`    <changefreq>${u.changefreq}</changefreq>`);
      xmlLines.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
      xmlLines.push('  </url>');
    });

    xmlLines.push('</urlset>');
    return xmlLines.join('\n');
  },

  /**
   * Client-side download trigger for admin panel
   */
  downloadSitemapXml(businesses: Business[] = [], categories: Category[] = []): void {
    const xml = this.generateSitemapXml(businesses, categories);
    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
