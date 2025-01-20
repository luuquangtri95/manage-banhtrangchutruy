import express from "express";
import { DashboardControllers } from "~/controllers/dashboard.controller";
import { OrderController } from "~/controllers/order.controller";
import { ProductController } from "~/controllers/product.controller";

const Router = express.Router();

Router.route("/access").get(DashboardControllers.access);

//#region [PRODUCTS]
Router.route("/products/create").post(ProductController.create);
Router.route("/products").get(ProductController.findAll);
Router.route("/products/:productId").get(ProductController.findById);
Router.route("/products/:productId").put(ProductController.update);
Router.route("/products/:productId").delete(ProductController.delete);
//#endregion

//#region [ORDERS]
Router.route("/orders/create").post(OrderController.create);
Router.route("/orders").get(OrderController.findAll);
Router.route("/orders/:orderId").get(OrderController.findById);
Router.route("/orders/:orderId").put(OrderController.update);
Router.route("/orders/:orderId").delete(OrderController.delete);
//#endregion

//#region [CATEGORIES]
// Router.route("/categories/create").post(AuthMiddleware.isAuthorized, OrderController.create);
// Router.route("/categories").get(AuthMiddleware.isAuthorized, OrderController.findAll);
// Router.route("/categories/:categoryId").get(AuthMiddleware.isAuthorized, OrderController.findById);
// Router.route("/categories/:categoryId").put(AuthMiddleware.isAuthorized, OrderController.update);
// Router.route("/categories/:categoryId").delete(AuthMiddleware.isAuthorized, OrderController.delete);
//#endregion
export const DashboardRoute = Router;
