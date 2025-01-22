import { Op } from "sequelize";
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
		const { page, limit, searchTerm, sort, order, status } = payload;

		const _offset = (page - 1) * limit;

		let where = {};

		if (searchTerm) {
			where.title = {
				[Op.like]: `%${searchTerm}%`,
			};
		}

		if (status) {
			where.status = status;
		}

		const { count, rows } = await OrderModel.findAndCountAll({
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

const create = async (payload) => {
	try {
		return (await OrderModel.create(payload)).toJSON();
	} catch (error) {
		throw error;
	}
};

const update = async (payload, id) => {
	try {
		return await OrderModel.update({ ...payload }, { where: { id } });
	} catch (error) {
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await OrderModel.destroy({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const OrderRepository = {
	create,
	findById,
	findAll,
	update,
	delete: _delete,
};
