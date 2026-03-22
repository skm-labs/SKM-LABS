"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const C = {
  bg: "#0d0f0e", surf: "#131614", bdr: "#1e2320",
  dim: "#637060", mid: "#8a9e86", text: "#cdd9c8",
  bright: "#e8f0e4", accent: "#4ade80", err: "#f87171",
};
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const serif: React.CSSProperties = { fontFamily: "'Fraunces', serif" };

type Status = "idle" | "loading" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("work.mmasanjuan@gmail.com");
  const [status, setStatus] = useState<Status>("idle");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0d0f0e;-webkit-font-smoothing:antialiased}
        input:focus{outline:none;border-color:#4ade80!important}
        input::placeholder{color:#3d4840}
      `}</style>

      <main style={{ minHeight: "100svh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "3rem" }}>
            <div style={{ width: 28, height: 28, border: `1px solid ${C.accent}`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ ...mono, fontSize: 10, color: C.accent }}>skm</span>
            </div>
            <span style={{ ...mono, fontSize: 13, color: C.bright, letterSpacing: "0.04em" }}>.labs</span>
            <span style={{ ...mono, fontSize: 10, color: C.dim, margin: "0 2px" }}>/</span>
            <span style={{ ...mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.dim }}>Admin</span>
          </div>

          {status === "sent" ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ ...mono, fontSize: 36, color: C.accent, marginBottom: "1.25rem" }}>✉</div>
              <h2 style={{ ...serif, fontSize: "1.5rem", fontWeight: 900, color: C.bright, letterSpacing: "-0.02em", marginBottom: "0.6rem" }}>Check your email</h2>
              <p style={{ ...mono, fontSize: "0.75rem", color: C.dim, lineHeight: 1.8 }}>
                Magic link sent to <span style={{ color: C.mid }}>{email}</span>.<br />
                Click the link to sign in to your dashboard.
              </p>
            </div>
          ) : (
            <>
              <h1 style={{ ...serif, fontSize: "1.75rem", fontWeight: 900, color: C.bright, letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>Sign in</h1>
              <p style={{ ...mono, fontSize: "0.72rem", color: C.dim, marginBottom: "2rem", lineHeight: 1.7 }}>
                <span style={{ color: C.mid }}>// </span>We'll email you a magic link.
              </p>

              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ ...mono, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: C.mid, display: "block", marginBottom: 7 }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ ...mono, fontSize: "0.8rem", color: C.text, background: C.surf, border: `1px solid ${C.bdr}`, borderRadius: 3, padding: "11px 14px", width: "100%", transition: "border-color 0.2s" }}
                  />
                </div>

                {status === "error" && (
                  <p style={{ ...mono, fontSize: "0.7rem", color: C.err, marginBottom: "1rem" }}>Something went wrong — try again.</p>
                )}

                <button type="submit" disabled={status === "loading"} style={{
                  ...mono, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: C.bg, background: status === "loading" ? C.mid : C.accent,
                  border: "none", borderRadius: 3, padding: "13px 0", width: "100%",
                  cursor: status === "loading" ? "wait" : "pointer", transition: "opacity 0.2s",
                }}
                  onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.opacity = "0.82"; }}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {status === "loading" ? "Sending…" : "Send magic link"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
