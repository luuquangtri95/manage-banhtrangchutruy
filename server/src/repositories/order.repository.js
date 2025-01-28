import { Op, Sequelize } from "sequelize";
import { OrderModel } from "~/models/order.model";
import { ProductModel } from "~/models/product.model";
import sequelizeConnectionString from "../config/database";

const findById = async (id) => {
	try {
		return await OrderModel.findById({ where: { id }, raw: true });
	} catch (error) {
		throw error;
	}
};

const findAll = async (payload) => {
	try {
		const { user_id, page, limit, searchTerm, sort, order, status, startDate, endDate } =
			payload;

		const _offset = (page - 1) * limit;
		let where = { user_id };

		if (searchTerm) {
			// where.title = {
			// 	[Op.like]: `%${searchTerm}%`,
			// };
			where = {
				[Op.or]: [
					{ title: { [Op.iLike]: `%${searchTerm}%` } },
					{ fullname: { [Op.iLike]: `%${searchTerm}%` } },
					Sequelize.where(
						Sequelize.cast(Sequelize.col("phone"), "TEXT"), // Chuyển `phone` thành chuỗi
						{
							[Op.iLike]: `%${searchTerm}%`,
						}
					),
				],
			};
		}

		// Lọc theo ngày
		if (startDate && endDate) {
			where.delivery_date = {
				[Op.between]: [startDate, endDate],
			};
		} else if (startDate) {
			where.delivery_date = {
				[Op.gte]: startDate,
			};
		} else if (endDate) {
			where.delivery_date = {
				[Op.lte]: endDate,
			};
		}

		if (status) {
			where.status = status;
		}

		const { count, rows } = await OrderModel.findAndCountAll({
			where,
			limit: limit,
			offset: _offset,
			order: [[order || "delivery_date", sort]],
			raw: true,
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

const create = async (payload) => {
	try {
		return (await OrderModel.create(payload)).toJSON();
	} catch (error) {
		throw error;
	}
};

const createWithTransaction = async (payload) => {
	const transaction = await sequelizeConnectionString.transaction();

	try {
		const { data_json } = payload;

		const productNames = data_json.item.map((item) => item.name);
		const products = await ProductModel.findAll({
			where: { name: productNames },
			transaction,
			lock: true,
		});

		if (products.length === 0) {
			throw new Error("No matching products found in the database.");
		}

		const productMap = products.reduce((acc, product) => {
			acc[product.name] = product;
			return acc;
		}, {});

		for (const item of data_json.item) {
			const product = productMap[item.name];

			if (!product) {
				throw new Error(`Product ${item.name} not found`);
			}

			if (product.quantity < item.quantity) {
				throw new Error(
					`Insufficient quantity for product ${item.name}. Available: ${product.quantity}`
				);
			}

			product.quantity -= item.quantity;
			await product.save({ transaction }).catch((err) => {
				throw new Error(`Failed to save product ${product.name}: ${err.message}`);
			});
		}

		const newOrder = await OrderModel.create({ ...payload }, { transaction });

		await transaction.commit();

		return newOrder;
	} catch (error) {
		try {
			await transaction.rollback();
		} catch (rollbackError) {
			console.error("Rollback failed:", rollbackError);
		}
		throw error;
	}
};

const update = async (payload, id) => {
	try {
		return await OrderModel.update({ ...payload }, { where: { id } });
	} catch (error) {
		throw error;
	}
};

const _delete = async (id) => {
	try {
		return await OrderModel.destroy({ where: { id } });
	} catch (error) {
		throw error;
	}
};

export const OrderRepository = {
	create,
	createWithTransaction,
	findById,
	findAll,
	update,
	delete: _delete,
};
