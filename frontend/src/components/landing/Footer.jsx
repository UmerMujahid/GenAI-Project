import React from 'react'

export default function Footer({ showCTA = true }) {
  return (
    <footer className="relative bg-[#030303] border-t border-white/10 overflow-hidden z-10 font-display">
      {/* Background glow overlay to brighten the bottom section */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[550px] h-[300px] rounded-full bg-gradient-to-t from-amber-500/10 via-purple-500/5 to-transparent blur-[120px] pointer-events-none"></div>

      {/* Above Footer CTA Section */}
      {showCTA && (
        <div className="max-w-7xl mx-auto px-6 py-24 text-center relative z-10">
          <div className="max-w-3xl mx-auto rounded-3xl border border-white/20 bg-gradient-to-b from-neutral-900/60 to-neutral-950/95 p-8 md:p-14 shadow-2xl hover:border-amber-500/30 transition-all duration-500 ring-1 ring-white/10">
            <span className="text-xs md:text-sm font-display font-black text-amber-500 uppercase tracking-wider block mb-4">
              GET EARLY ACCESS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
              Ready to automate the search?
            </h2>
            <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed mb-10 font-sans">
              Join the cohort of students from FAST, NUST, and other top institutions landing elite internships across Pakistan with multi-agent automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter institutional email (.edu.pk)"
                className="w-full bg-black/60 border border-white/15 rounded px-5 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-all font-sans"
              />
              <button className="bg-white hover:bg-neutral-200 text-black border border-white font-bold text-xs uppercase tracking-wider px-7 py-3.5 rounded transition-all whitespace-nowrap shadow-md shadow-white/5">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-t border-white/10 grid grid-cols-2 md:grid-cols-5 gap-10 text-left">
        {/* Column 1: Brand */}
        <div className="col-span-2 flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-5 bg-amber-500 rounded-sm"></div>
            <span className="font-extrabold text-white text-base tracking-widest uppercase">
              NAVIGATOR AI
            </span>
          </div>
          <p className="text-xs text-gray-400 max-w-xs leading-relaxed font-sans">
            A specialized multi-agent job intelligence system automating application workflows for Pakistani tech candidates.
          </p>
        </div>

        {/* Column 2: Platform */}
        <div className="flex flex-col items-start gap-3">
          <span className="text-[10px] font-display font-extrabold text-gray-300 uppercase tracking-widest">
            PLATFORM
          </span>
          <div className="flex flex-col gap-2.5 text-xs text-gray-500 font-sans font-medium">
            <a href="#" className="hover:text-amber-400 transition-colors">Discovery Agent</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Matching Index</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Tailoring Engine</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Cover Letter Bot</a>
          </div>
        </div>

        {/* Column 3: Resources */}
        <div className="flex flex-col items-start gap-3">
          <span className="text-[10px] font-display font-extrabold text-gray-300 uppercase tracking-widest">
            RESOURCES
          </span>
          <div className="flex flex-col gap-2.5 text-xs text-gray-500 font-sans font-medium">
            <a href="#" className="hover:text-amber-400 transition-colors">System Proposal</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Timeline Docs</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Agent Frameworks</a>
            <a href="#" className="hover:text-amber-400 transition-colors">FAQ Support</a>
          </div>
        </div>

        {/* Column 4: Legals */}
        <div className="flex flex-col items-start gap-3">
          <span className="text-[10px] font-display font-extrabold text-gray-300 uppercase tracking-widest">
            LEGAL
          </span>
          <div className="flex flex-col gap-2.5 text-xs text-gray-500 font-sans font-medium">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Cookie settings</a>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-gray-600 font-mono tracking-wide">
        <span>© {new Date().getFullYear()} AI Internship Navigator. Under E:\FAST GenAI Internship.</span>
        <span className="mt-2 sm:mt-0 uppercase">Powered by React, Tailwind & LangGraph</span>
      </div>
    </footer>
  )
}
