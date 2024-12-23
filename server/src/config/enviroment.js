import "dotenv/config";

export const env = {
	LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,
	LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,

	DB_HOST: process.env.DB_HOST,
	DB_PORT: process.env.DB_PORT,
	DB_NAME: process.env.DB_NAME,
	DB_USER: process.env.DB_USER,
	DB_PASSWORD: process.env.DB_PASSWORD,

	AUTHOR: process.env.AUTHOR,
};
