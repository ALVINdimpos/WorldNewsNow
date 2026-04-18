import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CATS } from './data/constants';
import './styles/global.css';

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

import { selectCurrentUser } from './store/authSlice';
import { setCredentials, clearCredentials } from './store/authSlice';
import { useGetArticlesQuery, useGetArticleQuery, useLikeArticleMutation } from './store/articlesApi';
import { useGetCommentsQuery, useCreateCommentMutation, useLikeCommentMutation } from './store/commentsApi';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from './store/authApi';

export default function WorldNewsNow() {
  const dispatch   = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [activeCat,    setActiveCat]   = useState('ALL');
  const [selectedId,   setSelectedId]  = useState(null);
  const [authView,     setAuthView]    = useState(null);
  const [authForm,     setAuthForm]    = useState({ name: '', email: '', pass: '', role: 'user' });
  const [likedArts,    setLikedArts]   = useState(new Set());
  const [likedComs,    setLikedComs]   = useState(new Set());
  const [commentText,  setCommentText] = useState('');
  const [commentAs,    setCommentAs]   = useState('user');
  const [replyingTo,   setReplyingTo]  = useState(null);
  const [replyText,    setReplyText]   = useState('');
  const [shareFeedback,setShareFeedback] = useState(null);
  const [currentPage,  setCurrentPage] = useState(null);
  const [showPass,     setShowPass]    = useState(false);
  const [authError,    setAuthError]   = useState('');

  // ── API hooks ──────────────────────────────────────────────────────────────
  const { data: articlesData, isLoading: loadingArticles } =
    useGetArticlesQuery({ category: activeCat });

  const { data: articleData, isLoading: loadingArticle } =
    useGetArticleQuery(selectedId, { skip: !selectedId });

  const [likeArticleMutation] = useLikeArticleMutation();
  const [createComment]       = useCreateCommentMutation();
  const [likeCommentMutation] = useLikeCommentMutation();
  const [loginMutation]       = useLoginMutation();
  const [registerMutation]    = useRegisterMutation();
  const [logoutMutation]      = useLogoutMutation();

  // ── Derived data ───────────────────────────────────────────────────────────
  const articles    = articlesData?.articles || [];
  const featured    = activeCat === 'ALL' ? articles.find((a) => a.featured) : null;
  const gridArticles = activeCat === 'ALL' ? articles.filter((a) => !a.featured) : articles;
  const selected    = articleData?.article || null;
  const comments    = articleData?.comments || [];

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function likeArticle(id, e) {
    e?.stopPropagation();
    if (!currentUser) { setAuthView('signup'); return; }
    const was = likedArts.has(id);
    setLikedArts((s) => { const n = new Set(s); was ? n.delete(id) : n.add(id); return n; });
    try {
      await likeArticleMutation(id).unwrap();
    } catch {
      setLikedArts((s) => { const n = new Set(s); was ? n.add(id) : n.delete(id); return n; });
    }
  }

  async function likeComment(articleId, cid) {
    if (!currentUser) { setAuthView('signup'); return; }
    const was = likedComs.has(cid);
    setLikedComs((s) => { const n = new Set(s); was ? n.delete(cid) : n.add(cid); return n; });
    try {
      await likeCommentMutation(cid).unwrap();
    } catch {
      setLikedComs((s) => { const n = new Set(s); was ? n.add(cid) : n.delete(cid); return n; });
    }
  }

  async function postComment() {
    if (!commentText.trim()) return;
    if (!currentUser) { setAuthView('signup'); return; }
    try {
      await createComment({ text: commentText.trim(), articleId: selectedId }).unwrap();
      setCommentText('');
    } catch (err) {
      console.error('Comment failed:', err);
    }
  }

  async function postReply(parentId) {
    if (!replyText.trim()) return;
    if (!currentUser) { setAuthView('signup'); return; }
    try {
      await createComment({ text: replyText.trim(), articleId: selectedId, parentId }).unwrap();
      setReplyText('');
      setReplyingTo(null);
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
      setAuthForm({ name: '', email: '', pass: '', role: 'user' });
    } catch (err) {
      setAuthError(err?.data?.message || 'Authentication failed. Please try again.');
    }
  }

  async function handleLogout() {
    try { await logoutMutation().unwrap(); } catch {}
    dispatch(clearCredentials());
  }

  function goHome()      { setSelectedId(null); setCurrentPage(null); window.scrollTo(0, 0); }
  function goPage(slug)  { setCurrentPage(slug); setSelectedId(null); window.scrollTo(0, 0); }

  function shareArticle(article, e) {
    e?.stopPropagation();
    const text = `${article.title} — WorldNewsNow`;
    if (navigator.share) {
      navigator.share({ title: article.title, text: article.excerpt, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
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
          setActiveCat={setActiveCat}
          currentUser={currentUser}
          setAuthView={setAuthView}
          setCurrentUser={() => handleLogout()}
          goHome={goHome}
          goPage={goPage}
        />

        <div style={{ flex: 1, width: '100%', maxWidth: 1200, margin: '0 auto',
          padding: '0 24px 80px', position: 'relative', zIndex: 1, boxSizing: 'border-box' }}>

          {currentPage === 'about'       ? <AboutPage       goHome={goHome} setAuthView={setAuthView} /> :
           currentPage === 'journalists' ? <JournalistsPage goHome={goHome} /> :
           currentPage === 'advertise'   ? <AdvertisePage   goHome={goHome} /> :
           currentPage === 'careers'     ? <CareersPage     goHome={goHome} setAuthView={setAuthView} /> :
           currentPage === 'journalist-dashboard' ? (
             currentUser?.role === 'journalist'
               ? <JournalistDashboard currentUser={currentUser} goHome={goHome} />
               : <>{goHome()}</>
           ) :
           !selectedId ? (
             <>
               {loadingArticles && (
                 <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)',
                   fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: 1 }}>
                   Loading stories…
                 </div>
               )}

               {!loadingArticles && featured && activeCat === 'ALL' && (
                 <FeaturedArticle
                   article={featured}
                   onClick={() => setSelectedId(featured.id)}
                   onLike={likeArticle}
                   isLiked={likedArts.has(featured.id)}
                 />
               )}

               {!loadingArticles && (
                 <>
                   <div style={{ display: 'flex', alignItems: 'center',
                     justifyContent: 'space-between', margin: '28px 0 16px',
                     borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
                     <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20,
                       letterSpacing: 3, color: 'var(--text)' }}>
                       {activeCat === 'ALL' ? 'LATEST STORIES' : activeCat}
                     </span>
                     <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11,
                       color: 'var(--muted)', letterSpacing: 1 }}>
                       {gridArticles.length} stories
                     </span>
                   </div>

                   <div style={{ display: 'grid',
                     gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 14 }}>
                     {gridArticles.map((a) => (
                       <ArticleCard key={a.id} article={a}
                         onClick={() => setSelectedId(a.id)}
                         onLike={likeArticle}
                         isLiked={likedArts.has(a.id)}
                       />
                     ))}
                   </div>
                 </>
               )}
             </>
           ) : loadingArticle ? (
             <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)',
               fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: 1 }}>
               Loading article…
             </div>
           ) : selected ? (
             <ArticleDetail
               article={{ ...selected, comments }}
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
               currentUser={currentUser}
               setAuthView={setAuthView}
             />
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
        showPass={showPass}
        setShowPass={setShowPass}
        authError={authError}
      />

      {shareFeedback && <div className="toast">✓ Link copied to clipboard</div>}
    </>
  );
}
