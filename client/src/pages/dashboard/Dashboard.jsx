import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../../assets/logo.jpg";
import Icon from "../../components/Icon/Icon";
import { AuthContext } from "../../context/AuthContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import LogoEnglish from "../../assets/english.png";
import LogoVietnam from "../../assets/vietnam.png";

const MENU_ITEMS = [
	// { path: "/dashboard/orders/create", icon: "icon-create", label: "create_order" },
	{ path: "/dashboard/orders", icon: "icon-manager-order", label: "menu.manage_orders" },
	{ path: "/dashboard/products", icon: "icon-products", label: "menu.manage_products" },
	{ path: "/dashboard/categories", icon: "icon-category", label: "menu.manage_categories" },
	{ path: "/dashboard/wholesale-price", icon: "icon-price", label: "menu.wholesale_price" },
	// { path: "/dashboard/support", icon: "icon-support", label: "contact_support" },
];

const ADMIN_MENU_ITEMS = [
	{ path: "/dashboard/analytics", icon: "icon-analytic", label: "menu.analytics" },
	{ path: "/dashboard/users", icon: "icon-user-group", label: "menu.members" },
	{ path: "/dashboard/partners", icon: "icon-partner", label: "menu.manage_partners" },
	{
		path: "/dashboard/manage-permission",
		icon: "icon-permission",
		label: "menu.grant_permission",
	},
];

const LANGUAGES = {
	en: { flag: LogoEnglish, name: "English" },
	vi: { flag: LogoVietnam, name: "Tiếng Việt" },
};

function Dashboard() {
	const [isCollapse, setIsCollapse] = useState(false);
	const [renderContent, setRenderContent] = useState(true);
	const { onLogout } = useContext(AuthContext);
	const { t, i18n } = useTranslation();
	const [userInfo, setUserInfo] = useState(null);
	const [isShowPopover, setIsShowPopover] = useState(false);
	const [language, setLanguage] = useState(localStorage.getItem("i18nextLng"));
	const [isOpen, setIsOpen] = useState(false);

	const currentElmRef = useRef(null);
	const flagEleRef = useRef(null);
	const navigate = useNavigate();

	const handleCollapse = () => setIsCollapse(!isCollapse);
	const handleChangeLang = (lang) => {
		i18n.changeLanguage(lang);

		setLanguage(lang);
		setIsOpen(false);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await authorizedAxiosInstance.get(`/dashboards/access`);
				setUserInfo(res);
			} catch (error) {
				console.error("Error fetching user info", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		if (isCollapse) {
			setRenderContent(false);
		} else {
			const timer = setTimeout(() => setRenderContent(true), 100);
			return () => clearTimeout(timer);
		}
	}, [isCollapse]);

	useEffect(() => {
		const handleClosePopupOutside = (event) => {
			const { target } = event;
			if (!currentElmRef.current.contains(target)) {
				setIsShowPopover(false);
			}
		};

		window.addEventListener("click", handleClosePopupOutside);

		return () => {
			window.removeEventListener("click", handleClosePopupOutside);
		};
	}, []);

	const togglePopover = () => setIsOpen((prev) => !prev);

	return (
		<div className="h-[100vh] flex flex-col">
			{/* Main Layout */}
			<div className="flex flex-1">
				{/* Sidebar */}
				<div
					className={`shadow-lg ${
						isCollapse ? "w-[60px]" : "w-[250px]"
					} p-2 transition-all`}>
					<div className={`${isCollapse ? "flex justify-center" : ""} `}>
						<button
							onClick={handleCollapse}
							className={`mb-3 ${isCollapse ? "px-[20px]" : ""}`}>
							<Icon type={isCollapse ? "arrow-right" : "hambuger-menu"} />
						</button>
					</div>

					<div className="divider w-full h-[1px] bg-[#eee] mb-3"></div>

					{/* Navigation Links */}
					<div className="mt-2 flex flex-col">
						{MENU_ITEMS.map((item) => (
							<NavLink
								key={item.path}
								to={item.path}
								className={({ isActive }) =>
									`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
										isCollapse && !renderContent
											? isActive
												? "bg-[#ffe9cf]"
												: "hover:text-gray-500"
											: isActive
											? "bg-[#ffe9cf]"
											: "hover:bg-[#f5e6cf]"
									}`
								}>
								<Icon type={item.icon} />
								{!isCollapse && renderContent && <p>{t(item.label)}</p>}
							</NavLink>
						))}

						{/* ADMIN MENU */}
						{userInfo?.role === "admin" &&
							ADMIN_MENU_ITEMS.map((item) => (
								<NavLink
									key={item.path}
									to={item.path}
									className={({ isActive }) =>
										`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
											isCollapse && !renderContent
												? isActive
													? "bg-[#ffe9cf]"
													: "hover:text-gray-500"
												: isActive
												? "bg-[#ffe9cf]"
												: "hover:bg-[#f5e6cf]"
										}`
									}>
									<Icon type={item.icon} />
									{!isCollapse && renderContent && <p>{t(item.label)}</p>}
								</NavLink>
							))}
					</div>

					{/* Logout Button */}
					{/* <button
						className="p-3 flex items-center gap-2 mt-auto hover:bg-[#ffe9cf] transition-all rounded-md"
						onClick={onLogout}>
						<Icon type="icon-logout" />
						{t("menu.logout")}
					</button> */}
				</div>

				{/* Content */}
				<div className="flex-1 bg-[#fafafa] relative">
					{/* Top Bar */}
					<div className="top-bar h-[60px] bg-[#ffe9cf] p-2 border-b-2 border-[#000]">
						<div className="flex justify-between items-center h-full">
							<div onClick={() => setIsShowPopover(!isShowPopover)}>
								<img
									src={Logo}
									alt="Logo"
									className="rounded-full"
									width={50}
								/>
							</div>

							<div className="flex gap-2 items-center">
								<div className="flex gap-2">
									<div className="relative">
										<div
											className="cursor-pointer"
											onClick={togglePopover}
											ref={flagEleRef}>
											<img
												src={LANGUAGES[language].flag}
												alt=""
												width="25"
											/>
										</div>

										{isOpen && (
											<div className="absolute bg-white shadow-2xl w-[130px] h-auto z-10 top-[40px] right-0 rounded-md border border-[#ccc]">
												<div className="flex flex-col">
													{Object.keys(LANGUAGES).map((lang) => (
														<div
															key={lang}
															className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200"
															onClick={() => handleChangeLang(lang)}>
															<img
																src={LANGUAGES[lang].flag}
																alt=""
																width="25"
															/>
															<p>{LANGUAGES[lang].name}</p>
														</div>
													))}
												</div>
											</div>
										)}
									</div>

									{/* <button onClick={() => handleChangeLang("en")}>🇬🇧</button>
									<button onClick={() => handleChangeLang("vi")}>🇻🇳</button> */}
								</div>
								<div className="avatar relative border border-[#ccc] w-[35px] h-[35px] rounded-full bg-[#eee] flex justify-center items-center">
									<div>
										<div
											ref={currentElmRef}
											onClick={() => setIsShowPopover(!isShowPopover)}
											className="cursor-pointer">
											<Icon type="icon-user" />
										</div>
									</div>

									{isShowPopover && (
										<div className="absolute bg-[#fff] shadow-2xl w-[210px] h-auto z-10 top-[40px] right-0 rounded-xl border border-[#ccc]">
											<ul className="rounded-xl overflow-hidden">
												<li
													className="cursor-pointer px-[11px] py-[13px] hover:bg-[#ccc]"
													onClick={() => navigate("/dashboard/profile")}>
													<div className="flex gap-2 items-center ">
														<Icon type="icon-change-info" />
														<p className="text-[16px]">
															{t("common.my_profile")}
														</p>
													</div>
												</li>
												<li className="w-full h-[1px] bg-[#ccc]"></li>
												<li
													className="cursor-pointer  px-[11px] py-[13px] hover:bg-[#ccc]"
													onClick={onLogout}>
													<div className="flex gap-2 items-center ">
														<Icon type="icon-logout" />
														<p className="text-[16px]">
															{t("common.logout")}
														</p>
													</div>
												</li>
											</ul>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="px-4">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
