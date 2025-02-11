const { v4: uuidv4 } = require("uuid");

module.exports = [
	{
		id: uuidv4(),
		name: "Bánh tráng",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: uuidv4(),
		name: "Ăn vặt",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: uuidv4(),
		name: "Thức uống",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		id: uuidv4(),
		name: "Khô",
		createdAt: new Date(),
		updatedAt: new Date(),
	},
];
