import { createContext, useState } from "react";
import UserApi from "../api/userApi";
import { useNavigate } from "react-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null);
	const navigate = useNavigate();

	const handleLogin = async (data) => {
		const res = await UserApi.login(data);

		localStorage.setItem("userInfo", JSON.stringify(res.data));
		setUserInfo(res.data);

		// redirect page dashboard

		navigate(`/dashboard`);
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
