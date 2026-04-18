import { useState, useRef, useEffect } from "react";

export function RichTextEditor({ initialValue, onChange, placeholder }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && initialValue && !ref.current.innerHTML) {
      ref.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  function exec(cmd, val) {
    document.execCommand(cmd, false, val ?? null);
    ref.current?.focus();
    emit();
  }

  function emit() {
    onChange?.(ref.current?.innerHTML ?? "");
  }

  function insertLink() {
    const url = window.prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  }

  const T = ({ lbl, cmd, val, tt }) => (
    <button
      title={tt || lbl}
      onMouseDown={e => { e.preventDefault(); exec(cmd, val); }}
      className="rte-btn"
      style={{
        background:"transparent", border:"1px solid rgba(212,168,83,0.15)",
        color:"var(--muted)", padding:"4px 8px", borderRadius:5, cursor:"pointer",
        fontSize:12, fontFamily:"'DM Mono',monospace", lineHeight:1.4,
        minWidth:28, transition:"all .15s",
      }}
    >{lbl}</button>
  );

  const Sep = () => (
    <div style={{ width:1, height:18, background:"rgba(212,168,83,0.18)", flexShrink:0 }} />
  );

  return (
    <div style={{ border:"1px solid var(--border)", borderRadius:10, overflow:"hidden" }}>
      <div style={{
        display:"flex", flexWrap:"wrap", gap:4, padding:"10px 14px",
        background:"var(--d3)", borderBottom:"1px solid var(--border)", alignItems:"center",
      }}>
        <T lbl="B"       cmd="bold"                tt="Bold (Ctrl+B)" />
        <T lbl="I"       cmd="italic"              tt="Italic (Ctrl+I)" />
        <T lbl="U"       cmd="underline"           tt="Underline" />
        <T lbl="S"       cmd="strikeThrough"       tt="Strikethrough" />
        <Sep/>
        <T lbl="H1"      cmd="formatBlock" val="h2" tt="Heading 1" />
        <T lbl="H2"      cmd="formatBlock" val="h3" tt="Heading 2" />
        <T lbl="H3"      cmd="formatBlock" val="h4" tt="Heading 3" />
        <T lbl="¶"       cmd="formatBlock" val="p"  tt="Normal paragraph" />
        <Sep/>
        <T lbl="• List"  cmd="insertUnorderedList" tt="Bullet list" />
        <T lbl="1. List" cmd="insertOrderedList"   tt="Numbered list" />
        <Sep/>
        <T lbl="❝"       cmd="formatBlock" val="blockquote" tt="Blockquote" />
        <button
          title="Insert link"
          onMouseDown={e => { e.preventDefault(); insertLink(); }}
          className="rte-btn"
          style={{
            background:"transparent", border:"1px solid rgba(212,168,83,0.15)",
            color:"var(--muted)", padding:"4px 9px", borderRadius:5, cursor:"pointer",
            fontSize:12, fontFamily:"'DM Mono',monospace", transition:"all .15s",
          }}
        >⛓ Link</button>
        <Sep/>
        <T lbl="≡L" cmd="justifyLeft"   tt="Align left" />
        <T lbl="≡C" cmd="justifyCenter" tt="Centre" />
        <T lbl="≡R" cmd="justifyRight"  tt="Align right" />
        <button
          title="Clear formatting"
          onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }}
          style={{
            marginLeft:"auto", background:"transparent",
            border:"1px solid rgba(248,113,113,0.22)", color:"rgba(248,113,113,0.65)",
            padding:"4px 9px", borderRadius:5, cursor:"pointer",
            fontSize:11, fontFamily:"'DM Mono',monospace", transition:"all .15s",
          }}
        >✕ Clear</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        onKeyDown={e => {
          if (e.key === "Tab") { e.preventDefault(); exec("insertText", "    "); }
        }}
        data-ph={placeholder || "Write your article here…"}
        className="rte-body"
        style={{
          minHeight:360, padding:"22px 26px", outline:"none",
          fontSize:15, lineHeight:1.85, color:"var(--text)",
          fontFamily:"'DM Sans',sans-serif", background:"var(--d4)",
          overflowY:"auto",
        }}
      />
    </div>
  );
}