import { RoleModel } from "../models/role.model";
import { PermissionModel } from "../models/permission.model";
import sequelizeConnectionString from "../config/database";

const seedDatabase = async () => {
	try {
		// Sync DB (nếu muốn reset lại: { force: true })
		await sequelizeConnectionString.sync({ alter: true });

		// 👉 1. Kiểm tra nếu bảng `roles` rỗng thì thêm mới
		const roleCount = await RoleModel.count();
		if (roleCount === 0) {
			const roles = ["admin", "user"].map((role) => ({ name: role }));
			await RoleModel.bulkCreate(roles);
			console.log("✅ Roles seeded successfully!");
		} else {
			console.log("⚠️ Roles already exist. Skipping...");
		}

		// 👉 2. Kiểm tra nếu bảng `permissions` rỗng thì thêm mới
		const permissionCount = await PermissionModel.count();
		if (permissionCount === 0) {
			const permissionEnum = PermissionModel.getAttributes().name.values;
			const permissions = permissionEnum.map((perm) => ({ name: perm }));
			await PermissionModel.bulkCreate(permissions);
			console.log("✅ Permissions seeded successfully!");
		} else {
			console.log("⚠️ Permissions already exist. Skipping...");
		}

		console.log("🚀 Database seeding completed!");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
	}
};

seedDatabase();
