import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductApi from "../../api/productApi";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";
import ProductFilterForm from "./components/ProductFilterForm/ProductFilterForm";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../helpers/formatPrice";
import CategoryApi from "../../api/categoryApi";
import Select from "react-tailwindcss-select";

const INIT_FORMDATA = {
  name: {
    value: "",
    type: "text",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "validate.name_required";
      if (value.length < 5) return "validate.name_min_length";
    },
  },
  price: {
    value: "",
    type: "number",
    error: "",
    validate: (value) => {
      if (value < 1000) return "validate.price_min";
    },
  },
  quantity: {
    value: 100,
    type: "number",
    error: "",
    validate: (value) => {
      if (value === 0 || value < 10) return "validate.quantity_min";
    },
  },
};

const INIT_CATEGORIES = {
  value: [],
  options: [],
};

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 8,
  total_page: 10,
  total_item: 10,
};

function ProductsPage() {
  const [popupData, setPopupData] = useState(null);
  const [productDelete, setProductDelete] = useState(null);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(INIT_FORMDATA);
  const [categories, setCategories] = useState(INIT_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ page: 1, limit: 8, searchTerm: "" });
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const { t } = useTranslation();

  console.log("productDelete page", productDelete);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters]);

  useEffect(() => {
    if (popupData) {
      setCategories((prev) => ({
        ...prev,
        value:
          popupData?.categories?.map((_cate) => ({
            label: _cate.name,
            value: _cate.id,
          })) || [],
      }));
      setFormData((prev) => {
        const updatedFormData = { ...prev };

        console.log("updatedFormData", updatedFormData);

        Object.keys(updatedFormData).forEach((key) => {
          if (popupData[key] !== undefined && key !== "category") {
            updatedFormData[key].value = popupData[key];
          }
        });
        return updatedFormData;
      });
    }
  }, [popupData]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await ProductApi.findAll(filters);

      setProducts(res.metadata.result);
      setPagination(res.metadata.pagination);
    } catch (error) {
      console.log("fetchProducts error", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await CategoryApi.findAll(filters);

      const _catagories = res.metadata.result.map((_cat) => {
        return {
          label: _cat.name,
          value: _cat.id,
        };
      });

      setCategories((prev) => ({ ...prev, options: _catagories }));
    } catch (error) {
      console.log("fetchProducts error", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setFormData((prev) => {
      const initData = { ...prev };

      Object.keys(initData).forEach((key) => {
        initData[key].error = "";
      });

      return initData;
    });
    setPopupData(null);
  };

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: { ...prev[name], value, error: "" },
    }));
  };

  const handleDeleteProduct = async () => {
    if (!productDelete) return;

    try {
      await ProductApi.delete(productDelete.id);
      toast.success(`Product "${productDelete.name}" deleted successfully`);
      fetchProducts();
    } catch (error) {
      console.log("handleDeleteProduct error", error);
    } finally {
      setProductDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setProductDelete(null);
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilter) => {
    setFilters((prev) => ({ ...prev, ...newFilter, page: 1 }));
  };

  const handleCreate = () => {
    setPopupData({ name: "", price: "", quantity: 100 });
  };

  const handleEdit = (item) => {
    setPopupData(item);
  };

  const handleClone = async (oldItem) => {
    try {
      const _newItem = {
        name: oldItem.name + " clone",
        quantity: oldItem.quantity,
        price: oldItem.price,
      };

      const res = await ProductApi.create(_newItem);

      if (res.metadata.id) {
        toast.success(`Clone ${res.metadata.name} success !`);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      fetchProducts();
    }
  };

  const handlePopupSubmit = async () => {
    let hasError = false;

    const newFormData = { ...formData };
    Object.keys(newFormData).forEach((key) => {
      const field = newFormData[key];
      if (field.validate) {
        const error = field.validate(field.value);
        if (error) {
          hasError = true;
          newFormData[key].error = error;
        }
      }
    });

    setFormData(newFormData);

    if (hasError) return;

    const formattedData = Object.keys(formData).reduce((acc, key) => {
      acc[key] = formData[key].value;
      return acc;
    }, {});

    if (categories?.value?.length) {
      formattedData.categories = categories.value.map((_v) => ({
        name: _v.label,
        id: _v.value,
      }));
    }

    try {
      if (popupData && popupData.id) {
        await ProductApi.update({ ...formattedData, id: popupData.id });
        toast.success("Product updated successfully");
      } else {
        const res = await ProductApi.create(formattedData);

        toast.success(res.message);
      }
    } catch (error) {
      console.log("handlePopupSubmit error", error);
      // toast.error("Failed to submit product");
    } finally {
      setPopupData(null);
      setFormData(INIT_FORMDATA);
      setCategories(INIT_CATEGORIES);
      fetchProducts();
      fetchCategories();
    }
  };

  const handleConfirmDelete = (product) => {
    setProductDelete(product); // Đặt sản phẩm cần xóa
  };

  const renderSkeleton = () =>
    Array.from({ length: products.length }).map((_, rowIndex) => (
      <tr key={rowIndex} className="animate-pulse h-[81px]">
        {Array.from({ length: 6 }).map((_, colIndex) => (
          <td key={colIndex} className="p-4 py-5">
            <div className="h-6 bg-gray-200 rounded"></div>
          </td>
        ))}
      </tr>
    ));

  const renderProducts = () =>
    products.map((product) => (
      <tr
        key={product.id}
        className="hover:bg-slate-50 border-b border-slate-200"
      >
        <td className="p-4 py-5 font-semibold text-sm text-slate-800">
          {product.name}
        </td>
        <td className="p-4 py-5 text-sm text-slate-500">
          {formatPrice(product.price)}
        </td>
        <td className="p-4 py-5 text-sm text-slate-500">{product.quantity}</td>
        <td className="p-4 py-5 text-sm text-slate-500">{product.status}</td>
        <td className="p-4 py-5 text-sm text-slate-500">
          {product.categories.map((_cate) => (
            <div key={_cate.id}>{_cate.name}</div>
          ))}
        </td>
        <td className="p-4 py-5 text-sm text-slate-500">
          {formatDateWithIntl(product.createdAt)}
        </td>
        <td className="p-4 py-5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              className="border p-2 rounded-md"
              onClick={() => handleEdit(product)}
            >
              <Icon type="icon-edit" />
            </button>

            <button
              className="border p-2 rounded-md"
              onClick={() => handleClone(product)}
            >
              <Icon type="icon-clone" />
            </button>

            <button
              className="border p-2 rounded-md"
              onClick={() => handleConfirmDelete(product)}
            >
              <Icon type="icon-delete" />
            </button>
          </div>
        </td>
      </tr>
    ));

  return (
    <div className="mt-3 p-1">
      <div className="flex justify-between">
        <div className="w-full flex justify-between items-center mb-3 mt-1">
          <button
            className="flex gap-2 border rounded-md p-2 hover:bg-[#ffe9cf] transition-all"
            onClick={handleCreate}
          >
            <Icon type="icon-create" />
            <p>{t("common.create_new_product")}</p>
          </button>
        </div>

        <div className="w-[300px] max-w-sm  relative">
          <ProductFilterForm onSubmit={handleFilterChange} />
        </div>
      </div>

      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr>
              {[
                "product_page.table.product_name",
                "product_page.table.price",
                "product_page.table.quantity",
                "common.status",
                "product_page.table.category",
                "common.created_date",
                "common.actions",
              ].map((header, idx) => (
                <th
                  key={idx}
                  className="p-4 border-b border-slate-200 bg-[#ffe9cf]"
                  style={{ width: `${100 / 6}%` }}
                >
                  <p className="text-sm font-normal leading-none">
                    {t(header)}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{loading ? renderSkeleton() : renderProducts()}</tbody>
        </table>

        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-slate-500">
            Showing {pagination.page} of {pagination.total_page}
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: pagination.total_page }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 text-sm border rounded-md ${
                  pagination.page === i + 1 ? "bg-[#ffe9cf]" : "bg-white"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Popup
        isOpen={popupData}
        title={
          popupData?.id
            ? t("common.edit_product")
            : t("common.create_new_product")
        }
        onClose={handleClosePopup}
        onSubmit={handlePopupSubmit}
      >
        {Object.keys(formData).map((key) => {
          const field = formData[key];

          return (
            <FormField
              key={key}
              label={t(`product_page.popup.${key}`)}
              type={field.type}
              value={field.value}
              onChange={(e) =>
                handleFormChange(
                  key,
                  field.type === "checkbox" ? e.target.checked : e.target.value
                )
              }
              error={t(field.error)}
              options={field.options || []}
            />
          );
        })}

        <label
          htmlFor="#"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("common.category")}
        </label>
        <Select
          isMultiple
          value={categories.value}
          onChange={(value) => handleCategoryChange(value)}
          options={categories.options}
        />
      </Popup>

      <Popup
        isOpen={!!productDelete}
        title={t("common.confirm_delete")}
        onClose={handleCancelDelete}
        onSubmit={handleDeleteProduct}
      >
        <p>
          Bạn có chắc chắn muốn xóa sản phẩm <b>{productDelete?.name}</b> không?
        </p>
      </Popup>
    </div>
  );
}

export default ProductsPage;
