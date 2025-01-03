import express from "express";
import { OrderController } from "~/controllers/order.controller";

const Router = express.Router();

Router.route("/create").post(OrderController.create);
Router.route("/:orderId").get(OrderController.findAll);

export const OrderRoute = Router;
