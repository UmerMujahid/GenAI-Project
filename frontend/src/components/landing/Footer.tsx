import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer({ showCTA = true }: { showCTA?: boolean }) {
  return (
    <footer className="relative bg-[#0a0b0e] border-t border-white/20 overflow-hidden z-10 font-display">
      {/* Background glow overlay */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[550px] h-[300px] rounded-full bg-gradient-to-t from-amber-500/15 via-purple-500/10 to-transparent blur-[120px] pointer-events-none"></div>

      {/* Above Footer CTA Section */}
      {showCTA && (
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-16 text-center relative z-10">
          <div className="max-w-3xl mx-auto rounded-3xl border border-white/20 bg-neutral-900/90 p-6 md:p-10 shadow-2xl hover:border-amber-500/50 transition-all duration-500">
            <span className="text-xs md:text-sm font-display font-black text-amber-400 uppercase tracking-widest block mb-3">
              GET STARTED TODAY
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4">
              Ready to automate your internship hunt?
            </h2>
            <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto leading-relaxed mb-8 font-sans">
              Join students across Pakistan landing top tech internships with AI-powered resume extraction and real-time job matching.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-black font-extrabold text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-lg text-center"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all text-center"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-left">
        {/* Column 1: Brand */}
        <div className="sm:col-span-2 flex flex-col items-start gap-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="w-3 h-6 bg-amber-500 rounded-sm"></div>
            <span className="font-black text-white text-xl tracking-wider uppercase">
              NAVIGATOR AI
            </span>
          </Link>
          <p className="text-sm md:text-base text-gray-300 max-w-md leading-relaxed font-sans font-medium">
            AI-powered internship discovery and candidate matching platform designed for computer science and software engineering students across Pakistan.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-sans">
              JobSpy & Groq AI Engines Active
            </span>
          </div>
        </div>

        {/* Column 2: Platform Features */}
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm font-display font-black text-amber-400 uppercase tracking-wider">
            Features
          </span>
          <div className="flex flex-col gap-2.5 text-sm md:text-base text-gray-300 font-sans font-medium">
            <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
              Candidate Dashboard
            </Link>
            <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
              Resume Parser
            </Link>
            <Link to="/dashboard" className="hover:text-amber-400 transition-colors">
              Job Finder (Agent 2)
            </Link>
            <Link to="/about" className="hover:text-amber-400 transition-colors">
              About Navigator AI
            </Link>
          </div>
        </div>

        {/* Column 3: Account & Navigation */}
        <div className="flex flex-col items-start gap-3">
          <span className="text-sm font-display font-black text-amber-400 uppercase tracking-wider">
            Account
          </span>
          <div className="flex flex-col gap-2.5 text-sm md:text-base text-gray-300 font-sans font-medium">
            <Link to="/login" className="hover:text-amber-400 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-amber-400 transition-colors">
              Create Account
            </Link>
            <Link to="/" className="hover:text-amber-400 transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-amber-400 transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-400 font-sans">
        <span>© {new Date().getFullYear()} AI Internship Navigator. All rights reserved.</span>
        <span className="mt-2 sm:mt-0 font-medium text-gray-400">Powered by React, FastAPI, Beanie & Groq LLM</span>
      </div>
    </footer>
  )
}
