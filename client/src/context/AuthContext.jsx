import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState(null);

	const role = "guest";
	const authenticated = true;

	const handleAccess = async () => {};

	return (
		<AuthContext.Provider value={{ role, authenticated, onAccess: handleAccess }}>
			{children}
		</AuthContext.Provider>
	);
};
