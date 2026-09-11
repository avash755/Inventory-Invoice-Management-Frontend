import api from "./api";

export const customerService = {
  list: async () => {
    const { data } = await api.get("/customer");
    return data.customers ?? [];
  },
  get: async (id) => {
    const { data } = await api.get(`/customer/${id}`);
    return data.customer;
  },
  create: async (payload) => {
    const { data } = await api.post("/customer", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.patch(`/customer/${id}`, payload);
    return data;
  },
};