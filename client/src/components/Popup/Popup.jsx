import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Icon from "../Icon/Icon";
import useDetectDevice from "../../hooks/useDetectDevice";

const Popup = ({
	isOpen,
	onClose,
	title,
	children,
	onSubmit,
	width = "max-w-xl",
	minHeight = "",
}) => {
	const { t } = useTranslation();
	const _detectWidth = useDetectDevice();

	if (!isOpen) return null;

	return createPortal(
		<div
			className={`fixed ${
				_detectWidth > 768 ? "p-4" : "p-2"
			} inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
				isOpen ? "opacity-100" : "opacity-0"
			}`}>
			<div
				className={`bg-white rounded-lg shadow-lg w-full ${width} ${
					_detectWidth > 768 ? "p-6" : "p-2"
				} relative transition-transform ${isOpen ? "scale-100" : "scale-95"}`}>
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-lg font-medium">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700">
						<Icon type="icon-close" />
					</button>
				</div>

				<div
					className={`mb-4 overflow-y-scroll h-auto ${minHeight} ${
						_detectWidth > 768 ? "max-h-[800px]" : "max-h-[600px]"
					} p-3`}>
					{children}
				</div>

				<div className="flex justify-end gap-1">
					<button
						onClick={onClose}
						className="px-2 py-2 text-[16px] bg-gray-500 text-white rounded-md hover:bg-gray-600">
						{t("common.cancel")}
					</button>

					<button
						onClick={onSubmit}
						className="px-2 py-2 text-[16px] bg-main text-black rounded-md ">
						Submit
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
};

export default Popup;
