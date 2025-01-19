import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRouteContext({ children, roles }) {
	const { role, authenticated, loading, userInfo } = useContext(AuthContext);

	if (!userInfo)
		return (
			<Navigate
				to="/login"
				replace={true}
			/>
		);

	if (loading) {
		return <div>Loading...</div>; // Trạng thái loading
	}

	// if (!authenticated) {
	// 	return <Navigate to="/login" />;
	// }

	// Hàm kiểm tra quyền truy cập
	const hasAccess = () => {
		if (role === "admin") return true; // Admin có toàn quyền
		return roles.includes(role);
	};

	if (!hasAccess()) {
		return <Navigate to="/unauthorized" />;
	}

	return children;
}

export default ProtectedRouteContext;
