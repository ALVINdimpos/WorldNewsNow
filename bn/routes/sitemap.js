const router = require('express').Router();
const Article = require('../models/Article');

const SITE_URL = process.env.CLIENT_URL || 'https://worldnewsnow.vercel.app';
const CATEGORIES = ['WORLD', 'POLITICS', 'TECH', 'BUSINESS', 'SPORTS', 'SCIENCE', 'ENTERTAINMENT'];

const esc = (str) => String(str)
  .replace(/&/g, '&amp;')
  .replace(/'/g, '&apos;')
  .replace(/"/g, '&quot;')
  .replace(/>/g, '&gt;')
  .replace(/</g, '&lt;');

const STATIC_PAGES = [
  { url: '/',            priority: '1.0', changefreq: 'daily'   },
  { url: '/about',       priority: '0.6', changefreq: 'monthly' },
  { url: '/journalists', priority: '0.7', changefreq: 'weekly'  },
  { url: '/advertise',   priority: '0.5', changefreq: 'monthly' },
  { url: '/careers',     priority: '0.5', changefreq: 'monthly' },
];

// GET /sitemap.xml
router.get('/sitemap.xml', async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true, isDraft: false })
      .select('_id slug publishedAt updatedAt category title')
      .sort({ publishedAt: -1 })
      .limit(1000)
      .lean();

    const staticUrls = STATIC_PAGES.map(({ url, priority, changefreq }) => `
  <url>
    <loc>${esc(SITE_URL + url)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('');

    const articleUrls = articles.map((a) => {
      const slug = a.slug || a._id;
      return `
  <url>
    <loc>${esc(`${SITE_URL}/article/${slug}`)}</loc>
    <lastmod>${new Date(a.updatedAt || a.publishedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>WorldNewsNow</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title>${esc(a.title)}</news:title>
    </news:news>
  </url>`;
    }).join('');

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

// GET /rss  or  /rss/:category
async function buildRSS(category) {
  const filter = { isPublished: true, isDraft: false };
  if (category) filter.category = category.toUpperCase();

  const articles = await Article.find(filter)
    .populate('author', 'name')
    .select('title excerpt slug _id category author publishedAt updatedAt coverImage tags')
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean();

  const chanTitle = category ? `WorldNewsNow — ${category}` : 'WorldNewsNow';
  const chanLink = category ? `${SITE_URL}?category=${category}` : SITE_URL;

  const items = articles.map((a) => {
    const link = `${SITE_URL}/article/${a.slug || a._id}`;
    return `
    <item>
      <title>${esc(a.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <description>${esc(a.excerpt)}</description>
      <author>${esc(a.author?.name || 'WorldNewsNow')}</author>
      <category>${esc(a.category)}</category>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      ${a.coverImage ? `<enclosure url="${esc(a.coverImage)}" type="image/jpeg" length="0"/>` : ''}
    </item>`;
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${esc(chanTitle)}</title>
    <link>${esc(chanLink)}</link>
    <description>Breaking news and in-depth stories from around the world.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${esc(SITE_URL)}/rss${category ? '/' + category.toLowerCase() : ''}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;
}

router.get('/rss', async (req, res) => {
  try {
    const xml = await buildRSS(null);
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating RSS feed');
  }
});

router.get('/rss/:category', async (req, res) => {
  const cat = req.params.category.toUpperCase();
  if (!CATEGORIES.includes(cat)) {
    return res.status(404).send('Category not found');
  }
  try {
    const xml = await buildRSS(cat);
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=1800');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating RSS feed');
  }
});

// GET /robots.txt
router.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /

Disallow: /api/auth/
Disallow: /journalist-dashboard

Sitemap: ${SITE_URL}/sitemap.xml
`);
});

module.exports = router;
