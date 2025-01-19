import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
	const user = JSON.parse(localStorage.getItem("userInfo"));

	if (!user) {
		return (
			<Navigate
				to="/login"
				replace={true}
			/>
		);
	}

	return <Outlet />;
};

export default ProtectedRoutes;
