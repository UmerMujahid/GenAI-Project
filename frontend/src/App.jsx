import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HybridLandingPage from './components/HybridLandingPage'
import AboutUs from './pages/AboutUs'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#030303]">
        <Routes>
          <Route path="/" element={<HybridLandingPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


