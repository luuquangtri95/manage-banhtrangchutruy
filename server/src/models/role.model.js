import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const RoleModel = sequelizeConnectionString.define(
	"roles",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.ENUM("admin", "user", "editor", "manager"),
			allowNull: false,
			defaultValue: "user",
		},
		description: {
			type: DataTypes.TEXT,
		},
	},
	{
		modelName: "Role",
	}
);
