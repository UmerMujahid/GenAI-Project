import React, { useState } from 'react'
import techBg from '../../assets/tech_bg.png'

export default function Hero() {
  const [tilt, setTilt] = useState({ x: -10, y: 8 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - card.left) / card.width - 0.5
    const y = (e.clientY - card.top) / card.height - 0.5
    setTilt({ x: x * 25, y: -y * 25 })
  }

  const handleMouseLeave = () => {
    setTilt({ x: -10, y: 8 })
  }

  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden z-10 bg-[#0d0e12]">
      {/* Background Tech Network Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[100%] pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55 scale-[1.01]"
          style={{ backgroundImage: `url(${techBg})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/70 to-black/80"></div>
        <div className="absolute inset-0 grid-bg-tech opacity-40"></div>
        <div className="absolute top-[20%] left-1/4 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-[100px]"></div>
        <div className="absolute top-[30%] right-1/4 w-[350px] h-[350px] rounded-full bg-amber-500/20 blur-[90px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Headline Column */}
        <div className="lg:col-span-7 text-left flex flex-col items-start pt-8">
          <h1 className="text-3xl sm:text-4xl md:text-[53px] font-display font-black leading-[1.1] tracking-tight text-white mb-6 pr-2">
            The Complete Stack <br />
            for Smarter{' '}
            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-white inline-block pr-1">
              Internship Navigation.
            </span>
          </h1>

          <p className="text-sm md:text-base font-display font-medium text-gray-200 max-w-xl leading-relaxed mb-6">
            Automate your internship search across Pakistan. Our 5-agent AI stack parses your resume, scrapes top job portals, scores match fit, tailors your profile, and tracks applications — all in one place.
          </p>

          <div className="flex flex-wrap gap-4 items-center mb-4 w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-sm tracking-wider uppercase shadow-xl transition-all flex items-center justify-center gap-2">
              Start Navigation
              <svg className="w-4 h-4 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="w-full sm:w-auto px-7 py-4 rounded-xl border border-white/20 hover:border-white/40 text-gray-100 hover:text-white font-bold text-sm tracking-wider uppercase transition-all duration-300">
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
            className="relative w-full max-w-[420px] rounded-3xl border border-white/20 bg-neutral-900/90 backdrop-blur-2xl p-6 shadow-2xl hover:border-amber-500/50 duration-300 select-none"
          >
            {/* Header portion */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
              <div>
                <div className="text-sm font-display text-amber-400 uppercase tracking-widest font-black">APPLICATION TRACKER</div>
                <div className="text-lg font-display font-extrabold text-white mt-0.5">Autumn 2026 · Live Pipeline</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-950 border border-white/20 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-md shadow-amber-500/50"></span>
              </div>
            </div>

            {/* List entries */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-white/20 flex items-center justify-center font-display font-black text-sm text-amber-400">
                    A
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Systems Limited</div>
                    <div className="text-xs text-gray-300 font-mono mt-0.5">AI ENGINEER · INTERN</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Interview
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-white/20 flex items-center justify-center font-display font-black text-sm text-amber-400">
                    D
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Devsinc</div>
                    <div className="text-xs text-gray-300 font-mono mt-0.5">FULL-STACK · INTERN</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  Applied
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-neutral-950 border border-white/20 flex items-center justify-center font-display font-black text-sm text-amber-400">
                    A
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Arbisoft</div>
                    <div className="text-xs text-gray-300 font-mono mt-0.5">BACKEND FASTAPI · INTERN</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  Offer
                </div>
              </div>
            </div>

            {/* Perfectly Centered Match Score Overlay */}
            <div className="absolute bottom-[-15px] left-[-20px] w-28 h-28 rounded-2xl border border-amber-500/40 bg-neutral-950 shadow-2xl backdrop-blur-xl flex items-center justify-center">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-400"
                  strokeWidth="3"
                  strokeDasharray="94, 100"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 pointer-events-none">
                <span className="text-sm font-mono font-black text-white leading-none">94%</span>
                <span className="text-[8px] text-amber-400 font-mono font-bold tracking-widest uppercase mt-1">MATCH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
