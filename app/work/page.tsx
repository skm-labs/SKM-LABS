"use client";

import { useState, useEffect, useMemo } from "react";
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

// ── Types ─────────────────────────────────────────────────────────────────────
interface Project {
  id:           string;
  title:        string;
  slug:         string;
  description:  string;
  service:      string;
  tags:         string[];
  cover_image:  string | null;
  featured:     boolean;
  sort_order:   number;
}

// ── Service filter options ────────────────────────────────────────────────────
const SERVICE_FILTERS = [
  { value: "all",         label: "All work" },
  { value: "3d_printing", label: "3D Printing" },
  { value: "modeling",    label: "3D Modeling" },
  { value: "prototyping", label: "Prototyping" },
  { value: "research",    label: "Research" },
  { value: "commissions", label: "Commissions" },
];

const SERVICE_LABELS: Record<string, string> = {
  "3d_printing": "3D Printing",
  "modeling":    "3D Modeling",
  "prototyping": "Prototyping",
  "research":    "Research & Engineering",
  "commissions": "Commissions",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Fraunces', serif" };

// ── Components ────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav style={{
      position: "fixed", inset: "0 0 auto 0", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2.5rem", height: 60,
      background: "rgba(13,15,14,0.92)", backdropFilter: "blur(14px)",
      borderBottom: `1px solid ${C.bdr}`,
    }}>
      <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <div style={{ width: 26, height: 26, border: `1px solid ${C.accent}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ ...mono, fontSize: 9, color: C.accent }}>skm</span>
        </div>
        <span style={{ ...mono, fontSize: 13, color: C.bright, letterSpacing: "0.04em" }}>.labs</span>
      </a>
      <div style={{ display: "flex", gap: "1.75rem", alignItems: "center" }}>
        <a href="/#services" style={{ ...mono, fontSize: 10, letterSpacing: "0.12em", color: C.dim, textDecoration: "none", textTransform: "uppercase" }}
          onMouseEnter={e => (e.currentTarget.style.color = C.text)}
          onMouseLeave={e => (e.currentTarget.style.color = C.dim)}
        >Services</a>
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

// ── Featured hero card ────────────────────────────────────────────────────────
function FeaturedCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/work/${project.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        position: "relative", borderRadius: 4, overflow: "hidden",
        border: `1px solid ${hovered ? C.bdrHi : C.bdr}`,
        transition: "border-color 0.3s",
        aspectRatio: "16/7",
        background: C.surf,
      }}>
        {/* Cover image */}
        {project.cover_image && (
          <img
            src={project.cover_image}
            alt={project.title}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", opacity: hovered ? 0.55 : 0.4,
              transition: "opacity 0.4s",
            }}
          />
        )}
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(13,15,14,0.98) 0%, rgba(13,15,14,0.4) 60%, transparent 100%)",
        }} />
        {/* Featured badge */}
        <div style={{
          position: "absolute", top: "1.5rem", left: "1.5rem",
          ...mono, fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
          color: C.bg, background: C.accent, padding: "4px 10px", borderRadius: 2,
        }}>Featured</div>

        {/* Content */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2rem" }}>
          <div style={{ ...mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: C.mid, marginBottom: "0.6rem" }}>
            {SERVICE_LABELS[project.service] ?? project.service}
          </div>
          <h2 style={{
            ...serif, fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 900,
            color: C.bright, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "0.75rem",
          }}>{project.title}</h2>
          <p style={{ ...mono, fontSize: "0.78rem", lineHeight: 1.8, color: C.dim, maxWidth: 560, marginBottom: "1rem" }}>
            {project.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {project.tags.map(t => (
              <span key={t} style={{
                ...mono, fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
                color: C.mid, border: `1px solid ${C.bdr}`, borderRadius: 2, padding: "3px 8px",
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Arrow indicator */}
        <div style={{
          position: "absolute", top: "1.5rem", right: "1.5rem",
          ...mono, fontSize: 18, color: hovered ? C.accent : C.muted,
          transition: "color 0.2s, transform 0.2s",
          transform: hovered ? "translate(3px,-3px)" : "translate(0,0)",
        }}>↗</div>
      </div>
    </a>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={`/work/${project.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: C.surf, borderRadius: 4, overflow: "hidden",
        border: `1px solid ${hovered ? C.bdrHi : C.bdr}`,
        transition: "border-color 0.3s",
        display: "flex", flexDirection: "column",
      }}>
        {/* Image */}
        <div style={{ aspectRatio: "4/3", overflow: "hidden", background: C.bg, position: "relative" }}>
          {project.cover_image ? (
            <img
              src={project.cover_image}
              alt={project.title}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                opacity: hovered ? 0.85 : 0.65,
                transform: hovered ? "scale(1.04)" : "scale(1)",
                transition: "opacity 0.4s, transform 0.5s",
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ ...mono, fontSize: 32, color: C.muted }}>◈</span>
            </div>
          )}
          {/* Service badge */}
          <div style={{
            position: "absolute", top: "0.75rem", left: "0.75rem",
            ...mono, fontSize: 8, letterSpacing: "0.1em", textTransform: "uppercase",
            color: C.bg, background: C.accent, padding: "3px 8px", borderRadius: 2,
            opacity: hovered ? 1 : 0, transition: "opacity 0.2s",
          }}>
            {SERVICE_LABELS[project.service] ?? project.service}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ ...mono, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted }}>
              {SERVICE_LABELS[project.service] ?? project.service}
            </span>
            <span style={{
              ...mono, fontSize: 14, color: hovered ? C.accent : C.muted,
              transition: "color 0.2s, transform 0.2s",
              transform: hovered ? "translate(2px,-2px)" : "translate(0,0)",
              display: "inline-block",
            }}>↗</span>
          </div>
          <h3 style={{
            ...serif, fontSize: "1.1rem", fontWeight: 700, color: C.bright,
            letterSpacing: "-0.01em", lineHeight: 1.2,
          }}>{project.title}</h3>
          <p style={{ ...mono, fontSize: "0.73rem", lineHeight: 1.8, color: C.dim, flex: 1 }}>
            {project.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", paddingTop: "0.25rem" }}>
            {project.tags.slice(0, 3).map(t => (
              <span key={t} style={{
                ...mono, fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase",
                color: C.muted, border: `1px solid ${C.bdr}`, borderRadius: 2, padding: "2px 7px",
              }}>{t}</span>
            ))}
            {project.tags.length > 3 && (
              <span style={{ ...mono, fontSize: 8, color: C.muted }}>+{project.tags.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: C.surf, borderRadius: 4, border: `1px solid ${C.bdr}`, overflow: "hidden" }}>
      <div style={{ aspectRatio: "4/3", background: C.bg }} />
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ height: 10, width: "40%", background: C.bdr, borderRadius: 2 }} />
        <div style={{ height: 16, width: "75%", background: C.bdr, borderRadius: 2 }} />
        <div style={{ height: 10, width: "90%", background: C.bdr, borderRadius: 2 }} />
        <div style={{ height: 10, width: "60%", background: C.bdr, borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WorkPage() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from("projects")
        .select("id,title,slug,description,service,tags,cover_image,featured,sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (!error && data) setProjects(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const featured = useMemo(() => projects.find(p => p.featured), [projects]);

  const filtered = useMemo(() => {
    let list = projects.filter(p => !p.featured || projects.filter(x => !x.featured).length === 0);
    // Always include non-featured; include featured in grid only if no dedicated hero slot
    list = projects.filter(p => !p.featured);
    if (filter !== "all") list = list.filter(p => p.service === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        (SERVICE_LABELS[p.service] ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [projects, filter, search]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d0f0e; -webkit-font-smoothing: antialiased; }
        a { text-decoration: none; }
        ::selection { background: #4ade8033; color: #e8f0e4; }
        input::placeholder { color: #3d4840; }
        input:focus { outline: none; border-color: #4ade80 !important; }
      `}</style>

      <Nav />

      <main style={{ minHeight: "100svh", background: C.bg, paddingTop: 60 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "4rem 2.5rem 6rem" }}>

          {/* Page header */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ ...mono, fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: "0.75rem" }}>
              &gt; work
            </p>
            <h1 style={{
              ...serif, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900,
              color: C.bright, letterSpacing: "-0.03em", marginBottom: "0.5rem",
            }}>
              Selected projects
            </h1>
            <p style={{ ...mono, fontSize: "0.78rem", color: C.dim, lineHeight: 1.8 }}>
              <span style={{ color: C.mid }}>// </span>
              {loading ? "Loading…" : `${projects.length} project${projects.length !== 1 ? "s" : ""} across 5 disciplines`}
            </p>
          </div>

          {/* Featured hero */}
          {!loading && featured && (
            <div style={{ marginBottom: "3rem" }}>
              <FeaturedCard project={featured} />
            </div>
          )}
          {loading && (
            <div style={{ marginBottom: "3rem", aspectRatio: "16/7", background: C.surf, borderRadius: 4, border: `1px solid ${C.bdr}` }} />
          )}

          {/* Filter + Search bar */}
          <div style={{
            display: "flex", gap: "1rem", flexWrap: "wrap",
            alignItems: "center", marginBottom: "2rem",
            paddingBottom: "1.5rem", borderBottom: `1px solid ${C.bdr}`,
          }}>
            {/* Filter pills */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", flex: 1 }}>
              {SERVICE_FILTERS.map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)} style={{
                  ...mono, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase",
                  color: filter === f.value ? C.bg : C.dim,
                  background: filter === f.value ? C.accent : "transparent",
                  border: `1px solid ${filter === f.value ? C.accent : C.bdr}`,
                  borderRadius: 2, padding: "5px 12px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { if (filter !== f.value) { e.currentTarget.style.borderColor = C.muted; e.currentTarget.style.color = C.text; } }}
                  onMouseLeave={e => { if (filter !== f.value) { e.currentTarget.style.borderColor = C.bdr; e.currentTarget.style.color = C.dim; } }}
                >{f.label}</button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative", minWidth: 220 }}>
              <span style={{
                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                ...mono, fontSize: 11, color: C.muted, pointerEvents: "none",
              }}>⌕</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects…"
                style={{
                  ...mono, fontSize: "0.75rem", color: C.text,
                  background: C.surf, border: `1px solid ${C.bdr}`,
                  borderRadius: 3, padding: "7px 12px 7px 28px",
                  width: "100%", transition: "border-color 0.2s",
                }}
              />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.25rem" }}>
              {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <span style={{ ...mono, fontSize: 32, color: C.muted, display: "block", marginBottom: "1rem" }}>◎</span>
              <p style={{ ...mono, fontSize: "0.78rem", color: C.dim }}>No projects match that filter.</p>
              <button onClick={() => { setFilter("all"); setSearch(""); }} style={{
                ...mono, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase",
                color: C.mid, background: "transparent", border: `1px solid ${C.bdr}`,
                borderRadius: 2, padding: "8px 16px", cursor: "pointer", marginTop: "1rem",
                transition: "border-color 0.2s, color 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.muted; e.currentTarget.style.color = C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdr; e.currentTarget.style.color = C.mid; }}
              >Clear filters</button>
            </div>
          ) : (
            <>
              <p style={{ ...mono, fontSize: "0.68rem", letterSpacing: "0.1em", color: C.muted, marginBottom: "1.25rem" }}>
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                {filter !== "all" ? ` in ${SERVICE_FILTERS.find(f => f.value === filter)?.label}` : ""}
                {search.trim() ? ` matching "${search}"` : ""}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "1.25rem" }}>
                {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
            </>
          )}

          {/* CTA strip */}
          {!loading && (
            <div style={{
              marginTop: "5rem", padding: "2.5rem",
              border: `1px solid ${C.bdr}`, borderRadius: 4, background: C.surf,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              flexWrap: "wrap", gap: "1.5rem",
            }}>
              <div>
                <h3 style={{ ...serif, fontSize: "1.3rem", fontWeight: 900, color: C.bright, letterSpacing: "-0.02em", marginBottom: "0.35rem" }}>
                  Want something like this?
                </h3>
                <p style={{ ...mono, fontSize: "0.75rem", color: C.dim }}>
                  Submit a brief and I&apos;ll quote within 24 hours.
                </p>
              </div>
              <a href="/commissions" style={{
                ...mono, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: C.bg, background: C.accent, padding: "13px 26px",
                borderRadius: 3, transition: "opacity 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >Start a project</a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
