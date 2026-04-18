import { useState } from 'react';
import { CATS, CAT_STYLE } from '../data/constants';
import { wcCount } from '../utils/helpers';
import { RichTextEditor } from './RichTextEditor';
import { transformArticle } from '../utils/transforms';

import { useGetDashboardQuery, useUpdateJournalistProfileMutation } from '../store/journalistsApi';
import {
  useCreateArticleMutation, useUpdateArticleMutation,
  useDeleteArticleMutation, usePublishArticleMutation, useUnpublishArticleMutation,
} from '../store/articlesApi';

const EMPTY_FORM = {
  title:"", category:"WORLD", excerpt:"", content:"",
  breaking:false, featured:false, isDraft:false, isHtml:true,
};

export function JournalistDashboard({ currentUser, goHome }) {
  const [tab, setTab]               = useState("overview");
  const [form, setForm]             = useState(EMPTY_FORM);
  const [editingId, setEditingId]   = useState(null);
  const [artFilter, setArtFilter]   = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [publishToast, setPublishToast]   = useState(null);
  const [profileForm, setProfileForm] = useState({ specialty:"", bio:"", x:"" });
  const [profileSaved, setProfileSaved] = useState(false);

  const { data: dashData, isLoading: dashLoading } = useGetDashboardQuery();

  const [createArticle, { isLoading: creatingArticle }]   = useCreateArticleMutation();
  const [updateArticle, { isLoading: updatingArticle }]   = useUpdateArticleMutation();
  const [deleteArticleMut] = useDeleteArticleMutation();
  const [publishArticle]  = usePublishArticleMutation();
  const [unpublishArticle] = useUnpublishArticleMutation();
  const [updateProfile]   = useUpdateJournalistProfileMutation();
  const savingArticle = creatingArticle || updatingArticle;

  const myArticles = (dashData?.data?.articles || []).map(transformArticle);
  const published  = myArticles.filter(a => a.isPublished && !a.isDraft);
  const drafts     = myArticles.filter(a => a.isDraft);
  const stats      = dashData?.data?.stats || {};
  const totalLikes    = stats.totalLikes    || 0;
  const totalComments = stats.totalComments || 0;

  // initialise profile form from API on first load
  if (dashData?.data?.profile && !profileForm.specialty && !profileForm.bio) {
    const p = dashData.data.profile;
    if (p.specialty || p.bio || p.socialLinks?.x) {
      setProfileForm({
        specialty: p.specialty || "",
        bio:       p.bio || "",
        x:         p.socialLinks?.x || "",
      });
    }
  }

  function shown() {
    if (artFilter === "published") return published;
    if (artFilter === "drafts")    return drafts;
    return myArticles;
  }

  function startEdit(a) {
    setEditingId(a.id);
    setForm({
      title:a.title, category:a.category, excerpt:a.excerpt||"",
      content:a.content||"", breaking:a.breaking||false,
      featured:a.featured||false, isDraft:a.isDraft||false, isHtml:true,
    });
    setTab("write");
    window.scrollTo(0,0);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setTab("articles");
  }

  async function saveArticle(asDraft) {
    if (!form.title.trim()) return;
    try {
      if (editingId) {
        await updateArticle({ id: editingId, ...form, isDraft: asDraft }).unwrap();
        if (!asDraft) await publishArticle(editingId).unwrap().catch(() => {});
      } else {
        const res = await createArticle({ ...form, isDraft: asDraft }).unwrap();
        if (!asDraft && res.data?._id) await publishArticle(res.data._id).unwrap().catch(() => {});
      }
      setPublishToast(asDraft ? "Draft saved!" : "Article published!");
      setTimeout(() => setPublishToast(null), 2500);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setTab("articles");
    } catch (err) {
      setPublishToast("Error: " + (err?.data?.message || "Save failed"));
      setTimeout(() => setPublishToast(null), 3000);
    }
  }

  async function deleteArticle(id) {
    try {
      await deleteArticleMut(id).unwrap();
    } catch {}
    setDeleteConfirm(null);
  }

  async function togglePublish(a) {
    try {
      if (a.isDraft) await publishArticle(a.id).unwrap();
      else           await unpublishArticle(a.id).unwrap();
    } catch {}
  }

  async function saveProfile() {
    try {
      await updateProfile({
        specialty: profileForm.specialty,
        bio:       profileForm.bio,
        socialLinks: { x: profileForm.x },
      }).unwrap();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } catch {}
  }

  const TABS = [
    { id:"overview",  label:"Overview"   },
    { id:"articles",  label:"My Articles" },
    { id:"write",     label: editingId ? "✎ Edit Article" : "+ Write Article" },
    { id:"comments",  label:"Comments"   },
    { id:"profile",   label:"Profile"    },
  ];

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px 80px" }}>
      {publishToast && <div className="toast">{publishToast}</div>}

      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"28px 0 24px", borderBottom:"1px solid var(--border)", marginBottom:28,
      }}>
        <div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"var(--gold)",
            letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>
            ✍ Journalist Dashboard
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:42,
            letterSpacing:3, color:"var(--text)", lineHeight:1 }}>
            Welcome back, {currentUser.name.split(" ")[0]}
          </h1>
        </div>
        <button className="btn-ghost" onClick={goHome}
          style={{ fontSize:12, padding:"7px 16px" }}>
          ← Back to News
        </button>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:32, flexWrap:"wrap" }}>
        {TABS.map(t => (
          <button key={t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id !== "write") { setEditingId(null); setForm(EMPTY_FORM); }
            }}
            style={{
              background: tab===t.id ? "rgba(212,168,83,0.12)" : "var(--d3)",
              border:`1px solid ${tab===t.id ? "var(--gold)" : "var(--border)"}`,
              color: tab===t.id ? "var(--gold)" : "var(--muted)",
              padding:"8px 18px", borderRadius:8, cursor:"pointer",
              fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:1,
              textTransform:"uppercase", transition:"all .2s", position:"relative",
            }}>
            {t.label}
            {t.id==="articles" && drafts.length > 0 && (
              <span style={{
                marginLeft:6, background:"rgba(212,168,83,0.25)", color:"var(--gold)",
                borderRadius:100, padding:"1px 6px", fontSize:9,
              }}>{drafts.length}</span>
            )}
            {t.id==="comments" && totalComments > 0 && (
              <span style={{
                marginLeft:6, background:"rgba(74,222,128,0.15)", color:"var(--green)",
                borderRadius:100, padding:"1px 6px", fontSize:9,
              }}>{totalComments}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ animation:"fadeUp .3s ease" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
            gap:12, marginBottom:32 }}>
            {[
              { value:published.length, label:"Published",    color:"var(--gold)"  },
              { value:drafts.length,    label:"Drafts",       color:"var(--blue)"  },
              { value:totalLikes,       label:"Total Likes",  color:"#F87171"      },
              { value:totalComments,    label:"Comments",     color:"var(--green)" },
            ].map(s => (
              <div key={s.label} style={{
                background:"var(--d2)", border:"1px solid var(--border)",
                borderRadius:12, padding:"22px 18px", textAlign:"center",
              }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:52,
                  letterSpacing:2, color:s.color, lineHeight:1, marginBottom:6 }}>
                  {s.value}
                </div>
                <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"'DM Mono',monospace",
                  letterSpacing:1.5, textTransform:"uppercase" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, marginBottom:36, flexWrap:"wrap" }}>
            <button className="btn-gold" style={{ padding:"11px 22px" }}
              onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setTab("write"); }}>
              + Write New Article
            </button>
            <button className="btn-ghost" style={{ padding:"11px 22px" }}
              onClick={() => setTab("articles")}>
              Manage Articles
            </button>
            <button className="btn-ghost" style={{ padding:"11px 22px" }}
              onClick={() => setTab("comments")}>
              View Comments
            </button>
          </div>

          {published.length > 0 ? (
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:3,
                color:"var(--text)", marginBottom:16, paddingBottom:12,
                borderBottom:"1px solid var(--border)" }}>
                Recent Articles
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[...published].reverse().slice(0,4).map(a => (
                  <div key={a.id} style={{
                    background:"var(--d2)", border:"1px solid var(--border)",
                    borderRadius:10, padding:"16px 18px",
                    display:"flex", alignItems:"center", justifyContent:"space-between", gap:12,
                  }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:6, flexWrap:"wrap" }}>
                        <span style={{ ...CAT_STYLE[a.category],
                          border:`1px solid ${CAT_STYLE[a.category]?.border}`,
                          padding:"2px 8px", borderRadius:4, fontSize:9,
                          fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>
                          {a.category}
                        </span>
                        {a.breaking && (
                          <span style={{ background:"rgba(248,113,113,0.1)",
                            border:"1px solid rgba(248,113,113,0.3)", color:"#F87171",
                            padding:"2px 7px", borderRadius:4, fontSize:9,
                            fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>⚡ BREAKING</span>
                        )}
                        {a.featured && (
                          <span style={{ background:"rgba(212,168,83,0.1)",
                            border:"1px solid rgba(212,168,83,0.3)", color:"var(--gold)",
                            padding:"2px 7px", borderRadius:4, fontSize:9,
                            fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>★ FEATURED</span>
                        )}
                      </div>
                      <div style={{ fontSize:14, fontWeight:600, color:"var(--text)",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {a.title}
                      </div>
                      <div style={{ fontSize:11, color:"var(--muted)", marginTop:5,
                        fontFamily:"'DM Mono',monospace" }}>
                        {a.time} · ♡ {a.likes||0} · ◎ {a.commentsCount||0}
                        {a.isHtml && a.content && (
                          <> · {wcCount(a.content)} words · {Math.max(1,Math.ceil(wcCount(a.content)/238))} min read</>
                        )}
                      </div>
                    </div>
                    <button onClick={() => startEdit(a)} style={{
                      flexShrink:0, background:"var(--d4)", border:"1px solid var(--border)",
                      color:"var(--muted)", padding:"6px 14px", borderRadius:7, cursor:"pointer",
                      fontSize:11, fontFamily:"'DM Mono',monospace", transition:"all .15s",
                    }}>✎ Edit</button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
              borderRadius:14, padding:"56px 32px", textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✍</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:2,
                color:"var(--text)", marginBottom:10 }}>No Articles Yet</div>
              <p style={{ fontSize:14, color:"var(--muted)", maxWidth:400,
                margin:"0 auto 24px", lineHeight:1.75 }}>
                You haven't published anything yet. Write your first story.
              </p>
              <button className="btn-gold" style={{ padding:"11px 24px" }}
                onClick={() => setTab("write")}>
                Write Your First Article
              </button>
            </div>
          )}
        </div>
      )}

      {tab === "articles" && (
        <div style={{ animation:"fadeUp .3s ease" }}>
          <div style={{ display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:20 }}>
            <div style={{ display:"flex", gap:7 }}>
              {[["all","All"],["published","Published"],["drafts","Drafts"]].map(([v,l]) => (
                <button key={v} onClick={() => setArtFilter(v)} style={{
                  background: artFilter===v ? "rgba(212,168,83,0.12)" : "var(--d3)",
                  border:`1px solid ${artFilter===v ? "var(--gold)" : "var(--border)"}`,
                  color: artFilter===v ? "var(--gold)" : "var(--muted)",
                  padding:"6px 14px", borderRadius:20, cursor:"pointer",
                  fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:1.5,
                  transition:"all .2s",
                }}>
                  {l}{v==="drafts" && drafts.length > 0 ? ` (${drafts.length})` : ""}
                </button>
              ))}
            </div>
            <button className="btn-gold" style={{ padding:"8px 18px", fontSize:12 }}
              onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setTab("write"); }}>
              + New Article
            </button>
          </div>

          {shown().length === 0 ? (
            <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
              borderRadius:12, padding:"48px 24px", textAlign:"center" }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
              <div style={{ fontSize:15, color:"var(--muted)" }}>No articles here yet.</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[...shown()].reverse().map(a => (
                <div key={a.id} style={{
                  background:"var(--d2)", border:"1px solid var(--border)",
                  borderRadius:12, padding:"18px 20px",
                }}>
                  <div style={{ display:"flex", alignItems:"flex-start",
                    justifyContent:"space-between", gap:16 }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap",
                        marginBottom:8, alignItems:"center" }}>
                        <span style={{ ...CAT_STYLE[a.category],
                          border:`1px solid ${CAT_STYLE[a.category]?.border}`,
                          padding:"2px 8px", borderRadius:4, fontSize:9,
                          fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>
                          {a.category}
                        </span>
                        {a.isDraft && (
                          <span style={{ background:"rgba(96,165,250,0.1)",
                            border:"1px solid rgba(96,165,250,0.3)", color:"var(--blue)",
                            padding:"2px 7px", borderRadius:4, fontSize:9,
                            fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>DRAFT</span>
                        )}
                        {a.breaking && (
                          <span style={{ background:"rgba(248,113,113,0.1)",
                            border:"1px solid rgba(248,113,113,0.3)", color:"#F87171",
                            padding:"2px 7px", borderRadius:4, fontSize:9,
                            fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>⚡ BREAKING</span>
                        )}
                        {a.featured && (
                          <span style={{ background:"rgba(212,168,83,0.1)",
                            border:"1px solid rgba(212,168,83,0.3)", color:"var(--gold)",
                            padding:"2px 7px", borderRadius:4, fontSize:9,
                            fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>★ FEATURED</span>
                        )}
                      </div>
                      <div style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:6 }}>
                        {a.title}
                      </div>
                      {a.excerpt && (
                        <div style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6,
                          marginBottom:10, display:"-webkit-box", WebkitLineClamp:2,
                          WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                          {a.excerpt}
                        </div>
                      )}
                      <div style={{ fontSize:11, color:"var(--muted)",
                        fontFamily:"'DM Mono',monospace", display:"flex", gap:16, flexWrap:"wrap" }}>
                        <span>{a.time}</span>
                        <span>♡ {a.likes||0}</span>
                        <span>◎ {a.commentsCount || 0}</span>
                        {a.isHtml && a.content && (
                          <span>{wcCount(a.content)} words · {Math.max(1,Math.ceil(wcCount(a.content)/238))} min read</span>
                        )}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                      <button onClick={() => startEdit(a)} style={{
                        background:"var(--d3)", border:"1px solid var(--border)",
                        color:"var(--muted)", padding:"6px 14px", borderRadius:7,
                        cursor:"pointer", fontSize:11, fontFamily:"'DM Mono',monospace",
                        transition:"all .15s",
                      }}>✎ Edit</button>
                      <button onClick={() => togglePublish(a)} style={{
                        background: a.isDraft ? "rgba(74,222,128,0.08)" : "rgba(96,165,250,0.08)",
                        border:`1px solid ${a.isDraft ? "rgba(74,222,128,0.3)" : "rgba(96,165,250,0.3)"}`,
                        color: a.isDraft ? "var(--green)" : "var(--blue)",
                        padding:"6px 14px", borderRadius:7, cursor:"pointer",
                        fontSize:11, fontFamily:"'DM Mono',monospace", transition:"all .15s",
                      }}>{a.isDraft ? "↑ Publish" : "↓ Unpublish"}</button>
                      <button onClick={() => updateArticle({ id:a.id, featured:!a.featured })} style={{
                        background: a.featured ? "rgba(212,168,83,0.1)" : "transparent",
                        border:`1px solid ${a.featured ? "rgba(212,168,83,0.4)" : "var(--border)"}`,
                        color: a.featured ? "var(--gold)" : "var(--muted)",
                        padding:"6px 14px", borderRadius:7, cursor:"pointer",
                        fontSize:11, fontFamily:"'DM Mono',monospace", transition:"all .15s",
                      }}>{a.featured ? "★ Featured" : "☆ Feature"}</button>
                      <button onClick={() => updateArticle({ id:a.id, breaking:!a.breaking })} style={{
                        background: a.breaking ? "rgba(248,113,113,0.08)" : "transparent",
                        border:`1px solid ${a.breaking ? "rgba(248,113,113,0.35)" : "var(--border)"}`,
                        color: a.breaking ? "#F87171" : "var(--muted)",
                        padding:"6px 14px", borderRadius:7, cursor:"pointer",
                        fontSize:11, fontFamily:"'DM Mono',monospace", transition:"all .15s",
                      }}>⚡ {a.breaking ? "Breaking" : "Breaking?"}</button>
                      <button onClick={() => setDeleteConfirm(a.id)} style={{
                        background:"transparent",
                        border:"1px solid rgba(248,113,113,0.2)",
                        color:"rgba(248,113,113,0.6)", padding:"6px 14px", borderRadius:7,
                        cursor:"pointer", fontSize:11, fontFamily:"'DM Mono',monospace",
                        transition:"all .15s",
                      }}>🗑 Delete</button>
                    </div>
                  </div>
                  {deleteConfirm === a.id && (
                    <div style={{
                      marginTop:14, padding:"12px 16px",
                      background:"rgba(248,113,113,0.06)",
                      border:"1px solid rgba(248,113,113,0.22)", borderRadius:8,
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                    }}>
                      <span style={{ fontSize:13, color:"#F87171" }}>
                        Permanently delete this article?
                      </span>
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => setDeleteConfirm(null)} style={{
                          background:"var(--d4)", border:"1px solid var(--border)",
                          color:"var(--muted)", padding:"6px 14px", borderRadius:6,
                          cursor:"pointer", fontSize:12,
                        }}>Cancel</button>
                        <button onClick={() => deleteArticle(a.id)} style={{
                          background:"rgba(248,113,113,0.15)",
                          border:"1px solid rgba(248,113,113,0.4)",
                          color:"#F87171", padding:"6px 14px", borderRadius:6,
                          cursor:"pointer", fontSize:12,
                        }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "write" && (
        <div style={{ animation:"fadeUp .3s ease" }}>
          <div style={{ display:"flex", alignItems:"center",
            justifyContent:"space-between", marginBottom:24 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28,
              letterSpacing:3, color:"var(--text)" }}>
              {editingId ? "Edit Article" : "New Article"}
            </div>
            {editingId && (
              <button className="btn-ghost" style={{ fontSize:12, padding:"7px 16px" }}
                onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:20, alignItems:"start" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ display:"block", fontSize:10, color:"var(--muted)",
                  fontFamily:"'DM Mono',monospace", letterSpacing:1.5,
                  textTransform:"uppercase", marginBottom:8 }}>
                  Headline *
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title:e.target.value }))}
                  placeholder="Write a compelling headline…"
                  style={{ width:"100%", background:"var(--d4)",
                    border:"1px solid var(--border)", color:"var(--text)",
                    borderRadius:8, padding:"13px 16px", fontSize:20,
                    fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1.5,
                    outline:"none", transition:"border-color .2s",
                  }}
                />
              </div>

              <div>
                <label style={{ display:"block", fontSize:10, color:"var(--muted)",
                  fontFamily:"'DM Mono',monospace", letterSpacing:1.5,
                  textTransform:"uppercase", marginBottom:8 }}>
                  Excerpt / Summary *
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt:e.target.value }))}
                  placeholder="A 1–2 sentence summary shown in article cards and previews…"
                  rows={3}
                  style={{ width:"100%", background:"var(--d4)",
                    border:"1px solid var(--border)", color:"var(--text)",
                    borderRadius:8, padding:"12px 14px", fontSize:14,
                    fontFamily:"'DM Sans',sans-serif", resize:"vertical",
                    outline:"none", lineHeight:1.6, transition:"border-color .2s",
                  }}
                />
              </div>

              <div>
                <div style={{ display:"flex", justifyContent:"space-between",
                  alignItems:"center", marginBottom:8 }}>
                  <label style={{ fontSize:10, color:"var(--muted)",
                    fontFamily:"'DM Mono',monospace", letterSpacing:1.5, textTransform:"uppercase" }}>
                    Article Body *
                  </label>
                  {form.content && wcCount(form.content) > 0 && (
                    <span style={{ fontSize:10, color:"var(--muted)",
                      fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>
                      {wcCount(form.content)} words ·{" "}
                      {Math.max(1, Math.ceil(wcCount(form.content)/238))} min read
                    </span>
                  )}
                </div>
                <RichTextEditor
                  key={editingId || "new"}
                  initialValue={form.content}
                  onChange={v => setForm(f => ({ ...f, content:v }))}
                  placeholder="Write your full article here. Use the toolbar to format text, add headings, blockquotes, and lists…"
                />
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
                borderRadius:12, padding:18 }}>
                <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"'DM Mono',monospace",
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:12 }}>Category</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {CATS.filter(c => c !== "ALL").map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, category:c }))} style={{
                      background: form.category===c ? (CAT_STYLE[c]?.bg||"rgba(212,168,83,0.12)") : "transparent",
                      border:`1px solid ${form.category===c ? (CAT_STYLE[c]?.border||"var(--gold)") : "var(--border)"}`,
                      color: form.category===c ? (CAT_STYLE[c]?.color||"var(--gold)") : "var(--muted)",
                      padding:"4px 10px", borderRadius:6, cursor:"pointer",
                      fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:1.5,
                      transition:"all .15s",
                    }}>{c}</button>
                  ))}
                </div>
              </div>

              <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
                borderRadius:12, padding:18 }}>
                <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"'DM Mono',monospace",
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:12 }}>Article Flags</div>
                {[
                  { key:"breaking", label:"Breaking News",   desc:"Shows ⚡ BREAKING badge",    onColor:"#F87171",       onBorder:"rgba(248,113,113,0.4)" },
                  { key:"featured", label:"Featured Story",  desc:"Shown in the hero section",   onColor:"var(--gold)",   onBorder:"rgba(212,168,83,0.45)" },
                ].map(opt => (
                  <div key={opt.key}
                    onClick={() => setForm(f => ({ ...f, [opt.key]:!f[opt.key] }))}
                    style={{
                      display:"flex", alignItems:"center", justifyContent:"space-between",
                      padding:"10px 12px", borderRadius:8, marginBottom:8, cursor:"pointer",
                      background: form[opt.key] ? `rgba(${opt.key==="breaking"?"248,113,113":"212,168,83"},0.06)` : "var(--d4)",
                      border:`1px solid ${form[opt.key] ? opt.onBorder : "var(--border)"}`,
                      transition:"all .15s",
                    }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:500,
                        color: form[opt.key] ? opt.onColor : "var(--text)" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize:10, color:"var(--muted)", marginTop:2 }}>{opt.desc}</div>
                    </div>
                    <div style={{
                      width:36, height:20, borderRadius:100, position:"relative",
                      background: form[opt.key] ? opt.onColor : "var(--d3)",
                      border:`1px solid ${form[opt.key] ? opt.onColor : "var(--border)"}`,
                      transition:"all .2s", flexShrink:0,
                    }}>
                      <div style={{
                        width:14, height:14, borderRadius:"50%", background:"#fff",
                        position:"absolute", top:2,
                        left: form[opt.key] ? 18 : 2,
                        transition:"left .2s",
                      }}/>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
                borderRadius:12, padding:18 }}>
                <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"'DM Mono',monospace",
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:12 }}>Byline</div>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0,
                    background:"rgba(212,168,83,0.15)", border:"2px solid rgba(212,168,83,0.3)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:15, fontWeight:700, color:"var(--gold)" }}>
                    {currentUser.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--text)" }}>
                      {currentUser.name}
                    </div>
                    <span style={{ fontSize:9, background:"rgba(212,168,83,0.15)",
                      color:"var(--gold)", padding:"2px 6px", borderRadius:4,
                      fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>
                      ✍ JOURNALIST
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
                borderRadius:12, padding:18 }}>
                <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"'DM Mono',monospace",
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:12 }}>Publish</div>
                {!form.title.trim() && (
                  <div style={{ fontSize:11, color:"rgba(248,113,113,0.75)",
                    marginBottom:10, fontFamily:"'DM Mono',monospace" }}>
                    * Headline is required
                  </div>
                )}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  <button className="btn-gold"
                    style={{ width:"100%", padding:"12px 16px", fontSize:14, opacity: form.title.trim() ? 1 : 0.45 }}
                    disabled={!form.title.trim() || savingArticle}
                    onClick={() => saveArticle(false)}>
                    {savingArticle ? "Publishing..." : (editingId ? "Update & Publish" : "Publish Now")}
                  </button>
                  <button
                    disabled={!form.title.trim() || savingArticle}
                    onClick={() => saveArticle(true)}
                    style={{
                      width:"100%", background:"transparent",
                      border:"1px solid var(--border)", color:"var(--muted)",
                      padding:"11px 16px", borderRadius:8, cursor:"pointer",
                      fontSize:13, fontFamily:"'DM Sans',sans-serif",
                      transition:"all .2s", opacity: form.title.trim() ? 1 : 0.45,
                    }}>
                    {savingArticle ? "Saving..." : "Save as Draft"}
                  </button>
                </div>
              </div>

              <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
                borderRadius:12, padding:18 }}>
                <div style={{ fontSize:10, color:"var(--muted)", fontFamily:"'DM Mono',monospace",
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:12 }}>
                  Pre-publish Checklist
                </div>
                {[
                  { label:"Headline written",  done: !!form.title.trim() },
                  { label:"Excerpt added",      done: !!form.excerpt.trim() },
                  { label:"Body has content",   done: wcCount(form.content) > 10 },
                  { label:"Category selected",  done: !!form.category },
                ].map(item => (
                  <div key={item.label} style={{ display:"flex", alignItems:"center",
                    gap:8, marginBottom:7 }}>
                    <div style={{
                      width:16, height:16, borderRadius:4, flexShrink:0,
                      background: item.done ? "rgba(74,222,128,0.15)" : "var(--d4)",
                      border:`1px solid ${item.done ? "rgba(74,222,128,0.5)" : "var(--border)"}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:9, color:"var(--green)",
                    }}>
                      {item.done ? "✓" : ""}
                    </div>
                    <span style={{ fontSize:12, color: item.done ? "var(--text)" : "var(--muted)" }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "comments" && (
        <div style={{ animation:"fadeUp .3s ease" }}>
          {myArticles.filter(a => (a.commentsCount || 0) > 0).length === 0 ? (
            <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
              borderRadius:14, padding:"56px 32px", textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>💬</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:26, letterSpacing:2,
                color:"var(--text)", marginBottom:10 }}>No Comments Yet</div>
              <p style={{ fontSize:14, color:"var(--muted)", maxWidth:400,
                margin:"0 auto", lineHeight:1.75 }}>
                Reader comments on your articles will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
              {myArticles.filter(a => (a.commentsCount || 0) > 0).map(a => (
                <div key={a.id}>
                  <div style={{ display:"flex", alignItems:"center", gap:10,
                    marginBottom:14, paddingBottom:12, borderBottom:"1px solid var(--border)" }}>
                    <span style={{ ...CAT_STYLE[a.category],
                      border:`1px solid ${CAT_STYLE[a.category]?.border}`,
                      padding:"2px 8px", borderRadius:4, fontSize:9,
                      fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>
                      {a.category}
                    </span>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17,
                      letterSpacing:1.5, color:"var(--text)" }}>
                      {a.title}
                    </span>
                    <span style={{ marginLeft:"auto", fontSize:11, color:"var(--muted)",
                      fontFamily:"'DM Mono',monospace" }}>
                      {a.commentsCount} comment{a.commentsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div style={{ background:"var(--d3)", border:"1px solid var(--border)",
                    borderRadius:10, padding:"14px 16px", fontSize:13,
                    color:"var(--muted)", fontFamily:"'DM Mono',monospace" }}>
                    Open article to view full comment thread →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "profile" && (
        <div style={{ animation:"fadeUp .3s ease", maxWidth:640 }}>
          <div style={{ background:"var(--d2)", border:"1px solid var(--border)",
            borderRadius:14, padding:30 }}>
            <div style={{ display:"flex", alignItems:"center", gap:18,
              marginBottom:28, paddingBottom:24, borderBottom:"1px solid var(--border)" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", flexShrink:0,
                background:"rgba(212,168,83,0.15)", border:"2px solid rgba(212,168,83,0.35)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:28, fontWeight:700, color:"var(--gold)" }}>
                {currentUser.name[0]}
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:600, color:"var(--text)", marginBottom:6 }}>
                  {currentUser.name}
                </div>
                <span style={{ fontSize:9, background:"rgba(212,168,83,0.15)", color:"var(--gold)",
                  padding:"3px 8px", borderRadius:4, fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>
                  ✍ JOURNALIST · {published.length} ARTICLES
                </span>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { key:"specialty", label:"Specialty / Beat",    ph:"e.g. Technology & AI" },
                { key:"x",         label:"Twitter / X Handle",  ph:"@yourhandle" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display:"block", fontSize:10, color:"var(--muted)",
                    fontFamily:"'DM Mono',monospace", letterSpacing:1.5,
                    textTransform:"uppercase", marginBottom:8 }}>
                    {f.label}
                  </label>
                  <input
                    value={profileForm[f.key] || ""}
                    placeholder={f.ph}
                    onChange={e => setProfileForm(p => ({ ...p, [f.key]:e.target.value }))}
                    style={{ width:"100%", background:"var(--d4)",
                      border:"1px solid var(--border)", color:"var(--text)",
                      borderRadius:8, padding:"10px 14px", fontSize:13,
                      fontFamily:"'DM Sans',sans-serif", outline:"none",
                      transition:"border-color .2s",
                    }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display:"block", fontSize:10, color:"var(--muted)",
                  fontFamily:"'DM Mono',monospace", letterSpacing:1.5,
                  textTransform:"uppercase", marginBottom:8 }}>Bio</label>
                <textarea
                  value={profileForm.bio || ""}
                  onChange={e => setProfileForm(p => ({ ...p, bio:e.target.value }))}
                  placeholder="A short bio shown on your journalist profile page…"
                  rows={4}
                  style={{ width:"100%", background:"var(--d4)",
                    border:"1px solid var(--border)", color:"var(--text)",
                    borderRadius:8, padding:"10px 14px", fontSize:13,
                    fontFamily:"'DM Sans',sans-serif", resize:"vertical",
                    outline:"none", lineHeight:1.6,
                  }}
                />
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"center",
              justifyContent:"space-between", marginTop:22 }}>
              {profileSaved ? (
                <span style={{ fontSize:12, color:"var(--green)",
                  fontFamily:"'DM Mono',monospace", letterSpacing:0.5 }}>
                  ✓ Profile saved
                </span>
              ) : <span />}
              <button className="btn-gold" style={{ padding:"11px 24px" }} onClick={saveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}