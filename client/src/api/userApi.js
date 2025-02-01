import authorizedAxiosInstance from "../utils/authorizedAxios";

const UserApi = {
	login: async (data) => {
		const url = "/users/login";
		return await authorizedAxiosInstance.post(url, data);
	},
	logout: async () => {
		const url = "/users/logout";
		return await authorizedAxiosInstance.delete(url);
	},
	refresh_token: async () => {
		const url = "/users/refresh_token";
		return await authorizedAxiosInstance.put(url);
	},
	register: async (data) => {
		const url = "/users/register";
		return await authorizedAxiosInstance.post(url, data);
	},

	// -----------------------------
	create: async (data) => {
		const url = "/dashboards/users/create";
		return await authorizedAxiosInstance.post(url, data);
	},
	findAll: async (params) => {
		const url = "/dashboards/users";
		return await authorizedAxiosInstance.get(url, { params });
	},
	findById: async (userId) => {
		const url = `/dashboards/users/${userId}`;
		return await authorizedAxiosInstance.get(url);
	},
	update: async (data) => {
		const url = `/dashboards/users/${data.id}`;
		return await authorizedAxiosInstance.put(url, data);
	},
	delete: async (userId) => {
		const url = `/dashboards/users/${userId}`;
		return await authorizedAxiosInstance.delete(url);
	},
};

export default UserApi;
