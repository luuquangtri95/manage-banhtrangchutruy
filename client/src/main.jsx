import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";
import { BrowserRouter as Router } from "react-router";

createRoot(document.getElementById("root")).render(
	<Router>
		<AuthProvider>
			<AppRoutes />
			<ToastContainer />
		</AuthProvider>
	</Router>
);
