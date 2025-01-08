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
				"*",
				"add_product",
				"edit_product",
				"delete_product",
				"view_reports",
				"create_category"
			),
			allowNull: false,
			defaultValue: "*",
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
