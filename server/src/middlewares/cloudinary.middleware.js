import { StatusCodes } from "http-status-codes";
import cloudinary from "~/config/cloudinary";

const uploadFile = async (req, res, next) => {
	try {
		const avatarPath = req.file.path;
		const response = await cloudinary.uploader.upload(avatarPath);

		if (response.url) {
			req.avatarUrl = response.url;
		}

		next();
	} catch (error) {
		console.log("CloudinaryMiddleware error", error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: "Upload avatar successfully !",
		});
	}
};

export const CloudinaryMiddleware = {
	uploadFile,
};
