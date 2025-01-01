import express from "express";
import { PermissionController } from "~/controllers/permission.controller";

const Router = express.Router();

Router.route("/create").post(PermissionController.create);

export const PermissionRoute = Router;
