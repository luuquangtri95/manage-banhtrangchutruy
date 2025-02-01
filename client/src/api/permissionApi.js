import authorizedAxiosInstance from "../utils/authorizedAxios";

const PermissionApi = {
	create: async (data) => {
		const url = "/dashboards/permissions/create";
		return await authorizedAxiosInstance.post(url, data);
	},
	findAll: async (params) => {
		const url = "/dashboards/permissions";
		return await authorizedAxiosInstance.get(url, { params });
	},
	findById: async (permissionId) => {
		const url = `/dashboards/permissions/${permissionId}`;
		return await authorizedAxiosInstance.get(url);
	},
	update: async (data) => {
		const url = `/dashboards/permissions/${data.id}`;
		return await authorizedAxiosInstance.put(url, data);
	},
	delete: async (permissionId) => {
		const url = `/dashboards/permissions/${permissionId}`;
		return await authorizedAxiosInstance.delete(url);
	},
};

export default PermissionApi;
