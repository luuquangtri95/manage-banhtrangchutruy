import authorizedAxiosInstance from "../utils/authorizedAxios";

const OrderApi = {
  create: async (data) => {
    const url = "dashboards/orders/create";
    return await authorizedAxiosInstance.post(url, data);
  },
  getAll: async () => {
    const url = "dashboards/orders";
    return await authorizedAxiosInstance.get(url);
  },
  update: async (id) => {
    const url = "dashboards/orders/update/id";
    return await authorizedAxiosInstance.put(url, id);
  },
  delete: async (id) => {
    const url = "dashboards/orders/delete/id";
    return await authorizedAxiosInstance.delete(url, id);
  },
};

export default OrderApi;
