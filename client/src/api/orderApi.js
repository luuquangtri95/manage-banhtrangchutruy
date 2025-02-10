import authorizedAxiosInstance from "../utils/authorizedAxios";

const OrderApi = {
  create: async (data) => {
    const url = "/dashboards/orders/create";
    return await authorizedAxiosInstance.post(url, data);
  },
  findAll: async (params) => {
    const url = "/dashboards/orders";
    return await authorizedAxiosInstance.get(url, { params });
  },
  findById: async (id) => {
    const url = `/dashboards/orders/${id}`;
    return await authorizedAxiosInstance.get(url);
  },
  update: async (data) => {
    const url = `/dashboards/orders/${data.id}`;
    return await authorizedAxiosInstance.put(url, data);
  },
  delete: async (id) => {
    const url = `dashboards/orders/${id}`;
    console.log("url", url);
    return await authorizedAxiosInstance.delete(url, id);
  },
};

export default OrderApi;
