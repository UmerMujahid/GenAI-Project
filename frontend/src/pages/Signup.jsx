import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const validate = () => {
    const tempErrors = {}
    
    if (!formData.name.trim()) {
      tempErrors.name = 'Full name is required.'
    }
    
    if (!formData.email) {
      tempErrors.email = 'Email address is required.'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email address is invalid.'
    } else if (!formData.email.endsWith('.edu.pk')) {
      // Friendly warning/requirement for student domains
      tempErrors.email = 'Institutional email (.edu.pk) is recommended.'
    }
    
    if (!formData.password) {
      tempErrors.password = 'Password is required.'
    } else if (formData.password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.'
    }
    
    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.'
    }

    setErrors(tempErrors)
    // Only fail validation if there are critical errors (ignore the .edu.pk recommendation warning if they want to proceed, or let's make it a blocking validation for strictness. Let's make it blocking since it's an institutional platform)
    return Object.keys(tempErrors).length === 0 || (Object.keys(tempErrors).length === 1 && tempErrors.email === 'Institutional email (.edu.pk) is recommended.');
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
    
    // Custom check: if there is a warning about .edu.pk and they click submit again, we let them proceed.
    const isValid = validate()
    if (!isValid) return

    setIsLoading(true)
    setSuccessMsg('')

    // Simulating API registration
    setTimeout(() => {
      setIsLoading(false)
      console.log('Signup Payload Submitted:', formData)
      setSuccessMsg('Account created successfully! Redirecting to login...')
      
      setTimeout(() => {
        navigate('/login')
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

      {/* Signup Card */}
      <div className="w-full max-w-[440px] rounded-3xl border border-white/10 bg-neutral-950/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl ring-1 ring-white/5 z-10 relative">
        <h2 className="text-2xl md:text-3xl font-black text-white text-left mb-2">Create Account.</h2>
        <p className="text-xs text-gray-400 text-left font-sans mb-8">Join top students finding elite internships.</p>

        {successMsg && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-sans text-left flex items-center gap-2 animate-pulse">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Full Name field */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-display">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Ali Ahmed"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans ${
                errors.name 
                  ? 'border-rose-500/50 focus:border-rose-500' 
                  : 'border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
              }`}
            />
            {errors.name && (
              <p className="text-rose-400 text-[10px] font-sans mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {errors.name}
              </p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-display">
              Institutional Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. name@nu.edu.pk"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans ${
                errors.email
                  ? errors.email.includes('recommended')
                    ? 'border-amber-500/40 focus:border-amber-500'
                    : 'border-rose-500/50 focus:border-rose-500'
                  : 'border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
              }`}
            />
            {errors.email && (
              <p className={`text-[10px] font-sans mt-1 flex items-center gap-1 ${
                errors.email.includes('recommended') ? 'text-amber-400' : 'text-rose-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  errors.email.includes('recommended') ? 'bg-amber-400' : 'bg-rose-500'
                }`}></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-display">
              Password
            </label>
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
              <p className="text-rose-400 text-[10px] font-sans mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password field */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 font-display">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full bg-black/60 border rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none transition-all font-sans ${
                errors.confirmPassword 
                  ? 'border-rose-500/50 focus:border-rose-500' 
                  : 'border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-rose-400 text-[10px] font-sans mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-white hover:bg-neutral-200 transition-all shadow-md mt-6 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <p className="text-center text-xs text-gray-500 font-sans mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-amber-500 hover:text-amber-400 transition-colors">
            Log in
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
