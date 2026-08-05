import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  uploadResumeApi,
  getLatestResumeApi,
  getInternshipsApi,
  ResumeData,
} from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"dashboard" | "resume" | "applications" | "settings">("dashboard");
  const [selectedSource, setSelectedSource] = useState("all");
  const [matchThreshold, setMatchThreshold] = useState(70);

  // Resume Upload & Parser States
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parseStep, setParseStep] = useState<string>("");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Scraped Internships Data
  const [internships, setInternships] = useState<any[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(false);

  // User Profile Menu Dropdown State
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadResume(user.id);
      loadInternships();
    }
  }, [user]);

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

    setParseStep("1/3 Reading PDF Document...");
    setTimeout(() => {
      setParseStep("2/3 Extracting Contact Info & Technical Skills...");
      setTimeout(() => {
        setParseStep("3/3 Structuring Experience, Education & Projects...");
      }, 700);
    }, 700);

    try {
      const parsed = await uploadResumeApi(user.id, file);
      setResumeData(parsed);
      setUploadSuccessMsg(`Resume "${file.name}" uploaded and parsed successfully!`);
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || "Failed to upload and parse resume.");
    } finally {
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
            Tracker
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
              {activeTab === "dashboard" && "Internship Dashboard"}
              {activeTab === "resume" && "Resume Parser & Extractor"}
              {activeTab === "applications" && "Application Tracker"}
            </h1>
            <p className="text-sm text-gray-300 font-sans mt-0.5">
              {activeTab === "dashboard" && "Discover real-time Pakistani internship opportunities matched to your skills."}
              {activeTab === "resume" && "Upload your PDF resume to extract structured skills, experience, and contact data."}
              {activeTab === "applications" && "Track applied positions and manage pipeline stages."}
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
              <p className="text-xs font-display font-black text-white uppercase tracking-widest">TOTAL SCRAPED</p>
              <h3 className="text-2xl font-display font-black text-white mt-1">{internships.length}</h3>
              <p className="text-[11px] font-display font-bold text-emerald-400 mt-0.5">Updated 5m ago</p>
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
              <h3 className="text-2xl font-display font-black text-white mt-1">87%</h3>
              <p className="text-[11px] font-display font-bold text-amber-400 mt-0.5">Optimal Fit</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
            <div>
              <p className="text-xs font-display font-black text-white uppercase tracking-widest">RESUME PARSED</p>
              <h3 className="text-2xl font-display font-black text-white mt-1">{resumeData ? "Active" : "None"}</h3>
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
              <p className="text-xs font-display font-black text-white uppercase tracking-widest">TRACKED APPS</p>
              <h3 className="text-2xl font-display font-black text-white mt-1">4</h3>
              <p className="text-[11px] font-display font-bold text-purple-400 mt-0.5">2 Interviews</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── TAB 1: INTERNSHIP DISCOVERY DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Filter Dock Bar */}
            <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto">
                <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider">Source:</span>
                {["all", "LinkedIn", "Rozee.pk", "Mustakbil"].map((platform) => (
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
                  min="50"
                  max="95"
                  value={matchThreshold}
                  onChange={(e) => setMatchThreshold(Number(e.target.value))}
                  className="accent-amber-500 cursor-pointer"
                />
                <span className="text-sm font-extrabold text-amber-400 min-w-[40px]">{matchThreshold}%+</span>
              </div>
            </div>

            {/* Internship Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredInternships.map((job) => (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                        {job.source_platform}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {job.match_score || 85}% Match
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-0.5 leading-snug">{job.title}</h3>
                    <p className="text-sm font-semibold text-amber-400 mb-2">{job.company}</p>
                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {job.location}
                    </p>

                    <p className="text-xs text-gray-300 font-sans mb-3 line-clamp-2">{job.description}</p>

                    {/* Required Skills Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.skills_required?.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 border border-white/10 text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-3 border-t border-white/10">
                    <a
                      href={job.application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
                    >
                      View Posting
                    </a>
                    <button
                      onClick={() => setActiveTab("resume")}
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black transition-all shadow-md"
                    >
                      Tailor Resume
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
                <h2 className="text-lg font-black text-white font-display border-b border-white/10 pb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Extracted Resume Components
                </h2>

                {/* 1. Contact Details Card */}
                <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl space-y-2.5">
                  <h3 className="text-sm font-display font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Contact Info
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-sans">
                    <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-display font-bold uppercase text-gray-400 block mb-0.5">Candidate Name</span>
                      <span className="text-white font-semibold">{resumeData.contact_info?.name || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-display font-bold uppercase text-gray-400 block mb-0.5">Email Address</span>
                      <span className="text-white font-semibold break-all">{resumeData.contact_info?.email || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-display font-bold uppercase text-gray-400 block mb-0.5">Phone Number</span>
                      <span className="text-white font-semibold">{resumeData.contact_info?.phone || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-display font-bold uppercase text-gray-400 block mb-0.5">LinkedIn</span>
                      <span className="text-amber-400 truncate block font-mono">{resumeData.contact_info?.linkedin || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-display font-bold uppercase text-gray-400 block mb-0.5">GitHub</span>
                      <span className="text-purple-400 truncate block font-mono">{resumeData.contact_info?.github || "Not specified"}</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-white/10">
                      <span className="text-[10px] font-display font-bold uppercase text-gray-400 block mb-0.5">Location</span>
                      <span className="text-white font-semibold">{resumeData.contact_info?.location || "Pakistan"}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Technical Skills Card */}
                <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl space-y-2.5">
                  <h3 className="text-sm font-display font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Technical Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills && resumeData.skills.length > 0 ? (
                      resumeData.skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No skills parsed automatically.</p>
                    )}
                  </div>
                </div>

                {/* 3. Education & Experience Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Education */}
                  <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl space-y-2">
                    <h3 className="text-sm font-display font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      </svg>
                      Education
                    </h3>
                    {resumeData.education && resumeData.education.length > 0 ? (
                      resumeData.education.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/10 text-xs text-gray-200">
                          {item.degree && <div className="font-bold text-white">{item.degree}</div>}
                          {item.institution && <div className="text-emerald-400 font-semibold">{item.institution}</div>}
                          <div className="text-gray-300 mt-0.5">{item.details || (typeof item === 'string' ? item : '')}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No education entries found.</p>
                    )}
                  </div>

                  {/* Experience */}
                  <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl space-y-2">
                    <h3 className="text-sm font-display font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Experience
                    </h3>
                    {resumeData.experience && resumeData.experience.length > 0 ? (
                      resumeData.experience.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/10 text-xs text-gray-200">
                          {item.title && <div className="font-bold text-white">{item.title}</div>}
                          {item.company && <div className="text-amber-400 font-semibold">{item.company}</div>}
                          <div className="text-gray-300 mt-0.5">{item.description || (typeof item === 'string' ? item : '')}</div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">No work experience entries found.</p>
                    )}
                  </div>
                </div>

                {/* 4. Projects & Certifications (If present) */}
                {(resumeData.projects?.length || resumeData.certifications?.length) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.projects && resumeData.projects.length > 0 && (
                      <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl space-y-2">
                        <h3 className="text-sm font-display font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                          Projects
                        </h3>
                        {resumeData.projects.map((proj, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-neutral-950/60 border border-white/10 text-xs text-gray-200">
                            {proj.title && <div className="font-bold text-white">{proj.title}</div>}
                            <div className="text-gray-300 mt-0.5">{proj.description}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {resumeData.certifications && resumeData.certifications.length > 0 && (
                      <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl space-y-2">
                        <h3 className="text-sm font-display font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          Certifications
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {resumeData.certifications.map((cert, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300">
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
