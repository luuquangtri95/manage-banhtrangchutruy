"use strict";

const { QueryInterface } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

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
		await queryInterface.bulkInsert("roles", [
			{
				id: uuidv4(),
				name: "admin",
				description: "ADMIN",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: uuidv4(),
				name: "user",
				description: "USER",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: uuidv4(),
				name: "editor",
				description: "EDITOR",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: uuidv4(),
				name: "manager",
				description: "MANAGER",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				id: uuidv4(),
				name: "guest",
				description: "GUEST",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
		//#endregion

		//#region [PERMISSION]
		//#endregion
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */

		await queryInterface.bulkDelete("roles", null, {});
	},
};
