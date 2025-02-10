import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const PartnerModel = sequelizeConnectionString.define("Parner", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	address: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
	phone: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});
