import React from "react";
import { createPortal } from "react-dom";
import Icon from "../Icon/Icon";

const Popup = ({ isOpen, onClose, title, children, onSubmit }) => {
	// Nếu popup không mở, không render gì cả
	if (!isOpen) return null;

	// Popup content
	return createPortal(
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
				isOpen ? "opacity-100" : "opacity-0"
			}`}>
			<div
				className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative transition-transform ${
					isOpen ? "scale-100" : "scale-95"
				}`}>
				{/* Nội dung popup */}
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-medium">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700">
						<Icon type="icon-close" />
					</button>
				</div>

				<div className="mb-4">{children}</div>

				<div className="flex justify-end gap-1">
					<button
						onClick={onClose}
						className="px-2 py-2 text-[16px] bg-gray-500 text-white rounded-md hover:bg-gray-600">
						Close
					</button>

					<button
						onClick={onSubmit}
						className="px-2 py-2 text-[16px] bg-[#ffe9cf] text-black rounded-md ">
						Submit
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
};

export default Popup;
