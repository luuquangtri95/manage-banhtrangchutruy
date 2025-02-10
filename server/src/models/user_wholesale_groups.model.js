import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const UserWholesalePriceGroupModel = sequelizeConnectionString.define(
	"users_wholesale_prices",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.UUID,
		},
		wholesale_group_id: {
			type: DataTypes.UUID,
		},
	},
	{
		freezeTableName: true,
		modelName: "users_wholesale_prices",
	}
);
