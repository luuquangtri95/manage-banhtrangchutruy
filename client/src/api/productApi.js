import authorizedAxiosInstance from "../utils/authorizedAxios";

const ProductApi = {
  create: async (data) => {
    const url = "/dashboards/products/create";
    return await authorizedAxiosInstance.post(url, data);
  },
  getAll: async () => {
    const url = "/dashboards/products";
    console.log("url", url);
    return await authorizedAxiosInstance.get(url);
  },
  update: async (id) => {
    const url = "/dashboards/products/id";
    return await authorizedAxiosInstance.put(url, id);
  },
  delete: async (id) => {
    const url = "/dashboards/products/id";
    return await authorizedAxiosInstance.post(url, id);
  },
};

export default ProductApi;
