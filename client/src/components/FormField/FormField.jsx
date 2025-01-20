import PropTypes from "prop-types";

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

function FormField(props) {
  const { label, type, name, value, onChange, onClick } = props;

  return (
    <div className="mb-2 text-left">
      <label className="block text-sm font-bold mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        {...(name === "name" && {
          readOnly: true,
        })}
        onClick={name === "name" ? onClick : undefined}
        onChange={name !== "name" ? onChange : undefined}
        {...(name === "phone" && {
          pattern: "[0-9]*",
          title: "Please enter a valid phone number",
        })}
        className={`w-full p-2 border rounded-md ${
          name === name ? "cursor-pointer" : ""
        }`}
      ></input>
    </div>
  );
}
export default FormField;
