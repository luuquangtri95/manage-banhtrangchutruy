import { useEffect, useState } from "react";
import ProductApi from "../../../../../api/productApi";
import OrderApi from "../../../../../api/orderApi";
import FormField from "../../../../../components/FormField/FormField";
import Button from "../../../../../components/Button/Button";
import ModalSelectProduct from "../ModalSelect/ModalSelectProduct";
import Toast from "../../../../../components/Toast/Toast";
import { useTranslation } from "react-i18next";
import Icon from "../../../../../components/Icon/Icon";

function ModalOrderCreate(props) {
  const { isVisible, onClose } = props;
  const { t } = useTranslation();

  const INIT_FORMDATA = {
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
    isVisible && (
      <div className="fixed inset-0 z-10 bg-gray-600 bg-opacity-50 w-full h-full flex flex-wrap justify-center items-center">
        <div className="bg-white w-[800px]">
          <div className="m-auto">
            <div className="order-create relative flex p-6 flex-col w-full h-full text-gray-700">
              <div className="text-2xl font-bold mb-[35px]  text-center">
                Form Order
              </div>

              <form onSubmit={handleSubmitOrder}>
                <FormField
                  label={t("fullname")}
                  type="text"
                  value={formData.fullname}
                  name="fullname"
                  onChange={handleChange}
                />
                <FormField
                  label={t("address")}
                  type="text"
                  value={formData.address}
                  name="address"
                  onChange={handleChange}
                />
                <FormField
                  label={t("phone")}
                  type="text"
                  value={formData.phone}
                  name="phone"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="border p-2 rounded-lg mb-4 w-full text-left block text-sm font-medium text-gray-700"
                >
                  {t("select_product")}
                </button>
                {formData.data_json.item.some((item) => item.name) > 0 ? (
                  <div className="group-product border p-2 rounded-lg bg-gray-100 mb-4">
                    {formData.data_json.item.map((itemProduct, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-1">
                          <div className="block text-sm font-medium text-gray-700 mb-1">
                            {`Product ${index + 1}`}
                          </div>
                          <div className="flex items-center min-h-[42px] cursor-pointer border rounded-lg px-3 py-2 transition-all border-gray-300 bg-white">
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
                  </div>
                ) : (
                  <div className="border rounded-lg p-2 gap-2 flex items-center justify-center  h-[60px] w-full mb-4 bg-gray-100">
                    <Icon type="icon-blank" />
                    <span>{t("no_product")}</span>
                  </div>
                )}
                <FormField
                  label={t("delivery_date")}
                  type="date"
                  value={formData.delivery_date}
                  name="delivery_date"
                  onChange={handleChange}
                />
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Close
                  </button>
                  <Button type="submit" name="Submit" />
                </div>
              </form>
            </div>
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
        <Toast message="Create data success !!!" isVisible={isPopupOpen} />
      </div>
    )
  );
}

export default ModalOrderCreate;
