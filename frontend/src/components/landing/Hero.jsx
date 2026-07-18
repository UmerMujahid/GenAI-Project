import React, { useState } from 'react'
import techBg from '../../assets/tech_bg.png'

export default function Hero() {
  const [tilt, setTilt] = useState({ x: -10, y: 8 })

  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - card.left) / card.width - 0.5
    const y = (e.clientY - card.top) / card.height - 0.5
    setTilt({ x: x * 25, y: -y * 25 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: -10, y: 8 })
  }

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden z-10">
      {/* Background Tech Network Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[100%] pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-45 scale-[1.01]"
          style={{ backgroundImage: `url(${techBg})` }}
        ></div>
        {/* Gradients to transition and bound the hero bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-black/80"></div>
        {/* Tech Grid overlay */}
        <div className="absolute inset-0 grid-bg-tech opacity-30"></div>
        {/* Soft glowing ambient lighting orbs to brighten the background */}
        <div className="absolute top-[20%] left-1/4 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[90px]"></div>
        <div className="absolute top-[30%] right-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[80px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Headline Column */}
        <div className="lg:col-span-7 text-left flex flex-col items-start pt-8">
          <h1 className="text-4xl md:text-6xl font-display font-black leading-[1.05] tracking-tight text-white mb-6">
            The Complete Stack <br />
            for Smarter{' '}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white">
              Internship Navigation.
            </span>
          </h1>

          <p className="text-xs md:text-sm text-gray-300 max-w-xl leading-relaxed mb-8">
            Automate your internship search across Pakistan. Our multi-agent system scrapes listings from LinkedIn, Rozee.pk, and Mustakbil, calculates resume match scores, tailors your resume for every role, and tracks applications — all in one place.
          </p>

          <div className="flex flex-wrap gap-4 items-center mb-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 rounded bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 shadow-xl transition-all flex items-center justify-center gap-2">
              Start Navigation
              <svg className="w-3.5 h-3.5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="w-full sm:w-auto px-5 py-3 rounded border border-white/10 hover:border-white/30 text-gray-300 hover:text-white font-semibold text-xs tracking-wider uppercase transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right 3D Tilted Card Column */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative w-full max-w-[420px] rounded-2xl border border-white/15 bg-neutral-950/80 backdrop-blur-xl p-6 shadow-2xl hover:border-amber-500/30 duration-300 ring-1 ring-white/10 select-none"
          >
            {/* Header portion */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/5">
              <div>
                <div className="text-xs md:text-sm font-display text-amber-500 uppercase tracking-wider font-extrabold">APPLICATION TRACKER</div>
                <div className="text-base font-display font-extrabold text-white mt-0.5">Autumn 2026 · Live</div>
              </div>
              <div className="w-6 h-6 rounded-full bg-neutral-900 border border-white/15 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/50"></span>
              </div>
            </div>

            {/* List entries */}
            <div className="space-y-3">
              {/* Anthropic */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-900 border border-white/10 flex items-center justify-center font-display font-black text-xs text-amber-500">
                    A
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">Anthropic</div>
                    <div className="text-[9px] text-gray-500 font-mono mt-0.5">RESEARCH ENG · INTERN</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[8px] font-mono font-bold">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  Interview Scheduled
                </div>
              </div>

              {/* Stripe */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-900 border border-white/10 flex items-center justify-center font-display font-black text-xs text-amber-500">
                    S
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">Stripe</div>
                    <div className="text-[9px] text-gray-500 font-mono mt-0.5">PRODUCT ENG · INTERN</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[8px] font-mono font-bold">
                  <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                  Applied
                </div>
              </div>

              {/* Figma */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-900 border border-white/10 flex items-center justify-center font-display font-black text-xs text-amber-500">
                    F
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">Figma</div>
                    <div className="text-[9px] text-gray-500 font-mono mt-0.5">DESIGN SYSTEMS · INTERN</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400 text-[8px] font-mono font-bold">
                  <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse"></span>
                  Offer
                </div>
              </div>

              {/* Linear */}
              <div className="relative flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-900 border border-white/10 flex items-center justify-center font-display font-black text-xs text-amber-500">
                    L
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">Linear</div>
                    <div className="text-[9px] text-gray-500 font-mono mt-0.5">PLATFORM · INTERN</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-400 text-[8px] font-mono font-bold">
                  <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                  In Review
                </div>
              </div>
            </div>

            {/* Circular Dial Match Score Overlay */}
            <div className="absolute bottom-[-15px] left-[-20px] w-24 h-24 rounded-xl border border-amber-500/25 bg-black/95 p-3 shadow-xl backdrop-blur-xl flex flex-col items-center justify-center animate-float-slow ring-1 ring-amber-500/10">
              <svg className="w-9 h-9 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/5"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500"
                  strokeWidth="2.5"
                  strokeDasharray="94, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute top-[28px] text-[10px] font-mono font-extrabold text-white">94%</div>
              <div className="text-[7px] text-gray-400 font-mono tracking-widest uppercase mt-1">MATCH</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
