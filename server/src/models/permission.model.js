import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const PermissionModel = sequelizeConnectionString.define("Permission", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
});
