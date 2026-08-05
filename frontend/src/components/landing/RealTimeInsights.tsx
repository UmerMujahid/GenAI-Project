import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card'

export default function RealTimeInsights() {
  return (
    <section id="insights" className="relative py-14 md:py-16 bg-[#0d0e12] border-b border-white/20 overflow-hidden z-10">
      {/* Background glow highlights */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full bg-gradient-to-r from-purple-500/20 via-amber-500/10 to-transparent blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <span className="text-xs md:text-sm font-display font-black text-amber-400 uppercase tracking-widest block mb-2">
            REAL-TIME INSIGHTS
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-white">
            System performance at a glance.
          </h2>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Resume Match Score (Perfectly Centered Circle Dial) */}
          <Card className="border border-white/20 bg-neutral-900/90 shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center">
            <CardHeader className="w-full border-b border-white/10 pb-3 text-center">
              <span className="text-xs font-display font-black text-gray-200 uppercase tracking-wider block">
                RESUME MATCH SCORE
              </span>
            </CardHeader>

            <CardContent className="py-6 w-full flex flex-col items-center justify-center min-h-[140px]">
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

            <CardFooter className="w-full border-t border-white/10 pt-3 flex items-center justify-center gap-2 text-center text-[11px] text-gray-300 font-display font-bold uppercase tracking-wider">
              <span>KEYWORDS ALIGNED:</span>
              <span className="text-amber-400 font-extrabold">89 MATCHING</span>
            </CardFooter>
          </Card>

          {/* Card 2: Processing Velocity */}
          <Card className="border border-white/20 bg-neutral-900/90 shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center">
            <CardHeader className="w-full border-b border-white/10 pb-3 text-center">
              <span className="text-xs font-display font-black text-gray-200 uppercase tracking-wider block">
                PROCESSING VELOCITY
              </span>
            </CardHeader>

            <CardContent className="py-6 w-full flex flex-col items-center justify-center min-h-[140px]">
              <span className="text-5xl font-display font-black text-white leading-none">2.5s</span>
              <div className="mt-3 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/20 text-purple-300 text-xs font-display font-black uppercase tracking-wider">
                10X FASTER AUTOMATION
              </div>
            </CardContent>

            <CardFooter className="w-full border-t border-white/10 pt-3 flex items-center justify-center gap-2 text-center text-[11px] text-gray-300 font-display font-bold uppercase tracking-wider">
              <span>AGENT PIPELINE:</span>
              <span className="text-purple-400 font-extrabold">SUB-3 SECOND ENGINE</span>
            </CardFooter>
          </Card>

          {/* Card 3: Response Rate */}
          <Card className="border border-white/20 bg-neutral-900/90 shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center">
            <CardHeader className="w-full border-b border-white/10 pb-3 text-center">
              <span className="text-xs font-display font-black text-gray-200 uppercase tracking-wider block">
                RESPONSE RATE
              </span>
            </CardHeader>

            <CardContent className="py-6 w-full flex flex-col items-center justify-center min-h-[140px]">
              <span className="text-5xl font-display font-black text-white leading-none">38%</span>
              <div className="mt-3 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 text-emerald-300 text-xs font-display font-black uppercase tracking-wider">
                EXCEEDS REGIONAL AVG
              </div>
            </CardContent>

            <CardFooter className="w-full border-t border-white/10 pt-3 flex items-center justify-center gap-2 text-center text-[11px] text-gray-300 font-display font-bold uppercase tracking-wider">
              <span>INTERVIEW CONVERSION:</span>
              <span className="text-emerald-400 font-extrabold">HIGH YIELD</span>
            </CardFooter>
          </Card>

        </div>
      </div>
    </section>
  )
}
