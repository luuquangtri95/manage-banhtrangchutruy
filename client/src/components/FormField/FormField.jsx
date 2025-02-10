import { useId, useState } from "react";
import PropTypes from "prop-types";

FormField.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "select",
    "textarea",
    "checkbox",
    "radio",
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.elementType, // Dành cho component icon
  id: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  className: PropTypes.string,
};

function FormField({
  label,
  placeholder = "",
  type = "text",
  value = "",
  onChange,
  onFocus,
  onBlur,
  error = "",
  disabled = false,
  icon: Icon,
  id,
  name,
  options = [], // Dành cho select, radio
  className = "",
}) {
  const fieldId = useId(); // Tạo ID tự động nếu không có
  const [isFocused, setIsFocused] = useState(false);

  // Xử lý sự kiện focus
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  // Xử lý sự kiện blur
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Xác định class cho phần bọc input
  const wrapperClass = `flex items-center border rounded px-3 py-[6px] transition-all ${
    error
      ? "border-red-500 focus-within:border-red-500"
      : isFocused
      ? "border-blue-500"
      : "border-gray-300"
  } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"} ${className}`;

  // Xử lý render theo type
  let inputField;
  switch (type) {
    case "date":
      inputField = (
        <input
          type="date"
          id={id || fieldId}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 "
        />
      );
      break;

    case "select":
      inputField = (
        <select
          id={id || fieldId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;

    case "textarea":
      inputField = (
        <textarea
          id={id || fieldId}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 resize-none h-24 "
        />
      );
      break;

    case "number":
      inputField = (
        <input
          pattern="[0-9]*"
          inputMode="numeric"
          id={id || fieldId}
          name={name}
          type="number"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 "
          min={1}
        />
      );
      break;

    case "checkbox":
      inputField = (
        <input
          id={id || fieldId}
          name={name}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      );
      break;

    case "radio":
      inputField = options.map((option) => (
        <label
          key={option.value}
          className="inline-flex items-center space-x-2"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            disabled={disabled}
            className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <span>{option.label}</span>
        </label>
      ));
      break;

    case "file":
      inputField = (
        <input
          id={id || fieldId}
          name={name}
          type="file"
          onChange={(e) => onChange(e.target.checked)}
          accept="image/png, image/jpg"
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      );
      break;

    default:
      inputField = (
        <input
          id={id || fieldId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 "
        />
      );
  }

  return (
    <div className="w-full mb-4">
      {/* Label */}
      {label && (
        <label
          htmlFor={id || fieldId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      {type === "checkbox" || type === "radio" ? (
        <div className="flex items-center space-x-2">{inputField}</div>
      ) : (
        <div className={wrapperClass}>
          {/* Icon (nếu có) */}
          {Icon && <Icon className="w-5 h-5 text-gray-500 mr-3" />}
          {inputField}
        </div>
      )}

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default FormField;
