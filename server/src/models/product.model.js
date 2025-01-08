import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const ProductModel = sequelizeConnectionString.define(
	"products",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: { type: DataTypes.STRING, allowNull: false },
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
		},
		description: {
			type: DataTypes.TEXT,
		},
	},
	{
		modelName: "Product",
	}
);
