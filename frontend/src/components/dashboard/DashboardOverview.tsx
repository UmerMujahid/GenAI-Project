import React from "react";
import { ResumeData, MatchedJobData } from "../../services/api";

interface DashboardOverviewProps {
  resumeData: ResumeData | null;
  matchedJobs: MatchedJobData[];
  setActiveTab: (tab: "dashboard" | "jobs" | "resume" | "settings") => void;
  setExpandedJobId: (id: string | null) => void;
}

const getSafeApplyUrl = (url?: string, title?: string, company?: string): string => {
  if (!url || url.toLowerCase() === "nan" || url.toLowerCase() === "null" || url.endsWith("/nan")) {
    return `https://www.google.com/search?q=${encodeURIComponent(`${title || ""} ${company || ""} jobs Pakistan`)}`;
  }
  return url.startsWith("http") ? url : `https://${url}`;
};

export default function DashboardOverview({
  resumeData,
  matchedJobs,
  setActiveTab,
  setExpandedJobId,
}: DashboardOverviewProps) {
  const avgMatchScore =
    matchedJobs.length > 0
      ? Math.round(
          matchedJobs.reduce((acc, curr) => acc + (curr.match_score || 0), 0) /
            matchedJobs.length
        )
      : 0;

  const highFitCount = matchedJobs.filter(
    (job) => (job.match_score || 0) >= 70
  ).length;

  return (
    <div className="space-y-6">
      {/* ── METRIC / KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-display font-black text-white uppercase tracking-widest">
              DISCOVERED JOBS
            </p>
            <h3 className="text-2xl font-display font-black text-white mt-1">
              {matchedJobs.length}
            </h3>
            <p className="text-[11px] font-display font-bold text-emerald-400 mt-0.5">
              JobSpy Live
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-display font-black text-white uppercase tracking-widest">
              AVG MATCH SCORE
            </p>
            <h3 className="text-2xl font-display font-black text-amber-400 mt-1">
              {avgMatchScore}%
            </h3>
            <p className="text-[11px] font-display font-bold text-gray-400 mt-0.5">
              Groq LLM Fit
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-display font-black text-white uppercase tracking-widest">
              RESUME STATUS
            </p>
            <h3 className="text-lg font-display font-black text-emerald-400 mt-1 truncate max-w-[150px]">
              {resumeData ? "Parsed & Ready" : "Pending"}
            </h3>
            <p className="text-[11px] font-display font-bold text-gray-400 mt-0.5 truncate max-w-[140px]">
              {resumeData?.filename || "No resume uploaded"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/20 bg-neutral-900/90 shadow-xl backdrop-blur-xl hover:border-amber-500/40 transition-all flex items-center justify-between">
          <div>
            <p className="text-xs font-display font-black text-white uppercase tracking-widest">
              HIGH FIT MATCHES
            </p>
            <h3 className="text-2xl font-display font-black text-white mt-1">
              {highFitCount}
            </h3>
            <p className="text-[11px] font-display font-bold text-purple-300 mt-0.5">
              Score &gt;= 70%
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Candidate Parsed Resume Profile Card */}
      <div className="p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
              Candidate Resume
            </span>
            <h2 className="text-xl font-black text-white font-display mt-1">
              {resumeData?.contact_info?.name || "Candidate Profile"}
            </h2>
            <p className="text-xs text-gray-300 font-sans">
              {resumeData?.summary || "No candidate summary provided yet."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {resumeData && (
              <span className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
                <span className="leading-none">Mode: {resumeData.parser_mode || "LLM Agent"}</span>
              </span>
            )}
            <button
              onClick={() => setActiveTab("resume")}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              {resumeData ? "Update Resume" : "Upload Resume"}
            </button>
          </div>
        </div>

        {resumeData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Details</p>
              <p className="text-xs text-amber-300 font-semibold">{resumeData.contact_info?.email || "No email"}</p>
              <p className="text-xs text-gray-300">{resumeData.contact_info?.phone || "No phone"}</p>
              <p className="text-xs text-gray-400">{resumeData.contact_info?.location || "Pakistan"}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Parsed Skills ({resumeData.skills?.length || 0})
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {resumeData.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300"
                  >
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
              Upload Resume Now
            </button>
          </div>
        )}
      </div>

      {/* Table of Scraped / Discovered Jobs for User */}
      <div className="p-6 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-lg font-black text-white font-display">
              Scraped & Discovered Jobs ({matchedJobs.length})
            </h2>
            <p className="text-xs text-gray-400">All jobs saved in your database profile</p>
          </div>
          <button
            onClick={() => setActiveTab("jobs")}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
          >
            Go to Job Finder
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
                    <td className="py-3.5 px-3 font-bold text-white max-w-[200px] truncate">
                      {job.title}
                    </td>
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
                    <td className="py-3.5 px-3 text-gray-300">{job.work_arrangement || "Onsite"}</td>
                    <td className="py-3.5 px-3 text-emerald-400 font-semibold">
                      {job.salary_min
                        ? `${job.salary_currency || "PKR"} ${job.salary_min.toLocaleString()}`
                        : "Undisclosed"}
                    </td>
                    <td className="py-3.5 px-3 text-purple-300 font-semibold">{job.source_platform}</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setExpandedJobId(job.id);
                            setActiveTab("jobs");
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                          Details
                        </button>
                        <a
                          href={getSafeApplyUrl(job.apply_url, job.title, job.organization)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all inline-block"
                        >
                          Apply
                        </a>
                      </div>
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
  );
}
