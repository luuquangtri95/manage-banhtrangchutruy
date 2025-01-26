import PropTypes from "prop-types";

SeriaNumber.propTypes = {
	index: PropTypes.number.isRequired,
	pagination: PropTypes.shape({
		page: PropTypes.number.isRequired,
		limit: PropTypes.number.isRequired,
		total_page: PropTypes.number.isRequired,
		total_item: PropTypes.number.isRequired,
	}).isRequired,
};

function SeriaNumber({ pagination, index }) {
	const currentPage = pagination.page;
	const limitPage = pagination.limit;

	const indexNumber = (currentPage - 1) * limitPage + index + 1;

	return (
		<div className="number p-2 w-[50px] border-r flex items-center justify-center">
			{indexNumber}
		</div>
	);
}

export default SeriaNumber;
