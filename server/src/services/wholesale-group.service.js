import { WholesaleGroupRepository } from "~/repositories/wholesale-group.repository";

const create = async (req) => {
	try {
		const payload = req.body;

		return await WholesaleGroupRepository.create(payload);
	} catch (error) {
		throw error;
	}
};

const update = async (req) => {
	try {
		const payload = req.body;
		const { groupId } = req.params;

		return await WholesaleGroupRepository.update(payload, groupId);
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
		/// ... many queries here

		let payload = {
			page: _page,
			limit: _limit,
			searchTerm: _searchTerm,
			sort: _sort,
			order: _order,
		};

		return await WholesaleGroupRepository.findAll({ ...payload });
	} catch (error) {
		throw error;
	}
};

const findById = async (req) => {
	try {
		const groupId = req.params.groupId;

		return await WholesaleGroupRepository.findById(groupId);
	} catch (error) {
		throw error;
	}
};

const _delete = async (req) => {
	try {
		const groupId = req.params.groupId;

		return await WholesaleGroupRepository.delete(groupId);
	} catch (error) {
		throw error;
	}
};

export const WholesaleGroupService = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
