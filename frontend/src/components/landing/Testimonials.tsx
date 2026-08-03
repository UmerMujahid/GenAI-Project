import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card'

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
    <section id="testimonials" className="relative py-24 bg-[#030303] border-b border-white/5 overflow-hidden z-10">
      {/* Background glow overlay */}
      <div className="absolute bottom-[20%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs md:text-sm font-display font-black text-amber-500 uppercase tracking-wider block mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white">
            What our users say.
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card 
              key={idx} 
              className="hover:border-amber-500/35 hover:shadow-[0_0_25px_rgba(245,158,11,0.06)] bg-neutral-900/60 border-white/20 flex flex-col justify-between p-6 transition-all duration-500 ring-1 ring-white/5"
            >
              <CardContent className="p-0 text-left">
                {/* Quotes symbol */}
                <span className="text-4xl font-serif text-amber-500/25 block leading-none select-none mb-1">“</span>
                <p className="text-xs text-gray-300 leading-relaxed font-sans -mt-2">
                  {t.quote}
                </p>
              </CardContent>

              {/* Author Footer */}
              <div className="border-t border-white/10 pt-5 mt-6 text-left flex flex-col gap-1">
                <span className="text-xs font-display font-extrabold text-white">
                  {t.name}
                </span>
                <span className="text-xs font-display font-black text-amber-500 uppercase tracking-wider">
                  {t.role}
                </span>
                <span className="text-[9px] text-gray-500 font-sans font-medium">
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
