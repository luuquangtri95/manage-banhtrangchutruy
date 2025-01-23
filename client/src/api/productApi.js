import authorizedAxiosInstance from "../utils/authorizedAxios";

const ProductApi = {
	create: async (data) => {
		const url = "/dashboards/products/create";
		return await authorizedAxiosInstance.post(url, data);
	},
	findAll: async (params) => {
		const url = "/dashboards/products";
		return await authorizedAxiosInstance.get(url, { params });
	},
	findById: async (productId) => {
		const url = `/dashboards/products/${productId}`;
		return await authorizedAxiosInstance.get(url);
	},
	update: async (data) => {
		const url = `/dashboards/products/${data.id}`;
		return await authorizedAxiosInstance.put(url, data);
	},
	delete: async (productId) => {
		const url = `/dashboards/products/${productId}`;
		return await authorizedAxiosInstance.delete(url);
	},
};

export default ProductApi;
