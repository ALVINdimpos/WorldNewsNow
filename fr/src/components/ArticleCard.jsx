import { CAT_STYLE } from '../data/constants';
import { countAll } from '../utils/helpers';

export function ArticleCard({ article, onClick, onLike, isLiked }) {
  return (
    <div className="art-card" onClick={onClick}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{...CAT_STYLE[article.category],border:`1px solid ${CAT_STYLE[article.category]?.border}`,
          padding:"3px 9px",borderRadius:5,fontSize:9,
          fontFamily:"'DM Mono',monospace",letterSpacing:1.5}}>
          {article.category}
        </span>
        {article.breaking && (
          <span style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",
            color:"#F87171",padding:"2px 8px",borderRadius:5,fontSize:9,
            fontFamily:"'DM Mono',monospace",letterSpacing:1}}>⚡ BREAKING</span>
        )}
      </div>
      <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1.5,
        lineHeight:1.1,color:"var(--text)",marginBottom:10}}>
        {article.title}
      </h2>
      <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.6,marginBottom:16,
        display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden"}}>
        {article.excerpt}
      </p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
        borderTop:"1px solid var(--border)",paddingTop:12}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:26,height:26,borderRadius:"50%",
            background: article.author.role==="journalist"?"rgba(212,168,83,0.2)":"rgba(96,165,250,0.12)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:11,fontWeight:600,
            color: article.author.role==="journalist"?"var(--gold)":"var(--blue)"}}>
            {article.author.name[0]}
          </div>
          <div>
            <div style={{fontSize:12,fontWeight:600,color:"var(--text)",display:"flex",alignItems:"center",gap:4}}>
              {article.author.name}
              {article.author.role==="journalist"&&(
                <span style={{fontSize:8,background:"rgba(212,168,83,0.15)",color:"var(--gold)",
                  padding:"1px 5px",borderRadius:3,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>
                  PRESS
                </span>
              )}
            </div>
            <div style={{fontSize:10,color:"var(--muted)"}}>{article.time}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span onClick={e=>onLike(article.id,e)} style={{
            cursor:"pointer",fontSize:12,
            color:isLiked?"#F87171":"var(--muted)",
            fontFamily:"'DM Mono',monospace",display:"flex",alignItems:"center",gap:4}}>
            {isLiked?"♥":"♡"} {article.likes}
          </span>
          <span style={{fontSize:12,color:"var(--muted)",fontFamily:"'DM Mono',monospace",
            display:"flex",alignItems:"center",gap:4}}>
            ◎ {countAll(article.comments)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FeaturedArticle({ article, onClick, onLike, isLiked }) {
  return (
    <div onClick={onClick} style={{
      background:"var(--d2)",border:"1px solid var(--border)",borderRadius:14,
      padding:"36px 40px",margin:"32px 0 20px",cursor:"pointer",
      transition:"all .2s",position:"relative",overflow:"hidden",
    }} className="card-hover">
      <div style={{position:"absolute",top:0,right:0,width:300,height:300,
        background:"radial-gradient(circle at top right, rgba(212,168,83,0.07) 0%, transparent 65%)",
        pointerEvents:"none"}}/>
      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
        {article.breaking && (
          <span style={{background:"rgba(248,113,113,0.12)",border:"1px solid rgba(248,113,113,0.35)",
            color:"#F87171",padding:"3px 10px",borderRadius:6,fontSize:10,
            fontFamily:"'DM Mono',monospace",letterSpacing:1.5}}>⚡ BREAKING</span>
        )}
        <span style={{...CAT_STYLE[article.category],border:`1px solid ${CAT_STYLE[article.category].border}`,
          padding:"3px 10px",borderRadius:6,fontSize:10,
          fontFamily:"'DM Mono',monospace",letterSpacing:1.5}}>
          {article.category}
        </span>
        <span style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"var(--muted)",letterSpacing:1}}>
          FEATURED
        </span>
      </div>
      <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(36px,5vw,60px)",
        letterSpacing:2,lineHeight:1,color:"var(--text)",marginBottom:14}}>
        {article.title}
      </h1>
      <p style={{fontSize:15,color:"var(--muted)",lineHeight:1.65,maxWidth:680,marginBottom:20}}>
        {article.excerpt}
      </p>
      <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(212,168,83,0.2)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:13,fontWeight:600,color:"var(--gold)"}}>
            {article.author.name[0]}
          </div>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:"var(--text)",display:"flex",alignItems:"center",gap:6}}>
              {article.author.name}
              {article.author.role==="journalist"&&(
                <span style={{fontSize:9,background:"rgba(212,168,83,0.15)",color:"var(--gold)",
                  padding:"1px 6px",borderRadius:4,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>
                  PRESS
                </span>
              )}
            </div>
            <div style={{fontSize:11,color:"var(--muted)"}}>{article.time}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:12,marginLeft:"auto",alignItems:"center"}}>
          <span onClick={e=>onLike(article.id,e)} style={{
            cursor:"pointer",fontSize:13,color:isLiked?"#F87171":"var(--muted)",
            fontFamily:"'DM Mono',monospace",display:"flex",alignItems:"center",gap:5}}>
            {isLiked?"♥":"♡"} {article.likes}
          </span>
          <span style={{fontSize:13,color:"var(--muted)",fontFamily:"'DM Mono',monospace",
            display:"flex",alignItems:"center",gap:5}}>
            ◎ {countAll(article.comments)}
          </span>
          <button className="share-btn" style={{fontSize:12,padding:"5px 12px"}}
            onClick={e=>e.stopPropagation()}>
            ↗ Share
          </button>
        </div>
      </div>
    </div>
  );
}