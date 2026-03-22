"use client";

import { useState } from "react";
import { supabase, type ContactInsert } from "@/lib/supabase";

// ── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  bg:      "#0d0f0e",
  surf:    "#131614",
  bdr:     "#1e2320",
  muted:   "#3d4840",
  dim:     "#637060",
  mid:     "#8a9e86",
  text:    "#cdd9c8",
  bright:  "#e8f0e4",
  accent:  "#4ade80",
  err:     "#f87171",
};

const SERVICES = [
  { value: "3d_printing",  label: "3D Printing" },
  { value: "modeling",     label: "3D Modeling" },
  { value: "prototyping",  label: "Prototyping" },
  { value: "research",     label: "Research & Engineering" },
  { value: "commissions",  label: "Commission / Custom Build" },
  { value: "other",        label: "Other / Not sure yet" },
];

const BUDGETS = [
  { value: "under_500",    label: "Under ₱500 / $10" },
  { value: "500_2000",     label: "₱500 – ₱2,000" },
  { value: "2000_10000",   label: "₱2,000 – ₱10,000" },
  { value: "10000_plus",   label: "₱10,000+" },
  { value: "unsure",       label: "Not sure yet" },
];

// ── Shared input style ────────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.8rem",
  color: C.text,
  background: C.bg,
  border: `1px solid ${C.bdr}`,
  borderRadius: 3,
  padding: "11px 14px",
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s",
  lineHeight: 1.6,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.7rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: C.mid,
  display: "block",
  marginBottom: 8,
};

// ── Component ─────────────────────────────────────────────────────────────────
type Status = "idle" | "loading" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

const EMPTY: FormState = { name: "", email: "", service: "", budget: "", message: "" };

export default function ContactPage() {
  const [form, setForm]     = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm(f => ({ ...f, [field]: e.target.value }));
      setErrors(er => ({ ...er, [field]: undefined }));
    };
  }

  function validate(): boolean {
    const errs: Partial<FormState> = {};
    if (!form.name.trim())    errs.name    = "Required";
    if (!form.email.trim())   errs.email   = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.service)        errs.service = "Choose a service";
    if (!form.budget)         errs.budget  = "Choose a budget range";
    if (!form.message.trim()) errs.message = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");

    const payload: ContactInsert = {
      name:    form.name.trim(),
      email:   form.email.trim(),
      service: form.service,
      budget:  form.budget,
      message: form.message.trim(),
    };

    const { error } = await supabase.from("contacts").insert(payload);

    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("success");
      setForm(EMPTY);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0d0f0e; -webkit-font-smoothing: antialiased; }
        input::placeholder, textarea::placeholder { color: #3d4840; }
        select option { background: #131614; color: #cdd9c8; }
        input:focus, textarea:focus, select:focus { border-color: #4ade80 !important; }
      `}</style>

      <main style={{ minHeight: "100svh", background: C.bg, padding: "6rem 2rem 4rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Back link */}
        <div style={{ width: "100%", maxWidth: 580, marginBottom: "2.5rem" }}>
          <a href="/" style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: C.dim, textDecoration: "none", transition: "color 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = C.text)}
            onMouseLeave={e => (e.currentTarget.style.color = C.dim)}
          >← skm.labs</a>
        </div>

        <div style={{ width: "100%", maxWidth: 580 }}>
          {/* Header */}
          <div style={{ marginBottom: "3rem" }}>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: "1rem" }}>
              &gt; contact
            </p>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 900, color: C.bright, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "0.75rem" }}>
              Let&apos;s talk
            </h1>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", lineHeight: 1.9, color: C.dim }}>
              <span style={{ color: C.mid }}>// </span>
              Fill this out and I&apos;ll reply within 24 hours with a quote and timeline.
            </p>
          </div>

          {/* Success state */}
          {status === "success" ? (
            <div style={{
              background: C.surf, border: `1px solid ${C.accent}33`,
              borderRadius: 4, padding: "2.5rem", textAlign: "center",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, color: C.accent, marginBottom: "1rem" }}>✓</div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "1.4rem", fontWeight: 900, color: C.bright, marginBottom: "0.5rem" }}>Message sent</h2>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: C.dim, lineHeight: 1.8 }}>
                Got it — I&apos;ll be in touch within 24 hours.
              </p>
              <button onClick={() => setStatus("idle")} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: C.mid, background: "transparent", border: `1px solid ${C.bdr}`,
                borderRadius: 3, padding: "9px 20px", marginTop: "1.5rem",
                cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.muted; e.currentTarget.style.color = C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.bdr;   e.currentTarget.style.color = C.mid; }}
              >Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Name + Email row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <Field label="Name" error={errors.name}>
                    <input style={inputBase} placeholder="Your name" value={form.name} onChange={set("name")} />
                  </Field>
                  <Field label="Email" error={errors.email}>
                    <input style={inputBase} type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} />
                  </Field>
                </div>

                {/* Service */}
                <Field label="Service" error={errors.service}>
                  <select style={{ ...inputBase, appearance: "none", cursor: "pointer" }} value={form.service} onChange={set("service")}>
                    <option value="" disabled>Select a service…</option>
                    {SERVICES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>

                {/* Budget */}
                <Field label="Budget range" error={errors.budget}>
                  <select style={{ ...inputBase, appearance: "none", cursor: "pointer" }} value={form.budget} onChange={set("budget")}>
                    <option value="" disabled>Select a budget range…</option>
                    {BUDGETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </Field>

                {/* Message */}
                <Field label="Message" error={errors.message}>
                  <textarea
                    style={{ ...inputBase, minHeight: 140, resize: "vertical" }}
                    placeholder="Describe your project, what you need, or any questions…"
                    value={form.message}
                    onChange={set("message")}
                  />
                </Field>

                {/* Error banner */}
                {status === "error" && (
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: C.err, letterSpacing: "0.06em" }}>
                    Something went wrong. Try again or email me directly.
                  </p>
                )}

                {/* Submit */}
                <button type="submit" disabled={status === "loading"} style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: C.bg, background: status === "loading" ? C.mid : C.accent,
                  border: "none", borderRadius: 3, padding: "14px 28px",
                  cursor: status === "loading" ? "wait" : "pointer",
                  transition: "opacity 0.2s, background 0.2s", alignSelf: "flex-start",
                }}
                  onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.opacity = "0.82"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
                >
                  {status === "loading" ? "Sending…" : "Send message"}
                </button>

              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}{error && <span style={{ color: "#f87171", marginLeft: 8, textTransform: "none", letterSpacing: 0 }}>— {error}</span>}</label>
      {children}
    </div>
  );
}
