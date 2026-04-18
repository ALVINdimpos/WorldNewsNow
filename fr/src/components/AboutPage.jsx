import { PageShell, Section, StatCard } from './PageComponents';

export function AboutPage({ goHome, setAuthView }) {
  return (
    <PageShell goHome={goHome} title="About WorldNewsNow"
      subtitle="We believe an informed world is a better world. WorldNewsNow is an independent newsroom delivering fast, accurate, and fearless global journalism — free from corporate influence or political agenda.">

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:48}}>
        {[
          {value:"12M+",  label:"Monthly Readers"},
          {value:"47",    label:"Countries Covered"},
          {value:"8",     label:"Staff Journalists"},
          {value:"2019",  label:"Founded"},
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <Section label="Our Story">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32}}>
          {[
            {heading:"How We Started", body:"WorldNewsNow was founded in 2019 by a group of journalists who had grown frustrated with the compromises demanded by advertiser-dependent media. We launched with six reporters and a conviction: that readers deserve coverage that follows the evidence, not the revenue."},
            {heading:"How We Operate", body:"We are reader-supported and foundation-funded. We accept no advertising from governments, political parties, or industries we cover. Every story goes through a three-layer editorial process: reporter, desk editor, and independent fact-checker."},
            {heading:"Our Newsroom", body:"Our journalists are based in sixteen cities across four continents, giving us genuine local expertise rather than parachute reporting. We combine breaking-news speed with the rigour of long-form investigation."},
            {heading:"Our Independence", body:"No shareholder, no billionaire owner, no algorithm determines our editorial agenda. Our editorial charter is publicly published and enforced by an independent board. We have declined acquisition offers from three major media groups."},
          ].map(b => (
            <div key={b.heading} style={{background:"var(--d2)",border:"1px solid var(--border)",
              borderRadius:12,padding:"24px 22px"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:2,
                color:"var(--gold)",marginBottom:10}}>{b.heading}</div>
              <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.75}}>{b.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Our Values">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
          {[
            {icon:"⚖️", name:"Independence",  desc:"Editorial decisions are made by editors, not advertisers, owners, or governments."},
            {icon:"🔍", name:"Accuracy",      desc:"We verify before we publish. Corrections are prominent and permanent."},
            {icon:"🌍", name:"Global Lens",   desc:"Every major story has local consequences. We report both."},
            {icon:"🔓", name:"Transparency",  desc:"Our methods, sources, and funding are disclosed to our readers."},
          ].map(v => (
            <div key={v.name} style={{background:"var(--d3)",border:"1px solid var(--border)",
              borderRadius:12,padding:"20px 18px"}}>
              <div style={{fontSize:28,marginBottom:10}}>{v.icon}</div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:8}}>{v.name}</div>
              <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.65}}>{v.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <div style={{background:"linear-gradient(135deg,rgba(212,168,83,0.08),rgba(212,168,83,0.03))",
        border:"1px solid var(--border)",borderRadius:14,padding:"32px 36px",textAlign:"center"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2,
          color:"var(--text)",marginBottom:10}}>Support Independent Journalism</div>
        <p style={{fontSize:14,color:"var(--muted)",maxWidth:480,margin:"0 auto 20px",lineHeight:1.7}}>
          Become a sustaining member and help us keep our newsroom independent, funded by readers — not corporations.
        </p>
        <button className="btn-gold" style={{fontSize:14,padding:"12px 28px"}}
          onClick={()=>setAuthView("signup")}>
          Join WorldNewsNow
        </button>
      </div>
    </PageShell>
  );
}