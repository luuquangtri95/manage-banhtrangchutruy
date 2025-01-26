import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductApi from "../../api/productApi";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";
import ProductFilterForm from "./components/ProductFilterForm/ProductFilterForm";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../helpers/formatPrice";

const INIT_FORMDATA = {
	name: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Tên sản phẩm bắt buộc";
			if (value.length < 5) return "Tên phải lớn hơn 6 ký tự";
		},
	},
	price: {
		value: "",
		type: "number",
		error: "",
		validate: (value) => {
			if (value < 1000) return "giá tiền phải lớn hơn 1000";
		},
	},
	quantity: {
		value: 100,
		type: "number",
		error: "",
		validate: (value) => {
			if (value === 0 || value < 10) return "Số lượng phải lớn hơn 10";
		},
	},
};

const DEFAULT_PAGINATION = {
	page: 1,
	limit: 5,
	total_page: 10,
	total_item: 10,
};

function ProductsPage() {
	const [popupData, setPopupData] = useState(null);
	const [productDelete, setProductDelete] = useState(null);
	const [products, setProducts] = useState([]);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({ page: 1, limit: 5, searchTerm: "" });
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const { t } = useTranslation();

	useEffect(() => {
		fetchProducts();
	}, [filters]);

	useEffect(() => {
		if (popupData) {
			setFormData((prev) => {
				const updatedFormData = { ...prev };
				Object.keys(updatedFormData).forEach((key) => {
					if (popupData[key] !== undefined) {
						updatedFormData[key].value = popupData[key];
					}
				});
				return updatedFormData;
			});
		}
	}, [popupData]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const res = await ProductApi.findAll(filters);

			setProducts(res.metadata.result);
			setPagination(res.metadata.pagination);
		} catch (error) {
			console.log("fetchProducts error", error);
			toast.error("Failed to fetch products");
		} finally {
			setLoading(false);
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

	const handleDeleteProduct = async () => {
		if (!productDelete) return;

		try {
			await ProductApi.delete(productDelete.id);
			toast.success(`Product "${productDelete.name}" deleted successfully`);
			fetchProducts();
		} catch (error) {
			toast.error("Failed to delete product");
			console.log("handleDeleteProduct error", error);
		} finally {
			setProductDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setProductDelete(null);
	};

	const handlePageChange = (newPage) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

	const handleFilterChange = (newFilter) => {
		setFilters((prev) => ({ ...prev, ...newFilter, page: 1 }));
	};

	const handleCreate = () => {
		setPopupData({ name: "", price: "", quantity: 100 });
	};

	const handleEdit = (item) => {
		setPopupData(item);
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

		try {
			if (popupData && popupData.id) {
				await ProductApi.update({ ...formattedData, id: popupData.id });
				toast.success("Product updated successfully");
			} else {
				await ProductApi.create(formattedData);
				toast.success("Product created successfully");
			}
			fetchProducts();
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			fetchProducts();
		}
	};

	const handleConfirmDelete = (product) => {
		setProductDelete(product); // Đặt sản phẩm cần xóa
	};

	const renderSkeleton = () =>
		Array.from({ length: 3 }).map((_, rowIndex) => (
			<tr
				key={rowIndex}
				className="animate-pulse">
				{Array.from({ length: 6 }).map((_, colIndex) => (
					<td
						key={colIndex}
						className="p-4 py-5">
						<div className="h-4 bg-gray-200 rounded"></div>
					</td>
				))}
			</tr>
		));

	const renderProducts = () =>
		products.map((product, index) => (
			<tr
				key={index}
				className="hover:bg-slate-50 border-b border-slate-200">
				<td className="p-4 py-5 font-semibold text-sm text-slate-800">{product.name}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{formatPrice(product.price)}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{product.quantity}</td>
				<td className="p-4 py-5 text-sm text-slate-500">Active</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{formatDateWithIntl(product.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2">
						<button
							className="border p-2 rounded-md"
							onClick={() => handleEdit(product)}>
							<Icon type="icon-edit" />
						</button>
						<button
							className="border p-2 rounded-md"
							onClick={() => handleConfirmDelete(product)}>
							<Icon type="icon-delete" />
						</button>
					</div>
				</td>
			</tr>
		));

	return (
		<div className="mt-3 p-1">
			<div className="flex justify-between">
				<div className="w-full flex justify-between items-center mb-3 mt-1">
					<button
						className="flex gap-2 border rounded-md p-2 hover:bg-[#ffe9cf] transition-all"
						onClick={handleCreate}>
						<Icon type="icon-create" />
						<p>{t("create_new_product")}</p>
					</button>
				</div>

				<div className="w-[300px] max-w-sm  relative">
					<ProductFilterForm onSubmit={handleFilterChange} />
				</div>
			</div>

			<div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg">
				<table className="w-full table-fixed text-left">
					<thead>
						<tr>
							{[
								"product_name",
								"price",
								"quantity",
								"status",
								"created_date",
								"actions",
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
					<tbody>{loading ? renderSkeleton() : renderProducts()}</tbody>
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
				title={popupData?.id ? t("edit_product") : t("create_new_product")}
				onClose={handleClosePopup}
				onSubmit={handlePopupSubmit}>
				{Object.keys(formData).map((key) => (
					<FormField
						key={key}
						label={key.charAt(0).toUpperCase() + key.slice(1)}
						type={formData[key].type}
						value={formData[key].value}
						onChange={(e) => handleFormChange(key, e.target.value)}
						error={formData[key].error}
					/>
				))}
			</Popup>

			<Popup
				isOpen={!!productDelete}
				title="Confirm Delete"
				onClose={handleCancelDelete}
				onSubmit={handleDeleteProduct}>
				<p>
					Bạn có chắc chắn muốn xóa sản phẩm <b>{productDelete?.name}</b> không?
				</p>
			</Popup>
		</div>
	);
}

export default ProductsPage;
