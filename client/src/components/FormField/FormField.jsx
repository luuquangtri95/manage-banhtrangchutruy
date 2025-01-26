import React, { useState } from "react";

const FormField = ({
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
}) => {
	// Trạng thái focus để xử lý hiệu ứng
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

	return (
		<div className="w-full mb-4">
			{/* Label */}
			{label && (
				<label
					htmlFor={id}
					className="block text-sm font-medium text-gray-700 mb-1">
					{label}
				</label>
			)}

			{/* Input Wrapper */}
			<div
				className={`flex items-center border rounded-lg px-3 py-2 transition-all ${
					error
						? "border-red-500 focus-within:border-red-500"
						: isFocused
						? "border-blue-500"
						: "border-gray-300"
				} ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}>
				{/* Icon (if provided) */}
				{Icon && <Icon className="w-5 h-5 text-gray-500 mr-3" />}

				{/* Input */}
				<input
					id={id}
					name={name}
					type={type}
					value={value}
					placeholder={placeholder}
					onChange={onChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					disabled={disabled}
					className={`w-full bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 ${
						disabled ? "cursor-not-allowed" : ""
					}`}
				/>
			</div>

			{/* Error Message */}
			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
};

export default FormField;
