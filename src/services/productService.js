import api from "./api";

export const productService = {
  list: async () => {
    const { data } = await api.get("/product");
    return data.product ?? [];
  },
  get: async (id) => {
    const { data } = await api.get(`/product/${id}`);
    return data.product;
  },
  create: async (payload) => {
    const { data } = await api.post("/product", payload);
    return data;
  },
  update: async (id, payload) => {
    const { data } = await api.patch(`/product/${id}`, payload);
    return data;
  },
  adjustStock: async (id, { quantity, type }) => {
    const { data } = await api.post(`/product/${id}/stock`, { quantity, type });
    return data;
  },
  stockHistory: async (id) => {
    const { data } = await api.get(`/product/${id}/stock-history`);
    return data.history ?? [];
  },
  recentActivity: async (limit = 10) => {
    const { data } = await api.get(`/product/stock-activity?limit=${limit}`);
    return data.history ?? [];
  },
};