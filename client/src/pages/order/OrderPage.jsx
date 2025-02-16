import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-tailwindcss-select";
import { toast } from "react-toastify";
import CategoryApi from "../../api/categoryApi";
import OrderApi from "../../api/orderApi";
import Badge from "../../components/Badge/Badge";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";
import usePageLoading from "../../hooks/usePageLoading";
import { DashboardContext } from "../dashboard/Dashboard";

const INIT_FORMDATA = {
	title: {
		value: "",
		type: "text",
		error: "",
		disabled: false,
		validate: (value) => {
			if (!value.trim()) return "order_page.validate.title_is_required";
			if (value.length < 5) return "order_page.validate.title_min_length";
			return "";
		},
	},
	fullname: {
		value: "",
		type: "text",
		error: "",
		disabled: false,
		validate: (value) => {
			if (!value.trim()) return "order_page.validate.username_is_required";
			return "";
		},
	},
	address: {
		value: "",
		type: "text",
		error: "",
		disabled: false,
		validate: (value) => {
			if (!value.trim()) return "order_page.validate.address_is_required";
			return "";
		},
	},
	phone: {
		value: "",
		type: "number",
		error: "",
		disabled: false,
		validate: (value) => {
			const regex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

			if (!value.toString().trim()) return "order_page.validate.phone_is_required";
			if (!regex.test(value)) {
				return "order_page.validate.phone_invalid";
			}

			return "";
		},
	},
	status: {
		value: "pending",
		type: "select",
		error: "",
		disabled: true,
		options: [
			{ value: "pending", label: "Pending" },
			{ value: "active", label: "Active" },
			{ value: "draft", label: "Draft" },
			{ value: "success", label: "Success" },
		],
	},
	delivery_date: {
		value: "",
		type: "date",
		error: "",
		validate: (value) => {
			if (typeof value !== "string" || !value.trim())
				return "order_page.validate.delivery_is_required";

			const inputDate = new Date(value);
			const currentDate = new Date();

			currentDate.setHours(0, 0, 0, 0);

			if (isNaN(inputDate.getTime())) return "order_page.validate.invalid_date";

			if (inputDate < currentDate) return "order_page.validate.date_must_be_today_or_later";

			return "";
		},
	},
};

const DEFAULT_PAGINATION = {
	page: 1,
	limit: 8,
	total_page: 5,
	total_item: 10,
};

const convertISOToDate = (isoString) => {
	return isoString?.split("T")[0]; // Lấy phần trước ký tự "T"
};

function OrderPage() {
	const [popupData, setPopupData] = useState(null);
	const [orderDelete, setOrderDelete] = useState(null);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [orders, setOrders] = useState([]);
	const [productsCategories, setProductsCategories] = useState([]);
	const [originProduct, setOriginProduct] = useState([]);
	const [filters, setFilters] = useState({ page: 1, limit: 5, searchTerm: "" });
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const { t } = useTranslation();
	const { isLoading, showLoading, hideLoading } = usePageLoading();
	const { userInfo } = useContext(DashboardContext);
	const [popoverData, setPopoverData] = useState(null);

	const popoverRef = useRef(null);

	useEffect(() => {
		fetchOrders();
		fetchCategories();
	}, [filters]);

	useEffect(() => {
		if (popupData) {
			const products = popupData?.data_json?.item?.map((_item) => ({
				value: _item.id,
				label: _item.name,
				quantity: _item.quantity,
			}));
			setOriginProduct(products || []);

			setFormData((prev) => {
				const updatedFormData = { ...prev };

				Object.keys(updatedFormData).forEach((key) => {
					if (popupData[key] !== undefined) {
						updatedFormData[key].value = popupData[key];
					}

					if (key === "delivery_date") {
						updatedFormData[key].value = convertISOToDate(popupData[key]);
					}
				});
				return updatedFormData;
			});
		}

		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		if (userInfo) {
			setFormData((prev) => ({
				...prev,
				fullname: { ...prev.fullname, value: userInfo.username || "" },
				phone: { ...prev.phone, value: userInfo.phone || "" },
				address: { ...prev.address, value: userInfo.address || "" },
			}));
		}
	}, [popupData]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (popoverRef.current && !popoverRef.current.contains(e.target)) {
				setPopoverData(null);
			}
		};

		// Chỉ gắn sự kiện nếu popoverData tồn tại (popover đang mở)
		if (popoverData) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		// Cleanup khi component unmount hoặc popoverData thay đổi
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [popoverData]);

	const fetchOrders = async () => {
		try {
			showLoading();
			const res = await OrderApi.findAll(filters);
			const totalPage = res.metadata.pagination.total_page;

			if (totalPage === 0 && filters.page !== 1) {
				setFilters((prev) => ({ ...prev, page: 1 }));
			} else if (totalPage > 0 && filters.page > totalPage && filters.page !== totalPage) {
				setFilters((prev) => ({
					...prev,
					page: totalPage,
				}));
			}
			setOrders(res.metadata.result);
			setPagination(res.metadata.pagination);
		} catch (error) {
			console.log("fetchOrders error", error);
			toast.error("Failed to fetch orders");
		} finally {
			hideLoading();
		}
	};

	const fetchCategories = async () => {
		try {
			showLoading();

			const res = await CategoryApi.findAll();

			const __product = res.metadata.result.map((_item) => {
				return {
					label: _item.name.toUpperCase(),
					options: _item.products
						.map((item) => {
							return {
								value: item.id,
								label: item.name,
								quantity: item.quantity,
							};
						})
						.filter((_item) => _item.quantity > 0),
				};
			});

			setProductsCategories(__product);
		} catch (error) {
			console.log(error);
		} finally {
			hideLoading();
		}
	};

	const handleFormChange = (name, value) => {
		setFormData((prev) => ({
			...prev,
			[name]: { ...prev[name], value, error: "" },
		}));
	};

	const handlePopupSubmit = async () => {
		let hasError = false;

		const newFormData = { ...formData };
		Object.keys(newFormData).forEach((key) => {
			const field = newFormData[key];

			if (field?.validate) {
				const error = field?.validate(field.value);
				if (error) {
					hasError = true;
					newFormData[key].error = error;
				}
			}
		});

		setFormData(newFormData);

		if (hasError) return;

		const formattedData = Object.keys(newFormData).reduce((acc, key) => {
			acc[key] = newFormData[key].value;
			return acc;
		}, {});

		if (originProduct?.length) {
			formattedData.data_json = {
				item: originProduct?.map((_item) => ({
					id: _item.value,
					name: _item.label,
					quantity: _item.quantity,
				})),
			};
		} else {
			toast.error("Không thể tạo order khi không có sản phẩm");
			return;
		}

		try {
			if (popupData && popupData.id) {
				await OrderApi.update({ ...formattedData, id: popupData.id });
				toast.success("Order updated successfully");
			} else {
				formattedData.status = "active";
				const res = await OrderApi.create(formattedData);

				toast.success(res.message);
			}
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			fetchOrders();
			fetchCategories();
		}
	};

	const handleChangeProduct = (itemPicked) => {
		if (!itemPicked || itemPicked.length === 0) {
			setOriginProduct([]);
			return;
		}

		const newProducts = itemPicked.map((item) => ({
			...item,
			quantity: originProduct.find((p) => p.value === item.value)?.quantity || 1,
		}));

		setOriginProduct(newProducts);
	};

	const handleChangeQuantityProductPicker = (e, currentProduct) => {
		const { value } = e.target;

		const findItemCategories = productsCategories.find((_item) =>
			_item.options.some((__item) => __item.value === currentProduct.value)
		);

		const findOriginQuantity = findItemCategories.options.find(
			(_item) => _item.value === currentProduct.value
		).quantity;

		if (value > findOriginQuantity) {
			toast.error(
				"Số lượng vượt quá tồn kho thực tế của sản phẩm, vui lòng giảm số lượng phù hợp"
			);
			return;
		}

		const _originProducts = JSON.parse(JSON.stringify(originProduct));

		const index = _originProducts.findIndex((_item) => _item.value === currentProduct.value);

		_originProducts[index].quantity = value;
		setOriginProduct(_originProducts);
	};

	const handleCreate = () => {
		setPopupData({ title: "", fullname: "", address: "", phone: "" });
	};

	const handleRemoveProductPicked = (itemPicked) => {
		const _originProduct = JSON.parse(JSON.stringify(originProduct));

		setOriginProduct(_originProduct.filter((_item) => _item.value !== itemPicked.value));
	};

	const handleClosePopup = () => {
		setFormData((prev) => {
			const initData = { ...prev };

			Object.keys(initData).forEach((key) => {
				initData[key].error = "";
			});

			return initData;
		});

		setPopupData(null);
	};

	const handleEdit = (item) => {
		setPopupData(item);
	};

	const handleConfirmDelete = (product) => {
		setOrderDelete(product); // Đặt sản phẩm cần xóa
	};

	const handleDeleteOrder = async () => {
		if (!orderDelete) return;

		if (orderDelete.status === "success" && userInfo?.role !== "admin") {
			toast.error(
				"Đơn hàng đã hoàn tất, bạn không thể xoá đơn hàng này !, vui lòng liên hệ admin"
			);
			return;
		}

		try {
			await OrderApi.delete(orderDelete.id);
			toast.success(`Order "${orderDelete.title}" deleted successfully`);
			fetchOrders();
		} catch (error) {
			console.log("handleDeleteOrder error", error);
			toast.error("Fail to fetch");
		} finally {
			setOrderDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setOrderDelete(null);
	};

	const handleChangeStatus = async (currentOrder, newStatus) => {
		try {
			const _currentOrder = JSON.parse(JSON.stringify(currentOrder));

			_currentOrder.status = newStatus;

			const res = await OrderApi.update(_currentOrder);

			toast.success("Order update status successfully");
		} catch (error) {
			console.log("handleChangeStatus error", error);
			toast.error("Fail to fetch");
		} finally {
			fetchOrders();
		}
	};

	const handlePopoverChange = (currentOrder) => {
		setPopoverData(currentOrder);
	};

	const renderSkeleton = () =>
		Array.from({ length: orders.length }).map((_, rowIndex) => (
			<tr
				key={rowIndex}
				className="animate-pulse h-[81px]">
				{Array.from({ length: 6 }).map((_, colIndex) => (
					<td
						key={colIndex}
						className="p-4 py-5">
						<div className="h-6 bg-gray-200 rounded"></div>
					</td>
				))}
			</tr>
		));

	const handlePageChange = (newPage) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

	const renderOrders = () =>
		orders.map((order) => (
			<tr
				key={order.id}
				className="hover:bg-slate-50 border-b border-slate-200">
				<td className="py-4">
					<div className="p-4 py-1 text-sm text-slate-800">
						<div className="flex items-center gap-1">
							<span className="font-medium">
								{t("order_page.table.order_title").toUpperCase()} :
							</span>
							<div className="flex items-center gap-1">
								<span className="font-medium text-[#2563EB]">
									{order.title.length > 15
										? order.title.slice(0, 15) + "..."
										: order.title}
								</span>
								<div className="relative group">
									<Icon type="icon-info" />

									<div className="absolute flex items-center p-2 w-auto h-[30px] rounded-md top-[-35px] bg-[#eee] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
										{order.title}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="p-4 py-1 text-sm text-slate-800">
						<span className="font-medium">
							{t("order_page.table.username").toUpperCase()} :
						</span>
						<span className="font-medium text-[#2563EB]">
							{order.fullname.length > 15
								? order.fullname.slice(0, 15) + "..."
								: order.fullname}
						</span>
					</div>
					<div className="p-4 py-1 text-sm text-slate-800">
						<span className="font-medium">
							{t("order_page.table.phone").toUpperCase()} :
						</span>
						<span className="font-medium text-[#2563EB]">{order.phone}</span>
					</div>
					<div className="p-4 py-1 text-sm text-slate-800">
						<div className="flex items-center gap-1">
							<span className="font-medium">
								{t("order_page.table.address").toUpperCase()} :
							</span>
							<div className="flex items-center gap-1">
								<span className="font-medium text-[#2563EB]">
									{order.address.length > 15
										? order.address.slice(0, 15) + "..."
										: order.address}
								</span>
								<div className="relative group">
									<Icon type="icon-info" />

									<div className="absolute flex items-center p-2 w-auto h-[30px] rounded-md top-[-35px] bg-[#eee] shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
										{order.address}
									</div>
								</div>
							</div>
						</div>
					</div>
				</td>
				<td className="p-4 py-1 text-sm text-slate-500">
					<span className="font-medium">{order?.users?.email}</span>
					<div className="border w-[50px] h-[2px] border-[#2563EB]"></div>
				</td>
				<td className="p-4 py-1 text-sm text-slate-500">
					<ul className="list-disc">
						{order.data_json.item.map((product, index) => (
							<li
								key={index}
								className="py-1 text-black">
								{product.name}
								<span className="font-medium">
									{" "}
									<b className="text-white bg-[#2563EB] p-1 rounded-md ">
										x {product.quantity}
									</b>
								</span>
							</li>
						))}
					</ul>
				</td>
				<td className="p-4 py-1 text-sm text-slate-500">
					<Badge
						value={formatDateWithIntl(order.delivery_date)}
						type="active"
						className="#003a5a"></Badge>
				</td>
				<td className="p-4 py-1 text-sm text-slate-500">
					<Badge
						value={t(`order_page.table.${order.status}`)}
						type={order.status}
						className="text-[#014b40]"
					/>
				</td>
				<td className="p-4 py-1 text-sm text-slate-500">
					{formatDateWithIntl(order.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2 flex-wrap">
						{userInfo?.role === "admin" && (
							<div className="relative">
								<button
									className=" border p-2 rounded-md"
									onClick={() => handlePopoverChange(order)}>
									<Icon type="icon-dot-menu" />
								</button>
								{popoverData?.id === order.id && (
									<div
										ref={popoverRef}
										className="absolute w-[200px] h-auto max-h-[186px] bg-white top-[-70px] left-[-210px] rounded-md flex flex-col justify-center gap-1 p-2 shadow-lg">
										<div
											className={`cursor-pointer flex gap-2 items-center rounded-md hover:bg-[#ccc] hover:text-black transition-all ${
												order.status === "success" &&
												userInfo?.role !== "admin" &&
												"pointer-events-none opacity-50"
											}`}
											onClick={() => handleEdit(order)}>
											<button className="border p-2 rounded-md">
												<Icon type="icon-edit" />
											</button>
											<p>Edit order</p>
										</div>

										{userInfo?.role === "admin" && (
											<div
												className={`cursor-pointer flex gap-2 items-center rounded-md hover:bg-[#ccc] hover:text-black transition-all ${
													order.status === "success" &&
													"pointer-events-none opacity-[0.4]"
												}`}
												onClick={() =>
													handleChangeStatus(order, "success")
												}>
												<button className="border p-2 rounded-md">
													<Icon type="icon-success" />
												</button>
												<p>Complete Order</p>
											</div>
										)}

										{userInfo?.role === "admin" && (
											<div
												className={`cursor-pointer flex gap-2 items-center rounded-md hover:bg-[#ccc] hover:text-black transition-all ${
													order.status === "pending" &&
													"pointer-events-none opacity-[0.4]"
												}`}
												onClick={() =>
													handleChangeStatus(order, "pending")
												}>
												<button className="border p-2 rounded-md">
													<Icon type="icon-pending" />
												</button>
												<p>Pending Order</p>
											</div>
										)}

										<div
											className={`cursor-pointer flex gap-2 items-center rounded-md hover:bg-[#ccc] hover:text-black transition-all ${
												order.status === "success" &&
												userInfo?.role !== "admin" &&
												"pointer-events-none opacity-50"
											}`}
											onClick={() => handleConfirmDelete(order)}>
											<button className="border p-2 rounded-md">
												<Icon type="icon-delete" />
											</button>
											<p>Delete Order</p>
										</div>
									</div>
								)}
							</div>
						)}

						{order.status !== "success" && userInfo?.role !== "admin" && (
							<div className="relative">
								<button
									className=" border p-2 rounded-md"
									onClick={() => handlePopoverChange(order)}>
									<Icon type="icon-dot-menu" />
								</button>
								{popoverData?.id === order.id && (
									<div
										ref={popoverRef}
										className="absolute w-[200px] h-auto max-h-[186px] bg-white top-[-70px] left-[-210px] rounded-md flex flex-col justify-center gap-1 p-2 shadow-lg">
										<div
											className={`cursor-pointer flex gap-2 items-center rounded-md hover:bg-[#ccc] hover:text-black transition-all`}
											onClick={() => handleEdit(order)}>
											<button className="border p-2 rounded-md">
												<Icon type="icon-edit" />
											</button>
											<p>Edit order</p>
										</div>

										{userInfo?.role === "admin" && (
											<div
												className={`cursor-pointer flex gap-2 items-center rounded-md hover:bg-[#ccc] hover:text-black transition-all ${
													order.status === "success" &&
													"pointer-events-none opacity-[0.4]"
												}`}
												onClick={() =>
													handleChangeStatus(order, "success")
												}>
												<button className="border p-2 rounded-md">
													<Icon type="icon-success" />
												</button>
												<p>Complete Order</p>
											</div>
										)}

										{userInfo?.role === "admin" && (
											<div
												className={`cursor-pointer flex gap-2 items-center rounded-md hover:bg-[#ccc] hover:text-black transition-all ${
													order.status === "pending" &&
													"pointer-events-none opacity-[0.4]"
												}`}
												onClick={() =>
													handleChangeStatus(order, "pending")
												}>
												<button className="border p-2 rounded-md">
													<Icon type="icon-pending" />
												</button>
												<p>Pending Order</p>
											</div>
										)}

										<div
											className={`cursor-pointer flex gap-2 items-center rounded-md hover:bg-[#ccc] hover:text-black transition-all`}
											onClick={() => handleConfirmDelete(order)}>
											<button className="border p-2 rounded-md">
												<Icon type="icon-delete" />
											</button>
											<p>Delete Order</p>
										</div>
									</div>
								)}
							</div>
						)}

						{order.status === "success" && userInfo?.role !== "admin" && (
							<p className="text-[14px]">No action</p>
						)}
					</div>
				</td>
			</tr>
		));

	return (
		<div className="mt-3 p-1">
			<div className="flex justify-between">
				<div className="w-full flex justify-between items-center mb-3 mt-1">
					<button
						className="flex gap-2 border rounded-md p-2 hover:bg-main transition-all"
						onClick={handleCreate}>
						<Icon type="icon-create" />
						<p>{t("order_page.button.create_new_order")}</p>
					</button>
				</div>
			</div>
			<div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg">
				<table className="w-full text-left">
					<thead>
						<tr>
							{[
								"order_page.table.order_title",
								"order_page.table.email",
								"order_page.table.products",
								"order_page.table.delivery_date",
								"order_page.table.status",
								"common.created_date",
								"common.actions",
							].map((header, index) => (
								<th
									key={index}
									className="p-4 border-b border-slate-200 bg-main">
									<p className="text-sm font-normal leading-none">{t(header)}</p>
								</th>
							))}
						</tr>
					</thead>

					{/* <tbody>{loading ? renderSkeleton() : renderOrders()}</tbody> */}
					<tbody>{renderOrders()}</tbody>
				</table>

				{orders.length > 0 ? (
					<div className="flex justify-between items-center px-4 py-3">
						<div className="text-sm text-slate-500">
							Showing {pagination.page} of {pagination.total_page}
						</div>
						<div className="flex space-x-1">
							{Array.from({ length: pagination.total_page }, (_, i) => (
								<button
									key={i}
									className={`px-3 py-1 text-sm border rounded-md ${
										pagination.page === i + 1 ? "bg-main" : "bg-white"
									}`}
									onClick={() => handlePageChange(i + 1)}>
									{i + 1}
								</button>
							))}
						</div>
					</div>
				) : (
					<div className="flex justify-center items-center px-4 py-3 text-[#ccc] text-[14px]">
						No order
					</div>
				)}
			</div>

			<Popup
				title="Tạo đơn hàng"
				width="max-w-6xl"
				minHeight="min-h-[400px]"
				isOpen={popupData}
				onSubmit={handlePopupSubmit}
				onClose={handleClosePopup}>
				<div
					className={`flex gap-2 flex-wrap w-full ${
						popupData &&
						formData.status.value === "success" &&
						userInfo?.role !== "admin"
							? "pointer-events-none opacity-50"
							: ""
					}`}>
					{Object.keys(formData).map((key) => {
						const field = formData[key];

						return (
							<div
								className="w-[calc(50%-4px)]"
								key={key}>
								<FormField
									label={t(`order_page.popup.${key}`)}
									value={
										key === "delivery_date"
											? convertISOToDate(field.value)
											: field.value
									}
									type={field.type}
									error={t(`${field.error}`)}
									options={field.options || []}
									onChange={(e) => handleFormChange(key, e.target.value)}
									className="h-[38px] text-sm"
									disabled={
										field.disabled ||
										(popoverData &&
											formData.status.value === "success" &&
											userInfo?.role !== "admin")
									}
								/>
							</div>
						);
					})}
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						{t("order_page.popup.product")}
					</label>
					<Select
						isMultiple
						value={originProduct}
						onChange={handleChangeProduct}
						options={productsCategories}
					/>
				</div>

				{originProduct?.map((item) => {
					return (
						<div
							key={item.value}
							className={`flex items-end gap-3 ${
								popoverData &&
								formData.status.value === "success" &&
								userInfo?.role !== "admin" &&
								"pointer-events-none"
							}`}>
							<div className=" flex-1 flex gap-2 text-sm items-start">
								<FormField
									label={t("order_page.order_picker.name")}
									value={item?.label}
									type="text"
									onChange={() => {}}
									className="cursor-not-allowed"
									disabled
								/>
								<div className="w-[150px]">
									<FormField
										onChange={() => {}}
										label={t("order_page.order_picker.inventory")}
										value={
											productsCategories
												.find((_i) =>
													_i.options.some(
														(__i) => __i.value === item.value
													)
												)
												.options.find((_item) => _item.value === item.value)
												.quantity
										}
										type="number"
										disabled
									/>
								</div>
								<div className="w-[150px]">
									<FormField
										label={t("order_page.order_picker.quantity")}
										value={item.quantity}
										type="number"
										disabled={
											productsCategories.find((_i) =>
												_i.options.some((__i) => __i.value === item.value)
											)?.options[0]?.quantity === 0
										}
										onChange={(e) => handleChangeQuantityProductPicker(e, item)}
									/>
								</div>
							</div>

							<button
								className={`mb-4 border p-[6px] border-[#ccc] rounded-md hover:border-[#fe3d3d] ${
									popoverData &&
									formData.status.value === "success" &&
									userInfo?.role !== "admin" &&
									"pointer-events-none opacity-[0.4]"
								}`}
								onClick={() => handleRemoveProductPicked(item)}>
								<Icon type="icon-delete" />
							</button>
						</div>
					);
				})}
			</Popup>

			<Popup
				isOpen={!!orderDelete}
				title={t("common.confirm_delete")}
				onClose={handleCancelDelete}
				onSubmit={handleDeleteOrder}>
				<p>
					Bạn có chắc chắn muốn xóa đơn hàng <b>{orderDelete?.title}</b> không?
				</p>
			</Popup>
		</div>
	);
}

export default OrderPage;
