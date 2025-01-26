import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import "./i18n";

createRoot(document.getElementById("root")).render(
	<Router>
		<AuthProvider>
			<AppRoutes />
			<ToastContainer
				position="bottom-right"
				theme="dark"
				autoClose={700}
			/>
		</AuthProvider>
	</Router>
);
