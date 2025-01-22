import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SeriaNumber from "../../../components/SeriaNumber";
import OrderApi from "../../../api/orderApi";
import Pagination from "../../../components/Pagination";
import Badge from "../../../components/Badge";
import Icon from "../../../components/Icon/Icon";
import PopupSucces from "../../../components/Popup/Succes";

function OrderList(props) {
  const navigate = useNavigate();
  const [orderList, setOrderList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleGetAllData = async () => {
    const params = {
      page: pagination.page,
    };
    const res = await OrderApi.findAll(params);
    setOrderList(res.metadata.result);
    setPagination(res.metadata.pagination);
    return res;
  };

  //Button next
  const handleNextPage = () => {
    setPagination((prev) => ({
      ...pagination,
      page: prev.page + 1,
    }));
  };

  //Button prev
  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...pagination,
      page: prev.page - 1,
    }));
  };

  //Phân trang khi có nhiều trang có dấu ...
  const numberPagination = () => {
    const indexPage = [];
    const currentPage = pagination.page;
    const totalPage = pagination.total_page;

    //Số trái phải của page chọn
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPage - 1, currentPage + 1);

    // console.log("left", left);
    // console.log("right", right);

    // Luôn hiển thị trang 1
    indexPage.push(1);

    // 3 chấm bên trái
    if (left > 2) {
      indexPage.push("...");
    }

    //Phạm vi 2 page trái phải của số chọn
    for (let i = left; i <= right; i++) {
      indexPage.push(i);
    }

    // 3 chấm bên phải
    if (right < totalPage - 1) {
      indexPage.push("...");
    }

    //Luôn hiện trang cuối cùng
    indexPage.push(totalPage);

    return indexPage;
  };

  //Click chuyển trang từng page
  const handleSetPage = (page) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  };

  //hàm xoá order
  const handleDeleteOrder = async (id) => {
    console.log("id", id);
    try {
      const res = await OrderApi.delete(id);
      console.log("res", res);
      setIsPopupOpen(true);
      handleGetAllData();
      setTimeout(() => {
        setIsPopupOpen(false);
      }, 2000);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    navigate(`?page=${pagination.page}&limit=${pagination.limit}`);
    handleGetAllData(pagination.page);
  }, [pagination.page]);

  return (
    <div className="page-order-list text-[14px]">
      <div className="pt-[40px] max-w-[1100px] m-auto">
        <div className="text-2xl font-bold mb-4 text-center">Order List</div>
        <div className="order-wrapper relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
          <div className="render-list">
            <div className="border text-left rounded-l-lg rounded-r-lg">
              <div className="tab-header">
                <div className="flex bg-gray-100 font-medium">
                  <div className="number p-2 w-[50px] border-r"></div>
                  <div className="name p-2 w-[150px] border-r">Name</div>
                  <div className="address p-2 flex-1 border-r">Address</div>
                  <div className="phone p-2 w-[130px] border-r">Phone</div>
                  <div className="delivery_date p-2 w-[115px] border-r ">
                    Delivery date
                  </div>
                  <div className="item p-2 w-[180px] border-r">Product</div>
                  <div className="quantity p-2 w-[80px] border-r">Quantity</div>
                  <div className="status p-2 w-[84px] border-r">Status</div>
                  <div className="status p-2 w-[60px]">Action</div>
                </div>
              </div>
              <div className="tab-content">
                {orderList.length > 0 ? (
                  orderList.map((item, index) => (
                    <div key={index} className="flex border-t min-h-[50px]">
                      <SeriaNumber
                        pagination={pagination}
                        data={orderList}
                        index={index}
                      />
                      <div className="product p-2 w-[150px] border-r flex items-center">
                        {item.fullname}
                      </div>
                      <div className="address p-2 flex-1 border-r flex items-center">
                        {item.address}
                      </div>
                      <div className="phone p-2 w-[130px] border-r flex items-center">
                        {item.phone}
                      </div>
                      <div className="delivery_date p-2 w-[115px] border-r flex items-center">
                        {new Date(item.delivery_date).toLocaleDateString()}
                      </div>
                      <div className="item p-2 w-[180px] border-r flex items-center">
                        {item.data_json?.item?.name ||
                          item.data_json?.items?.name}
                      </div>
                      <div className="quantity p-2 w-[80px] border-r flex items-center">
                        {item.data_json?.item?.quantity ||
                          item.data_json?.items?.quantity}
                      </div>
                      <Badge value={item.status} type="pending" />
                      <div className="action p-2 w-[60px] flex items-center">
                        <button onClick={() => handleDeleteOrder(item.id)}>
                          <Icon type="icon-delete" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-2 flex justify-center items-center border-t min-h-[50px]">
                    No Product
                  </p>
                )}
              </div>
            </div>
          </div>
          <Pagination
            handleNextPage={handleNextPage}
            handlePrevPage={handlePrevPage}
            pagination={pagination}
            numberPagination={numberPagination}
            handleSetPage={handleSetPage}
          />
        </div>
      </div>
      {/* Thông báo xoá thành công */}
      <PopupSucces message="Đã xoá sản phẩm bạn chọn" isVisible={isPopupOpen} />
    </div>
  );
}

export default OrderList;
