"use strict";

/** @type {import('sequelize-cli').Migration} */
"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		// 1. Đổi kiểu dữ liệu của cột `name` từ ENUM thành STRING
		await queryInterface.changeColumn("permissions", "name", {
			type: Sequelize.STRING,
			allowNull: false,
		});
	},

	async down(queryInterface, Sequelize) {
		// 2. Khôi phục lại ENUM nếu rollback migration
		await queryInterface.changeColumn("permissions", "name", {
			type: Sequelize.ENUM(
				"*", // Admin có toàn quyền

				"CREATE_PRODUCT",
				"READ_PRODUCT",
				"UPDATE_PRODUCT",
				"DELETE_PRODUCT",

				"CREATE_CATEGORY",
				"READ_CATEGORY",
				"UPDATE_CATEGORY",
				"DELETE_CATEGORY",

				"CREATE_ORDER",
				"READ_ORDER",
				"UPDATE_ORDER",
				"DELETE_ORDER",

				"VIEW_USER",
				"CREATE_USER",
				"READ_USER",
				"UPDATE_USER",
				"DELETE_USER",

				"VIEW_PARTNER",
				"CREATE_PARTNER",
				"READ_PARTNER",
				"UPDATE_PARTNER",
				"DELETE_PARTNER",

				"VIEW_WHOLESALEP_PRICE",
				"CREATE_WHOLESALEP_PRICE",
				"READ_WHOLESALEP_PRICE",
				"UPDATE_WHOLESALEP_PRICE",
				"DELETE_WHOLESALEP_PRICE",

				"VIEW_MEMBER",
				"CREATE_MEMBER",
				"READ_MEMBER",
				"UPDATE_MEMBER",
				"DELETE_MEMBER",

				"VIEW_ANALYTIC",
				"CREATE_ANALYTIC",
				"READ_ANALYTIC",
				"UPDATE_ANALYTIC",
				"DELETE_ANALYTIC"
			),
			allowNull: false,
		});
	},
};
