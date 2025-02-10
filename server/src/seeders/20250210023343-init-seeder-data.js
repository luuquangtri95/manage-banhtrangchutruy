"use strict";

const PERMISSIONS = require("../mock/permission");
const ROLES = require("../mock/role");
const { QueryInterface } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		//#region [ROLE]
		await queryInterface.bulkDelete("Roles", null, {}); // lấy theo tên bảng trong dbearver
		await queryInterface.bulkInsert("Roles", ROLES);
		//#endregion

		//#region [PERMISSION]
		// --------- reset table permission
		await queryInterface.bulkDelete("Permissions", null, {});
		await queryInterface.bulkInsert("Permissions", PERMISSIONS);
		//#endregion
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */

		await queryInterface.bulkDelete("Roles", null, {});
		await queryInterface.bulkDelete("Permissions", null, {});
	},
};
