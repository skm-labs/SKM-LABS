import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,900&family=JetBrains+Mono:wght@400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:#0d0f0e;-webkit-font-smoothing:antialiased}
      `}</style>
      <main style={{ minHeight: "100svh", background: "#0d0f0e", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4ade80", marginBottom: "1rem" }}>
          404
        </p>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, color: "#e8f0e4", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: "1rem" }}>
          Page not found
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.78rem", color: "#637060", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: 360 }}>
          <span style={{ color: "#8a9e86" }}>// </span>
          This page doesn&apos;t exist or was moved.
        </p>
        <Link href="/" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#0d0f0e", background: "#4ade80", padding: "13px 28px", borderRadius: 3, textDecoration: "none" }}>
          ← Back to skm.labs
        </Link>
      </main>
    </>
  );
}
