import { PartnerRepository } from "~/repositories/partner.repository";

const create = async (req) => {
	try {
		const payload = req.body;

		return await PartnerRepository.create(payload);
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

		return await PartnerRepository.findAll({ ...payload });
	} catch (error) {
		throw error;
	}
};

const findById = async (req) => {
	try {
		const { partnerId } = req.params;

		return await PartnerRepository.findById(partnerId);
	} catch (error) {
		throw error;
	}
};

const update = async (req) => {
	try {
		const payload = req.body;
		const { partnerId } = req.params;

		return await PartnerRepository.update(payload, partnerId);
	} catch (error) {
		throw error;
	}
};

const _delete = async (req) => {
	try {
		const { partnerId } = req.params;

		return await PartnerRepository.delete(partnerId);
	} catch (error) {
		throw error;
	}
};

export const PartnerService = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
