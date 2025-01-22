import PropTypes from "prop-types";

Pagination.propTypes = {
  handleNextPage: PropTypes.func.isRequired,
  handlePrevPage: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total_page: PropTypes.number.isRequired,
    total_item: PropTypes.number.isRequired,
  }).isRequired,
  numberPagination: PropTypes.func.isRequired,
  handleSetPage: PropTypes.func.isRequired,
};

function Pagination(props) {
  const {
    handleNextPage,
    handlePrevPage,
    pagination,
    numberPagination,
    handleSetPage,
  } = props;

  const limitItem = pagination.limit;
  const totalItem = pagination.total_item;
  const pageNum = numberPagination();

  return (
    <div className="flex justify-between items-center px-4 py-3 test-sm">
      <div className="text-slate-500">
        Showing <b>{limitItem} </b>of <b>{totalItem}</b>
      </div>
      <div className="pagination flex gap-1 justify-between">
        <button
          className="prev bg-white border rounded-md px-2 py-1 disabled:bg-gray-400 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handlePrevPage}
          disabled={pagination.page === 1}
        >
          Prev
        </button>
        {/* <div className="num-page py-2 min-w-[46px] flex justify-center items-center ">
        <span>{pagination.page}</span>/<span>{pagination.total_page}</span>
      </div> */}

        <div className="pagination-number flex gap-1 justify-center items-center">
          {pageNum.map((itemPage, index) => (
            <span
              key={index}
              className={`p-1 border h-[36px] min-w-[36px] flex items-center justify-center rounded-md cursor-pointer hover:border-slate-400
              ${itemPage === pagination.page ? "bg-slate-800 text-white" : ""}
              `}
              onClick={() => {
                if (itemPage !== "...") {
                  handleSetPage(itemPage);
                }
              }}
            >
              {itemPage}
            </span>
          ))}
        </div>

        <button
          className="next px-2 py-1 bg-white border rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 hover:border-slate-400"
          onClick={handleNextPage}
          disabled={pagination.page === pagination.total_page}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
