import { OrderRepository } from "~/repositories/order.repository";

const findById = async (orderId) => {
	try {
		return await OrderRepository.findById(orderId);
	} catch (error) {
		throw error;
	}
};

const findAll = async (req) => {
	try {
		const _page = req.query.page ? parseInt(req.query.page) : 1;
		const _limit = req.query.limit ? parseInt(req.query.limit) : 10;
		/// ... many queries here

		return await OrderRepository.findAll({ page: _page, limit: _limit });
	} catch (error) {
		throw error;
	}
};

const create = async (payload) => {
	try {
		return await OrderRepository.create(payload);
	} catch (error) {
		throw error;
	}
};

export const OrderService = {
	create,
	findById,
	findAll,
};
