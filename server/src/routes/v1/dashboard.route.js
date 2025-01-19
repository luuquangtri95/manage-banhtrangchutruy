import express from "express";
import { DashboardControllers } from "~/controllers/dashboard.controller";
import { OrderController } from "~/controllers/order.controller";
import { ProductController } from "~/controllers/product.controller";
import { AuthMiddleware } from "~/middlewares/auth.middleware";

const Router = express.Router();

Router.route("/access").get(AuthMiddleware.isAuthorized, DashboardControllers.access);

//#region [PRODUCTS]
Router.route("/products/create").post(AuthMiddleware.isAuthorized, ProductController.create);
Router.route("/products").get(AuthMiddleware.isAuthorized, ProductController.findAll);
Router.route("/products/:productId").get(AuthMiddleware.isAuthorized, ProductController.findById);
Router.route("/products/:productId").put(AuthMiddleware.isAuthorized, ProductController.update);
Router.route("/products/:productId").delete(AuthMiddleware.isAuthorized, ProductController.delete);
//#endregion

//#region [ORDERS]
Router.route("/orders/create").post(AuthMiddleware.isAuthorized, OrderController.create);
Router.route("/orders").get(AuthMiddleware.isAuthorized, OrderController.findAll);
Router.route("/orders/:orderId").get(AuthMiddleware.isAuthorized, OrderController.findById);
Router.route("/orders/:orderId").put(AuthMiddleware.isAuthorized, OrderController.update);
Router.route("/orders/:orderId").delete(AuthMiddleware.isAuthorized, OrderController.delete);
//#endregion

//#region [CATEGORIES]
// Router.route("/categories/create").post(AuthMiddleware.isAuthorized, OrderController.create);
// Router.route("/categories").get(AuthMiddleware.isAuthorized, OrderController.findAll);
// Router.route("/categories/:categoryId").get(AuthMiddleware.isAuthorized, OrderController.findById);
// Router.route("/categories/:categoryId").put(AuthMiddleware.isAuthorized, OrderController.update);
// Router.route("/categories/:categoryId").delete(AuthMiddleware.isAuthorized, OrderController.delete);
//#endregion
export const DashboardRoute = Router;
