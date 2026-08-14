import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  uploadResumeApi,
  getLatestResumeApi,
  discoverJobsApi,
  getMatchedJobsApi,
  ResumeData,
  MatchedJobData,
} from "../services/api";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import JobFinderTab from "../components/dashboard/JobFinderTab";
import ResumeParserTab from "../components/dashboard/ResumeParserTab";

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Active Navigation Tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "jobs" | "resume" | "settings">("dashboard");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Resume Upload & Parser States
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parseStep, setParseStep] = useState<string>("");
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [uploadError, setUploadError] = useState("");

  // Agent 2 Job Discovery & Matching States
  const [matchedJobs, setMatchedJobs] = useState<MatchedJobData[]>([]);
  const [discoveringJobs, setDiscoveringJobs] = useState(false);
  const [discoveryError, setDiscoveryError] = useState("");
  const [discoverySuccess, setDiscoverySuccess] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [matchThreshold, setMatchThreshold] = useState(0);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Initial Data Fetching
  useEffect(() => {
    if (user?.id) {
      loadResume(user.id);
      loadMatchedJobs(user.id);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Please upload a valid PDF document.");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccessMsg("");

    const startTime = Date.now();
    const steps = [
      "1/4 Reading PDF & Computing Cryptographic Hash...",
      "2/4 Checking Profile & Initializing AI Agent...",
      "3/4 Structuring Technical Skills, Education & Experience...",
      "4/4 Finalizing Verification & Syncing Profile...",
    ];

    let currentStepIndex = 0;
    setParseStep(steps[0]);

    const interval = setInterval(() => {
      currentStepIndex = (currentStepIndex + 1) % steps.length;
      setParseStep(steps[currentStepIndex]);
    }, 750);

    try {
      const parsed = await uploadResumeApi(user.id, file);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2500 - elapsedTime);
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      setResumeData(parsed);
      setUploadSuccessMsg(`Resume "${file.name}" loaded successfully via ${parsed.parser_mode || "Agent"}!`);
    } catch (err: any) {
      setUploadError(err.response?.data?.detail || "Failed to upload and parse resume.");
    } finally {
      clearInterval(interval);
      setUploading(false);
      setParseStep("");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-gray-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Header & Navigation */}
      <DashboardHeader
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        logout={logout}
      />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Page Context Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-display">
              {activeTab === "dashboard" && "Candidate Dashboard"}
              {activeTab === "jobs" && "Job Finder & Matcher (Agent 2)"}
              {activeTab === "resume" && "Resume Parser & Extractor"}
            </h1>
            <p className="text-sm text-gray-300 font-sans mt-0.5">
              {activeTab === "dashboard" && "Overview of your parsed resumes, active matches, and candidate profile."}
              {activeTab === "jobs" && "Discover real-time Pakistani tech jobs & internships via JobSpy scored against your resume."}
              {activeTab === "resume" && "Upload your PDF resume to extract structured skills, experience, and contact data."}
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

        {/* Tab 1: Dashboard Overview */}
        {activeTab === "dashboard" && (
          <DashboardOverview
            resumeData={resumeData}
            matchedJobs={matchedJobs}
            setActiveTab={setActiveTab}
            setExpandedJobId={setExpandedJobId}
          />
        )}

        {/* Tab 2: Job Finder & Matcher (Agent 2) */}
        {activeTab === "jobs" && (
          <JobFinderTab
            matchedJobs={matchedJobs}
            discoveringJobs={discoveringJobs}
            discoveryError={discoveryError}
            discoverySuccess={discoverySuccess}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            matchThreshold={matchThreshold}
            setMatchThreshold={setMatchThreshold}
            expandedJobId={expandedJobId}
            setExpandedJobId={setExpandedJobId}
            handleDiscoverJobs={handleDiscoverJobs}
          />
        )}

        {/* Tab 3: Resume Parser & Extractor */}
        {activeTab === "resume" && (
          <ResumeParserTab
            resumeData={resumeData}
            uploading={uploading}
            parseStep={parseStep}
            uploadError={uploadError}
            uploadSuccessMsg={uploadSuccessMsg}
            handleFileUpload={handleFileUpload}
          />
        )}
      </main>
    </div>
  );
}
