import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "skm.labs — Engineering & Fabrication",
  description:
    "3D printing, modeling, rapid prototyping, and engineering commissions by Klutzy. Precise work. Documented output. Real deadlines.",
  keywords: ["3D printing", "3D modeling", "prototyping", "engineering", "commissions", "Philippines"],
  authors: [{ name: "Klutzy" }],
  openGraph: {
    title: "skm.labs — Engineering & Fabrication",
    description: "3D printing, modeling, rapid prototyping, and engineering commissions.",
    url: "https://skm.labs",
    siteName: "skm.labs",
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "skm.labs — Engineering & Fabrication",
    description: "3D printing, modeling, rapid prototyping, and engineering commissions.",
    creator: "@sunkissedmemento",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
