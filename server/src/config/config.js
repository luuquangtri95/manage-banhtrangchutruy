const dotenv = require("dotenv");
const appRootPath = require("app-root-path");
const path = require("path");

const NODE_ENV = process.env.NODE_ENV === "production" ? "production" : "dev";

const rootDir = appRootPath.path;

const envFilePath =
	NODE_ENV === "production"
		? path.resolve(rootDir, "../.env.production")
		: path.resolve(rootDir, "../.env");

dotenv.config({ path: envFilePath });

// Log để debug
console.log("Database Config:", {
	username: process.env.DB_USER,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
});

module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: "postgres",
	},
};
