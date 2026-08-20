import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  uploadResumeApi,
  getLatestResumeApi,
  discoverJobsApi,
  getMatchedJobsApi,
  tailorResumeApi,
  exportTailoredResumePdfApi,
  generateCoverLetterApi,
  exportCoverLetterPdfApi,
  ResumeData,
  MatchedJobData,
  TailorResumeResult,
  CoverLetterResult,
} from "../services/api";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import JobFinderTab from "../components/dashboard/JobFinderTab";
import ResumeParserTab from "../components/dashboard/ResumeParserTab";
import TailorResumeModal from "../components/dashboard/TailorResumeModal";
import CoverLetterModal from "../components/dashboard/CoverLetterModal";

/**
 * Authenticated dashboard shell.
 *
 * Owns resume upload, job discovery, resume tailoring, and cover letter
 * workflows, then delegates presentation to tab and modal child components.
 *
 * @returns {JSX.Element} Dashboard layout with header, tabs, and agent modals.
 */
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
  const [tailoringJobId, setTailoringJobId] = useState<string | null>(null);
  const [tailorResult, setTailorResult] = useState<TailorResumeResult | null>(null);
  const [tailorError, setTailorError] = useState("");
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [coverLetterJobId, setCoverLetterJobId] = useState<string | null>(null);
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResult | null>(null);
  const [coverLetterError, setCoverLetterError] = useState("");
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [exportingCoverLetterPdf, setExportingCoverLetterPdf] = useState(false);

  // Load latest resume + cached matched jobs when the session user is available.
  useEffect(() => {
    if (user?.id) {
      loadResume(user.id);
      loadMatchedJobs(user.id);
    }
  }, [user]);

  /** Fetch the user's most recent parsed resume from the backend. */
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

  /** Load previously discovered matched jobs for the dashboard Job Finder tab. */
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

  /** Trigger Agent 2 live job discovery against the uploaded resume. */
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

  /**
   * Open the tailor modal and call Agent 3 to rewrite the resume for ``job``.
   * @param {MatchedJobData} job - Target matched job from the Job Finder list.
   */
  const handleTailorResume = async (job: MatchedJobData) => {
    if (!resumeData?.id) {
      setDiscoveryError("Upload a resume first so Agent 3 can tailor it to this job.");
      setActiveTab("resume");
      return;
    }

    setShowTailorModal(true);
    setTailoringJobId(job.id);
    setTailorError("");
    setTailorResult(null);

    try {
      const result = await tailorResumeApi(resumeData.id, job.id);
      setTailorResult(result);
    } catch (err: any) {
      setTailorError(err.response?.data?.detail || "Failed to tailor resume. Check backend logs.");
    } finally {
      setTailoringJobId(null);
    }
  };

  /** Download the tailored resume PDF via the export endpoint (blob download). */
  const handleExportTailoredPdf = async () => {
    if (!tailorResult) return;
    setExportingPdf(true);
    try {
      await exportTailoredResumePdfApi({
        job_title: tailorResult.job_title,
        organization: tailorResult.organization,
        contact_info: tailorResult.contact_info,
        professional_summary: tailorResult.tailored.professional_summary,
        prioritized_skills: tailorResult.tailored.prioritized_skills,
        skill_groups: tailorResult.tailored.skill_groups,
        projects: tailorResult.tailored.projects,
        education: tailorResult.education,
        experience: tailorResult.experience,
        certifications: tailorResult.certifications,
        achievements: tailorResult.achievements,
        languages: tailorResult.languages,
        volunteer_work: tailorResult.volunteer_work,
        section_order: tailorResult.section_order,
        subtitle: tailorResult.subtitle,
        raw_text: tailorResult.raw_text,
      });
    } catch (err: any) {
      setTailorError(err.response?.data?.detail || "PDF export failed.");
    } finally {
      setExportingPdf(false);
    }
  };

  /**
   * Open the cover letter modal and draft a letter for ``job``.
   * @param {MatchedJobData} job - Target matched job from the Job Finder list.
   */
  const handleGenerateCoverLetter = async (job: MatchedJobData) => {
    if (!resumeData?.id) {
      setDiscoveryError("Upload a resume first so Agent 3 can draft a cover letter for this job.");
      setActiveTab("resume");
      return;
    }

    setShowCoverLetterModal(true);
    setCoverLetterJobId(job.id);
    setCoverLetterError("");
    setCoverLetterResult(null);

    try {
      const result = await generateCoverLetterApi({
        resume_id: resumeData.id,
        job_id: job.id,
        company_name: job.organization,
        use_tailored: true,
      });
      setCoverLetterResult(result);
    } catch (err: any) {
      setCoverLetterError(err.response?.data?.detail || "Failed to generate cover letter.");
    } finally {
      setCoverLetterJobId(null);
    }
  };

  /**
   * Export the (possibly edited) cover letter as a PDF download.
   * @param {_editedText} Full letter text from the modal editor.
   * @param {paragraphs} Body paragraphs derived from the draft for PDF layout.
   */
  const handleExportCoverLetterPdf = async (_editedText: string, paragraphs: string[]) => {
    if (!coverLetterResult) return;
    setExportingCoverLetterPdf(true);
    try {
      await exportCoverLetterPdfApi({
        company_name: coverLetterResult.company_name,
        job_title: coverLetterResult.job_title,
        header: coverLetterResult.header,
        salutation: coverLetterResult.salutation,
        body_paragraphs: paragraphs.length ? paragraphs : coverLetterResult.body_paragraphs,
        closing: coverLetterResult.closing,
        candidate_name: coverLetterResult.candidate_name,
        full_text: _editedText || coverLetterResult.full_text,
      });
    } catch (err: any) {
      setCoverLetterError(err.response?.data?.detail || "Cover letter PDF export failed.");
    } finally {
      setExportingCoverLetterPdf(false);
    }
  };

  /**
   * Upload and parse a PDF resume, showing staged progress while the API runs.
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event.
   */
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
            tailoringJobId={tailoringJobId}
            onTailorResume={handleTailorResume}
            coverLetterJobId={coverLetterJobId}
            onGenerateCoverLetter={handleGenerateCoverLetter}
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

      {showTailorModal && (
        <TailorResumeModal
          result={tailorResult}
          loading={Boolean(tailoringJobId)}
          error={tailorError}
          exporting={exportingPdf}
          onClose={() => {
            setShowTailorModal(false);
            setTailorError("");
          }}
          onExport={handleExportTailoredPdf}
        />
      )}

      {showCoverLetterModal && (
        <CoverLetterModal
          result={coverLetterResult}
          loading={Boolean(coverLetterJobId)}
          error={coverLetterError}
          exporting={exportingCoverLetterPdf}
          onClose={() => {
            setShowCoverLetterModal(false);
            setCoverLetterError("");
          }}
          onExport={handleExportCoverLetterPdf}
        />
      )}
    </div>
  );
}
