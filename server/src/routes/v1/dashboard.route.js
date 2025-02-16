import express from "express";
import { CategoryController } from "~/controllers/category.controller";
import { DashboardControllers } from "~/controllers/dashboard.controller";
import { OrderController } from "~/controllers/order.controller";
import { PartnerController } from "~/controllers/partner.controller";
import { PermissionController } from "~/controllers/permission.controller";
import { ProductController } from "~/controllers/product.controller";
import { userControllers } from "~/controllers/user.controller";
import { WholesaleGroupController } from "~/controllers/wholesale-group.controller";
import { WholesalePriceController } from "~/controllers/wholesale-price.controller";
import { AuthMiddleware } from "~/middlewares/auth.middleware";
import { upload } from "~/config/multer";
import { CloudinaryMiddleware } from "~/middlewares/cloudinary.middleware";

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

//#region [USERS]
Router.route("/users/register").post(userControllers.register);
Router.route("/users/create").post(userControllers.create);
Router.route("/users").get(userControllers.findAll);
Router.route("/users/:userId").get(userControllers.findById);
Router.route("/users/:userId").put(userControllers.update);
Router.route("/users/:userId").delete(userControllers.delete);
//#endregion

//#region [PROFILE]
Router.route("/profile/:profileId").post(
	upload.single("avatar"),
	CloudinaryMiddleware.uploadFile,
	(req, res) => {}
);
//#endregion

//#region [CATEGORIES]
Router.route("/categories/create").post(
	AuthMiddleware.isAuthorized,
	AuthMiddleware.checkPermission(["CREATE_CATEGORY"]),
	CategoryController.create
);
Router.route("/categories").get(AuthMiddleware.isAuthorized, CategoryController.findAll);
Router.route("/categories/:categoryId").get(
	AuthMiddleware.isAuthorized,
	CategoryController.findById
);
Router.route("/categories/:categoryId").put(
	AuthMiddleware.isAuthorized,
	AuthMiddleware.checkPermission(["UPDATE_CATEGORY"]),
	CategoryController.update
);
Router.route("/categories/:categoryId").delete(
	AuthMiddleware.isAuthorized,
	AuthMiddleware.checkPermission(["DELETE_CATEGORY"]),
	CategoryController.delete
);
//#endregion

//#region [WHOLESALE GROUP]
Router.route("/wholesale-groups/create").post(WholesaleGroupController.create);
Router.route("/wholesale-groups").get(WholesaleGroupController.findAll);
Router.route("/wholesale-groups/:groupId").get(WholesaleGroupController.findById);
Router.route("/wholesale-groups/:groupId").put(WholesaleGroupController.update);
Router.route("/wholesale-groups/:groupId").delete(WholesaleGroupController.delete);
//#endregion

//#region [WHOLESALE PRICE]
Router.route("/wholesale-prices/create").post(WholesalePriceController.create);
Router.route("/wholesale-prices").get(WholesalePriceController.findAll);
Router.route("/wholesale-prices/:priceId").get(WholesalePriceController.findById);
Router.route("/wholesale-prices/:priceId").put(WholesalePriceController.update);
Router.route("/wholesale-prices/:priceId").delete(WholesalePriceController.delete);
//#endregion

//#region [PARTNERS]
Router.route("/partners/create").post(PartnerController.create);
Router.route("/partners").get(PartnerController.findAll);
Router.route("/partners/:partnerId").get(PartnerController.findById);
Router.route("/partners/:partnerId").put(PartnerController.update);
Router.route("/partners/:partnerId").delete(PartnerController.delete);
//#endregion
export const DashboardRoute = Router;
