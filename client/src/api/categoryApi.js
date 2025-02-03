import authorizedAxiosInstance from "../utils/authorizedAxios";

const CategoryApi = {
	create: async (data) => {
		const url = "/dashboards/categories/create";
		return await authorizedAxiosInstance.post(url, data);
	},
	findAll: async (params) => {
		const url = "/dashboards/categories";
		return await authorizedAxiosInstance.get(url, { params });
	},
	findById: async (categoryId) => {
		const url = `/dashboards/categories/${categoryId}`;
		return await authorizedAxiosInstance.get(url);
	},
	update: async (data) => {
		const url = `/dashboards/categories/${data.id}`;
		return await authorizedAxiosInstance.put(url, data);
	},
	delete: async (categoryId) => {
		const url = `/dashboards/categories/${categoryId}`;
		return await authorizedAxiosInstance.delete(url);
	},
};

export default CategoryApi;
