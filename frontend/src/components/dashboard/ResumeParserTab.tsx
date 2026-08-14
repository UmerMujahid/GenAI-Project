import React from "react";
import { ResumeData } from "../../services/api";

interface ResumeParserTabProps {
  resumeData: ResumeData | null;
  uploading: boolean;
  parseStep: string;
  uploadError: string;
  uploadSuccessMsg: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ResumeParserTab({
  resumeData,
  uploading,
  parseStep,
  uploadError,
  uploadSuccessMsg,
  handleFileUpload,
}: ResumeParserTabProps) {
  return (
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

        {uploading ? (
          <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-3 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-xs font-bold text-white font-display tracking-wide">{parseStep}</span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-purple-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        ) : (
          <div className="pt-2">
            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-amber-500/20 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Select PDF File
              <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} className="hidden" />
            </label>
          </div>
        )}
      </div>

      {/* Extracted Resume Components Grid */}
      {resumeData && (
        <div className="p-6 md:p-8 rounded-3xl border border-white/20 bg-neutral-900/90 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white font-display">Extracted Resume Components</h2>
              <p className="text-xs text-gray-300 font-sans mt-0.5">Parsed via LangChain & Groq GPT-OSS-120B model</p>
            </div>

            <span
              className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-display font-bold uppercase tracking-wider border shadow-sm ${
                resumeData.parser_mode?.includes("LLM")
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
              <span className="leading-none">Mode: {resumeData.parser_mode || "LLM Agent"}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Contact Details Card */}
            <div className="p-5 rounded-2xl border border-white/15 bg-black/40 space-y-2">
              <h3 className="text-xs font-display font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Candidate Profile
              </h3>
              <p className="text-lg font-black text-white">{resumeData.contact_info?.name || "Not Found"}</p>
              <div className="space-y-1 text-xs text-gray-300 font-sans">
                <p>
                  <strong className="text-gray-400 font-medium">Email:</strong> {resumeData.contact_info?.email || "N/A"}
                </p>
                <p>
                  <strong className="text-gray-400 font-medium">Phone:</strong> {resumeData.contact_info?.phone || "N/A"}
                </p>
                <p>
                  <strong className="text-gray-400 font-medium">Location:</strong> {resumeData.contact_info?.location || "N/A"}
                </p>
              </div>
            </div>

            {/* Candidate Summary Card */}
            <div className="p-5 rounded-2xl border border-white/15 bg-black/40 space-y-2 md:col-span-2">
              <h3 className="text-xs font-display font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Professional Summary
              </h3>
              <p className="text-xs text-gray-200 leading-relaxed font-sans font-medium">{resumeData.summary || "No summary extracted."}</p>
            </div>
          </div>

          {/* Technical Skills Extracted */}
          <div className="space-y-3">
            <h3 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-4 bg-amber-500 rounded-sm"></span>
              Technical Skills & Competencies ({resumeData.skills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills?.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white-500/10 border border-white-500/30 text-white-300 shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          {resumeData.experience && resumeData.experience.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-4 bg-purple-500 rounded-sm"></span>
                Work Experience & Internships
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-xs">
                    <p className="font-bold text-white text-sm">{exp.role || exp.title}</p>
                    <p className="text-amber-400 font-semibold">{exp.company || exp.organization}</p>
                    <p className="text-gray-400">{exp.duration || exp.dates}</p>
                    <p className="text-gray-300 font-sans mt-1">{exp.description || exp.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-4 bg-emerald-500 rounded-sm"></span>
                Academic Education
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.education.map((edu: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-xs">
                    <p className="font-bold text-white text-sm">{edu.degree}</p>
                    <p className="text-emerald-400 font-semibold">{edu.institution || edu.university}</p>
                    <p className="text-gray-400">{edu.year || edu.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-4 bg-amber-500 rounded-sm"></span>
                Key Projects & Systems
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumeData.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-xs">
                    <p className="font-bold text-amber-300 text-sm">{proj.name || proj.title}</p>
                    <p className="text-white-300 font-sans">{proj.description}</p>
                    {proj.technologies && <p className="text-gray-400 text-[11px]">Tech: {proj.technologies.join(", ")}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
