import React from 'react'
import Hero from './landing/Hero'
import Organizations from './landing/Organizations'
import AgentsCarousel from './landing/AgentsCarousel'
import HowItWorks from './landing/HowItWorks'
import RealTimeInsights from './landing/RealTimeInsights'
import Testimonials from './landing/Testimonials'
import Footer from './landing/Footer'

export default function HybridLandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col font-display">
      {/* Sticky Header/Navbar Joined to the Very Top */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/70 backdrop-blur-xl border-b border-white/15 py-4 px-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-5 bg-amber-500 rounded-sm"></div>
            <span className="font-display font-black text-sm tracking-wider uppercase text-white">
              NAVIGATOR AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-gray-300 uppercase tracking-widest">
            <a href="#hero" className="hover:text-amber-400 transition-colors">Overview</a>
            <a href="#agents" className="hover:text-amber-400 transition-colors">Agents</a>
            <a href="#works" className="hover:text-amber-400 transition-colors">How it works</a>
            <a href="#insights" className="hover:text-amber-400 transition-colors">Insights</a>
            <a href="#testimonials" className="hover:text-amber-400 transition-colors">Reviews</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded text-xs font-bold tracking-wider uppercase border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-gray-300">
              Login
            </button>
            <button className="px-4 py-2 rounded text-xs font-bold tracking-wider uppercase bg-white text-black hover:bg-neutral-200 transition-all shadow-md">
              Signup
            </button>
          </div>
        </div>
      </header>

      {/* Content wrapper starts directly below sticky header */}
      <div id="hero" className="pt-16">
        <Hero />
      </div>
      
      <Organizations />
      
      <div id="agents">
        <AgentsCarousel />
      </div>
      
      <div id="works">
        <HowItWorks />
      </div>
      
      <div id="insights">
        <RealTimeInsights />
      </div>
      
      <div id="testimonials">
        <Testimonials />
      </div>
      
      <Footer />
    </div>
  )
}
