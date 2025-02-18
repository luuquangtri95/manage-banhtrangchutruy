import { StatusCodes } from "http-status-codes";

const access = async (req, res) => {
	try {
		const userInfo = {
			id: req.jwtDecoded.id,
			email: req.jwtDecoded.email,
			role: req.jwtDecoded.role,
			username: req.jwtDecoded.username,
			phone: req.jwtDecoded.phone,
			address: req.jwtDecoded.address,
		};

		res.status(StatusCodes.OK).json(userInfo);
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
	}
};

export const DashboardControllers = {
	access,
};
