import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleScrollLink = (e, targetId) => {
    e.preventDefault()
    if (location.pathname === '/') {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/')
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/70 backdrop-blur-xl border-b border-white/15 py-4 px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-2.5 h-5 bg-amber-500 rounded-sm"></div>
          <span className="font-display font-black text-sm tracking-wider uppercase text-white">
            NAVIGATOR AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-300 uppercase tracking-widest">
          <a 
            href="#hero" 
            onClick={(e) => handleScrollLink(e, 'hero')} 
            className="hover:text-amber-400 transition-colors"
          >
            Overview
          </a>
          <a 
            href="#agents" 
            onClick={(e) => handleScrollLink(e, 'agents')} 
            className="hover:text-amber-400 transition-colors"
          >
            Agents
          </a>
          <a 
            href="#works" 
            onClick={(e) => handleScrollLink(e, 'works')} 
            className="hover:text-amber-400 transition-colors"
          >
            How it works
          </a>
          <a 
            href="#insights" 
            onClick={(e) => handleScrollLink(e, 'insights')} 
            className="hover:text-amber-400 transition-colors"
          >
            Insights
          </a>
          <Link 
            to="/about" 
            className={`hover:text-amber-400 transition-colors ${
              location.pathname === '/about' ? 'text-amber-500' : ''
            }`}
          >
            About & Contact
          </Link>
          <Link 
            to="/dashboard" 
            className={`hover:text-amber-400 transition-colors ${
              location.pathname === '/dashboard' ? 'text-amber-500' : ''
            }`}
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            to="/login" 
            className="px-4 py-2 rounded text-sm font-bold tracking-wider uppercase border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-gray-300"
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="px-4 py-2 rounded text-sm font-bold tracking-wider uppercase bg-white text-black hover:bg-neutral-200 transition-all shadow-md"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  )
}
