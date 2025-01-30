import express from "express";
import { StatusCodes } from "http-status-codes";
import { DashboardRoute } from "./dashboard.route";
import { UserRoute } from "./user.route";
import { AuthMiddleware } from "~/middlewares/auth.middleware";
import { RoleRoute } from "./role.route";

const Router = express.Router();

/** Check APIs v1/status */
Router.get("/status", (req, res) => {
	res.status(StatusCodes.OK).json({ message: "APIs V1 are ready to use." });
});

//#region [UNPROTECTED ROUTE]
Router.use("/users", UserRoute);
Router.use("/roles", RoleRoute);
//#endregion

//#region [PROTECTED ROUTE]
Router.use("/dashboards", AuthMiddleware.isAuthorized, DashboardRoute);
//#endregion

export const APIs_V1 = Router;
