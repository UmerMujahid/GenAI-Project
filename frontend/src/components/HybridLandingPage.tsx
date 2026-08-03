import React from 'react'
import Hero from './landing/Hero'
import Organizations from './landing/Organizations'
import AgentsCarousel from './landing/AgentsCarousel'
import HowItWorks from './landing/HowItWorks'
import RealTimeInsights from './landing/RealTimeInsights'
import Navbar from './layout/Navbar'
import Footer from './landing/Footer'

export default function HybridLandingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col font-display">
      <Navbar />

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
      
      <Footer />
    </div>
  )
}
