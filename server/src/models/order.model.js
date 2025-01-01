import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";
import { UserModel } from "./user.model";

export const OrderModel = sequelizeConnectionString.define(
	"orders",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.ENUM("admin", "user", "editor", "manager"),
			allowNull: false,
			defaultValue: "user",
		},
		address: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		delivery_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		data_json: {
			type: DataTypes.JSON,
			defaultValue: {},
		},
		user_id: {
			type: DataTypes.UUID,
			references: {
				model: UserModel,
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		status: {
			type: DataTypes.ENUM("pending", "active", "draft", "success"),
			defaultValue: "pending",
		},
	},
	{
		modelName: "Order",
	}
);
