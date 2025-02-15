import { createContext, useState } from "react";
import UserApi from "../api/userApi";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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

		navigate(`/dashboard/orders`);
	};

	const handleLogout = async () => {
		await UserApi.logout();

		localStorage.removeItem("userInfo");
		setUserInfo(null);

		navigate("/login");
	};

	const handleRegister = async (registerData) => {
		try {
			await UserApi.register(registerData);

			const loginData = {
				email: registerData.email,
				password: registerData.password,
			};

			const loginResponse = await UserApi.login(loginData);

			delete loginResponse.accessToken;
			delete loginResponse.refreshToken;

			localStorage.setItem("userInfo", JSON.stringify(loginResponse));
			setUserInfo(loginResponse);

			toast.success("Đăng ký thành công, đang chuyển hướng...");

			navigate(`/dashboard/orders`);
		} catch (error) {
			toast.error("Có lỗi xảy ra trong quá trình đăng ký.");
		}
	};

	return (
		<AuthContext.Provider
			value={{
				onLogin: handleLogin,
				userInfo,
				onLogout: handleLogout,
				onRegister: handleRegister,
			}}>
			{children}
		</AuthContext.Provider>
	);
};
