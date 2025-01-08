import { ProductRepository } from "~/repositories/product.repository";

const create = async (req) => {
	try {
		const payload = req.body;

		return await ProductRepository.create(payload);
	} catch (error) {
		throw error;
	}
};

const findAll = async (req) => {
	try {
		const _page = req.query.page ? parseInt(req.query.page) : 1;
		const _limit = req.query.limit ? parseInt(req.query.limit) : 10;
		const _searchTerm = req.query.searchTerm || "";
		const _sort = req.query.sort || "asc";
		const _order = req.query.order || "name";
		/// ... many queries here

		let payload = {
			page: _page,
			limit: _limit,
			searchTerm: _searchTerm,
			sort: _sort,
			order: _order,
		};

		return await ProductRepository.findAll({ ...payload });
	} catch (error) {
		throw error;
	}
};

export const ProductService = {
	create,
	findAll,
};
