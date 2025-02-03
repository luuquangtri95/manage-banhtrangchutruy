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

				"VIEW_USER",
				"CREATE_USER",
				"READ_USER",
				"UPDATE_USER",
				"DELETE_USER",

				"VIEW_PARTNER",
				"CREATE_PARTNER",
				"READ_PARTNER",
				"UPDATE_PARTNER",
				"DELETE_PARTNER",

				"VIEW_WHOLESALEP_PRICE",
				"CREATE_WHOLESALEP_PRICE",
				"READ_WHOLESALEP_PRICE",
				"UPDATE_WHOLESALEP_PRICE",
				"DELETE_WHOLESALEP_PRICE",

				"VIEW_MEMBER",
				"CREATE_MEMBER",
				"READ_MEMBER",
				"UPDATE_MEMBER",
				"DELETE_MEMBER",

				"VIEW_ANALYTIC",
				"CREATE_ANALYTIC",
				"READ_ANALYTIC",
				"UPDATE_ANALYTIC",
				"DELETE_ANALYTIC"
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
