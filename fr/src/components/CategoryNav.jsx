import { CATS, CAT_STYLE } from '../data/constants';

export function CategoryNav({ activeCat, onSelect }) {
  return (
    <div style={{display:"flex",gap:6,paddingBottom:14,overflowX:"auto",scrollbarWidth:"none"}}>
      {CATS.map(c => (
        <button key={c} className={`cat-btn ${activeCat===c?"active":""}`}
          onClick={()=>onSelect(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}

export function CategoryBadge({ category, breaking }) {
  return (
    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
      {breaking && (
        <span style={{background:"rgba(248,113,113,0.12)",border:"1px solid rgba(248,113,113,0.35)",
          color:"#F87171",padding:"3px 10px",borderRadius:6,fontSize:10,
          fontFamily:"'DM Mono',monospace",letterSpacing:1.5}}>⚡ BREAKING</span>
      )}
      <span style={{...CAT_STYLE[category],border:`1px solid ${CAT_STYLE[category]?.border}`,
        padding:"3px 10px",borderRadius:6,fontSize:10,
        fontFamily:"'DM Mono',monospace",letterSpacing:1.5}}>
        {category}
      </span>
    </div>
  );
}