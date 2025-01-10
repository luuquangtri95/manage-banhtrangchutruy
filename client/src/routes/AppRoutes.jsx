import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectedRouteContext from "../context/ProtectedRouteContext";
import AdminPage from "../pages/admin";
import LoginPage from "../pages/LoginPage";
import UserPage from "../pages/user";
import GuestPage from "../pages/guest";
import UnauthorizedPage from "../pages/UnauthorizedPage";

const AppRoutes = () => {
	return (
		<Router>
			<Routes>
				<Route
					path="/login"
					element={<LoginPage />}
				/>
				<Route
					path="/unauthorized"
					element={<UnauthorizedPage />}
				/>

				{/* protected routes */}
				<Route
					path="/admin"
					element={
						<ProtectedRouteContext roles={["admin"]}>
							<AdminPage />
						</ProtectedRouteContext>
					}
				/>

				<Route
					path="/user"
					element={
						<ProtectedRouteContext roles={["admin", "user"]}>
							<UserPage />
						</ProtectedRouteContext>
					}
				/>

				<Route
					path="/guest"
					element={
						<ProtectedRouteContext roles={["admin", "user", "guest"]}>
							<GuestPage />
						</ProtectedRouteContext>
					}
				/>

				<Route
					path="*"
					element={<Navigate to="/login" />}
				/>
			</Routes>
		</Router>
	);
};

export default AppRoutes;
