import { useState } from "react";
import ButtonSubmit from "../../../components/Form/ButtonSubmit";
import Input from "../../../components/Form/input";
import PopupSucces from "../../../components/Popup/PopupSucces";
import ModalSelectProduct from "../../../components/Modal/ModalSelectProduct";
import PopupError from "../../../components/Popup/PopupError/PopupError";

function UserOrderCreate() {
  const initFormData = {
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

  const [formData, setFormData] = useState(initFormData);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);

  console.log("formData", formData);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    console.log("name", name);

    setFormData((prev) => {
      const updateItem = prev.data_json.item.map((item, i) => {
        console.log("item", item.quantity);
        if (i === index) {
          // Cập nhật item tại index
          return { ...item, [name]: value };
        }
        // Giữ nguyên các item khác
        return item;
      });
      console.log("updateItem", updateItem);
      return {
        ...prev,
        data_json: {
          item: updateItem,
        },
      };
    });
  };

  const handleGetDataProduct = async () => {
    try {
      const res = await fetch("http://localhost:8017/v1/products", {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        setProducts(data.metadata.result);
        setIsModalOpen(true);
      } else {
        console.error("Failed: ", res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectProduct = async (itemSelect) => {
    setFormData((prev) => {
      const updateItem = [...prev.data_json.item];
      const selectProduct = updateItem.some(
        (product) => product.name === itemSelect.name
      );

      if (selectProduct) {
        setErrorMessage(true);
        setTimeout(() => setErrorMessage(false), 2000);
        return prev;
      }
      //Tim field rong de dien san pham bat dau bang 1
      const emptyIndex = updateItem.findIndex((item) => item.name === "");
      if (emptyIndex !== -1) {
        updateItem[emptyIndex] = {
          name: itemSelect.name,
          quantity: itemSelect.quantity,
        };
      } else {
        updateItem.push({
          name: itemSelect.name,
          quantity: itemSelect.quantity,
        });
      }

      return {
        ...prev,
        data_json: {
          item: updateItem,
        },
      };
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8017/v1/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("data", data);
        setFormData(initFormData);
        setIsPopupOpen(true);
        setTimeout(() => {
          setIsPopupOpen(false);
        }, 1500);
      } else {
        console.error("Failed: ", res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="pt-[40px] m-auto">
        <div className="order-create border relative flex p-6 flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <div className="text-2xl font-bold mb-[35px]  text-center">
            Order Product Form
          </div>
          <form onSubmit={handleSubmitOrder}>
            <Input
              label="Title"
              type="text"
              value={formData.title}
              name="title"
              onChange={handleChange}
            />
            <Input
              label="Name"
              type="text"
              value={formData.fullname}
              name="fullname"
              onChange={handleChange}
            />
            <Input
              label="Address"
              type="text"
              value={formData.address}
              name="address"
              onChange={handleChange}
            />
            <Input
              label="Phone"
              type="text"
              value={formData.phone}
              name="phone"
              onChange={handleChange}
            />
            {formData.data_json.item.map((itemProduct, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    label={`Products ${index + 1}`}
                    type="text"
                    value={itemProduct.name}
                    name="name"
                    onClick={handleGetDataProduct}
                  />
                </div>
                <div className="quantity">
                  <Input
                    label="Quantity"
                    type="number"
                    value={itemProduct.quantity}
                    name="quantity"
                    onChange={(e) => handleChange(e, index)}
                  />
                </div>
              </div>
            ))}
            <Input
              label="Delivery date"
              type="date"
              value={formData.delivery_date}
              name="delivery_date"
              onChange={handleChange}
            />
            <div className="flex justify-center">
              <ButtonSubmit type="submit" name="Submit" />
            </div>
          </form>
        </div>
      </div>
      <ModalSelectProduct
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
        onSelect={handleSelectProduct}
      />
      {/* Thông báo lỗi */}
      <PopupError
        message="Bạn đã chọn sản phẩm này rồi 😊"
        isVisible={errorMessage}
      />
      <PopupSucces message="Create data success !!!" isVisible={isPopupOpen} />
    </div>
  );
}

export default UserOrderCreate;
