import { PageShell } from './PageComponents';
import { useGetJournalistsQuery } from '../store/journalistsApi';

export function JournalistsPage({ goHome }) {
  const { data: journalists = [], isLoading } = useGetJournalistsQuery();

  return (
    <PageShell goHome={goHome} title="Our Journalists"
      subtitle="Meet the reporters, editors, and investigators behind WorldNewsNow's global coverage.">
      {isLoading && (
        <div style={{textAlign:"center",padding:"60px 0",color:"var(--muted)",
          fontFamily:"'DM Mono',monospace",fontSize:13,letterSpacing:1}}>
          Loading journalists…
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {journalists.map(j => (
          <div key={j.id || j.name} style={{background:"var(--d2)",border:"1px solid var(--border)",
            borderRadius:12,padding:"24px 20px",transition:"all .2s"}}
            className="art-card">
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
              <div style={{width:52,height:52,borderRadius:"50%",flexShrink:0,
                background:"rgba(212,168,83,0.15)",border:"2px solid rgba(212,168,83,0.3)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:20,fontWeight:700,color:"var(--gold)"}}>
                {j.name[0]}
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:"var(--text)",marginBottom:3}}>{j.name}</div>
                <span style={{fontSize:9,background:"rgba(212,168,83,0.15)",color:"var(--gold)",
                  padding:"2px 7px",borderRadius:4,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>
                  ✍ JOURNALIST
                </span>
              </div>
            </div>
            <div style={{fontSize:10,color:"var(--gold)",fontFamily:"'DM Mono',monospace",
              letterSpacing:1.5,textTransform:"uppercase",marginBottom:10}}>{j.specialty}</div>
            <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.65,marginBottom:16}}>{j.bio}</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
              borderTop:"1px solid var(--border)",paddingTop:12}}>
              <span style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>
                {j.articles} articles
              </span>
              <span style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>
                {j.x}
              </span>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}