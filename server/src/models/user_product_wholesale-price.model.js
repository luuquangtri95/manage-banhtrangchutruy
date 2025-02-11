import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";
import { ProductModel } from "./product.model";
import { WholesaleGroupModel } from "./wholesale_groups.model";
import { WholesalePricesModel } from "./wholesale_prices.model";

export const WholesalePriceMappingModel = sequelizeConnectionString.define(
	"WholesalePriceMapping",
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
		group_id: {
			type: DataTypes.UUID,
			references: {
				model: WholesaleGroupModel,
				key: "id",
			},
		},
		price_id: {
			type: DataTypes.UUID,
			references: {
				model: WholesalePricesModel,
				key: "id",
			},
		},
	}
);
