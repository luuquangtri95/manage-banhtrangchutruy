import { Link } from "react-router-dom";

function Layout() {
	return (
		<div className="header">
			<div className="top-bar h-[50px] bg-main p-2">
				<div className="flex justify-between items-center h-full">
					<div>
						<img
							src="https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/466734656_122102191430609836_1008743901343252919_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=1HuZg_oM8nsQ7kNvgF3pxt_&_nc_oc=AdgAVlGCtSqMfpmaFhgC-dS6X0_26o0EEPpgc0Rr0p67u5hMOkTRU0PHQPliBVlHCIjVKpE4AtcT0jHWIpbUIKFw&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=AmpcR1u8352sKxQvk669TDo&oh=00_AYD3n_K5qnIbO5FHltIWCHdKKmt6eJaZZjk3zUTpbthf5w&oe=6787160C"
							alt=""
							className="d-block rounded-[50%]"
							width={50}
						/>
					</div>

					{/* Navigation */}
					<div className="header-wrapper flex justify-between">
						<div className="navigation">
							<ul className="navigation-wrapper flex ">
								<li className="nav-item px-4">
									<Link
										to="/"
										className="flex hover:text-orange-500">
										Home
									</Link>
								</li>
								<li className="nav-item px-4 ">
									<Link
										to="/orders"
										className="hover:text-orange-500">
										Order List
									</Link>
								</li>
								<li className="nav-item px-4">
									<Link
										to="/create-product"
										className="hover:text-orange-500">
										Test
									</Link>
								</li>
							</ul>
						</div>
					</div>
					{/* End Navigation */}
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
		</div>
	);
}

export default Layout;
