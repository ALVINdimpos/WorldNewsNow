export function PageShell({ title, subtitle, children, goHome }) {
  return (
    <div style={{maxWidth:960,margin:"0 auto",padding:"0 24px 80px"}}>
      <button className="btn-ghost" onClick={goHome}
        style={{marginTop:28,marginBottom:32,fontSize:12,padding:"6px 14px"}}>
        ← Back to news
      </button>
      <div style={{marginBottom:40}}>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(42px,6vw,72px)",
          letterSpacing:3,lineHeight:1,color:"var(--text)",marginBottom:10}}>
          {title}
        </h1>
        {subtitle && (
          <p style={{fontSize:16,color:"var(--muted)",lineHeight:1.7,maxWidth:620}}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function Section({ label, children }) {
  return (
    <div style={{marginBottom:48}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,
        borderBottom:"1px solid var(--border)",paddingBottom:14}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,letterSpacing:3,color:"var(--text)"}}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

export function StatCard({ value, label }) {
  return (
    <div style={{background:"var(--d2)",border:"1px solid var(--border)",borderRadius:12,
      padding:"24px 20px",textAlign:"center"}}>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:44,letterSpacing:2,
        color:"var(--gold)",lineHeight:1,marginBottom:6}}>{value}</div>
      <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",
        letterSpacing:1.5,textTransform:"uppercase"}}>{label}</div>
    </div>
  );
}