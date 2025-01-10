import authorizedAxiosInstance from "../utils/authorizedAxios";

const UserApis = {
	login: async (data) => {
		const url = "/users/login";
		return await authorizedAxiosInstance.post(url, data);
	},
	logout: async () => {},
	register: async (data) => {
		const url = "/users/register";
		return await authorizedAxiosInstance.post(url, data);
	},
};

export default UserApis;
