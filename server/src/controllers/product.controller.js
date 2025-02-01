import { StatusCodes } from "http-status-codes";
import { ProductService } from "~/services/product.service";

const create = async (req, res) => {
	try {
		const metadata = await ProductService.create(req);

		res.status(StatusCodes.OK).json({
			metadata,
			message: "create product success !",
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findAll = async (req, res) => {
	try {
		const metadata = await ProductService.findAll(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findById = async (req, res) => {
	try {
		const metadata = await ProductService.findById(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const update = async (req, res) => {
	try {
		const metadata = await ProductService.update(req);

		res.status(StatusCodes.OK).json({ message: "update product success !", metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const _delete = async (req, res) => {
	try {
		const metadata = await ProductService.delete(req);

		res.status(StatusCodes.OK).json({ message: "delete product success !" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const ProductController = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
