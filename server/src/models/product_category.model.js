import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";
import { CategoryModel } from "./category.model";
import { ProductModel } from "./product.model";

export const ProductCategoryModel = sequelizeConnectionString.define(
	"products_categories",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		product_id: {
			type: DataTypes.UUID,
			references: {
				model: ProductModel,
				key: "id",
			},
		},
		category_id: {
			type: DataTypes.UUID,
			references: {
				model: CategoryModel,
				key: "id",
			},
		},
	},
	{
		freezeTableName: true,
		modelName: "products_categories",
	}
);
