import React, { useState } from 'react'

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1)

  const steps = [
    {
      num: 1,
      tag: 'Step 01',
      title: 'Resume Parser',
      subtitle: 'PDF Component Extraction',
      description: 'Parses your uploaded PDF resume using PyMuPDF & Regex to extract contact details, skills, education, experience, and certifications.'
    },
    {
      num: 2,
      tag: 'Step 02',
      title: 'Internship Finder',
      subtitle: 'Playwright Scraper',
      description: 'Combs through LinkedIn, Rozee.pk, and Mustakbil to discover real-time software engineering internship opportunities across Pakistan.'
    },
    {
      num: 3,
      tag: 'Step 03',
      title: 'Resume Matching',
      subtitle: 'LLM Semantic Fit Score',
      description: 'Compares your parsed profile against extracted job descriptions, generating a percentage match score and flagging skill gaps.'
    },
    {
      num: 4,
      tag: 'Step 04',
      title: 'Resume Tailor',
      subtitle: 'Targeted Profile Alignment',
      description: 'Rewrites and customizes your project bullet points and summary statement to highlight relevant skills for each position.'
    },
    {
      num: 5,
      tag: 'Step 05',
      title: 'Cover Letter',
      subtitle: 'Bespoke Application Copy',
      description: 'Drafts tailored cover letters contextualizing your academic milestones, projects, and motivation specifically for the employer.'
    }
  ]

  return (
    <section id="works" className="relative py-14 md:py-16 bg-[#0d0e12] border-b border-white/20 z-10">
      {/* Background ambient lighting */}
      <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/20 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs md:text-sm font-display font-black text-amber-400 uppercase tracking-widest block mb-2">
            HOW IT WORKS
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-white leading-tight">
            5 Automated Steps to Your Target Internship
          </h2>
          <p className="text-xs md:text-sm text-gray-300 font-display font-medium max-w-xl mx-auto mt-2">
            Our multi-agent pipeline handles extraction, discovery, scoring, tailoring, and copy generation in sequence.
          </p>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step) => {
            const isSelected = activeStep === step.num
            return (
              <div 
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`cursor-pointer text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-neutral-900/90 border-amber-500/60 shadow-xl ring-1 ring-amber-500/30' 
                    : 'border-white/20 hover:border-white/40 bg-neutral-900/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-display font-black tracking-wider text-amber-400 uppercase">
                      {step.tag}
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-display font-black text-xs transition-colors ${
                      isSelected 
                        ? 'bg-amber-400 text-black shadow-md shadow-amber-500/30' 
                        : 'bg-neutral-950 border border-white/20 text-gray-300'
                    }`}>
                      {step.num}
                    </div>
                  </div>

                  <h3 className="text-base font-display font-extrabold text-white mb-1">
                    {step.title}
                  </h3>
                  <span className="text-[11px] font-display font-bold text-gray-400 uppercase tracking-wide block mb-3">
                    {step.subtitle}
                  </span>

                  <p className="text-xs text-gray-300 leading-relaxed font-display font-medium">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-display font-bold uppercase tracking-wider text-gray-400">
                  <span>Automated</span>
                  <span className="text-amber-400">Agent Step</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
