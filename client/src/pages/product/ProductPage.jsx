import { useEffect, useState } from "react";
import ProductApi from "../../api/productApi";
import FormField from "../../components/FormField";
import Icon from "../../components/Icon/Icon";
import Popup from "../../components/Popup";
import { formatDateWithIntl } from "../../helpers/convertDate";
import useDebounce from "../../hooks/useDebounce";
import queryString from "query-string";

const INIT_FORMDATA = {
	name: {
		value: "",
		error: "",
	},
	price: {
		value: "",
		error: "",
	},
	quantity: {
		value: 100,
		error: "",
	},
};

function ProductsPage() {
	const [isOpen, setIsOpen] = useState(false);
	const [products, setProducts] = useState([]);
	const [formData, setFormData] = useState(INIT_FORMDATA);
	const [searchTerm, setSearchTerm] = useState("");
	const searchDebounce = useDebounce(searchTerm, 500);

	const [pagination, setPagination] = useState({
		page: 1,
		limit: 3,
		total_page: 10,
		total_item: 10,
	});

	const handleOpenPopupCreateProduct = () => {
		setIsOpen(true);
	};

	const handleClosePopup = () => {
		setIsOpen(false);
	};

	const handleChange = (name, event) => {
		const { value } = event.target;

		setFormData((prev) => ({
			...prev,
			[name]: { ...prev[name], value },
		}));
	};

	const handleSubmit = async () => {
		try {
			const _formData = Object.keys(formData).reduce((_acc, _crr) => {
				_acc[_crr] = formData[_crr].value;

				return _acc;
			}, {});

			await ProductApi.create(_formData);
		} catch (error) {
			console.log(error);
		} finally {
			setFormData(INIT_FORMDATA);
			setIsOpen(false);
			findAllProducts();
		}
	};

	const findAllProducts = async () => {
		const res = await ProductApi.findAll({ searchTerm: searchDebounce });
		const products = res.metadata.result;

		setProducts(products);
		setPagination((prev) => ({ ...prev, ...res.metadata.pagination }));
	};

	const handleSearchChange = (e) => {
		const { value } = e.target;

		setSearchTerm(value);
	};

	const handleDeleteProduct = async (id) => {
		try {
			await ProductApi.delete(id);
		} catch (error) {
			console.log(error);
		} finally {
			findAllProducts();
		}
	};

	useEffect(() => {
		findAllProducts();
	}, [searchDebounce]);

	return (
		<div className="mt-3 p-1">
			<div className="w-full flex justify-between items-center mb-3 mt-1 ">
				<div>
					<div
						className="flex gap-2 border rounded-md p-[8px] hover:bg-[#ffe9cf] hover:underline cursor-pointer transition-all"
						onClick={handleOpenPopupCreateProduct}>
						<Icon type="icon-create" />
						<p>Tạo sản phẩm</p>
					</div>
				</div>
				<div className="ml-3">
					<div className="w-full max-w-sm min-w-[200px] relative">
						<div className="relative">
							<input
								onChange={handleSearchChange}
								value={searchTerm}
								className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
								placeholder="Tìm kiếm sản phẩm..."
							/>
							<button
								className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded "
								type="button">
								<Icon type="icon-search" />
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className="relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
				<table className="w-full text-left table-auto min-w-max">
					<thead>
						<tr>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Tên sản phẩm</p>
							</th>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Giá (vnđ)</p>
							</th>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Số lượng</p>
							</th>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Trạng thái</p>
							</th>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Ngày tạo</p>
							</th>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Hành động</p>
							</th>
						</tr>
					</thead>
					<tbody>
						{products.map((_item, index) => (
							<tr
								className="hover:bg-slate-50 border-b border-slate-200"
								key={index}>
								<td className="p-4 py-5">
									<p className="block font-semibold text-sm text-slate-800">
										{_item.name}
									</p>
								</td>
								<td className="p-4 py-5">
									<p className="text-sm text-slate-500">{_item.price}</p>
								</td>
								<td className="p-4 py-5">
									<p className="text-sm text-slate-500">{_item.quantity}</p>
								</td>
								<td className="p-4 py-5">
									<p className="text-sm text-slate-500">Active</p>
								</td>
								<td className="p-4 py-5">
									<p className="text-sm text-slate-500">
										{formatDateWithIntl(_item.createdAt)}
									</p>
								</td>
								<td className="p-4 py-5">
									<div className="flex item-center gap-2">
										<button className="border p-2 rounded-md">
											<Icon type="icon-edit" />
										</button>

										<button
											className="border p-2 rounded-md"
											onClick={() => handleDeleteProduct(_item.id)}>
											<Icon type="icon-delete" />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="flex justify-between items-center px-4 py-3">
					<div className="text-sm text-slate-500">
						Showing <b>1-5</b> of {pagination.total_page}
					</div>
					<div className="flex space-x-1">
						{!pagination.total_page <= 1 && (
							<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
								Prev
							</button>
						)}
						<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
							2
						</button>
						<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
							3
						</button>
						{pagination.total_page > 1 && (
							<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
								Next
							</button>
						)}
					</div>
				</div>
			</div>

			<Popup
				isOpen={isOpen}
				title="Form tạo sản phẩm"
				onClose={handleClosePopup}
				onSubmit={handleSubmit}>
				<div>
					<div className="form-control">
						<FormField
							label="Tên sản phẩm"
							type="text"
							name="product-name"
							value={formData.name.value}
							onChange={(e) => handleChange("name", e)}
						/>
					</div>
					<div className="form-control">
						<FormField
							label="Giá"
							type="number"
							name="product-price"
							value={formData.price.value}
							onChange={(e) => handleChange("price", e)}
						/>
					</div>
					<div className="form-control">
						<FormField
							label="Số lượng"
							type="number"
							name="product-quantity"
							value={formData.quantity.value}
							onChange={(e) => handleChange("quantity", e)}
						/>
					</div>
				</div>
			</Popup>
		</div>
	);
}

export default ProductsPage;
