import { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import FormField from "../../../components/FormField/FormField";
import OrderApi from "../../../api/orderApi";
import PopupSucces from "../../../components/Popup/Succes";
import ProductApi from "../../../api/productApi";
import ModalSelectProduct from "../list/component/ModalSelect/ModalSelectProduct";

function OrderCreate() {
  const INIT_FORMDATA = {
    title: "Order ",
    fullname: "Taipham",
    address: "101 nguyen van banh, phuong 5, quan phu nhuan",
    phone: "023424144",
    delivery_date: "2/2/2025",
    data_json: {
      item: [{ name: "", quantity: 1 }],
    },
    status: "pending",
  };

  const [formData, setFormData] = useState(INIT_FORMDATA);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeQuantity = (index, value) => {
    setFormData((prev) => {
      const updateQuantity = [...prev.data_json.item];
      console.log("updateQuantity", updateQuantity);
      updateQuantity[index].quantity = value;
      return {
        ...prev,
        data_json: {
          ...prev.data_json,
          item: updateQuantity,
        },
      };
    });
  };

  const handleGetProduct = async () => {
    try {
      const res = await ProductApi.findAll();
      setProducts(res.metadata.result);
      return res;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetProduct();
  }, []);

  // Chon san pham
  const handleSelectProduct = (selectItem) => {
    // console.log("selectItem", selectItem);
    setFormData((prev) => {
      const updateItems = [...prev.data_json.item];

      // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách
      const existingIndex = updateItems.findIndex(
        (item) => item.name === selectItem.name
      );
      console.log("existingIndex", existingIndex);

      if (existingIndex !== -1) {
        updateItems.splice(existingIndex, 1);
      } else {
        const emptyName = updateItems.findIndex((item) => !item.name);
        if (emptyName !== -1) {
          updateItems[emptyName] = {
            ...updateItems[emptyName],
            name: selectItem.name,
          };
        } else {
          updateItems.push({
            name: selectItem.name,
            quantity: 1,
          });
        }
      }

      return {
        ...prev,
        data_json: {
          ...prev.data_json,
          item: updateItems,
        },
      };
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await OrderApi.create(formData);
      setIsPopupOpen(true);
      setFormData(INIT_FORMDATA);
      setTimeout(() => {
        setIsPopupOpen(false);
      }, 2000);
      return res;
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full">
      <div className="pt-[46px] m-auto">
        <div className="order-create border relative flex p-6 flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <div className="text-2xl font-bold mb-[35px]  text-center">
            Order Product Form
          </div>
          <form onSubmit={handleSubmitOrder}>
            <FormField
              label="Title"
              type="text"
              value={formData.title}
              name="title"
              onChange={handleChange}
            />
            <FormField
              label="Name"
              type="text"
              value={formData.fullname}
              name="fullname"
              onChange={handleChange}
            />
            <FormField
              label="Address"
              type="text"
              value={formData.address}
              name="address"
              onChange={handleChange}
            />
            <FormField
              label="Phone"
              type="text"
              value={formData.phone}
              name="phone"
              onChange={handleChange}
            />
            {formData.data_json.item.map((itemProduct, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <div className="block text-sm font-medium text-gray-700 mb-1">
                    {`Product ${index + 1}`}
                  </div>
                  <div
                    className="flex items-center min-h-[42px] cursor-pointer border rounded-lg px-3 py-2 transition-all border-gray-300 bg-white"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {itemProduct.name}
                  </div>
                </div>
                <div className="quantity">
                  <FormField
                    label="Quantity"
                    type="number"
                    value={itemProduct.quantity}
                    name="quantity"
                    onChange={(e) =>
                      handleChangeQuantity(index, e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <FormField
              label="Delivery date"
              type="date"
              value={formData.delivery_date}
              name="delivery_date"
              onChange={handleChange}
            />
            <div className="flex justify-center">
              <Button type="submit" name="Submit" />
            </div>
          </form>
        </div>
      </div>
      <ModalSelectProduct
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        onSelect={handleSelectProduct}
        formData={formData}
      />

      {/* Thông báo thành công */}
      <PopupSucces message="Create data success !!!" isVisible={isPopupOpen} />
    </div>
  );
}

export default OrderCreate;
