import { ProductRepository } from "~/repositories/product.repository";

const create = async (req) => {
  try {
    const payload = req.body;

    return await ProductRepository.create(payload);
  } catch (error) {
    throw error;
  }
};

const findAll = async (req) => {
  try {
    const _page = req.query.page ? parseInt(req.query.page) : 1;
    const _limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const _searchTerm = req.query.searchTerm || "";
    const _sort = req.query.sort || "asc";
    const _order = req.query.order || "name";
    /// ... many queries here

    let payload = {
      page: _page,
      limit: _limit,
      searchTerm: _searchTerm,
      sort: _sort,
      order: _order,
    };

    return await ProductRepository.findAll({ ...payload });
  } catch (error) {
    throw error;
  }
};

const findById = async (req) => {
  console.log("req", req);
  try {
    const productId = req.params.productId;
    console.log("productId", productId);
    return await ProductRepository.findById(productId);
  } catch (error) {
    throw error;
  }
};

const _delete = async (req) => {
  try {
    const productId = req.params.productId;

    return await ProductRepository.delete(productId);
  } catch (error) {
    throw error;
  }
};

export const ProductService = {
  create,
  findAll,
  findById,
  delete: _delete,
};
