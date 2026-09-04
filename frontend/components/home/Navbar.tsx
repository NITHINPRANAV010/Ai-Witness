"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Menu, X, ArrowRight, Sparkles } from "lucide-react";

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const activeIndex = NAV_LINKS.findIndex((item) => item.href === pathname);
  const effectiveIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? "py-3 bg-[#030712]/75 backdrop-blur-2xl border-b border-cyan-500/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.12)]"
          : "py-5 bg-gradient-to-b from-[#02050B]/90 via-[#030712]/50 to-transparent backdrop-blur-[2px]"
      }`}
    >
      {/* Top ambient liquid refraction line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">

        {/* ── Brand / Logo with Liquid Glass Container ────────────────── */}
        <Link href="/" className="flex items-center gap-3 group relative cursor-pointer">
          <div className="relative">
            {/* Outer liquid pulse */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-30 blur-md group-hover:opacity-70 group-hover:blur-lg transition-all duration-500" />
            
            {/* Glass icon badge */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-b from-white/15 to-white/5 border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_16px_rgba(0,0,0,0.4)] group-hover:border-cyan-400/50 transition-all duration-300">
              <Eye className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform duration-300" />
              {/* Inner specular highlight */}
              <div className="absolute inset-x-1.5 top-1 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-widest text-white flex items-center gap-1.5">
              AI WITNESS
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4] animate-pulse" />
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400/90 uppercase -mt-0.5">
              Incident Intelligence
            </span>
          </div>
        </Link>

        {/* ── Desktop Navigation: Floating Liquid Glass Island ────────── */}
        <div
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
          className="hidden md:flex relative items-center p-1.5 rounded-full bg-[#070D18]/60 border border-white/[0.12] hover:border-cyan-400/35 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.22),0_0_20px_rgba(6,182,212,0.1)] transition-all duration-500 group/island"
        >
          {/* Liquid Glass Top Sheen */}
          <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          {/* Mouse-following fluid specular glow */}
          <div
            className="pointer-events-none absolute -inset-px rounded-full opacity-0 group-hover/island:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.2), transparent 75%)`,
            }}
          />

          {/* Links with animated sliding liquid pill */}
          <div className="relative flex items-center gap-1 z-10">
            {NAV_LINKS.map((item, idx) => {
              const isActive = pathname === item.href;
              const isTargeted = effectiveIndex === idx;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  className={`relative px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-colors duration-200 flex items-center gap-2 select-none ${
                    isActive
                      ? "text-white font-semibold"
                      : item.highlight
                      ? "text-cyan-300 hover:text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {/* Sliding Liquid Glass Pill Indicator */}
                  {isTargeted && (
                    <motion.div
                      layoutId="liquid-nav-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                        mass: 0.8,
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/25 via-sky-400/20 to-blue-600/25 border border-cyan-400/40 shadow-[0_0_16px_rgba(6,182,212,0.35),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-md -z-10"
                    >
                      {/* Pill top specular sheen */}
                      <div className="absolute inset-x-3 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-cyan-200/90 to-transparent" />
                      {/* Ambient bottom glow */}
                      <div className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                    </motion.div>
                  )}

                  {/* Pulsing beacon for Live Demo */}
                  {item.highlight && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_6px_#06B6D4]" />
                    </span>
                  )}

                  <span className="relative z-10">{item.label}</span>

                  {/* Subtle active glow dot */}
                  {isActive && !item.highlight && (
                    <span className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_4px_#06B6D4] shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Right Action Controls ──────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/investigate"
            className="text-xs font-mono tracking-wider text-gray-300 hover:text-white px-3.5 py-2 transition-colors uppercase cursor-pointer hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            Sign In
          </Link>

          <Link
            href="/investigate"
            className="relative group/btn overflow-hidden px-5 py-2.5 rounded-full font-mono text-xs font-semibold tracking-wider uppercase text-black transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)]"
          >
            {/* Button liquid background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 group-hover/btn:from-cyan-300 group-hover/btn:to-blue-400 transition-all duration-300" />

            {/* Diagonal liquid light sheen that slides across */}
            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12" />

            {/* Button content */}
            <span className="relative z-10 flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* ── Mobile Hamburger ───────────────────────────────────────── */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white backdrop-blur-md cursor-pointer transition-all active:scale-95"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Liquid Glass Drawer ──────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden mt-3 mx-4 p-4 rounded-2xl bg-[#040812]/90 border border-cyan-500/25 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <nav className="flex flex-col gap-1.5 font-mono">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-between ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : item.highlight
                        ? "text-cyan-300 bg-white/5 hover:bg-cyan-500/15"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.highlight && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                      {item.label}
                    </span>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06B6D4]" />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/10 mt-3 pt-3">
              <Link
                href="/investigate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-semibold text-xs font-mono uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
