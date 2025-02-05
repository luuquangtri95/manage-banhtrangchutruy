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
	findById: async (orderId) => {
		const url = `/dashboards/orders/${orderId}`;
		return await authorizedAxiosInstance.get(url);
	},
	update: async (data) => {
		const url = `dashboards/orders/${data.id}`;
		return await authorizedAxiosInstance.put(url, data);
	},
	delete: async (orderId) => {
		const url = `dashboards/orders/${orderId}`;
		return await authorizedAxiosInstance.delete(url);
	},
};

export default OrderApi;
