"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = ["Product", "How It Works", "Use Cases", "Technology"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-void/95 backdrop-blur-md border-b border-[var(--color-border)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex-shrink-0">
              <div
                className="w-6 h-6 flex items-center justify-center"
                style={{ border: "1px solid var(--color-amber)" }}
              >
                <div className="w-2 h-2" style={{ background: "var(--color-amber)" }} />
              </div>
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: "var(--color-amber)", animation: "pulse-amber 2s ease-in-out infinite" }}
              />
            </div>
            <span
              className="label-mono font-semibold tracking-[0.15em] uppercase"
              style={{ color: "var(--color-text-primary)", fontSize: "0.75rem" }}
            >
              AI WITNESS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="label-mono transition-colors duration-200 hover:opacity-100"
                style={{ color: "var(--color-text-secondary)", fontSize: "0.7rem" }}
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/investigate"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 label-mono font-semibold uppercase transition-all duration-200 hover:opacity-90"
              style={{
                background: "var(--color-amber)",
                color: "var(--color-void)",
                fontSize: "0.7rem",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-void)" }} />
              Open Investigation
            </Link>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2"
              style={{ color: "var(--color-text-secondary)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <line x1="0" y1="1" x2="18" y2="1" stroke="currentColor" strokeWidth="1.5" />
                <line x1="0" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5" />
                <line x1="0" y1="13" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
            style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}
          >
            <nav className="flex flex-col px-6 pb-4 pt-3 gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="label-mono py-2.5"
                  style={{
                    color: "var(--color-text-secondary)",
                    borderBottom: "1px solid var(--color-border-subtle)",
                    fontSize: "0.7rem",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link
                href="/investigate"
                className="mt-3 flex items-center justify-center gap-2 py-2.5 label-mono font-semibold uppercase"
                style={{ background: "var(--color-amber)", color: "var(--color-void)", fontSize: "0.7rem" }}
                onClick={() => setMobileOpen(false)}
              >
                Open Investigation
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
