import dotenv from "dotenv";
import path from "path";

// Xác định môi trường hiện tại
const NODE_ENV = process.env.NODE_ENV || "development";

// Xác định file env tương ứng với môi trường
const envFiles = {
	development: ".env.development",
	production: ".env.production",
	test: ".env.test",
};

// Lấy tên file env tương ứng
const envFile = envFiles[NODE_ENV] || ".env";

// Xác định đường dẫn tới file env dựa vào môi trường
const envPath =
	NODE_ENV === "production"
		? path.resolve(process.cwd(), "../", envFile) // Trong production
		: path.resolve(__dirname, "../../../", envFile); // Trong development

// Log để debug
console.log("Current Environment:", NODE_ENV);
console.log("Loading env file:", envPath);

// Load file env
const result = dotenv.config({ path: envPath });

// Nếu không tìm thấy file .env trong production, thử load từ process.env trực tiếp
if (result.error && NODE_ENV === "production") {
	console.log("Using environment variables from process.env");
}

// Kiểm tra nếu có lỗi loading file env trong development
if (result.error && NODE_ENV === "development") {
	console.warn(`Warning: ${envFile} not found. Using default environment variables`);
}

export const env = {
	// Thêm NODE_ENV vào config
	NODE_ENV,

	// Server config
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

	// Thêm hàm helper để check môi trường
	isDevelopment: NODE_ENV === "development",
	isProduction: NODE_ENV === "production",
	isTest: NODE_ENV === "test",
};
