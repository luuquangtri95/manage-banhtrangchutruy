import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";
import { UserModel } from "./user.model";
import { RoleModel } from "./role.model";

export const UserRoleLinkModel = sequelizeConnectionString.define(
	"users_roles",
	{
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
		role_id: {
			type: DataTypes.UUID,
			references: {
				model: RoleModel,
				key: "id",
			},
		},
	},
	{
		freezeTableName: true,
		modelName: "users_roles",
	}
);
