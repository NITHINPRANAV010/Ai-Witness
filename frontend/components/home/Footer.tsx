"use client";

import React from "react";
import Link from "next/link";
import { Eye, Shield, Terminal, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#04060A] border-t border-white/10 text-gray-400 py-16 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Eye className="w-3.5 h-3.5 text-black" />
              </div>
              <span className="text-sm font-bold text-white tracking-widest">
                AI WITNESS
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm font-sans font-normal">
              Autonomous multi-camera incident intelligence and 3D event reconstruction for municipal security, industrial safety, and transport logistics.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ALL SURVEILLANCE PIPELINES OPERATIONAL</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Platform
            </div>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#hero" className="hover:text-cyan-400 transition-colors">
                  3D City Experience
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-cyan-400 transition-colors">
                  Architecture Pipeline
                </Link>
              </li>
              <li>
                <Link href="#multi-camera" className="hover:text-cyan-400 transition-colors">
                  Multi-Camera Sync
                </Link>
              </li>
              <li>
                <Link href="/investigate" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  Investigation Studio <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Use Cases */}
          <div className="space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Sectors
            </div>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#use-cases" className="hover:text-cyan-400 transition-colors">
                  Smart Cities
                </Link>
              </li>
              <li>
                <Link href="#use-cases" className="hover:text-cyan-400 transition-colors">
                  Industrial Safety
                </Link>
              </li>
              <li>
                <Link href="#use-cases" className="hover:text-cyan-400 transition-colors">
                  Campus Security
                </Link>
              </li>
              <li>
                <Link href="#use-cases" className="hover:text-cyan-400 transition-colors">
                  Transport Corridors
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div className="space-y-3">
            <div className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Integrity
            </div>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-gray-300">CJIS / SOC-2 Type II</span>
              </li>
              <li>
                <span className="text-gray-300">ISO/IEC 27001</span>
              </li>
              <li>
                <span className="text-gray-300">Chain of Custody SHA-256</span>
              </li>
              <li>
                <span className="text-gray-300">Zero Black-Box Audit</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} AI WITNESS PLATFORM. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-300 cursor-pointer">Security Whitepaper</span>
            <span className="hover:text-gray-300 cursor-pointer">API Reference</span>
            <span className="hover:text-gray-300 cursor-pointer">Privacy & Data Handling</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
