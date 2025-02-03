import { CategoryRepository } from "~/repositories/category.repository";

const create = async (req) => {
	try {
		const payload = req.body;

		return await CategoryRepository.create(payload);
	} catch (error) {
		throw error;
	}
};

const findAll = async (req) => {
	try {
		const _page = req.query.page ? parseInt(req.query.page) : 1;
		const _limit = req.query.limit ? parseInt(req.query.limit) : 10;
		const _searchTerm = req.query.searchTerm || "";
		const _sort = req.query.sort || "desc";
		const _order = req.query.order || "createdAt";
		/// ... many queries here

		let payload = {
			page: _page,
			limit: _limit,
			searchTerm: _searchTerm,
			sort: _sort,
			order: _order,
		};

		return await CategoryRepository.findAll({ ...payload });
	} catch (error) {
		throw error;
	}
};

const findById = async (req) => {
	try {
		const { categoryId } = req.params;

		return await CategoryRepository.findById(categoryId);
	} catch (error) {
		throw error;
	}
};

const update = async (req) => {
	try {
		const payload = req.body;
		const { categoryId } = req.params;

		return await CategoryRepository.update(payload, categoryId);
	} catch (error) {
		throw error;
	}
};

const _delete = async (req) => {
	try {
		const { categoryId } = req.params;

		return await CategoryRepository.delete(categoryId);
	} catch (error) {
		throw error;
	}
};

export const CategoryService = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
