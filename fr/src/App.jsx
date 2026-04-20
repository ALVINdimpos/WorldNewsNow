import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CATS } from './data/constants';
import './styles/global.css';

import { SEO }          from './components/SEO';
import { Header }       from './components/Header';
import { Footer }       from './components/Footer';
import { ArticleCard, FeaturedArticle } from './components/ArticleCard';
import { ArticleDetail } from './components/ArticleDetail';
import { AboutPage }    from './components/AboutPage';
import { JournalistsPage } from './components/JournalistsPage';
import { AdvertisePage } from './components/AdvertisePage';
import { CareersPage }  from './components/CareersPage';
import { JournalistDashboard } from './components/JournalistDashboard';
import { AuthModal }    from './components/AuthModal';
import { BookmarksPage } from './components/BookmarksPage';

import { selectCurrentUser, selectCurrentToken } from './store/authSlice';
import { setCredentials, clearCredentials } from './store/authSlice';
import { useGetArticlesQuery, useGetArticleQuery, useLikeArticleMutation, useBookmarkArticleMutation } from './store/articlesApi';
import { useCreateCommentMutation, useLikeCommentMutation } from './store/commentsApi';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from './store/authApi';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest' },
  { value: 'mostViewed', label: 'Most Viewed' },
  { value: 'mostLiked', label: 'Most Liked' },
  { value: 'oldest',    label: 'Oldest' },
];

export default function WorldNewsNow() {
  const dispatch    = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const currentToken = useSelector(selectCurrentToken);

  const [activeCat,     setActiveCat]    = useState('ALL');
  const [selectedId,    setSelectedId]   = useState(null);
  const [authView,      setAuthView]     = useState(null);
  const [authForm,      setAuthForm]     = useState({ name: '', email: '', pass: '', role: 'reader' });
  const [likedArts,     setLikedArts]    = useState(new Set());
  const [likedComs,     setLikedComs]    = useState(new Set());
  const [commentText,   setCommentText]  = useState('');
  const [commentAs,     setCommentAs]    = useState('anonymous');
  const [replyingTo,    setReplyingTo]   = useState(null);
  const [replyText,     setReplyText]    = useState('');
  const [shareFeedback, setShareFeedback] = useState(null);
  const [currentPage,   setCurrentPage]  = useState(null);
  const [authError,     setAuthError]    = useState('');
  const [sortBy,        setSortBy]       = useState('newest');
  const [commentPage,   setCommentPage]  = useState(1);
  const COMMENT_PAGE_SIZE = 10;

  useEffect(() => {
    if (authView) {
      setAuthForm({ name: '', email: '', pass: '', role: 'reader' });
      setAuthError('');
    }
  }, [authView]);

  // Reset comment page when article changes
  useEffect(() => {
    setCommentPage(1);
  }, [selectedId]);

  // ── API hooks ──────────────────────────────────────────────────────────────
  const { data: articlesData, isLoading: loadingArticles, refetch: refetchArticles } =
    useGetArticlesQuery({ category: activeCat, sort: sortBy === 'newest' ? undefined : sortBy });

  const { data: articleData, isLoading: loadingArticle, refetch: refetchArticle } =
    useGetArticleQuery(selectedId, {
      skip: !selectedId,
      refetchOnMountOrArgChange: true,
    });

  const [likeArticleMutation]                     = useLikeArticleMutation();
  const [bookmarkArticleMutation]                 = useBookmarkArticleMutation();
  const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();
  const [likeCommentMutation]                     = useLikeCommentMutation();
  const [loginMutation,    { isLoading: loginLoading }]    = useLoginMutation();
  const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation();
  const [logoutMutation]                          = useLogoutMutation();

  // ── Derived data ───────────────────────────────────────────────────────────
  const articles    = articlesData?.articles || [];
  const featured    = activeCat === 'ALL' ? articles.find((a) => a.featured) : null;
  const gridArticles = activeCat === 'ALL' ? articles.filter((a) => !a.featured) : articles;
  const selected    = articleData?.article || null;
  const allComments = articleData?.comments || [];

  // Paginate comments client-side (server returns up to 10 per page; we accumulate)
  const pagedComments = allComments.slice(0, commentPage * COMMENT_PAGE_SIZE);
  const hasMoreComments = pagedComments.length < allComments.length;

  function requireAuth() {
    if (currentUser && currentToken) return true;
    setAuthView('login');
    return false;
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function likeArticle(id, e) {
    e?.stopPropagation();
    try {
      const res = await likeArticleMutation(id).unwrap();
      setLikedArts((s) => {
        const n = new Set(s);
        if (res?.liked) n.add(id);
        else n.delete(id);
        return n;
      });
    } catch (err) {
      const status = err?.status ?? err?.originalStatus;
      if (status === 401) dispatch(clearCredentials());
    }
  }

  async function bookmarkArticle(id, e) {
    e?.stopPropagation();
    if (!requireAuth()) return;
    try {
      await bookmarkArticleMutation(id).unwrap();
    } catch {}
  }

  async function likeComment(articleId, cid) {
    if (!requireAuth()) return;
    try {
      const res = await likeCommentMutation(cid).unwrap();
      setLikedComs((s) => {
        const n = new Set(s);
        if (res?.liked) n.add(cid);
        else n.delete(cid);
        return n;
      });
    } catch (err) {
      if (err?.status === 401) {
        dispatch(clearCredentials());
        setAuthView('login');
      }
    }
  }

  async function postComment() {
    if (!selectedId || !commentText.trim()) return;
    const asAnonymous = commentAs === 'anonymous';
    if (!asAnonymous && !requireAuth()) return;
    try {
      await createComment({
        text: commentText.trim(),
        articleId: String(selectedId),
        anonymous: asAnonymous,
      }).unwrap();
      setCommentText('');
      refetchArticle();
    } catch (err) {
      console.error('Comment failed:', err);
    }
  }

  async function postReply(parentId) {
    if (!selectedId || !replyText.trim()) return;
    const asAnonymous = commentAs === 'anonymous';
    if (!asAnonymous && !requireAuth()) return;
    try {
      await createComment({
        text: replyText.trim(),
        articleId: String(selectedId),
        parentId,
        anonymous: asAnonymous,
      }).unwrap();
      setReplyText('');
      setReplyingTo(null);
      refetchArticle();
    } catch (err) {
      console.error('Reply failed:', err);
    }
  }

  async function handleAuth() {
    setAuthError('');
    if (!authForm.email.trim()) { setAuthError('Email is required'); return; }

    try {
      if (authView === 'login') {
        await loginMutation({ email: authForm.email.trim(), password: authForm.pass }).unwrap();
      } else {
        if (!authForm.name.trim()) { setAuthError('Name is required'); return; }
        await registerMutation({
          name:     authForm.name.trim(),
          email:    authForm.email.trim(),
          password: authForm.pass,
          role:     authForm.role === 'journalist' ? 'journalist' : 'reader',
        }).unwrap();
      }
      setAuthView(null);
      setAuthForm({ name: '', email: '', pass: '', role: 'reader' });
    } catch (err) {
      setAuthError(err?.data?.message || 'Authentication failed. Please try again.');
    }
  }

  async function handleLogout() {
    try { await logoutMutation().unwrap(); } catch {}
    dispatch(clearCredentials());
  }

  function goHome() {
    setSelectedId(null);
    setCurrentPage(null);
    refetchArticles();
    window.scrollTo(0, 0);
  }
  function goPage(slug) {
    // Handle article navigation from notification
    if (slug?.startsWith('article:')) {
      setSelectedId(slug.replace('article:', ''));
      setCurrentPage(null);
      window.scrollTo(0, 0);
      return;
    }
    setCurrentPage(slug);
    setSelectedId(null);
    window.scrollTo(0, 0);
  }

  function shareArticle(article, e) {
    e?.stopPropagation();
    const SITE = import.meta.env.VITE_API_URL
      ? String(import.meta.env.VITE_API_URL).replace('/api', '').replace(/\/$/, '').replace(':5001', '')
      : window.location.origin;
    const slug = article.slug || article.id;
    const url = `${SITE}/article/${slug}`;
    const text = `${article.title} — WorldNewsNow`;
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.excerpt, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setShareFeedback(article.id);
      setTimeout(() => setShareFeedback(null), 2200);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header
          activeCat={activeCat}
          setActiveCat={(c) => { setActiveCat(c); setSortBy('newest'); }}
          currentUser={currentUser}
          setAuthView={setAuthView}
          setCurrentUser={() => handleLogout()}
          goHome={goHome}
          goPage={goPage}
        />

        <div className="main-inner" style={{
          flex: 1, width: '100%', maxWidth: 1200, margin: '0 auto',
          position: 'relative', zIndex: 1, boxSizing: 'border-box',
        }}>
          {currentPage === 'about' ? (
            <><SEO page="about" /><AboutPage goHome={goHome} setAuthView={setAuthView} /></>
          ) : currentPage === 'journalists' ? (
            <><SEO page="journalists" /><JournalistsPage goHome={goHome} /></>
          ) : currentPage === 'advertise' ? (
            <><SEO page="advertise" /><AdvertisePage goHome={goHome} /></>
          ) : currentPage === 'careers' ? (
            <><SEO page="careers" /><CareersPage goHome={goHome} setAuthView={setAuthView} /></>
          ) : currentPage === 'journalist-dashboard' ? (
            currentUser?.role === 'journalist'
              ? <JournalistDashboard currentUser={currentUser} goHome={goHome} />
              : <>{goHome()}</>
          ) : currentPage === 'bookmarks' ? (
            currentUser
              ? <BookmarksPage
                  goHome={goHome}
                  onArticleClick={(id) => { setSelectedId(id); setCurrentPage(null); window.scrollTo(0, 0); }}
                  onLike={likeArticle}
                  likedArts={likedArts}
                  onBookmark={bookmarkArticle}
                  currentUser={currentUser}
                  setAuthView={setAuthView}
                />
              : <>{goHome()}</>
          ) : !selectedId ? (
            <>
              <SEO
                page={activeCat !== 'ALL' ? 'category' : 'home'}
                category={activeCat !== 'ALL' ? activeCat : undefined}
              />
              {loadingArticles && (
                <div className="page-loader">
                  <span className="spinner spinner-lg" />
                  Loading stories…
                </div>
              )}

              {!loadingArticles && featured && activeCat === 'ALL' && (
                <FeaturedArticle
                  article={featured}
                  onClick={() => setSelectedId(featured.id)}
                  onLike={likeArticle}
                  isLiked={likedArts.has(featured.id)}
                  onBookmark={bookmarkArticle}
                  onShare={shareArticle}
                  currentUser={currentUser}
                  setAuthView={setAuthView}
                />
              )}

              {!loadingArticles && (
                <>
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', margin: '28px 0 16px',
                    borderBottom: '1px solid var(--border)', paddingBottom: 14,
                  }}>
                    <span style={{
                      fontFamily: "'Bebas Neue',sans-serif", fontSize: 20,
                      letterSpacing: 3, color: 'var(--text)',
                    }}>
                      {activeCat === 'ALL' ? 'LATEST STORIES' : activeCat}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: 1 }}>
                        {gridArticles.length} stories
                      </span>
                      <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{
                          background: 'var(--d3)', border: '1px solid var(--border)',
                          color: 'var(--muted)', borderRadius: 7, padding: '5px 10px',
                          fontSize: 11, fontFamily: "'DM Mono',monospace", cursor: 'pointer',
                          letterSpacing: 0.5,
                        }}
                      >
                        {SORT_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
                    {gridArticles.map((a) => (
                      <ArticleCard
                        key={a.id}
                        article={a}
                        onClick={() => setSelectedId(a.id)}
                        onLike={likeArticle}
                        isLiked={likedArts.has(a.id)}
                        onBookmark={bookmarkArticle}
                        currentUser={currentUser}
                        setAuthView={setAuthView}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : loadingArticle ? (
            <div className="page-loader" style={{ padding: '80px 0' }}>
              <span className="spinner spinner-lg" />
              Loading article…
            </div>
          ) : selected ? (
            <>
              <SEO article={selected} />
              <ArticleDetail
                article={{ ...selected, comments: pagedComments }}
                onBack={goHome}
                onLike={likeArticle}
                isLiked={likedArts.has(selected.id)}
                onShare={shareArticle}
                likedComs={likedComs}
                onLikeComment={likeComment}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                onReply={postReply}
                commentAs={commentAs}
                setCommentAs={setCommentAs}
                commentText={commentText}
                setCommentText={setCommentText}
                onPostComment={postComment}
                isPosting={isPosting}
                currentUser={currentUser}
                setAuthView={setAuthView}
                onBookmark={bookmarkArticle}
                hasMoreComments={hasMoreComments}
                onLoadMoreComments={() => setCommentPage(p => p + 1)}
                totalComments={allComments.length}
              />
            </>
          ) : null}
        </div>

        <Footer setActiveCat={setActiveCat} goHome={goHome} goPage={goPage} />
      </div>

      <AuthModal
        authView={authView}
        setAuthView={(v) => { setAuthView(v); setAuthError(''); }}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuth={handleAuth}
        isLoading={loginLoading || registerLoading}
        authError={authError}
      />

      {shareFeedback && <div className="toast">✓ Link copied to clipboard</div>}
    </>
  );
}
