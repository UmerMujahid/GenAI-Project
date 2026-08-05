import React from 'react'
import Navbar from '../components/layout/Navbar'
import Testimonials from '../components/landing/Testimonials'
import Footer from '../components/landing/Footer'

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 flex flex-col font-display">
      <Navbar />

      {/* About Us Hero Section */}
      <section className="relative pt-28 pb-16 overflow-hidden z-10 bg-[#0d0e12]">
        {/* Glow overlay */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 blur-[140px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs md:text-sm font-display font-black text-amber-400 uppercase tracking-widest block mb-3">
            OUR MISSION
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6">
            Empowering tech students to navigate their careers.
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed font-display mb-10 font-medium">
            Navigator AI is a specialized multi-agent job intelligence system designed specifically for tech candidates in Pakistan. We automate the discovery, evaluation, and application workflows, helping students from top universities like FAST-NUCES, NUST, and LUMS connect with leading tech companies.
          </p>

          {/* Quick stats / highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-10 text-left">
            <div className="p-6 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl">
              <span className="text-3xl font-black text-amber-400 block mb-1">98%</span>
              <span className="text-sm text-gray-200 font-bold font-sans">Match Score Accuracy</span>
            </div>
            <div className="p-6 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl">
              <span className="text-3xl font-black text-purple-400 block mb-1">10x</span>
              <span className="text-sm text-gray-200 font-bold font-sans">Search Speed Multiplier</span>
            </div>
            <div className="p-6 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl">
              <span className="text-3xl font-black text-emerald-400 block mb-1">100%</span>
              <span className="text-sm text-gray-200 font-bold font-sans">Student-First Automation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Contact Us Section */}
      <section className="relative py-14 md:py-16 bg-[#0d0e12] border-t border-white/20 overflow-hidden z-10">
        <div className="absolute top-[30%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs md:text-sm font-display font-black text-amber-400 uppercase tracking-widest block mb-2">
              CONTACT US
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white">
              Get in touch with us.
            </h2>
            <p className="text-xs md:text-sm text-gray-200 max-w-md mx-auto mt-3 font-display leading-relaxed font-medium">
              Have questions about how the multi-agent system works or want to partner with us? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Email Contact Card */}
            <div className="group relative p-6 rounded-3xl border border-white/20 bg-neutral-900/90 backdrop-blur-xl hover:border-amber-500/50 shadow-2xl transition-all duration-300 flex flex-col justify-between items-start overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-5 border border-amber-500/30">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="text-left mb-6">
                <h3 className="text-xl font-bold text-white mb-1.5">Email Address</h3>
                <p className="text-xs md:text-sm text-gray-200 font-display leading-relaxed mb-3 font-medium">
                  Send us an email and our team will get back to you within 24 hours.
                </p>
                <a 
                  href="mailto:umermujahid4738@gmail.com" 
                  className="text-sm font-bold text-amber-400 hover:text-amber-300 font-mono tracking-wide break-all"
                >
                  umermujahid4738@gmail.com
                </a>
              </div>

              <a 
                href="mailto:umermujahid4738@gmail.com"
                className="w-full text-center py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider text-white transition-all font-sans"
              >
                Send Email
              </a>
            </div>

            {/* Phone Contact Card */}
            <div className="group relative p-6 rounded-3xl border border-white/20 bg-neutral-900/90 backdrop-blur-xl hover:border-purple-500/50 shadow-2xl transition-all duration-300 flex flex-col justify-between items-start overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-5 border border-purple-500/30">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>

              <div className="text-left mb-6">
                <h3 className="text-xl font-bold text-white mb-1.5">Phone Number</h3>
                <p className="text-xs md:text-sm text-gray-200 font-display leading-relaxed mb-3 font-medium">
                  Feel free to call us directly for any urgent inquiries or direct partnerships.
                </p>
                <a 
                  href="tel:+923336724862" 
                  className="text-sm font-bold text-purple-400 hover:text-purple-300 font-mono tracking-wide"
                >
                  +92-333-6724862
                </a>
              </div>

              <a 
                href="tel:+923336724862"
                className="w-full text-center py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider text-white transition-all font-sans"
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
