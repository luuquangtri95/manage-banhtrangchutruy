import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../assets/logo.jpg";
import Icon from "../components/Icon/Icon";
import { AuthContext } from "../context/AuthContext";
import authorizedAxiosInstance from "../utils/authorizedAxios";

function BaseLayout() {
	const [isCollapse, setIsCollapse] = useState(false);
	const [renderContent, setRenderContent] = useState(true);
	const { userInfo, onLogout } = useContext(AuthContext);

	const handleCollapse = () => {
		setIsCollapse(!isCollapse);
	};

	useEffect(() => {
		const fetchData = async () => {
			const res = await authorizedAxiosInstance.get(`/dashboards/access`);

			console.log(res);
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (isCollapse) {
			// Nếu menu thu nhỏ, ẩn nội dung ngay lập tức
			setRenderContent(false);
		} else {
			// Nếu menu mở rộng, chờ 300ms (thời gian transition) trước khi render nội dung
			const timer = setTimeout(() => {
				setRenderContent(true);
			}, 100); // Thời gian đồng bộ với CSS transition
			return () => clearTimeout(timer); // Dọn dẹp timeout nếu `isCollapse` thay đổi trước khi hết thời gian
		}
	}, [isCollapse]);

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
						<p className={`${isCollapse ? "text-center" : ""}`}>
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

					<div className="mt-2 flex flex-col">
						<div className="">
							{isCollapse && (
								<div className="flex items-center flex-col">
									<NavLink
										to={`/dashboard/order-create`}
										className={({ isActive }) =>
											`p-3 rounded-md ${
												isActive ? "bg-[#ffe9cf]" : "bg-none"
											}`
										}>
										<Icon type="icon-create" />
									</NavLink>

									<NavLink
										end
										to="/dashboard/orders"
										className={({ isActive }) =>
											`p-3 rounded-md ${
												isActive ? "bg-[#ffe9cf]" : "bg-none"
											}`
										}>
										<Icon type="icon-manager-order" />
									</NavLink>

									<NavLink
										to="/dashboard/products"
										className={({ isActive }) =>
											`p-3 rounded-md ${
												isActive ? "bg-[#ffe9cf]" : "bg-none"
											}`
										}>
										<Icon type="icon-products" />
									</NavLink>

									<NavLink
										to="/dashboard/categories"
										className={({ isActive }) =>
											`p-3 rounded-md ${
												isActive ? "bg-[#ffe9cf]" : "bg-none"
											}`
										}>
										<Icon type="icon-category" />
									</NavLink>

									<NavLink
										to="/dashboard/analytic"
										className={({ isActive }) =>
											`p-3 rounded-md ${
												isActive ? "bg-[#ffe9cf]" : "bg-none"
											}`
										}>
										<Icon type="icon-analytic" />
									</NavLink>

									<NavLink
										to="/dashboard/wholesale-price"
										className={({ isActive }) =>
											`p-3 rounded-md ${
												isActive ? "bg-[#ffe9cf]" : "bg-none"
											}`
										}>
										<Icon type="icon-price" />
									</NavLink>

									<NavLink
										to="/dashboard/users"
										className={({ isActive }) =>
											`p-3 rounded-md ${
												isActive ? "bg-[#ffe9cf]" : "bg-none"
											}`
										}>
										<Icon type="icon-user-group" />
									</NavLink>

									<NavLink
										to="/123"
										className={({ isActive }) =>
											`p-3 rounded-md ${
												isActive ? "bg-[#ffe9cf]" : "bg-none"
											}`
										}>
										<Icon type="icon-support" />
									</NavLink>
								</div>
							)}

							{renderContent && !isCollapse && (
								<ul>
									<NavLink
										to="/dashboard/order-create"
										className={({ isActive }) =>
											`p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md ${
												isActive ? "bg-[#ffe9cf]" : ""
											}`
										}>
										<Icon type="icon-create" />
										<p>Tạo đơn hàng</p>
									</NavLink>

									<NavLink
										end
										to="/dashboard/orders"
										className={({ isActive }) =>
											`p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md ${
												isActive ? "bg-[#ffe9cf]" : ""
											}`
										}>
										<Icon type="icon-manager-order" />
										<p>Quản lý đơn hàng</p>
									</NavLink>

									<NavLink
										end
										to="/dashboard/products"
										className={({ isActive }) =>
											`p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md ${
												isActive ? "bg-[#ffe9cf]" : ""
											}`
										}>
										<Icon type="icon-products" />
										<p>Quản lý sản phẩm</p>
									</NavLink>

									<NavLink
										end
										to="/dashboard/categories"
										className={({ isActive }) =>
											`p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md ${
												isActive ? "bg-[#ffe9cf]" : ""
											}`
										}>
										<Icon type="icon-category" />
										<p>Quản lý danh mục</p>
									</NavLink>

									<NavLink
										to="/dashboard/analytic"
										className={({ isActive }) =>
											`p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md ${
												isActive ? "bg-[#ffe9cf]" : ""
											}`
										}>
										<Icon type="icon-analytic" />
										<p>Thống kê</p>
									</NavLink>

									<NavLink
										to="/dashboard/wholesale-price"
										className={({ isActive }) =>
											`p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md ${
												isActive ? "bg-[#ffe9cf]" : ""
											}`
										}>
										<Icon type="icon-price" />
										<p>Giá sỉ</p>
									</NavLink>

									<NavLink
										to="/dashboard/users"
										className={({ isActive }) =>
											`p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md ${
												isActive ? "bg-[#ffe9cf]" : ""
											}`
										}>
										<Icon type="icon-user-group" />
										<p>Thành viên</p>
									</NavLink>

									<NavLink
										to="/123"
										className={({ isActive }) =>
											`p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md ${
												isActive ? "bg-[#ffe9cf]" : ""
											}`
										}>
										<Icon type="icon-support" />
										<p>Liên hệ hỗ trợ</p>
									</NavLink>
								</ul>
							)}
						</div>

						<div className="flex-1">
							<button
								className="p-3 flex items-center gap-2 mb-1 hover:bg-[#ffe9cf] transition-all rounded-md"
								onClick={onLogout}>
								<Icon type="icon-logout" />
								Logout
							</button>
						</div>
					</div>
				</div>

				<div className="p-2 flex-1 bg-[#fafafa]">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default BaseLayout;
