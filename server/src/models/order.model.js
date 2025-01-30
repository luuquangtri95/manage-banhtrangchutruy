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
    title: { type: DataTypes.STRING, allowNull: false },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
    },
    delivery_date: {
      type: DataTypes.DATE,
      defaultValue: sequelizeConnectionString.literal("CURRENT_TIMESTAMP"),
      allowNull: false,
    },
    data_json: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
