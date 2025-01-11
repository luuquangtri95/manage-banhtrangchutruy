import { createContext, useState } from "react";
import UserApi from "../api/userApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null);

	const role = "admin";
	const authenticated = false;

	const handleLogin = async (data) => {
		const res = await UserApi.login(data);

		console.log("res", res);
	};

	return (
		<AuthContext.Provider value={{ role, authenticated, onLogin: handleLogin }}>
			{children}
		</AuthContext.Provider>
	);
};
