import { useState } from "react";
import Icon from "../components/Icon/Icon";
import { Outlet } from "react-router";

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
							src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/466734656_122102191430609836_1008743901343252919_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1HuZg_oM8nsQ7kNvgF3pxt_&_nc_oc=AdgAVlGCtSqMfpmaFhgC-dS6X0_26o0EEPpgc0Rr0p67u5hMOkTRU0PHQPliBVlHCIjVKpE4AtcT0jHWIpbUIKFw&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AmpcR1u8352sKxQvk669TDo&oh=00_AYD3n_K5qnIbO5FHltIWCHdKKmt6eJaZZjk3zUTpbthf5w&oe=6787160C"
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
								<button>
									<Icon type="icon-create" />
								</button>

								<button>
									<Icon type="icon-manager-order" />
								</button>

								<button>
									<Icon type="icon-analytic" />
								</button>

								<button>
									<Icon type="icon-price" />
								</button>

								<button>
									<Icon type="icon-user-group" />
								</button>
							</div>
						) : (
							<ul>
								<li className="mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md">
									<div className="flex gap-2">
										<Icon type="icon-create" />
										<p>Tạo đơn hàng</p>
									</div>
								</li>

								<li className="mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md">
									<div className="flex gap-2">
										<Icon type="icon-manager-order" />
										<p>Quản lý đơn hàng</p>
									</div>
								</li>

								<li className="mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md">
									<div className="flex gap-2">
										<Icon type="icon-analytic" />
										<p>Thống kê</p>
									</div>
								</li>

								<li className="mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md">
									<div className="flex gap-2">
										<Icon type="icon-price" />
										<p>Giá sỉ</p>
									</div>
								</li>

								<li className="mb-3 hover:bg-[#ffe9cf] p-1 transition-all rounded-md">
									<div className="flex gap-2 items-center">
										<Icon type="icon-user-group" />
										<p>Thành viên</p>
									</div>
								</li>
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
