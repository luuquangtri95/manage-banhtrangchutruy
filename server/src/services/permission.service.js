import { PermissionRepository } from "~/repositories/permission.repository";

const create = async (req) => {
	try {
		const payload = req.body;

		return await PermissionRepository.create(payload);
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
		const _order = req.query.order || "name";

		let payload = {
			page: _page,
			limit: _limit,
			searchTerm: _searchTerm,
			sort: _sort,
			order: _order,
		};

		return await PermissionRepository.findAll({ ...payload });
	} catch (error) {
		throw error;
	}
};

const findById = async (req) => {
	try {
		const { permissionId } = req.params;

		return await PermissionRepository.findById(permissionId);
	} catch (error) {
		throw error;
	}
};

const update = async (req) => {
	try {
		const payload = req.body;
		const { permissionId } = req.params;

		return await PermissionRepository.update(payload, permissionId);
	} catch (error) {
		throw error;
	}
};

const _delete = async (req) => {
	try {
		const { permissionId } = req.params;

		return await PermissionRepository.delete(permissionId);
	} catch (error) {
		throw error;
	}
};

export const PermissionService = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
