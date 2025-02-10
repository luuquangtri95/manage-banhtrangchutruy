import { ProductModel } from "~/models/product.model";
import { WholesalePriceMappingModel } from "~/models/user_product_wholesale-price.model";
import { WholesaleGroupModel } from "~/models/wholesale_groups.model";
import { WholesalePricesModel } from "~/models/wholesale_prices.model";

const create = async (payload) => {
	try {
		const { groups, products, ...rest } = payload;

		const wholesalePrice = await WholesalePricesModel.create(rest);
		if (!wholesalePrice) {
			throw new Error("Failed to create wholesale price.");
		}

		const mappings = [];

		// ✅ Trường hợp chỉ có `products`, không có `groups`
		if (products?.length > 0 && (!groups || groups.length === 0)) {
			products.forEach((product) => {
				mappings.push({
					product_id: product.id,
					group_id: null,
					price_id: wholesalePrice.id,
				});
			});
		}

		if (groups?.length > 0 && (!products || products.length === 0)) {
			groups.forEach((group) => {
				mappings.push({
					product_id: null,
					group_id: group.id,
					price_id: wholesalePrice.id,
				});
			});
		}

		if (products?.length > 0 && groups?.length > 0) {
			products.forEach((product) => {
				groups.forEach((group) => {
					mappings.push({
						product_id: product.id,
						group_id: group.id,
						price_id: wholesalePrice.id,
					});
				});
			});
		}

		if (mappings.length > 0) {
			await WholesalePriceMappingModel.bulkCreate(mappings, {
				ignoreDuplicates: true,
			});
		}

		return wholesalePrice;
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

		const { count, rows } = await WholesalePricesModel.findAndCountAll({
			where,
			limit: limit,
			offset: _offset,
			order: [[order, sort]],
			// raw: true,
			include: [
				{
					model: ProductModel,
					as: "products",
					through: {
						attributes: [],
					},
				},
				{
					model: WholesaleGroupModel,
					as: "wholesaleGroups",
					through: {
						attributes: [],
					},
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
		return await CategoryModel.findOne({
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
		return await CategoryModel.update({ ...payload }, { where: { id } });
	} catch (error) {
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await CategoryModel.destroy({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const WholesalePriceRepository = {
	create,
	findAll,
	findById,
	update,
	delete: _delete,
};
