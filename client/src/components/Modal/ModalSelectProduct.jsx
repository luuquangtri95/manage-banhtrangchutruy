import PropTypes from "prop-types";
import { useState } from "react";

ModalSelectProduct.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      description: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

function ModalSelectProduct({ isOpen, onClose, onSelect, products }) {
  //   const [ischecked, setIsChecked] = useState([]);

  //   const handleCheckProduct = (product) => {

  //   };

  return (
    isOpen && (
      <div className="popup-modal fixed inset-0 bg-gray-600 bg-opacity-50 w-full h-full flex flex-wrap justify-center items-center">
        <div className=" bg-white text-sm p-4 w-[800px] max-w-full rounded shadow-lg">
          <h2 className="text-lg text-center font-bold mb-[35px]">
            Chọn bánh tráng yêu thích của bạn 😊
          </h2>
          <div className="list-wrapper">
            <div className="list-menu border rounded-md">
              <div className="bg-gray-100 flex font-medium">
                <div className="w-[40px] border-r"></div>
                <div className="p-2 border-r flex-1">Name</div>
                <div className="p-2 border-r w-[140px]">Price</div>
                <div className="p-2 border-r w-[100px]">Quantity</div>
                <div className="p-2 flex-1">Description</div>
              </div>

              {products.length > 0 ? (
                products.map((item, index) => (
                  <div
                    key={index}
                    className="flex border-t cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      onSelect(item);
                    }}
                  >
                    <div className="checkbox border-r w-[40px] flex items-center justify-center">
                      <input type="checkbox"></input>
                    </div>
                    <div className="p-2 border-r flex-1">{item.name}</div>
                    <div className="p-2 border-r w-[140px]">{item.price}</div>
                    <div className="p-2 border-r w-[100px]">
                      {item.quantity}
                    </div>
                    <div className="p-2 flex-1">{item.description}</div>
                  </div>
                ))
              ) : (
                <p>No Product</p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalSelectProduct;
