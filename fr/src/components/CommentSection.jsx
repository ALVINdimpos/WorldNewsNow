import { useState } from "react";

export function CommentItem({ 
  c, 
  articleId, 
  depth, 
  likedComs, 
  onLikeCom, 
  replyingTo, 
  setReplyingTo,
  replyText, 
  setReplyText, 
  onReply, 
  commentAs, 
  setCommentAs,
  currentUser, 
  setAuthView 
}) {
  const liked = likedComs.has(c.id);
  const isReplying = replyingTo === c.id;

  return (
    <div style={{
      marginLeft: depth > 0 ? 20 : 0,
      borderLeft: depth > 0 ? "2px solid rgba(212,168,83,0.2)" : "none",
      paddingLeft: depth > 0 ? 16 : 0,
      marginTop: 14,
    }}>
      <div style={{background:"var(--d3)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{
              width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:12,fontWeight:600,flexShrink:0,
              background: c.role==="journalist"?"rgba(212,168,83,0.2)":c.role==="anonymous"?"rgba(122,128,144,0.2)":"rgba(96,165,250,0.15)",
              color: c.role==="journalist"?"var(--gold)":c.role==="anonymous"?"var(--muted)":"#60A5FA",
            }}>{c.author[0]}</div>
            <div>
              <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{c.author}</span>
              {c.role==="journalist" && (
                <span style={{marginLeft:6,fontSize:9,fontFamily:"'DM Mono',monospace",letterSpacing:1,
                  background:"rgba(212,168,83,0.15)",color:"var(--gold)",padding:"2px 6px",borderRadius:4}}>
                  PRESS
                </span>
              )}
              {c.role==="anonymous" && (
                <span style={{marginLeft:6,fontSize:9,fontFamily:"'DM Mono',monospace",letterSpacing:1,color:"var(--muted)"}}>
                  ANON
                </span>
              )}
            </div>
          </div>
          <span style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>{c.time}</span>
        </div>
        <p style={{fontSize:13,color:"var(--text)",lineHeight:1.65,marginBottom:10}}>{c.text}</p>
        <div style={{display:"flex",gap:12}}>
          <button onClick={() => onLikeCom(articleId, c.id, liked)} style={{
            background:"none",border:"none",cursor:"pointer",padding:"3px 8px",
            borderRadius:6,fontSize:12,color:liked?"#F87171":"var(--muted)",
            fontFamily:"'DM Mono',monospace",letterSpacing:0.5,
            transition:"all 0.15s",
          }}>
            {liked ? "♥" : "♡"} {c.likes}
          </button>
          <button onClick={() => setReplyingTo(isReplying ? null : c.id)} style={{
            background:"none",border:"none",cursor:"pointer",padding:"3px 10px",
            borderRadius:6,fontSize:12,color:"var(--muted)",fontFamily:"'DM Mono',monospace",
            letterSpacing:0.5,transition:"all 0.15s",
          }}>
            ↩ Reply
          </button>
        </div>
      </div>

      {isReplying && (
        <div style={{marginTop:8,background:"var(--d2)",border:"1px solid var(--border)",borderRadius:10,padding:14}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,fontSize:12,color:"var(--muted)",flexWrap:"wrap"}}>
            <span>Reply as:</span>
            <button onClick={() => { if(!currentUser) setAuthView("signup"); else setCommentAs("user"); }}
              style={{background:commentAs==="user"?"rgba(212,168,83,0.15)":"rgba(255,255,255,0.04)",
                border:`1px solid ${commentAs==="user"?"var(--gold)":"var(--border)"}`,
                color:commentAs==="user"?"var(--gold)":"var(--muted)",
                padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11,
                fontFamily:"'DM Mono',monospace",letterSpacing:0.5}}>
              {currentUser ? currentUser.name : "Sign in"}
            </button>
            <button onClick={() => setCommentAs("anonymous")}
              style={{background:commentAs==="anonymous"?"rgba(122,128,144,0.15)":"rgba(255,255,255,0.04)",
                border:`1px solid ${commentAs==="anonymous"?"var(--muted)":"var(--border)"}`,
                color:"var(--muted)",padding:"3px 10px",borderRadius:6,
                cursor:"pointer",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:0.5}}>
              Anonymous
            </button>
          </div>
          <textarea
            value={replyText} onChange={e => setReplyText(e.target.value)}
            placeholder={`Replying to ${c.author}…`} rows={2}
            style={{width:"100%",background:"var(--d4)",border:"1px solid var(--border)",
              color:"var(--text)",borderRadius:8,padding:"10px 12px",fontSize:13,
              fontFamily:"'DM Sans',sans-serif",resize:"none",outline:"none",
              transition:"border-color 0.2s"}}
          />
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:8}}>
            <button onClick={() => setReplyingTo(null)} style={{
              background:"var(--d4)",border:"1px solid var(--border)",color:"var(--muted)",
              padding:"7px 14px",borderRadius:7,cursor:"pointer",fontSize:12,
              fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
            <button onClick={() => onReply(c.id)} style={{
              background:"var(--gold)",color:"var(--dark)",border:"none",
              padding:"7px 16px",borderRadius:7,cursor:"pointer",fontSize:12,
              fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"background 0.2s"}}>
              Post Reply
            </button>
          </div>
        </div>
      )}

      {c.replies.length > 0 && (
        <div>
          {c.replies.map(r => (
            <CommentItem key={r.id} c={r} articleId={articleId} depth={depth+1}
              likedComs={likedComs} onLikeCom={onLikeCom}
              replyingTo={replyingTo} setReplyingTo={setReplyingTo}
              replyText={replyText} setReplyText={setReplyText} onReply={onReply}
              commentAs={commentAs} setCommentAs={setCommentAs}
              currentUser={currentUser} setAuthView={setAuthView} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({
  comments,
  articleId,
  likedComs,
  onLikeCom,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  onReply,
  commentAs,
  setCommentAs,
  currentUser,
  setAuthView,
  commentText,
  setCommentText,
  onPostComment
}) {
  const [localCommentText, setLocalCommentText] = useState("");
  const [localPostComment, setLocalPostComment] = useState(() => () => {});
  
  const text = commentText !== undefined ? commentText : localCommentText;
  const setText = setCommentText || setLocalCommentText;
  const postComment = onPostComment || localPostComment;
  return (
    <div style={{marginTop:48,borderTop:"2px solid var(--border)",paddingTop:32}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:3,color:"var(--text)"}}>
          COMMENTS
        </span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--muted)",letterSpacing:1}}>
          {comments.length} total
        </span>
      </div>

      <div style={{background:"var(--d2)",border:"1px solid var(--border)",borderRadius:12,padding:18,marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <span style={{fontSize:12,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:0.5}}>
            Comment as:
          </span>
          <button
            onClick={()=>{ if(!currentUser) setAuthView("signup"); else setCommentAs("user"); }}
            style={{background:commentAs==="user"?"rgba(212,168,83,0.15)":"rgba(255,255,255,0.04)",
              border:`1px solid ${commentAs==="user"?"var(--gold)":"var(--border)"}`,
              color:commentAs==="user"?"var(--gold)":"var(--muted)",
              padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:11,
              fontFamily:"'DM Mono',monospace",letterSpacing:0.5,transition:"all .15s"}}>
            {currentUser ? (currentUser.role==="journalist"?"✍ "+currentUser.name:currentUser.name) : "Sign in / Join"}
          </button>
          <button
            onClick={()=>setCommentAs("anonymous")}
            style={{background:commentAs==="anonymous"?"rgba(122,128,144,0.15)":"rgba(255,255,255,0.04)",
              border:`1px solid ${commentAs==="anonymous"?"rgba(122,128,144,0.5)":"var(--border)"}`,
              color:"var(--muted)",padding:"4px 12px",borderRadius:6,cursor:"pointer",
              fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:0.5,transition:"all .15s"}}>
            Anonymous
          </button>
        </div>
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="Share your perspective on this story…"
          rows={3}
          style={{width:"100%",background:"var(--d4)",border:"1px solid var(--border)",
            color:"var(--text)",borderRadius:8,padding:"12px 14px",fontSize:14,
            fontFamily:"'DM Sans',sans-serif",resize:"none",lineHeight:1.6,
            transition:"border-color .2s"}}
        />
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
          <span style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:0.5}}>
            {commentAs==="anonymous"?"Posting anonymously":"Posting as "+(currentUser?.name||"...")}
          </span>
          <button className="btn-gold" onClick={postComment}>Post Comment</button>
        </div>
      </div>

      {comments.length === 0 ? (
        <div style={{textAlign:"center",padding:"40px 20px",color:"var(--muted)",fontSize:14}}>
          Be the first to comment on this story.
        </div>
      ) : (
        <div>
          {comments.map(c => (
            <CommentItem key={c.id} c={c} articleId={articleId} depth={0}
              likedComs={likedComs} onLikeCom={onLikeCom}
              replyingTo={replyingTo} setReplyingTo={setReplyingTo}
              replyText={replyText} setReplyText={setReplyText}
              onReply={onReply} commentAs={commentAs} setCommentAs={setCommentAs}
              currentUser={currentUser} setAuthView={setAuthView} />
          ))}
        </div>
      )}
    </div>
  );
}