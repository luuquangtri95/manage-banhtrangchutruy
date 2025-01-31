import { RoleModel } from "../models/role.model";
import { PermissionModel } from "../models/permission.model";
import sequelizeConnectionString from "../config/database"; // Kết nối DB

const seedDatabase = async () => {
	try {
		// Sync DB (nếu muốn reset lại: { force: true })
		await sequelizeConnectionString.sync({ alter: true });

		// 👉 1. Insert Role chỉ khi chưa có dữ liệu
		const roles = ["admin", "user"];
		for (const role of roles) {
			await RoleModel.findOrCreate({ where: { name: role } });
		}

		// 👉 2. Insert Permission từ ENUM
		const permissionEnum = PermissionModel.getAttributes().name.values;

		for (const permission of permissionEnum) {
			await PermissionModel.findOrCreate({ where: { name: permission } });
		}

		console.log("✅ Database seeded successfully!");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
	}
};

// Chạy seed
seedDatabase();
