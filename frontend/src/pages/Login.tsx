import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const validate = () => {
    const tempErrors: Record<string, string> = {}
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setServerError('')
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setServerError('')
    setSuccessMsg('')

    try {
      await login(formData.email, formData.password)
      setSuccessMsg('Logged in successfully! Redirecting to Dashboard...')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Login failed. Please check your credentials.'
      setServerError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 flex flex-col justify-center items-center relative overflow-hidden font-display px-6 py-6">
      {/* Background glow animations */}
      <div className="absolute top-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-purple-900/20 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[100px] pointer-events-none"></div>

      {/* Brand Header */}
      <div className="mb-4 z-10 flex flex-col items-center">
        <Link to="/" className="flex items-center gap-3 mb-1 hover:opacity-85 transition-opacity">
          <div className="w-3 h-6 bg-amber-500 rounded-sm"></div>
          <span className="font-display font-black text-xl tracking-wider uppercase text-white">
            NAVIGATOR AI
          </span>
        </Link>
        <p className="text-xs text-amber-400 font-sans font-bold tracking-widest uppercase">AUTOMATED INTERNSHIP PLATFORM</p>
      </div>

      {/* Login Card (Compact Height) */}
      <div className="w-full max-w-[440px] rounded-3xl border border-white/20 bg-neutral-900/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl z-10 relative">
        <h2 className="text-2xl md:text-3xl font-black text-white text-left mb-1">Welcome Back.</h2>
        <p className="text-sm text-gray-300 text-left font-sans mb-6 font-medium">Enter your credentials to access your dashboard.</p>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-sm font-sans text-left flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>{serverError}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-sm font-sans text-left flex items-center gap-2 animate-pulse">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-1 font-display">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. name@domain.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full bg-black/70 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all font-sans ${
                errors.email 
                  ? 'border-rose-500' 
                  : 'border-white/20 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30'
              }`}
            />
            {errors.email && (
              <p className="text-rose-400 text-xs font-sans mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password field with View Password Eye Toggle */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider font-display">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full bg-black/70 border rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all font-sans ${
                  errors.password 
                    ? 'border-rose-500' 
                    : 'border-white/20 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-400 p-1 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.88 9.88a3 3 0 104.24 4.24m-4.24-4.24L3 3m18 18l-4.13-4.13m2.255-3.87A18.45 18.45 0 0023 11s-4 8-11 8a9.95 9.95 0 01-4.82-1.23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-rose-400 text-xs font-sans mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-base uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg mt-4 flex items-center justify-center gap-2 ${
              isLoading ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Toggle link */}
        <p className="text-center text-sm text-gray-300 font-sans mt-4 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-amber-400 hover:text-amber-300 transition-colors underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Back to Home Link */}
      <Link to="/" className="text-sm text-gray-300 hover:text-white transition-colors mt-4 font-sans flex items-center gap-2 z-10 font-semibold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to homepage
      </Link>
    </div>
  )
}
