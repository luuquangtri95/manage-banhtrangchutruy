import { useEffect, useState } from "react";
import WholesaleGroupApi from "../../api/wholesaleGroupApi";
import ProductApi from "../../api/productApi";
import WholesalePriceApi from "../../api/wholesalePriceApi.js";
import { toast } from "react-toastify";
import Popup from "../../components/Popup";
import Select from "react-tailwindcss-select";
import Icon from "../../components/Icon/Icon";
import { useTranslation } from "react-i18next";
import FormField from "../../components/FormField";

const INIT_FORMDATA = {
	name: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "validate.name_required";
			if (value.length < 5) return "validate.name_min_length";
		},
	},
	min_quantity: {
		value: "",
		type: "number",
		error: "",
		validate: (value) => {
			// if (value < 1000) return "validate.price_min";
			return "";
		},
	},
	price: {
		value: "",
		type: "number",
		error: "",
		validate: (value) => {
			// if (value < 1000) return "validate.price_min";
			return "";
		},
	},
};

const INIT_PRODUCTS = {
	value: [],
	options: [],
};

const INIT_WHOLESALE_GROUPS = {
	value: [],
	options: [],
};

const DEFAULT_PAGINATION = {
	page: 1,
	limit: 8,
	total_page: 10,
	total_item: 10,
};

function WholesalePrice(props) {
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [wholesaleGroups, setWholesaleGroups] = useState(INIT_WHOLESALE_GROUPS);
	const [products, setProducts] = useState(INIT_PRODUCTS);
	const [wholesalePrices, setWholesalePrices] = useState([]);
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({ page: 1, limit: 8, searchTerm: "" });
	const [popupData, setPopupData] = useState(null);
	const { t } = useTranslation();

	useEffect(() => {
		fetchWholesalePrices();
		fetchWholesaleGroups();
		fetchProducts();
	}, [filters]);

	const fetchWholesalePrices = async () => {
		try {
			const res = await WholesalePriceApi.findAll(filters);

			setWholesalePrices(res.metadata.result);
		} catch (error) {
			console.log("fetchWholesaleGroup error", error);
			toast.error("fail to fetch WholesalePriceApi");
		} finally {
			setLoading(false);
		}
	};

	const fetchWholesaleGroups = async () => {
		try {
			const res = await WholesaleGroupApi.findAll();

			const _wholesaleGroups = res.metadata.result.map((_item) => ({
				value: _item.id,
				label: _item.name,
			}));

			setWholesaleGroups((prev) => ({ ...prev, options: _wholesaleGroups }));
		} catch (error) {
			console.log("fetchWholesaleGroup error", error);
			toast.error("fail to fetch WholesaleGroupApi");
		} finally {
			setLoading(false);
		}
	};

	const fetchProducts = async () => {
		try {
			const res = await ProductApi.findAll();
			const _products = res.metadata.result.map((_item) => ({
				value: _item.id,
				label: _item.name,
			}));

			setProducts((prev) => ({ ...prev, options: _products }));
		} catch (error) {
			console.log("fetchProducts error", error);
			toast.error("fail to fetch ProductApi");
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setPopupData({ name: "", price: "", min_quantity: "" });
	};

	const handleSelectChange = (type, itemPicked) => {
		if (type === "product") {
			setProducts((prev) => ({ ...prev, value: itemPicked }));
		}

		if (type === "group") {
			setWholesaleGroups((prev) => ({ ...prev, value: itemPicked }));
		}
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

	const handleFormChange = (name, value) => {
		setFormData((prev) => ({
			...prev,
			[name]: { ...prev[name], value, error: "" },
		}));
	};

	const handlePageChange = () => {};

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

		if (products?.value?.length) {
			formattedData.products = products.value.map((_p) => ({
				name: _p.label,
				id: _p.value,
			}));
		}

		if (wholesaleGroups?.value?.length) {
			formattedData.groups = wholesaleGroups.value.map((_wg) => ({
				name: _wg.label,
				id: _wg.value,
			}));
		}

		try {
			if (popupData && popupData.id) {
				await WholesalePriceApi.update({ ...formattedData, id: popupData.id });
				toast.success("Product updated successfully");
			} else {
				const res = await WholesalePriceApi.create(formattedData);

				toast.success(res.message);
			}
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			// toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			setProducts(INIT_PRODUCTS);
			setWholesaleGroups(INIT_WHOLESALE_GROUPS);
			fetchProducts();
			fetchWholesaleGroups();
		}
	};

	const renderWholesalePrice = () => {};

	return (
		<div className="mt-3 p-1">
			<div className="flex justify-between">
				<div className="w-full flex justify-between items-center mb-3 mt-1">
					<button
						className="flex gap-2 border rounded-md p-2 hover:bg-[#ffe9cf] transition-all"
						onClick={handleCreate}>
						<Icon type="icon-create" />
						<p>{t("common.create_new_product")}</p>
					</button>
				</div>

				<div className="w-[300px] max-w-sm  relative">
					{/* <ProductFilterForm onSubmit={handleFilterChange} /> */}
				</div>
			</div>

			<div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg">
				<table className="w-full table-fixed text-left">
					<thead>
						<tr>
							{[
								"product_page.table.product_name",
								"product_page.table.price",
								"product_page.table.quantity",
								"common.status",
								"product_page.table.category",
								"common.created_date",
								"common.actions",
							].map((header, idx) => (
								<th
									key={idx}
									className="p-4 border-b border-slate-200 bg-[#ffe9cf]"
									style={{ width: `${100 / 6}%` }}>
									<p className="text-sm font-normal leading-none">{t(header)}</p>
								</th>
							))}
						</tr>
					</thead>
					<tbody>{renderWholesalePrice()}</tbody>
				</table>

				<div className="flex justify-between items-center px-4 py-3">
					<div className="text-sm text-slate-500">
						Showing {pagination.page} of {pagination.total_page}
					</div>
					<div className="flex space-x-1">
						{Array.from({ length: pagination.total_page }, (_, i) => (
							<button
								key={i}
								className={`px-3 py-1 text-sm border rounded-md ${
									pagination.page === i + 1 ? "bg-[#ffe9cf]" : "bg-white"
								}`}
								onClick={() => handlePageChange(i + 1)}>
								{i + 1}
							</button>
						))}
					</div>
				</div>
			</div>

			<Popup
				isOpen={popupData}
				title={popupData?.id ? "Edit Wholesale Price" : "Create Wholesale Price"}
				onClose={handleClosePopup}
				onSubmit={handlePopupSubmit}>
				{Object.keys(formData).map((key) => {
					const field = formData[key];

					return (
						<FormField
							key={key}
							label={key}
							type={field.type}
							value={field.value}
							onChange={(e) =>
								handleFormChange(
									key,
									field.type === "checkbox" ? e.target.checked : e.target.value
								)
							}
							error={t(field.error)}
							options={field.options || []}
						/>
					);
				})}

				<div className="mb-4">
					<label
						htmlFor="#"
						className="block text-sm font-medium text-gray-700 mb-1">
						Choose product
					</label>
					<Select
						isMultiple
						value={products.value}
						onChange={(value) => handleSelectChange("product", value)}
						options={products.options}
					/>
				</div>

				<div>
					<label
						htmlFor="#"
						className="block text-sm font-medium text-gray-700 mb-1">
						Choose group
					</label>
					<Select
						isMultiple
						value={wholesaleGroups.value}
						onChange={(value) => handleSelectChange("group", value)}
						options={wholesaleGroups.options}
					/>
				</div>
			</Popup>

			{/* <Popup
				isOpen={!!productDelete}
				title={t("common.confirm_delete")}
				onClose={handleCancelDelete}
				onSubmit={handleDeleteProduct}>
				<p>
					Bạn có chắc chắn muốn xóa sản phẩm <b>{productDelete?.name}</b> không?
				</p>
			</Popup> */}
		</div>
	);
}

export default WholesalePrice;
