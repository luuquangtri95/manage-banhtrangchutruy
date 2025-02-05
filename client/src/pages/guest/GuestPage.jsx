import { useState } from "react";
import Input from "../../components/Form/input";
import ButtonSubmit from "../../components/Form/ButtonSubmit";
import PopupSucces from "../../components/Popup/PopupSucces";
import Layout from "../../layouts/Layout";

function GuestPage() {
  const initFormData = {
    title: "Order ",
    fullname: "Taipham",
    address: "101 nguyen van banh, phuong 5, quan phu nhuan",
    phone: "023424144",
    delivery_date: "2/2/2025",
    data_json: {
      item: { name: "xike deo", quantity: 13 },
    },
    status: "pending",
  };

  const [formData, setFormData] = useState(initFormData);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <div className="w-full min-h-[100vh]">
      <Layout />
      <div className="pt-[40px] max-w-[800px] m-auto">
        <div className="text-2xl font-bold mb-4 text-center">
          Order Product Form
        </div>
        <form className="mb-4" onSubmit={handleSubmitOrder}>
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
          <Input
            label="Products"
            type="text"
            value={formData.data_json.item.name}
            name="name"
            onChange={handleChange}
          />
          <Input
            label="Quantity"
            type="number"
            value={formData.data_json.item.quantity}
            name="quantity"
            onChange={handleChange}
          />
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
      <PopupSucces message="Create data success !!!" isVisible={isPopupOpen} />
    </div>
  );
}

export default GuestPage;
