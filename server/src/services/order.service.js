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
		const user_id = req.jwtDecoded.id;
		const _page = req.query.page ? parseInt(req.query.page) : 1;
		const _limit = req.query.limit ? parseInt(req.query.limit) : 10;
		const _searchTerm = req.query.searchTerm || "";
		const _sort = req.query.sort || "desc";
		const _order = req.query.order || "createdAt";
		const _status = req.query.status;
		const _startDate = req.query.startDate || "";
		const _endDate = req.query.endDate || "";
		/// ... many queries here
		// console.log("_startDate", _startDate);
		// console.log("_endDate", _endDate);

		let payload = {
			user_id,
			page: _page,
			limit: _limit,
			searchTerm: _searchTerm,
			sort: _sort,
			order: _order,
			startDate: _startDate,
			endDate: _endDate,
		};

		if (_status) {
			payload.status = _status;
		}

		return await OrderRepository.findAll({ ...payload });
	} catch (error) {
		throw error;
	}
};

const create = async (req) => {
	try {
		const payload = req.body;
		const userInfo = req.jwtDecoded;
		console.log("payload", payload);
		console.log("userInfo", userInfo);
		return await OrderRepository.createWithTransaction({
			...payload,
			user_id: userInfo.id,
		});
	} catch (error) {
		throw error;
	}
};

const update = async (req) => {
	try {
		const payload = req.body;
		const orderId = req.params.orderId;

		return await OrderRepository.update(payload, orderId);
	} catch (error) {
		throw error;
	}
};

const _delete = async (req) => {
	try {
		const orderId = req.params.orderId;

		return await OrderRepository.delete(orderId);
	} catch (error) {
		throw error;
	}
};

export const OrderService = {
	create,
	findById,
	findAll,
	update,
	delete: _delete,
};
