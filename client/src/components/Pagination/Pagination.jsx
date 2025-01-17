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
  return (
    <div className="pagination flex gap-2 justify-center mt-2 mb-6">
      <button
        className="prev disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
        onClick={handlePrevPage}
        disabled={pagination.page === 1}
      >
        Prev
      </button>
      <div className="num-page py-2 min-w-[46px] flex justify-center items-center ">
        <span>{pagination.page}</span>/<span>{pagination.total_page}</span>
      </div>

      <div className="pagination-number py-2 flex gap-2 justify-center items-center">
        {numberPagination.map((itemPage) => (
          <span
            key={itemPage}
            className={`p-2 border min-w-[42px] text-center rounded-md cursor-pointer hover:bg-gray-300
              ${itemPage === pagination.page ? "bg-black text-white" : ""}
              `}
            onClick={() => handleSetPage(itemPage)}
          >
            {itemPage}
          </span>
        ))}
      </div>

      <button
        className="next disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70"
        onClick={handleNextPage}
        disabled={pagination.page === pagination.total_page}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
