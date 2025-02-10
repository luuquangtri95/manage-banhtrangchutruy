import authorizedAxiosInstance from "../utils/authorizedAxios";

const WholesalePriceApi = {
	create: async (data) => {
		const url = "/dashboards/wholesale-prices/create";
		return await authorizedAxiosInstance.post(url, data);
	},
	findAll: async (params) => {
		const url = "/dashboards/wholesale-prices";
		return await authorizedAxiosInstance.get(url, { params });
	},
	findById: async (priceId) => {
		const url = `/dashboards/wholesale-prices/${priceId}`;
		return await authorizedAxiosInstance.get(url);
	},
	update: async (data) => {
		const url = `/dashboards/wholesale-prices/${data.id}`;
		return await authorizedAxiosInstance.put(url, data);
	},
	delete: async (priceId) => {
		const url = `/dashboards/wholesale-prices/${priceId}`;
		return await authorizedAxiosInstance.delete(url);
	},
};

export default WholesalePriceApi;
