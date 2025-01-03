import { OrderRepository } from "~/repositories/order.repository";

const findAll = async (orderId) => {
	try {
		return await OrderRepository.findAll(orderId);
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
	findAll,
};
