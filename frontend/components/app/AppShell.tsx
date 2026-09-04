"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { AppTab, Investigation } from "@/lib/types";
import { MOCK_INVESTIGATION, MOCK_INVESTIGATIONS_LIST } from "@/lib/mockData";

// Views
import DashboardView from "./views/DashboardView";
import InvestigationsView from "./views/InvestigationsView";
import AnalysisView from "./views/AnalysisView";
import IncidentsView from "./views/IncidentsView";
import EvidenceView from "./views/EvidenceView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<AppTab>("dashboard");
  const [investigationsList, setInvestigationsList] = useState<Investigation[]>(MOCK_INVESTIGATIONS_LIST);
  const [activeInvestigation, setActiveInvestigation] = useState<Investigation>(MOCK_INVESTIGATION);
  const [seekTargetMs, setSeekTargetMs] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // UTC clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toISOString().slice(0, 10) +
          " " +
          now.toLocaleTimeString("en-GB", { hour12: false }) +
          " UTC"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigateTab = (tab: AppTab) => {
    setActiveTab(tab);
  };

  const handleLoadDemo = () => {
    setActiveInvestigation(MOCK_INVESTIGATION);
    setActiveTab("analysis");
  };

  const handleSeekToMs = (ms: number) => {
    setSeekTargetMs(ms);
  };

  const handleCreateInvestigation = (newInv: Investigation) => {
    setInvestigationsList((prev) => [newInv, ...prev]);
    setActiveInvestigation(newInv);
  };

  const navItems: { id: AppTab; label: string; icon: string; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "investigations", label: "Investigations", icon: "📁", badge: `${investigationsList.length}` },
    { id: "analysis", label: "Video Analysis", icon: "📹", badge: "4-CAM" },
    { id: "incidents", label: "Incidents", icon: "⚠️", badge: "1" },
    { id: "evidence", label: "Evidence", icon: "🔍" },
    { id: "reports", label: "Reports", icon: "📄" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans select-none">
      {/* ── Left Sidebar (Command-Center Navigation) ── */}
      <aside
        className={`flex flex-col border-r border-neutral-800 bg-neutral-950/80 backdrop-blur-xl transition-all duration-300 z-30 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 border-b border-neutral-800 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-black font-bold flex items-center justify-center font-mono text-xs shadow-[0_0_12px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
              W
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="font-mono font-bold text-xs tracking-wider text-white">
                  AI WITNESS
                </span>
                <span className="text-[9px] font-mono text-amber-400 font-semibold uppercase tracking-widest">
                  COMMAND CENTER
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-neutral-500 hover:text-white font-mono text-xs p-1"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {/* Case Selector Banner */}
        {isSidebarOpen && (
          <div className="p-3 border-b border-neutral-800/80 bg-neutral-900/40">
            <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
              ACTIVE CASE FILE
            </div>
            <div className="text-xs font-mono font-bold text-amber-400 truncate">
              #{activeInvestigation.id.toUpperCase()} · {activeInvestigation.name}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] font-mono text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>4 Cameras Synced</span>
            </div>
          </div>
        )}

        {/* Navigation Tab Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigateTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-mono transition-all group relative ${
                  isActive
                    ? "bg-amber-500 text-black font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
                }`}
                title={item.label}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="flex-1 text-left uppercase tracking-wider truncate">
                    {item.label}
                  </span>
                )}
                {isSidebarOpen && item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isActive
                        ? "bg-black/20 text-black"
                        : "bg-neutral-800 text-neutral-400 group-hover:text-amber-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Demo CTA */}
        {isSidebarOpen && (
          <div className="p-3 border-t border-neutral-800 bg-neutral-900/30">
            <button
              onClick={handleLoadDemo}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-500/10 border border-amber-500/30 hover:border-amber-500 text-amber-400 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>⚡</span>
              <span>Load Built-in Demo</span>
            </button>
          </div>
        )}

        {/* Footer / Exit to Landing */}
        <div className="p-3 border-t border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500">
          <Link
            href="/"
            className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
          >
            <span>←</span>
            {isSidebarOpen && <span>Back to Homepage</span>}
          </Link>
          {isSidebarOpen && <span className="text-neutral-600">v2.4.0</span>}
        </div>
      </aside>

      {/* ── Main Workspace Content ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-950">
        {/* Top Telemetry & Status Navbar */}
        <header className="h-14 border-b border-neutral-800 bg-neutral-900/40 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-500 uppercase tracking-wider">SECTOR:</span>
              <span className="text-neutral-200 font-semibold">
                {activeInvestigation.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live UTC Clock */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-neutral-400">{currentTime || "CONNECTING..."}</span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadDemo}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              >
                <span>⚡</span>
                <span className="hidden sm:inline">Try Demo</span>
              </button>

              <button
                onClick={() => handleNavigateTab("investigations")}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 hover:border-neutral-500 text-neutral-200 font-mono text-xs uppercase tracking-wider transition-all"
              >
                + New Case
              </button>
            </div>
          </div>
        </header>

        {/* View Switcher Container */}
        <main className="flex-1 overflow-y-auto bg-neutral-950 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {activeTab === "dashboard" && (
                <DashboardView
                  investigation={activeInvestigation}
                  onNavigateTab={handleNavigateTab}
                  onLoadDemo={handleLoadDemo}
                  investigationsList={investigationsList}
                  onSelectInvestigation={setActiveInvestigation}
                />
              )}

              {activeTab === "investigations" && (
                <InvestigationsView
                  investigations={investigationsList}
                  activeInvestigation={activeInvestigation}
                  onSelectInvestigation={setActiveInvestigation}
                  onNavigateTab={handleNavigateTab}
                  onLoadDemo={handleLoadDemo}
                  onCreateInvestigation={handleCreateInvestigation}
                />
              )}

              {activeTab === "analysis" && (
                <AnalysisView
                  investigation={activeInvestigation}
                  onNavigateTab={handleNavigateTab}
                  seekTargetMs={seekTargetMs}
                />
              )}

              {activeTab === "incidents" && (
                <IncidentsView
                  investigation={activeInvestigation}
                  onNavigateTab={handleNavigateTab}
                  onSeekToMs={handleSeekToMs}
                />
              )}

              {activeTab === "evidence" && (
                <EvidenceView
                  investigation={activeInvestigation}
                  onNavigateTab={handleNavigateTab}
                  onSeekToMs={handleSeekToMs}
                />
              )}

              {activeTab === "reports" && (
                <ReportsView
                  investigation={activeInvestigation}
                  onNavigateTab={handleNavigateTab}
                />
              )}

              {activeTab === "settings" && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
