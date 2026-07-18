import React, { useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/landing/Footer'

export default function Dashboard() {
  // Mock Internship Data
  const initialInternships = [
    {
      id: 1,
      title: 'Software Engineer Intern',
      company: 'Systems Limited',
      location: 'Lahore, Pakistan',
      source: 'LinkedIn',
      matchScore: 96,
      scrapedTime: '2 hours ago',
      skills: ['React', 'Node.js', 'SQL', 'Git'],
      description: 'Assist in building enterprise cloud applications and integrating RESTful APIs. Candidates should have a strong command over Javascript and OOP concepts.',
      glowColor: 'amber'
    },
    {
      id: 2,
      title: 'AI/ML Research Intern',
      company: 'Arbisoft',
      location: 'Lahore, Pakistan (Hybrid)',
      source: 'Direct Careers',
      matchScore: 92,
      scrapedTime: '5 hours ago',
      skills: ['Python', 'PyTorch', 'NLP', 'Pandas'],
      description: 'Collaborate with the core AI team to clean and preprocess large text corpora. Work on fine-tuning local transformer models for translation and indexing.',
      glowColor: 'purple'
    },
    {
      id: 3,
      title: 'Backend Developer Intern',
      company: 'Motive (KeepTruckin)',
      location: 'Islamabad, Pakistan',
      source: 'LinkedIn',
      matchScore: 88,
      scrapedTime: '1 day ago',
      skills: ['Go', 'Docker', 'gRPC', 'PostgreSQL'],
      description: 'Work alongside lead engineers to design, build, and support high-throughput telemetry microservices. Exposure to cloud infrastructure is a plus.',
      glowColor: 'purple'
    },
    {
      id: 4,
      title: 'Frontend Developer Intern',
      company: 'Stripe',
      location: 'Remote (Pakistan)',
      source: 'Mustakbil',
      matchScore: 85,
      scrapedTime: '6 hours ago',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      description: 'Translate design systems and interactive checkout layouts into responsive, accessible, pixel-perfect frontend pages. High focus on styling quality.',
      glowColor: 'amber'
    },
    {
      id: 5,
      title: 'Full Stack Developer Intern',
      company: 'Devsinc',
      location: 'Karachi, Pakistan',
      source: 'Rozee.pk',
      matchScore: 79,
      scrapedTime: '12 hours ago',
      skills: ['Next.js', 'Express', 'MongoDB', 'Tailwind'],
      description: 'Develop and maintain internal business applications. Responsibilities include working on API endpoints, client-side views, and bug fixes.',
      glowColor: 'amber'
    }
  ]

  // States
  const [internships, setInternships] = useState(initialInternships)
  const [selectedSource, setSelectedSource] = useState('All')
  const [minMatchScore, setMinMatchScore] = useState(70)
  const [sortBy, setSortBy] = useState('matchScore')
  
  // Agent Console Modal States
  const [activeAgentJob, setActiveAgentJob] = useState(null)
  const [agentProgress, setAgentProgress] = useState([])
  const [isAgentRunning, setIsAgentRunning] = useState(false)
  const [agentFinished, setAgentFinished] = useState(false)

  // Filter & Sort Logic
  const handleSearchAndFilters = () => {
    let temp = [...initialInternships]
    
    // Source Filter
    if (selectedSource !== 'All') {
      temp = temp.filter(job => job.source === selectedSource)
    }

    // Match Score Filter
    temp = temp.filter(job => job.matchScore >= minMatchScore)

    // Sorting
    if (sortBy === 'matchScore') {
      temp.sort((a, b) => b.matchScore - a.matchScore)
    } else if (sortBy === 'newest') {
      // For mock purposes, using ID order for time
      temp.sort((a, b) => a.id - b.id)
    }

    return temp
  }

  const filteredInternships = handleSearchAndFilters()

  // Simulate Multi-Agent Resume Tailoring
  const triggerResumeTailorAgent = (job) => {
    setActiveAgentJob(job)
    setIsAgentRunning(true)
    setAgentFinished(false)
    setAgentProgress(['Initializing Resume Optimizer Agent...'])

    const steps = [
      'Reading resume profile structures...',
      `Parsing "${job.title} at ${job.company}" requirements...`,
      'Aligning core technical stack projects...',
      'Optimizing project impact bullet points (STAR method)...',
      'Refining summary profile alignment...',
      'Tailoring complete! Generation finished in 1.8 seconds.'
    ]

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setAgentProgress(prev => [...prev, step])
        if (idx === steps.length - 1) {
          setIsAgentRunning(false)
          setAgentFinished(true)
        }
      }, (idx + 1) * 800)
    })
  }

  const closeAgentModal = () => {
    if (!isAgentRunning) {
      setActiveAgentJob(null)
      setAgentProgress([])
      setAgentFinished(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col font-display relative overflow-hidden">
      <Navbar />

      {/* Futuristic Background Glows */}
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-purple-900/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none"></div>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-6 pt-32 pb-24 w-full z-10 relative">
        
        {/* Immersive HUD Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 border-b border-white/5 pb-8">
          <div>
            <span className="text-xs font-display font-black text-amber-500 uppercase tracking-widest block mb-2">
              DISCOVERY DASHBOARD
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Scraped Internships.
            </h1>
            <p className="text-xs text-gray-400 font-sans mt-2">
              Live feeds extracted and tailored using LangGraph agents.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex gap-4 sm:gap-6 bg-neutral-950/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl shadow-xl ring-1 ring-white/5">
            <div className="text-left px-2 sm:px-4">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Scraped</span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">24</span>
            </div>
            <div className="w-[1px] bg-white/10 h-8 self-center"></div>
            <div className="text-left px-2 sm:px-4">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Match Rate</span>
              <span className="text-xl sm:text-2xl font-black text-amber-500 font-mono">87%</span>
            </div>
            <div className="w-[1px] bg-white/10 h-8 self-center"></div>
            <div className="text-left px-2 sm:px-4">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block">Optimal</span>
              <span className="text-xl sm:text-2xl font-black text-purple-400 font-mono">12</span>
            </div>
          </div>
        </div>

        {/* Unique Command Dock (Source Filters, Slider, Sort) */}
        <div className="mb-10 p-5 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur-xl shadow-2xl ring-1 ring-white/5 flex flex-wrap justify-between items-center gap-6 w-full">
          {/* Filtering dock */}
          <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6 text-left w-full">
            {/* Source Badges */}
            <div className="flex items-center gap-1.5 p-1 bg-black/45 border border-white/5 rounded-xl">
              {['All', 'LinkedIn', 'Rozee.pk', 'Mustakbil', 'Direct Careers'].map((src) => (
                <button
                  key={src}
                  onClick={() => setSelectedSource(src)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    selectedSource === src
                      ? 'bg-white text-black font-extrabold shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {src.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Slider Match Score */}
            <div className="flex items-center gap-3 bg-black/30 border border-white/5 px-4 py-2 rounded-xl">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Min Match</span>
              <input
                type="range"
                min="70"
                max="95"
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="w-20 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs font-mono font-extrabold text-amber-500 w-8">{minMatchScore}%</span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold text-gray-300 focus:outline-none focus:border-amber-500/50 cursor-pointer"
              >
                <option value="matchScore">Highest Match</option>
                <option value="newest">Newest Scraped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Masonry Card Grid Deck */}
        {filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternships.map((job) => {
              const isAmber = job.glowColor === 'amber'
              return (
                <div
                  key={job.id}
                  className={`group relative rounded-2xl bg-neutral-950/45 p-6 backdrop-blur-xl border transition-all duration-500 flex flex-col justify-between items-start text-left ${
                    isAmber
                      ? 'border-amber-500/10 hover:border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.02)] hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] ring-1 ring-amber-500/5'
                      : 'border-purple-500/10 hover:border-purple-500/40 shadow-[0_0_15px_rgba(139,92,246,0.02)] hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] ring-1 ring-purple-500/5'
                  }`}
                >
                  {/* Top line with Platform details & match tag */}
                  <div className="w-full flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold text-gray-200 font-mono tracking-widest uppercase bg-white/[0.08] border border-white/15 px-3 py-1.5 rounded-md">
                      {job.source}
                    </span>
                    
                    {/* Ring score glow dial */}
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-black border ${
                      isAmber
                        ? 'border-amber-500/40 bg-amber-500/20 text-amber-400'
                        : 'border-purple-500/40 bg-purple-500/20 text-purple-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAmber ? 'bg-amber-400' : 'bg-purple-400'}`}></span>
                      {job.matchScore}% Match
                    </div>
                  </div>

                  {/* Header Titles */}
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-white leading-tight mb-1 group-hover:text-amber-400 transition-colors duration-300">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-200">{job.company}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-300 font-semibold font-sans">{job.location}</span>
                    </div>
                  </div>

                  {/* Description Summary */}
                  <p className="text-sm text-gray-300 leading-relaxed font-sans mb-5 line-clamp-3">
                    {job.description}
                  </p>

                  {/* Tech Skill tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-bold font-sans px-2.5 py-1 rounded-md border border-white/10 bg-white/10 text-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="w-full border-t border-white/10 pt-4 flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-gray-300 font-sans">Scraped {job.scrapedTime}</span>
                    
                    <button
                      onClick={() => triggerResumeTailorAgent(job)}
                      className={`px-4 py-2.5 rounded-lg border text-xs font-extrabold uppercase tracking-wider text-white transition-all flex items-center gap-1.5 ${
                        isAmber
                          ? 'border-white/20 hover:border-amber-500/40 bg-white/10 hover:bg-amber-500/20'
                          : 'border-white/20 hover:border-purple-500/40 bg-white/10 hover:bg-purple-500/20'
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Tailor Resume
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty Search Fallback */
          <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-neutral-950/20 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white mb-1">No internships found</h3>
            <p className="text-xs text-gray-500 font-sans max-w-xs leading-relaxed">
              No matching listings fit your current search query or match score filter criteria.
            </p>
          </div>
        )}
      </main>

      {/* Immersive HUD Console Modal overlay (Resume Optimizer Agent running) */}
      {activeAgentJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-[500px] rounded-3xl border border-white/10 bg-neutral-950/95 shadow-2xl p-6 md:p-8 flex flex-col select-none relative overflow-hidden">
            {/* Subtle glow border top inside */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20"></div>
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                <h3 className="text-sm font-display font-black text-white uppercase tracking-wider">AGENT CONSOLE LOGGER</h3>
              </div>
              <button 
                onClick={closeAgentModal}
                disabled={isAgentRunning}
                className={`text-gray-500 hover:text-white transition-colors ${
                  isAgentRunning ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Terminal Window Log Console */}
            <div className="w-full bg-black/90 border border-white/5 rounded-2xl p-5 font-mono text-[10px] text-left leading-relaxed text-gray-400 h-[240px] overflow-y-auto mb-6 flex flex-col gap-2.5">
              {agentProgress.map((log, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <span className="text-amber-500 font-extrabold shrink-0">&gt;</span>
                  <span className={`${
                    idx === agentProgress.length - 1 && isAgentRunning 
                      ? 'text-white' 
                      : log.includes('successfully') || log.includes('finished') 
                        ? 'text-emerald-400 font-bold' 
                        : 'text-gray-300'
                  }`}>
                    {log}
                  </span>
                </div>
              ))}
              
              {isAgentRunning && (
                <div className="flex gap-2 items-center text-white mt-1">
                  <span className="text-amber-500 font-extrabold shrink-0 animate-pulse">&gt;</span>
                  <span className="animate-pulse">Optimizing resume nodes...</span>
                  <svg className="animate-spin h-3.5 w-3.5 text-amber-500 ml-1.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="w-full">
              {agentFinished ? (
                <div className="flex flex-col gap-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-center text-[10px] text-emerald-400 font-sans font-bold flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4" />
                    </svg>
                    Resume Tailored for {activeAgentJob.company}!
                  </div>
                  <button
                    onClick={closeAgentModal}
                    className="w-full py-3.5 rounded-xl bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all shadow-md"
                  >
                    Close Log
                  </button>
                </div>
              ) : (
                <button
                  disabled={true}
                  className="w-full py-3.5 rounded-xl bg-neutral-900 border border-white/5 text-gray-500 text-xs font-bold uppercase tracking-wider cursor-not-allowed"
                >
                  Agent Processing...
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer showCTA={false} />
    </div>
  )
}
