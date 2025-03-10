export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
		"./node_modules/react-tailwindcss-select/dist/index.esm.js",
	],
	theme: {
		extend: {
			colors: {
				main: "#ffe9cf",
				["main-hover"]: "#f5e6cf",
			},
		},
	},
	plugins: [],
};
