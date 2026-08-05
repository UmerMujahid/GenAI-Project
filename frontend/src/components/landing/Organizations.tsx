import React from 'react'

export default function Organizations() {
  const organizations = [
    { name: 'FAST-NUCES', type: 'University' },
    { name: 'NUST', type: 'University' },
    { name: 'LUMS', type: 'University' },
    { name: 'GIKI', type: 'University' },
    { name: 'UET Lahore', type: 'University' },
    { name: 'Systems Ltd', type: 'Tech Partner' },
    { name: 'Devsinc', type: 'Tech Partner' },
    { name: 'Arbisoft', type: 'Tech Partner' }
  ]

  return (
    <section className="relative py-8 md:py-10 border-t border-b border-white/20 bg-[#0e0f14]/90 backdrop-blur-xl overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left shrink-0 max-w-md">
          <span className="text-xs md:text-sm font-display text-amber-400 uppercase tracking-widest font-black block mb-1">
            PARTICIPATING INSTITUTIONS
          </span>
          <p className="text-sm md:text-base text-gray-200 font-semibold">
            Helping students from Pakistan's top schools land premier roles.
          </p>
        </div>

        {/* Centered multi-row list of Orgs */}
        <div className="w-full flex-1 flex flex-wrap justify-center items-center gap-x-3 gap-y-2.5">
          {organizations.map((org, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 group cursor-default transition-all duration-300 px-3.5 py-1.5 rounded-xl border border-white/20 bg-neutral-900/90 shadow-md hover:border-amber-400/60"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-xs md:text-sm font-display font-bold text-gray-100 group-hover:text-white transition-colors tracking-wide">
                {org.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
