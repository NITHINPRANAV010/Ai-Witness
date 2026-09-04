"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(245,158,11,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--color-border)" }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow mb-8">GET STARTED</p>
          <h2
            className="text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] mb-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Stop searching footage.
            <br />
            <span style={{ color: "var(--color-amber)" }}>
              Start investigating events.
            </span>
          </h2>
          <p
            className="text-lg mb-12 max-w-xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Upload your footage and get an AI-generated incident reconstruction
            in minutes — with evidence, timestamps, and explainable analysis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/investigate"
              id="cta-open-investigation"
              className="flex items-center justify-center gap-2 px-8 py-4 label-mono font-semibold uppercase tracking-wide transition-all duration-200 hover:opacity-90"
              style={{
                background: "var(--color-amber)",
                color: "var(--color-void)",
                fontSize: "0.75rem",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--color-void)" }}
              />
              Open Investigation
            </Link>
            <a
              href="#how-it-works"
              id="cta-explore-technology"
              className="flex items-center justify-center gap-2 px-8 py-4 label-mono uppercase tracking-wide transition-all duration-200"
              style={{
                border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)",
                fontSize: "0.75rem",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-amber)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-amber)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
              }}
            >
              Explore the Technology →
            </a>
          </div>

          {/* Bottom tag */}
          <p
            className="mt-16 label-mono"
            style={{ color: "var(--color-text-muted)", fontSize: "0.6rem" }}
          >
            AI WITNESS — Multi-Camera Incident Intelligence Platform — Hackathon Edition
          </p>
        </motion.div>
      </div>
    </section>
  );
}
