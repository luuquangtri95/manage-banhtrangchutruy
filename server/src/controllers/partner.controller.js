import { StatusCodes } from "http-status-codes";
import { PartnerService } from "~/services/partner.service";

const create = async (req, res) => {
	try {
		const metadata = await PartnerService.create(req);

		res.status(StatusCodes.OK).json({
			metadata,
			message: "create partner success !",
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findAll = async (req, res) => {
	try {
		const metadata = await PartnerService.findAll(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findById = async (req, res) => {
	try {
		const metadata = await PartnerService.findById(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const update = async (req, res) => {
	try {
		const metadata = await PartnerService.update(req);

		res.status(StatusCodes.OK).json({ message: "update partner success !", metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const _delete = async (req, res) => {
	try {
		const metadata = await PartnerService.delete(req);

		res.status(StatusCodes.OK).json({ message: "delete product success !" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const PartnerController = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
