import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const WholesalePricesModel = sequelizeConnectionString.define("WholesalePrice", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
	},
	price: {
		type: DataTypes.INTEGER,
	},
	min_quantity: {
		type: DataTypes.INTEGER,
	},
});
