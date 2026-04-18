import { useGetBookmarksQuery } from '../store/articlesApi';
import { ArticleCard } from './ArticleCard';

export function BookmarksPage({ goHome, onArticleClick, onLike, likedArts, onBookmark, currentUser, setAuthView }) {
  const { data, isLoading } = useGetBookmarksQuery();
  const articles = data?.articles || [];

  return (
    <div style={{ padding: '32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <button onClick={goHome} style={{
          background: 'none', border: '1px solid var(--border)', color: 'var(--muted)',
          padding: '6px 14px', borderRadius: 7, cursor: 'pointer', fontSize: 12,
          fontFamily: "'DM Mono',monospace",
        }}>← Back</button>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, letterSpacing: 3, color: 'var(--text)' }}>
          SAVED ARTICLES
        </span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
          {articles.length} saved
        </span>
      </div>

      {isLoading ? (
        <div className="page-loader"><span className="spinner spinner-lg" /> Loading saved articles…</div>
      ) : articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔖</div>
          <div style={{ fontSize: 16, color: 'var(--muted)', marginBottom: 24 }}>No saved articles yet</div>
          <button onClick={goHome} className="btn-gold" style={{ padding: '10px 24px' }}>
            Browse Stories
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
          {articles.map(a => (
            <ArticleCard
              key={a.id}
              article={a}
              onClick={() => onArticleClick(a.id)}
              onLike={onLike}
              isLiked={likedArts.has(a.id)}
              onBookmark={onBookmark}
              currentUser={currentUser}
              setAuthView={setAuthView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
