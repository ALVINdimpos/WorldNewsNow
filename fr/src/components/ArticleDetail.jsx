import { CAT_STYLE } from '../data/constants';
import { countAll } from '../utils/helpers';
import { CommentSection } from './CommentSection';

export function ArticleDetail({
  article,
  onBack,
  onLike,
  isLiked,
  onShare,
  likedComs,
  onLikeComment,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  onReply,
  commentAs,
  setCommentAs,
  commentText,
  setCommentText,
  onPostComment,
  isPosting,
  currentUser,
  setAuthView,
  onBookmark,
  hasMoreComments,
  onLoadMoreComments,
  totalComments,
}) {
  const bookmarked = article.isBookmarked;

  function handleBookmark() {
    if (!currentUser) { setAuthView('login'); return; }
    onBookmark?.(article.id);
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <button className="btn-ghost" onClick={onBack}
        style={{ marginTop: 28, marginBottom: 24, fontSize: 12, padding: '6px 14px' }}>
        ← Back to news
      </button>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
        {article.breaking && (
          <span style={{
            background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.35)',
            color: '#F87171', padding: '4px 12px', borderRadius: 6, fontSize: 10,
            fontFamily: "'DM Mono',monospace", letterSpacing: 1.5,
          }}>⚡ BREAKING</span>
        )}
        <span style={{
          ...CAT_STYLE[article.category], border: `1px solid ${CAT_STYLE[article.category]?.border}`,
          padding: '4px 12px', borderRadius: 6, fontSize: 10,
          fontFamily: "'DM Mono',monospace", letterSpacing: 1.5,
        }}>
          {article.category}
        </span>
      </div>

      <h1 style={{
        fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(36px,6vw,58px)',
        letterSpacing: 2, lineHeight: 1.05, color: 'var(--text)', marginBottom: 20,
      }}>
        {article.title}
      </h1>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        marginBottom: 28, flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: article.author.role === 'journalist' ? 'rgba(212,168,83,0.2)' : 'rgba(96,165,250,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 600,
            color: article.author.role === 'journalist' ? 'var(--gold)' : 'var(--blue)',
          }}>
            {article.author.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {article.author.name}
              {article.author.role === 'journalist' && (
                <span style={{
                  fontSize: 9, background: 'rgba(212,168,83,0.15)', color: 'var(--gold)',
                  padding: '2px 7px', borderRadius: 4, fontFamily: "'DM Mono',monospace", letterSpacing: 1,
                }}>✍ JOURNALIST</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{article.time}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={() => onLike(article.id)}>
            {isLiked ? '♥' : '♡'} {article.likes}
          </button>
          <button
            onClick={handleBookmark}
            title={bookmarked ? 'Remove bookmark' : 'Save article'}
            style={{
              background: bookmarked ? 'rgba(212,168,83,0.12)' : 'transparent',
              border: `1px solid ${bookmarked ? 'var(--gold)' : 'var(--border)'}`,
              color: bookmarked ? 'var(--gold)' : 'var(--muted)',
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
              fontFamily: "'DM Mono',monospace", transition: 'all .15s',
            }}
          >
            {bookmarked ? '🔖 Saved' : '🏷 Save'}
          </button>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)',
            fontFamily: "'DM Mono',monospace",
          }}>
            👁 {article.viewCount || 0}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)',
            fontFamily: "'DM Mono',monospace",
          }}>
            ◎ {totalComments ?? countAll(article.comments)}
          </div>
          <button className="share-btn" onClick={() => onShare(article)}>
            ↗ Share
          </button>
        </div>
      </div>

      <p style={{
        fontSize: 16, color: '#B8B4AC', lineHeight: 1.7, marginBottom: 28, fontStyle: 'italic',
        borderLeft: '3px solid var(--gold)', paddingLeft: 18,
      }}>
        {article.excerpt}
      </p>

      {article.isHtml ? (
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{ fontSize: 15, lineHeight: 1.8 }}
        />
      ) : (
        <div style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)' }}>
          {article.content.split('\n\n').map((p, i) => (
            <p key={i} style={{ marginBottom: 20, color: i === 0 ? 'var(--text)' : 'var(--muted)' }}>{p}</p>
          ))}
        </div>
      )}

      <CommentSection
        comments={article.comments}
        articleId={article.id}
        likedComs={likedComs}
        onLikeCom={onLikeComment}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        replyText={replyText}
        setReplyText={setReplyText}
        onReply={onReply}
        commentAs={commentAs}
        setCommentAs={setCommentAs}
        commentText={commentText}
        setCommentText={setCommentText}
        onPostComment={onPostComment}
        isPosting={isPosting}
        currentUser={currentUser}
        setAuthView={setAuthView}
        hasMoreComments={hasMoreComments}
        onLoadMore={onLoadMoreComments}
        totalComments={totalComments}
      />
    </div>
  );
}
