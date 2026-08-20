import React, { useEffect, useState } from "react";
import { CoverLetterResult } from "../../services/api";

interface CoverLetterModalProps {
  result: CoverLetterResult | null;
  loading: boolean;
  error: string;
  exporting: boolean;
  onClose: () => void;
  onExport: (editedText: string, paragraphs: string[]) => void;
}

export default function CoverLetterModal({
  result,
  loading,
  error,
  exporting,
  onClose,
  onExport,
}: CoverLetterModalProps) {
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (result?.full_text) {
      setDraft(result.full_text);
    } else if (result) {
      setDraft(
        [
          result.salutation,
          ...(result.body_paragraphs || []),
          result.closing,
          result.candidate_name,
        ]
          .filter(Boolean)
          .join("\n\n")
      );
    } else {
      setDraft("");
    }
    setCopied(false);
  }, [result]);

  if (!loading && !error && !result) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const paragraphsFromDraft = () => {
    const chunks = draft
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    // Drop salutation/closing/name bookends when possible
    if (chunks.length >= 5) {
      return chunks.slice(1, -2);
    }
    if (result?.body_paragraphs?.length) {
      return result.body_paragraphs;
    }
    return chunks;
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close cover letter modal"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl border border-amber-500/30 bg-[#0d0e12] shadow-2xl shadow-amber-500/10 flex flex-col">
        <div className="px-5 sm:px-7 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black">
                Agent 3
              </span>
              <span className="text-xs font-bold text-gray-400">Cover Letter via Groq</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white font-display tracking-tight">
              {result ? `Cover Letter for ${result.job_title}` : "Drafting Cover Letter"}
            </h2>
            {result && (
              <p className="text-xs text-amber-400 font-semibold mt-0.5">{result.company_name}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {result && (
              <>
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/15 transition-colors"
                >
                  {copied ? "Copied" : "Copy to Clipboard"}
                </button>
                <button
                  onClick={() => onExport(draft, paragraphsFromDraft())}
                  disabled={exporting}
                  className="px-4 py-2.5 rounded-xl font-display font-black text-xs bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
                >
                  {exporting ? "Preparing PDF..." : "Download PDF"}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-3 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-5 sm:p-7 space-y-4">
          {loading && (
            <div className="p-10 rounded-3xl border border-amber-500/30 bg-black/50 text-center space-y-4">
              <svg className="animate-spin h-8 w-8 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-black text-white font-display">Drafting tailored cover letter...</p>
              <p className="text-xs text-gray-400">
                Aligning your experience and projects to this role with Groq while keeping facts truthful.
              </p>
              <div className="h-48 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {result && !loading && (
            <>
              <div className="p-4 rounded-2xl border border-white/10 bg-black/40 text-xs text-gray-400 space-y-1">
                <p>
                  <span className="text-gray-500">Candidate:</span>{" "}
                  <span className="text-gray-200">{result.header?.candidate_name || result.candidate_name}</span>
                </p>
                <p>
                  <span className="text-gray-500">Source:</span>{" "}
                  <span className="text-amber-300">
                    {result.use_tailored ? "Tailored resume variant" : "Original resume"}
                  </span>
                </p>
              </div>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full min-h-[360px] rounded-2xl border border-white/15 bg-neutral-900/90 text-sm text-gray-100 leading-relaxed p-5 font-sans focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 resize-y"
                spellCheck
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-200 bg-white/5 hover:bg-white/10 border border-white/15 transition-colors"
                >
                  {copied ? "Copied" : "Copy to Clipboard"}
                </button>
                <button
                  onClick={() => onExport(draft, paragraphsFromDraft())}
                  disabled={exporting}
                  className="px-5 py-2.5 rounded-xl font-display font-black text-xs bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  Download PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
