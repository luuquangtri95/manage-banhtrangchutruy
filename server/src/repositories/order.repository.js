import { OrderModel } from "~/models/order.model";

const findById = async (id) => {
	try {
		return await OrderModel.findById({ where: { id }, raw: true });
	} catch (error) {
		throw error;
	}
};

const findAll = async (payload) => {
	try {
		const { page, limit } = payload;

		const _offset = (page - 1) * limit;

		const where = {};

		const { count, rows } = await OrderModel.findAndCountAll({
			where,
			limit: limit,
			offset: _offset,
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

const create = async (payload) => {
	try {
		return (await OrderModel.create(payload)).toJSON();
	} catch (error) {
		throw error;
	}
};

export const OrderRepository = {
	create,
	findById,
	findAll,
};
