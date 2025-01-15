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
};

function Pagination(props) {
  const { handleNextPage, handlePrevPage, pagination } = props;
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
