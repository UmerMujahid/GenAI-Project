import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card'

export default function RealTimeInsights() {
  return (
    <section id="insights" className="relative py-24 bg-[#030303] border-b border-white/5 overflow-hidden z-10">
      {/* Luminous background highlights to add lighting in scroll depth */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full bg-gradient-to-r from-purple-500/10 via-amber-500/5 to-transparent blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-xs md:text-sm font-display font-black text-amber-500 uppercase tracking-wider block mb-4">
            REAL-TIME INSIGHTS
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white">
            System performance at a glance.
          </h2>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Resume Match Score */}
          <Card className="hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] bg-neutral-900/60 border-white/20 transition-all duration-500 ring-1 ring-white/5">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-display font-black text-gray-400 uppercase tracking-wider">
                RESUME MATCH SCORE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            </CardHeader>
            <CardContent className="py-8 flex items-center justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path 
                    className="text-white/5" 
                    strokeWidth="2.5" 
                    stroke="currentColor" 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                  <path 
                    className="text-amber-500 animate-pulse-glow" 
                    strokeWidth="2.5" 
                    strokeDasharray="88, 100" 
                    strokeLinecap="round" 
                    stroke="currentColor" 
                    fill="none" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center select-none">
                  <span className="text-xl font-display font-black text-white">88%</span>
                  <span className="text-[7px] font-display font-bold text-gray-500 uppercase tracking-wider">AVERAGE</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-display font-bold uppercase tracking-wider">
              <span>KEYWORDS ALIGNED</span>
              <span className="text-amber-400 font-extrabold">89 MATCHING</span>
            </CardFooter>
          </Card>

          {/* Card 2: Weekly Momentum */}
          <Card className="hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] bg-neutral-900/60 border-white/20 transition-all duration-500 ring-1 ring-white/5">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-display font-black text-gray-400 uppercase tracking-wider">
                WEEKLY MOMENTUM
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            </CardHeader>
            <CardContent className="py-6 flex items-end justify-between px-2 h-28">
              <div className="w-3 bg-neutral-950 border border-white/15 rounded-t-sm h-8 hover:bg-purple-950 transition-all"></div>
              <div className="w-3 bg-neutral-950 border border-white/15 rounded-t-sm h-12 hover:bg-purple-950 transition-all"></div>
              <div className="w-3 bg-neutral-950 border border-white/15 rounded-t-sm h-16 hover:bg-purple-950 transition-all"></div>
              <div className="w-3 bg-neutral-950 border border-white/15 rounded-t-sm h-14 hover:bg-purple-950 transition-all"></div>
              <div className="w-3 bg-purple-600/35 rounded-t-sm h-20 hover:bg-purple-500/50 transition-all"></div>
              <div className="w-3 bg-purple-600 rounded-t-sm h-24 shadow-[0_0_10px_rgba(139,92,246,0.5)] transition-all"></div>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-display font-bold uppercase tracking-wider">
              <span>APPLICATIONS</span>
              <span className="text-purple-400 font-extrabold">+18 THIS WEEK</span>
            </CardFooter>
          </Card>

          {/* Card 3: Response Rate */}
          <Card className="hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] bg-neutral-900/60 border-white/20 transition-all duration-500 ring-1 ring-white/5">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-display font-black text-gray-400 uppercase tracking-wider">
                RESPONSE RATE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </CardHeader>
            <CardContent className="py-8 flex items-baseline justify-center h-28">
              <span className="text-6xl font-display font-black text-white">38%</span>
              <span className="text-xs text-emerald-400 font-display font-bold ml-2">↑ 4.2%</span>
            </CardContent>
            <CardFooter className="border-t border-white/10 pt-4 flex justify-between items-center text-[9px] text-gray-400 font-display font-bold uppercase tracking-wider">
              <span>INTERVIEW CRITERIA</span>
              <span className="text-white font-extrabold">EXCEEDS REGIONAL AVG</span>
            </CardFooter>
          </Card>

        </div>
      </div>
    </section>
  )
}
