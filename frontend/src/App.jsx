import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HybridLandingPage from './components/HybridLandingPage'
import AboutUs from './pages/AboutUs'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import ResumeUploadPage from './pages/ResumeUploadPage'
import PreferencesPage from './pages/PreferencesPage'
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#030303]">
        <Routes>
          <Route path="/" element={<HybridLandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume-upload" element={<ResumeUploadPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App



