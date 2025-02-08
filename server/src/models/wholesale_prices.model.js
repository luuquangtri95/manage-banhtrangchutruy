import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const wholesalePricesModel = sequelizeConnectionString.define(
	"WholesalePrices",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		min_quantity: {
			type: DataTypes.INTEGER,
		},
		product_id: {
			type: DataTypes.UUID,
		},
		wholesale_group_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		modelName: "WholesalePrices",
	}
);
