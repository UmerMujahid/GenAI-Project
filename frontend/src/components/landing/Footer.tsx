import React from 'react'

export default function Footer({ showCTA = true }: { showCTA?: boolean }) {
  return (
    <footer className="relative bg-[#0d0e12] border-t border-white/20 overflow-hidden z-10 font-display">
      {/* Background glow overlay */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[550px] h-[300px] rounded-full bg-gradient-to-t from-amber-500/15 via-purple-500/10 to-transparent blur-[120px] pointer-events-none"></div>

      {/* Above Footer CTA Section */}
      {showCTA && (
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-16 text-center relative z-10">
          <div className="max-w-3xl mx-auto rounded-3xl border border-white/20 bg-neutral-900/90 p-6 md:p-10 shadow-2xl hover:border-amber-500/50 transition-all duration-500">
            <span className="text-xs md:text-sm font-display font-black text-amber-400 uppercase tracking-widest block mb-3">
              GET EARLY ACCESS
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
              Ready to automate the search?
            </h2>
            <p className="text-xs md:text-sm text-gray-200 max-w-xl mx-auto leading-relaxed mb-8 font-display font-medium">
              Join the cohort of students from FAST, NUST, and other top institutions landing elite internships across Pakistan with multi-agent automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter institutional email (.edu.pk)"
                className="w-full bg-black/70 border border-white/20 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-all font-sans"
              />
              <button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-extrabold text-xs uppercase tracking-wider px-7 py-3 rounded-xl transition-all whitespace-nowrap shadow-lg">
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-10 border-t border-white/20 grid grid-cols-2 md:grid-cols-5 gap-8 text-left">
        {/* Column 1: Brand */}
        <div className="col-span-2 flex flex-col items-start gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-5 bg-amber-500 rounded-sm"></div>
            <span className="font-extrabold text-white text-base tracking-widest uppercase">
              NAVIGATOR AI
            </span>
          </div>
          <p className="text-xs md:text-sm text-gray-300 max-w-sm leading-relaxed font-display font-medium">
            A specialized multi-agent job intelligence system automating application workflows for Pakistani tech candidates.
          </p>
        </div>

        {/* Column 2: Platform */}
        <div className="flex flex-col items-start gap-2.5">
          <span className="text-xs font-display font-black text-amber-400 uppercase tracking-widest">
            PLATFORM
          </span>
          <div className="flex flex-col gap-2.5 text-xs md:text-sm text-gray-300 font-sans font-semibold">
            <a href="#" className="hover:text-amber-400 transition-colors">Resume Parsing Agent</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Discovery Agent</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Matching Index</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Tailoring Engine</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Cover Letter Bot</a>
          </div>
        </div>

        {/* Column 3: Resources */}
        <div className="flex flex-col items-start gap-2.5">
          <span className="text-xs font-display font-black text-amber-400 uppercase tracking-widest">
            RESOURCES
          </span>
          <div className="flex flex-col gap-2.5 text-xs md:text-sm text-gray-300 font-sans font-semibold">
            <a href="#" className="hover:text-amber-400 transition-colors">System Proposal</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Timeline Docs</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Agent Frameworks</a>
            <a href="#" className="hover:text-amber-400 transition-colors">FAQ Support</a>
          </div>
        </div>

        {/* Column 4: Legals */}
        <div className="flex flex-col items-start gap-2.5">
          <span className="text-xs font-display font-black text-amber-400 uppercase tracking-widest">
            LEGAL
          </span>
          <div className="flex flex-col gap-2.5 text-xs md:text-sm text-gray-300 font-sans font-semibold">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Cookie settings</a>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-300 font-mono tracking-wide">
        <span>© {new Date().getFullYear()} AI Internship Navigator. All rights reserved.</span>
        <span className="mt-2 sm:mt-0 uppercase">Powered by React, Tailwind, FastAPI & LangChain</span>
      </div>
    </footer>
  )
}
