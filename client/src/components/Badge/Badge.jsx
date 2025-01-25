import PropTypes from "prop-types";

Badge.propTypes = {
  value: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

function Badge(props) {
  const { value, type } = props;
  const badgeClass = () => {
    switch (type) {
      case "pending":
        return "bg-gray-200 text-[#3d3d3d]";
      case "active":
        return "bg-[#d5ebff] text-[#003a5a]";
      case "draft":
        return "bg-[#ffd6a4] text-[#5e4200]";
      default:
        return "bg-[#4de74d]";
    }
  };

  return (
    <div
      className="status p-2 w-[84px] flex items-center text-[14px] border-r"
      value={type}
    >
      <span
        className={`${badgeClass()} w-full text-center pb-[2px] rounded-md`}
      >
        {value}
      </span>
    </div>
  );
}

export default Badge;
