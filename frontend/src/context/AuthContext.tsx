import React, { createContext, useContext, useState, useEffect } from "react";
import { UserPayload, loginApi, signupApi } from "../services/api";

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { email: string; password: string; full_name: string; role_preference?: string; city?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("navigator_token");
    const savedUser = localStorage.getItem("navigator_user");
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("navigator_token");
        localStorage.removeItem("navigator_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi(email, password);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem("navigator_token", res.access_token);
    localStorage.setItem("navigator_user", JSON.stringify(res.user));
  };

  const signup = async (data: { email: string; password: string; full_name: string; role_preference?: string; city?: string }) => {
    const res = await signupApi(data);
    setToken(res.access_token);
    setUser(res.user);
    localStorage.setItem("navigator_token", res.access_token);
    localStorage.setItem("navigator_user", JSON.stringify(res.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("navigator_token");
    localStorage.removeItem("navigator_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
