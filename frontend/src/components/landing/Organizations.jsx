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
    <section className="relative py-10 border-t border-b border-white/5 bg-[#030303]/60 backdrop-blur-md overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left shrink-0">
          <span className="text-xs md:text-sm font-display text-amber-500 uppercase tracking-wider font-extrabold block mb-1">
            PARTICIPATING INSTITUTIONS
          </span>
          <p className="text-xs text-gray-400 font-medium">
            Helping students from Pakistan's top schools land premier roles.
          </p>
        </div>

        {/* Rolling/Grid style list of Orgs */}
        <div className="w-full md:w-auto flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
          {organizations.map((org, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 group cursor-default transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 group-hover:bg-amber-500 transition-colors"></span>
              <span className="text-xs font-display font-semibold text-gray-500 group-hover:text-gray-200 transition-colors tracking-wide">
                {org.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
