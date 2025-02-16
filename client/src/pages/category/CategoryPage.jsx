import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import CategoryApi from "../../api/categoryApi";
import Icon from "../../components/Icon/Icon";
import { formatDateWithIntl } from "../../helpers/convertDate";
import FormField from "../../components/FormField";
import Popup from "../../components/Popup";
import usePageLoading from "../../hooks/usePageLoading";

const INIT_FORMDATA = {
	name: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "validate.name_required";
			if (value.length < 5) return "validate.name_min_length";
			return "";
		},
	},
	description: {
		value: "",
		type: "text",
		error: "",
		validate: () => {
			return "";
		},
	},
};

const DEFAULT_PAGINATION = {
	page: 1,
	limit: 8,
	total_page: 10,
	total_item: 10,
};

function CategoryPage() {
	const [popupData, setPopupData] = useState(null);
	const [categoryDelete, setCategoryDelete] = useState(null);
	const [categories, setCategories] = useState([]);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [filters, setFilters] = useState({ page: 1, limit: 5, searchTerm: "" });
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const { t } = useTranslation();
	const { isLoading, showLoading, hideLoading } = usePageLoading();

	useEffect(() => {
		fetchCategories();
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

	const fetchCategories = async () => {
		try {
			showLoading();
			const res = await CategoryApi.findAll(filters);
			const totalPage = res.metadata.pagination.total_page;

			if (totalPage === 0 && filters.page !== 1) {
				setFilters((prev) => ({ ...prev, page: 1 }));
			} else if (totalPage > 0 && filters.page > totalPage && filters.page !== totalPage) {
				setFilters((prev) => ({
					...prev,
					page: totalPage,
				}));
			}
			setCategories(res.metadata.result);
			setPagination(res.metadata.pagination);
		} catch (error) {
			console.log("fetchCategories error", error);
			toast.error("Failed to fetch products");
		} finally {
			hideLoading();
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
		if (!categoryDelete) return;

		try {
			await CategoryApi.delete(categoryDelete.id);
			toast.success(`Category "${categoryDelete.name}" deleted successfully`);
			fetchCategories();
		} catch (error) {
			console.log("handleDeleteProduct error", error);
		} finally {
			setCategoryDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setCategoryDelete(null);
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

	const handleClone = async (oldItem) => {
		try {
			const _newItem = {
				name: oldItem.name + " clone",
				desription: oldItem.desription,
			};

			const res = await CategoryApi.create(_newItem);

			if (res.metadata.id) {
				toast.success(`Clone ${res.metadata.name} success !`);
			}
		} catch (error) {
			console.log("error", error);
		} finally {
			fetchCategories();
		}
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
				await CategoryApi.update({ ...formattedData, id: popupData.id });
				toast.success("Category updated successfully");
			} else {
				const res = await CategoryApi.create(formattedData);
				console.log(res);

				toast.success("Product created successfully");
			}
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			// toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			fetchCategories();
		}
	};

	const handleConfirmDelete = (product) => {
		setCategoryDelete(product); // Đặt sản phẩm cần xóa
	};

	const renderSkeleton = () =>
		Array.from({ length: categories.length }).map((_, rowIndex) => (
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

	const renderCatgories = () =>
		categories.map((category) => (
			<tr
				key={category.id}
				className="hover:bg-slate-50 border-b border-slate-200">
				<td className="p-4 py-5 font-semibold text-sm text-slate-800">{category.name}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{category.description || "..."}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{category.products.length || 0}</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{formatDateWithIntl(category.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2 flex-wrap">
						<button
							className="border p-2 rounded-md"
							onClick={() => handleEdit(category)}>
							<Icon type="icon-edit" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleClone(category)}>
							<Icon type="icon-clone" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleConfirmDelete(category)}>
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
						className="flex gap-2 border rounded-md p-2 hover:bg-main transition-all"
						onClick={handleCreate}>
						<Icon type="icon-create" />
						<p>{t("common.create_new_category")}</p>
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
								"category_page.table.name",
								"category_page.table.description",
								"common.link_product_quantity",
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
					<tbody>{renderCatgories()}</tbody>
				</table>

				{categories.length ? (
					<div className="flex justify-between items-center px-4 py-3">
						<div className="text-sm text-slate-500">
							{/* Showing {pagination.page} of {pagination.total_page} */}
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
						No categories
					</div>
				)}
			</div>

			<Popup
				isOpen={popupData}
				title={popupData?.id ? t("common.edit_category") : t("common.create_new_category")}
				onClose={handleClosePopup}
				onSubmit={handlePopupSubmit}>
				{Object.keys(formData).map((key) => (
					<FormField
						key={key}
						label={t(`category_page.popup.${key}`)}
						type={formData[key].type}
						value={formData[key].value}
						onChange={(e) => handleFormChange(key, e.target.value)}
						error={t(formData[key].error)}
					/>
				))}
			</Popup>

			<Popup
				isOpen={!!categoryDelete}
				title={t("common.confirm_delete")}
				onClose={handleCancelDelete}
				onSubmit={handleDeleteProduct}>
				<p>
					Bạn có chắc chắn muốn xóa danh mục sản phẩm <b>{categoryDelete?.name}</b> và{" "}
					<b>{categoryDelete?.products?.length} sản phẩm</b> đang liên kết không?
				</p>
			</Popup>
		</div>
	);
}

export default CategoryPage;
