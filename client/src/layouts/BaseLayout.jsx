import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import Logo from "../assets/logo.jpg";
import Icon from "../components/Icon/Icon";

function BaseLayout() {
	const [isCollapse, setIsCollapse] = useState(true);

	const handleCollapse = () => {
		setIsCollapse(!isCollapse);
	};

	return (
		<div className="h-[100vh] flex flex-col">
			<div className="top-bar h-[50px] bg-[#ffe9cf] p-2">
				<div className="flex justify-between items-center h-full">
					<div>
						<img
							src={Logo}
							alt=""
							className="d-block rounded-[50%]"
							width={50}
						/>
					</div>

					<div className="avatar w-[35px] h-[35px] rounded-[50%] bg-[#eee] flex justify-center items-center">
						<svg
							width="20px"
							height="20px"
							viewBox="0 0 16 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
								fill="#000000"
							/>
							<path
								d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
								fill="#000000"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div className="flex flex-1">
				<div
					className={`shadow-lg ${
						isCollapse ? "w-[60px]" : "w-[250px]"
					} p-2 transition-all`}>
					<div>
						<p className={`${isCollapse ? "text-center" : "text-right"}`}>
							{isCollapse ? (
								<button onClick={handleCollapse}>
									<Icon type="arrow-right" />
								</button>
							) : (
								<button onClick={handleCollapse}>
									<Icon type="hambuger-menu" />
								</button>
							)}
						</p>

						<div className="divider w-full h-[1px] bg-[#eee]"></div>
					</div>

					<div className="mt-3">
						{isCollapse ? (
							<div className="flex items-center flex-col gap-[15px]">
								<NavLink to="/dashboard/admin/orders">
									<Icon type="icon-create" />
								</NavLink>

								<NavLink to="/dashboard/admin/products">
									<Icon type="icon-manager-order" />
								</NavLink>

								<NavLink>
									<Icon type="icon-analytic" />
								</NavLink>

								<NavLink>
									<Icon type="icon-price" />
								</NavLink>

								<NavLink>
									<Icon type="icon-user-group" />
								</NavLink>
							</div>
						) : (
							<ul>
								<NavLink
									to="/dashboard/admin/orders"
									className={({ isActive }) =>
										`flex gap-2 mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md ${
											isActive ? "bg-[#ffe9cf]" : ""
										}`
									}>
									<Icon type="icon-create" />
									<p>Tạo đơn hàng</p>
								</NavLink>

								<NavLink
									to="/dashboard/admin/products"
									className={({ isActive }) =>
										`flex gap-2 mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md ${
											isActive ? "bg-[#ffe9cf]" : ""
										}`
									}>
									<Icon type="icon-manager-order" />
									<p>Quản lý đơn hàng</p>
								</NavLink>

								<NavLink
									to="/dashboard/admin/analytics"
									className={({ isActive }) =>
										`flex gap-2 mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md ${
											isActive ? "bg-[#ffe9cf]" : ""
										}`
									}>
									<Icon type="icon-analytic" />
									<p>Thống kê</p>
								</NavLink>

								<NavLink
									to="/dashboard/admin/prices"
									className={({ isActive }) =>
										`flex gap-2 mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md ${
											isActive ? "bg-[#ffe9cf]" : ""
										}`
									}>
									<Icon type="icon-price" />
									<p>Giá sỉ</p>
								</NavLink>

								<NavLink
									to="/dashboard/admin/users"
									className={({ isActive }) =>
										`flex gap-2 mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md ${
											isActive ? "bg-[#ffe9cf]" : ""
										}`
									}>
									<Icon type="icon-user-group" />
									<p>Thành viên</p>
								</NavLink>
							</ul>
						)}
					</div>
				</div>

				<div className="p-2 flex-1 bg-[##fafafa]">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default BaseLayout;
