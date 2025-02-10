import { useCallback, useEffect, useRef, useState } from "react";
import OrderApi from "../../api/orderApi";
import { formatDateWithIntl } from "../../helpers/convertDate";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import FormField from "../../components/FormField";
import Select from "react-tailwindcss-select";
import ProductApi from "../../api/productApi";
import Badge from "../../components/Badge/Badge";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ProductFilterForm from "../product/components/ProductFilterForm/ProductFilterForm";

const INIT_FORMDATA = {
  title: {
    value: "",
    type: "text",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "validate.title_required";
      if (value.length < 5) return "valdate.name_min_length";
    },
  },
  fullname: {
    value: "",
    type: "text",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "validate.name_required";
    },
  },
  address: {
    value: "",
    type: "text",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "validate.address_required";
      return "";
    },
  },
  phone: {
    value: "",
    type: "number",
    error: "",
    validate: (value) => {
      if (!value.toString().trim()) return "validate.phone_required";
    },
  },
  status: {
    value: "",
    type: "select",
    error: "",
    options: [
      { value: "pending", label: "Pending" },
      { value: "active", label: "Active" },
      { value: "draft", label: "Draft" },
      { value: "success", label: "Success" },
    ],
  },
  delivery_date: {
    value: "",
    type: "date",
    error: "",
    validate: (value) => {
      if (!value.trim()) {
        return "validate.delivery_date";
      }
      const inputDate = new Date(value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (inputDate < currentDate)
        return "Ngay khong duoc nho hon ngay hien tai";
      if (isNaN(inputDate.getTime())) return "Ngay khong ton tai";
    },
  },
};

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 8,
  total_page: 10,
  total_item: 10,
};

const convertISOToDate = (isoString) => {
  return isoString?.split("T")[0];
};

function OrderPage() {
  const [popupData, setPopupData] = useState(null);
  const [formData, setFormData] = useState(INIT_FORMDATA);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [originProduct, setOriginProduct] = useState([]);
  const { t } = useTranslation();
  const [productDelete, setProductDelete] = useState(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    searchTerm: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [filters]);

  console.log("filters", filters);

  useEffect(() => {
    if (popupData) {
      const productPicked = popupData?.data_json?.item.map((_item) => ({
        value: _item.id,
        label: _item.name,
        quantity: _item.quantity,
      }));

      setOriginProduct(productPicked || []);

      setFormData((prev) => {
        const updateFormData = { ...prev };
        Object.keys(updateFormData).forEach((key) => {
          if (popupData[key] !== undefined) {
            updateFormData[key].value = popupData[key];
          }
          if (key === "delivery_date") {
            updateFormData[key].value = convertISOToDate(popupData[key]);
          }
        });

        console.log("updateFormData", updateFormData);
        return updateFormData;
      });
    }
  }, [popupData]);

  const fetchOrders = async () => {
    try {
      const res = await OrderApi.findAll(filters);
      setOrders(res.metadata.result);
      setPagination(res.metadata.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await ProductApi.findAll();
      const _product = res.metadata.result.map((item) => {
        return {
          value: item.id,
          label: item.name,
          quantity: item.quantity,
        };
      });
      setProducts(_product);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: { ...prev[name], value, error: "" },
    }));
  };

  const handlePopupSubmit = async () => {
    let hasError = false;
    let _formData = { ...formData };

    Object.keys(_formData).forEach((key) => {
      const field = _formData[key];

      if (field.validate) {
        const error = field?.validate(field.value);
        if (error) {
          hasError = true;
          _formData[key].error = error;
        }
      }
    });

    setFormData(_formData);
    if (hasError) return;

    const formatData = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key].type === "select") {
        formatData[key] = formData[key].options[0].value;
      } else {
        formatData[key] = formData[key].value;
      }
    });

    console.log("formatData", formatData);

    formatData.data_json = {
      item: originProduct.map((_item) => ({
        id: _item.value,
        name: _item.label,
        quantity: _item.quantity,
      })),
    };

    console.log("formData", formData);

    try {
      if (popupData && popupData.id) {
        await OrderApi.update({ ...formatData, id: popupData.id });
        toast.success("Product updated successfully");
      } else {
        const res = await OrderApi.create(formatData);
        console.log("res submit", res);
        toast.success(res.message);
      }
      setPopupData(null);
      setFormData(INIT_FORMDATA);
      setOriginProduct([]);
      fetchOrders();
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeProduct = (itemPicked) => {
    if (!itemPicked || itemPicked.length === 0) {
      setOriginProduct([]);
      return;
    }

    const _itemPicked = itemPicked.map((item) => {
      return {
        ...item,
        quantity:
          originProduct.find((_item) => _item.value === item.value)?.quantity ||
          1,
      };
    });

    setOriginProduct(_itemPicked);
  };

  const handleChangeQuantityProductPicker = (e, currentProduct) => {
    const { value } = e.target;

    const originQuantity = products.find(
      (item) => item.value === currentProduct.value
    );
    if (value > originQuantity.quantity) {
      toast.error(
        "Số lượng vượt quá tồn kho thực tế của sản phẩm, vui lòng giảm số lượng phù hợp"
      );
      return;
    }

    const _originProducts = JSON.parse(JSON.stringify(originProduct));

    const index = _originProducts.findIndex(
      (_item) => _item.value === currentProduct.value
    );

    _originProducts[index].quantity = value;
    setOriginProduct(_originProducts);
  };

  const handleInventoryQuantity = (itemInventory) => {
    const _inventory = products.find(
      (_itemInventory) => _itemInventory.value === itemInventory.value
    );
    return _inventory?.quantity;
  };

  const handleRemoveProductPicked = (item) => {
    const removeProduct = originProduct.filter(
      (_item) => _item.value !== item.value
    );
    setOriginProduct(removeProduct);
  };

  const handleDeleteProduct = async () => {
    try {
      await OrderApi.delete(productDelete.id);
      toast.success(`Product "${productDelete.name}" deleted successfully`);
      fetchOrders();
      setProductDelete(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmDelete = (product) => {
    setProductDelete(product);
  };

  const handleCreate = () => {
    setPopupData({});
  };

  const handleClosePopup = () => {
    setPopupData(null);
  };

  const handleCancelDelete = () => {
    setProductDelete(null);
  };

  const handleEdit = (itemEdit) => {
    setPopupData(itemEdit);
  };

  const renderPageNumbers = () => {
    const { page, total_page } = pagination;
    const renderNum = [];

    if (total_page < 5) {
      for (let i = 1; i <= total_page; i++) {
        renderNum.push(i);
      }
    } else {
      const left = Math.max(2, page - 1);
      const right = Math.min(total_page - 1, page + 1);

      renderNum.push(1);
      if (left > 2) {
        renderNum.push("...");
      }
      for (let i = left; i <= right; i++) {
        renderNum.push(i);
      }
      if (right < total_page - 1) {
        renderNum.push("...");
      }
      renderNum.push(total_page);
    }

    return renderNum;
  };

  const handleChangePage = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (newFilter) => {
    console.log("newFilter", newFilter);
    setFilters((prev) => ({ ...prev, ...newFilter }));
  };

  return (
    <div className="mt-3 p-1 pb-[100px]">
      <div className="flex justify-between">
        <div className="w-full flex justify-between items-center mb-3 mt-1">
          <button
            className="flex gap-2 border rounded-md p-2 hover:bg-[#ffe9cf] transition-all"
            onClick={handleCreate}
          >
            <Icon type="icon-create" />
            <p>{t("order_popup.header_title")}</p>
          </button>

          <div className="w-[300px] max-w-sm  relative">
            <ProductFilterForm onSubmit={handleFilterChange} />
          </div>
        </div>
      </div>
      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr>
              {["Info", "Product", "Delivery date", "Pending", "Action"].map(
                (header, index) => (
                  <th
                    key={index}
                    className="p-4 border-b border-slate-200 bg-[#ffe9cf]"
                  >
                    <p className="text-sm font-normal leading-none">{header}</p>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-slate-50 border-b border-slate-200"
              >
                <td className="py-4">
                  <div className="p-4 py-1 text-sm text-slate-800">
                    <span className="font-medium">Name: </span>
                    <span className="font-medium">{order.fullname}</span>
                  </div>
                  <div className="p-4 py-1 text-sm text-slate-500">
                    <span className="font-medium">Phone: </span>
                    {order.phone}
                  </div>
                  <div className="p-4 py-1 text-sm text-slate-500">
                    <span className="font-medium">Address: </span>
                    {order.address}
                  </div>
                </td>
                <td className="p-4 py-1 text-sm text-slate-500">
                  {order.data_json.item.map((product, index) => (
                    <div key={index} className="py-1">
                      {product.name}
                      <span className="font-medium"> x{product.quantity}</span>
                    </div>
                  ))}
                </td>
                <td className="p-4 py-1 text-sm text-slate-500">
                  {formatDateWithIntl(order.delivery_date)}
                </td>
                <td className="p-4 py-1 text-sm text-slate-500">
                  <Badge value={order.status} type={order.status} />
                </td>
                <td className="p-4 py-1 text-sm text-slate-500">
                  <div className="flex gap-2">
                    <button
                      className="border p-2 rounded-md"
                      onClick={() => handleEdit(order)}
                    >
                      <Icon type="icon-edit" />
                    </button>
                    <button
                      className="border p-2 rounded-md"
                      onClick={() => handleConfirmDelete(order)}
                    >
                      <Icon type="icon-delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-slate-500">
            Showing {pagination.page} of {pagination.total_page}
          </div>
          <div className="flex space-x-1">
            <button
              disabled={pagination.page === 1}
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }));
              }}
              className="px-3 py-1 text-sm border rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Prev
            </button>
            {renderPageNumbers().map((_page, _index) => (
              <button
                key={_index}
                className={`px-3 py-1 text-sm border rounded-md ${
                  pagination.page === _page ? "bg-[#ffe9cf]" : "bg-white"
                }`}
                onClick={() => handleChangePage(_page)}
              >
                {_page}
              </button>
            ))}
            <button
              className="px-3 py-1 text-sm border rounded-md disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={pagination.page === pagination.total_page}
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }));
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <Popup
        title={
          popupData?.id
            ? t("order_popup.header_edit")
            : t("order_popup.header_title")
        }
        isOpen={!!popupData}
        onSubmit={handlePopupSubmit}
        onClose={handleClosePopup}
      >
        <div className="flex gap-2 flex-wrap w-full">
          {Object.keys(formData).map((key) => {
            const field = formData[key];

            return (
              <div className="w-[calc(50%-4px)]" key={key}>
                <FormField
                  label={t(`order_popup.${key}`)}
                  value={field.value}
                  type={field.type}
                  error={field.error}
                  options={field.options || []}
                  onChange={(e) => handleFormChange(key, e.target.value)}
                  className="h-[38px] text-sm"
                  disabled={key === "status" ? true : false}
                />
              </div>
            );
          })}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("order_popup.product")}
          </label>
          <Select
            isMultiple
            value={originProduct}
            onChange={handleChangeProduct}
            options={products}
          />
        </div>
        {originProduct.map((item) => {
          return (
            <div className="flex gap-2 text-sm items-end" key={item.value}>
              <FormField
                label={t("order_popup.name_product")}
                value={item?.label}
                type="text"
                className="cursor-not-allowed h-[38px]"
                onChange={() => {}}
                disabled
              />
              <div className="w-[150px]">
                <FormField
                  label={t("order_popup.inventory")}
                  value={handleInventoryQuantity(item)}
                  type="number"
                  onChange={() => {}}
                  disabled
                  className="h-[38px]"
                />
              </div>
              <div className="w-[150px]">
                <FormField
                  label={t("order_popup.quantity")}
                  value={item.quantity}
                  type="number"
                  onChange={(e) => handleChangeQuantityProductPicker(e, item)}
                  className="h-[38px]"
                />
              </div>
              <div className="mb-4">
                <button
                  className="border p-2 rounded-md"
                  onClick={() => handleRemoveProductPicked(item)}
                >
                  <Icon type="icon-delete" />
                </button>
              </div>
            </div>
          );
        })}
      </Popup>

      <Popup
        title="Bạn có chắc chắn muốn xoá"
        isOpen={!!productDelete}
        onSubmit={handleDeleteProduct}
        onClose={handleCancelDelete}
      >
        <p>
          Bạn có chắc muốn xoá đơn hàng
          <b> {productDelete?.fullname} </b>
          này ?
        </p>
      </Popup>
    </div>
  );
}

export default OrderPage;
