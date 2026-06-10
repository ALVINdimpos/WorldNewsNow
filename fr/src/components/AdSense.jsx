import { useEffect, useRef } from 'react';

export const ADSENSE_CLIENT = 'ca-pub-2964063437868037';
export const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

export function wordCount(content, isHtml) {
  if (!content) return 0;
  const text = isHtml ? content.replace(/<[^>]+>/g, ' ') : content;
  return text.split(/\s+/).filter(Boolean).length;
}

function loadAdSenseScript() {
  if (document.querySelector(`script[src="${ADSENSE_SRC}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = ADSENSE_SRC;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

/** Load AdSense script on substantial article pages. */
export function AdSense({ article }) {
  useEffect(() => {
    if (!article) return undefined;
    if (wordCount(article.content, article.isHtml) < 300) return undefined;
    loadAdSenseScript();
    return undefined;
  }, [article?.id, article?.content]);

  return null;
}

/** In-article display ad — above or below body content. */
export function AdUnit({ article, placement = 'top' }) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!article || wordCount(article.content, article.isHtml) < 300) return undefined;
    if (pushed.current) return undefined;

    let cancelled = false;
    loadAdSenseScript().then(() => {
      if (cancelled || pushed.current || !insRef.current) return;
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // AdSense not ready yet
      }
    });

    return () => { cancelled = true; };
  }, [article?.id, article?.content, placement]);

  if (!article || wordCount(article.content, article.isHtml) < 300) return null;

  const slot = import.meta.env.VITE_ADSENSE_SLOT;

  return (
    <div
      className="ad-unit"
      data-placement={placement}
      style={{
        margin: placement === 'top' ? '0 0 28px' : '28px 0',
        padding: '12px 0',
        borderTop: placement === 'bottom' ? '1px solid var(--border)' : undefined,
        borderBottom: placement === 'top' ? '1px solid var(--border)' : undefined,
        minHeight: 90,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', width: '100%' }}
        data-ad-client={ADSENSE_CLIENT}
        {...(slot ? { 'data-ad-slot': slot } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
