import PropTypes from "prop-types";

Badge.propTypes = {
	value: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
};

function Badge(props) {
	const { value, type, className = "" } = props;
	const badgeClass = () => {
		switch (type) {
			case "pending":
				return "bg-gray-200 text-[#3d3d3d]";
			case "active":
				return "bg-[#d5ebff] text-[#003a5a]";
			case "draft":
				return "bg-[#ffd6a4] text-[#5e4200]";
			default:
				return "bg-[#affebf]";
		}
	};

	return (
		<div
			className="status flex items-center text-sm"
			value={type}>
			<span className={`${badgeClass()} w-auto p-2 text-center rounded-md ${className}`}>
				{value}
			</span>
		</div>
	);
}

export default Badge;
