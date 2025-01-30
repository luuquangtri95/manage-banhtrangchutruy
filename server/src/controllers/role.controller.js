import { StatusCodes } from "http-status-codes";
import { RoleModel } from "~/models/role.model";

const create = async (req, res) => {
	try {
		const { name } = req.body;

		await RoleModel.create({ name, description: name });

		res.status(StatusCodes.OK).json({ message: "create role success" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const RoleController = { create };
