const router = require('express').Router();
const Article = require('../models/Article');

const SITE_URL = process.env.CLIENT_URL || 'https://worldnewsnow.vercel.app';

const STATIC_PAGES = [
  { url: '/',            priority: '1.0', changefreq: 'daily'   },
  { url: '/about',       priority: '0.6', changefreq: 'monthly' },
  { url: '/journalists', priority: '0.7', changefreq: 'weekly'  },
  { url: '/advertise',   priority: '0.5', changefreq: 'monthly' },
  { url: '/careers',     priority: '0.5', changefreq: 'monthly' },
];

const esc = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/'/g, '&apos;')
  .replace(/"/g, '&quot;')
  .replace(/>/g, '&gt;')
  .replace(/</g, '&lt;');

// GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true, isDraft: false })
      .select('_id publishedAt updatedAt category')
      .sort({ publishedAt: -1 })
      .limit(1000)
      .lean();

    const staticUrls = STATIC_PAGES.map(({ url, priority, changefreq }) => `
  <url>
    <loc>${esc(SITE_URL + url)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('');

    const articleUrls = articles.map((a) => `
  <url>
    <loc>${esc(`${SITE_URL}/article/${a._id}`)}</loc>
    <lastmod>${new Date(a.updatedAt || a.publishedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls}
${articleUrls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /

Disallow: /api/auth/
Disallow: /journalist-dashboard

Sitemap: ${SITE_URL}/sitemap.xml`);
});

module.exports = router;
