const STATIC_PAGES = new Set([
  'about', 'journalists', 'advertise', 'careers',
  'privacy', 'terms', 'contact', 'editorial',
  'bookmarks', 'journalist-dashboard',
]);

export function parseRoute(location = window.location) {
  const path = location.pathname.replace(/\/$/, '') || '/';
  const params = new URLSearchParams(location.search);

  const legacyArticle = params.get('article');
  if (legacyArticle) {
    return { type: 'article', slugOrId: legacyArticle, legacy: true };
  }

  const articleMatch = path.match(/^\/article\/([^/]+)$/);
  if (articleMatch) {
    return { type: 'article', slugOrId: decodeURIComponent(articleMatch[1]) };
  }

  const categoryMatch = path.match(/^\/category\/([^/]+)$/i);
  if (categoryMatch) {
    return { type: 'category', category: decodeURIComponent(categoryMatch[1]).toUpperCase() };
  }

  if (path !== '/') {
    const page = path.slice(1);
    if (STATIC_PAGES.has(page)) {
      return { type: 'page', page };
    }
  }

  return { type: 'home' };
}

export function articlePath(slugOrId) {
  return `/article/${encodeURIComponent(slugOrId)}`;
}

export function pagePath(page) {
  return page === 'home' ? '/' : `/${page}`;
}

export function categoryPath(category) {
  return `/category/${encodeURIComponent(category.toLowerCase())}`;
}
