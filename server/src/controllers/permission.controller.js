import { StatusCodes } from "http-status-codes";
import { PermissionService } from "~/services/permission.service";

const create = async (req, res) => {
	try {
		const metadata = await PermissionService.create(req);

		res.status(StatusCodes.OK).json({
			metadata,
			message: "create permission success !",
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findAll = async (req, res) => {
	try {
		const metadata = await PermissionService.findAll(req);

		return res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findById = async (req, res) => {
	try {
		const metadata = await PermissionService.findById(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const update = async (req, res) => {
	try {
		const metadata = await PermissionService.update(req);

		res.status(StatusCodes.OK).json({ message: "update product success !", metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const _delete = async (req, res) => {
	try {
		const metadata = await PermissionService.delete(req);

		res.status(StatusCodes.OK).json({ message: "delete product success !" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const PermissionController = { create, findAll, findById, update, delete: _delete };
