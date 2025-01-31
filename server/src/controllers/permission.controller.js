import { StatusCodes } from "http-status-codes";
import { PermissionService } from "~/services/permission.service";

const create = async (req, res) => {
	try {
		res.status(StatusCodes.OK).json({ message: "create permission success" });
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

export const PermissionController = { create, findAll };
