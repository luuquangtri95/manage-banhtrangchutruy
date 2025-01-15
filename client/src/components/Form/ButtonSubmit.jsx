import PropTypes from "prop-types";

ButtonSubmit.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function ButtonSubmit(props) {
  const { type, name } = props;
  return (
    <button
      type={type}
      className="mt-4  text-white rounded bg-orange-500 hover:bg-orange-700"
    >
      {name}
    </button>
  );
}
export default ButtonSubmit;
