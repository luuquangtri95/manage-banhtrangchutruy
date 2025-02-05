import express from "express";
import { OrderController } from "~/controllers/order.controller";

const Router = express.Router();

Router.route("/").get(OrderController.findAll);
Router.route("/create").post(OrderController.create);
// Router.route("/:orderId").get(OrderController.findAll);
Router.route("/:orderId").get(OrderController.findById);
Router.route("/update/:orderId").put(OrderController.update);
Router.route("/delete/:orderId").delete(OrderController.delete);

export const OrderRoute = Router;
