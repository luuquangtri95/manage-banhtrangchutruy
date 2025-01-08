import { CategoryModel } from "~/models/category.model";

const create = async (payload) => {
	try {
	} catch (error) {
		throw error;
	}
};

const findAll = async () => {
	try {
	} catch (error) {
		throw error;
	}
};

const findById = async (id) => {
	try {
		return await CategoryModel.findOne({ where: { id } });
	} catch (error) {
		throw error;
	}
};

const update = async (payload) => {
	try {
		const { data, id } = payload;
	} catch (error) {
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await CategoryModel.destroy({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const CategoryRepository = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
