import api from "./api";

export const invoiceService = {
  list: async () => {
    const { data } = await api.get("/invoice");
    return data.invoice ?? [];
  },
  get: async (id) => {
    const { data } = await api.get(`/invoice/${id}`);
    return data.invoice;
  },
  create: async (payload) => {
    const { data } = await api.post("/invoice", payload);
    return data;
  },
};