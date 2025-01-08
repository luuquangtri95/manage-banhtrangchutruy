import { ProductModel } from "~/models/product.model";

const create = async (payload) => {
	try {
		return await ProductModel.create(payload);
	} catch (error) {
		throw error;
	}
};

const findAll = async (payload) => {
	try {
		const { page, limit, searchTerm, sort, order } = payload;

		const _offset = (page - 1) * limit;

		let where = {};

		if (searchTerm) {
			where.title = {
				[Op.like]: `%${searchTerm}%`,
			};
		}

		const { count, rows } = await ProductModel.findAndCountAll({
			where,
			limit: limit,
			offset: _offset,
			order: [[order, sort]],
			raw: true,
		});

		const _metadata = {
			result: rows,
			pagination: {
				page: page,
				limit: limit,
				total_page: Math.ceil(count / limit),
				total_item: count,
			},
		};

		return _metadata;
	} catch (error) {
		throw error;
	}
};

export const ProductRepository = {
	create,
	findAll,
};
