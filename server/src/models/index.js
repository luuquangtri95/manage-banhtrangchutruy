import { PermissionModel } from "./permission.model";
import { RoleModel } from "./role.model";
import { RolePermissionLinkModel } from "./role_permission.model";
import { UserModel } from "./user.model";
import { UserRoleLinkModel } from "./user_role.model";
import { OrderModel } from "./order.model";
import { CategoryModel } from "./category.model";
import { ProductModel } from "./product.model";
import { ProductCategoryModel } from "./product_category.model";
import { PartnerModel } from "./partner.model";
import { WholesaleGroupModel } from "./wholesale_groups.model";
import { wholesalePricesModel } from "./wholesale_prices.model";
import { UserWholesalePriceGroupModel } from "./user_wholesale_groups.model";

// Gom tất cả models vào object models
const models = [
	UserModel, // Tạo bảng users trước
	RoleModel, // Tạo bảng roles
	PermissionModel, // Tạo bảng permissions
	OrderModel,
	CategoryModel,
	ProductModel,
	PartnerModel,
	WholesaleGroupModel,

	//-------- bảng link sẽ đặt ở đây !
	UserRoleLinkModel, // Tạo bảng user_roles
	RolePermissionLinkModel, // Tạo bảng roles_permissions
	ProductCategoryModel,
	UserWholesalePriceGroupModel,
	wholesalePricesModel,
	// ... các models về sau luôn luôn đặt dưới đây
];

// Khai báo quan hệ giữa các model
const setupAssociations = () => {
	//#region [role - permission]
	RoleModel.belongsToMany(PermissionModel, {
		through: RolePermissionLinkModel,
		foreignKey: "role_id",
		otherKey: "permission_id",
		onDelete: "CASCADE",
	});
	PermissionModel.belongsToMany(RoleModel, {
		through: RolePermissionLinkModel,
		foreignKey: "permission_id",
		otherKey: "role_id",
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

	//#region [category - product]
	//#region [1 category - n products]
	ProductModel.belongsToMany(CategoryModel, {
		through: ProductCategoryModel,
		foreignKey: "product_id",
		otherKey: "category_id",
		onDelete: "CASCADE",
	});
	//#endregion

	//#region [1 product - n category]
	CategoryModel.belongsToMany(ProductModel, {
		through: ProductCategoryModel,
		foreignKey: "category_id",
		otherKey: "product_id",
		onDelete: "CASCADE",
	});
	//#endregion
	//#endregion

	//#region [group - wholesale_price]
	//#region [1 group wholesale => n user]
	WholesaleGroupModel.belongsToMany(UserModel, {
		through: UserWholesalePriceGroupModel,
		foreignKey: "wholesale_group_id",
		otherKey: "user_id",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});
	//#endregion

	//#region [1 group wholesale => n user]
	UserModel.belongsToMany(WholesaleGroupModel, {
		through: UserWholesalePriceGroupModel,
		foreignKey: "user_id",
		otherKey: "wholesale_group_id",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});
	//#endregion

	//#region [1 wholesale => n gorup ]

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
