import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 if user is already on login page
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      // Clear token and redirect to login
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),

  signup: (email: string, password: string, username: string) =>
    apiClient.post("/auth/signup", { email, password, username }),
};

export const generationsApi = {
  create: (formData: FormData, signal?: AbortSignal) =>
    apiClient.post("/generations", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal,
    }),

  list: () => apiClient.get("/generations"),
};
