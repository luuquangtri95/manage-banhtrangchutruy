import sequelizeConnectionString from "~/config/database";
import { ProductModel } from "~/models/product.model";
import { WholesalePriceMappingModel } from "~/models/user_product_wholesale-price.model";
import { WholesaleGroupModel } from "~/models/wholesale_groups.model";
import { WholesalePricesModel } from "~/models/wholesale_prices.model";

const create = async (payload) => {
	try {
		const { groups, products, ...rest } = payload;

		// Tạo bản ghi mới cho bảng WholesalePricesModel
		const wholesalePrice = await WholesalePricesModel.create(rest);
		if (!wholesalePrice) {
			throw new Error("Failed to create wholesale price.");
		}

		const mappings = [
			...(products?.length > 0 && (!groups || groups.length === 0)
				? products.map((product) => ({
						product_id: product.id,
						group_id: null,
						price_id: wholesalePrice.id,
				  }))
				: []),
			...(groups?.length > 0 && (!products || products.length === 0)
				? groups.map((group) => ({
						product_id: null,
						group_id: group.id,
						price_id: wholesalePrice.id,
				  }))
				: []),
			...(products?.length > 0 && groups?.length > 0
				? products.flatMap((product) =>
						groups.map((group) => ({
							product_id: product.id,
							group_id: group.id,
							price_id: wholesalePrice.id,
						}))
				  )
				: []),
		];

		if (mappings.length > 0) {
			await WholesalePriceMappingModel.bulkCreate(mappings, {
				ignoreDuplicates: true,
			});
		}

		return wholesalePrice;
	} catch (error) {
		console.error("Create wholesale price error:", error);
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
			distinct: true,
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
		return await WholesalePricesModel.findOne({
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
		const { groups, products, ...rest } = payload;

		//#region [Cập nhật bảng WholesalePricesModel]
		await WholesalePricesModel.update(rest, { where: { id } });
		//#endregion

		//#region [Xóa toàn bộ mapping cũ]
		await WholesalePriceMappingModel.destroy({
			where: { price_id: id },
		});
		//#endregion

		//#region [Tạo lại mapping mới]
		const newMappings = [
			...(products?.length > 0 && (!groups || groups.length === 0)
				? products.map((product) => ({
						product_id: product.id,
						group_id: null,
						price_id: id,
				  }))
				: []),
			...(groups?.length > 0 && (!products || products.length === 0)
				? groups.map((group) => ({
						product_id: null,
						group_id: group.id,
						price_id: id,
				  }))
				: []),
			...(products?.length > 0 && groups?.length > 0
				? products.flatMap((product) =>
						groups.map((group) => ({
							product_id: product.id,
							group_id: group.id,
							price_id: id,
						}))
				  )
				: []),
		];

		if (newMappings.length > 0) {
			await WholesalePriceMappingModel.bulkCreate(newMappings);
		}
		//#endregion

		return { message: "Wholesale price updated successfully" };
	} catch (error) {
		console.error("Update error:", error);
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await WholesalePricesModel.destroy({ where: { id } });
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
