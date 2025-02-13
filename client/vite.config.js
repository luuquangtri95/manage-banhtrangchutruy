import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	return {
		plugins: [react()],
		define: {},
		envDir: "../",
		server: {
			host: true, // Cần thiết để Vite hoạt động trong Docker
			watch: {
				usePolling: true, // Cần thiết cho hot reload trong Docker
			},
		},
	};
});
