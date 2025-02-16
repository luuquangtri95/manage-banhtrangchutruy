import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import PartnerApi from "../../api/partnerApi";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";

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
	address: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Address is required";
		},
	},
	description: {
		value: "",
		type: "textarea",
		error: "",
		validate: (value) => {
			return "";
		},
	},
	phone: {
		value: "",
		type: "text",
		error: "",
		validate: (value) => {
			if (!value.trim()) return "Phone is require";
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

function PartnerPage() {
	const [popupData, setPopupData] = useState(null);
	const [partnerDelete, setPartnerDelete] = useState(null);
	const [partners, setPartners] = useState([]);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [loading, setLoading] = useState(false);
	const [filters, setFilters] = useState({ page: 1, limit: 8, searchTerm: "" });
	const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
	const { t } = useTranslation();

	useEffect(() => {
		fetchPartners();
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

	const fetchPartners = async () => {
		try {
			setLoading(true);
			const res = await PartnerApi.findAll(filters);

			setPartners(res.metadata.result);
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
		if (!partnerDelete) return;

		try {
			await PartnerApi.delete(partnerDelete.id);
			toast.success(`Partner "${partnerDelete.name}" deleted successfully`);
			fetchPartners();
		} catch (error) {
			console.log("handleDeleteProduct error", error);
		} finally {
			setPartnerDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setPartnerDelete(null);
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
				address: oldItem.address,
				phone: oldItem.phone,
			};

			const res = await PartnerApi.create(_newItem);

			if (res.metadata.id) {
				toast.success(`Clone ${res.metadata.name} success !`);
			}
		} catch (error) {
			console.log("error", error);
		} finally {
			fetchPartners();
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
				await PartnerApi.update({ ...formattedData, id: popupData.id });
				toast.success("Partner updated successfully");
			} else {
				const res = await PartnerApi.create(formattedData);

				toast.success(res.message);
			}
		} catch (error) {
			console.log("handlePopupSubmit error", error);
			// toast.error("Failed to submit product");
		} finally {
			setPopupData(null);
			setFormData(INIT_FORMDATA);
			fetchPartners();
		}
	};

	const handleConfirmDelete = (partner) => {
		setPartnerDelete(partner);
	};

	const renderSkeleton = () =>
		Array.from({ length: partners.length }).map((_, rowIndex) => (
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

	const renderParners = () =>
		partners.map((partner) => (
			<tr
				key={partner.id}
				className="hover:bg-slate-50 border-b border-slate-200">
				<td className="p-4 py-5 font-semibold text-sm text-slate-800">{partner.name}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{partner.address}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{partner.description}</td>
				<td className="p-4 py-5 text-sm text-slate-500">{partner.phone}</td>
				<td className="p-4 py-5 text-sm text-slate-500">
					{formatDateWithIntl(partner.createdAt)}
				</td>
				<td className="p-4 py-5">
					<div className="flex items-center gap-2 flex-wrap">
						<button
							className="border p-2 rounded-md"
							onClick={() => handleEdit(partner)}>
							<Icon type="icon-edit" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleClone(partner)}>
							<Icon type="icon-clone" />
						</button>

						<button
							className="border p-2 rounded-md"
							onClick={() => handleConfirmDelete(partner)}>
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
						<p>{t("common.create_new_partner")}</p>
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
								"partner_page.table.name",
								"partner_page.table.address",
								"partner_page.table.description",
								"partner_page.table.phone",
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
					<tbody>{loading ? renderSkeleton() : renderParners()}</tbody>
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
				title={popupData?.id ? t("common.edit_product") : t("common.create_new_partner")}
				onClose={handleClosePopup}
				onSubmit={handlePopupSubmit}>
				{Object.keys(formData).map((key) => {
					const field = formData[key];

					return (
						<FormField
							key={key}
							label={t(`partner_page.popup.${key}`)}
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
			</Popup>

			<Popup
				isOpen={!!partnerDelete}
				title={t("common.confirm_delete")}
				onClose={handleCancelDelete}
				onSubmit={handleDeleteProduct}>
				<p>
					Bạn có chắc chắn muốn xóa đối tác <b>{partnerDelete?.name}</b> không?
				</p>
			</Popup>
		</div>
	);
}

export default PartnerPage;
