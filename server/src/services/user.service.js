import { UserRepository } from "~/repositories/user.repository";

const create = async (req) => {
	try {
		const payload = req.body;

		return await UserRepository.create(payload);
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

		let payload = {
			page: _page,
			limit: _limit,
			searchTerm: _searchTerm,
			sort: _sort,
			order: _order,
		};

		return await UserRepository.findAll({ ...payload });
	} catch (error) {
		throw error;
	}
};

const findById = async (req) => {
	try {
		const { userId } = req.params;

		return await UserRepository.findById(userId);
	} catch (error) {
		throw error;
	}
};

const update = async (req) => {
	try {
		const payload = req.body;
		const { userId } = req.params;

		return await UserRepository.update(payload, userId);
	} catch (error) {
		throw error;
	}
};

const _delete = async (req) => {
	try {
		const { userId } = req.params;

		return await UserRepository.delete(userId);
	} catch (error) {
		throw error;
	}
};

export const UserService = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
