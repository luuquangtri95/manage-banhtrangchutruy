import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const CategoryModel = sequelizeConnectionString.define(
	"categories",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
		},
	},
	{
		modelName: "Category",
	}
);
