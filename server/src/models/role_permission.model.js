import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";
import { RoleModel } from "./role.model";
import { PermissionModel } from "./permission.model";

export const RolePermissionLinkModel = sequelizeConnectionString.define(
	"roles_permissions",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		role_id: {
			type: DataTypes.UUID,
			references: {
				model: RoleModel,
				key: "id",
			},
		},
		permission_id: {
			type: DataTypes.UUID,
			references: {
				model: PermissionModel,
				key: "id",
			},
		},
	},
	{
		freezeTableName: true,
		modelName: "roles_permissions",
	}
);
