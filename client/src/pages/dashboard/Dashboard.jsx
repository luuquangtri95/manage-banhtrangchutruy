import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import LogoEnglish from "../../assets/english.png";
import Logo from "../../assets/logo.jpg";
import LogoVietnam from "../../assets/vietnam.png";
import Icon from "../../components/Icon/Icon";
import { AuthContext } from "../../context/AuthContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import useDetectDevice from "../../hooks/useDetectDevice";

export const DashboardContext = createContext(null);

const USER_MENU_ITEMS = [
	{ path: "/dashboard/view-price", icon: "icon-price", label: "menu.wholesale_prices" },
];

const MENU_ITEMS = [
	{ path: "/dashboard/orders", icon: "icon-manager-order", label: "menu.manage_orders" },
	{ path: "/dashboard/products", icon: "icon-products", label: "menu.manage_products" },
	{ path: "/dashboard/categories", icon: "icon-category", label: "menu.manage_categories" },

	// { path: "/dashboard/support", icon: "icon-support", label: "contact_support" },
];

const ADMIN_MENU_ITEMS = [
	{
		label: "menu.wholesale_price",
		icon: "icon-price",
		subMenu: [
			{
				path: "/dashboard/wholesale-groups",
				icon: "icon-group",
				label: "menu.wholesale_groups",
			},
			{
				path: "/dashboard/wholesale-prices",
				icon: "icon-list",
				label: "menu.wholesale_prices",
			},
		],
	},
	{ path: "/dashboard/analytics", icon: "icon-analytic", label: "menu.analytics" },
	{ path: "/dashboard/users", icon: "icon-user-group", label: "menu.members" },
	{ path: "/dashboard/partners", icon: "icon-partner", label: "menu.manage_partners" },
	{
		path: "/dashboard/manage-permission",
		icon: "icon-permission",
		label: "menu.grant_permission",
	},
];

const NAV_MOBILE = [
	{
		label: "common.logout",
		icon: "icon-logout",
	},
];

const LANGUAGES = {
	en: { flag: LogoEnglish, name: "English" },
	vi: { flag: LogoVietnam, name: "Tiếng Việt" },
};

const getValidLanguage = () => {
	const lang = localStorage.getItem("i18nextLng") || "en"; // Mặc định là "en"
	return lang.includes("-") ? lang.split("-")[0] : lang; // Chỉ lấy phần trước "-"
};

function Dashboard() {
	const [isCollapse, setIsCollapse] = useState(false);
	const [renderContent, setRenderContent] = useState(true);
	const { onLogout } = useContext(AuthContext);
	const { t, i18n } = useTranslation();
	const [userInfo, setUserInfo] = useState(null);
	const [isShowPopover, setIsShowPopover] = useState(false);
	const [language, setLanguage] = useState(getValidLanguage());
	const [isOpen, setIsOpen] = useState(false);
	const [isWholesaleOpen, setIsWholesaleOpen] = useState(false);
	const width = useDetectDevice();

	//#region [STATE MOBILE]
	const [isToggleNavMobile, setIsToggleNavMobile] = useState(false);
	//#endregion

	const currentElmRef = useRef(null);
	const flagEleRef = useRef(null);
	const navMenuRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();

	const handleCollapse = () => setIsCollapse(!isCollapse);

	const handleChangeLang = (lang) => {
		const shortLang = lang.includes("-") ? lang.split("-")[0] : lang;
		i18n.changeLanguage(shortLang);

		setLanguage(shortLang);
		localStorage.setItem("i18nextLng", shortLang);
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
		if (isCollapse || isToggleNavMobile) {
			setRenderContent(false);
		} else {
			const timer = setTimeout(() => setRenderContent(true), 100);
			return () => clearTimeout(timer);
		}
	}, [isCollapse, isToggleNavMobile]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			event.stopPropagation();
			const { target } = event;

			// Đóng popover nếu click bên ngoài
			if (currentElmRef?.current && !currentElmRef.current.contains(target)) {
				setIsShowPopover(false);
			}

			if (target.classList.contains(".menu-mobile")) {
				setIsToggleNavMobile((prev) => !prev);
				return;
			}

			if (navMenuRef?.current && !navMenuRef.current.contains(target)) {
				setIsToggleNavMobile(false);
			}
		};

		window.addEventListener("click", handleClickOutside);

		return () => {
			window.removeEventListener("click", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (
			!["/dashboard/wholesale-prices", "/dashboard/wholesale-groups"].includes(
				location.pathname
			)
		) {
			setIsWholesaleOpen(false);
		}
	}, [location.pathname]);

	const togglePopover = () => setIsOpen((prev) => !prev);
	const toggleWholesaleMenu = () => {
		if (!isWholesaleOpen) {
			if (!location.pathname.includes("/dashboard/wholesale")) {
				navigate("/dashboard/wholesale-groups");
			}
		}

		setIsWholesaleOpen((prev) => !prev);
	};

	//#region [MOBILE]
	const handleToggleNavMobile = () => {
		setIsToggleNavMobile(!isToggleNavMobile);
	};
	//#endregion

	return (
		<>
			{/* DESKTOP */}
			{width > 768 && (
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
								<div className="mt-2 flex flex-col">
									{MENU_ITEMS.map((item) => {
										return (
											<NavLink
												key={item.path}
												to={item.path}
												className={({ isActive }) =>
													`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
														isCollapse && !renderContent
															? isActive
																? "bg-main"
																: "hover:text-gray-500"
															: isActive
															? "bg-main"
															: "hover:bg-main-hover"
													}`
												}>
												<Icon type={item.icon} />
												{!isCollapse && renderContent && (
													<p>{t(item.label)}</p>
												)}
											</NavLink>
										);
									})}
								</div>

								{/* ADMIN MENU */}
								{userInfo?.role === "admin" &&
									ADMIN_MENU_ITEMS.map((item) => {
										if (item.subMenu) {
											return (
												<div key={item.label}>
													<div
														className={`min-h-[45px] px-3 rounded-md flex items-center justify-between w-full 
													transition-all duration-200 hover:bg-main-hover 
													${isWholesaleOpen ? "bg-main" : ""}
												`}
														onClick={toggleWholesaleMenu}>
														<div className="flex gap-2">
															<Icon
																type={item.icon}
																width={isCollapse ? "20px" : "25px"}
																height={
																	isCollapse ? "20px" : "25px"
																}
															/>

															{!isCollapse && renderContent && (
																<p>{t(item.label)}</p>
															)}
														</div>
														<div>
															{!isCollapse && renderContent && (
																<Icon
																	type={
																		isWholesaleOpen
																			? "arrow-down-light"
																			: "arrow-right"
																	}
																/>
															)}
														</div>
													</div>

													{!isCollapse && isWholesaleOpen && (
														<div className="pl-6 mt-1">
															{item.subMenu.map((subItem) => (
																<NavLink
																	key={subItem.path}
																	to={subItem.path}
																	className={({ isActive }) =>
																		`p-2 rounded-md flex items-center gap-2 transition-all duration-200 ${
																			isActive
																				? "bg-main"
																				: "hover:bg-main-hover"
																		}`
																	}>
																	<Icon type={subItem.icon} />
																	{!isCollapse && (
																		<p>{t(subItem.label)}</p>
																	)}
																</NavLink>
															))}
														</div>
													)}
												</div>
											);
										} else {
											return (
												<NavLink
													key={item.path}
													to={item.path}
													className={({ isActive }) =>
														`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
															isCollapse && !renderContent
																? isActive
																	? "bg-main"
																	: "hover:text-gray-500"
																: isActive
																? "bg-main"
																: "hover:bg-main-hover"
														}`
													}>
													<Icon type={item.icon} />
													{!isCollapse && renderContent && (
														<p>{t(item.label)}</p>
													)}
												</NavLink>
											);
										}
									})}

								{/* USER MENU */}
								{userInfo?.role !== "admin" &&
									USER_MENU_ITEMS.map((_item) => (
										<NavLink
											key={_item.path}
											to={_item.path}
											className={({ isActive }) =>
												`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
													isCollapse && !renderContent
														? isActive
															? "bg-main"
															: "hover:text-gray-500"
														: isActive
														? "bg-main"
														: "hover:bg-main-hover"
												}`
											}>
											<Icon type={_item.icon} />
											{!isCollapse && renderContent && (
												<p>{t(_item.label)}</p>
											)}
										</NavLink>
									))}
							</div>
						</div>

						{/* Content */}
						<div className="flex-1 bg-[#fafafa] relative">
							{/* Top Bar */}
							<div className="top-bar h-[60px] bg-main p-2 border-b-2 border-[#000]">
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
																	onClick={() =>
																		handleChangeLang(lang)
																	}>
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
										</div>
										<div
											onClick={() => setIsShowPopover(!isShowPopover)}
											ref={currentElmRef}
											className="avatar relative border border-[#ccc] w-[35px] h-[35px] rounded-full bg-[#eee] flex justify-center items-center">
											<div className="cursor-pointer">
												<Icon type="icon-user" />
											</div>

											{isShowPopover && (
												<div className="absolute bg-[#fff] shadow-2xl w-[210px] h-auto z-10 top-[40px] right-0 rounded-xl border border-[#ccc]">
													<ul className="rounded-xl overflow-hidden">
														<li
															className="cursor-pointer px-[11px] py-[13px] hover:bg-[#ccc]"
															onClick={() =>
																navigate("/dashboard/profile")
															}>
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
								<div className="my-3">
									<p
										className="text-[24px] font-thin"
										dangerouslySetInnerHTML={{
											__html: t("common.welcome_message", {
												email: userInfo?.username || userInfo?.email,
											}),
										}}
									/>

									<div className="border w-[80px] h-[2px] border-[#ff771c]"></div>
								</div>

								<DashboardContext.Provider value={{ userInfo }}>
									<Outlet />
								</DashboardContext.Provider>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* MOBILE */}
			{width < 768 && (
				<div>
					{/* topbar */}
					<div className="">
						<div className="h-[60px] w-full bg-main p-2">
							<div className="h-full flex item-center ">
								{/* logo */}
								<div className="flex-1">
									<img
										src={Logo}
										alt="Logo"
										className="rounded-full"
										width={50}
									/>
								</div>
								<div className="flex gap-3 items-center">
									{/* flag */}
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
																	onClick={() =>
																		handleChangeLang(lang)
																	}>
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
										</div>
									</div>

									{/* nav */}
									<div className="h-full w-[35px] flex justify-center items-center">
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleToggleNavMobile();
											}}
											className="menu-mobile">
											<Icon
												type={
													isToggleNavMobile
														? "icon-close"
														: "hambuger-menu"
												}
											/>
										</button>

										{/* nav mobile */}
										<div
											ref={navMenuRef}
											className={`h-[100vh] bg-[#fff] shadow-md fixed overflow-hidden z-10  transition-all top-0 left-0 ${
												isToggleNavMobile ? "w-[250px]" : "w-[0px]"
											} sm:w-[300px]`}>
											<div className="p-2 text-[14px]">
												<div className="border border-[#ccc] mb-2 rounded-md">
													<NavLink
														to="/profile"
														className={({ isActive }) =>
															`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
																isToggleNavMobile && !renderContent
																	? isActive
																		? "bg-main"
																		: "hover:text-gray-500"
																	: isActive
																	? "bg-main"
																	: "hover:bg-main-hover"
															}`
														}>
														<Icon
															type="icon-user"
															width="25px"
															height="25px"
														/>

														{isToggleNavMobile && !renderContent && (
															<p>
																{userInfo?.username ||
																	userInfo?.email}
															</p>
														)}
													</NavLink>
												</div>

												{/* MENU ITEMS */}
												{MENU_ITEMS.map((item) => {
													return (
														<NavLink
															key={item.path}
															to={item.path}
															className={({ isActive }) =>
																`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
																	isToggleNavMobile &&
																	!renderContent
																		? isActive
																			? "bg-main"
																			: "hover:text-gray-500"
																		: isActive
																		? "bg-main"
																		: "hover:bg-main-hover"
																}`
															}>
															<Icon type={item.icon} />
															{isToggleNavMobile &&
																!renderContent && (
																	<p>{t(item.label)}</p>
																)}
														</NavLink>
													);
												})}

												{/* ADMNIN MENU */}
												{userInfo?.role === "admin" &&
													ADMIN_MENU_ITEMS.map((item) => {
														if (item.subMenu) {
															return (
																<div key={item.label}>
																	<div
																		className={`
																		min-h-[45px] px-3 rounded-md flex items-center justify-between w-full 
																		transition-all duration-200 hover:bg-main-hover 
																		}
																	`}
																		onClick={
																			toggleWholesaleMenu
																		}>
																		<div className="flex gap-2">
																			<Icon
																				type={item.icon}
																				width={
																					isToggleNavMobile &&
																					renderContent
																						? "20px"
																						: "25px"
																				}
																				height={
																					isToggleNavMobile &&
																					renderContent
																						? "20px"
																						: "25px"
																				}
																			/>

																			{isToggleNavMobile &&
																				!renderContent && (
																					<p>
																						{t(
																							item.label
																						)}
																					</p>
																				)}
																		</div>
																		<div>
																			<Icon
																				type={
																					isWholesaleOpen
																						? "arrow-down-light"
																						: "arrow-right"
																				}
																			/>
																		</div>
																	</div>

																	{isToggleNavMobile &&
																		isWholesaleOpen && (
																			<div className="pl-6 mt-1">
																				{item.subMenu.map(
																					(subItem) => (
																						<NavLink
																							key={
																								subItem.path
																							}
																							to={
																								subItem.path
																							}
																							className={({
																								isActive,
																							}) =>
																								`p-2 rounded-md flex items-center gap-2 transition-all duration-200 ${
																									isActive
																										? "bg-main"
																										: "hover:bg-main-hover"
																								}`
																							}>
																							<Icon
																								type={
																									subItem.icon
																								}
																							/>
																							<p>
																								{t(
																									subItem.label
																								)}
																							</p>
																						</NavLink>
																					)
																				)}
																			</div>
																		)}
																</div>
															);
														} else {
															return (
																<NavLink
																	key={item.path}
																	to={item.path}
																	className={({ isActive }) =>
																		`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
																			isToggleNavMobile &&
																			!renderContent
																				? isActive
																					? "bg-main"
																					: "hover:text-gray-500"
																				: isActive
																				? "bg-main"
																				: "hover:bg-main-hover"
																		}`
																	}>
																	<Icon type={item.icon} />

																	{isToggleNavMobile &&
																		!renderContent && (
																			<p>{t(item.label)}</p>
																		)}
																</NavLink>
															);
														}
													})}
												{/* USER MENU */}
												{userInfo?.role !== "admin" &&
													USER_MENU_ITEMS.map((_item) => (
														<NavLink
															key={_item.path}
															to={_item.path}
															className={({ isActive }) =>
																`p-3 rounded-md flex items-center gap-2 transition-all duration-200 ${
																	isToggleNavMobile &&
																	!renderContent
																		? isActive
																			? "bg-main"
																			: "hover:text-gray-500"
																		: isActive
																		? "bg-main"
																		: "hover:bg-main-hover"
																}`
															}>
															<Icon type={_item.icon} />

															{isToggleNavMobile &&
																!renderContent && (
																	<p>{t(_item.label)}</p>
																)}
														</NavLink>
													))}

												{NAV_MOBILE.map((item, index) => {
													return (
														<div
															key={index}
															className={`
																		min-h-[45px] px-3 rounded-md flex items-center justify-between w-full 
																		transition-all duration-200 hover:bg-main-hover 
																		}
																	`}
															onClick={() => onLogout()}>
															<div className="flex gap-2">
																<Icon
																	type={item.icon}
																	width={
																		isToggleNavMobile &&
																		renderContent
																			? "20px"
																			: "25px"
																	}
																	height={
																		isToggleNavMobile &&
																		renderContent
																			? "20px"
																			: "25px"
																	}
																/>

																{isToggleNavMobile &&
																	!renderContent && (
																		<p>{t(item.label)}</p>
																	)}
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* content */}
						<DashboardContext.Provider value={{ userInfo }}>
							<Outlet />
						</DashboardContext.Provider>
					</div>
				</div>
			)}
		</>
	);
}

export default Dashboard;
