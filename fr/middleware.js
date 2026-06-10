const BOT_UA = /googlebot|google-inspectiontool|adsbot-google|mediapartners-google|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|embedly|pinterest|slackbot|whatsapp|applebot/i;

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (!BOT_UA.test(ua)) return;

  const { pathname } = request.nextUrl;
  const apiUrl = (process.env.VITE_API_URL || process.env.API_URL || 'https://worldnewsnow.onrender.com').replace(/\/$/, '');

  let prerenderPath = null;
  if (pathname === '/') {
    prerenderPath = '/prerender/home';
  } else if (pathname.startsWith('/article/')) {
    prerenderPath = `/prerender${pathname}`;
  } else if (/^\/(about|privacy|terms|contact|editorial|journalists|advertise|careers)$/.test(pathname)) {
    prerenderPath = `/prerender${pathname}`;
  }

  if (!prerenderPath) return;

  try {
    const res = await fetch(`${apiUrl}${prerenderPath}`, {
      headers: { Accept: 'text/html' },
    });
    if (!res.ok) return;
    const html = await res.text();
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch {
    return;
  }
}

export const config = {
  matcher: [
    '/',
    '/article/:path*',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
    '/editorial',
    '/journalists',
    '/advertise',
    '/careers',
  ],
};
