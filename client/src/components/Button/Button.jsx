import PropTypes from "prop-types";

Button.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function Button(props) {
  const { type, name } = props;
  return (
    <button
      type={type}
      className="mt-4 py-2 px-3 text-white rounded bg-orange-500 hover:bg-orange-700"
    >
      {name}
    </button>
  );
}
export default Button;
