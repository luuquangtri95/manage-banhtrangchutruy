import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../../assets/logo.jpg";
import Icon from "../../components/Icon/Icon";
import { AuthContext } from "../../context/AuthContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { useTranslation } from "react-i18next";

const MENU_ITEMS = [
	// { path: "/dashboard/orders/create", icon: "icon-create", label: "create_order" },
	{ path: "/dashboard/orders", icon: "icon-manager-order", label: "manage_orders" },
	{ path: "/dashboard/products", icon: "icon-products", label: "manage_products" },
	{ path: "/dashboard/categories", icon: "icon-category", label: "manage_categories" },
	{ path: "/dashboard/wholesale-price", icon: "icon-price", label: "wholesale_price" },
	{ path: "/dashboard/support", icon: "icon-support", label: "contact_support" },
];

const ADMIN_MENU_ITEMS = [
	{ path: "/dashboard/analytics", icon: "icon-analytic", label: "analytics" },
	{ path: "/dashboard/users", icon: "icon-user-group", label: "members" },
	{ path: "/dashboard/partners", icon: "icon-partner", label: "manage_partners" },
	{ path: "/dashboard/manage-permission", icon: "icon-permission", label: "grant_permission" },
];

function Dashboard() {
	const [isCollapse, setIsCollapse] = useState(false);
	const [renderContent, setRenderContent] = useState(true);
	const { onLogout } = useContext(AuthContext);
	const { t, i18n } = useTranslation();
	const [userInfo, setUserInfo] = useState(null);

	const handleCollapse = () => setIsCollapse(!isCollapse);
	const handleChangeLang = (lang) => i18n.changeLanguage(lang);

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

	return (
		<div className="h-[100vh] flex flex-col">
			{/* Top Bar */}
			<div className="top-bar h-[50px] bg-[#ffe9cf] p-2">
				<div className="flex justify-between items-center h-full">
					<img
						src={Logo}
						alt="Logo"
						className="rounded-full"
						width={50}
					/>
					<div className="flex gap-2 items-center">
						<div className="flex gap-2">
							<button onClick={() => handleChangeLang("en")}>🇬🇧</button>
							<button onClick={() => handleChangeLang("vi")}>🇻🇳</button>
						</div>
						<div className="avatar w-[35px] h-[35px] rounded-full bg-[#eee] flex justify-center items-center">
							<Icon type="icon-user" />
						</div>
					</div>
				</div>
			</div>

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
							className="mb-3">
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
									`p-3 rounded-md flex items-center gap-2 ${
										isActive ? "bg-[#ffe9cf]" : "hover:bg-[#f5e6cf]"
									}`
								}>
								<Icon type={item.icon} />
								{!isCollapse && <p>{t(item.label)}</p>}
							</NavLink>
						))}

						{/* ADMIN MENU */}
						{userInfo?.role === "admin" &&
							ADMIN_MENU_ITEMS.map((item) => (
								<NavLink
									end={item.path === "orders" ? true : false}
									key={item.path}
									to={item.path}
									className={({ isActive }) =>
										`p-3 rounded-md flex items-center gap-2 ${
											isActive ? "bg-[#ffe9cf]" : "hover:bg-[#f5e6cf]"
										}`
									}>
									<Icon type={item.icon} />
									{!isCollapse && <p>{t(item.label)}</p>}
								</NavLink>
							))}
					</div>

					{/* Logout Button */}
					<button
						className="p-3 flex items-center gap-2 mt-auto hover:bg-[#ffe9cf] transition-all rounded-md"
						onClick={onLogout}>
						<Icon type="icon-logout" />
						{t("logout")}
					</button>
				</div>

				{/* Content */}
				<div className="p-2 flex-1 bg-[#fafafa] relative">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
