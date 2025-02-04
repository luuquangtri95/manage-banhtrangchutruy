import authorizedAxiosInstance from "../utils/authorizedAxios";

const PartnerApi = {
	create: async (data) => {
		const url = "/dashboards/partners/create";
		return await authorizedAxiosInstance.post(url, data);
	},
	findAll: async (params) => {
		const url = "/dashboards/partners";
		return await authorizedAxiosInstance.get(url, { params });
	},
	findById: async (partnerId) => {
		const url = `/dashboards/partners/${partnerId}`;
		return await authorizedAxiosInstance.get(url);
	},
	update: async (data) => {
		const url = `/dashboards/partners/${data.id}`;
		return await authorizedAxiosInstance.put(url, data);
	},
	delete: async (partnerId) => {
		const url = `/dashboards/partners/${partnerId}`;
		return await authorizedAxiosInstance.delete(url);
	},
};

export default PartnerApi;
