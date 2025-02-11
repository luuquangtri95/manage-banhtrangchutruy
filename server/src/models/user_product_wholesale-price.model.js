import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

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
			allowNull: false,
		},
		group_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		price_id: {
			type: DataTypes.UUID,
			allowNull: false,
		},
	},
	{
		constraints: true,
		uniqueKeys: {
			wholesale_price_mapping_unique: {
				fields: ["product_id", "group_id", "price_id"],
			},
		},
	}
);
