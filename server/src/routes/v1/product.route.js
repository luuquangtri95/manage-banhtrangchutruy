import express from "express";
import { ProductController } from "~/controllers/product.controller";

const Router = express.Router();

Router.route("/").get(ProductController.findAll);
Router.route("/create").post(ProductController.create);
Router.route("/:productId").get(ProductController.findById);
Router.route("/:productId").delete(ProductController.delete);
Router.route("/delete/:productId").put(ProductController.update);

export const ProductRoute = Router;
