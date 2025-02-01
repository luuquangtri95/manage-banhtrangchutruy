import express from "express";
import { DashboardControllers } from "~/controllers/dashboard.controller";
import { OrderController } from "~/controllers/order.controller";
import { PermissionController } from "~/controllers/permission.controller";
import { ProductController } from "~/controllers/product.controller";
import { AuthMiddleware } from "~/middlewares/auth.middleware";

const Router = express.Router();

Router.route("/access").get(DashboardControllers.access);

//#region [PRODUCTS]
Router.route("/products/create").post(
	AuthMiddleware.checkPermission(["CREATE_PRODUCT"]),
	ProductController.create
);
Router.route("/products").get(ProductController.findAll);
Router.route("/products/:productId").get(ProductController.findById);
Router.route("/products/:productId").put(
	AuthMiddleware.checkPermission(["UPDATE_PRODUCT"]),
	ProductController.update
);
Router.route("/products/:productId").delete(
	AuthMiddleware.checkPermission(["DELETE_PRODUCT"]),
	ProductController.delete
);
//#endregion

//#region [ORDERS]
Router.route("/orders/create").post(OrderController.create);
Router.route("/orders").get(OrderController.findAll);
Router.route("/orders/:orderId").get(OrderController.findById);
Router.route("/orders/:orderId").put(OrderController.update);
Router.route("/orders/:orderId").delete(OrderController.delete);
//#endregion

//#region [PERMISSIONS]
Router.route("/permissions/create").post(PermissionController.create);
Router.route("/permissions").get(PermissionController.findAll);
Router.route("/permissions/:permissionId").get(PermissionController.findById);
Router.route("/permissions/:permissionId").put(PermissionController.update);
Router.route("/permissions/:permissionId").delete(PermissionController.delete);
//#endregion

//#region [CATEGORIES]
// Router.route("/categories/create").post(AuthMiddleware.isAuthorized, OrderController.create);
// Router.route("/categories").get(AuthMiddleware.isAuthorized, OrderController.findAll);
// Router.route("/categories/:categoryId").get(AuthMiddleware.isAuthorized, OrderController.findById);
// Router.route("/categories/:categoryId").put(AuthMiddleware.isAuthorized, OrderController.update);
// Router.route("/categories/:categoryId").delete(AuthMiddleware.isAuthorized, OrderController.delete);
//#endregion
export const DashboardRoute = Router;
