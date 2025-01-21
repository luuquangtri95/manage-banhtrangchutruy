import { useEffect, useState } from "react";
import Button from "../../../components/Button/Button";
import FormField from "../../../components/FormField/FormField";
import OrderApi from "../../../api/orderApi";
import PopupSucces from "../../../components/Popup/Succes";
import ProductApi from "../../../api/productApi";
import PopupError from "../../../components/Popup/PopupError/PopupError";
import ModalSelectProduct from "../../../components/Modal/ModalSelectProduct";

function OrderCreate(props) {
  const INIT_FORMDATA = {
    title: "Order ",
    fullname: "Taipham",
    address: "101 nguyen van banh, phuong 5, quan phu nhuan",
    phone: "023424144",
    delivery_date: "2/2/2025",
    data_json: {
      item: [{ name: "Banh trang muoi bo", quantity: 1 }],
    },
    status: "pending",
  };

  const [formData, setFormData] = useState(INIT_FORMDATA);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGetProduct = async () => {
    try {
      const res = await ProductApi.findAll();
      console.log("res APi", res);
      setProducts(res.data.metadata.result);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    handleGetProduct();
  }, []);

  const handleSelectProduct = () => {};

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
                  <FormField
                    label={`Products ${index + 1}`}
                    type="text"
                    value={itemProduct.name}
                    name="name"
                    onClick={handleGetProduct}
                  />
                </div>
                <div className="quantity">
                  <FormField
                    label="Quantity"
                    type="number"
                    value={itemProduct.quantity}
                    name="quantity"
                    onChange={(e) => handleChange(e, index)}
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

export default OrderCreate;
