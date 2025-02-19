import dotenv from "dotenv";
import path from "path";
import appRootPath from "app-root-path";

const NODE_ENV = process.env.NODE_ENV === "production" ? "production" : "dev";

const rootDir = appRootPath.path;

const envFilePath =
	NODE_ENV === "production"
		? path.resolve(rootDir, "../.env.production")
		: path.resolve(rootDir, "../.env");

dotenv.config({ path: envFilePath });

export const env = {
	NODE_ENV,
	PORT: process.env.PORT || 8000,
	HOST: process.env.HOST || "localhost",
	// Database config
	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_NAME: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,
	// JWT config
	ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
	REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
	// Other config
	AUTHOR: process.env.AUTHOR,
	CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
	TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
	TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
};
