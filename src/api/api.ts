import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do NOT retry auth endpoints
    if (
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Try refresh once (optional)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch {
        // ❌ DO NOTHING HERE
        // Let the calling component decide
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const params = new URLSearchParams(window.location.search);
  const resetToken = params.get("token");

  if (resetToken && config.url?.includes("/auth/set-password")) {
    config.headers["x-reset-token"] = resetToken;
  }

  return config;
});

export default api;
