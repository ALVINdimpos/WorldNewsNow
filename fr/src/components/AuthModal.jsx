import { useState } from 'react';

export function AuthModal({ authView, setAuthView, authForm, setAuthForm, handleAuth, authError }) {
  const [showPass, setShowPass] = useState(false);

  if (!authView) return null;

  return (
    <div onClick={e=>e.target===e.currentTarget&&setAuthView(null)} style={{
      position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",
      zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24,
    }}>
      <div style={{background:"var(--d3)",border:"1px solid var(--border)",borderRadius:16,
        maxWidth:440,width:"100%",padding:32,position:"relative",animation:"modalIn .3s ease"}}>
        <button onClick={()=>setAuthView(null)} style={{
          position:"absolute",top:14,right:16,background:"none",border:"none",
          color:"var(--muted)",fontSize:20,cursor:"pointer",lineHeight:1}}>✕</button>

        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:3,
          color:"var(--gold)",marginBottom:4}}>WORLDNEWSNOW</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:30,letterSpacing:2,
          color:"var(--text)",marginBottom:6}}>
          {authView==="login" ? "Welcome Back" : "Join the Conversation"}
        </h2>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:24,lineHeight:1.6}}>
          {authView==="login"
            ? "Sign in to like articles, comment, and follow your favourite journalists."
            : "Create an account as a journalist or reader. It only takes a moment."}
        </p>

        {authView==="signup" && (
          <>
            <div style={{fontSize:10,color:"var(--muted)",letterSpacing:1.5,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:10}}>Account Type</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
              {[
                {r:"reader",    emoji:"👤", label:"Reader",     desc:"Comment, like, and follow stories"},
                {r:"journalist",emoji:"✍️", label:"Journalist", desc:"Publish stories and build your byline"},
              ].map(opt=>(
                <div key={opt.r} onClick={()=>setAuthForm(f=>({...f,role:opt.r}))} style={{
                  background: authForm.role===opt.r?"rgba(212,168,83,0.08)":"var(--d4)",
                  border:`1px solid ${authForm.role===opt.r?"var(--gold)":"var(--border)"}`,
                  borderRadius:10,padding:"14px 12px",cursor:"pointer",
                  textAlign:"center",transition:"all .15s",
                }}>
                  <div style={{fontSize:22,marginBottom:6}}>{opt.emoji}</div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:3}}>{opt.label}</div>
                  <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.4}}>{opt.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {(authView === "login"
          ? [
              {key:"email", label:"Email Address", placeholder:"your@email.com",        type:"email"},
              {key:"pass",  label:"Password",       placeholder:"Your password",          type:"password"},
            ]
          : [
              {key:"name",  label:"Display Name",   placeholder:"How you'll appear to others", type:"text"},
              {key:"email", label:"Email Address",   placeholder:"your@email.com",              type:"email"},
              {key:"pass",  label:"Password",        placeholder:"Create a secure password",    type:"password"},
            ]
        ).map(field => (
          <div key={field.key} style={{marginBottom:14}}>
            <div style={{fontSize:10,color:"var(--muted)",letterSpacing:1.5,textTransform:"uppercase",
              fontFamily:"'DM Mono',monospace",marginBottom:6}}>{field.label}</div>
            <div style={{position:"relative"}}>
              <input
                type={field.type === "password" ? (showPass ? "text" : "password") : field.type}
                value={authForm[field.key]}
                onChange={e=>setAuthForm(f=>({...f,[field.key]:e.target.value}))}
                placeholder={field.placeholder}
                style={{width:"100%",background:"var(--d4)",border:"1px solid var(--border)",
                  color:"var(--text)",borderRadius:8,
                  padding: field.type === "password" ? "10px 40px 10px 14px" : "10px 14px",
                  fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"border-color .2s"}}
              />
              {field.type === "password" && (
                <button
                  type="button"
                  onClick={()=>setShowPass(v=>!v)}
                  style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",padding:4,
                    color:"var(--muted)",fontSize:16,lineHeight:1,display:"flex",alignItems:"center"}}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              )}
            </div>
          </div>
        ))}

        {authError && (
          <div style={{background:"rgba(248,113,113,0.1)",border:"1px solid rgba(248,113,113,0.3)",
            borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:13,color:"#F87171",
            fontFamily:"'DM Mono',monospace"}}>
            {authError}
          </div>
        )}

        <button className="btn-gold" onClick={handleAuth}
          style={{width:"100%",padding:"12px",fontSize:14,marginTop:8,borderRadius:10}}>
          {authView==="login" ? "Sign In" : "Create Account"}
        </button>

        <div style={{textAlign:"center",marginTop:16,fontSize:12,color:"var(--muted)"}}>
          {authView==="login" ? "Don't have an account? " : "Already have an account? "}
          <span onClick={()=>setAuthView(authView==="login"?"signup":"login")}
            style={{color:"var(--gold)",cursor:"pointer",textDecoration:"underline"}}>
            {authView==="login" ? "Join free" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
}