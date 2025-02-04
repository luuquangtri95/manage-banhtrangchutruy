import { useEffect, useState } from "react";
import OrderApi from "../../api/orderApi";
import { formatDateWithIntl } from "../../helpers/convertDate";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import FormField from "../../components/FormField";
import Select from "react-tailwindcss-select";
import ProductApi from "../../api/productApi";
import Badge from "../../components/Badge/Badge";

const INIT_FORMDATA = {
  title: {
    value: "",
    type: "text",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "Title invalid";
      if (value.length < 5) return "Title not less 5 character";
    },
  },
  fullname: {
    value: "",
    type: "text",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "Name invalid";
    },
  },
  address: {
    value: "",
    type: "text",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "Name invalid";
    },
  },
  phone: {
    value: "",
    type: "number",
    error: "",
    validate: (value) => {
      if (!value.trim()) return "Name invalid";
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
};

const INIT_PRODUCT = {
  value: [],
  options: [],
};

function OrderPage() {
  const [popupData, setPopupData] = useState(null);
  const [formData, setFormData] = useState(INIT_FORMDATA);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [originProduct, setOriginProduct] = useState([]);

  // console.log("products", products);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await OrderApi.findAll();
      setOrders(res.metadata.result);
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
    try {
      const res = await OrderApi.create();
      console.log("res", res);
      setFormData(INIT_FORMDATA);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeProduct = (itemPicked) => {
    if (!itemPicked) {
      setOriginProduct([]);
    }

    let _originProducts = JSON.parse(JSON.stringify(originProduct));

    const _itemPicked = [...itemPicked].map((item) => {
      return { ...item, quantity: 1 };
    });

    if (_originProducts.length === 0) {
      _originProducts = [..._itemPicked];
    } else {
      const filtered = _itemPicked.filter((_item) => {
        return _originProducts.find((__item) => __item.value !== _item.value);
      });
      _originProducts = [..._originProducts, ...filtered];
      console.log("_originProducts", _originProducts);
    }

    setOriginProduct(_originProducts);
  };

  const handleChangeQuantityProductPicker = (e, currentProduct) => {
    const { value } = e.target;
    const _originProducts = JSON.parse(JSON.stringify(originProduct));

    const index = _originProducts.findIndex(
      (_item) => _item.value === currentProduct.value
    );

    _originProducts[index].quantity = value;
    setOriginProduct(_originProducts);
  };

  return (
    <div className="mt-3 p-1">
      <div className="flex justify-between">
        <div className="w-full flex justify-between items-center mb-3 mt-1">
          <button className="flex gap-2 border rounded-md p-2 hover:bg-[#ffe9cf] transition-all">
            <Icon type="icon-create" />
            <p>Tạo đơn đặt hàng</p>
          </button>
        </div>
      </div>
      <div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg">
        <table className="w-full text-left">
          <thead>
            <tr>
              {["Info", "Product", "Delivery date", "Pending"].map(
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Popup title="Tạo đơn hàng" isOpen={true} onSubmit={handlePopupSubmit}>
        <div className="flex gap-2 flex-wrap w-full">
          {Object.keys(formData).map((key) => {
            const field = formData[key];

            return (
              <div className="w-[calc(50%-4px)]" key={key}>
                <FormField
                  label={key}
                  value={field.value}
                  type={field.type}
                  error={field.error}
                  options={field.options || []}
                  onChange={(e) => handleFormChange(key, e.target.value)}
                  className="h-[38px] text-sm"
                />
              </div>
            );
          })}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            product
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
            <div className="flex gap-2 text-sm" key={item.value}>
              <FormField
                label="name"
                value={item?.label}
                type="text"
                className="cursor-not-allowed"
                disabled
              />
              <div className="w-[150px]">
                <FormField
                  label="quantity"
                  value={item.quantity}
                  type="number"
                  onChange={(e) => handleChangeQuantityProductPicker(e, item)}
                />
              </div>
            </div>
          );
        })}
      </Popup>
    </div>
  );
}

export default OrderPage;
