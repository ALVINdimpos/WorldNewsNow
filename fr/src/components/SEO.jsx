import { Helmet } from 'react-helmet-async';

const SITE_NAME  = 'WorldNewsNow';
const SITE_URL   = import.meta.env.VITE_SITE_URL || 'https://worldnewsnow.vercel.app';
const TWITTER_HANDLE = '@WorldNewsNow';
const DEFAULT_IMAGE  = `${SITE_URL}/og-default.jpg`;

// ── Organisation JSON-LD (included on every page) ────────────────────────────
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/worldnewsnow_icon.svg`,
    width: 512,
    height: 512,
  },
  sameAs: [
    'https://twitter.com/WorldNewsNow',
    'https://facebook.com/WorldNewsNow',
    'https://linkedin.com/company/worldnewsnow',
  ],
  foundingDate: '2019',
  description: 'Independent global journalism covering the stories that matter, without fear or favour.',
};

// ── WebSite JSON-LD with SearchAction (enables Google Sitelinks Search Box) ──
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function truncate(str, max) {
  if (!str) return '';
  return str.length <= max ? str : str.slice(0, max - 1) + '…';
}

function stripHtml(html) {
  return html ? html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
}

// ────────────────────────────────────────────────────────────────────────────
// Main SEO component
// Props:
//   article      – article object (for article pages)
//   page         – 'home'|'about'|'journalists'|'advertise'|'careers'|'category'
//   category     – active category string (for category pages)
//   canonical    – override canonical URL
// ────────────────────────────────────────────────────────────────────────────
export function SEO({ article, page = 'home', category, canonical }) {

  // ── Article page ───────────────────────────────────────────────────────────
  if (article) {
    const plainContent = stripHtml(article.content);
    const title        = truncate(article.title, 110);
    const description  = truncate(article.excerpt || plainContent, 160);
    const image        = article.coverImage || DEFAULT_IMAGE;
    const url          = `${SITE_URL}/?article=${article.id}`;
    const authorName   = article.author?.name || SITE_NAME;
    const publishedAt  = article.publishedAt || new Date().toISOString();
    const keywords     = [
      article.category,
      ...(article.tags || []),
      'world news', SITE_NAME,
    ].join(', ');

    // NewsArticle JSON-LD — required by Google News
    const newsArticleSchema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      headline:         title,
      description,
      image: {
        '@type': 'ImageObject',
        url: image,
        width: 1200,
        height: 630,
      },
      datePublished:  publishedAt,
      dateModified:   article.updatedAt || publishedAt,
      author: {
        '@type': 'Person',
        name:    authorName,
        url:     `${SITE_URL}/journalists`,
      },
      publisher: {
        '@type': 'NewsMediaOrganization',
        name:    SITE_NAME,
        logo:    { '@type': 'ImageObject', url: `${SITE_URL}/worldnewsnow_icon.svg` },
      },
      articleSection:  article.category,
      keywords,
      wordCount:       plainContent.split(/\s+/).filter(Boolean).length,
      inLanguage:      'en-US',
      isAccessibleForFree: true,
    };

    // BreadcrumbList JSON-LD
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',               item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: article.category,     item: `${SITE_URL}/?category=${article.category}` },
        { '@type': 'ListItem', position: 3, name: title,                item: url },
      ],
    };

    return (
      <Helmet>
        {/* Core */}
        <title>{title} — {SITE_NAME}</title>
        <meta name="description"              content={description} />
        <meta name="keywords"                 content={keywords} />
        <meta name="author"                   content={authorName} />
        <meta name="robots"                   content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical"                 href={canonical || url} />

        {/* Open Graph */}
        <meta property="og:type"              content="article" />
        <meta property="og:title"             content={`${title} — ${SITE_NAME}`} />
        <meta property="og:description"       content={description} />
        <meta property="og:url"               content={canonical || url} />
        <meta property="og:image"             content={image} />
        <meta property="og:image:width"       content="1200" />
        <meta property="og:image:height"      content="630" />
        <meta property="og:image:alt"         content={title} />
        <meta property="og:site_name"         content={SITE_NAME} />
        <meta property="og:locale"            content="en_US" />
        <meta property="article:published_time" content={publishedAt} />
        <meta property="article:author"       content={authorName} />
        <meta property="article:section"      content={article.category} />
        {(article.tags || []).map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}

        {/* Twitter Card */}
        <meta name="twitter:card"             content="summary_large_image" />
        <meta name="twitter:site"             content={TWITTER_HANDLE} />
        <meta name="twitter:title"            content={`${title} — ${SITE_NAME}`} />
        <meta name="twitter:description"      content={description} />
        <meta name="twitter:image"            content={image} />
        <meta name="twitter:image:alt"        content={title} />
        <meta name="twitter:label1"           content="Written by" />
        <meta name="twitter:data1"            content={authorName} />
        <meta name="twitter:label2"           content="Category" />
        <meta name="twitter:data2"            content={article.category} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(newsArticleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
    );
  }

  // ── Static pages ───────────────────────────────────────────────────────────
  const pages = {
    home: {
      title:       `${SITE_NAME} — Independent Global Journalism`,
      description: 'WorldNewsNow delivers independent global journalism — breaking news, politics, technology, business, science, sports and entertainment from around the world.',
      url:         SITE_URL,
    },
    about: {
      title:       `About Us — ${SITE_NAME}`,
      description: `Learn about WorldNewsNow's mission, newsroom, and the journalists behind our independent global coverage.`,
      url:         `${SITE_URL}/about`,
    },
    journalists: {
      title:       `Our Journalists — ${SITE_NAME}`,
      description: 'Meet the reporters, editors, and investigators behind WorldNewsNow\'s global coverage across politics, technology, science, and more.',
      url:         `${SITE_URL}/journalists`,
    },
    advertise: {
      title:       `Advertise With Us — ${SITE_NAME}`,
      description: 'Reach a highly engaged, globally-minded audience with WorldNewsNow advertising solutions including display, sponsored content, and newsletter placements.',
      url:         `${SITE_URL}/advertise`,
    },
    careers: {
      title:       `Careers — ${SITE_NAME}`,
      description: 'Join the WorldNewsNow team. We\'re a small, independent newsroom hiring carefully. Explore journalism and editorial career opportunities.',
      url:         `${SITE_URL}/careers`,
    },
    category: {
      title:       `${category} News — ${SITE_NAME}`,
      description: `The latest ${category?.toLowerCase()} news from WorldNewsNow. Independent reporting on the stories that matter.`,
      url:         `${SITE_URL}/?category=${category}`,
    },
  };

  const meta = pages[page] || pages.home;
  const pageUrl = canonical || meta.url;

  // WebPage JSON-LD
  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type':    page === 'journalists' ? 'AboutPage' : 'WebPage',
    name:       meta.title,
    description: meta.description,
    url:         pageUrl,
    isPartOf:   { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    inLanguage: 'en-US',
  };

  return (
    <Helmet>
      {/* Core */}
      <title>{meta.title}</title>
      <meta name="description"        content={meta.description} />
      <meta name="robots"             content="index, follow" />
      <link rel="canonical"           href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type"        content="website" />
      <meta property="og:title"       content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url"         content={pageUrl} />
      <meta property="og:image"       content={DEFAULT_IMAGE} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:locale"      content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={TWITTER_HANDLE} />
      <meta name="twitter:title"       content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image"       content={DEFAULT_IMAGE} />

      {/* JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(webpageSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
    </Helmet>
  );
}
