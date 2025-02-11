import { Op } from "sequelize";
import { UserModel } from "~/models/user.model";
import { WholesaleGroupModel } from "~/models/wholesale_groups.model";
const create = async (payload) => {
	try {
		const { users, ...rest } = payload;

		const wholesaleGroup = await WholesaleGroupModel.create(rest);
		if (!wholesaleGroup) {
			throw new Error("Failed to create wholesale group.");
		}

		if (users && users.length > 0) {
			for (let i = 0; i < users.length; i++) {
				const user = await UserModel.findByPk(users[i].id);

				if (!user) {
					console.warn(`User with ID ${users[i].id} not found.`);
					continue;
				}

				/**
				 * quan trọng, không xoá log này
				 */
				// console.log("Available methods:", Object.keys(user.__proto__)); // hàm kiểm tra xem method liên kết bảng thứ 3 có không

				await user.addWholesaleGroups(wholesaleGroup);
			}
		}

		console.log("Wholesale group and users added successfully.");
		return wholesaleGroup;
	} catch (error) {
		console.error("Error adding users to wholesale group:", error);
		throw error;
	}
};

const findAll = async (payload) => {
	try {
		const { page, limit, searchTerm, sort, order } = payload;

		const _offset = (page - 1) * limit;

		let where = {};

		if (searchTerm) {
			where.name = {
				[Op.like]: `%${searchTerm}%`,
			};
		}

		const { count, rows } = await WholesaleGroupModel.findAndCountAll({
			where,
			limit: limit,
			offset: _offset,
			order: [[order, sort]],
			// raw: true,

			include: [
				{
					model: UserModel,
					as: "users",
					through: { attributes: [] },
				},
			],
		});

		const _metadata = {
			result: rows,
			pagination: {
				page: page,
				limit: limit,
				total_page: Math.ceil(count / limit),
				total_item: count,
			},
		};

		return _metadata;
	} catch (error) {
		throw error;
	}
};

const findById = async (id) => {
	try {
		return await WholesaleGroupModel.findOne({
			where: {
				id,
			},
		});
	} catch (error) {
		throw error;
	}
};

const update = async (payload, id) => {
	try {
		return await WholesaleGroupModel.update({ ...payload }, { where: { id } });
	} catch (error) {
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await WholesaleGroupModel.destroy({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const WholesaleGroupRepository = {
	create,
	findAll,
	update,
	findById,
	delete: _delete,
};
