import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card'

export default function AgentsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const agents = [
    {
      step: 'STEP 01',
      title: 'Job Discovery Agent',
      subtitle: 'Playwright-Powered Scraping',
      description: 'Automatically combs through LinkedIn, Rozee.pk, Mustakbil, and targeted company pages. Extracts listings, removes duplicates, and logs key details like company, title, required skills, and deadlines.',
      stat: '12.4k+',
      statLabel: 'Opportunities Scraped',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      step: 'STEP 02',
      title: 'Resume Matching Agent',
      subtitle: 'LLM Semantics & Fit Checker',
      description: 'Performs semantic analysis comparing your current resume against the extracted job description. Calculates a precise fit score, highlights key matching competencies, and flags missing required skills.',
      stat: '94%',
      statLabel: 'Avg. Match Accuracy',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
        </svg>
      )
    },
    {
      step: 'STEP 03',
      title: 'Resume Tailoring Agent',
      subtitle: 'Dynamic Profile Alignment',
      description: 'Generates an optimized, truthful version of your resume aligned with the job description. Customizes your summary statement, prioritizes your core technical stack, and re-emphasizes project descriptions.',
      stat: '2.5s',
      statLabel: 'Generation Speed',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    },
    {
      step: 'STEP 04',
      title: 'Cover Letter Agent',
      subtitle: 'Persuasive Copy Generation',
      description: 'Drafts bespoke, compelling cover letters tailored for each position. Seamlessly contextualizes your academic milestones, skills, and genuine motivation for joining the specific organization.',
      stat: '100%',
      statLabel: 'Bespoke Customization',
      icon: (
        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
        </svg>
      )
    }
  ]

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % agents.length)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + agents.length) % agents.length)
  }

  const getCardOffset = (idx) => {
    let diff = idx - activeIndex
    if (diff < -1) diff += agents.length
    if (diff > 2) diff -= agents.length
    return diff
  }

  return (
    <section className="relative py-24 bg-[#030303] border-b border-white/5 overflow-hidden z-10">
      {/* Background glow orbs to brighten the scrolled section */}
      <div className="absolute top-[20%] left-[-15%] w-[400px] h-[400px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-15%] w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* Title portion */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 text-left">
          <div>
            <span className="text-xs md:text-sm font-display font-black text-amber-500 uppercase tracking-wider block">
              SPECIALIZED AI AGENTS
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mt-3 leading-tight">
              One coordinate thread. <br />
              Four specialized agents in sync.
            </h2>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-white/15 hover:border-amber-500/40 hover:bg-amber-500/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-white/15 hover:border-amber-500/40 hover:bg-amber-500/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel Window Stack */}
        <div className="relative h-[400px] flex items-center justify-center max-w-4xl mx-auto overflow-hidden">
          {agents.map((agent, index) => {
            const offset = getCardOffset(index)
            const isActive = offset === 0
            const isLeft = offset === -1
            const isRight = offset === 1
            const isHidden = offset > 1 || offset < -1

            // Style configuration based on active positioning
            let transformClass = 'scale-75 opacity-0 pointer-events-none z-0'
            if (isActive) {
              transformClass = 'translate-x-0 scale-100 opacity-100 z-30 pointer-events-auto shadow-[0_0_45px_rgba(245,158,11,0.15)] border-amber-500/40'
            } else if (isLeft) {
              transformClass = '-translate-x-[40%] sm:-translate-x-[60%] scale-90 opacity-40 z-20 pointer-events-auto cursor-pointer hover:opacity-60'
            } else if (isRight) {
              transformClass = 'translate-x-[40%] sm:translate-x-[60%] scale-90 opacity-40 z-20 pointer-events-auto cursor-pointer hover:opacity-60'
            }

            return (
              <div
                key={index}
                onClick={() => {
                  if (isLeft) handlePrev()
                  if (isRight) handleNext()
                }}
                className={`absolute w-full max-w-[340px] sm:max-w-[420px] transition-all duration-500 ease-in-out ${transformClass}`}
              >
                <Card className="border border-white/15 bg-neutral-900/90 backdrop-blur-2xl p-2 select-none">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        {agent.icon}
                      </div>
                      <div className="text-left">
                        <CardTitle className="text-base font-extrabold text-white">{agent.title}</CardTitle>
                        {/* Change font-mono to font-display (Outfit) for the subtitle */}
                        <span className="text-xs font-display font-black text-amber-500 uppercase tracking-wider">
                          {agent.subtitle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-display font-extrabold text-gray-500 tracking-wider">
                      {agent.step}
                    </span>
                  </CardHeader>
                  
                  <CardContent className="pt-6 text-left">
                    <p className="text-xs text-gray-300 leading-relaxed min-h-[64px]">
                      {agent.description}
                    </p>
                  </CardContent>

                  <CardFooter className="border-t border-white/5 pt-5 flex items-center justify-between">
                    <div className="text-left">
                      <div className="text-xl font-display font-black text-white">{agent.stat}</div>
                      <div className="text-[9px] font-display font-bold text-gray-500 uppercase tracking-wider">
                        {agent.statLabel}
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded border border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5 text-[9px] font-display font-bold tracking-wider text-gray-400 hover:text-white transition-all uppercase">
                      Launch Agent
                    </button>
                  </CardFooter>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2.5 mt-8">
          {agents.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'w-8 bg-amber-500' : 'w-2 bg-neutral-800 hover:bg-neutral-700'
              }`}
            ></button>
          ))}
        </div>

      </div>
    </section>
  )
}
