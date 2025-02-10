import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const UserWholesaleGroupModel = sequelizeConnectionString.define(
	"users_wholesale_groups",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.UUID,
		},
		group_id: {
			type: DataTypes.UUID,
		},
	},
	{
		freezeTableName: true,
		modelName: "users_wholesale_groups",
	}
);
