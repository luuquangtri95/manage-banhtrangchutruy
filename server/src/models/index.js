import { PermissionModel } from "./permission.model";
import { RoleModel } from "./role.model";
import { RolePermissionLinkModel } from "./role_permission.model";
import { UserModel } from "./user.model";
import { UserRoleLinkModel } from "./user_role.model";
import { OrderModel } from "./order.model";
import { CategoryModel } from "./category.model";

// Gom tất cả models vào object models
const models = [
	UserModel, // Tạo bảng users trước
	RoleModel, // Tạo bảng roles
	PermissionModel, // Tạo bảng permissions
	OrderModel,
	CategoryModel,

	//-------- bảng link sẽ đặt ở đây !
	UserRoleLinkModel, // Tạo bảng user_roles
	RolePermissionLinkModel, // Tạo bảng roles_permissions
	// ... các models về sau luôn luôn đặt dưới đây
];

// Khai báo quan hệ giữa các model
const setupAssociations = () => {
	//#region [role - permission]
	RoleModel.hasMany(RolePermissionLinkModel, { foreignKey: "role_id", onDelete: "CASCADE" });
	PermissionModel.hasMany(RolePermissionLinkModel, {
		foreignKey: "permission_id",
		onDelete: "CASCADE",
	});
	//#endregion

	//#region [user - role]
	UserModel.belongsToMany(RoleModel, {
		through: UserRoleLinkModel,
		foreignKey: "user_id",
		otherKey: "role_id",
		onDelete: "CASCADE",
	});

	RoleModel.belongsToMany(UserModel, {
		through: UserRoleLinkModel,
		foreignKey: "role_id",
		otherKey: "user_id",
		onDelete: "CASCADE",
	});
	//#endregion

	//#region [n order - 1 user]
	OrderModel.belongsTo(UserModel, { foreignKey: "user_id" });
	UserModel.hasMany(OrderModel, { foreignKey: "user_id" });
	//#endregion
};

(async () => {
	try {
		// Thiết lập quan hệ trước
		setupAssociations();

		// Đồng bộ tất cả các bảng theo thứ tự
		for (const model of models) {
			await model.sync({ alter: true });
			console.log(`${model.name} created successfully!`);
		}

		console.log("All models synced successfully!");
	} catch (error) {
		console.error("Error syncing models:", error.message);
		throw error;
	}
})();
