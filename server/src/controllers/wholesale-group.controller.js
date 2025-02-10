import { StatusCodes } from "http-status-codes";
import { WholesaleGroupService } from "~/services/wholesale-group.service";

const create = async (req, res) => {
	try {
		const metadata = await WholesaleGroupService.create(req);

		res.status(StatusCodes.OK).json({
			metadata,
			message: "create wholesale group success !",
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findAll = async (req, res) => {
	try {
		const metadata = await WholesaleGroupService.findAll(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findById = async (req, res) => {
	try {
		const metadata = await WholesaleGroupService.findById(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const update = async (req, res) => {
	try {
		const metadata = await WholesaleGroupService.update(req);

		res.status(StatusCodes.OK).json({ message: "update wholesale group success !", metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const _delete = async (req, res) => {
	try {
		const metadata = await WholesaleGroupService.delete(req);

		res.status(StatusCodes.OK).json({ message: "delete wholesale group success !" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const WholesaleGroupController = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
