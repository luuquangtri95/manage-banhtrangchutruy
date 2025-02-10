const { v4: uuidv4 } = require("uuid");

module.exports = [
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
];
