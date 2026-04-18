import { useState } from 'react';
import { PageShell, Section } from './PageComponents';
import { useCareersNotifyMutation } from '../store/contactApi';

export function CareersPage({ goHome, setAuthView }) {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent]   = useState(false);
  const [careersNotify, { isLoading }] = useCareersNotifyMutation();

  async function handleNotify() {
    if (!notifyEmail.trim()) return;
    try {
      await careersNotify({ email: notifyEmail.trim() }).unwrap();
      setNotifySent(true);
    } catch {}
  }
  return (
    <PageShell goHome={goHome} title="Careers"
      subtitle="We're a small, independent newsroom and we hire carefully. When we're ready to grow the team, we'll post openings here first.">

      <Section label="Open Positions">
        <div style={{background:"var(--d2)",border:"1px solid var(--border)",borderRadius:14,
          padding:"56px 32px",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:16}}>📭</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,
            color:"var(--text)",marginBottom:10}}>No Open Roles Right Now</div>
          <p style={{fontSize:14,color:"var(--muted)",maxWidth:420,margin:"0 auto 28px",lineHeight:1.75}}>
            We don't have any vacancies at the moment, but that changes. Leave your email and we'll reach out the moment something opens up.
          </p>
          {notifySent ? (
            <div style={{display:"inline-flex",alignItems:"center",gap:8,
              background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.3)",
              color:"var(--green)",borderRadius:100,padding:"10px 20px",fontSize:13,
              fontFamily:"'DM Mono',monospace"}}>
              ✓ We'll be in touch
            </div>
          ) : (
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              <input type="email" value={notifyEmail} placeholder="your@email.com"
                onChange={e=>setNotifyEmail(e.target.value)}
                style={{background:"var(--d4)",border:"1px solid var(--border)",color:"var(--text)",
                  borderRadius:8,padding:"10px 14px",fontSize:13,fontFamily:"'DM Sans',sans-serif",
                  width:240}} />
              <button className="btn-gold" style={{padding:"10px 20px",opacity:isLoading?0.6:1}}
                disabled={isLoading} onClick={handleNotify}>
                {isLoading ? 'Saving…' : 'Notify Me'}
              </button>
            </div>
          )}
        </div>
      </Section>

      <div style={{background:"var(--d3)",border:"1px solid var(--border)",borderRadius:12,
        padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",
        flexWrap:"wrap",gap:16}}>
        <div>
          <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:4}}>
            Interested in freelance or contributing?
          </div>
          <p style={{fontSize:13,color:"var(--muted)"}}>
            We always welcome pitches from independent journalists and writers.
          </p>
        </div>
        <button className="btn-ghost" style={{whiteSpace:"nowrap"}}
          onClick={()=>setAuthView("signup")}>
          Submit a Pitch
        </button>
      </div>
    </PageShell>
  );
}