import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("navigator_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export interface UserPayload {
  id: string;
  email: string;
  full_name: string;
  role_preference?: string;
  city?: string;
  skills?: string[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: UserPayload;
}

export interface ResumeData {
  id: string;
  user_id: string;
  filename: string;
  summary?: string;
  parser_mode?: string;
  contact_info?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    github?: string;
    location?: string;
  };
  skills?: string[];
  education?: Array<{ details?: string; institution?: string; degree?: string }>;
  experience?: Array<{ description?: string; title?: string; company?: string }>;
  projects?: Array<{ title?: string; description?: string }>;
  certifications?: string[];
  volunteer_work?: Array<{ activity?: string }>;
  raw_text?: string;
  created_at?: string;
}

export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
};

export const signupApi = async (data: {
  email: string;
  password: string;
  full_name: string;
  role_preference?: string;
  city?: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", data);
  return response.data;
};

export const uploadResumeApi = async (userId: string, file: File): Promise<ResumeData> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<ResumeData>(`/resume/upload?user_id=${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getLatestResumeApi = async (userId: string): Promise<ResumeData | null> => {
  const response = await api.get<ResumeData | null>(`/resume/user/${userId}`);
  return response.data;
};

export interface MatchedJobData {
  id: string;
  user_id: string;
  job_api_id?: string;
  title: string;
  organization: string;
  organization_url?: string;
  apply_url?: string;
  date_posted?: string;
  employment_type?: string[];

  salary_currency?: string;
  salary_min?: number;
  salary_max?: number;
  salary_unit?: string;

  work_arrangement?: string;
  experience_level?: string;
  education?: string[];
  visa_sponsorship?: boolean;

  key_skills?: string[];
  core_responsibilities?: string;
  requirements_summary?: string;
  benefits?: string[];

  match_score: number;
  matching_skills?: string[];
  missing_skills?: string[];
  reasoning?: string;
  source_platform?: string;
  discovered_at?: string;
}

export const discoverJobsApi = async (userId: string): Promise<MatchedJobData[]> => {
  const response = await api.post<MatchedJobData[]>(`/jobs/discover/${userId}`);
  return response.data;
};

export const getMatchedJobsApi = async (userId: string): Promise<MatchedJobData[]> => {
  const response = await api.get<MatchedJobData[]>(`/jobs/matched/${userId}`);
  return response.data;
};

export const getInternshipsApi = async (platform?: string) => {
  const response = await api.get("/internships", {
    params: { platform: platform || "all" },
  });
  return response.data;
};

export interface TailoredProject {
  title: string;
  bullets?: string[];
  description?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface TailorResumeResult {
  id: string;
  resume_id: string;
  job_id: string;
  job_title: string;
  organization: string;
  original: {
    summary?: string;
    skills?: string[];
    projects?: Array<{ title?: string; description?: string }>;
  };
  tailored: {
    professional_summary: string;
    prioritized_skills: string[];
    skill_groups: SkillGroup[];
    projects: TailoredProject[];
    highlighted_keywords: string[];
    tailoring_notes?: string;
  };
  contact_info?: ResumeData["contact_info"];
  education?: ResumeData["education"];
  experience?: ResumeData["experience"];
  certifications?: string[] | Array<Record<string, string>>;
  achievements?: string[] | Array<Record<string, string>>;
  languages?: Array<{ language?: string; proficiency?: string }>;
  volunteer_work?: Array<{ activity?: string }>;
  section_order?: string[];
  subtitle?: string;
  raw_text?: string;
  created_at?: string;
}

export const tailorResumeApi = async (resumeId: string, jobId: string): Promise<TailorResumeResult> => {
  const response = await api.post<TailorResumeResult>("/agents/tailor-resume", {
    resume_id: resumeId,
    job_id: jobId,
  });
  return response.data;
};

export const exportTailoredResumePdfApi = async (payload: {
  job_title?: string;
  organization?: string;
  contact_info?: ResumeData["contact_info"];
  professional_summary: string;
  prioritized_skills: string[];
  skill_groups: SkillGroup[];
  projects: TailoredProject[];
  education?: ResumeData["education"];
  experience?: ResumeData["experience"];
  certifications?: TailorResumeResult["certifications"];
  achievements?: TailorResumeResult["achievements"];
  languages?: TailorResumeResult["languages"];
  volunteer_work?: TailorResumeResult["volunteer_work"];
  section_order?: string[];
  subtitle?: string;
  raw_text?: string;
}): Promise<void> => {
  const response = await api.post("/agents/export-resume-pdf", payload, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Tailored_Resume.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export interface CoverLetterHeader {
  candidate_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
}

export interface CoverLetterResult {
  id: string;
  resume_id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  use_tailored: boolean;
  header: CoverLetterHeader;
  salutation: string;
  body_paragraphs: string[];
  closing: string;
  candidate_name: string;
  full_text: string;
  created_at?: string;
}

export const generateCoverLetterApi = async (payload: {
  resume_id: string;
  job_id: string;
  company_name?: string;
  use_tailored?: boolean;
}): Promise<CoverLetterResult> => {
  const response = await api.post<CoverLetterResult>("/agents/generate-cover-letter", {
    resume_id: payload.resume_id,
    job_id: payload.job_id,
    company_name: payload.company_name || "",
    use_tailored: payload.use_tailored ?? true,
  });
  return response.data;
};

export const exportCoverLetterPdfApi = async (payload: {
  company_name?: string;
  job_title?: string;
  header?: CoverLetterHeader;
  salutation?: string;
  body_paragraphs?: string[];
  closing?: string;
  candidate_name?: string;
  full_text?: string;
}): Promise<void> => {
  const response = await api.post("/agents/export-cover-letter-pdf", payload, {
    responseType: "blob",
  });
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const company = (payload.company_name || "Company").replace(/[^A-Za-z0-9._-]+/g, "_");
  link.href = url;
  link.download = `Cover_Letter_${company}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
