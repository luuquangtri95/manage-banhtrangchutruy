import { Op } from "sequelize";
import { CategoryModel } from "~/models/category.model";
import { ProductModel } from "~/models/product.model";

const create = async (payload) => {
	try {
		const { categories, ...rest } = payload;

		const product = await ProductModel.create(rest);

		if (categories) {
			for (let i = 0; i < categories.length; i++) {
				const category = await CategoryModel.findByPk(categories[i].id);

				category.addProduct(product);
			}
		}

		return;
	} catch (error) {
		throw error;
	}
};

const update = async (payload, id) => {
	try {
		const { categories, ...rest } = payload;

		const [count, product] = await ProductModel.update(
			{ ...rest },
			{ where: { id }, returning: true }
		);

		const updatedProduct = product[0];

		// xoá tất cả quan hệ cũ để add quan hệ mới
		await updatedProduct.setCategories([]);

		if (categories) {
			for (let i = 0; i < categories.length; i++) {
				const category = await CategoryModel.findByPk(categories[i].id);
				if (category) {
					await updatedProduct.addCategory(category);
				}
			}
		}

		return updatedProduct;
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

		const { count, rows } = await ProductModel.findAndCountAll({
			where,
			limit: limit,
			offset: _offset,
			order: [[order, sort]],
			// raw: true,
			include: [{ model: CategoryModel, through: { attributes: [] } }],
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
		return await ProductModel.findOne({
			where: {
				id,
			},
		});
	} catch (error) {
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await ProductModel.destroy({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const WholesalePriceService = {
	create,
	findAll,
	update,
	findById,
	delete: _delete,
};
