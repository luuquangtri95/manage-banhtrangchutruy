import express from "express";
import { userControllers } from "~/controllers/user.controller";

const Router = express.Router();

// API đăng nhập.
Router.route("/login").post(userControllers.login);

// API đăng xuất.
Router.route("/logout").delete(userControllers.logout);

// API Refresh Token - Cấp lại Access Token mới.
Router.route("/refresh_token").put(userControllers.refreshToken);

//
Router.route("/register").post(userControllers.register);

export const UserRoute = Router;
