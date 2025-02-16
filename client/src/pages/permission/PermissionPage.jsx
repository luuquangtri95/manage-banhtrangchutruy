import { useEffect, useState } from "react";
import PermissionApi from "../../api/permissionApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";
import Icon from "../../components/Icon/Icon";
import FormField from "../../components/FormField";

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
	limit: 10,
	total_page: 10,
	total_item: 8,
};

function PermissionPage(props) {
	const [popupData, setPopupData] = useState(null);
	const [permissionDelete, setPermissionDelete] = useState(null);
	const [permisions, setPermissions] = useState([]);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({ page: 1, limit: 8, searchTerm: "" });
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const { t } = useTranslation();

	useEffect(() => {
		fetchPermissions();
	}, [filters]);

	const fetchPermissions = async () => {
		try {
			setLoading(true);
			const res = await PermissionApi.findAll(filters);

			setPermissions(res.metadata.result);
			setPagination(res.metadata.pagination);
		} catch (error) {
			console.log("fetchPermissions error", error);
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

	const handleDeletePermission = async () => {
		if (!permissionDelete) return;

		try {
			await PermissionApi.delete(permissionDelete.id);
			toast.success(`Permission "${permissionDelete.name}" deleted successfully`);
			fetchPermissions();
		} catch (error) {
			console.log("handleDeleteProduct error", error);
		} finally {
			setPermissionDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setPermissionDelete(null);
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
			};

			const res = await PermissionApi.create(_newItem);

			if (res.metadata.id) {
				toast.success(`Clone ${res.metadata.name} success !`);
			}
		} catch (error) {
			console.log("error", error);
		} finally {
			fetchPermissions();
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
				await PermissionApi.update({ ...formattedData, id: popupData.id });
				toast.success("Product updated successfully");
			} else {
				const res = await PermissionApi.create(formattedData);
				console.log(res);

				// toast.success("Product created successfully");
			}
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			// toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			fetchPermissions();
		}
	};

	const handleConfirmDelete = (permission) => {
		setPermissionDelete(permission);
	};

	const renderSkeleton = () =>
		Array.from({ length: permisions.length }).map((_, rowIndex) => (
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

	const renderPermissions = () =>
		permisions.map((permission) => (
			<tr
				key={permission.id}
				className="hover:bg-slate-50 border-b border-slate-200">
				<td className="p-4 py-5 font-semibold text-sm text-slate-800">{permission.name}</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{permission.description || "..."}
				</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{formatDateWithIntl(permission.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2">
						<button
							className="border p-2 rounded-md"
							onClick={() => handleEdit(permission)}>
							<Icon type="icon-edit" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleClone(permission)}>
							<Icon type="icon-clone" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleConfirmDelete(permission)}>
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
						<p>{t("create_new_permission")}</p>
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
							{["Permission Name", "Description", "created_date", "actions"].map(
								(header, idx) => (
									<th
										key={idx}
										className="p-4 border-b border-slate-200 bg-main"
										style={{ width: `${100 / 6}%` }}>
										<p className="text-sm font-normal leading-none">
											{t(header)}
										</p>
									</th>
								)
							)}
						</tr>
					</thead>
					<tbody>{loading ? renderSkeleton() : renderPermissions()}</tbody>
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
									pagination.page === i + 1 ? "bg-main" : "bg-white"
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
				isOpen={!!permissionDelete}
				title="Confirm Delete"
				onClose={handleCancelDelete}
				onSubmit={handleDeletePermission}>
				<p>
					Bạn có chắc chắn muốn xóa quyền <b>{permissionDelete?.name}</b> không?
				</p>
			</Popup>
		</div>
	);
}

export default PermissionPage;
