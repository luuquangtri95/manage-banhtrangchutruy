import Icon from "../../components/Icon/Icon";
import { USERS } from "../../mock/user";

function UsersPage(props) {
	return (
		<div className="mt-3 p-1">
			<div className="w-full flex justify-between items-center mb-3 mt-1 ">
				<div className="flex gap-2 border rounded-md p-[8px] hover:bg-[#ffe9cf] hover:underline cursor-pointer transition-all">
					<Icon type="icon-create" />
					<p>Tạo thành viên</p>
				</div>
				<div className="ml-3">
					<div className="w-full max-w-sm min-w-[200px] relative">
						<div className="relative">
							<input
								className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
								placeholder="Tìm kiếm thành viên..."
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
								<p className="text-sm font-normal leading-none ">Tên thành viên</p>
							</th>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Email</p>
							</th>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Block</p>
							</th>
							<th className="p-4 border-b border-slate-200 bg-[#ffe9cf]">
								<p className="text-sm font-normal leading-none ">Ngày tạo</p>
							</th>
						</tr>
					</thead>
					<tbody>
						{USERS.map((_item, index) => (
							<tr
								className="hover:bg-slate-50 border-b border-slate-200"
								key={index}>
								<td className="p-4 py-5">
									<p className="block font-semibold text-sm text-slate-800">
										{_item.username}
									</p>
								</td>
								<td className="p-4 py-5">
									<p className="text-sm text-slate-500">{_item.email}</p>
								</td>
								<td className="p-4 py-5">
									<p className="text-sm text-slate-500">
										{_item.isActive ? "Active" : "Blocked"}
									</p>
								</td>
								<td className="p-4 py-5">
									<p className="text-sm text-slate-500">2024-08-01</p>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="flex justify-between items-center px-4 py-3">
					<div className="text-sm text-slate-500">
						Showing <b>1-5</b> of 45
					</div>
					<div className="flex space-x-1">
						<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
							Prev
						</button>
						<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-white bg-slate-800 border border-slate-800 rounded hover:bg-slate-600 hover:border-slate-600 transition duration-200 ease">
							1
						</button>
						<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
							2
						</button>
						<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
							3
						</button>
						<button className="px-3 py-1 min-w-9 min-h-9 text-sm font-normal text-slate-500 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:border-slate-400 transition duration-200 ease">
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UsersPage;
