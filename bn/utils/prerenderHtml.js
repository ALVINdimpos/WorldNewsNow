const esc = (str) => String(str ?? '')
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const SITE_URL = process.env.CLIENT_URL?.split(',')[0]?.trim() || 'https://www.primeworld.news';
const SITE_NAME = 'PRIMEWORLDNEWS';

const BASE_STYLES = `
  body { font-family: Georgia, 'Times New Roman', serif; background: #0E0D0B; color: #E8E4DC; margin: 0; line-height: 1.7; }
  a { color: #D4A853; }
  header { border-bottom: 1px solid #2A2824; padding: 20px 24px; }
  header a { text-decoration: none; font-family: Arial, sans-serif; font-size: 22px; letter-spacing: 3px; color: #D4A853; }
  main { max-width: 780px; margin: 0 auto; padding: 32px 24px 64px; }
  h1 { font-size: 2.4rem; line-height: 1.15; margin: 0 0 16px; }
  h2 { font-size: 1.25rem; margin: 32px 0 12px; color: #D4A853; font-family: Arial, sans-serif; letter-spacing: 1px; }
  p, li { color: #B8B4AC; font-size: 1rem; }
  .meta { color: #888; font-size: 0.9rem; margin-bottom: 24px; font-family: Arial, sans-serif; }
  .excerpt { font-style: italic; border-left: 3px solid #D4A853; padding-left: 16px; margin-bottom: 28px; }
  .article-list { list-style: none; padding: 0; }
  .article-list li { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #2A2824; }
  .article-list a { font-size: 1.15rem; text-decoration: none; color: #E8E4DC; }
  .article-list .cat { font-size: 0.75rem; letter-spacing: 1px; color: #888; font-family: Arial, sans-serif; }
  footer { border-top: 1px solid #2A2824; padding: 24px; text-align: center; color: #666; font-size: 0.85rem; font-family: Arial, sans-serif; }
  nav { margin-top: 12px; font-family: Arial, sans-serif; font-size: 0.85rem; }
  nav a { margin: 0 10px; }
`;

function pageShell({ title, description, canonical, body, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:site_name" content="${SITE_NAME}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:type" content="website" />
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
  <style>${BASE_STYLES}</style>
</head>
<body>
  <header>
    <a href="${esc(SITE_URL)}">${SITE_NAME}</a>
    <nav>
      <a href="${esc(SITE_URL)}">Home</a>
      <a href="${esc(SITE_URL)}/about">About</a>
      <a href="${esc(SITE_URL)}/editorial">Editorial</a>
      <a href="${esc(SITE_URL)}/contact">Contact</a>
      <a href="${esc(SITE_URL)}/privacy">Privacy</a>
    </nav>
  </header>
  <main>${body}</main>
  <footer>© ${new Date().getFullYear()} ${SITE_NAME}. Independent global journalism.</footer>
</body>
</html>`;
}

function wordCount(content, isHtml) {
  if (!content) return 0;
  const text = isHtml ? content.replace(/<[^>]+>/g, ' ') : content;
  return text.split(/\s+/).filter(Boolean).length;
}

function renderArticleBody(article) {
  const slug = article.slug || article._id;
  const url = `${SITE_URL}/article/${slug}`;
  const author = article.author?.name || SITE_NAME;
  const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const contentHtml = article.isHtml
    ? article.content
    : esc(article.content).split('\n\n').map(p => `<p>${p}</p>`).join('');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: author },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: url,
  };

  const body = `
    <p class="cat">${esc(article.category)}</p>
    <h1>${esc(article.title)}</h1>
    <p class="meta">By ${esc(author)} · ${esc(date)}</p>
    <p class="excerpt">${esc(article.excerpt)}</p>
    <div class="article-body">${contentHtml}</div>
  `;

  return pageShell({
    title: `${article.title} — ${SITE_NAME}`,
    description: article.excerpt,
    canonical: url,
    body,
    jsonLd,
  });
}

function renderHomeBody(articles) {
  const items = articles.map((a) => {
    const slug = a.slug || a._id;
    return `<li>
      <div class="cat">${esc(a.category)}</div>
      <a href="${esc(SITE_URL)}/article/${esc(slug)}">${esc(a.title)}</a>
      <p>${esc(a.excerpt)}</p>
    </li>`;
  }).join('');

  return pageShell({
    title: `${SITE_NAME} — Independent Global Journalism`,
    description: 'PRIMEWORLDNEWS delivers independent global journalism — breaking news, politics, technology, business, science, sports and entertainment from around the world.',
    canonical: SITE_URL,
    body: `
      <h1>Latest Stories</h1>
      <p>Independent global journalism covering the stories that matter, without fear or favour.</p>
      <ul class="article-list">${items}</ul>
    `,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  });
}

const STATIC_CONTENT = {
  about: {
    title: `About Us — ${SITE_NAME}`,
    description: 'Learn about PRIMEWORLDNEWS\'s mission, newsroom, and the journalists behind our independent global coverage.',
    body: `<h1>About PRIMEWORLDNEWS</h1>
      <p>We believe an informed world is a better world. PRIMEWORLDNEWS is an independent newsroom delivering fast, accurate, and fearless global journalism — free from corporate influence or political agenda.</p>
      <h2>Our Story</h2>
      <p>Founded in 2019, PRIMEWORLDNEWS was built by journalists who wanted coverage that follows the evidence, not the revenue. We are reader-supported and foundation-funded, with no advertising from governments or industries we cover.</p>
      <h2>Our Values</h2>
      <p>Independence, accuracy, global perspective, and transparency guide every story we publish.</p>`,
  },
  privacy: {
    title: `Privacy Policy — ${SITE_NAME}`,
    description: 'How PRIMEWORLDNEWS collects, uses, and protects your personal information.',
    body: `<h1>Privacy Policy</h1>
      <p>PRIMEWORLDNEWS is committed to protecting your privacy. We collect information you provide (account details, newsletter sign-ups, comments) and standard log data to operate and improve our service.</p>
      <p>We do not sell personal information. Contact <a href="mailto:privacy@primeworld.news">privacy@primeworld.news</a> for data requests.</p>`,
  },
  terms: {
    title: `Terms of Use — ${SITE_NAME}`,
    description: 'Terms governing use of PRIMEWORLDNEWS content and services.',
    body: `<h1>Terms of Use</h1>
      <p>Content is for personal, non-commercial use with attribution. Full republication without permission is prohibited. We reserve the right to remove comments and accounts that violate our standards.</p>`,
  },
  contact: {
    title: `Contact — ${SITE_NAME}`,
    description: 'Contact the PRIMEWORLDNEWS editorial team.',
    body: `<h1>Contact Us</h1>
      <p><strong>Editorial:</strong> <a href="mailto:editorial@primeworld.news">editorial@primeworld.news</a></p>
      <p><strong>General:</strong> <a href="mailto:hello@primeworld.news">hello@primeworld.news</a></p>
      <p><strong>Corrections:</strong> <a href="mailto:corrections@primeworld.news">corrections@primeworld.news</a></p>`,
  },
  editorial: {
    title: `Editorial Standards — ${SITE_NAME}`,
    description: 'PRIMEWORLDNEWS editorial standards for accuracy, independence, and ethical journalism.',
    body: `<h1>Editorial Standards</h1>
      <p>Our newsroom operates independently of advertisers and political influence. Every story is fact-checked; corrections are published prominently. Anonymous sources are used only when vital to the public interest.</p>`,
  },
  journalists: {
    title: `Our Journalists — ${SITE_NAME}`,
    description: 'Meet the reporters and editors behind PRIMEWORLDNEWS.',
    body: `<h1>Our Journalists</h1>
      <p>PRIMEWORLDNEWS journalists are based across four continents, combining breaking-news speed with investigative rigour.</p>`,
  },
  advertise: {
    title: `Advertise — ${SITE_NAME}`,
    description: 'Advertising opportunities with PRIMEWORLDNEWS.',
    body: `<h1>Advertise With Us</h1>
      <p>Reach a globally-minded audience through display, sponsored content, and newsletter placements. Contact our partnerships team for rate cards and availability.</p>`,
  },
  careers: {
    title: `Careers — ${SITE_NAME}`,
    description: 'Career opportunities at PRIMEWORLDNEWS.',
    body: `<h1>Careers</h1>
      <p>We are a small, independent newsroom hiring carefully. Explore journalism and editorial opportunities with PRIMEWORLDNEWS.</p>`,
  },
};

function renderStaticPage(slug) {
  const page = STATIC_CONTENT[slug];
  if (!page) return null;
  return pageShell({
    title: page.title,
    description: page.description,
    canonical: `${SITE_URL}/${slug}`,
    body: page.body,
  });
}

module.exports = {
  esc,
  SITE_URL,
  pageShell,
  wordCount,
  renderArticleBody,
  renderHomeBody,
  renderStaticPage,
};
