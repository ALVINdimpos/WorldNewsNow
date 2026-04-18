import { useState, useEffect, useRef } from "react";
import { CATS } from '../data/constants';

export function Header({ 
  activeCat, 
  setActiveCat, 
  currentUser, 
  setAuthView, 
  setCurrentUser,
  goHome,
  goPage 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handlePointerDown(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!currentUser) setMenuOpen(false);
  }, [currentUser]);

  return (
    <header style={{
      borderBottom:"1px solid var(--border)",position:"sticky",top:0,
      background:"rgba(10,12,15,0.96)",backdropFilter:"blur(14px)",zIndex:100,
    }}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0 12px"}}>
          <div onClick={goHome} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            <img src="/worldnewsnow_icon.svg" alt="WorldNewsNow"
              style={{width:36,height:36,flexShrink:0}} />
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:3,color:"var(--gold)",lineHeight:1}}>
                WORLDNEWSNOW
              </div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"var(--muted)",letterSpacing:2.5,textTransform:"uppercase",marginTop:2}}>
                Global · Live · Independent
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",alignItems:"center",gap:7,background:"rgba(74,222,128,0.08)",
              border:"1px solid rgba(74,222,128,0.28)",padding:"5px 12px",borderRadius:100,
              fontSize:11,color:"var(--green)",fontFamily:"'DM Mono',monospace",letterSpacing:1}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",animation:"pulse 2s infinite"}}/>
              LIVE
            </div>
            {currentUser ? (
              <div ref={menuRef} style={{position:"relative"}}>
                <button
                  type="button"
                  title={currentUser.name}
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                  onClick={() => setMenuOpen(o => !o)}
                  style={{
                    width:38,height:38,borderRadius:"50%",
                    background: currentUser.role==="journalist"?"rgba(212,168,83,0.12)":"rgba(96,165,250,0.1)",
                    border:`2px solid ${currentUser.role==="journalist"?"var(--gold)":"rgba(96,165,250,0.45)"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"'DM Sans',sans-serif",fontSize:16,fontWeight:600,
                    color: currentUser.role==="journalist"?"var(--gold)":"var(--blue)",
                    flexShrink:0,cursor:"pointer",padding:0,
                    boxShadow: menuOpen ? "0 0 0 2px rgba(212,168,83,0.25)" : "none",
                  }}
                >
                  {(currentUser.name.trim().charAt(0) || "?").toUpperCase()}
                </button>
                {menuOpen && (
                  <div
                    role="menu"
                    style={{
                      position:"absolute",right:0,top:"calc(100% + 10px)",
                      minWidth:220,
                      background:"var(--d3)",
                      border:"1px solid var(--border)",
                      borderRadius:12,
                      boxShadow:"0 12px 40px rgba(0,0,0,0.55)",
                      padding:"10px 0",
                      zIndex:200,
                      animation:"modalIn .2s ease",
                    }}
                  >
                    <div style={{
                      padding:"4px 16px 12px",
                      borderBottom:"1px solid var(--border)",
                      marginBottom:6,
                    }}>
                      <div style={{
                        fontSize:10,color:"var(--muted)",letterSpacing:1.5,
                        fontFamily:"'DM Mono',monospace",textTransform:"uppercase",marginBottom:4,
                      }}>
                        Signed in as
                      </div>
                      <div style={{fontSize:14,color:"var(--text)",fontWeight:600,lineHeight:1.3}}>
                        {currentUser.name}
                      </div>
                    </div>
                    {currentUser.role==="journalist" && (
                      <button
                        type="button"
                        role="menuitem"
                        className="btn-gold"
                        onClick={() => { setMenuOpen(false); goPage("journalist-dashboard"); }}
                        style={{
                          display:"block",width:"calc(100% - 24px)",margin:"0 12px 8px",
                          fontSize:13,padding:"10px 14px",borderRadius:8,textAlign:"center",
                          border:"none",cursor:"pointer",
                        }}
                      >
                        Dashboard
                      </button>
                    )}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => { setMenuOpen(false); setCurrentUser(null); }}
                      style={{
                        display:"block",width:"100%",
                        background:"transparent",border:"none",
                        padding:"10px 16px",
                        fontSize:13,color:"var(--muted)",
                        fontFamily:"'DM Sans',sans-serif",
                        cursor:"pointer",textAlign:"left",
                        transition:"background .15s,color .15s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background="var(--d4)"; e.currentTarget.style.color="var(--text)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--muted)"; }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{display:"flex",gap:8}}>
                <button className="btn-ghost" style={{fontSize:12,padding:"6px 14px"}}
                  onClick={()=>setAuthView("login")}>Sign in</button>
                <button className="btn-gold" style={{padding:"6px 16px"}}
                  onClick={()=>setAuthView("signup")}>Join Free</button>
              </div>
            )}
          </div>
        </div>
        <div style={{display:"flex",gap:6,paddingBottom:14,overflowX:"auto",scrollbarWidth:"none"}}>
          {CATS.map(c => (
            <button key={c} className={`cat-btn ${activeCat===c?"active":""}`}
              onClick={()=>{setActiveCat(c); goHome();}}>
              {c}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
