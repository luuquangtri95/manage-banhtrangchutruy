const dotenv = require("dotenv");
const path = require("path");

// Load biến môi trường từ file .env.development trong Docker
const envPath = process.env.NODE_ENV === "development" 
	? path.resolve(__dirname, "../../.env.development")
	: path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath });

// Log để debug
console.log('Database Config:', {
	username: process.env.DB_USER,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT
});

module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: "postgres"
	}
};
