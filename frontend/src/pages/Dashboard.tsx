import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  uploadResumeApi,
  getLatestResumeApi,
  getInternshipsApi,
  discoverJobsApi,
  getMatchedJobsApi,
  ResumeData,
  MatchedJobData,
} from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"dashboard" | "jobs" | "resume" | "settings" | "applications">("dashboard");
  const [selectedSource, setSelectedSource] = useState("all");
  const [matchThreshold, setMatchThreshold] = useState(0);

  // Resume Upload & Parser States
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parseStep, setParseStep] = useState<string>("");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Agent 2 Matched Jobs Data
  const [matchedJobs, setMatchedJobs] = useState<MatchedJobData[]>([]);
  const [discoveringJobs, setDiscoveringJobs] = useState(false);
  const [discoveryError, setDiscoveryError] = useState("");
  const [discoverySuccess, setDiscoverySuccess] = useState("");

  // Scraped Internships Data (Fallback)
  const [internships, setInternships] = useState<any[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(false);

  // User Profile Menu Dropdown State
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadResume(user.id);
      loadMatchedJobs(user.id);
      loadInternships();
    }
  }, [user]);

  const loadMatchedJobs = async (userId: string) => {
    try {
      const res = await getMatchedJobsApi(userId);
      if (res && res.length > 0) {
        setMatchedJobs(res);
      }
    } catch (err) {
      console.error("Failed to load matched jobs:", err);
    }
  };

  const handleDiscoverJobs = async () => {
    if (!user?.id) return;
    if (!resumeData) {
      setDiscoveryError("Please upload a resume first so Agent 2 can match jobs against your profile!");
      return;
    }

    setDiscoveringJobs(true);
    setDiscoveryError("");
    setDiscoverySuccess("");

    try {
      const jobs = await discoverJobsApi(user.id);
      setMatchedJobs(jobs);
      if (jobs.length > 0) {
        setDiscoverySuccess(`Agent 2 discovered ${jobs.length} jobs matched to your resume!`);
      } else {
        setDiscoveryError("No jobs found matching your criteria. Try updating your resume skills.");
      }
    } catch (err: any) {
      setDiscoveryError(err.response?.data?.detail || "Job discovery failed. Check server connection.");
    } finally {
      setDiscoveringJobs(false);
    }
  };

  const loadResume = async (userId: string) => {
    try {
      const res = await getLatestResumeApi(userId);
      if (res) {
        setResumeData(res);
      }
    } catch (err) {
      console.error("Failed to load user resume:", err);
    }
  };

  const loadInternships = async () => {
    setLoadingInternships(true);
    try {
      const data = await getInternshipsApi(selectedSource);
      setInternships(data);
    } catch (err) {
      console.error("Failed to fetch internships:", err);
      // Fallback mock data if backend scrapers are pending seed
      setInternships([
        {
          id: "1",
          title: "Generative AI & LLM Engineering Intern",
          company: "Systems Limited",
          location: "Lahore, Pakistan (Hybrid)",
          skills_required: ["Python", "FastAPI", "LangChain", "PyTorch", "MongoDB"],
          source_platform: "LinkedIn",
          application_link: "https://linkedin.com",
          match_score: 92,
          deadline: "10 Aug 2026",
          description: "Develop cutting-edge agentic workflows and local RAG models for enterprise automation.",
        },
        {
          id: "2",
          title: "Full-Stack React & Node.js Intern",
          company: "Contour Software",
          location: "Karachi, Pakistan (On-site)",
          skills_required: ["React", "TypeScript", "Node.js", "Tailwind CSS", "REST API"],
          source_platform: "Rozee.pk",
          application_link: "https://rozee.pk",
          match_score: 88,
          deadline: "15 Aug 2026",
          description: "Build high-performance web interfaces and integrate RESTful APIs with microservices.",
        },
        {
          id: "3",
          title: "Backend FastAPI & Cloud Intern",
          company: "10Pearls",
          location: "Islamabad, Pakistan (Remote)",
          skills_required: ["Python", "FastAPI", "PostgreSQL", "Docker", "Git"],
          source_platform: "Mustakbil",
          application_link: "https://mustakbil.com",
          match_score: 79,
          deadline: "18 Aug 2026",
          description: "Architect scalable backend endpoints, manage MongoDB/PostgreSQL schemas, and Dockerize microservices.",
        },
      ]);
    } finally {
      setLoadingInternships(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.name.endsWith(".pdf")) {
      setUploadError("Please upload a valid PDF document.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccessMsg("");

    const startTime = Date.now();
    const steps = [
      "1/4 Reading PDF & Initializing Agent Engine...",
      "2/4 Extracting Contact Info, Address & Summary...",
      "3/4 Structuring Technical Skills, Education & Experience...",
      "4/4 Finalizing Component Verification & Syncing Profile..."
    ];

    let currentStepIndex = 0;
    setParseStep(steps[0]);

    const interval = setInterval(() => {
      currentStepIndex = (currentStepIndex + 1) % steps.length;
      setParseStep(steps[currentStepIndex]);
    }, 750);

    try {
      const parsed = await uploadResumeApi(user.id, file);

      // Ensure loader runs for AT LEAST 3.0 seconds (3000ms) for smooth user experience
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      setResumeData(parsed);
      setUploadSuccessMsg(`Resume "${file.name}" parsed & loaded successfully via ${parsed.parser_mode || "Agent"}!`);
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || "Failed to upload and parse resume.");
    } finally {
      clearInterval(interval);
      setUploading(false);
      setParseStep("");
    }
  };

  const filteredInternships = internships.filter((item) => {
    const score = item.match_score || 85;
    const matchesScore = score >= matchThreshold;
    const matchesSource =
      selectedSource === "all" ||
      item.source_platform?.toLowerCase() === selectedSource.toLowerCase();
    return matchesScore && matchesSource;
  });

  return (
    <div className="min-h-screen bg-[#0d0e12] text-gray-100 font-sans flex flex-col selection:bg-purple-500 selection:text-white">
      {/* ── TOP HORIZONTAL HEADER / NAVIGATION BAR ── */}
      <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-xl border-b border-white/15 px-6 py-3.5 flex items-center justify-between shadow-2xl">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-display font-black text-lg tracking-wide text-white">
              Navigator<span className="text-amber-500">AI</span>
            </span>
          </Link>
        </div>

        {/* Center: Horizontal Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-neutral-900/90 border border-white/15 p-1 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all duration-200 flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "bg-neutral-800 text-white border border-white/20 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all duration-200 flex items-center gap-2 ${
              activeTab === "resume"
                ? "bg-neutral-800 text-white border border-white/20 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume Parser
          </button>

          <button
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all duration-200 flex items-center gap-2 ${
              activeTab === "jobs"
                ? "bg-neutral-800 text-white border border-white/20 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Job Finder
          </button>

          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xs transition-all duration-200 flex items-center gap-2 ${
              activeTab === "applications"
                ? "bg-neutral-800 text-white border border-white/20 shadow-md"
                : "text-gray-400 hover:text-white hover:bg-neutral-800/50"
            }`}
          >
            <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Applications
          </button>
        </nav>

        {/* Right: Quick Controls & User Profile */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 border border-white/20 bg-neutral-900 hover:bg-neutral-800 rounded-full py-1 px-2.5 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 font-bold text-white text-xs flex items-center justify-center shadow">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="font-display font-semibold text-xs text-white hidden sm:inline">
                {user?.full_name || "User Profile"}
              </span>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-52 bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-2xl">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-xs font-bold text-white">{user?.full_name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mt-1 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN DASHBOARD VIEW CONTENT ── */}
      <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Page Title & Context Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
              {activeTab === "dashboard" && "Candidate Dashboard"}
              {activeTab === "jobs" && "Job Finder & Matcher (Agent 2)"}
              {activeTab === "resume" && "Resume Parser & Extractor"}
              {activeTab === "applications" && "Application Tracker Pipeline"}
            </h1>
            <p className="text-sm text-gray-300 font-sans mt-0.5">
              {activeTab === "dashboard" && "Overview of your parsed resumes, active matches, and candidate profile."}
              {activeTab === "jobs" && "Discover real-time ATS jobs from Active Jobs DB scored against your resume."}
              {activeTab === "resume" && "Upload your PDF resume to extract structured skills, experience, and contact data."}
              {activeTab === "applications" && "Manage your internship applications from Applied to Interview & Offer stages."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("resume")}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload New Resume
            </button>
          </div>
        </div>

        {/* ── METRIC / KPI CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-display font-black text-white uppercase tracking-widest">DISCOVERED JOBS</p>
              <h3 className="text-2xl font-display font-black text-white mt-1">{matchedJobs.length}</h3>
              <p className="text-[11px] font-display font-bold text-emerald-400 mt-0.5">Active Jobs DB</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-display font-black text-white uppercase tracking-widest">AVG MATCH SCORE</p>
              <h3 className="text-2xl font-display font-black text-white mt-1">
                {matchedJobs.length > 0
                  ? `${Math.round(matchedJobs.reduce((acc, curr) => acc + curr.match_score, 0) / matchedJobs.length)}%`
                  : "N/A"}
              </h3>
              <p className="text-[11px] font-display font-bold text-amber-400 mt-0.5">Groq LLM Scored</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-display font-black text-white uppercase tracking-widest">RESUME STATUS</p>
              <h3 className="text-2xl font-display font-black text-white mt-1">{resumeData ? "Parsed" : "Pending"}</h3>
              <p className="text-[11px] font-display font-bold text-gray-300 mt-0.5 truncate max-w-[120px]">{resumeData?.filename || "No PDF uploaded"}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-display font-black text-white uppercase tracking-widest">HIGH FIT MATCHES</p>
              <h3 className="text-2xl font-display font-black text-white mt-1">
                {matchedJobs.filter((j) => j.match_score >= 70).length}
              </h3>
              <p className="text-[11px] font-display font-bold text-purple-400 mt-0.5">Score &gt;= 70%</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── TAB 1: CANDIDATE DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Parsed Resumes Summary Card */}
            <div className="p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white font-display">Parsed Resume Profile</h2>
                    <p className="text-xs text-gray-400">Candidate structured profile parsed by Agent 1</p>
                  </div>
                </div>
                {resumeData && (
                  <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {resumeData.parser_mode || "LLM Agent"}
                  </span>
                )}
              </div>

              {resumeData ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Candidate Contact</p>
                    <p className="text-sm font-bold text-white">{resumeData.contact_info?.name || user?.full_name}</p>
                    <p className="text-xs text-amber-400">{resumeData.contact_info?.email || user?.email}</p>
                    <p className="text-xs text-gray-300">{resumeData.contact_info?.phone || "No phone"}</p>
                    <p className="text-xs text-gray-400">{resumeData.contact_info?.location || "Pakistan"}</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parsed Skills ({resumeData.skills?.length || 0})</p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {resumeData.skills?.map((skill, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-white/20 rounded-2xl space-y-3">
                  <p className="text-sm text-gray-300">No parsed resume found yet.</p>
                  <button
                    onClick={() => setActiveTab("resume")}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all"
                  >
                    Upload Resume Now ↗
                  </button>
                </div>
              )}
            </div>

            {/* Table of Scraped / Discovered Jobs for User */}
            <div className="p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-black text-white font-display">Scraped & Discovered Jobs ({matchedJobs.length})</h2>
                  <p className="text-xs text-gray-400">All jobs saved in your database profile</p>
                </div>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
                >
                  Go to Job Finder ↗
                </button>
              </div>

              {matchedJobs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 font-display uppercase tracking-wider">
                        <th className="py-3 px-3">Job Title</th>
                        <th className="py-3 px-3">Company</th>
                        <th className="py-3 px-3">Fit Score</th>
                        <th className="py-3 px-3">Work Mode</th>
                        <th className="py-3 px-3">Salary</th>
                        <th className="py-3 px-3">Source</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {matchedJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-white max-w-[200px] truncate">{job.title}</td>
                          <td className="py-3.5 px-3 text-amber-400 font-semibold">{job.organization}</td>
                          <td className="py-3.5 px-3 font-black">
                            <span
                              className={`px-2.5 py-1 rounded-lg border text-[11px] ${
                                job.match_score >= 70
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : job.match_score >= 40
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                  : "bg-rose-500/20 text-rose-400 border-rose-500/30"
                              }`}
                            >
                              {job.match_score}%
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-gray-300">{job.work_arrangement || "Remote"}</td>
                          <td className="py-3.5 px-3 text-emerald-400 font-semibold">
                            {job.salary_min ? `${job.salary_currency || "$"}${job.salary_min.toLocaleString()}` : "Undisclosed"}
                          </td>
                          <td className="py-3.5 px-3 text-purple-300 font-semibold">{job.source_platform}</td>
                          <td className="py-3.5 px-3 text-right">
                            {job.apply_url ? (
                              <a
                                href={job.apply_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all inline-block"
                              >
                                Apply ↗
                              </a>
                            ) : (
                              <span className="text-gray-500">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl space-y-2">
                  <p className="text-xs text-gray-400">No jobs scraped/discovered yet.</p>
                  <p className="text-xs text-gray-500">Go to Job Finder tab to run Agent 2 Job Matcher!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: JOB FINDER & MATCHER (AGENT 2) ── */}
        {activeTab === "jobs" && (
          <div className="space-y-6">
            {/* Agent 2 Trigger Banner */}
            <div className="p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-neutral-900 to-purple-500/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black">
                    Agent 2 Ready
                  </span>
                  <span className="text-xs font-bold text-gray-400">Active Jobs DB (ATS Jobs)</span>
                </div>
                <h2 className="text-xl font-black text-white tracking-tight font-display">
                  Find Jobs Matched to Your Resume
                </h2>
                <p className="text-xs text-gray-300">
                  Agent 2 searches open job APIs, compares requirements against your parsed resume skills, and generates fit scores.
                </p>
              </div>

              <button
                onClick={handleDiscoverJobs}
                disabled={discoveringJobs}
                className="w-full md:w-auto px-6 py-3.5 rounded-2xl font-display font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 shrink-0"
              >
                {discoveringJobs ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-black" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Discovering Jobs with Agent 2...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Run Agent 2 Job Matcher</span>
                  </>
                )}
              </button>
            </div>

            {/* Notification Messages */}
            {discoveryError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {discoveryError}
              </div>
            )}
            {discoverySuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {discoverySuccess}
              </div>
            )}

            {/* Filter Dock Bar */}
            <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto">
                <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider">Source:</span>
                {["all", "Active Jobs DB", "JSearch", "Remotive"].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedSource(platform)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize border ${
                      selectedSource === platform
                        ? "bg-amber-500 text-black border-amber-400 shadow-md"
                        : "bg-black/60 text-gray-300 border-white/15 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider">Match Score:</span>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={matchThreshold}
                  onChange={(e) => setMatchThreshold(Number(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
                <span className="text-sm font-extrabold text-amber-400 min-w-[40px]">{matchThreshold}%+</span>
              </div>
            </div>

            {/* Executive Modern Job Cards Grid (2-Column Desktop Grid) */}
            {matchedJobs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {matchedJobs
                  .filter((job) => job.match_score >= matchThreshold && (selectedSource === "all" || job.source_platform === selectedSource))
                  .map((job) => (
                    <div
                      key={job.id}
                      className="p-6 sm:p-7 rounded-3xl border border-white/20 bg-gradient-to-b from-neutral-900/95 to-neutral-950/95 shadow-2xl backdrop-blur-2xl hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-5"
                    >
                      <div className="space-y-4">
                        {/* Top Metadata & Score Header */}
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-xl text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                              {job.source_platform || "Active Jobs DB"}
                            </span>
                            {job.employment_type?.map((emp, i) => (
                              <span key={i} className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/10 text-gray-200 border border-white/15">
                                {emp}
                              </span>
                            ))}
                          </div>

                          <span
                            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-black border shrink-0 ${
                              job.match_score >= 70
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/15 shadow-md"
                                : job.match_score >= 40
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/15 shadow-md"
                                : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                            }`}
                          >
                            {job.match_score}% Fit Match
                          </span>
                        </div>

                        {/* Title & Organization */}
                        <div className="space-y-1">
                          <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-tight tracking-tight">{job.title}</h3>
                          <div className="flex items-center gap-2.5">
                            <p className="text-sm sm:text-base font-extrabold text-amber-400">{job.organization}</p>
                            {job.organization_url && (
                              <a href={job.organization_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-gray-400 hover:text-white underline">
                                Website ↗
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Key Spec Badges (2x2 Grid) */}
                        <div className="grid grid-cols-2 gap-2.5 pt-1">
                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider font-display">Salary</p>
                            <p className="text-xs sm:text-sm font-black text-emerald-400 mt-0.5 truncate">
                              {job.salary_min || job.salary_max
                                ? `${job.salary_currency || "$"}${job.salary_min?.toLocaleString() || ""}${job.salary_max ? `-${job.salary_max.toLocaleString()}` : ""} / ${job.salary_unit || "yr"}`
                                : "Undisclosed"}
                            </p>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider font-display">Work Mode</p>
                            <p className="text-xs sm:text-sm font-bold text-purple-300 mt-0.5 truncate">
                              {job.work_arrangement || "Remote / Onsite"}
                            </p>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider font-display">Experience</p>
                            <p className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5 truncate">
                              {job.experience_level || "Entry Level"}
                            </p>
                          </div>

                          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider font-display">Visa Sponsor</p>
                            <p className={`text-xs sm:text-sm font-bold mt-0.5 ${job.visa_sponsorship ? "text-emerald-400" : "text-gray-400"}`}>
                              {job.visa_sponsorship ? "Available" : "Not Provided"}
                            </p>
                          </div>
                        </div>

                        {/* AI Fit Reasoning Callout Box */}
                        {job.reasoning && (
                          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                            <p className="text-xs font-black text-amber-400 flex items-center gap-1.5 font-display uppercase tracking-wider">
                              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              AI Agent Fit Reasoning:
                            </p>
                            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans font-medium">{job.reasoning}</p>
                          </div>
                        )}

                        {/* Matching Skills vs Missing Skills */}
                        <div className="space-y-2">
                          {job.matching_skills && job.matching_skills.length > 0 && (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-1.5">
                              <p className="text-[11px] font-black text-emerald-400 uppercase tracking-wider">✓ Matching Skills ({job.matching_skills.length}):</p>
                              <div className="flex flex-wrap gap-1.5">
                                {job.matching_skills.map((skill, idx) => (
                                  <span key={idx} className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {job.missing_skills && job.missing_skills.length > 0 && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 space-y-1.5">
                              <p className="text-[11px] font-black text-rose-400 uppercase tracking-wider">✗ Skill Gaps to Learn ({job.missing_skills.length}):</p>
                              <div className="flex flex-wrap gap-1.5">
                                {job.missing_skills.map((skill, idx) => (
                                  <span key={idx} className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Responsibilities */}
                        {job.core_responsibilities && (
                          <div className="space-y-1">
                            <p className="text-xs font-black text-white uppercase tracking-wider font-display">Core Responsibilities:</p>
                            <p className="text-xs sm:text-sm text-gray-300 line-clamp-3 leading-relaxed font-sans">{job.core_responsibilities}</p>
                          </div>
                        )}

                        {/* Extracted Key Skills & Perks */}
                        {job.key_skills && job.key_skills.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Tech Stack:</p>
                            <div className="flex flex-wrap gap-1">
                              {job.key_skills.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-white/10 border border-white/15 text-gray-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer Action Bar */}
                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-gray-400">
                          {job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "Recent"}
                        </span>
                        {job.apply_url ? (
                          <a
                            href={job.apply_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-2xl font-display font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                          >
                            Apply Now ↗
                          </a>
                        ) : (
                          <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 text-gray-400 border border-white/10">
                            Apply Link N/A
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-12 text-center border border-dashed border-white/20 rounded-3xl space-y-3 bg-neutral-900/50">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">No Jobs Discovered Yet</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Click the "Run Agent 2 Job Matcher" button above to fetch live jobs from Active Jobs DB and match them against your resume profile.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: RESUME PARSER & EXTRACTED COMPONENTS MODULE ── */}
        {activeTab === "resume" && (
          <div className="space-y-6">
            {/* Upload Dropzone Card */}
            <div className="p-5 md:p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl backdrop-blur-xl text-center space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <h2 className="text-lg md:text-xl font-black text-white font-display">Attach Resume (PDF Format)</h2>
              <p className="text-xs text-gray-300 font-sans max-w-xl mx-auto">
                Upload your resume PDF to extract contact details, technical skills, education, experience, and projects.
              </p>

              {uploadError && (
                <div className="p-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs max-w-md mx-auto">
                  {uploadError}
                </div>
              )}

              {uploadSuccessMsg && (
                <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs max-w-md mx-auto">
                  {uploadSuccessMsg}
                </div>
              )}

              {/* Uploading Progress Loader */}
              {uploading && (
                <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-300 max-w-md mx-auto space-y-2 animate-pulse">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="font-bold text-xs">{parseStep || "Parsing Resume..."}</span>
                  </div>
                </div>
              )}

              <div className="pt-1">
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black shadow-lg cursor-pointer transition-all">
                  <span>Browse & Select PDF</span>
                  <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            {/* ── PARSED RESUME EXTRACTED COMPONENTS DISPLAY ── */}
            {resumeData && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Extracted Resume Components
                  </h2>

                  <span className={`px-3 py-1 rounded-full text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                    resumeData.parser_mode?.includes("LLM")
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Mode: {resumeData.parser_mode || "LLM Agent"}</span>
                  </span>
                </div>

                {/* 0. Professional Summary / Objective Statement */}
                {resumeData.summary && (
                  <div className="p-5 sm:p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl space-y-2">
                    <h3 className="text-base font-display font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Professional Summary / Objective
                    </h3>
                    <p className="text-sm sm:text-base text-gray-100 font-sans leading-relaxed font-medium">
                      {resumeData.summary}
                    </p>
                  </div>
                )}

                {/* 1. Contact Details Card */}
                <div className="p-5 sm:p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl space-y-3">
                  <h3 className="text-base font-display font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Contact Info & Profile Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 font-sans">
                    <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-xs font-display font-bold uppercase text-gray-400 block mb-1">Candidate Name</span>
                      <span className="text-base text-white font-extrabold">{resumeData.contact_info?.name || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-xs font-display font-bold uppercase text-gray-400 block mb-1">Email Address</span>
                      <span className="text-sm sm:text-base text-white font-bold break-all">{resumeData.contact_info?.email || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-xs font-display font-bold uppercase text-gray-400 block mb-1">Phone Number</span>
                      <span className="text-sm sm:text-base text-white font-bold">{resumeData.contact_info?.phone || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-xs font-display font-bold uppercase text-gray-400 block mb-1">Address</span>
                      <span className="text-sm sm:text-base text-white font-bold">{resumeData.contact_info?.address || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-xs font-display font-bold uppercase text-gray-400 block mb-1">Location</span>
                      <span className="text-sm sm:text-base text-white font-bold">{resumeData.contact_info?.location || "Pakistan"}</span>
                    </div>
                    <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-xs font-display font-bold uppercase text-gray-400 block mb-1">LinkedIn</span>
                      <span className="text-sm sm:text-base text-amber-400 truncate block font-mono font-bold">{resumeData.contact_info?.linkedin || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/70 p-3.5 rounded-2xl border border-white/10">
                      <span className="text-xs font-display font-bold uppercase text-gray-400 block mb-1">GitHub</span>
                      <span className="text-sm sm:text-base text-purple-400 truncate block font-mono font-bold">{resumeData.contact_info?.github || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Technical Skills Card */}
                <div className="p-5 sm:p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl space-y-3">
                  <h3 className="text-base font-display font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Technical Skills ({resumeData.skills?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills && resumeData.skills.length > 0 ? (
                      resumeData.skills.map((skill, i) => (
                        <span key={i} className="px-3.5 py-1.5 rounded-xl text-sm font-bold bg-purple-500/20 border border-purple-500/40 text-purple-200 shadow-sm">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No skills parsed automatically.</p>
                    )}
                  </div>
                </div>

                {/* 3. Education & Experience Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Education */}
                  <div className="p-5 sm:p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-xl space-y-3">
                    <h3 className="text-base font-display font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      </svg>
                      Education
                    </h3>
                    {resumeData.education && resumeData.education.length > 0 ? (
                      resumeData.education.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-neutral-950/70 border border-white/10 text-sm text-gray-200 space-y-1">
                          {item.degree && <div className="font-extrabold text-base text-white">{item.degree}</div>}
                          {item.institution && <div className="text-emerald-400 font-bold text-sm">{item.institution}</div>}
                          <div className="text-gray-300 mt-1 leading-relaxed text-sm">{item.details || (typeof item === 'string' ? item : '')}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No education entries found.</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="p-5 sm:p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-xl space-y-3">
                    <h3 className="text-base font-display font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Experience
                    </h3>
                    {resumeData.experience && resumeData.experience.length > 0 ? (
                      resumeData.experience.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-neutral-950/70 border border-white/10 text-sm text-gray-200 space-y-1">
                          {item.title && <div className="font-extrabold text-base text-white">{item.title}</div>}
                          {item.company && <div className="text-amber-400 font-bold text-sm">{item.company}</div>}
                          <div className="text-gray-300 mt-1 leading-relaxed text-sm">{item.description || (typeof item === 'string' ? item : '')}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No work experience entries found.</p>
                    )}
                  </div>
                </div>

                {/* 4. Projects & Certifications (If present) */}
                {(resumeData.projects?.length || resumeData.certifications?.length) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {resumeData.projects && resumeData.projects.length > 0 && (
                      <div className="p-5 sm:p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-xl space-y-3">
                        <h3 className="text-base font-display font-black text-blue-400 uppercase tracking-wider flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Projects
                        </h3>
                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl bg-neutral-950/70 border border-white/10 text-sm text-gray-200 space-y-1">
                            {proj.title && <div className="font-extrabold text-base text-white">{proj.title}</div>}
                            <div className="text-gray-300 mt-1 leading-relaxed text-sm">{proj.description}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.certifications && resumeData.certifications.length > 0 && (
                      <div className="p-5 sm:p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-xl space-y-3">
                        <h3 className="text-base font-display font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          Certifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.certifications.map((cert, idx) => (
                            <span key={idx} className="px-3.5 py-1.5 rounded-xl text-sm font-bold bg-rose-500/20 border border-rose-500/40 text-rose-300 shadow-sm">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: APPLICATION TRACKER MODULE ── */}
        {activeTab === "applications" && (
          <div className="p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl text-center space-y-3">
            <h2 className="text-xl font-black text-white font-display">Application Tracker Pipeline</h2>
            <p className="text-xs text-gray-300 font-sans">
              Manage your internship applications from Applied to Interview & Offer stages.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
