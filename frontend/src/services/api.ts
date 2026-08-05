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
  contact_info?: {
    name?: string;
    email?: string;
    phone?: string;
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

export const getInternshipsApi = async (platform?: string) => {
  const response = await api.get("/internships", {
    params: { platform: platform || "all" },
  });
  return response.data;
};
