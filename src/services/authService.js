import api from "./api";

export const authService = {
  login: async ({ username, email, password }) => {
    const { data } = await api.post("/auth/login", { username, email, password });
    // Normalize backend's `user.user` (username field) → `username`
    const u = data.user || {};
    return {
      message: data.message,
      user: {
        id: u.id,
        username: u.user ?? u.username,
        email: u.email,
        role: u.role,
      },
    };
  },

  me: async () => {
    const { data } = await api.get("/auth/me");
    const u = data.user || {};
    return {
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
    };
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  verifyEmail: async ({ email, code }) => {
    const { data } = await api.post("/auth/user-verification", { email, code });
    return data;
  },

  sendOtp: async (email) => {
    const { data } = await api.post("/auth/send-otp", { email });
    return data;
  },

  requestPasswordReset: async (email) => {
    const { data } = await api.post("/auth/change-password", { email });
    return data;
  },

  verifyResetCode: async (code) => {
    const { data } = await api.post("/auth/verify-changes", { code });
    return data;
  },

  setNewPassword: async (password) => {
    const { data } = await api.post("/auth/new-password", { password });
    return data;
  },

  signupFirstManager: async ({ username, email, password }) => {
    const { data } = await api.post("/auth/signup-manager", { username, email, password });
    return data;
  },
};