import { Navigate, Outlet } from "react-router";

const UnauthorizedRoutes = () => {
	const user = JSON.parse(localStorage.getItem("userInfo"));
	if (user)
		return (
			<Navigate
				to="/dashboard"
				replace={true}
			/>
		);

	return <Outlet />;
};

export default UnauthorizedRoutes;
