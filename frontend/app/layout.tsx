import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Witness — Multi-Camera Incident Intelligence",
  description:
    "AI Witness transforms hours of multi-camera footage into a chronological reconstruction of events, with evidence, timestamps, and explainable AI analysis.",
  keywords: ["incident investigation", "video intelligence", "AI analysis", "CCTV reconstruction", "security"],
  openGraph: {
    title: "AI Witness — Multi-Camera Incident Intelligence",
    description: "Transform raw surveillance footage into structured incident reconstructions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
