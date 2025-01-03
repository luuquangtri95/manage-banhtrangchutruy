import { StatusCodes } from "http-status-codes";
import { OrderService } from "~/services/order.service";

const create = async (req, res) => {
	try {
		const payload = { ...req.body };

		const data = await OrderService.create(payload);

		res.status(StatusCodes.OK).json({
			message: "create data success !",
			metadata: { ...data },
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findAll = async (req, res) => {
	try {
		const orderId = req.params.orderId;
		const metadata = await OrderService.findAll(orderId);

		res.status(StatusCodes.OK).json({
			metadata,
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const OrderController = {
	create,
	findAll,
};
