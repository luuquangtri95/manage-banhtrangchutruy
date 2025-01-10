import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRouteContext({ children, roles }) {
	const { role, authenticated } = useContext(AuthContext);

	if (!authenticated) {
		return <Navigate to="/login" />;
	}

	if (!roles.includes(role)) {
		return <Navigate to="/unauthorized" />;
	}

	return children;
}

export default ProtectedRouteContext;
