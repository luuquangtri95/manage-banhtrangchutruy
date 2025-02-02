import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import UserApi from "../../api/userApi";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";

const INIT_FORMDATA = {
	username: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Tên tài khoản bắt buộc";
			if (value.length < 5) return "Tên phải lớn hơn 6 ký tự";
		},
	},
	email: {
		value: "",
		type: "email",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Email is required.";
			if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format.";
			return "";
		},
	},
	password: {
		value: "",
		type: "password",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Xác nhận mật khẩu không được để trống.";
			if (value.length < 5) return "Password phải từ 6 ký tự";
		},
	},
	confirmPassword: {
		value: "",
		type: "password",
		error: "",
		validate: (value, formData) => {
			if (!value.trim()) return "Xác nhận mật khẩu không được để trống.";
			if (value !== formData.password.value) return "Mật khẩu xác nhận không khớp.";
			return "";
		},
	},
};

const DEFAULT_PAGINATION = {
	page: 1,
	limit: 10,
	total_page: 10,
	total_item: 10,
};

function UsersPage() {
	const [popupData, setPopupData] = useState(null);
	const [userDelete, setUserDelete] = useState(null);
	const [users, setUsers] = useState([]);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({ page: 1, limit: 10, searchTerm: "" });
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const { t } = useTranslation();

	useEffect(() => {
		fetchUsers();
	}, [filters]);

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const res = await UserApi.findAll(filters);

			setUsers(res.metadata.result);
			setPagination(res.metadata.pagination);
		} catch (error) {
			console.log("fetchUsers error", error);
			toast.error("Failed to fetch users");
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
		if (!userDelete) return;

		try {
			await UserApi.delete(userDelete.id);
			toast.success(`Product "${userDelete.name}" deleted successfully`);
			fetchUsers();
		} catch (error) {
			console.log("handleDeleteProduct error", error);
		} finally {
			setUserDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setUserDelete(null);
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
				await UserApi.update({ ...formattedData, id: popupData.id });
				toast.success("Product updated successfully");
			} else {
				const res = await UserApi.create(formattedData);
				console.log(res);

				// toast.success("Product created successfully");
			}
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			// toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			fetchUsers();
		}
	};

	const handleConfirmDelete = (currentUser) => {
		setUserDelete(currentUser);
	};

	const renderSkeleton = () =>
		Array.from({ length: users.length }).map((_, rowIndex) => (
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

	const renderUsers = () =>
		users.map((user) => (
			<tr
				key={user.id}
				className="hover:bg-slate-50 border-b border-slate-200">
				<td className="p-4 py-5 font-semibold text-sm text-slate-800">{user.username}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{user.email}</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{user.isActive ? "Active" : "Disable"}
				</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{formatDateWithIntl(user.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2">
						<button
							className="border p-2 rounded-md"
							onClick={() => handleEdit(user)}>
							<Icon type="icon-edit" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleConfirmDelete(user)}>
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
						<p>{t("common.create_new_user")}</p>
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
								"user_page.table.username",
								"Email",
								"common.status",
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
					<tbody>{loading ? renderSkeleton() : renderUsers()}</tbody>
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
				title={popupData?.id ? "Edit User" : "Create New User"}
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
				isOpen={!!userDelete}
				title="Confirm Delete"
				onClose={handleCancelDelete}
				onSubmit={handleDeleteProduct}>
				<p>
					Bạn có chắc chắn muốn xóa sản phẩm <b>{userDelete?.name}</b> không?
				</p>
			</Popup>
		</div>
	);
}

export default UsersPage;
