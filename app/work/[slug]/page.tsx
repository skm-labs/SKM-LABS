"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:     "#0d0f0e",
  surf:   "#131614",
  bdr:    "#1e2320",
  bdrHi:  "#2a3029",
  muted:  "#3d4840",
  dim:    "#637060",
  mid:    "#8a9e86",
  text:   "#cdd9c8",
  bright: "#e8f0e4",
  accent: "#4ade80",
};

const SERVICE_LABELS: Record<string, string> = {
  "3d_printing": "3D Printing",
  "modeling":    "3D Modeling",
  "prototyping": "Prototyping",
  "research":    "Research & Engineering",
  "commissions": "Commissions",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface Project {
  id:           string;
  title:        string;
  slug:         string;
  description:  string;
  body:         string | null;
  service:      string;
  tags:         string[];
  cover_image:  string | null;
  images:       string[];
  featured:     boolean;
  created_at:   string;
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Fraunces', serif" };

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav style={{
      position: "fixed", inset: "0 0 auto 0", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2.5rem", height: 60,
      background: "rgba(13,15,14,0.94)", backdropFilter: "blur(14px)",
      borderBottom: `1px solid ${C.bdr}`,
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 26, height: 26, border: `1px solid ${C.accent}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...mono, fontSize: 9, color: C.accent }}>skm</span>
        </div>
        <span style={{ ...mono, fontSize: 13, color: C.bright, letterSpacing: "0.04em" }}>.labs</span>
      </a>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <a href="/work" style={{ ...mono, fontSize: 10, letterSpacing: "0.12em", color: C.dim, textDecoration: "none", textTransform: "uppercase" }}
          onMouseEnter={e => (e.currentTarget.style.color = C.text)}
          onMouseLeave={e => (e.currentTarget.style.color = C.dim)}
        >← All work</a>
        <a href="/commissions" style={{
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

// ── Image gallery ─────────────────────────────────────────────────────────────
function Gallery({ cover, images }: { cover: string | null; images: string[] }) {
  const all = [cover, ...images].filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  if (all.length === 0) return (
    <div style={{
      aspectRatio: "16/9", background: C.surf,
      border: `1px solid ${C.bdr}`, borderRadius: 4,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ ...mono, fontSize: 36, color: C.muted }}>◈</span>
    </div>
  );

  return (
    <div>
      {/* Main image */}
      <div style={{
        aspectRatio: "16/9", borderRadius: 4, overflow: "hidden",
        border: `1px solid ${C.bdr}`, background: C.surf, position: "relative",
        marginBottom: all.length > 1 ? "0.75rem" : 0,
      }}>
        <img
          key={active}
          src={all[active]}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Index badge */}
        {all.length > 1 && (
          <div style={{
            position: "absolute", bottom: "0.75rem", right: "0.75rem",
            ...mono, fontSize: 9, letterSpacing: "0.1em",
            color: C.dim, background: "rgba(13,15,14,0.75)", borderRadius: 2,
            padding: "3px 8px", backdropFilter: "blur(6px)",
          }}>
            {active + 1} / {all.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {all.length > 1 && (
        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
          {all.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0, width: 72, height: 54,
                borderRadius: 3, overflow: "hidden", cursor: "pointer",
                border: `1px solid ${i === active ? C.accent : C.bdr}`,
                background: "none", padding: 0, transition: "border-color 0.2s",
              }}
            >
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: i === active ? 1 : 0.5, transition: "opacity 0.2s" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ maxWidth: 1060, margin: "0 auto", padding: "5rem 2.5rem" }}>
      <div style={{ height: 12, width: "30%", background: C.bdr, borderRadius: 2, marginBottom: "2rem" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "3.5rem" }}>
        <div>
          <div style={{ aspectRatio: "16/9", background: C.surf, borderRadius: 4, border: `1px solid ${C.bdr}`, marginBottom: "2rem" }} />
          {[1,2,3,4].map(i => (
            <div key={i} style={{ height: 10, background: C.bdr, borderRadius: 2, marginBottom: 12, width: i % 2 === 0 ? "80%" : "95%" }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ height: 40, background: C.bdr, borderRadius: 2, width: "70%" }} />
          <div style={{ height: 10, background: C.bdr, borderRadius: 2, width: "40%" }} />
          <div style={{ height: 10, background: C.bdr, borderRadius: 2, width: "55%" }} />
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectDetailPage() {
  const params  = useParams();
  const slug    = params?.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    async function fetchProject() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProject(data);
      }
      setLoading(false);
    }
    fetchProject();
  }, [slug]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d0f0e; -webkit-font-smoothing: antialiased; }
        a { text-decoration: none; }
        ::selection { background: #4ade8033; color: #e8f0e4; }

        /* Body markdown styles */
        .project-body h2 { font-family: 'Fraunces', serif; font-size: 1.3rem; font-weight: 700; color: #e8f0e4; margin: 2rem 0 0.75rem; letter-spacing: -0.02em; }
        .project-body h3 { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 700; color: #cdd9c8; margin: 1.5rem 0 0.5rem; }
        .project-body p  { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; line-height: 1.9; color: #637060; margin-bottom: 1rem; }
        .project-body ul { padding-left: 1.25rem; margin-bottom: 1rem; }
        .project-body li { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; line-height: 1.9; color: #637060; }
        .project-body strong { color: #8a9e86; font-weight: 500; }
        .project-body code  { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; background: #131614; border: 1px solid #1e2320; border-radius: 2px; padding: 1px 6px; color: #4ade80; }
      `}</style>

      <Nav />

      <main style={{ minHeight: "100svh", background: C.bg, paddingTop: 60 }}>
        {loading ? <Skeleton /> : notFound || !project ? (
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "8rem 2.5rem", textAlign: "center" }}>
            <span style={{ ...mono, fontSize: 40, color: C.muted, display: "block", marginBottom: "1rem" }}>◎</span>
            <h1 style={{ ...serif, fontSize: "1.5rem", fontWeight: 900, color: C.bright, marginBottom: "0.5rem" }}>Project not found</h1>
            <p style={{ ...mono, fontSize: "0.75rem", color: C.dim, marginBottom: "2rem" }}>This project may have been removed or the URL is incorrect.</p>
            <a href="/work" style={{
              ...mono, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
              color: C.bg, background: C.accent, padding: "12px 24px", borderRadius: 3,
            }}>← Back to work</a>
          </div>
        ) : (
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "4rem 2.5rem 6rem" }}>

            {/* Breadcrumb */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2.5rem" }}>
              <a href="/work" style={{ ...mono, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim, transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                onMouseLeave={e => (e.currentTarget.style.color = C.dim)}
              >Work</a>
              <span style={{ ...mono, fontSize: "0.68rem", color: C.muted }}>/</span>
              <span style={{ ...mono, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.mid }}>{project.title}</span>
            </div>

            {/* Main layout: image left, meta right */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr min(380px, 35%)",
              gap: "3.5rem",
              alignItems: "start",
            }}>
              {/* Left: gallery + body */}
              <div>
                <Gallery cover={project.cover_image} images={project.images ?? []} />

                {project.body && (
                  <div
                    className="project-body"
                    style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: `1px solid ${C.bdr}` }}
                    dangerouslySetInnerHTML={{ __html: simpleMarkdown(project.body) }}
                  />
                )}
              </div>

              {/* Right: sticky meta */}
              <div style={{
                position: "sticky", top: 80,
                background: C.surf, border: `1px solid ${C.bdr}`,
                borderRadius: 4, padding: "1.75rem",
                display: "flex", flexDirection: "column", gap: "1.5rem",
              }}>
                {/* Service badge */}
                <div>
                  <span style={{
                    ...mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
                    color: C.bg, background: C.accent, padding: "4px 10px", borderRadius: 2,
                  }}>
                    {SERVICE_LABELS[project.service] ?? project.service}
                  </span>
                </div>

                {/* Title */}
                <h1 style={{
                  ...serif, fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 900,
                  color: C.bright, letterSpacing: "-0.025em", lineHeight: 1.1,
                }}>
                  {project.title}
                </h1>

                {/* Description */}
                <p style={{ ...mono, fontSize: "0.78rem", lineHeight: 1.85, color: C.dim }}>
                  {project.description}
                </p>

                {/* Tags */}
                <div>
                  <p style={{ ...mono, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "0.6rem" }}>Tags</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {project.tags.map(t => (
                      <span key={t} style={{
                        ...mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
                        color: C.mid, border: `1px solid ${C.bdr}`, borderRadius: 2, padding: "3px 8px",
                      }}>{t}</span>
                    ))}
                  </div>
                </div>

                {/* Date */}
                <div style={{ borderTop: `1px solid ${C.bdr}`, paddingTop: "1.25rem" }}>
                  <p style={{ ...mono, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "0.35rem" }}>Completed</p>
                  <p style={{ ...mono, fontSize: "0.78rem", color: C.dim }}>
                    {new Date(project.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>

                {/* CTA */}
                <div style={{ borderTop: `1px solid ${C.bdr}`, paddingTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <a href="/commissions" style={{
                    ...mono, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                    color: C.bg, background: C.accent, padding: "13px 0", borderRadius: 3,
                    textDecoration: "none", display: "block", textAlign: "center",
                    transition: "opacity 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >Start a similar project</a>
                  <a href="/contact" style={{
                    ...mono, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                    color: C.mid, border: `1px solid ${C.bdr}`, padding: "13px 0", borderRadius: 3,
                    textDecoration: "none", display: "block", textAlign: "center",
                    transition: "border-color 0.2s, color 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.muted; e.currentTarget.style.color = C.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdr;   e.currentTarget.style.color = C.mid; }}
                  >Ask a question</a>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${C.bdr}` }}>
              <a href="/work" style={{
                ...mono, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: C.dim, transition: "color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                onMouseLeave={e => (e.currentTarget.style.color = C.dim)}
              >← Back to all work</a>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

// ── Minimal markdown → HTML (no external dep needed) ─────────────────────────
function simpleMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}
