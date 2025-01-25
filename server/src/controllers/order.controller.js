import { StatusCodes } from "http-status-codes";
import { OrderService } from "~/services/order.service";

const create = async (req, res) => {
  try {
    const metadata = await OrderService.create(req);

    res.status(StatusCodes.OK).json({
      message: "create data success !",
      metadata,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const findAll = async (req, res) => {
  try {
    const metadata = await OrderService.findAll(req);

    res.status(StatusCodes.OK).json({ metadata });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const findById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const metadata = await OrderService.findById(orderId);

    res.status(StatusCodes.OK).json({
      metadata,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const update = async (req, res) => {
  try {
    const metadata = await OrderService.update(req);

    res
      .status(StatusCodes.OK)
      .json({ message: "update order success !", metadata });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const _delete = async (req, res) => {
  try {
    const metadata = await OrderService.delete(req);

    res.status(StatusCodes.OK).json({ message: "delete order success !" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

export const OrderController = {
  create,
  findById,
  findAll,
  update,
  delete: _delete,
};
