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
