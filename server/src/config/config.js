/*
SỬ DỤNG FILE NÀY VỚI MỤC ĐÍCH LÀ MIGRATION DB, KHÔNG SỬA DB TRÊN LIVE 1 CÁCH THỦ CÔNG
*/

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../", ".env") });

module.exports = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		dialect: "postgres",
	},
};
