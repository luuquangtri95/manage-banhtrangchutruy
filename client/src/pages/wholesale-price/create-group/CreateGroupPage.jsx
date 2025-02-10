import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import WholesaleGroupApi from "../../../api/wholesaleGroupApi";
import FormField from "../../../components/FormField";
import Icon from "../../../components/Icon/Icon";
import Popup from "../../../components/Popup";
import { formatDateWithIntl } from "../../../helpers/convertDate";
import UserApi from "../../../api/userApi";
import Select from "react-tailwindcss-select";

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
};

const DEFAULT_PAGINATION = {
	page: 1,
	limit: 8,
	total_page: 10,
	total_item: 10,
};

const INIT_USERS = {
	value: [],
	options: [],
};

function CreateGroupPage(props) {
	const [popupData, setPopupData] = useState(null);
	const [groupDelete, setGroupDelete] = useState(null);
	const [filters, setFilters] = useState({ page: 1, limit: 8, searchTerm: "" });
	const [loading, setLoading] = useState(false);
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [groups, setGroups] = useState([]);
	const [users, setUsers] = useState(INIT_USERS);

	const { t } = useTranslation();

	useEffect(() => {
		fetchWholesaleGroup();
		fetchUsers();
	}, [filters]);

	useEffect(() => {
		if (popupData) {
			setUsers((prev) => ({
				...prev,
				value:
					popupData?.users?.map((_u) => ({
						label: _u.username,
						value: _u.id,
					})) || [],
			}));
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

	const fetchWholesaleGroup = async () => {
		try {
			setLoading(true);
			const res = await WholesaleGroupApi.findAll(filters);

			setGroups(res.metadata.result);
			setPagination(res.metadata.pagination);
		} catch (error) {
			console.log("fetchProducts error", error);
			toast.error("Failed to fetch products");
		} finally {
			setLoading(false);
		}
	};

	const fetchUsers = async () => {
		try {
			setLoading(true);
			const res = await UserApi.findAll();

			const _users = res.metadata.result.map((_cat) => {
				return {
					label: _cat.username,
					value: _cat.id,
				};
			});

			setUsers((prev) => ({ ...prev, options: _users }));
		} catch (error) {
			console.log("fetchUser error", error);
			toast.error("Failed to fetch users");
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = () => {
		setPopupData({ name: "" });
	};

	const handlePageChange = (newPage) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

	const handleEdit = (item) => {
		setPopupData(item);
	};

	const handleClone = async (oldItem) => {
		try {
			const _newItem = {
				name: oldItem.name + " clone",
			};

			const res = await WholesaleGroupApi.create(_newItem);

			if (res.metadata.id) {
				toast.success(`Clone ${res.metadata.name} success !`);
			}
		} catch (error) {
			console.log("error", error);
		} finally {
			fetchWholesaleGroup();
		}
	};

	const handleConfirmDelete = (partner) => {
		setGroupDelete(partner);
	};

	const handleCancelDelete = () => {
		setGroupDelete(null);
	};

	const handleDeleteGroup = async () => {
		if (!groupDelete) return;

		try {
			await WholesaleGroupApi.delete(groupDelete.id);
			toast.success(`Group "${groupDelete.name}" deleted successfully`);
			fetchWholesaleGroup();
		} catch (error) {
			console.log("handleDeleteProduct error", error);
		} finally {
			setGroupDelete(null);
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

		if (users?.value?.length) {
			formattedData.users = users.value.map((_u) => ({
				name: _u.label,
				id: _u.value,
			}));
		}

		try {
			if (popupData && popupData.id) {
				await WholesaleGroupApi.update({ ...formattedData, id: popupData.id });
				toast.success("Group updated successfully");
			} else {
				const res = await WholesaleGroupApi.create(formattedData);

				toast.success(res.message);
			}
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			// toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			fetchWholesaleGroup();
		}
	};

	const handleFormChange = (name, value) => {
		setFormData((prev) => ({
			...prev,
			[name]: { ...prev[name], value, error: "" },
		}));
	};

	const handleUserChange = (itemPicked) => {
		setUsers((prev) => ({ ...prev, value: itemPicked }));
	};

	const renderGroups = () => {
		return groups.map((group) => (
			<tr
				key={group.id}
				className="hover:bg-slate-50 border-b border-slate-200">
				<td className="p-4 py-5 font-semibold text-sm text-slate-800">{group.name}</td>
				<td className="p-4 py-5 font-semibold text-sm text-slate-800">
					<td className="p-4 py-5 text-sm text-slate-500">
						{group.users.map((_u) => (
							<div key={_u.id}>{_u.username}</div>
						))}
					</td>
				</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{formatDateWithIntl(group.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2 flex-wrap">
						<button
							className="border p-2 rounded-md"
							onClick={() => handleEdit(group)}>
							<Icon type="icon-edit" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleClone(group)}>
							<Icon type="icon-clone" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleConfirmDelete(group)}>
							<Icon type="icon-delete" />
						</button>
					</div>
				</td>
			</tr>
		));
	};

	return (
		<div className="mt-3 p-1">
			<div className="flex justify-between">
				<div className="w-full flex justify-between items-center mb-3 mt-1">
					<button
						className="flex gap-2 border rounded-md p-2 hover:bg-[#ffe9cf] transition-all"
						onClick={handleCreate}>
						<Icon type="icon-create" />
						<p>{"Create new group"}</p>
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
							{["Group Name", "Assign User", "Created At", "common.actions"].map(
								(header, idx) => (
									<th
										key={idx}
										className="p-4 border-b border-slate-200 bg-[#ffe9cf]"
										style={{ width: `${100 / 6}%` }}>
										<p className="text-sm font-normal leading-none">
											{t(header)}
										</p>
									</th>
								)
							)}
						</tr>
					</thead>
					<tbody>{renderGroups()}</tbody>
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
				title={popupData?.id ? "Edit Group" : "Create Group"}
				onClose={handleClosePopup}
				onSubmit={handlePopupSubmit}>
				{Object.keys(formData).map((key) => {
					const field = formData[key];

					return (
						<FormField
							key={key}
							label="Name"
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

				<label
					htmlFor="#"
					className="block text-sm font-medium text-gray-700 mb-1">
					{t("Choose users")}
				</label>
				<Select
					isMultiple
					value={users.value}
					onChange={(value) => handleUserChange(value)}
					options={users.options}
				/>
			</Popup>

			<Popup
				isOpen={!!groupDelete}
				title={t("common.confirm_delete")}
				onClose={handleCancelDelete}
				onSubmit={handleDeleteGroup}>
				<p>
					Bạn có chắc chắn muốn xóa đối tác <b>{groupDelete?.name}</b> không?
				</p>
			</Popup>
		</div>
	);
}

export default CreateGroupPage;
