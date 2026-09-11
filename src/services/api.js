import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach a global 401 listener that AuthContext can subscribe to.
let onUnauthorized = null;
export function setUnauthorizedHandler(fn) { onUnauthorized = fn; }

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    // Don't nuke session on login/verify failures — those are user errors, not expired sessions.
    const url = err?.config?.url || "";
    const isAuthFlow =
      url.includes("/auth/login") ||
      url.includes("/auth/user-verification") ||
      url.includes("/auth/new-password") ||
      url.includes("/auth/verify-changes") ||
      url.includes("/auth/change-password") ||
      url.includes("/auth/send-otp");

    if (status === 401 && !isAuthFlow && onUnauthorized) onUnauthorized();
    return Promise.reject(err);
  }
);

export default api;

// Helper used everywhere: pull a safe error message from a backend error.
export function getErrorMessage(err, fallback = "Something went wrong") {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.Message ||   // backend invoice controller uses capitalized Message
    err?.response?.data?.error?.[0]?.msg ||
    err?.message ||
    fallback
  );
}