"use client";

import { useState } from "react";
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
  err:    "#f87171",
  warn:   "#fbbf24",
};

const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Fraunces', serif" };

// ── Data ─────────────────────────────────────────────────────────────────────
const SERVICES = [
  { id: "3d_printing",  glyph: "▣", label: "3D Printing",            sub: "FDM · Resin · SLA" },
  { id: "modeling",     glyph: "◈", label: "3D Modeling",             sub: "Fusion 360 · Blender" },
  { id: "prototyping",  glyph: "⬡", label: "Prototyping",             sub: "Rapid · PoC · Fit checks" },
  { id: "research",     glyph: "◎", label: "Research & Engineering",  sub: "Analysis · Validation · Docs" },
  { id: "commissions",  glyph: "◇", label: "Custom Commission",       sub: "Bespoke · One-off · Short-run" },
];

// Available time slots — every day 7 PM onwards (PH time)
const TIME_SLOTS = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
const TIME_LABELS: Record<string, string> = {
  "19:00": "7:00 PM", "19:30": "7:30 PM", "20:00": "8:00 PM",
  "20:30": "8:30 PM", "21:00": "9:00 PM", "21:30": "9:30 PM", "22:00": "10:00 PM",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1 — service
  service: string;
  // Step 2 — about the client
  client_name:  string;
  client_email: string;
  client_phone: string;
  client_intro: string;
  // Step 3 — project brief
  project_name:           string;
  project_specifications: string;
  hardware_name:          string;
  project_fee:            string;
  prototype_due_date:     string;
  source_code_due_date:   string;
  hardware_due_date:      string;
  documentation_due_date: string;
  // Step 4 — meeting slot
  meeting_date: string;
  meeting_time: string;
}

const EMPTY: FormData = {
  service: "", client_name: "", client_email: "", client_phone: "",
  client_intro: "", project_name: "", project_specifications: "",
  hardware_name: "", project_fee: "", prototype_due_date: "",
  source_code_due_date: "", hardware_due_date: "", documentation_due_date: "",
  meeting_date: "", meeting_time: "",
};

// ── Shared UI ─────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  ...mono, fontSize: "0.8rem", color: C.text,
  background: C.bg, border: `1px solid ${C.bdr}`,
  borderRadius: 3, padding: "11px 14px", width: "100%",
  outline: "none", transition: "border-color 0.2s", lineHeight: 1.6,
};

function Label({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <label style={{ ...mono, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.mid, display: "block", marginBottom: 7 }}>
      {children}
      {error && <span style={{ color: C.err, marginLeft: 8, textTransform: "none", letterSpacing: 0 }}>— {error}</span>}
    </label>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><Label error={error}>{label}</Label>{children}</div>;
}

function StepHead({ n, title, sub }: { n: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <span style={{ ...mono, fontSize: "0.62rem", letterSpacing: "0.14em", color: C.accent, display: "block", marginBottom: 5 }}>{n}</span>
      <h2 style={{ ...serif, fontSize: "1.4rem", fontWeight: 900, color: C.bright, letterSpacing: "-0.02em", marginBottom: 4 }}>{title}</h2>
      <p style={{ ...mono, fontSize: "0.72rem", color: C.dim }}><span style={{ color: C.mid }}>// </span>{sub}</p>
    </div>
  );
}

// ── Calendar helpers ──────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function isPast(y: number, m: number, d: number) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(y, m, d) < today;
}

// ── Calendar component ────────────────────────────────────────────────────────
function Calendar({ selected, onSelect }: { selected: string; onSelect: (d: string) => void }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const days = getDaysInMonth(view.year, view.month);
  const firstDay = getFirstDayOfMonth(view.year, view.month);
  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function prev() {
    setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  }
  function next() {
    setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  }

  return (
    <div style={{ background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: 4, padding: "1.25rem" }}>
      {/* Month nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <button onClick={prev} style={{ ...mono, fontSize: 14, color: C.mid, background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>←</button>
        <span style={{ ...mono, fontSize: "0.75rem", letterSpacing: "0.08em", color: C.text }}>
          {MONTHS[view.month]} {view.year}
        </span>
        <button onClick={next} style={{ ...mono, fontSize: 14, color: C.mid, background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>→</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {DAYS.map(d => (
          <div key={d} style={{ ...mono, fontSize: "0.6rem", letterSpacing: "0.08em", color: C.muted, textAlign: "center", padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Date cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const iso = isoDate(view.year, view.month, day);
          const past = isPast(view.year, view.month, day);
          const isSelected = selected === iso;
          return (
            <button
              key={day}
              disabled={past}
              onClick={() => onSelect(iso)}
              style={{
                ...mono, fontSize: "0.72rem",
                color: past ? C.muted : isSelected ? C.bg : C.text,
                background: isSelected ? C.accent : "transparent",
                border: `1px solid ${isSelected ? C.accent : "transparent"}`,
                borderRadius: 3, padding: "7px 4px",
                cursor: past ? "not-allowed" : "pointer",
                transition: "all 0.15s", textAlign: "center",
              }}
              onMouseEnter={e => { if (!past && !isSelected) e.currentTarget.style.borderColor = C.bdrHi; }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = "transparent"; }}
            >{day}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function Progress({ step }: { step: number }) {
  const steps = ["Service", "About you", "The project", "Meeting slot"];
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: "2rem" }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done   = step > n;
        return (
          <div key={label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{ width: "100%", height: 2, background: done || active ? C.accent : C.bdr, transition: "background 0.3s" }} />
            <span style={{ ...mono, fontSize: "0.58rem", letterSpacing: "0.1em", textTransform: "uppercase", color: active ? C.accent : done ? C.mid : C.muted, transition: "color 0.3s" }}>
              {String(n).padStart(2,"0")} {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
type Status = "idle" | "loading" | "success" | "error";

export default function BookPage() {
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(er => { const n = { ...er }; delete n[field]; return n; });
    };
  }

  function setVal(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(er => { const n = { ...er }; delete n[field]; return n; });
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate(s: number): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (s === 1) {
      if (!form.service) e.service = "Select a service";
    }
    if (s === 2) {
      if (!form.client_name.trim())  e.client_name  = "Required";
      if (!form.client_email.trim()) e.client_email = "Required";
      else if (!/\S+@\S+\.\S+/.test(form.client_email)) e.client_email = "Invalid email";
      if (!form.client_intro.trim()) e.client_intro = "Required";
    }
    if (s === 3) {
      if (!form.project_name.trim())           e.project_name = "Required";
      if (!form.project_specifications.trim()) e.project_specifications = "Required";
    }
    if (s === 4) {
      if (!form.meeting_date) e.meeting_date = "Pick a date";
      if (!form.meeting_time) e.meeting_time = "Pick a time";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validate(step)) setStep(s => Math.min(s + 1, 4)); }
  function back() { setErrors({}); setStep(s => Math.max(s - 1, 1)); }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(4)) return;
    setStatus("loading");

    try {
      const payload = {
        ...form,
        project_fee: form.project_fee ? parseFloat(form.project_fee) : null,
        prototype_due_date:      form.prototype_due_date      || null,
        source_code_due_date:    form.source_code_due_date    || null,
        hardware_due_date:       form.hardware_due_date        || null,
        documentation_due_date:  form.documentation_due_date  || null,
        hardware_name:           form.hardware_name            || null,
        client_phone:            form.client_phone             || null,
      };

      const { error } = await supabase.from("bookings").insert(payload);
      if (error) throw error;

      // Trigger email edge function
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-booking-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  // ── Success ─────────────────────────────────────────────────────────────────
  if (status === "success") {
    const dateLabel = new Date(form.meeting_date + "T00:00:00").toLocaleDateString("en-PH", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
    return (
      <PageShell>
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <div style={{ ...mono, fontSize: 40, color: C.accent, marginBottom: "1.25rem" }}>✓</div>
          <h2 style={{ ...serif, fontSize: "1.75rem", fontWeight: 900, color: C.bright, marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>
            Brief received
          </h2>
          <p style={{ ...mono, fontSize: "0.78rem", color: C.dim, lineHeight: 1.8, maxWidth: 380, margin: "0 auto 1.5rem" }}>
            Thanks, {form.client_name.split(" ")[0]}. I'll review your brief and confirm your meeting slot within 24 hours.
          </p>
          <div style={{ background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: 4, padding: "1.25rem", maxWidth: 360, margin: "0 auto 2rem", textAlign: "left" }}>
            <p style={{ ...mono, fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "0.5rem" }}>Requested slot</p>
            <p style={{ ...mono, fontSize: "0.82rem", color: C.warn }}>{dateLabel}</p>
            <p style={{ ...mono, fontSize: "0.82rem", color: C.warn }}>{TIME_LABELS[form.meeting_time]} PH time</p>
          </div>
          <p style={{ ...mono, fontSize: "0.72rem", color: C.dim }}>
            Check your email at <span style={{ color: C.mid }}>{form.client_email}</span> for a confirmation summary.
          </p>
          <a href="/" style={{
            ...mono, fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
            color: C.bg, background: C.accent, padding: "12px 24px", borderRadius: 3,
            textDecoration: "none", display: "inline-block", marginTop: "2rem",
          }}>Back to skm.labs</a>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Progress step={step} />
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>

          {/* ── Step 1: Service ── */}
          {step === 1 && (
            <>
              <StepHead n="01" title="What do you need?" sub="Pick the service that fits your project best." />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {errors.service && <p style={{ ...mono, fontSize: "0.7rem", color: C.err }}>{errors.service}</p>}
                {SERVICES.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setVal("service", s.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem",
                      background: form.service === s.id ? C.surf : "transparent",
                      border: `1px solid ${form.service === s.id ? C.accent : C.bdr}`,
                      borderRadius: 4, padding: "1rem 1.25rem", cursor: "pointer",
                      textAlign: "left", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { if (form.service !== s.id) e.currentTarget.style.borderColor = C.bdrHi; }}
                    onMouseLeave={e => { if (form.service !== s.id) e.currentTarget.style.borderColor = C.bdr; }}
                  >
                    <span style={{ ...mono, fontSize: 20, color: form.service === s.id ? C.accent : C.muted, transition: "color 0.15s", minWidth: 28 }}>{s.glyph}</span>
                    <div>
                      <p style={{ ...mono, fontSize: "0.82rem", color: form.service === s.id ? C.bright : C.text, marginBottom: 2 }}>{s.label}</p>
                      <p style={{ ...mono, fontSize: "0.65rem", color: C.dim }}>{s.sub}</p>
                    </div>
                    {form.service === s.id && <span style={{ ...mono, fontSize: 12, color: C.accent, marginLeft: "auto" }}>✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Step 2: About you ── */}
          {step === 2 && (
            <>
              <StepHead n="02" title="About you" sub="Who am I working with?" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Field label="Full name" error={errors.client_name}>
                  <input style={inputStyle} placeholder="Your full name" value={form.client_name} onChange={set("client_name")} />
                </Field>
                <Field label="Email" error={errors.client_email}>
                  <input style={inputStyle} type="email" placeholder="you@email.com" value={form.client_email} onChange={set("client_email")} />
                </Field>
              </div>
              <Field label="Phone number (optional)">
                <input style={inputStyle} placeholder="+63 9XX XXX XXXX" value={form.client_phone} onChange={set("client_phone")} />
              </Field>
              <Field label="Brief intro about yourself" error={errors.client_intro}>
                <textarea
                  style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
                  placeholder="Tell me a bit about yourself — your background, what you do, and what this project is for…"
                  value={form.client_intro}
                  onChange={set("client_intro")}
                />
              </Field>
            </>
          )}

          {/* ── Step 3: Project brief ── */}
          {step === 3 && (
            <>
              <StepHead n="03" title="The project" sub="Give me the details — this becomes the basis of your contract." />

              <Field label="Project name" error={errors.project_name}>
                <input style={inputStyle} placeholder="e.g. Helmet Cleaner Vending Machine" value={form.project_name} onChange={set("project_name")} />
              </Field>

              <Field label="Project specifications" error={errors.project_specifications}>
                <textarea
                  style={{ ...inputStyle, minHeight: 140, resize: "vertical" }}
                  placeholder="Describe what the project should do, what it includes, any technical requirements, constraints, or features…"
                  value={form.project_specifications}
                  onChange={set("project_specifications")}
                />
              </Field>

              <Field label="Hardware / device name (if applicable)">
                <input style={inputStyle} placeholder="e.g. ESP32-based NFC reader, Raspberry Pi dashboard" value={form.hardware_name} onChange={set("hardware_name")} />
              </Field>

              <Field label="Estimated budget (₱)">
                <input style={inputStyle} type="number" placeholder="e.g. 5000" value={form.project_fee} onChange={set("project_fee")} />
              </Field>

              <div style={{ padding: "1rem", border: `1px solid ${C.bdr}`, borderRadius: 3 }}>
                <p style={{ ...mono, fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.muted, marginBottom: "0.75rem" }}>
                  Target delivery dates <span style={{ color: C.dim, textTransform: "none", letterSpacing: 0 }}>(optional — we'll finalize these in the call)</span>
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  {[
                    { field: "prototype_due_date"     as keyof FormData, label: "Prototype" },
                    { field: "source_code_due_date"   as keyof FormData, label: "Source code" },
                    { field: "hardware_due_date"      as keyof FormData, label: "Hardware design" },
                    { field: "documentation_due_date" as keyof FormData, label: "Documentation" },
                  ].map(({ field, label }) => (
                    <Field key={field} label={label}>
                      <input style={{ ...inputStyle, colorScheme: "dark" }} type="date" value={(form as any)[field]} onChange={set(field)} />
                    </Field>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Step 4: Meeting slot ── */}
          {step === 4 && (
            <>
              <StepHead n="04" title="Pick a meeting slot" sub="Available every day from 7 PM onwards, PH time." />

              {errors.meeting_date && (
                <p style={{ ...mono, fontSize: "0.7rem", color: C.err }}>{errors.meeting_date}</p>
              )}

              <Calendar selected={form.meeting_date} onSelect={d => setVal("meeting_date", d)} />

              {form.meeting_date && (
                <div>
                  <Label error={errors.meeting_time}>Time slot</Label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setVal("meeting_time", t)}
                        style={{
                          ...mono, fontSize: "0.75rem",
                          color: form.meeting_time === t ? C.bg : C.text,
                          background: form.meeting_time === t ? C.accent : "transparent",
                          border: `1px solid ${form.meeting_time === t ? C.accent : C.bdr}`,
                          borderRadius: 3, padding: "8px 16px", cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (form.meeting_time !== t) e.currentTarget.style.borderColor = C.bdrHi; }}
                        onMouseLeave={e => { if (form.meeting_time !== t) e.currentTarget.style.borderColor = C.bdr; }}
                      >{TIME_LABELS[t]}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              {form.meeting_date && form.meeting_time && (
                <div style={{ background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: 4, padding: "1rem 1.25rem" }}>
                  <p style={{ ...mono, fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: "0.5rem" }}>Your slot</p>
                  <p style={{ ...mono, fontSize: "0.85rem", color: C.warn }}>
                    {new Date(form.meeting_date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </p>
                  <p style={{ ...mono, fontSize: "0.85rem", color: C.warn }}>{TIME_LABELS[form.meeting_time]} PH time</p>
                </div>
              )}

              {status === "error" && (
                <p style={{ ...mono, fontSize: "0.72rem", color: C.err }}>Something went wrong — try again or email me directly.</p>
              )}
            </>
          )}

          {/* Nav */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem" }}>
            {step > 1
              ? <GhostBtn onClick={back}>← Back</GhostBtn>
              : <span />}
            {step < 4
              ? <PrimaryBtn onClick={next}>Continue →</PrimaryBtn>
              : (
                <button type="submit" disabled={status === "loading"} style={{
                  ...mono, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: C.bg, background: status === "loading" ? C.mid : C.accent,
                  border: "none", borderRadius: 3, padding: "13px 28px",
                  cursor: status === "loading" ? "wait" : "pointer", transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.opacity = "0.82"; }}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >{status === "loading" ? "Submitting…" : "Submit brief"}</button>
              )}
          </div>
        </div>
      </form>
    </PageShell>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0f0e; -webkit-font-smoothing: antialiased; }
        input::placeholder, textarea::placeholder { color: #3d4840; }
        select option { background: #131614; color: #cdd9c8; }
        input:focus, textarea:focus, select:focus { border-color: #4ade80 !important; outline: none; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
        input[type="number"]::-webkit-inner-spin-button { opacity: 0.3; }
      `}</style>
      <main style={{ minHeight: "100svh", background: "#0d0f0e", padding: "5rem 2rem 4rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 600, marginBottom: "2rem" }}>
          <a href="/" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#637060", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#cdd9c8")}
            onMouseLeave={e => (e.currentTarget.style.color = "#637060")}
          >← skm.labs</a>
        </div>
        <div style={{ width: "100%", maxWidth: 600 }}>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4ade80", marginBottom: "0.75rem" }}>
              &gt; book a meeting
            </p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 900, color: "#e8f0e4", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "0.5rem" }}>
              Start a project
            </h1>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.75rem", lineHeight: 1.8, color: "#637060" }}>
              <span style={{ color: "#8a9e86" }}>// </span>
              Fill in your brief and pick a meeting slot. Marc will confirm within 24 hours.
            </p>
          </div>
          {children}
        </div>
      </main>
    </>
  );
}

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0d0f0e", background: "#4ade80", border: "none", borderRadius: 3, padding: "13px 28px", cursor: "pointer", transition: "opacity 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
    >{children}</button>
  );
}

function GhostBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8a9e86", background: "transparent", border: "1px solid #1e2320", borderRadius: 3, padding: "13px 20px", cursor: "pointer", transition: "border-color 0.2s, color 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#3d4840"; e.currentTarget.style.color = "#cdd9c8"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e2320"; e.currentTarget.style.color = "#8a9e86"; }}
    >{children}</button>
  );
}
