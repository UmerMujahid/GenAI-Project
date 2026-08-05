import React from 'react'
import { Card, CardContent } from '../ui/Card'

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Searching for internships across four platforms took me hours every day. Navigator automated everything. The resume match score let me focus only on jobs I had a high chance of landing.",
      name: "Ali Ahmed",
      university: "FAST-NUCES (Lahore)",
      role: "Software Engineering Intern at Systems Ltd"
    },
    {
      quote: "The resume tailoring agent is pure magic. It auto-focused my React projects for frontend roles and my database projects for backend roles. Got my interview at Stripe in days.",
      name: "Fatima Khan",
      university: "NUST (Islamabad)",
      role: "Product Engineering Intern at Stripe"
    },
    {
      quote: "The application tracker saved me from maintaining my messy Excel sheets. I loved how the cover letter agent generated unique letters based on actual job requirements.",
      name: "Zainab Malik",
      university: "LUMS (Lahore)",
      role: "AI Research Intern at Arbisoft"
    }
  ]

  return (
    <section id="testimonials" className="relative py-14 md:py-16 bg-[#0d0e12] border-b border-white/20 overflow-hidden z-10">
      {/* Background glow overlay */}
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/20 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs md:text-sm font-display font-black text-amber-400 uppercase tracking-widest block mb-2">
            TESTIMONIALS
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-black text-white">
            What our users say.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card 
              key={idx} 
              className="border border-white/20 bg-neutral-900/90 hover:border-amber-500/50 shadow-2xl flex flex-col justify-between p-6 transition-all duration-300"
            >
              <CardContent className="p-0 text-left">
                <span className="text-4xl font-serif text-amber-500/30 block leading-none select-none mb-1">“</span>
                <p className="text-xs md:text-sm text-gray-200 leading-relaxed font-display font-medium">
                  {t.quote}
                </p>
              </CardContent>

              {/* Author Footer */}
              <div className="border-t border-white/10 pt-4 mt-5 text-left flex flex-col gap-0.5">
                <span className="text-sm font-display font-black text-white">
                  {t.name}
                </span>
                <span className="text-[11px] font-display font-black text-amber-400 uppercase tracking-wider">
                  {t.role}
                </span>
                <span className="text-[11px] text-gray-300 font-sans font-semibold">
                  {t.university}
                </span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
