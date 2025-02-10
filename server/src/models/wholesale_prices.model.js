import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const wholesalePricesModel = sequelizeConnectionString.define(
	"wholesale_price",
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
		group_id: {
			type: DataTypes.UUID,
		},
	},
	{
		modelName: "wholesale_price",
	}
);
