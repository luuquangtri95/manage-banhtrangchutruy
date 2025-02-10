import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import ms from "ms";
import sequelizeConnectionString from "~/config/database";
import { env } from "~/config/enviroment";
import { PermissionModel } from "~/models/permission.model";
import { RoleModel } from "~/models/role.model";
import { UserModel } from "~/models/user.model";
import { JwtProvider } from "~/providers/JwtProvider";
import { UserService } from "~/services/user.service";

const { ACCESS_TOKEN_SECRET_SIGNATURE, REFRESH_TOKEN_SECRET_SIGNATURE } = env;

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: "Email and password are required",
			});
		}

		const user = await UserModel.findOne({
			where: { email },
			raw: true,
			nest: true,
			include: [
				{
					model: RoleModel,
					as: "roles",
					through: { attributes: [] },
				},
			],
		});

		if (!user) {
			res.status(StatusCodes.NOT_FOUND).json({ message: "Email does not exist" });
			return;
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				message: "Email or password is incorrect",
			});
			return;
		}

		const _userInfo = {
			id: user.id,
			email: email,
			role: user.roles.name,
		};

		console.log("_userInfo", _userInfo);

		// generate token (access and refresh) for client
		const accessToken = await JwtProvider.generateToken(
			_userInfo,
			ACCESS_TOKEN_SECRET_SIGNATURE,
			"1h"
		);

		const refreshToken = await JwtProvider.generateToken(
			_userInfo,
			REFRESH_TOKEN_SECRET_SIGNATURE,
			"14 days"
		);

		/**
		 * Xử lý trường hợp trả về HTTP ONLY COOKIE cho phía trình duyệt
		 * Về cái maxAge và thư viện ms
		 * Đối với maxAge - thời gian sống của cookie thì chúng ta sẽ để tối đa 14 ngày, tuỳ dự án. Lưu ý
		 * Thời gian sống của cookie khác hoàn toàn với thời gian sống của refreshToken. Không nhầm lẫn cái này nhé !!!
		 */

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: ms("14 days"),
		});

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: ms("14 days"),
		});

		res.status(StatusCodes.OK).json({ ..._userInfo, accessToken, refreshToken });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const logout = async (req, res) => {
	try {
		// xoá cookie
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		res.status(StatusCodes.OK).json({ message: "Logout API success !" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const refreshToken = async (req, res) => {
	try {
		const refreshTokenFromCookie = req.cookies?.refreshToken;

		if (!refreshTokenFromCookie) {
			res.status(StatusCodes.UNAUTHORIZED).json({
				message: "Refresh token not found",
			});

			return;
		}

		const refreshTokenDecoded = await JwtProvider.verifyToken(
			refreshTokenFromCookie,
			env.REFRESH_TOKEN_SECRET_SIGNATURE
		);

		const userInfo = {
			id: refreshTokenDecoded.id,
			email: refreshTokenDecoded.email,
			role: refreshTokenDecoded.role,
		};

		const accessToken = await JwtProvider.generateToken(
			userInfo,
			ACCESS_TOKEN_SECRET_SIGNATURE,
			"1h"
		);

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: "none",
			maxAge: ms("14 days"),
		});

		res.status(StatusCodes.OK).json({ accessToken });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: "Refresh Token API failed !",
		});
	}
};

const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		const userCount = await UserModel.count();

		const roleName = userCount === 0 ? "admin" : "user";
		const role = await RoleModel.findOne({ where: { name: roleName } });

		if (!role) {
			return res.status(400).json({ message: `Role '${roleName}' not found.` });
		}

		const newUser = await sequelizeConnectionString.transaction(async (transaction) => {
			const user = await UserModel.create({ username, email, password }, { transaction });

			await user.addRole(role, { transaction });

			if (roleName === "admin") {
				const fullPermission = await PermissionModel.findOne({ where: { name: "*" } });

				if (!fullPermission) {
					throw new Error("Permission '*' not found.");
				}

				await role.addPermission(fullPermission, { transaction });
			}

			return user;
		});

		res.status(201).json({
			message: `User registered successfully with role '${roleName}'.`,
			metadata: { email: newUser.email },
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const create = async (req, res) => {
	try {
		const metadata = await UserService.create(req);

		res.status(StatusCodes.OK).json({
			metadata,
			message: "create user success !",
		});
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const update = async (req, res) => {
	try {
		const metadata = await UserService.update(req);

		res.status(StatusCodes.OK).json({ message: "update user success !", metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findAll = async (req, res) => {
	try {
		const metadata = await UserService.findAll(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const findById = async (req, res) => {
	try {
		const metadata = await UserService.findById(req);

		res.status(StatusCodes.OK).json({ metadata });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

const _delete = async (req, res) => {
	try {
		const metadata = await UserService.delete(req);

		res.status(StatusCodes.OK).json({ message: "delete user success !" });
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const userControllers = {
	login,
	logout,
	register,
	refreshToken,
	create,
	update,
	findAll,
	findById,
	delete: _delete,
};
