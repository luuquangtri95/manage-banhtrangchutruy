import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const PermissionModel = sequelizeConnectionString.define(
	"permissions",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.ENUM(
				"*", // Admin có toàn quyền
				"CREATE_PRODUCT",
				"READ_PRODUCT",
				"UPDATE_PRODUCT",
				"DELETE_PRODUCT",
				"CREATE_CATEGORY",
				"READ_CATEGORY",
				"UPDATE_CATEGORY",
				"DELETE_CATEGORY",
				"CREATE_ORDER",
				"READ_ORDER",
				"UPDATE_ORDER",
				"DELETE_ORDER",
				"CREATE_USER",
				"READ_USER",
				"UPDATE_USER",
				"DELETE_USER",
				"MANAGE_USERS",
				"VIEW_REPORTS"
			),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		freezeTableName: true,
		modelName: "Permission",
	}
);
