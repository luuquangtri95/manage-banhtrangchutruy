import dotenv from "dotenv";

// Xác định môi trường, nếu process.env.NODE_ENV là "production" thì sử dụng production, còn lại mặc định là "dev"
const NODE_ENV = process.env.NODE_ENV === "production" ? "production" : "dev";

// Load file .env phù hợp với môi trường
if (NODE_ENV === "production") {
	// Khi môi trường production, load file .env.production
	dotenv.config({ path: ".env.production" });
} else {
	// Ở môi trường dev, bạn có thể load file .env hoặc .env.development
	dotenv.config({ path: ".env" });
	// Nếu bạn dùng file .env mặc định, chỉ cần: dotenv.config();
}

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
};
