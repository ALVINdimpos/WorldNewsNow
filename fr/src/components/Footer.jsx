import { useState } from 'react';
import { CATS } from '../data/constants';
import { useSubscribeMutation } from '../store/contactApi';

export function Footer({ setActiveCat, goHome, goPage }) {
  const [subEmail, setSubEmail]   = useState('');
  const [subDone,  setSubDone]    = useState(false);
  const [subscribe, { isLoading: subLoading }] = useSubscribeMutation();

  async function handleSubscribe() {
    if (!subEmail.trim()) return;
    try {
      await subscribe({ email: subEmail.trim() }).unwrap();
      setSubDone(true);
    } catch {}
  }
  return (
    <footer style={{
      borderTop:"1px solid var(--border)",
      background:"var(--d2)",
      marginTop:0,
    }}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"48px 24px 32px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:40,marginBottom:40}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3,color:"var(--gold)",marginBottom:6}}>
              WORLDNEWSNOW
            </div>
            <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.7,maxWidth:220}}>
              Independent global journalism. Covering the stories that matter, without fear or favour.
            </p>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              {["𝕏","in","f"].map(icon=>(
                <div key={icon} style={{
                  width:32,height:32,borderRadius:8,background:"var(--d3)",
                  border:"1px solid var(--border)",display:"flex",alignItems:"center",
                  justifyContent:"center",cursor:"pointer",fontSize:13,color:"var(--muted)",
                  transition:"all .2s",
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.color="var(--gold)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--muted)";}}>
                  {icon}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{fontSize:10,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:14}}>Sections</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {CATS.filter(c=>c!=="ALL").map(c=>(
                <span key={c} onClick={()=>{setActiveCat(c);goHome();window.scrollTo(0,0);}}
                  style={{fontSize:13,color:"var(--muted)",cursor:"pointer",
                    fontFamily:"'DM Mono',monospace",letterSpacing:.5,transition:"color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--gold)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{fontSize:10,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:14}}>Company</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {label:"About Us",        slug:"about"},
                {label:"Our Journalists", slug:"journalists"},
                {label:"Advertise",       slug:"advertise"},
                {label:"Careers",         slug:"careers"},
              ].map(l=>(
                <span key={l.slug} onClick={()=>goPage(l.slug)}
                  style={{fontSize:13,color:"var(--muted)",cursor:"pointer",transition:"color .15s"}}
                  onMouseEnter={e=>e.currentTarget.style.color="var(--text)"}
                  onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{fontSize:10,color:"var(--muted)",letterSpacing:2,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:14}}>Daily Briefing</div>
            <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.65,marginBottom:14}}>
              Get the top stories delivered to your inbox every morning.
            </p>
            {subDone ? (
              <div style={{fontSize:12,color:"var(--green)",fontFamily:"'DM Mono',monospace",
                letterSpacing:0.5}}>✓ You're subscribed!</div>
            ) : (
              <div style={{display:"flex",gap:8}}>
                <input type="email" value={subEmail} placeholder="your@email.com"
                  onChange={e => setSubEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubscribe()}
                  style={{flex:1,background:"var(--d4)",border:"1px solid var(--border)",
                    color:"var(--text)",borderRadius:8,padding:"9px 12px",fontSize:12,
                    fontFamily:"'DM Sans',sans-serif",minWidth:0}}
                />
                <button className="btn-gold" onClick={handleSubscribe} disabled={subLoading}
                  style={{padding:"9px 14px",fontSize:12,borderRadius:8,opacity:subLoading?0.6:1}}>
                  {subLoading ? '…' : 'Subscribe'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{
          borderTop:"1px solid var(--border)",paddingTop:20,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          flexWrap:"wrap",gap:12,
        }}>
          <span style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace",letterSpacing:.5}}>
            © {new Date().getFullYear()} WorldNewsNow. All rights reserved.
          </span>
          <div style={{display:"flex",gap:20}}>
            {["Privacy Policy","Terms of Use","Cookie Settings"].map(l=>(
              <span key={l} style={{fontSize:11,color:"var(--muted)",cursor:"pointer",
                fontFamily:"'DM Mono',monospace",letterSpacing:.5,transition:"color .15s"}}
                onMouseEnter={e=>e.currentTarget.style.color="var(--gold)"}
                onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}