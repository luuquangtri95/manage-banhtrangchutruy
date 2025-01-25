import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProductApi from "../../api/productApi";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";
import ProductFilterForm from "./components/ProductFilterForm/ProductFilterForm";

const INIT_FORMDATA = {
	name: { value: "", error: "" },
	price: { value: "", error: "" },
	quantity: { value: 100, error: "" },
};

const DEFAULT_PAGINATION = {
	page: 1,
	limit: 3,
	total_page: 10,
	total_item: 10,
};

function ProductsPage() {
	const [isOpen, setIsOpen] = useState(false);
	const [products, setProducts] = useState([]);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({ page: 1, limit: 3, searchTerm: "" });
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

	useEffect(() => {
		fetchProducts();
	}, [filters]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const res = await ProductApi.findAll(filters);

			setProducts(res.metadata.result);
			setPagination(res.metadata.pagination);
		} catch (error) {
			toast.error("Failed to fetch products");
		} finally {
			setLoading(false);
		}
	};

	const handlePopupToggle = () => {
		setIsOpen((prev) => !prev);
	};

	const handleFormChange = (name, value) => {
		setFormData((prev) => ({
			...prev,
			[name]: { ...prev[name], value },
		}));
	};

	const handleFormSubmit = async () => {
		const formattedData = Object.fromEntries(
			Object.entries(formData).map(([key, field]) => [key, field.value])
		);

		try {
			await ProductApi.create(formattedData);
			toast.success("Product created successfully");
			fetchProducts();
		} catch (error) {
			toast.error("Failed to create product");
		} finally {
			setFormData(INIT_FORMDATA);
			setIsOpen(false);
		}
	};

	const handleDeleteProduct = async (id) => {
		try {
			await ProductApi.delete(id);
			toast.success("Product deleted successfully");
			fetchProducts();
		} catch (error) {
			toast.error("Failed to delete product");
		}
	};

	const handlePageChange = (newPage) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

	const handleFilterChange = (newFilter) => {
		setFilters((prev) => ({ ...prev, ...newFilter, page: 1 }));
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
				<td className="p-4 py-5 text-sm text-slate-500">{product.price}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{product.quantity}</td>
				<td className="p-4 py-5 text-sm text-slate-500">Active</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{formatDateWithIntl(product.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2">
						<button className="border p-2 rounded-md">
							<Icon type="icon-edit" />
						</button>
						<button
							className="border p-2 rounded-md"
							onClick={() => handleDeleteProduct(product.id)}>
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
						onClick={handlePopupToggle}>
						<Icon type="icon-create" />
						<p>Tạo sản phẩm mới</p>
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
								"Tên sản phẩm",
								"Giá (vnđ)",
								"Số lượng",
								"Trạng thái",
								"Ngày tạo",
								"Hành động",
							].map((header, idx) => (
								<th
									key={idx}
									className="p-4 border-b border-slate-200 bg-[#ffe9cf]"
									style={{ width: `${100 / 6}%` }}>
									<p className="text-sm font-normal leading-none">{header}</p>
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
				isOpen={isOpen}
				title="Create Product"
				onClose={handlePopupToggle}
				onSubmit={handleFormSubmit}>
				{Object.keys(formData).map((key) => (
					<FormField
						key={key}
						label={key.charAt(0).toUpperCase() + key.slice(1)}
						type="text"
						value={formData[key].value}
						onChange={(e) => handleFormChange(key, e.target.value)}
					/>
				))}
			</Popup>
		</div>
	);
}

export default ProductsPage;
