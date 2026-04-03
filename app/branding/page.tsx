"use client";

import { useEffect, useState } from "react";

const ACCENT = "#00FF88";

const colors = [
  { hex: "#0a0a0a", label: "Void Black" },
  { hex: "#1a1a1a", label: "Terminal Dark" },
  { hex: "#2e2e2e", label: "Surface" },
  { hex: "#00FF88", label: "Signal Green" },
  { hex: "#f5f5f0", label: "Off White" },
  { hex: "#f0f0f0", label: "Paper" },
];

const services = [
  "3D Printing (FDM / SLA / Resin)",
  "3D Modeling",
  "Prototyping",
  "Research & Engineering",
  "Commissions",
];

const pubmats = [
  {
    id: "hero",
    bg: "#0a0a0a",
    border: "#1e1e1e",
    tag: "skm.labs — v1.0",
    tagColor: ACCENT,
    title: ["Engineer.", "Builder.", "Maker."],
    titleColor: "#f0f0f0",
    services: true,
    servicesColor: ACCENT,
    logo: { color: "#f0f0f0", dot: ACCENT },
    grid: true,
    cta: null,
  },
  {
    id: "light",
    bg: "#f5f5f0",
    border: "#e0e0d8",
    tag: "// open for work",
    tagColor: "#888",
    title: ["Precise work.", "Documented output.", "Real deadlines."],
    titleColor: "#0a0a0a",
    services: false,
    logo: { color: "#0a0a0a", dot: "#555" },
    grid: false,
    cta: "available",
  },
  {
    id: "services",
    bg: "#0a0a0a",
    border: ACCENT,
    tag: "$ cat services.txt",
    tagColor: "#555",
    title: null,
    titleColor: "#f0f0f0",
    services: true,
    servicesColor: ACCENT,
    logo: { color: "#f0f0f0", dot: ACCENT },
    grid: true,
    cta: null,
    url: true,
  },
  {
    id: "cta",
    bg: ACCENT,
    border: ACCENT,
    tag: "// new project?",
    tagColor: "#0a0a0a",
    title: ["Drop a brief.", "Get a quote", "in 24hrs."],
    titleColor: "#0a0a0a",
    services: false,
    logo: { color: "#0a0a0a", dot: "#333" },
    grid: false,
    cta: "Start a project →",
    ctaColor: "#0a0a0a",
  },
];

const squarePosts = [
  {
    id: "print-showcase",
    bg: "#0a0a0a",
    border: "#1e1e1e",
    tag: "// 3d print showcase",
    tagColor: ACCENT,
    title: ["Custom", "enclosure.", "FDM print."],
    titleColor: "#f0f0f0",
    footer: "Material: PETG · Layer: 0.2mm",
    footerColor: "#555",
    grid: true,
    wireframe: true,
    accentLine: ACCENT,
  },
  {
    id: "commission-cta",
    bg: ACCENT,
    border: ACCENT,
    tag: "// commissions open",
    tagColor: "#0a0a0a",
    title: ["Have something", "to build?", "Let's scope it."],
    titleColor: "#0a0a0a",
    bulletColor: "#0a0a0a",
    bullets: ["Drop a brief or sketch", "Quote within 24 hours"],
    footer: "skmlabs.vercel.app",
    footerColor: "#333",
    logoDot: "#333",
    logoColor: "#0a0a0a",
    grid: false,
    accentLine: "#0a0a0a",
  },
  {
    id: "bts",
    bg: "#f5f5f0",
    border: "#e0e0d8",
    tag: "// behind the build",
    tagColor: "#888",
    title: ["From sketch", "to physical", "prototype."],
    titleColor: "#0a0a0a",
    steps: ["Brief", "Model", "Print", "Deliver"],
    footer: "Rapid iteration cycle",
    footerColor: "#888",
    logoDot: "#aaa",
    logoColor: "#0a0a0a",
    grid: false,
    accentLine: "#0a0a0a",
  },
  {
    id: "disciplines",
    bg: "#0a0a0a",
    border: ACCENT,
    tag: "// what we do",
    tagColor: ACCENT,
    title: ["05 disciplines.", "1 studio."],
    titleColor: "#f0f0f0",
    grid: true,
    accentLine: ACCENT,
    disciplines: true,
  },
];

const portraitPosts = [
  {
    id: "resin-reveal",
    bg: "#0a0a0a",
    border: "#1e1e1e",
    tag: "// print reveal",
    tagColor: ACCENT,
    title: ["Resin print.", "0.05mm", "layer height."],
    titleColor: "#f0f0f0",
    specs: ["Technology: MSLA Resin", "Resolution: 4K anti-aliased", "Post-cure: UV 405nm 2min"],
    grid: true,
    wireframe: true,
    logoDot: ACCENT,
    logoColor: "#f0f0f0",
    accentLine: ACCENT,
  },
  {
    id: "quote",
    bg: "#f5f5f0",
    border: "#e0e0d8",
    tag: "// skm.labs",
    tagColor: "#888",
    quote: '"Bring a brief or just a problem."',
    sub: "I'll scope and engineer the solution end-to-end.",
    footer: "Engineer. Builder. Maker.",
    logoDot: "#aaa",
    logoColor: "#0a0a0a",
    grid: false,
    accentLine: "#0a0a0a",
  },
];

const storyPosts = [
  {
    id: "open-work",
    bg: "#0a0a0a",
    border: "#1e1e1e",
    tag: "// status",
    title: ["Open", "for", "work."],
    titleColor: "#f0f0f0",
    tagColor: ACCENT,
    services: ["3D Printing", "Prototyping", "Commissions"],
    grid: true,
    accentLine: ACCENT,
    logoDot: ACCENT,
    logoColor: "#f0f0f0",
  },
  {
    id: "how-it-works",
    bg: ACCENT,
    border: ACCENT,
    tag: "// how it works",
    title: ["4 steps.", "Real", "results."],
    titleColor: "#0a0a0a",
    tagColor: "#0a0a0a",
    steps: ["Brief", "Quote", "Build", "Deliver"],
    grid: false,
    accentLine: "#0a0a0a",
    logoDot: "#333",
    logoColor: "#0a0a0a",
  },
  {
    id: "precision",
    bg: "#0a0a0a",
    border: ACCENT,
    tag: "// precision work",
    title: ["Fusion 360", "to physical", "part."],
    titleColor: "#f0f0f0",
    tagColor: ACCENT,
    specs: ["Parametric CAD", "FDM · SLA · Resin", "Documented output"],
    wireframe: true,
    grid: true,
    accentLine: ACCENT,
    logoDot: ACCENT,
    logoColor: "#f0f0f0",
  },
];

const GridBg = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      opacity: 0.04,
      backgroundImage: `repeating-linear-gradient(0deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px)`,
      pointerEvents: "none",
    }}
  />
);

const WireframeHex = ({ opacity = 0.12 }: { opacity?: number }) => (
  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-52%)", opacity, pointerEvents: "none" }}>
    <svg width="110" height="110" viewBox="0 0 120 120">
      <polygon points="60,10 110,35 110,85 60,110 10,85 10,35" fill="none" stroke={ACCENT} strokeWidth="1" />
      <polygon points="60,10 110,35 60,60 10,35" fill="none" stroke={ACCENT} strokeWidth="0.5" />
      <line x1="60" y1="60" x2="60" y2="110" stroke={ACCENT} strokeWidth="0.5" />
      <line x1="60" y1="60" x2="110" y2="85" stroke={ACCENT} strokeWidth="0.5" />
      <line x1="60" y1="60" x2="10" y2="85" stroke={ACCENT} strokeWidth="0.5" />
    </svg>
  </div>
);

function Logo({ color, dot, size = 18 }: { color: string; dot: string; size?: number }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: size, fontWeight: 700, color }}>
      skm<span style={{ color: dot }}>.</span>labs
    </span>
  );
}

function Cursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: 9,
        height: 16,
        background: ACCENT,
        marginLeft: 2,
        verticalAlign: "middle",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.1s",
      }}
    />
  );
}

function PubmatCard({ pm }: { pm: (typeof pubmats)[0] }) {
  return (
    <div
      style={{
        background: pm.bg,
        border: `1px solid ${pm.border}`,
        borderRadius: 12,
        aspectRatio: "1/1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 20,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {pm.grid && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
            backgroundImage: `repeating-linear-gradient(0deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px)`,
            pointerEvents: "none",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: pm.tagColor,
            marginBottom: 6,
          }}
        >
          {pm.tag}
        </div>
        <div style={{ width: 24, height: 2, background: pm.id === "cta" ? "#0a0a0a" : ACCENT, marginBottom: 10 }} />
        {pm.title && (
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 900, lineHeight: 1.15, color: pm.titleColor }}>
            {pm.title.map((line, i) => (
              <div key={i} style={{ fontStyle: i === pm.title!.length - 1 && pm.id === "hero" ? "italic" : "normal", color: i === pm.title!.length - 1 && pm.id === "hero" ? ACCENT : pm.titleColor }}>{line}</div>
            ))}
          </div>
        )}
        {pm.id === "services" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
            {services.map((s, i) => (
              <div key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ACCENT, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 8 }}>▸</span>
                {String(i + 1).padStart(2, "0")} — {s}
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          {pm.services && pm.id !== "services" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {["3D Printing", "Fabrication", "Prototyping"].map((s) => (
                <div key={s} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: pm.servicesColor, display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 8 }}>▸</span>{s}
                </div>
              ))}
            </div>
          )}
          {pm.cta && pm.id === "light" && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: "3px 8px", border: `1px solid ${ACCENT}`, color: ACCENT, borderRadius: 4 }}>
              {pm.cta}
            </div>
          )}
          {pm.cta && pm.id === "cta" && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#0a0a0a", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 8 }}>▸</span>{pm.cta}
            </div>
          )}
          {pm.url && (
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#555" }}>skmlabs.vercel.app</div>
          )}
        </div>
        <Logo color={pm.logo.color} dot={pm.logo.dot} size={13} />
      </div>
    </div>
  );
}

export default function BrandingPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        fontFamily: "'JetBrains Mono', monospace",
        color: "#f0f0f0",
        padding: "60px 24px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Fraunces:ital,wght@0,700;0,900;1,700;1,900&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#555", marginBottom: 12 }}>
            ~/skm.labs/branding$
          </div>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.1, marginBottom: 12 }}>
            skm<span style={{ color: ACCENT }}>.</span>labs
            <Cursor />
          </div>
          <div style={{ fontSize: 13, color: "#555", maxWidth: 400 }}>
            Brand identity system — colors, typography (Fraunces + JetBrains Mono), pubmat templates, and logo marks.
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1e1e1e", marginBottom: 48 }} />

        {/* Color System */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", marginBottom: 20 }}>// 01 — color system</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12 }}>
            {colors.map((c) => (
              <div
                key={c.hex}
                onClick={() => copyColor(c.hex)}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    background: c.hex,
                    border: c.hex === "#f5f5f0" || c.hex === "#f0f0f0" ? "1px solid #333" : "1px solid #1e1e1e",
                    borderRadius: 8,
                    height: 64,
                    marginBottom: 6,
                    display: "flex",
                    alignItems: "flex-end",
                    padding: 6,
                    transition: "transform 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {copied === c.hex && (
                    <span style={{ fontSize: 9, color: c.hex === "#00FF88" ? "#0a0a0a" : ACCENT }}>copied!</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: ACCENT, marginBottom: 2 }}>{c.hex}</div>
                <div style={{ fontSize: 9, color: "#555" }}>{c.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", marginBottom: 20 }}>// 02 — typography</div>

          {/* Fraunces */}
          <div style={{ borderLeft: `2px solid ${ACCENT}`, paddingLeft: 16, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 32, fontWeight: 900, color: "#f0f0f0", marginBottom: 4 }}>Fraunces</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#555" }}>Display serif — headlines &amp; hero text</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {[
              { weight: 900, label: "Black 900", sample: "Engineer. Builder. Maker.", italic: false },
              { weight: 700, label: "Bold 700 Italic", sample: "Maker.", italic: true },
              { weight: 700, label: "Bold 700", sample: "Precise work. Real deadlines.", italic: false },
            ].map((t) => (
              <div key={t.label} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#555", minWidth: 100 }}>{t.label}</span>
                <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: t.weight, fontStyle: t.italic ? "italic" : "normal", color: t.italic ? ACCENT : "#f0f0f0" }}>{t.sample}</span>
              </div>
            ))}
          </div>

          {/* JetBrains Mono */}
          <div style={{ borderLeft: `2px solid #2e2e2e`, paddingLeft: 16, marginBottom: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 32, fontWeight: 700, color: "#f0f0f0", marginBottom: 4 }}>JetBrains Mono</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#555" }}>Monospace — UI, body &amp; terminal text</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { weight: 700, label: "Bold 700", sample: "~/skm.labs$ whoami" },
              { weight: 500, label: "Medium 500", sample: "3D printing, modeling, prototyping and engineering." },
              { weight: 400, label: "Regular 400", sample: "// Precise work. Documented output. Real deadlines." },
            ].map((t) => (
              <div key={t.weight} style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#555", minWidth: 100 }}>{t.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: t.weight, color: "#f0f0f0" }}>{t.sample}</span>
              </div>
            ))}
          </div>

          {/* Pairing example */}
          <div style={{ marginTop: 28, background: "#111", border: "1px solid #1e1e1e", borderRadius: 10, padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#555", marginBottom: 12 }}>// pairing in use</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: ACCENT, marginBottom: 8 }}>~/skm.labs$ whoami</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 900, color: "#f0f0f0", lineHeight: 1.1, marginBottom: 4 }}>Engineer.</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 900, color: "#555", lineHeight: 1.1, marginBottom: 4 }}>Builder.</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 900, fontStyle: "italic", color: ACCENT, lineHeight: 1.1, marginBottom: 16 }}>Maker.</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#555", lineHeight: 1.7 }}>// 3D printing, modeling, prototyping and engineering commissions.<br />Precise work. Documented output. Real deadlines.</div>
          </div>
        </section>

        {/* Logo Marks */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", marginBottom: 20 }}>// 03 — logo marks</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[
              { bg: "#0a0a0a", border: "#1e1e1e", color: "#f0f0f0", dot: ACCENT, label: "Dark" },
              { bg: "#f5f5f0", border: "#e0e0d8", color: "#0a0a0a", dot: "#555", label: "Light" },
              { bg: ACCENT, border: ACCENT, color: "#0a0a0a", dot: "#333", label: "Accent" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    background: l.bg,
                    border: `1px solid ${l.border}`,
                    borderRadius: 8,
                    padding: "14px 20px",
                  }}
                >
                  <Logo color={l.color} dot={l.dot} size={20} />
                </div>
                <div style={{ fontSize: 9, color: "#555", textAlign: "center" }}>{l.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pubmat Templates */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", marginBottom: 20 }}>// 04 — pubmat templates (1:1)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {pubmats.map((pm) => (
              <PubmatCard key={pm.id} pm={pm} />
            ))}
          </div>
        </section>

        {/* Story Format */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", marginBottom: 20 }}>// 05 — story format (9:16)</div>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
            <div
              style={{
                background: "#0a0a0a",
                border: "1px solid #1e1e1e",
                borderRadius: 12,
                width: 160,
                aspectRatio: "9/16",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "20px 14px",
                position: "relative",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.04,
                  backgroundImage: `repeating-linear-gradient(0deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px)`,
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative", zIndex: 1 }}>
                <Logo color="#f0f0f0" dot={ACCENT} size={14} />
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 9, letterSpacing: "0.1em", color: ACCENT, marginBottom: 6 }}>~/skm.labs$</div>
                  <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.15, color: "#f0f0f0" }}>
                    Engineer.<br />Builder.<br />Maker.<Cursor />
                  </div>
                </div>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 20, height: 2, background: ACCENT, marginBottom: 8 }} />
                {services.slice(0, 3).map((s) => (
                  <div key={s} style={{ fontSize: 9, color: ACCENT, display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                    <span style={{ fontSize: 7 }}>▸</span>{s}
                  </div>
                ))}
                <div style={{ marginTop: 10, fontSize: 9, color: "#555" }}>skmlabs.vercel.app</div>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
                Use the story format for:<br />
                <br />
                <span style={{ color: ACCENT }}>▸</span> Instagram Stories<br />
                <span style={{ color: ACCENT }}>▸</span> Facebook Stories<br />
                <span style={{ color: ACCENT }}>▸</span> TikTok backgrounds<br />
                <br />
                Aspect ratio: <span style={{ color: ACCENT }}>9:16</span><br />
                Recommended size: <span style={{ color: ACCENT }}>1080 × 1920px</span>
              </div>
            </div>
          </div>
        </section>

        {/* Post Assets — Square */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", marginBottom: 6 }}>// 06 — post assets</div>
          <div style={{ fontSize: 9, color: "#333", marginBottom: 20 }}>example pubmats for social media — square (1:1), portrait (4:5), story (9:16)</div>

          <div style={{ fontSize: 9, color: "#555", marginBottom: 12, letterSpacing: "0.08em" }}>— square 1:1</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
            {squarePosts.map((p) => (
              <div key={p.id} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 10, aspectRatio: "1/1", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 18, position: "relative", overflow: "hidden" }}>
                {p.grid && <GridBg />}
                {p.wireframe && <WireframeHex />}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.1em", color: p.tagColor, marginBottom: 5 }}>{p.tag}</div>
                  <div style={{ width: 18, height: 2, background: p.accentLine, marginBottom: 8 }} />
                  {p.title && (
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 900, lineHeight: 1.15, color: p.titleColor }}>
                      {p.title.map((l, i) => <div key={i} style={{ fontStyle: i === p.title!.length - 1 ? "italic" : "normal" }}>{l}</div>)}
                    </div>
                  )}
                  {p.bullets && (
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                      {p.bullets.map((b) => (
                        <div key={b} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.bulletColor, display: "flex", gap: 5, alignItems: "center" }}>
                          <span style={{ fontSize: 7 }}>▸</span>{b}
                        </div>
                      ))}
                    </div>
                  )}
                  {p.steps && (
                    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 3 }}>
                      {p.steps.map((s, i) => (
                        <div key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#0a0a0a", display: "flex", gap: 6, alignItems: "center" }}>
                          <span style={{ color: ACCENT, fontSize: 7 }}>▸</span>
                          <span style={{ color: "#aaa", minWidth: 14 }}>0{i + 1}</span>{s}
                        </div>
                      ))}
                    </div>
                  )}
                  {p.disciplines && (
                    <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                      {["3D Printing", "3D Modeling", "Prototyping", "R&D Eng.", "Commissions"].map((s, i) => (
                        <div key={s} style={{ border: "1px solid #1e1e1e", borderRadius: 5, padding: "5px 7px" }}>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 7, color: "#555", marginBottom: 1 }}>0{i + 1}</div>
                          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#f0f0f0" }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: p.footerColor }}>{p.footer}</div>
                  <Logo color={p.logoColor ?? "#f0f0f0"} dot={p.logoDot ?? ACCENT} size={11} />
                </div>
              </div>
            ))}
          </div>

          {/* Portrait 4:5 */}
          <div style={{ fontSize: 9, color: "#555", marginBottom: 12, letterSpacing: "0.08em" }}>— portrait 4:5</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 32 }}>
            {portraitPosts.map((p) => (
              <div key={p.id} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 10, aspectRatio: "4/5", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20, position: "relative", overflow: "hidden" }}>
                {p.grid && <GridBg />}
                {p.wireframe && (
                  <div style={{ position: "absolute", top: "45%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.1, pointerEvents: "none" }}>
                    <svg width="140" height="140" viewBox="0 0 120 120">
                      <rect x="10" y="30" width="100" height="60" fill="none" stroke={ACCENT} strokeWidth="1" />
                      <rect x="30" y="10" width="60" height="100" fill="none" stroke={ACCENT} strokeWidth="0.5" />
                      <line x1="10" y1="30" x2="30" y2="10" stroke={ACCENT} strokeWidth="0.5" />
                      <line x1="110" y1="30" x2="90" y2="10" stroke={ACCENT} strokeWidth="0.5" />
                      <line x1="110" y1="90" x2="90" y2="110" stroke={ACCENT} strokeWidth="0.5" />
                      <line x1="10" y1="90" x2="30" y2="110" stroke={ACCENT} strokeWidth="0.5" />
                      <circle cx="60" cy="60" r="25" fill="none" stroke={ACCENT} strokeWidth="0.5" strokeDasharray="4,4" />
                    </svg>
                  </div>
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.1em", color: p.tagColor, marginBottom: 5 }}>{p.tag}</div>
                  <div style={{ width: 18, height: 2, background: p.accentLine, marginBottom: 8 }} />
                  {p.title && (
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 900, lineHeight: 1.1, color: p.titleColor }}>
                      {p.title.map((l, i) => <div key={i} style={{ fontStyle: i === p.title!.length - 1 ? "italic" : "normal" }}>{l}</div>)}
                    </div>
                  )}
                  {p.quote && (
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "#0a0a0a", lineHeight: 1.15 }}>{p.quote}</div>
                  )}
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  {p.specs && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#555", marginBottom: 4 }}>$ print-specs.txt</div>
                      {p.specs.map((s) => (
                        <div key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: ACCENT, display: "flex", gap: 5, alignItems: "center", marginBottom: 3 }}>
                          <span style={{ fontSize: 7 }}>▸</span>{s}
                        </div>
                      ))}
                    </div>
                  )}
                  {p.sub && (
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>{p.sub}</div>
                  )}
                  {p.sub && <div style={{ height: 1, background: "#e0e0d8", marginBottom: 12 }} />}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: p.footer === "skmlabs.vercel.app" ? "#555" : "#aaa" }}>{p.footer}</div>
                    <Logo color={p.logoColor} dot={p.logoDot} size={11} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Story 9:16 */}
          <div style={{ fontSize: 9, color: "#555", marginBottom: 12, letterSpacing: "0.08em" }}>— story 9:16</div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {storyPosts.map((p) => (
              <div key={p.id} style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 12, width: 148, aspectRatio: "9/16", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "18px 14px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                {p.grid && <GridBg />}
                {p.wireframe && (
                  <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%)", opacity: 0.1, pointerEvents: "none" }}>
                    <svg width="90" height="90" viewBox="0 0 100 100">
                      <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" fill="none" stroke={ACCENT} strokeWidth="1" />
                      <line x1="50" y1="5" x2="50" y2="50" stroke={ACCENT} strokeWidth="0.5" />
                      <line x1="95" y1="27" x2="50" y2="50" stroke={ACCENT} strokeWidth="0.5" />
                      <line x1="5" y1="27" x2="50" y2="50" stroke={ACCENT} strokeWidth="0.5" />
                    </svg>
                  </div>
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <Logo color={p.logoColor} dot={p.logoDot} size={12} />
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, letterSpacing: "0.1em", color: p.tagColor, marginBottom: 5 }}>{p.tag}</div>
                    <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 900, lineHeight: 1.1, color: p.titleColor }}>
                      {p.title.map((l, i) => <div key={i} style={{ fontStyle: i === p.title.length - 1 ? "italic" : "normal", color: i === p.title.length - 1 && p.id === "open-work" ? ACCENT : p.titleColor }}>{l}</div>)}
                    </div>
                  </div>
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ width: 18, height: 2, background: p.accentLine, marginBottom: 8 }} />
                  {p.services && p.services.map((s) => (
                    <div key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: ACCENT, display: "flex", gap: 4, alignItems: "center", marginBottom: 3 }}>
                      <span style={{ fontSize: 7 }}>▸</span>{s}
                    </div>
                  ))}
                  {p.steps && p.steps.map((s, i) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <div style={{ width: 18, height: 18, border: "1px solid #0a0a0a", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 7, fontWeight: 700, color: "#0a0a0a" }}>0{i + 1}</div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700, color: "#0a0a0a" }}>{s}</div>
                    </div>
                  ))}
                  {p.specs && p.specs.map((s) => (
                    <div key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#555", marginBottom: 3 }}>{s}</div>
                  ))}
                  <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: p.id === "how-it-works" ? "#333" : "#555" }}>skmlabs.vercel.app</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Facebook Header */}
        <section style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#555", marginBottom: 6 }}>// 07 — facebook header (820 × 312px)</div>
          <div style={{ fontSize: 9, color: "#333", marginBottom: 20 }}>reference layout for fb page cover photo</div>

          {/* Dark version */}
          <div style={{ fontSize: 9, color: "#555", marginBottom: 10, letterSpacing: "0.08em" }}>— dark</div>
          <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 10, aspectRatio: "820/312", display: "flex", alignItems: "stretch", position: "relative", overflow: "hidden", marginBottom: 16 }}>
            {/* Grid bg */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `repeating-linear-gradient(0deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px)`, pointerEvents: "none" }} />
            {/* Left */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.12em", color: "#555", marginBottom: 6 }}>~/skm.labs$</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 900, color: "#f0f0f0", lineHeight: 1.1, marginBottom: 6 }}>
                skm<span style={{ color: ACCENT }}>.</span>labs
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#555" }}>Engineer. Builder. Maker.</div>
            </div>
            {/* Divider */}
            <div style={{ width: 1, background: "#1e1e1e", margin: "24px 0" }} />
            {/* Right */}
            <div style={{ width: 240, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px", position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#555", marginBottom: 10, letterSpacing: "0.1em" }}>// services</div>
              {services.map((s, i) => (
                <div key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: ACCENT, display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 7 }}>▸</span>
                  <span style={{ color: "#555", minWidth: 16 }}>0{i + 1}</span>{s}
                </div>
              ))}
              <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#333" }}>skmlabs.vercel.app</div>
            </div>
          </div>

          {/* Light version */}
          <div style={{ fontSize: 9, color: "#555", marginBottom: 10, letterSpacing: "0.08em" }}>— light</div>
          <div style={{ background: "#f5f5f0", border: "1px solid #e0e0d8", borderRadius: 10, aspectRatio: "820/312", display: "flex", alignItems: "stretch", position: "relative", overflow: "hidden", marginBottom: 16 }}>
            {/* Left */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, letterSpacing: "0.12em", color: "#aaa", marginBottom: 6 }}>~/skm.labs$</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.1, marginBottom: 6 }}>
                skm<span style={{ color: "#555" }}>.</span>labs
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#888" }}>Engineer. Builder. Maker.</div>
            </div>
            {/* Divider */}
            <div style={{ width: 1, background: "#e0e0d8", margin: "24px 0" }} />
            {/* Right */}
            <div style={{ width: 240, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px", position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#aaa", marginBottom: 10, letterSpacing: "0.1em" }}>// services</div>
              {services.map((s, i) => (
                <div key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#0a0a0a", display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 7, color: ACCENT }}>▸</span>
                  <span style={{ color: "#aaa", minWidth: 16 }}>0{i + 1}</span>{s}
                </div>
              ))}
              <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#aaa" }}>skmlabs.vercel.app</div>
            </div>
          </div>

          {/* Green accent version */}
          <div style={{ fontSize: 9, color: "#555", marginBottom: 10, letterSpacing: "0.08em" }}>— accent</div>
          <div style={{ background: "#0a0a0a", border: `1px solid ${ACCENT}`, borderRadius: 10, aspectRatio: "820/312", display: "flex", alignItems: "stretch", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `repeating-linear-gradient(0deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px),repeating-linear-gradient(90deg,${ACCENT} 0px,${ACCENT} 1px,transparent 1px,transparent 32px)`, pointerEvents: "none" }} />
            {/* Left */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 32px", position: "relative", zIndex: 1 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: "3px 10px", border: `1px solid ${ACCENT}`, color: ACCENT, borderRadius: 4 }}>open for work</div>
              </div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 32, fontWeight: 900, color: "#f0f0f0", lineHeight: 1.1, marginBottom: 6 }}>
                skm<span style={{ color: ACCENT }}>.</span>labs
              </div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#555" }}>Engineer. Builder. Maker.</div>
            </div>
            {/* Divider */}
            <div style={{ width: 1, background: "#1e1e1e", margin: "24px 0" }} />
            {/* Right */}
            <div style={{ width: 240, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px", position: "relative", zIndex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#555", marginBottom: 10, letterSpacing: "0.1em" }}>// services</div>
              {services.map((s, i) => (
                <div key={s} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: ACCENT, display: "flex", gap: 6, alignItems: "center", marginBottom: 5 }}>
                  <span style={{ fontSize: 7 }}>▸</span>
                  <span style={{ color: "#555", minWidth: 16 }}>0{i + 1}</span>{s}
                </div>
              ))}
              <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: "#333" }}>skmlabs.vercel.app</div>
            </div>
          </div>

          <div style={{ marginTop: 12, fontSize: 9, color: "#333" }}>
            <span style={{ color: ACCENT }}>▸</span> Recommended export size: <span style={{ color: ACCENT }}>820 × 312px</span> · Safe zone: keep key content within center <span style={{ color: ACCENT }}>640px</span>
          </div>
        </section>

        {/* Footer */}
        <div style={{ height: 1, background: "#1e1e1e", marginBottom: 24 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Logo color="#f0f0f0" dot={ACCENT} size={14} />
          <div style={{ fontSize: 10, color: "#555" }}>© 2026 skm.labs — brand identity v1.4</div>
        </div>

      </div>
    </div>
  );
}