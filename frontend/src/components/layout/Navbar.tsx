import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    if (location.pathname === '/') {
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-xl border-b border-white/20 py-4 px-6 transition-all duration-300 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-3 h-6 bg-amber-500 rounded-sm"></div>
          <span className="font-display font-black text-xl tracking-wider uppercase text-white">
            NAVIGATOR AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-base font-bold text-gray-200 font-display">
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
            How It Works
          </a>
          <Link 
            to="/about" 
            className={`hover:text-amber-400 transition-colors ${
              location.pathname === '/about' ? 'text-amber-400' : ''
            }`}
          >
            About & Contact
          </Link>
          {user && (
            <Link 
              to="/dashboard" 
              className={`hover:text-amber-400 transition-colors ${
                location.pathname === '/dashboard' ? 'text-amber-400' : ''
              }`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl text-base font-bold bg-amber-500 hover:bg-amber-400 text-black transition-all shadow-lg flex items-center gap-2"
            >
              <span>Dashboard ({user.full_name.split(' ')[0]})</span>
            </Link>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-5 py-2.5 rounded-xl text-base font-bold border border-white/20 hover:border-amber-400 hover:bg-white/5 transition-all text-white"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="px-5 py-2.5 rounded-xl text-base font-bold bg-white text-black hover:bg-neutral-200 transition-all shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
