import { OrderModel } from "~/models/order.model";

const findAll = async (id) => {
	try {
		return await OrderModel.findAll({ where: { id }, raw: true });
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
	findAll,
};
