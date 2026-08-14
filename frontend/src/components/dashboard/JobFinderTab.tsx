import React from "react";
import { MatchedJobData } from "../../services/api";

interface JobFinderTabProps {
  matchedJobs: MatchedJobData[];
  discoveringJobs: boolean;
  discoveryError: string;
  discoverySuccess: string;
  selectedSource: string;
  setSelectedSource: (source: string) => void;
  matchThreshold: number;
  setMatchThreshold: (threshold: number) => void;
  expandedJobId: string | null;
  setExpandedJobId: (id: string | null) => void;
  handleDiscoverJobs: () => void;
}

const getSafeApplyUrl = (url?: string, title?: string, company?: string): string => {
  if (!url || url.toLowerCase() === "nan" || url.toLowerCase() === "null" || url.endsWith("/nan")) {
    return `https://www.google.com/search?q=${encodeURIComponent(`${title || ""} ${company || ""} jobs Pakistan`)}`;
  }
  return url.startsWith("http") ? url : `https://${url}`;
};

export default function JobFinderTab({
  matchedJobs,
  discoveringJobs,
  discoveryError,
  discoverySuccess,
  selectedSource,
  setSelectedSource,
  matchThreshold,
  setMatchThreshold,
  expandedJobId,
  setExpandedJobId,
  handleDiscoverJobs,
}: JobFinderTabProps) {
  const availableSources = [
    "all",
    ...Array.from(new Set(matchedJobs.map((j) => j.source_platform || "JobSpy").filter(Boolean))),
  ];

  return (
    <div className="space-y-6">
      {/* Agent 2 Trigger Banner */}
      <div className="p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-neutral-900 to-purple-500/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black">
              Agent 2 Ready
            </span>
            <span className="text-xs font-bold text-gray-400">JobSpy Live Scraper (Indeed • LinkedIn • Google)</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight font-display">
            Find Real Jobs Matched to Your Resume
          </h2>
          <p className="text-xs text-gray-300">
            Agent 2 live-scrapes tech jobs & internships in Pakistan, objectively analyzes requirements vs your resume skills, and generates fit scores.
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

      {/* Dynamic Filter Dock Bar */}
      <div className="p-4 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto">
          <span className="text-xs font-bold text-gray-400 font-display uppercase tracking-wider shrink-0">Source:</span>
          {availableSources.map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedSource(platform)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                selectedSource === platform
                  ? "bg-amber-500 text-black border-amber-400 shadow-md"
                  : "bg-black/60 text-gray-300 border-white/15 hover:border-white/30 hover:text-white"
              }`}
            >
              {platform === "all" ? "All Platforms" : platform}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <span className="text-xs font-bold text-gray-400 font-display uppercase tracking-wider">Min Match Score:</span>
          <input
            type="range"
            min="0"
            max="90"
            step="5"
            value={matchThreshold}
            onChange={(e) => setMatchThreshold(Number(e.target.value))}
            className="accent-amber-500 cursor-pointer"
          />
          <span className="text-sm font-extrabold text-amber-400 min-w-[45px]">{matchThreshold}%+</span>
        </div>
      </div>

      {/* Interactive Clean Rows (One Row per Job, Click to Expand Full Details) */}
      {matchedJobs.length > 0 ? (
        <div className="space-y-3.5 w-full">
          {matchedJobs
            .filter((job) => job.match_score >= matchThreshold && (selectedSource === "all" || job.source_platform === selectedSource))
            .map((job) => {
              const isExpanded = expandedJobId === job.id;
              return (
                <div
                  key={job.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "border-amber-500/60 bg-neutral-900/95 shadow-2xl ring-1 ring-amber-500/20"
                      : "border-white/15 bg-neutral-900/70 hover:bg-neutral-900 hover:border-white/30 shadow-md"
                  }`}
                >
                  {/* Collapsed Single Row Header */}
                  <div
                    onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                    className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    {/* Left: Score Badge + Title + Company */}
                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                      <div
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border shrink-0 text-center ${
                          job.match_score >= 70
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10 shadow-sm"
                            : job.match_score >= 45
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-500/10 shadow-sm"
                            : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                        }`}
                      >
                        {job.match_score}% Fit
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-black text-white font-display truncate leading-tight">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs sm:text-sm font-bold text-amber-400">{job.organization}</span>
                          {job.organization_url && (
                            <a
                              href={job.organization_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-gray-400 hover:text-white underline"
                            >
                              Website ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Center: Metadata Badges */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2.5 py-1 rounded-lg font-bold bg-white/10 text-gray-200 border border-white/15">
                        {job.work_arrangement || "Onsite"}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {job.experience_level || "Entry Level"}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                        {job.source_platform || "JobSpy"}
                      </span>
                      {job.salary_min && (
                        <span className="px-2.5 py-1 rounded-lg font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                          {job.salary_currency || "PKR"} {job.salary_min.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Right: Date Posted & Expand Button */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        {job.date_posted ? new Date(job.date_posted).toLocaleDateString() : "Recent"}
                      </span>

                      <a
                        href={getSafeApplyUrl(job.apply_url, job.title, job.organization)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-1.5 rounded-xl font-display font-black text-xs bg-amber-500 hover:bg-amber-400 text-black transition-all shadow"
                      >
                        Apply ↗
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedJobId(isExpanded ? null : job.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isExpanded
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                            : "bg-white/5 text-gray-300 border-white/15 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span>{isExpanded ? "Collapse" : "Details"}</span>
                        <svg
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-amber-400" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Full Detail Card View */}
                  {isExpanded && (
                    <div className="p-5 sm:p-7 border-t border-white/10 bg-black/40 space-y-5 animate-fadeIn">
                      {/* AI Agent Match Analysis Card */}
                      {job.reasoning && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-amber-400 flex items-center gap-2 font-display uppercase tracking-wider">
                              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              AI Agent Fit Reasoning ({job.match_score}% Match):
                            </p>
                          </div>
                          <p className="text-sm text-gray-200 leading-relaxed font-sans font-medium">{job.reasoning}</p>
                        </div>
                      )}

                      {/* Matching vs Missing Skills Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-2">
                          <p className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                            <span>✓</span>
                            <span>Matching Skills in Resume ({job.matching_skills?.length || 0}):</span>
                          </p>
                          {job.matching_skills && job.matching_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {job.matching_skills.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No direct keyword overlap identified.</p>
                          )}
                        </div>

                        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-2">
                          <p className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5 font-display">
                            <span>✗</span>
                            <span>Missing Skills / Gaps to Learn ({job.missing_skills?.length || 0}):</span>
                          </p>
                          {job.missing_skills && job.missing_skills.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {job.missing_skills.map((skill, idx) => (
                                <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-emerald-400/80 italic font-semibold">No critical missing skill gaps found!</p>
                          )}
                        </div>
                      </div>

                      {/* Key Specifications Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Experience Level</p>
                          <p className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">{job.experience_level || "Not specified"}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Work Mode</p>
                          <p className="text-xs sm:text-sm font-bold text-purple-300 mt-0.5">{job.work_arrangement || "Onsite"}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Salary</p>
                          <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5">
                            {job.salary_min ? `${job.salary_currency || "PKR"} ${job.salary_min.toLocaleString()} / ${job.salary_unit || "month"}` : "Undisclosed / Market"}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Education</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-200 mt-0.5 truncate">{job.education?.[0] || "Bachelor in CS / IT"}</p>
                        </div>
                      </div>

                      {/* Full Job Description / Requirements */}
                      <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
                        <p className="text-xs font-black text-white uppercase tracking-wider font-display">Job Description & Requirements:</p>
                        <div className="text-xs text-gray-300 leading-relaxed font-sans max-h-60 overflow-y-auto pr-2 whitespace-pre-line">
                          {job.requirements_summary || job.core_responsibilities || "No detailed description available."}
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-xs text-gray-400">
                          Source: <strong className="text-gray-200">{job.source_platform}</strong> • Scraped: {job.date_posted || "Recent"}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setExpandedJobId(null)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            Close
                          </button>
                          <a
                            href={getSafeApplyUrl(job.apply_url, job.title, job.organization)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2.5 rounded-xl font-display font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                          >
                            Apply on Career Portal ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
            Click the "Run Agent 2 Job Matcher" button above to scrape live Pakistani jobs via JobSpy and match them dynamically against your resume profile.
          </p>
        </div>
      )}
    </div>
  );
}
