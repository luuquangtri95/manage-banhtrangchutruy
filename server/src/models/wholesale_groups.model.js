import { DataTypes } from "sequelize";
import sequelizeConnectionString from "~/config/database";

export const WholesaleGroupModel = sequelizeConnectionString.define("WholesaleGroup", {
	id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
	},
});
