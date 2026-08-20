import React from "react";
import { TailorResumeResult } from "../../services/api";

interface TailorResumeModalProps {
  result: TailorResumeResult | null;
  loading: boolean;
  error: string;
  exporting: boolean;
  onClose: () => void;
  onExport: () => void;
}

function highlightText(text: string, keywords: string[]) {
  if (!text) return text;
  const tokens = (keywords || []).filter(Boolean).sort((a, b) => b.length - a.length);
  if (tokens.length === 0) return text;

  const escaped = tokens.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, idx) => {
    const matched = tokens.some((k) => k.toLowerCase() === part.toLowerCase());
    if (matched) {
      return (
        <mark
          key={`${part}-${idx}`}
          className="bg-emerald-500/20 text-emerald-300 font-semibold px-0.5 rounded-sm"
        >
          {part}
        </mark>
      );
    }
    return <React.Fragment key={`${part}-${idx}`}>{part}</React.Fragment>;
  });
}

export default function TailorResumeModal({
  result,
  loading,
  error,
  exporting,
  onClose,
  onExport,
}: TailorResumeModalProps) {
  if (!loading && !error && !result) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close tailor resume modal"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0d0e12] shadow-2xl shadow-amber-500/10 flex flex-col">
        <div className="px-5 sm:px-7 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black">
                Agent 3
              </span>
              <span className="text-xs font-bold text-gray-400">Resume Tailoring via Groq</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
              {result ? `Tailored for ${result.job_title}` : "Tailoring Resume"}
            </h2>
            {result && (
              <p className="text-xs text-amber-400 font-semibold mt-0.5">{result.organization}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {result && (
              <button
                onClick={onExport}
                disabled={exporting}
                className="px-4 py-2.5 rounded-xl font-display font-black text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {exporting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Preparing PDF...
                  </>
                ) : (
                  <>📥 Download Tailored PDF</>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7 space-y-5">
          {loading && (
            <div className="p-10 rounded-3xl border border-amber-500/30 bg-black/50 text-center space-y-4">
              <svg className="animate-spin h-8 w-8 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-black text-white font-display">Tailoring resume via Groq AI...</p>
              <p className="text-xs text-gray-400">Rewriting summary, prioritizing matched skills, and reframing project bullets without inventing new facts.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                <div className="h-40 rounded-2xl bg-amber-500/5 border border-amber-500/20 animate-pulse" />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {result && (
            <>
              {result.tailored.tailoring_notes && (
                <p className="text-xs text-gray-400 italic border border-white/10 rounded-2xl px-4 py-3 bg-white/5">
                  {result.tailored.tailoring_notes}
                </p>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <section className="p-5 rounded-3xl border border-white/15 bg-neutral-900/80 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 font-display">Original Resume</h3>
                  <div>
                    <p className="text-[11px] font-extrabold text-gray-500 uppercase mb-1.5">Professional Summary</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{result.original.summary || "No original summary."}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold text-gray-500 uppercase mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(result.original.skills || []).map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 text-gray-300 border border-white/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[11px] font-extrabold text-gray-500 uppercase">Projects</p>
                    {(result.original.projects || []).map((project, idx) => (
                      <div key={`${project.title}-${idx}`} className="p-3 rounded-xl bg-black/40 border border-white/10">
                        <p className="text-sm font-bold text-white">{project.title || "Project"}</p>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{project.description || "No description."}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="p-5 rounded-3xl border border-amber-500/35 bg-gradient-to-b from-amber-500/10 to-neutral-900 space-y-4 shadow-lg shadow-amber-500/5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 font-display">AI Tailored Resume</h3>
                  <div>
                    <p className="text-[11px] font-extrabold text-amber-500/80 uppercase mb-1.5">Target Summary</p>
                    <p className="text-xs text-gray-100 leading-relaxed">
                      {highlightText(result.tailored.professional_summary, result.tailored.highlighted_keywords)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-extrabold text-amber-500/80 uppercase mb-2">Prioritized Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(result.tailored.prioritized_skills || []).map((skill) => {
                        const matched = result.tailored.highlighted_keywords.some(
                          (kw) => kw.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <span
                            key={skill}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              matched
                                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                                : "bg-amber-500/10 text-amber-200 border-amber-500/25"
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  {result.tailored.skill_groups?.length > 0 && (
                    <div className="space-y-2">
                      {result.tailored.skill_groups.map((group) => (
                        <p key={group.category} className="text-xs text-gray-300">
                          <span className="text-amber-400 font-bold">{group.category}: </span>
                          {group.skills.join(", ")}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="space-y-3">
                    <p className="text-[11px] font-extrabold text-amber-500/80 uppercase">Enhanced Projects</p>
                    {(result.tailored.projects || []).map((project, idx) => (
                      <div key={`${project.title}-${idx}`} className="p-3 rounded-xl bg-black/50 border border-amber-500/20">
                        <p className="text-sm font-bold text-white">{project.title}</p>
                        <ul className="mt-2 space-y-1.5">
                          {(project.bullets || []).map((bullet, bIdx) => (
                            <li key={bIdx} className="text-xs text-gray-200 leading-relaxed flex gap-2">
                              <span className="text-amber-400 shrink-0">•</span>
                              <span>{highlightText(bullet, result.tailored.highlighted_keywords)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={onExport}
                  disabled={exporting}
                  className="px-5 py-2.5 rounded-xl font-display font-black text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  📥 Download Tailored PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
