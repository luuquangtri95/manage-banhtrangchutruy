import { PartnerModel } from "~/models/partner.model";

const create = async (payload) => {
	try {
		return await PartnerModel.create(payload);
	} catch (error) {
		throw error;
	}
};

const findAll = async (payload) => {
	try {
		const { page, limit, searchTerm, sort, order } = payload;

		const _offset = (page - 1) * limit;

		let where = {};

		if (searchTerm) {
			where.name = {
				[Op.like]: `%${searchTerm}%`,
			};
		}

		const { count, rows } = await PartnerModel.findAndCountAll({
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

const findById = async (id) => {
	try {
		return await PartnerModel.findOne({
			where: {
				id,
			},
		});
	} catch (error) {
		throw error;
	}
};

const update = async (payload, id) => {
	try {
		return await PartnerModel.update({ ...payload }, { where: { id } });
	} catch (error) {
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await PartnerModel.destroy({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const PartnerRepository = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
