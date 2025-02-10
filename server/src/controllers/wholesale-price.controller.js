import { StatusCodes } from "http-status-codes";
import { WholesalePriceService } from "~/services/wholesale-price.service";

const create = async (req, res) => {
	try {
		const metadata = await WholesalePriceService.create(req);

		res.status(StatusCodes.OK).json({
			metadata,
			message: "create wholesale price success !",
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findAll = async (req, res) => {
	try {
		const metadata = await WholesalePriceService.findAll(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findById = async (req, res) => {
	try {
		const metadata = await WholesalePriceService.findById(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const update = async (req, res) => {
	try {
		const metadata = await WholesalePriceService.update(req);

		res.status(StatusCodes.OK).json({ message: "update wholesale price success !", metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const _delete = async (req, res) => {
	try {
		const metadata = await WholesalePriceService.delete(req);

		res.status(StatusCodes.OK).json({ message: "delete wholesale price success !" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const WholesalePriceController = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
