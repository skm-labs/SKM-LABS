// supabase/functions/send-booking-emails/index.ts
// Deploy with: supabase functions deploy send-booking-emails
// Set secret:  supabase secrets set RESEND_API_KEY=re_xxxx

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const MARC_EMAIL     = "work.mmasanjuan@gmail.com";
const FROM_EMAIL     = "skm.labs <noreply@skm.labs>"; // update to your verified Resend domain

const SERVICE_LABELS: Record<string, string> = {
  "3d_printing": "3D Printing",
  "modeling":    "3D Modeling",
  "prototyping": "Prototyping",
  "research":    "Research & Engineering",
  "commissions": "Custom Commission",
};

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  return res.json();
}

serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const booking = await req.json();
  const svc     = SERVICE_LABELS[booking.service] ?? booking.service;
  const meetingDateStr = new Date(booking.meeting_date).toLocaleDateString("en-PH", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  // ── Email to Marc ─────────────────────────────────────────────────────────
  const marcHtml = `
    <div style="font-family:monospace;background:#0d0f0e;color:#cdd9c8;padding:2rem;max-width:600px">
      <p style="color:#4ade80;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1rem">&gt; new booking request — skm.labs</p>
      <h2 style="font-family:serif;font-size:1.5rem;color:#e8f0e4;margin-bottom:1.5rem">${booking.project_name}</h2>

      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr><td style="color:#637060;padding:6px 0;width:160px">Client</td><td style="color:#cdd9c8">${booking.client_name}</td></tr>
        <tr><td style="color:#637060;padding:6px 0">Email</td><td style="color:#4ade80">${booking.client_email}</td></tr>
        <tr><td style="color:#637060;padding:6px 0">Phone</td><td style="color:#cdd9c8">${booking.client_phone || "—"}</td></tr>
        <tr><td style="color:#637060;padding:6px 0">Service</td><td style="color:#cdd9c8">${svc}</td></tr>
        <tr><td style="color:#637060;padding:6px 0">Meeting</td><td style="color:#fbbf24">${meetingDateStr} at ${booking.meeting_time} PH time</td></tr>
        <tr><td style="color:#637060;padding:6px 0">Budget</td><td style="color:#cdd9c8">₱${booking.project_fee?.toLocaleString() ?? "TBD"}</td></tr>
      </table>

      <div style="margin:1.5rem 0;padding:1rem;border:1px solid #1e2320;border-radius:3px">
        <p style="color:#8a9e86;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.5rem">Client intro</p>
        <p style="color:#cdd9c8;font-size:13px;line-height:1.7">${booking.client_intro}</p>
      </div>

      <div style="margin:1.5rem 0;padding:1rem;border:1px solid #1e2320;border-radius:3px">
        <p style="color:#8a9e86;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.5rem">Project specifications</p>
        <p style="color:#cdd9c8;font-size:13px;line-height:1.7">${booking.project_specifications}</p>
      </div>

      <p style="font-size:12px;color:#637060;margin-top:2rem">Review and confirm this booking in your <a href="https://skm.labs/admin" style="color:#4ade80">dashboard →</a></p>
    </div>
  `;

  // ── Email to client ───────────────────────────────────────────────────────
  const clientHtml = `
    <div style="font-family:monospace;background:#0d0f0e;color:#cdd9c8;padding:2rem;max-width:600px">
      <p style="color:#4ade80;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:1rem">&gt; booking received — skm.labs</p>
      <h2 style="font-family:serif;font-size:1.5rem;color:#e8f0e4;margin-bottom:0.5rem">Got your brief, ${booking.client_name.split(" ")[0]}.</h2>
      <p style="color:#637060;font-size:13px;line-height:1.7;margin-bottom:1.5rem">
        I've received your project brief for <strong style="color:#cdd9c8">${booking.project_name}</strong>.
        I'll review the details and confirm your meeting slot within 24 hours.
      </p>

      <div style="padding:1rem;border:1px solid #1e2320;border-radius:3px;margin-bottom:1.5rem">
        <p style="color:#8a9e86;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.75rem">Your requested slot</p>
        <p style="color:#fbbf24;font-size:14px">${meetingDateStr}</p>
        <p style="color:#fbbf24;font-size:14px">${booking.meeting_time} PH time</p>
      </div>

      <div style="padding:1rem;border:1px solid #1e2320;border-radius:3px;margin-bottom:1.5rem">
        <p style="color:#8a9e86;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.75rem">Summary</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tr><td style="color:#637060;padding:4px 0;width:140px">Service</td><td style="color:#cdd9c8">${svc}</td></tr>
          <tr><td style="color:#637060;padding:4px 0">Project</td><td style="color:#cdd9c8">${booking.project_name}</td></tr>
          <tr><td style="color:#637060;padding:4px 0">Budget</td><td style="color:#cdd9c8">₱${booking.project_fee?.toLocaleString() ?? "TBD"}</td></tr>
        </table>
      </div>

      <p style="font-size:12px;color:#637060">
        Questions? Reply to this email or reach me at
        <a href="mailto:work.mmasanjuan@gmail.com" style="color:#4ade80">work.mmasanjuan@gmail.com</a>
      </p>
      <p style="font-size:12px;color:#3d4840;margin-top:1.5rem">— Marc Anthony San Juan · skm.labs</p>
    </div>
  `;

  const [r1, r2] = await Promise.all([
    sendEmail(MARC_EMAIL, `[skm.labs] New booking: ${booking.project_name} — ${booking.client_name}`, marcHtml),
    sendEmail(booking.client_email, `Booking received — ${booking.project_name} | skm.labs`, clientHtml),
  ]);

  return new Response(JSON.stringify({ marc: r1, client: r2 }), {
    headers: { "Content-Type": "application/json" },
  });
});
