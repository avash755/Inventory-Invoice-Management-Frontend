import api from "./api";

export const userService = {
  list: async () => {
    const { data } = await api.get("/user");
    return data.users ?? [];
  },
  get: async (id) => {
    const { data } = await api.get(`/user/${id}`);
    return data.user;
  },
  create: async (payload) => {
    const { data } = await api.post("/user/create", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.patch(`/user/${id}`, payload);
    return data;
  },
};