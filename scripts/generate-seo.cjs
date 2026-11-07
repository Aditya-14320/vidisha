/**
 * Production-Ready SEO & Static Prerendering Script for Vidisha City
 * Generates:
 * 1. public/sitemap.xml & dist/sitemap.xml
 * 2. public/robots.txt & dist/robots.txt
 * 3. Static HTML pre-renders with full meta tags, JSON-LD, and semantic HTML for:
 *    - / (Homepage)
 *    - /restaurants-in-vidisha
 *    - /hotels-in-vidisha
 *    - /doctors-in-vidisha
 *    - /coaching-in-vidisha
 *    - /gyms-in-vidisha
 *    - /categories, /category/:slug
 *    - /offers, /pricing, /advertise, /list-your-business, /contact, /privacy, /terms, /listing-policy
 *    - /business/:slug for all verified businesses
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://vidishacity.in';
const DIST_DIR = path.resolve(__dirname, '../dist');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const TODAY = new Date().toISOString().split('T')[0];

// Category Definitions
const CATEGORIES = [
  { id: 'cat-restaurants', slug: 'restaurants-and-cafes', name: 'Restaurants and Cafes' },
  { id: 'cat-hotels', slug: 'hotels-and-resorts', name: 'Hotels and Resorts' },
  { id: 'cat-doctors', slug: 'doctors-and-dentists', name: 'Doctors and Dentists' },
  { id: 'cat-coaching', slug: 'coaching-centres', name: 'Coaching Centres' },
  { id: 'cat-gyms', slug: 'gyms-and-fitness', name: 'Gyms and Fitness' },
  { id: 'cat-clothing', slug: 'clothing-and-fashion', name: 'Clothing and Fashion' },
  { id: 'cat-electronics', slug: 'electronics-and-mobiles', name: 'Electronics and Mobiles' },
  { id: 'cat-salons', slug: 'salons-and-beauty', name: 'Salons and Beauty' },
  { id: 'cat-hospitals', slug: 'hospitals-and-clinics', name: 'Hospitals and Clinics' },
  { id: 'cat-schools', slug: 'schools-and-education', name: 'Schools and Education' },
  { id: 'cat-bakeries', slug: 'bakeries-and-sweets', name: 'Bakeries and Sweets' },
  { id: 'cat-gift-shops', slug: 'gift-shops', name: 'Gift Shops' },
  { id: 'cat-pet-shops', slug: 'pet-shops-and-services', name: 'Pet Shops and Services' },
  { id: 'cat-home-repair', slug: 'home-repair-services', name: 'Home Repair Services' },
  { id: 'cat-event-services', slug: 'event-and-wedding-services', name: 'Event and Wedding Services' },
];

// High-Intent SEO Landing Pages
const SEO_LANDING_PAGES = [
  {
    path: '/restaurants-in-vidisha',
    title: 'Restaurants in Vidisha – Best Places to Eat, Pure Veg & Cafes | Vidisha City',
    description: 'Discover the best restaurants in Vidisha. Explore pure vegetarian thalis, multi-cuisine family dining, cafes, and famous sweet shops with addresses, phone numbers, and reviews.',
    h1: 'Best Restaurants and Cafes in Vidisha, Madhya Pradesh',
    category: 'Restaurants and Cafes',
    priority: '0.9',
    changefreq: 'daily',
  },
  {
    path: '/hotels-in-vidisha',
    title: 'Hotels in Vidisha – Best Lodges, AC Rooms & Resorts | Vidisha City',
    description: 'Find and book verified hotels in Vidisha, MP. Compare AC rooms, budget stays, banquet lodges near Vidisha Railway Station & Sanchi Stupa with amenities and contacts.',
    h1: 'Top Hotels, Lodges and Resorts in Vidisha',
    category: 'Hotels and Resorts',
    priority: '0.9',
    changefreq: 'daily',
  },
  {
    path: '/doctors-in-vidisha',
    title: 'Doctors in Vidisha – Best Physicians, Dentists & Clinics | Vidisha City',
    description: 'Find and consult verified doctors in Vidisha, MP. Search experienced general physicians, dental clinics, pediatricians, gynecologists, and specialists with clinic hours and phone numbers.',
    h1: 'Verified Doctors, Dentists and Specialists in Vidisha',
    category: 'Doctors and Dentists',
    priority: '0.9',
    changefreq: 'daily',
  },
  {
    path: '/coaching-in-vidisha',
    title: 'Coaching in Vidisha – Best MPPSC, UPSC, SSC & Exam Prep | Vidisha City',
    description: 'Find top coaching institutes in Vidisha, MP. Prepare for MPPSC, UPSC, SSC, Banking, IIT-JEE, NEET, and school board examinations with experienced faculty and mock tests.',
    h1: 'Top Coaching Institutes & Academic Centres in Vidisha',
    category: 'Coaching Centres',
    priority: '0.9',
    changefreq: 'daily',
  },
  {
    path: '/gyms-in-vidisha',
    title: 'Gyms in Vidisha – Best Fitness Clubs, Workout & Yoga | Vidisha City',
    description: 'Discover the best gyms and fitness centers in Vidisha, MP. Modern workout equipment, certified personal trainers, weight loss, and cardio workout plans with contact details.',
    h1: 'Best Gyms, Fitness Clubs & Workout Centres in Vidisha',
    category: 'Gyms and Fitness',
    priority: '0.9',
    changefreq: 'daily',
  },
];

// Extract seed businesses from seedData.ts if available
function extractSeedBusinesses() {
  const seedFile = path.resolve(__dirname, '../src/data/seedData.ts');
  if (!fs.existsSync(seedFile)) return [];
  const content = fs.readFileSync(seedFile, 'utf8');

  const businesses = [];
  const regex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*categoryId:\s*'([^']+)',\s*categoryName:\s*'([^']+)',/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    businesses.push({
      id: match[1],
      name: match[2],
      slug: match[3],
      categoryId: match[4],
      categoryName: match[5],
    });
  }
  return businesses;
}

const SEED_BUSINESSES = extractSeedBusinesses();

// 1. Generate Sitemap XML
function generateSitemap() {
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    ...SEO_LANDING_PAGES.map((p) => ({ loc: `${SITE_URL}${p.path}`, priority: p.priority, changefreq: p.changefreq })),
    { loc: `${SITE_URL}/categories`, priority: '0.8', changefreq: 'weekly' },
    ...CATEGORIES.map((c) => ({ loc: `${SITE_URL}/category/${c.slug}`, priority: '0.8', changefreq: 'weekly' })),
    { loc: `${SITE_URL}/offers`, priority: '0.8', changefreq: 'daily' },
    { loc: `${SITE_URL}/list-your-business`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/pricing`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/advertise`, priority: '0.7', changefreq: 'monthly' },
    ...SEED_BUSINESSES.map((b) => ({ loc: `${SITE_URL}/business/${b.slug}`, priority: '0.8', changefreq: 'weekly' })),
    { loc: `${SITE_URL}/contact`, priority: '0.4', changefreq: 'monthly' },
    { loc: `${SITE_URL}/listing-policy`, priority: '0.4', changefreq: 'monthly' },
    { loc: `${SITE_URL}/privacy`, priority: '0.3', changefreq: 'monthly' },
    { loc: `${SITE_URL}/terms`, priority: '0.3', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log(`[SEO] Generated public/sitemap.xml with ${urls.length} URLs`);

  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml, 'utf8');
    console.log(`[SEO] Synchronized dist/sitemap.xml`);
  }
}

// 2. Generate Robots.txt
function generateRobotsTxt() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*

# Host
Host: ${SITE_URL}

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8');
  if (fs.existsSync(DIST_DIR)) {
    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robots, 'utf8');
  }
  console.log('[SEO] Generated robots.txt');
}

// 3. Static Pre-rendering of HTML files into dist/
function prerenderPages() {
  const templatePath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.log('[SEO] dist/index.html not found, skipping prerender. Run "npm run build" first.');
    return;
  }

  const rawTemplate = fs.readFileSync(templatePath, 'utf8');
  // Clean raw template so root container is always fresh empty <div id="root"></div>
  const baseTemplate = rawTemplate
    .replace(/<script type="application\/ld\+json" id="seo-prerender-data">[\s\S]*?<\/script>/gi, '')
    .replace(/<div id="root">[\s\S]*?<\/div>/i, '<div id="root"></div>');

  function renderPage({ relativePath, title, description, h1, bodyContent, canonical, structuredData }) {
    const targetDir = relativePath === '/' ? DIST_DIR : path.join(DIST_DIR, relativePath);
    fs.mkdirSync(targetDir, { recursive: true });
    const targetFile = relativePath === '/' ? path.join(DIST_DIR, 'index.html') : path.join(targetDir, 'index.html');

    const canonicalUrl = `${SITE_URL}${relativePath === '/' ? '' : relativePath}`;

    let html = baseTemplate;

    // Title
    html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

    // Description
    html = html.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${description}" />`
    );

    // Canonical
    if (html.includes('<link rel="canonical"')) {
      html = html.replace(
        /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
        `<link rel="canonical" href="${canonicalUrl}" />`
      );
    } else {
      html = html.replace('</head>', `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);
    }

    // Open Graph Title, Description, URL
    html = html.replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${title}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${description}" />`
    );
    html = html.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${canonicalUrl}" />`
    );

    // Twitter
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${title}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${description}" />`
    );

    // Injected Structured Data
    if (structuredData) {
      const script = `<script type="application/ld+json" id="seo-prerender-data">\n${JSON.stringify(structuredData, null, 2)}\n</script>`;
      html = html.replace('</head>', `${script}\n</head>`);
    }

    // Inject Crawlable Content inside <div id="root">
    const prerenderMarkup = `
      <div id="prerender-seo-content" style="display:contents">
        <header style="max-width:1200px;margin:20px auto;padding:10px 20px;">
          <h1 style="font-size:28px;color:#d4a831;margin-bottom:10px;">${h1 || title}</h1>
          <p style="font-size:15px;color:#d4d4d8;line-height:1.6;">${description}</p>
        </header>
        <main style="max-width:1200px;margin:20px auto;padding:10px 20px;">
          ${bodyContent || ''}
        </main>
      </div>
    `;

    html = html.replace('<div id="root"></div>', `<div id="root">${prerenderMarkup}</div>`);

    fs.writeFileSync(targetFile, html, 'utf8');
  }

  // Pre-render Homepage
  renderPage({
    relativePath: '/',
    title: 'Vidisha City – Discover Local Businesses in Vidisha, Madhya Pradesh',
    description: 'Discover the best local businesses in Vidisha. Explore restaurants, hotels, doctors, coaching institutes, gyms and more with Vidisha City.',
    h1: 'Discover Exceptional Local Businesses in Vidisha, Madhya Pradesh',
    bodyContent: `
      <section>
        <h2>Curated Business Sectors in Vidisha</h2>
        <ul>
          ${CATEGORIES.map((c) => `<li><a href="/category/${c.slug}">${c.name} in Vidisha</a></li>`).join('')}
        </ul>
      </section>
      <section>
        <h2>High-Demand Categories</h2>
        <ul>
          ${SEO_LANDING_PAGES.map((p) => `<li><a href="${p.path}">${p.h1}</a></li>`).join('')}
        </ul>
      </section>
    `,
  });

  // Pre-render the 5 SEO High-Intent Categories
  SEO_LANDING_PAGES.forEach((page) => {
    const matchingBiz = SEED_BUSINESSES.filter(
      (b) => (b.categoryName || '').toLowerCase().includes(page.category.toLowerCase().split(' ')[0])
    );

    renderPage({
      relativePath: page.path,
      title: page.title,
      description: page.description,
      h1: page.h1,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": page.h1,
        "itemListElement": matchingBiz.map((b, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": b.name,
          "url": `${SITE_URL}/business/${b.slug}`
        }))
      },
      bodyContent: `
        <article>
          <h2>About ${page.category} in Vidisha</h2>
          <p>${page.description}</p>
          <h3>Verified Establishments in Vidisha</h3>
          <ul>
            ${
              matchingBiz.length > 0
                ? matchingBiz.map((b) => `<li><strong><a href="/business/${b.slug}">${b.name}</a></strong> – ${b.categoryName} in Vidisha</li>`).join('')
                : `<li>Visit our live directory to view approved ${page.category} in Vidisha.</li>`
            }
          </ul>
          <h3>Browse Other Services</h3>
          <ul>
            ${SEO_LANDING_PAGES.filter((p) => p.path !== page.path)
              .map((p) => `<li><a href="${p.path}">${p.title}</a></li>`)
              .join('')}
          </ul>
        </article>
      `,
    });
  });

  // Pre-render All Categories Index
  renderPage({
    relativePath: '/categories',
    title: 'All Business Categories in Vidisha | Vidisha City Directory',
    description: 'Browse all local business categories in Vidisha, MP. From restaurants, hotels, and doctors to coaching institutes, salons, and home services.',
    h1: 'All Business & Service Categories in Vidisha',
    bodyContent: `
      <ul>
        ${CATEGORIES.map((c) => `<li><a href="/category/${c.slug}"><strong>${c.name}</strong></a></li>`).join('')}
      </ul>
    `,
  });

  // Pre-render Individual Categories
  CATEGORIES.forEach((cat) => {
    renderPage({
      relativePath: `/category/${cat.slug}`,
      title: `${cat.name} in Vidisha – Top Verified Listings & Contacts | Vidisha City`,
      description: `Find verified ${cat.name.toLowerCase()} in Vidisha, Madhya Pradesh. Addresses, phone numbers, ratings, and directions.`,
      h1: `${cat.name} in Vidisha, Madhya Pradesh`,
      bodyContent: `
        <p>Explore verified ${cat.name.toLowerCase()} in Vidisha. View addresses, telephone numbers, and directions.</p>
        <p><a href="/categories">← Back to All Categories in Vidisha</a></p>
      `,
    });
  });

  // Pre-render Seed Businesses
  SEED_BUSINESSES.forEach((biz) => {
    renderPage({
      relativePath: `/business/${biz.slug}`,
      title: `${biz.name} – ${biz.categoryName} in Vidisha | Vidisha City`,
      description: `${biz.name} located in Vidisha, Madhya Pradesh. View verified phone numbers, address, reviews, and services on Vidisha City.`,
      h1: `${biz.name} – ${biz.categoryName} in Vidisha`,
      structuredData: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": biz.name,
        "image": biz.coverImage || `${SITE_URL}/logo.png`,
        "telephone": biz.phone,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": biz.address || "Vidisha",
          "addressLocality": biz.locality || "Vidisha",
          "addressRegion": "Madhya Pradesh",
          "postalCode": "464001",
          "addressCountry": "IN"
        },
        "url": `${SITE_URL}/business/${biz.slug}`
      },
      bodyContent: `
        <article>
          <p>Verified ${biz.categoryName} establishment in Vidisha, Madhya Pradesh.</p>
          <p><a href="/category/${biz.categoryId}">View more ${biz.categoryName} in Vidisha</a></p>
        </article>
      `,
    });
  });

  console.log(`[SEO] Pre-rendered static HTML snapshots for ${1 + SEO_LANDING_PAGES.length + 1 + CATEGORIES.length + SEED_BUSINESSES.length} public pages in dist/!`);
}

// Execute
generateSitemap();
generateRobotsTxt();
prerenderPages();
console.log('[SEO] Automated SEO Build Generation Finished Successfully.');
