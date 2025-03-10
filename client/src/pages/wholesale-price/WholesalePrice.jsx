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
import { formatDateWithIntl } from "../../helpers/convertDate";
import { formatPrice } from "../../helpers/formatPrice";
import CategoryApi from "../../api/categoryApi";

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
			// if (Number(value) === 0) return "validate.price_min";
			return "";
		},
	},
	price: {
		value: "",
		type: "number",
		error: "",
		validate: (value) => {
			// if (Number(value) > 100) return "validate.price_min";
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
	const [wholesalePriceDelete, setWholesalePriceDelete] = useState(null);
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({ page: 1, limit: 8, searchTerm: "" });
	const [popupData, setPopupData] = useState(null);
	const [productsCategories, setProductsCategories] = useState([]);
	const [originProduct, setOriginProduct] = useState([]);
	const { t } = useTranslation();

	useEffect(() => {
		fetchWholesalePrices();
		fetchWholesaleGroups();
		fetchProducts();
		fetchCategories();
	}, [filters]);

	useEffect(() => {
		if (popupData) {
			setWholesaleGroups((prev) => ({
				...prev,
				value:
					popupData?.wholesaleGroups?.map((_wp) => ({
						label: _wp.name,
						value: _wp.id,
					})) || [],
			}));
			setProducts((prev) => ({
				...prev,
				value:
					popupData?.products?.map((_p) => ({
						label: _p.name,
						value: _p.id,
					})) || [],
			}));
			setFormData((prev) => {
				const updatedFormData = { ...prev };

				Object.keys(updatedFormData).forEach((key) => {
					if (popupData[key] !== undefined && key !== "category") {
						updatedFormData[key].value = popupData[key];
					}
				});
				return updatedFormData;
			});
		}
	}, [popupData]);

	const fetchWholesalePrices = async () => {
		try {
			const res = await WholesalePriceApi.findAll(filters);
			const totalPage = res.metadata.pagination.total_page;

			if (totalPage === 0 && filters.page !== 1) {
				setFilters((prev) => ({ ...prev, page: 1 }));
			} else if (totalPage > 0 && filters.page > totalPage && filters.page !== totalPage) {
				setFilters((prev) => ({
					...prev,
					page: totalPage,
				}));
			}
			setWholesalePrices(res.metadata.result);
			setPagination(res.metadata.pagination);
		} catch (error) {
			console.log("fetchWholesaleGroup error", error);
			toast.error("fail to fetch WholesalePriceApi");
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		try {
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
								price: item.price,
							};
						})
						.filter((_item) => _item.quantity > 0),
				};
			});

			setProductsCategories(__product);
		} catch (error) {
			console.log(error);
		} finally {
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

	const handlePageChange = (newPage) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
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
			formattedData.products = originProduct.map((_p) => ({
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
			fetchWholesalePrices();
			fetchCategories();
		}
	};

	const handleCancelDelete = () => {
		setWholesalePriceDelete(null);
	};
	const handleDeletePrice = async () => {
		if (!wholesalePriceDelete) return;

		try {
			await WholesalePriceApi.delete(wholesalePriceDelete.id);
			toast.success(`Product "${wholesalePriceDelete.name}" deleted successfully`);
			fetchWholesalePrices();
		} catch (error) {
			console.log("handleDeletePrice error", error);
		} finally {
			setWholesalePriceDelete(null);
		}
	};

	const handleEdit = (item) => {
		setPopupData(item);
	};

	const handleClone = async (oldItem) => {
		try {
			const _newItem = {
				name: oldItem.name + " clone",
				min_quantity: oldItem.min_quantity,
				price: oldItem.price,
			};

			const res = await WholesalePriceApi.create(_newItem);

			if (res.metadata.id) {
				toast.success(`Clone ${res.metadata.name} success !`);
			}
		} catch (error) {
			console.log("error", error);
		} finally {
			fetchWholesalePrices();
		}
	};

	const handleConfirmDelete = (price) => {
		setWholesalePriceDelete(price);
	};

	const renderWholesalePrice = () =>
		wholesalePrices.map((_wp) => (
			<tr
				key={_wp.id}
				className="hover:bg-slate-50 border-b border-slate-200">
				<td className="p-4 py-5 font-semibold text-sm text-slate-800">{_wp.name}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{_wp.min_quantity}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{formatPrice(_wp.price)}</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					<ul className="list-disc">
						{_wp?.products?.map((_p) => {
							return <li key={_p.key}>{_p.name}</li>;
						})}
					</ul>
				</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					<ul className="list-disc">
						{_wp?.wholesaleGroups.map((_g) => {
							return <li key={_g.key}>{_g.name}</li>;
						})}
					</ul>
				</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{formatDateWithIntl(_wp.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2 flex-wrap">
						<button
							className="border p-2 rounded-md"
							onClick={() => handleEdit(_wp)}>
							<Icon type="icon-edit" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleClone(_wp)}>
							<Icon type="icon-clone" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleConfirmDelete(_wp)}>
							<Icon type="icon-delete" />
						</button>
					</div>
				</td>
			</tr>
		));

	const handleChangeProduct = (itemPicked) => {
		if (!itemPicked || itemPicked.length === 0) {
			setOriginProduct([]);
			return;
		}

		const newProducts = itemPicked.map((item) => ({
			...item,
			quantity: originProduct?.find((p) => p.value === item.value)?.quantity || 1,
		}));

		setOriginProduct(newProducts);
	};

	return (
		<div className="mt-3 p-1">
			<div className="flex justify-between">
				<div className="w-full flex justify-between items-center mb-3 mt-1">
					<button
						className="flex gap-2 border rounded-md p-2 hover:bg-main transition-all"
						onClick={handleCreate}>
						<Icon type="icon-create" />
						<p>{t("manage_wholesale.price.create_new_price")}</p>
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
								"manage_wholesale.price.name",
								"manage_wholesale.price.min_quantity",
								"manage_wholesale.price.price",
								"manage_wholesale.price.ref_product",
								"manage_wholesale.price.ref_group",
								"common.created_date",
								"common.actions",
							].map((header, idx) => (
								<th
									key={idx}
									className="p-4 border-b border-slate-200 bg-main"
									style={{ width: `${100 / 6}%` }}>
									<p className="text-sm font-normal leading-none">{t(header)}</p>
								</th>
							))}
						</tr>
					</thead>
					<tbody>{renderWholesalePrice()}</tbody>
				</table>

				{wholesalePrices.length ? (
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
						No wholesale price
					</div>
				)}
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
						value={originProduct}
						onChange={handleChangeProduct}
						options={productsCategories}
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
			<Popup
				isOpen={!!wholesalePriceDelete}
				title={t("common.confirm_delete")}
				onClose={handleCancelDelete}
				onSubmit={handleDeletePrice}>
				<p>
					Bạn có chắc chắn muốn xóa sản phẩm <b>{wholesalePriceDelete?.name}</b> không?
				</p>
			</Popup>
		</div>
	);
}

export default WholesalePrice;
