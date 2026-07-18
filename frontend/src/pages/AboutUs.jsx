import React from 'react'
import Navbar from '../components/layout/Navbar'
import Testimonials from '../components/landing/Testimonials'
import Footer from '../components/landing/Footer'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col font-display">
      <Navbar />

      {/* About Us Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden z-10">
        {/* Glow overlay */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-gradient-to-r from-amber-500/10 to-purple-500/10 blur-[130px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs md:text-sm font-display font-black text-amber-500 uppercase tracking-widest block mb-4">
            OUR MISSION
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-8">
            Empowering tech students to navigate their careers.
          </h1>
          <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans mb-10">
            Navigator AI is a specialized multi-agent job intelligence system designed specifically for tech candidates in Pakistan. We automate the discovery, evaluation, and application workflows, helping students from top universities like FAST-NUCES, NUST, and LUMS connect with leading tech companies.
          </p>

          {/* Quick stats / highlights */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 text-left">
            <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm">
              <span className="text-3xl font-black text-white block mb-1">98%</span>
              <span className="text-xs text-gray-500 font-sans">Match Score Accuracy</span>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm">
              <span className="text-3xl font-black text-white block mb-1">10x</span>
              <span className="text-xs text-gray-500 font-sans">Search Speed Multiplier</span>
            </div>
            <div className="col-span-2 md:col-span-1 p-6 rounded-2xl border border-white/5 bg-neutral-900/40 backdrop-blur-sm">
              <span className="text-3xl font-black text-white block mb-1">100%</span>
              <span className="text-xs text-gray-500 font-sans">Student-First Automation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Contact Us Section */}
      <section className="relative py-24 bg-[#030303] border-t border-white/5 overflow-hidden z-10">
        <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-900/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-purple-900/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs md:text-sm font-display font-black text-amber-500 uppercase tracking-wider block mb-4">
              CONTACT US
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Get in touch with us.
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto mt-4 font-sans leading-relaxed">
              Have questions about how the multi-agent system works or want to partner with us? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Email Contact Card */}
            <div className="group relative p-8 rounded-3xl border border-white/10 bg-neutral-900/30 backdrop-blur-md hover:border-amber-500/30 transition-all duration-500 flex flex-col justify-between items-start overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent blur-md group-hover:scale-125 transition-transform duration-500"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Email Address</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                  Send us a mail and our team will get back to you within 24 hours.
                </p>
                <a 
                  href="mailto:umermujahid4738@gmail.com" 
                  className="text-sm font-semibold text-amber-400 hover:text-amber-300 font-mono tracking-wide break-all"
                >
                  umermujahid4738@gmail.com
                </a>
              </div>

              <a 
                href="mailto:umermujahid4738@gmail.com"
                className="w-full text-center py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-amber-500/35 text-xs font-bold uppercase tracking-wider text-white transition-all font-sans"
              >
                Send Email
              </a>
            </div>

            {/* Phone Contact Card */}
            <div className="group relative p-8 rounded-3xl border border-white/10 bg-neutral-900/30 backdrop-blur-md hover:border-purple-500/30 transition-all duration-500 flex flex-col justify-between items-start overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent blur-md group-hover:scale-125 transition-transform duration-500"></div>

              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>

              <div className="text-left mb-8">
                <h3 className="text-xl font-bold text-white mb-2">Phone Number</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                  Feel free to call us directly for any urgent inquiries or direct partnerships.
                </p>
                <a 
                  href="tel:+923336724862" 
                  className="text-sm font-semibold text-purple-400 hover:text-purple-300 font-mono tracking-wide"
                >
                  +92-333-6724862
                </a>
              </div>

              <a 
                href="tel:+923336724862"
                className="w-full text-center py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-purple-500/35 text-xs font-bold uppercase tracking-wider text-white transition-all font-sans"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
