import { useState } from 'react';
import { PageShell, Section, StatCard } from './PageComponents';
import { useAdvertiseInquiryMutation } from '../store/contactApi';

export function AdvertisePage({ goHome }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({name:"",company:"",email:"",budget:"",message:""});
  const [submitError, setSubmitError] = useState('');
  const [advertiseInquiry, { isLoading }] = useAdvertiseInquiryMutation();

  async function submit() {
    if (!form.name.trim() || !form.email.trim()) return;
    setSubmitError('');
    try {
      await advertiseInquiry({
        name: form.name, company: form.company,
        email: form.email, budget: form.budget, message: form.message,
      }).unwrap();
      setSent(true);
    } catch (err) {
      setSubmitError(err?.data?.message || 'Failed to send. Please try again.');
    }
  }
  return (
    <PageShell goHome={goHome} title="Advertise With Us"
      subtitle="Reach a highly engaged, globally-minded audience that trusts the editorial environment around your message.">

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:48}}>
        {[
          {value:"12M+", label:"Monthly Readers"},
          {value:"4.2m", label:"Avg. Session"},
          {value:"68%",  label:"Return Visitors"},
          {value:"140+", label:"Countries"},
        ].map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <Section label="Ad Formats">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:8}}>
          {[
            {icon:"🖼️", name:"Display",           desc:"Premium placements across homepage, category pages, and article views. Non-intrusive, high-visibility."},
            {icon:"✍️", name:"Sponsored Content",  desc:"Long-form editorial content crafted by our team and clearly labelled as partner content."},
            {icon:"📧", name:"Newsletter",          desc:"Dedicated placements in our 400k-subscriber Daily Briefing. One sponsor per edition."},
            {icon:"📊", name:"Data & Research",     desc:"Commission custom research reports distributed to our journalist and reader network."},
          ].map(f => (
            <div key={f.name} style={{background:"var(--d3)",border:"1px solid var(--border)",
              borderRadius:12,padding:"20px 18px"}}>
              <div style={{fontSize:28,marginBottom:10}}>{f.icon}</div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--text)",marginBottom:8}}>{f.name}</div>
              <p style={{fontSize:13,color:"var(--muted)",lineHeight:1.65}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section label="Get in Touch">
        {sent ? (
          <div style={{background:"rgba(74,222,128,0.07)",border:"1px solid rgba(74,222,128,0.3)",
            borderRadius:12,padding:"32px",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:12}}>✓</div>
            <div style={{fontSize:16,fontWeight:600,color:"var(--text)",marginBottom:8}}>Message Received</div>
            <p style={{fontSize:13,color:"var(--muted)"}}>Our partnerships team will be in touch within one business day.</p>
          </div>
        ) : (
          <div style={{background:"var(--d2)",border:"1px solid var(--border)",borderRadius:12,padding:28}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              {[
                {k:"name",    label:"Your Name",      ph:"Jane Smith",              type:"text"},
                {k:"company", label:"Company",         ph:"Acme Corp",               type:"text"},
                {k:"email",   label:"Email Address",   ph:"jane@acme.com",           type:"email"},
                {k:"budget",  label:"Monthly Budget",  ph:"e.g. $5,000 – $25,000",  type:"text"},
              ].map(f => (
                <div key={f.k}>
                  <div style={{fontSize:10,color:"var(--muted)",letterSpacing:1.5,textTransform:"uppercase",
                    fontFamily:"'DM Mono',monospace",marginBottom:6}}>{f.label}</div>
                  <input type={f.type} value={form[f.k]} placeholder={f.ph}
                    onChange={e=>setForm(x=>({...x,[f.k]:e.target.value}))}
                    style={{width:"100%",background:"var(--d4)",border:"1px solid var(--border)",
                      color:"var(--text)",borderRadius:8,padding:"10px 12px",fontSize:13,
                      fontFamily:"'DM Sans',sans-serif"}} />
                </div>
              ))}
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:10,color:"var(--muted)",letterSpacing:1.5,textTransform:"uppercase",
                fontFamily:"'DM Mono',monospace",marginBottom:6}}>Message</div>
              <textarea rows={4} value={form.message} placeholder="Tell us about your campaign goals…"
                onChange={e=>setForm(x=>({...x,message:e.target.value}))}
                style={{width:"100%",background:"var(--d4)",border:"1px solid var(--border)",
                  color:"var(--text)",borderRadius:8,padding:"10px 12px",fontSize:13,
                  fontFamily:"'DM Sans',sans-serif",resize:"none"}} />
            </div>
            {submitError && (
              <div style={{marginBottom:12,padding:"10px 14px",background:"rgba(248,113,113,0.08)",
                border:"1px solid rgba(248,113,113,0.3)",borderRadius:8,fontSize:13,color:"#F87171",
                fontFamily:"'DM Mono',monospace"}}>
                {submitError}
              </div>
            )}
            <button className="btn-gold" onClick={submit}
              disabled={isLoading} style={{padding:"11px 24px",opacity:isLoading?0.6:1}}>
              {isLoading ? 'Sending…' : 'Send Enquiry'}
            </button>
          </div>
        )}
      </Section>
    </PageShell>
  );
}