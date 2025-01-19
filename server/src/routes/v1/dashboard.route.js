import express from "express";
import { DashboardControllers } from "~/controllers/dashboard.controller";
import { AuthMiddleware } from "~/middlewares/auth.middleware";

const Router = express.Router();

Router.route("/access").get(AuthMiddleware.isAuthorized, DashboardControllers.access);

export const DashboardRoute = Router;
