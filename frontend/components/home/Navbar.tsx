"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Multi-Camera", href: "/multi-camera" },
  { label: "Features", href: "/features" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Live Demo", href: "/investigate", highlight: true },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060A10]/85 backdrop-blur-md border-b border-cyan-500/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">

        {/* ── Brand / Logo ───────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all">
            <Eye className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-widest text-white">
              AI WITNESS
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase -mt-0.5">
              Incident Intelligence
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation ─────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1 bg-[#090F17]/50 border border-white/5 backdrop-blur-md px-3 py-2 rounded-full">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                    : item.highlight
                    ? "text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ── Right CTAs ─────────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/investigate"
            className="text-xs font-mono tracking-wider text-gray-400 hover:text-white px-3 py-2 transition-colors uppercase"
          >
            Sign In
          </Link>
          <Link
            href="/investigate"
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs tracking-wider uppercase font-mono rounded-lg shadow-[0_0_18px_rgba(6,182,212,0.4)] hover:shadow-[0_0_24px_rgba(6,182,212,0.6)] transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Mobile Hamburger ───────────────────────────────── */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060A10]/95 backdrop-blur-xl border-b border-cyan-500/20 px-6 py-6">
          <nav className="flex flex-col gap-1 font-mono mb-5">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                      : item.highlight
                      ? "text-cyan-400 font-semibold"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {item.highlight && " →"}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 pt-4">
            <Link
              href="/investigate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-semibold text-xs font-mono uppercase tracking-wider rounded-lg"
            >
              Get Started →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
