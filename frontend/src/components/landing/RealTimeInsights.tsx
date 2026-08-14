import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card'

export default function RealTimeInsights() {
  return (
    <section id="insights" className="relative py-16 md:py-20 bg-[#0d0e12] border-b border-white/20 overflow-hidden z-10">
      {/* Background glow highlights */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full bg-gradient-to-r from-purple-500/20 via-amber-500/10 to-transparent blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-xs md:text-sm font-display font-black text-amber-400 uppercase tracking-widest block mb-2">
            REAL-TIME INSIGHTS
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-white">
            System performance at a glance.
          </h2>
          <p className="text-sm text-gray-300 max-w-lg mx-auto mt-2 font-sans">
            Continuous multi-agent metrics tracking resume extraction, live job scraping, and candidate compatibility.
          </p>
        </div>

        {/* Dashboard Grid (3 Centered Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

          {/* Card 1: Resume Match Score */}
          <Card className="border border-white/20 bg-neutral-900/90 shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center p-2 hover:border-amber-500/40">
            <CardHeader className="w-full border-b border-white/10 pb-3 text-center">
              <span className="text-xs font-display font-black text-gray-200 uppercase tracking-wider block text-center">
                RESUME MATCH SCORE
              </span>
            </CardHeader>

            <CardContent className="py-6 w-full flex flex-col items-center justify-center min-h-[160px] text-center">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
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
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none text-center">
                  <span className="text-2xl font-display font-black text-white leading-none">88%</span>
                  <span className="text-[9px] font-display font-bold text-amber-400 uppercase tracking-widest mt-1">AVERAGE</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="w-full border-t border-white/10 pt-3 flex items-center justify-center gap-2 text-center text-xs text-gray-300 font-display font-bold uppercase tracking-wider">
              <span>KEYWORDS ALIGNED:</span>
              <span className="text-amber-400 font-extrabold">89 MATCHING</span>
            </CardFooter>
          </Card>

          {/* Card 2 (NEW Center Card): Live Job Discovery */}
          <Card className="border border-white/20 bg-gradient-to-b bg-neutral-900/90 to-neutral-950/95 shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center p-2 hover:border-amber-400/60 ring-1 ring-amber-500/15">
            <CardHeader className="w-full border-b border-white/10 pb-3 text-center">
              <span className="text-xs font-display font-black text-white-400 uppercase tracking-wider block text-center">
                LIVE TECH DISCOVERY
              </span>
            </CardHeader>

            <CardContent className="py-6 w-full flex flex-col items-center justify-center min-h-[160px] text-center space-y-3">
              <div className="flex items-center justify-center gap-1">
                <span className="text-5xl font-display font-black text-white tracking-tight">500+</span>
              </div>
              <div className="px-3.5 py-1 rounded-full border border-purple -500/30 bg-purple-500/10 text-purple-300 text-xs font-display font-black uppercase tracking-wider text-center">
                INDEED • LINKEDIN • GOOGLE
              </div>
            </CardContent>

            <CardFooter className="w-full border-t border-white/10 pt-3 flex items-center justify-center gap-2 text-center text-xs text-gray-300 font-display font-bold uppercase tracking-wider">
              <span>COVERAGE:</span>
              <span className="text-amber-400 font-extrabold">PAKISTAN & REMOTE</span>
            </CardFooter>
          </Card>

          {/* Card 3: AI Interview Match Fit */}
          <Card className="border border-white/20 bg-neutral-900/90 shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center p-2 hover:border-emerald-500/40">
            <CardHeader className="w-full border-b border-white/10 pb-3 text-center">
              <span className="text-xs font-display font-black text-gray-200 uppercase tracking-wider block text-center">
                FIT PRECISION RATE
              </span>
            </CardHeader>

            <CardContent className="py-6 w-full flex flex-col items-center justify-center min-h-[160px] text-center space-y-3">
              <span className="text-5xl font-display font-black text-white tracking-tight">94%</span>
              <div className="px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-300 text-xs font-display font-black uppercase tracking-wider text-center">
                HIGH FIT MATCHING
              </div>
            </CardContent>

            <CardFooter className="w-full border-t border-white/10 pt-3 flex items-center justify-center gap-2 text-center text-xs text-gray-300 font-display font-bold uppercase tracking-wider">
              <span>ACCURACY:</span>
              <span className="text-emerald-400 font-extrabold">GROQ LLM SCORING</span>
            </CardFooter>
          </Card>

        </div>
      </div>
    </section>
  )
}
