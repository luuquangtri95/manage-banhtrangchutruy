import { Navigate, Route, Routes } from "react-router-dom";
import AnalyticPage from "../pages/analytic";
import CategoryPage from "../pages/category/CategoryPage";
import Dashboard from "../pages/dashboard";
import LoginPage from "../pages/LoginPage";
import OrderList from "../pages/order/list";
import PartnerPage from "../pages/partner";
import PermissionPage from "../pages/permission";
import ProductsPage from "../pages/product";
import UsersPage from "../pages/users";
import WholesalePrice from "../pages/wholesale-price";
import ProtectedRoutes from "../routes/ProtectedRoutes";
import UnauthorizedRoutes from "../routes/UnauthorizedRoutes";
import ProfilePage from "../pages/profile";

const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<UnauthorizedRoutes />}>
				<Route
					path="/login"
					element={<LoginPage />}
				/>
			</Route>

			<Route element={<ProtectedRoutes />}>
				<Route
					path="/dashboard"
					element={<Dashboard />}>
					<Route
						path="profile"
						element={<ProfilePage />}
					/>
					<Route
						path="orders"
						element={<OrderList />}
					/>
					<Route
						path="products"
						element={<ProductsPage />}
					/>
					<Route
						path="categories"
						element={<CategoryPage />}
					/>
					<Route
						path="analytics"
						element={<AnalyticPage />}
					/>
					<Route
						path="wholesale-price"
						element={<WholesalePrice />}
					/>
					<Route
						path="manage-permission"
						element={<PermissionPage />}
					/>
					<Route
						path="partners"
						element={<PartnerPage />}
					/>
					<Route
						path="users"
						element={<UsersPage />}
					/>
				</Route>
			</Route>

			{/* Fallback */}
			<Route
				path="/*"
				element={
					<Navigate
						to="/login"
						replace={true}
					/>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
