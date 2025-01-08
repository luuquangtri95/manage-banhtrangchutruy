import express from "express";
import { StatusCodes } from "http-status-codes";
import { DashboardRoute } from "./dashboard.route";
import { RoleRoute } from "./role.route";
import { UserRoute } from "./user.route";
import { PermissionRoute } from "./permission.route";
import { OrderRoute } from "./order.route";
import { ProductRoute } from "./product.route";

const Router = express.Router();

/** Check APIs v1/status */
Router.get("/status", (req, res) => {
	res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use." });
});

Router.use("/users", UserRoute);
Router.use("/dashboards", DashboardRoute);
Router.use("/role", RoleRoute);
Router.use("/permission", PermissionRoute);
Router.use("/orders", OrderRoute);
Router.use("/products", ProductRoute);

export const APIs_V1 = Router;
