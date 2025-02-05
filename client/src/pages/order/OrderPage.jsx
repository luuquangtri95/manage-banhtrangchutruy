import { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import { toast } from "react-toastify";
import CategoryApi from "../../api/categoryApi";
import OrderApi from "../../api/orderApi";
import Badge from "../../components/Badge/Badge";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";

const INIT_FORMDATA = {
	title: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Title invalid";
			if (value.length < 5) return "Title not less 5 character";
		},
	},
	fullname: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Name invalid";
		},
	},
	address: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Name invalid";
		},
	},
	phone: {
		value: "",
		type: "number",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Name invalid";
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
};

function OrderPage() {
	const [popupData, setPopupData] = useState(null);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [orders, setOrders] = useState([]);
	const [productsCategories, setProductsCategories] = useState([]);
	const [originProduct, setOriginProduct] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchOrders();
		fetchCategories();
	}, []);

	const fetchOrders = async () => {
		try {
			const res = await OrderApi.findAll();
			setOrders(res.metadata.result);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchCategories = async () => {
		try {
			setLoading(true);

			const res1 = await CategoryApi.findAll();

			const __product = res1.metadata.result.map((_item) => {
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

			// const res = await ProductApi.findAll();
			// const _product = res.metadata.result
			// 	.map((item) => {
			// 		return {
			// 			value: item.id,
			// 			label: item.name,
			// 			quantity: item.quantity,
			// 		};
			// 	})
			// 	.filter((_item) => _item.quantity > 0);

			setProductsCategories(__product);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
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
			if (field.validate) {
				const error = field.validate(field.value);
				if (error) {
					hasError = true;
					newFormData[key].error = error;
				}
			}
		});

		setFormData(newFormData);

		if (hasError) return;

		const formattedData = Object.keys(formData).reduce((acc, key) => {
			acc[key] = formData[key].value;
			return acc;
		}, {});

		if (originProduct?.length) {
			formattedData.data_json = {
				item: originProduct.map((_item) => ({
					id: _item.value,
					name: _item.label,
					quantity: _item.quantity,
				})),
			};
		}

		try {
			if (popupData && popupData.id) {
				await OrderApi.update({ ...formattedData, id: popupData.id });
				toast.success("Product updated successfully");
			} else {
				const res = await OrderApi.create(formattedData);

				toast.success(res.message);
			}
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			// toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			fetchCategories();
			fetchOrders();
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

		const originQuantity = productsCategories.find((_item) =>
			_item.options.some((__item) => __item.value === currentProduct.value)
		).options[0].quantity;

		if (value > originQuantity) {
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

	return (
		<div className="mt-3 p-1">
			<div className="flex justify-between">
				<div className="w-full flex justify-between items-center mb-3 mt-1">
					<button
						className="flex gap-2 border rounded-md p-2 hover:bg-[#ffe9cf] transition-all"
						onClick={handleCreate}>
						<Icon type="icon-create" />
						<p>Tạo đơn đặt hàng</p>
					</button>
				</div>
			</div>
			<div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg">
				<table className="w-full text-left">
					<thead>
						<tr>
							{["Info", "Product", "Delivery date", "Pending"].map(
								(header, index) => (
									<th
										key={index}
										className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
										<p className="text-sm font-normal leading-none">{header}</p>
									</th>
								)
							)}
						</tr>
					</thead>
					<tbody>
						{orders.map((order) => (
							<tr
								key={order.id}
								className="hover:bg-slate-50 border-b border-slate-200">
								<td className="py-4">
									<div className="p-4 py-1 text-sm text-slate-800">
										<span className="font-medium">Name: </span>
										<span className="font-medium">{order.fullname}</span>
									</div>
									<div className="p-4 py-1 text-sm text-slate-500">
										<span className="font-medium">Phone: </span>
										{order.phone}
									</div>
									<div className="p-4 py-1 text-sm text-slate-500">
										<span className="font-medium">Address: </span>
										{order.address}
									</div>
								</td>
								<td className="p-4 py-1 text-sm text-slate-500">
									{order.data_json.item.map((product, index) => (
										<div
											key={index}
											className="py-1">
											{product.name}
											<span className="font-medium">
												{" "}
												x{product.quantity}
											</span>
										</div>
									))}
								</td>
								<td className="p-4 py-1 text-sm text-slate-500">
									{formatDateWithIntl(order.delivery_date)}
								</td>
								<td className="p-4 py-1 text-sm text-slate-500">
									<Badge
										value={order.status}
										type={order.status}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Popup
				title="Tạo đơn hàng"
				width="max-w-6xl"
				isOpen={popupData}
				onSubmit={handlePopupSubmit}>
				<div className="flex gap-2 flex-wrap w-full">
					{Object.keys(formData).map((key) => {
						const field = formData[key];

						return (
							<div
								className="w-[calc(50%-4px)]"
								key={key}>
								<FormField
									label={key}
									value={field.value}
									type={field.type}
									error={field.error}
									options={field.options || []}
									onChange={(e) => handleFormChange(key, e.target.value)}
									className="h-[38px] text-sm"
									disabled={field.disabled || false}
								/>
							</div>
						);
					})}
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">product</label>
					<Select
						isMultiple
						value={originProduct}
						onChange={handleChangeProduct}
						options={productsCategories}
					/>
				</div>
				{originProduct.map((item) => {
					return (
						<div
							key={item.value}
							className="flex items-end gap-3">
							<div className=" flex-1 flex gap-2 text-sm items-start">
								<FormField
									label="name"
									value={item?.label}
									type="text"
									onChange={() => {}}
									className="cursor-not-allowed"
									disabled
								/>
								<div className="w-[150px]">
									<FormField
										onChange={() => {}}
										label="inventory"
										value={
											productsCategories.find((_i) =>
												_i.options.some((__i) => __i.value === item.value)
											)?.options?.[0]?.quantity
										}
										type="number"
										disabled
									/>
								</div>
								<div className="w-[150px]">
									<FormField
										label="quantity"
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
								className="mb-4 border p-[6px] border-[#ccc] rounded-md hover:border-[#fe3d3d]"
								onClick={() => handleRemoveProductPicked(item)}>
								<Icon type="icon-delete" />
							</button>
						</div>
					);
				})}
			</Popup>
		</div>
	);
}

export default OrderPage;
