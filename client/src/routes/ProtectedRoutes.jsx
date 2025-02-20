import { Navigate, Outlet, useLocation } from "react-router";

const ProtectedRoutes = () => {
	const user = JSON.parse(localStorage.getItem("userInfo"));
	const location = useLocation();

	if (!user) {
		return (
			<Navigate
				to="/login"
				replace={true}
			/>
		);
	}

	if (location.pathname === "/dashboard") {
		return (
			<Navigate
				to="/dashboard/orders"
				replace
			/>
		);
	}

	return <Outlet />;
};

export default ProtectedRoutes;
