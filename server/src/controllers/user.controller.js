import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import ms from "ms";
import sequelizeConnectionString from "~/config/database";
import { env } from "~/config/enviroment";
import { RoleModel } from "~/models/role.model";
import { UserModel } from "~/models/user.model";
import { JwtProvider } from "~/providers/JwtProvider";

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
			// "1h"
			5
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

export const userControllers = {
	login,
	logout,
	register,
	refreshToken,
};
