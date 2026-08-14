import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPayload } from "../../services/api";

interface DashboardHeaderProps {
  user: UserPayload | null;
  activeTab: "dashboard" | "jobs" | "resume" | "settings";
  setActiveTab: (tab: "dashboard" | "jobs" | "resume" | "settings") => void;
  showUserMenu: boolean;
  setShowUserMenu: (show: boolean) => void;
  logout: () => void;
}

export default function DashboardHeader({
  user,
  activeTab,
  setActiveTab,
  showUserMenu,
  setShowUserMenu,
  logout,
}: DashboardHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-[#0d0e12]/95 backdrop-blur-xl border-b border-white/20 px-6 py-3.5 flex items-center justify-between shadow-2xl">
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-2.5 h-5 bg-amber-500 rounded-sm"></div>
          <span className="font-display font-black text-lg tracking-wide text-white">
            Navigator<span className="text-amber-500">AI</span>
          </span>
        </Link>
      </div>

      {/* Center: Horizontal Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900/90 border border-white/15 p-1 rounded-2xl shadow-inner">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all duration-200 flex items-center gap-2 ${
            activeTab === "dashboard"
              ? "bg-neutral-800 text-white border border-white/20 shadow-md"
              : "text-gray-400 hover:text-white hover:bg-neutral-800/50"
          }`}
        >
          <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Dashboard
        </button>

        <button
          onClick={() => setActiveTab("resume")}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all duration-200 flex items-center gap-2 ${
            activeTab === "resume"
              ? "bg-neutral-800 text-white border border-white/20 shadow-md"
              : "text-gray-400 hover:text-white hover:bg-neutral-800/50"
          }`}
        >
          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Resume Parser
        </button>

        <button
          onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all duration-200 flex items-center gap-2 ${
            activeTab === "jobs"
              ? "bg-neutral-800 text-white border border-white/20 shadow-md"
              : "text-gray-400 hover:text-white hover:bg-neutral-800/50"
          }`}
        >
          <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Job Finder
        </button>
      </nav>

      {/* Right: User Profile & Dropdown */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 border border-white/20 bg-neutral-900 hover:bg-neutral-800 rounded-full py-1 px-2.5 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 font-bold text-white text-xs flex items-center justify-center shadow">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="font-display font-semibold text-xs text-white hidden sm:inline">
              {user?.full_name || "User Profile"}
            </span>
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-52 bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl">
              <div className="px-3 py-2 border-b border-white/10">
                <p className="text-xs font-bold text-white">{user?.full_name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
