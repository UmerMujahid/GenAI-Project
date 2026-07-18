import React, { useState } from 'react'
import techBg from '../../assets/tech_bg.png'

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      num: 1,
      title: 'Upload & Configure',
      description: 'Upload your current resume and specify your target preferences: role (e.g. Frontend, Fullstack), cities, and remote preference.',
      tag: 'Step 1: Input Setup'
    },
    {
      num: 2,
      title: 'Scrape & Tailor',
      description: 'Playwright scraper fetches internships from LinkedIn, Rozee, and Mustakbil. Matching agents score them, and Tailoring agents rewrite your resume to fit.',
      tag: 'Step 2: Processing & Matching'
    },
    {
      num: 3,
      title: 'Apply & Track',
      description: 'Generates custom cover letters per job. Track applications automatically in the dashboard (Applied, Interview, Offer) without Excel sheets.',
      tag: 'Step 3: Track Outcomes'
    }
  ]

  return (
    <section id="works" className="relative py-24 bg-[#030303] border-b border-white/5 z-10">
      {/* Background ambient lighting */}
      <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-purple-900/5 blur-[90px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-left mb-16">
          <span className="text-xs md:text-sm font-display font-black text-amber-500 uppercase tracking-wider block mb-3">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl font-display font-black text-white leading-tight">
            One resume to upload, <br />
            <span className="text-gray-400 font-light">three steps to the offer.</span>
          </h2>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Column */}
          <div className="lg:col-span-6 relative rounded-2xl border border-white/15 overflow-hidden shadow-2xl h-[380px] group bg-neutral-900/40">
            {/* Background tech photo */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 scale-[1.02] group-hover:scale-105 transition-transform duration-[4000ms]"
              style={{ backgroundImage: `url(${techBg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#030303] via-transparent to-black/30"></div>

            {/* Overlaid Card (Refined Insight style matching sample) */}
            <div className="absolute bottom-8 left-6 right-6 p-6 rounded-xl border border-white/20 bg-neutral-950/90 backdrop-blur-md shadow-2xl text-left transition-all duration-500 hover:border-amber-500/30">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-amber-400 animate-pulse-glow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-display font-black uppercase tracking-wider text-white">
                  Refined Match Profile
                </span>
              </div>
              <p className="text-[11px] text-gray-300 font-sans leading-relaxed mb-5">
                Your tailored resume is compiled and ready to use — experiences and projects automatically adjusted for the Stripe Product Engineer role.
              </p>
              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-[9px] font-display font-bold text-gray-500 uppercase tracking-wider">
                  Status: Tailor complete
                </span>
                <button className="px-4 py-2 rounded bg-white text-black font-semibold text-[10px] uppercase hover:bg-neutral-200 transition-colors">
                  Use tailored version
                </button>
              </div>
            </div>
          </div>

          {/* Right Steps Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {steps.map((step) => {
              const isSelected = activeStep === step.num
              return (
                <div 
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`cursor-pointer text-left p-6 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                    isSelected 
                      ? 'bg-neutral-900/60 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.02)] pl-8' 
                      : 'border border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-extrabold text-xs shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' 
                      : 'bg-neutral-950 border border-white/10 text-gray-400'
                  }`}>
                    {step.num}
                  </div>
                  <div>
                    {/* Changed font-mono to font-display for step subtitle */}
                    <span className="text-xs font-display font-black tracking-wider text-amber-500 uppercase">
                      {step.tag}
                    </span>
                    <h3 className={`text-base font-display font-extrabold text-white mt-1 transition-colors ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-2">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
