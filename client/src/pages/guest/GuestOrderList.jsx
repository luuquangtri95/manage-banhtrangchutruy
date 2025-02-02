import { useEffect, useState } from "react";
import Layout from "../../layouts/Layout";
import Pagination from "../../components/Pagination/pagination";
import Badge from "../../components/Form/Badge";
import { useNavigate } from "react-router-dom";
import NumberSeria from "../../components/Form/NumberSeria";

function GuestOrderList() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [pagination, setPagination] = useState({});

  const handleGetAllData = async (page = 1, limit = 5) => {
    try {
      const res = await fetch(
        `http://localhost:8017/v1/orders/?page=${page}&limit=${limit}`,
        {
          method: "GET",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setOrderData(data.metadata.result);
        setPagination(data.metadata.pagination);
        return data;
      } else {
        console.error("Failed: ", res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNextPage = () => {
    setPagination((prev) => ({
      ...pagination,
      page: prev.page + 1,
    }));
  };

  const handlePrevPage = () => {
    setPagination((prev) => ({
      ...pagination,
      page: prev.page - 1,
    }));
  };

  useEffect(() => {
    navigate(`/orders/?page=${pagination.page}&limit=${pagination.limit}`);
    handleGetAllData(pagination.page);
  }, [pagination.page]);

  return (
    <div className="page-order-list">
      <Layout />
      <div className="pt-[40px] max-w-[1100px] m-auto">
        <div className="text-2xl font-bold mb-4 text-center">Order List</div>
        <div className="render-list">
          <div className="border text-left mb-4">
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
                <div className="status p-2 w-[84px]">Status</div>
              </div>
            </div>
            <div className="tab-content">
              {orderData.length > 0 ? (
                orderData.map((item, index) => (
                  <div key={index} className="flex border-t min-h-[50px]">
                    {/* <div className="number p-2 w-[50px] border-r flex items-center justify-center">
                      {index + 1}
                    </div> */}
                    <NumberSeria
                      pagination={pagination}
                      data={orderData}
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
        />
      </div>
    </div>
  );
}

export default GuestOrderList;
