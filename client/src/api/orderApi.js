import authorizedAxiosInstance from "../utils/authorizedAxios";

const OrderApi = {
  create: async (data) => {
    const url = "/dashboards/orders/create";
    // console.log("data", data);
    return await authorizedAxiosInstance.post(url, data);
  },
  findAll: async (params) => {
    // console.log("params", params);
    const url = "/dashboards/orders";
    // const fullUrl = `${url}?${new URLSearchParams(params).toString()}`;
    // console.log("fullUrl", fullUrl);
    return await authorizedAxiosInstance.get(url, { params });
  },
  findById: async (id) => {
    const url = `/dashboards/orders/${id}`;
    return await authorizedAxiosInstance.get(url);
  },
  update: async (id) => {
    const url = "dashboards/orders/update/id";
    return await authorizedAxiosInstance.put(url, id);
  },
  delete: async (id) => {
    const url = `dashboards/orders/${id}`;
    console.log("url", url);
    return await authorizedAxiosInstance.delete(url, id);
  },
};

export default OrderApi;
