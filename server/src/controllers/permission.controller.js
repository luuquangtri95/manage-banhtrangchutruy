import { StatusCodes } from "http-status-codes";

const create = async (req, res) => {
	try {
		res.status(StatusCodes.OK).json({ message: "create permission success" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const PermissionController = { create };
