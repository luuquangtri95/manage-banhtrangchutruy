import PropTypes from "prop-types";

Input.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
};

function Input(props) {
  const { label, type, name, value, onChange } = props;
  return (
    <div className="mb-2 text-left">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...(name === "phone" && {
          pattern: "[0-9]*",
          title: "Please enter a valid phone number",
        })}
        className="w-full p-2 border rounded"
      ></input>
    </div>
  );
}
export default Input;
