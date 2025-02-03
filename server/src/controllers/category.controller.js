import { StatusCodes } from "http-status-codes";
import { CategoryService } from "~/services/category.service";

const create = async (req, res) => {
	try {
		const metadata = await CategoryService.create(req);

		res.status(StatusCodes.OK).json({
			metadata,
			message: "create category success !",
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findAll = async (req, res) => {
	try {
		const metadata = await CategoryService.findAll(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findById = async (req, res) => {
	try {
		const metadata = await CategoryService.findById(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const update = async (req, res) => {
	try {
		const metadata = await CategoryService.update(req);

		res.status(StatusCodes.OK).json({ message: "update category success !", metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const _delete = async (req, res) => {
	try {
		const metadata = await CategoryService.delete(req);

		res.status(StatusCodes.OK).json({ message: "delete category success !" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const CategoryController = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
