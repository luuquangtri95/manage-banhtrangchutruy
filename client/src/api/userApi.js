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
};

export default UserApi;
