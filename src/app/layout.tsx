import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inspector of Posts Exam Tracker",
  description:
    "Track your Inspector of Posts (Department of Posts) departmental exam preparation progress, set targets, and monitor topic completion.",
  keywords: "IP exam, Inspector of Posts, Department of Posts, study tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav
          style={{
            padding: "16px 32px",
            background: "rgba(15, 23, 42, 0.8)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            gap: "24px",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <a href="/" style={{ color: "#f1f5f9", textDecoration: "none", fontWeight: "600" }}>Syllabus</a>
          <a href="/tasks" style={{ color: "#94a3b8", textDecoration: "none", fontWeight: "500" }}>Tasks & Aims</a>
          <a href="/reports" style={{ color: "#94a3b8", textDecoration: "none", fontWeight: "500" }}>Reports</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
