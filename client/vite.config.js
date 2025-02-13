import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	// Đường dẫn thư mục gốc (root)
	// const rootPath = path.resolve(__dirname, ".."); // Đi lên 1 cấp để tới thư mục gốc
	// const env = loadEnv(mode, rootPath); // Load các biến môi trường từ root

	return {
		plugins: [react()],
		define: {
			// "process.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
		},
		envDir: "../",
		server: {
			host: true, // Cần thiết để Vite hoạt động trong Docker
			// port: parseInt(env.VITE_PORT) || 5173,
			watch: {
				usePolling: true, // Cần thiết cho hot reload trong Docker
			},
		},
	};
});
