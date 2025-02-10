import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const ProductModel = sequelizeConnectionString.define("Product", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	price: { type: DataTypes.INTEGER, allowNull: false },
	quantity: {
		type: DataTypes.INTEGER,
		allowNull: false,
		defaultValue: 1,
	},
	description: {
		type: DataTypes.TEXT,
	},
	status: {
		type: DataTypes.ENUM("active", "out_of_stock", "deleted"),
		defaultValue: "active",
	},
});
