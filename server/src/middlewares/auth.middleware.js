import { StatusCodes } from "http-status-codes";
import { env } from "~/config/enviroment";
import { JwtProvider } from "~/providers/JwtProvider";

const isAuthorized = async (req, res, next) => {
	try {
		const accessTokenFromCookie = req.cookies?.accessToken;

		if (!accessTokenFromCookie) {
			res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: token not found" });
			return;
		}

		console.log("accessTokenFromCookie", accessTokenFromCookie);

		const accessTokenDecoded = await JwtProvider.verifyToken(
			accessTokenFromCookie,
			env.ACCESS_TOKEN_SECRET_SIGNATURE
		);

		console.log("accessTokenDecoded", accessTokenDecoded);

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

export const AuthMiddleware = {
	isAuthorized,
};
