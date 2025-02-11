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
import { WholesalePricesModel } from "./wholesale_prices.model";
import { UserWholesaleGroupModel } from "./user_wholesale_groups.model";
import { WholesalePriceMappingModel } from "./user_product_wholesale-price.model";

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
	UserWholesaleGroupModel,
	WholesalePricesModel,
	WholesalePriceMappingModel,
	// ... các models về sau luôn luôn đặt dưới đây
];

// Khai báo quan hệ giữa các model
const setupAssociations = () => {
	//#region [role - permission]
	RoleModel.belongsToMany(PermissionModel, {
		through: RolePermissionLinkModel,
		foreignKey: "role_id",
		otherKey: "permission_id",
		as: "permissions",
		onDelete: "CASCADE",
	});
	PermissionModel.belongsToMany(RoleModel, {
		through: RolePermissionLinkModel,
		foreignKey: "permission_id",
		otherKey: "role_id",
		as: "roles",
		onDelete: "CASCADE",
	});
	//#endregion

	//#region [user - role]
	UserModel.belongsToMany(RoleModel, {
		through: UserRoleLinkModel,
		foreignKey: "user_id",
		otherKey: "role_id",
		as: "roles",
		onDelete: "CASCADE",
	});

	RoleModel.belongsToMany(UserModel, {
		through: UserRoleLinkModel,
		foreignKey: "role_id",
		otherKey: "user_id",
		as: "users",
		onDelete: "CASCADE",
	});
	//#endregion

	//#region [n order - 1 user]
	OrderModel.belongsTo(UserModel, { foreignKey: "user_id", as: "users" });
	UserModel.hasMany(OrderModel, { foreignKey: "user_id", as: "orders" });
	//#endregion

	//#region [category - product]
	//#region [1 category - n products]
	ProductModel.belongsToMany(CategoryModel, {
		through: ProductCategoryModel,
		foreignKey: "product_id",
		otherKey: "category_id",
		as: "categories",
		onDelete: "CASCADE",
	});
	//#endregion

	//#region [1 product - n category]
	CategoryModel.belongsToMany(ProductModel, {
		through: ProductCategoryModel,
		foreignKey: "category_id",
		otherKey: "product_id",
		as: "products",
		onDelete: "CASCADE",
	});
	//#endregion
	//#endregion

	//#region [user - wholesale_group]
	//#region [1 group wholesale => n user]
	UserModel.belongsToMany(WholesaleGroupModel, {
		through: UserWholesaleGroupModel,
		foreignKey: "user_id",
		otherKey: "group_id",
		as: "wholesaleGroups",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});

	//#region [1 user => n group wholesale]
	WholesaleGroupModel.belongsToMany(UserModel, {
		through: UserWholesaleGroupModel,
		foreignKey: "group_id",
		otherKey: "user_id",
		as: "users",
		onDelete: "CASCADE",
		onUpdate: "CASCADE",
	});
	//#endregion
	//#endregion

	//#region [temp...]
	// 1 Product - n wholesale price
	ProductModel.belongsToMany(WholesalePricesModel, {
		through: WholesalePriceMappingModel,
		foreignKey: "product_id",
		otherKey: "price_id",
		as: "wholesalePrices",
	});

	// 1 Wholesale Group  - n wholesale price
	WholesaleGroupModel.belongsToMany(WholesalePricesModel, {
		through: WholesalePriceMappingModel,
		foreignKey: "group_id",
		otherKey: "price_id",
		as: "wholesalePrices",
	});

	// 1 WholesalePrice - n product
	WholesalePricesModel.belongsToMany(ProductModel, {
		through: WholesalePriceMappingModel,
		foreignKey: "price_id",
		otherKey: "product_id",
		as: "products",
	});

	// 1 WholesalePrice - group
	WholesalePricesModel.belongsToMany(WholesaleGroupModel, {
		through: WholesalePriceMappingModel,
		foreignKey: "price_id",
		otherKey: "group_id",
		as: "wholesaleGroups",
	});
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
