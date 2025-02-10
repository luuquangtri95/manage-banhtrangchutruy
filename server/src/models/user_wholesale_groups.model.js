import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";
import { UserModel } from "./user.model";
import { WholesaleGroupModel } from "./wholesale_groups.model";

export const UserWholesaleGroupModel = sequelizeConnectionString.define("UserWholesaleGroup", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	user_id: {
		type: DataTypes.UUID,
		references: {
			model: UserModel,
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
});
