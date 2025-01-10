import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<AuthProvider>
			<AppRoutes />
			<ToastContainer />
		</AuthProvider>
	</StrictMode>
);
