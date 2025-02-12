import { Op } from "sequelize";
import { ProductModel } from "~/models/product.model";
import { RoleModel } from "~/models/role.model";
import { UserModel } from "~/models/user.model";
import { WholesaleGroupModel } from "~/models/wholesale_groups.model";
import { WholesalePricesModel } from "~/models/wholesale_prices.model";

const create = async (payload) => {
	try {
		return await UserModel.create(payload);
	} catch (error) {
		throw error;
	}
};

const update = async (payload, id) => {
	try {
		return await UserModel.update({ ...payload }, { where: { id } });
	} catch (error) {
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

		const { count, rows } = await UserModel.findAndCountAll({
			where,
			limit: limit,
			offset: _offset,
			order: [[order, sort]],
			nest: true,
			attributes: ["id", "username", "email", "isActive", "createdAt", "updatedAt"],
			include: [
				{
					model: RoleModel,
					as: "roles",
					attributes: ["name"],
					through: { attributes: [] },
				},
			],
		});

		const _metadata = {
			result: rows.filter((row) => row.roles[0].name !== "admin"),

			pagination: {
				page: page,
				limit: limit,
				total_page: Math.ceil(count / limit),
				total_item: rows.filter((row) => row.roles[0].name !== "admin").length,
			},
		};

		return _metadata;
	} catch (error) {
		throw error;
	}
};

const findById = async (id) => {
	try {
		const entryUser = await UserModel.findOne({
			where: {
				id,
			},
			include: [
				{
					model: WholesaleGroupModel,
					as: "wholesaleGroups",
					through: { attributes: [] },
					include: [
						{
							model: WholesalePricesModel,
							as: "wholesalePrices",
							through: { attributes: [] },

							include: [
								{
									model: ProductModel,
									as: "products",
									through: { attributes: [] },
								},
							],
						},
					],
				},
			],
		});

		const _entryUser = entryUser.toJSON();
		delete _entryUser.password;

		return _entryUser;
	} catch (error) {
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await UserModel.destroy({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const UserRepository = {
	create,
	findAll,
	update,
	findById,
	delete: _delete,
};
