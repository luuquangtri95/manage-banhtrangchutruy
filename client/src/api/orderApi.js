import authorizedAxiosInstance from "../utils/authorizedAxios";

const OrderApi = {
  create: async (data) => {
    const url = "/orders/create";
    return await authorizedAxiosInstance.post(url, data);
  },
  getAll: async (data) => {
    const url = "/orders";
    return await authorizedAxiosInstance.get(url, data);
  },
  update: async (id) => {
    const url = "/orders/update/id";
    return await authorizedAxiosInstance.put(url, id);
  },
  delete: async (id) => {
    const url = "/orders/delete/id";
    return await authorizedAxiosInstance.delete(url, id);
  },
};

export default OrderApi;
