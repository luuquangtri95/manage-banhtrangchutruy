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
		const _searchTerm = req.query.searchTerm || "";
		const _sort = req.query.sort || "asc";
		const _order = req.query.order || "title"; // title
		const _status = req.query.status;
		/// ... many queries here

		let payload = {
			page: _page,
			limit: _limit,
			searchTerm: _searchTerm,
			sort: _sort,
			order: _order,
		};

		if (_status) {
			payload.status = _status;
		}

		return await OrderRepository.findAll({ ...payload });
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
