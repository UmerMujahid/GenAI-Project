import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const validate = () => {
    const tempErrors = {}
    if (!formData.email) {
      tempErrors.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid.'
    }
    
    if (!formData.password) {
      tempErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear field error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setSuccessMsg('')

    // Simulating API response
    setTimeout(() => {
      setIsLoading(false)
      console.log('Login Payload Submitted:', formData)
      setSuccessMsg('Logged in successfully! Redirecting...')
      
      // Simulated redirect to dashboard
      setTimeout(() => {
        navigate('/')
      }, 1500)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col justify-center items-center relative overflow-hidden font-display px-6 py-12">
      {/* Background glow animations */}
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-amber-500/5 to-purple-500/5 blur-[150px] pointer-events-none"></div>

      {/* Floating Navigator Brand Header */}
      <div className="mb-8 z-10 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-2.5 mb-2 hover:opacity-85 transition-opacity">
          <div className="w-2.5 h-5 bg-amber-500 rounded-sm"></div>
          <span className="font-display font-black text-sm tracking-wider uppercase text-white">
            NAVIGATOR AI
          </span>
        </Link>
        <p className="text-[10px] text-gray-500 font-sans tracking-widest uppercase">AUTOMATED INTERNSHIP PLATFORM</p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl ring-1 ring-white/5 z-10 relative">
        <h2 className="text-2xl md:text-3xl font-black text-white text-left mb-2">Welcome Back.</h2>
        <p className="text-xs text-gray-400 text-left font-sans mb-8">Enter your credentials to access your dashboard.</p>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-sans text-left flex items-center gap-2 animate-pulse">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email field */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 font-display">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. name@domain.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans ${
                errors.email 
                  ? 'border-rose-500/50 focus:border-rose-500' 
                  : 'border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
              }`}
            />
            {errors.email && (
              <p className="text-rose-400 text-[10px] font-sans mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">
                Password
              </label>
              <a href="#" className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest font-display">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans ${
                errors.password 
                  ? 'border-rose-500/50 focus:border-rose-500' 
                  : 'border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
              }`}
            />
            {errors.password && (
              <p className="text-rose-400 text-[10px] font-sans mt-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all shadow-md mt-8 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-8 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <span className="relative px-3 bg-neutral-950 text-[10px] font-bold text-gray-500 uppercase tracking-widest font-display">OR</span>
        </div>

        {/* Social logins */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl py-3 text-xs font-bold font-sans text-gray-300 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.86 0 3.55.72 4.86 1.91l2.45-2.45C17.99 1.96 15.29 1 12.24 1 6.72 1 2.24 5.48 2.24 11s4.48 10 10 10c5.77 0 9.63-4.06 9.63-9.8 0-.665-.08-1.3-.23-1.915H12.24z"/>
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl py-3 text-xs font-bold font-sans text-gray-300 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Toggle link */}
        <p className="text-center text-xs text-gray-500 font-sans mt-10">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-amber-500 hover:text-amber-400 transition-colors">
            Sign up
          </Link>
        </p>
      </div>

      {/* Back to Home Link */}
      <Link to="/" className="text-xs text-gray-500 hover:text-white transition-colors mt-8 font-sans flex items-center gap-1.5 z-10">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to homepage
      </Link>
    </div>
  )
}
