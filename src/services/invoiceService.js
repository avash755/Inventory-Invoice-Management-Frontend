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
  recordPayment: (id, amount) => api.post(`/invoice/${id}/payment`, { amount }).then(r => r.data),
  approve:    (id) => api.post(`/invoice/${id}/approve`).then(r => r.data),
  sendBack:   (id, body) => api.post(`/invoice/${id}/send-back`, body).then(r => r.data),
  resubmit:   (id) => api.post(`/invoice/${id}/resubmit`).then(r => r.data),
  update:     (id, body) => api.patch(`/invoice/${id}`, body).then(r => r.data),
};