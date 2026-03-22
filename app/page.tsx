"use client";

import { useState, useEffect } from "react";

const C = {
  bg:       "#0d0f0e",
  surface:  "#131614",
  border:   "#1e2320",
  muted:    "#3d4840",
  dim:      "#637060",
  mid:      "#8a9e86",
  text:     "#cdd9c8",
  bright:   "#e8f0e4",
  accent:   "#4ade80",
  accentDim:"#22543d",
};

const SERVICES = [
  { id:"print",  idx:"01", name:"3D Printing",           glyph:"▣", desc:"FDM, resin, and SLA for functional parts, enclosures, and end-use components. Material selection and print orientation guidance included.", tags:["FDM","Resin","SLA"] },
  { id:"model",  idx:"02", name:"3D Modeling",            glyph:"◈", desc:"Parametric CAD in Fusion 360 and organic modeling in Blender. Concept sketch to production-ready file.", tags:["Fusion 360","Blender","CAD"] },
  { id:"proto",  idx:"03", name:"Prototyping",            glyph:"⬡", desc:"Rapid physical iteration — fit checks, proof-of-concept assemblies, and functional mockups. Fast cycles, tight feedback.", tags:["Rapid","PoC","Iteration"] },
  { id:"res",    idx:"04", name:"Research & Engineering", glyph:"◎", desc:"Feasibility studies, technical analysis, design validation, and documentation for academic and industry projects.", tags:["Analysis","Validation","Docs"] },
  { id:"comm",   idx:"05", name:"Commissions",            glyph:"◇", desc:"Bespoke one-off or short-run builds. Bring a brief or just a problem — I'll scope and engineer the solution end-to-end.", tags:["Custom","Short-run","Bespoke"] },
];

const PROCESS = [
  { n:"01", title:"Brief",   body:"Drop a description, sketch, or spec. I ask the right questions." },
  { n:"02", title:"Quote",   body:"Flat pricing, clear timeline. No scope creep surprises." },
  { n:"03", title:"Build",   body:"Regular previews and check-ins. You stay in the loop." },
  { n:"04", title:"Deliver", body:"Files, parts, or docs — verified and ready to use." },
];

const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Fraunces', serif" };

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "fixed", inset: "0 0 auto 0", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2.5rem", height: 60,
      background: scrolled ? "rgba(13,15,14,0.93)" : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 28, height: 28, border: `1px solid ${C.accent}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...mono, fontSize: 11, color: C.accent }}>skm</span>
        </div>
        <span style={{ ...mono, fontSize: 13, color: C.bright, letterSpacing: "0.04em" }}>.labs</span>
      </a>
      <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
        {[
          { href: "#services",   label: "Services"   },
          { href: "/work",       label: "Work"        },
          { href: "#process",    label: "Process"     },
        ].map(l => (
          <a key={l.label} href={l.href} style={{ ...mono, fontSize: 10, letterSpacing: "0.12em", color: C.dim, textDecoration: "none", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.text)}
            onMouseLeave={e => (e.currentTarget.style.color = C.dim)}
          >{l.label}</a>
        ))}
        <a href="/contact" style={{
          ...mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
          color: C.bg, background: C.accent, padding: "7px 16px", borderRadius: 3,
          textDecoration: "none", transition: "opacity 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >Get a quote</a>
      </div>
    </nav>
  );
}

function Hero() {
  const [tick, setTick] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setTick(t => !t), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <section style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 2.5rem", background: C.bg, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", opacity: 0.6 }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, ${C.bg} 100%)` }} />
      <div style={{ position: "absolute", top: 80, right: "2.5rem", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
        {["Engineering","Fabrication","Modeling","Research"].map(l => (
          <span key={l} style={{ ...mono, fontSize: 9, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>{l}</span>
        ))}
      </div>
      <div style={{ position: "relative", maxWidth: 860, paddingTop: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
          <span style={{ ...mono, fontSize: 11, color: C.accent }}>~/skm.labs</span>
          <span style={{ ...mono, fontSize: 11, color: C.dim }}>$</span>
          <span style={{ ...mono, fontSize: 11, color: C.text }}>whoami</span>
          <span style={{ display: "inline-block", width: 8, height: 15, background: tick ? C.accent : "transparent", transition: "background 0.1s", marginLeft: 2 }} />
        </div>
        <h1 style={{ ...serif, fontSize: "clamp(2.8rem, 6.5vw, 5.8rem)", fontWeight: 900, lineHeight: 1.0, color: C.bright, margin: "0 0 1.5rem", letterSpacing: "-0.03em" }}>
          Engineer.<br /><span style={{ color: C.mid }}>Builder.</span><br /><span style={{ color: C.accent, fontStyle: "italic" }}>Maker.</span>
        </h1>
        <p style={{ ...mono, fontSize: "0.9rem", lineHeight: 1.9, color: C.dim, maxWidth: 520, margin: "0 0 2.75rem" }}>
          <span style={{ color: C.mid }}>// </span>3D printing, modeling, prototyping and engineering commissions. Precise work. Documented output. Real deadlines.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <a href="/commissions" style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.bg, background: C.accent, padding: "13px 28px", borderRadius: 3, textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >Start a project</a>
          <a href="/work" style={{ ...mono, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.mid, textDecoration: "none", border: `1px solid ${C.border}`, padding: "13px 28px", borderRadius: 3, transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.muted; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mid; }}
          >View work</a>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: "2rem", left: "2.5rem", right: "2.5rem", display: "flex", justifyContent: "space-between" }}>
        <span style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: C.muted, textTransform: "uppercase" }}>skm.labs — v1.0.0</span>
        <span style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: C.muted, textTransform: "uppercase" }}>Available for work</span>
      </div>
    </section>
  );
}

function Services() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section id="services" style={{ background: C.bg, padding: "6rem 2.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", paddingBottom: "1.25rem", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ ...mono, fontSize: 10, color: C.accent }}>§</span>
            <h2 style={{ ...serif, fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: C.bright, margin: 0, letterSpacing: "-0.02em" }}>Services</h2>
          </div>
          <span style={{ ...mono, fontSize: 9, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>05 disciplines</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 1, background: C.border, border: `1px solid ${C.border}` }}>
          {SERVICES.map(s => (
            <div key={s.id} onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)}
              style={{ background: active === s.id ? C.surface : C.bg, padding: "1.75rem", transition: "background 0.2s", cursor: "default" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <span style={{ ...mono, fontSize: 18, color: active === s.id ? C.accent : C.muted, transition: "color 0.2s" }}>{s.glyph}</span>
                <span style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: C.muted }}>{s.idx}</span>
              </div>
              <h3 style={{ ...serif, fontSize: "1.15rem", fontWeight: 700, color: C.bright, margin: "0 0 0.6rem", letterSpacing: "-0.01em" }}>{s.name}</h3>
              <p style={{ ...mono, fontSize: "0.78rem", lineHeight: 1.8, color: C.dim, margin: "0 0 1.25rem" }}>{s.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {s.tags.map(t => (
                  <span key={t} style={{ ...mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: active === s.id ? C.accent : C.muted, border: `1px solid ${active === s.id ? C.accentDim : C.border}`, borderRadius: 2, padding: "3px 8px", transition: "color 0.2s, border-color 0.2s" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <a href="/work" style={{ ...mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mid, textDecoration: "none", borderBottom: `1px solid ${C.border}`, paddingBottom: 2, transition: "color 0.2s, border-color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = C.accentDim; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.mid; e.currentTarget.style.borderColor = C.border; }}
          >See examples of my work →</a>
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section id="process" style={{ background: C.surface, padding: "6rem 2.5rem", borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem", paddingBottom: "1.25rem", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ ...mono, fontSize: 10, color: C.accent }}>§</span>
            <h2 style={{ ...serif, fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: C.bright, margin: 0, letterSpacing: "-0.02em" }}>How it works</h2>
          </div>
          <span style={{ ...mono, fontSize: 9, letterSpacing: "0.16em", color: C.muted, textTransform: "uppercase" }}>04 steps</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem 2rem" }}>
          {PROCESS.map(p => (
            <div key={p.n}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
                <span style={{ ...mono, fontSize: 9, letterSpacing: "0.14em", color: C.accent }}>{p.n}</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>
              <h3 style={{ ...serif, fontSize: "1.15rem", fontWeight: 700, color: C.bright, margin: "0 0 0.5rem" }}>{p.title}</h3>
              <p style={{ ...mono, fontSize: "0.78rem", lineHeight: 1.8, color: C.dim, margin: 0 }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section id="contact" style={{ background: C.bg, padding: "8rem 2.5rem", borderTop: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "48px 48px", opacity: 0.35 }} />
      <div style={{ position: "relative", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <div style={{ ...mono, fontSize: 10, color: C.accent, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "1.5rem" }}>&gt; open for work</div>
        <h2 style={{ ...serif, fontSize: "clamp(2rem, 5vw, 3.75rem)", fontWeight: 900, color: C.bright, letterSpacing: "-0.03em", lineHeight: 1.05, margin: "0 0 1.5rem" }}>
          Have something<br /><span style={{ color: C.accent, fontStyle: "italic" }}>to build?</span>
        </h2>
        <p style={{ ...mono, fontSize: "0.82rem", lineHeight: 1.9, color: C.dim, margin: "0 auto 2.5rem", maxWidth: 400 }}>
          Send a brief, a sketch, or just a description. I'll reply within 24 hours with a quote and timeline.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/commissions" style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.bg, background: C.accent, padding: "15px 38px", borderRadius: 3, textDecoration: "none", transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")} onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >Submit a brief</a>
          <a href="/contact" style={{ ...mono, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mid, border: `1px solid ${C.border}`, padding: "15px 38px", borderRadius: 3, textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.muted; e.currentTarget.style.color = C.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.mid; }}
          >Ask a question</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "1.5rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 22, height: 22, border: `1px solid ${C.accent}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...mono, fontSize: 8, color: C.accent }}>skm</span>
        </div>
        <span style={{ ...mono, fontSize: 12, color: C.mid, letterSpacing: "0.04em" }}>.labs</span>
      </div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {[{href:"/work",label:"Work"},{href:"/commissions",label:"Commissions"},{href:"/contact",label:"Contact"}].map(l => (
          <a key={l.label} href={l.href} style={{ ...mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = C.mid)} onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          >{l.label}</a>
        ))}
      </div>
      <span style={{ ...mono, fontSize: 9, letterSpacing: "0.12em", color: C.muted, textTransform: "uppercase" }}>© {new Date().getFullYear()} skm.labs</span>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
<Nav />
      <main>
        <Hero />
        <Services />
        <Process />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}