import authorizedAxiosInstance from "../utils/authorizedAxios";

const WholesaleGroupApi = {
	create: async (data) => {
		const url = "/dashboards/wholesale-groups/create";
		return await authorizedAxiosInstance.post(url, data);
	},
	findAll: async (params) => {
		const url = "/dashboards/wholesale-groups";
		return await authorizedAxiosInstance.get(url, { params });
	},
	findById: async (groupId) => {
		const url = `/dashboards/wholesale-groups/${groupId}`;
		return await authorizedAxiosInstance.get(url);
	},
	update: async (data) => {
		const url = `/dashboards/wholesale-groups/${data.id}`;
		return await authorizedAxiosInstance.put(url, data);
	},
	delete: async (groupId) => {
		const url = `/dashboards/wholesale-groups/${groupId}`;
		return await authorizedAxiosInstance.delete(url);
	},
};

export default WholesaleGroupApi;
