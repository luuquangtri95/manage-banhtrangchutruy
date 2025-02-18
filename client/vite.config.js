import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			react(),

			Inspect(), // Phân tích build
		],

		define: {},

		envDir: "../",

		build: {
			target: "esnext", // Hạn chế polyfills không cần thiết
			minify: "esbuild", // Dùng esbuild thay vì terser (nhanh hơn)
			sourcemap: false, // Tắt sourcemap để giảm thời gian build
			manifest: true, // Hỗ trợ code-splitting tốt hơn
			assetsInlineLimit: 4096, // Tăng giới hạn inline assets
			chunkSizeWarningLimit: 1000, // Giới hạn cảnh báo chunk
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes("node_modules")) {
							return "vendor"; // Gộp tất cả thư viện bên thứ ba vào vendor.js
						}
					},
				},
			},
		},

		server: {
			host: true, // Cần thiết để Vite hoạt động trong Docker
			watch: {
				usePolling: true, // Cần thiết cho hot reload trong Docker
			},
			strictPort: true, // Tránh lỗi khi cổng bị chiếm dụng
			hmr: {
				overlay: false, // Giảm lỗi màn hình đen khi hot reload
			},
		},

		cacheDir: "./.vite_cache", // Dùng cache để tránh build lại không cần thiết
	};
});
