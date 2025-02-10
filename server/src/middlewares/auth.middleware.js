import { StatusCodes } from "http-status-codes";
import { env } from "~/config/enviroment";
import { PermissionModel } from "~/models/permission.model";
import { RoleModel } from "~/models/role.model";
import { UserModel } from "~/models/user.model";
import { JwtProvider } from "~/providers/JwtProvider";

const isAuthorized = async (req, res, next) => {
	try {
		const accessTokenFromCookie = req.cookies?.accessToken;

		if (!accessTokenFromCookie) {
			res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: token not found" });
			return;
		}

		// console.log("accessTokenFromCookie", accessTokenFromCookie);

		const accessTokenDecoded = await JwtProvider.verifyToken(
			accessTokenFromCookie,
			env.ACCESS_TOKEN_SECRET_SIGNATURE
		);

		// console.log("accessTokenDecoded", accessTokenDecoded);

		req.jwtDecoded = accessTokenDecoded;

		next();
	} catch (error) {
		console.log("Error from auth.middleware: ", error);

		// Trường hợp lỗi 1: Nếu accessToken nó bị hết hạn thì cần trả về 1 mã lỗi GONE - 410 để FE gọi lại để refreshToken
		if (error.message?.includes("jwt expired")) {
			res.status(StatusCodes.GONE).json({ message: "Need to refresh token !" });
			return;
		}

		// Trường hợp lỗi 2: Nếu accessToken không hợp lệ do bất kì điều gì khác vụ hết hạn thì auto trả về mã 401 cho phía FE xử lý logout hoặc call api logout tuỳ trường hợp
		res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized! Please login !" });
	}
};

const checkPermission =
	(requiredPermissions = []) =>
	async (req, res, next) => {
		try {
			const userInfo = req.jwtDecoded;

			const entryUser = await UserModel.findOne({
				where: { id: userInfo.id },
				include: [
					{
						model: RoleModel,
						as: "roles",
						attributes: ["id", "name"],
						through: { attributes: [] },
						include: [
							{
								model: PermissionModel,
								as: "permissions",
								attributes: ["id", "name"],
								through: { attributes: [] },
							},
						],
					},
				],
			});

			if (!entryUser) {
				return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
			}

			const _entryUser = JSON.parse(JSON.stringify(entryUser));

			const allPermissions = _entryUser.roles.flatMap((role) =>
				role.permissions.map((p) => p.name)
			);

			// 🔍 Nếu user có quyền `"*"` (toàn quyền) -> Cho phép luôn
			if (allPermissions.includes("*")) return next();

			// 🔍 Kiểm tra nếu user có **tất cả** các quyền yêu cầu
			const hasRequiredPermissions = requiredPermissions.every((perm) =>
				allPermissions.includes(perm)
			);

			if (!hasRequiredPermissions) {
				return res.status(StatusCodes.FORBIDDEN).json({
					message: "Bạn không có quyền thực hiện hành động này, vui lòng liên hệ admin",
				});
			}

			next();
		} catch (error) {
			res.status(StatusCodes.FORBIDDEN).json({
				message: error.message || "Permission denied",
			});
		}
	};

export const AuthMiddleware = {
	isAuthorized,
	checkPermission,
};
