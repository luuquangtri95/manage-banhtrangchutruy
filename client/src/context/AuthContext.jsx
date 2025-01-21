import { createContext, useState } from "react";
import UserApi from "../api/userApi";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null);
	const navigate = useNavigate();

	const handleLogin = async (data) => {
		const userInfo = await UserApi.login(data);

		delete userInfo.accessToken;
		delete userInfo.refreshToken;

		localStorage.setItem("userInfo", JSON.stringify(userInfo));
		setUserInfo(userInfo);

		// redirect page dashboard

		navigate(`/dashboard/orders/create`);
	};

	const handleLogout = async () => {
		await UserApi.logout();

		localStorage.removeItem("userInfo");
		setUserInfo(null);

		navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ onLogin: handleLogin, userInfo, onLogout: handleLogout }}>
			{children}
		</AuthContext.Provider>
	);
};
