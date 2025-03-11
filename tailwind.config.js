/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			colors: {
				mainBackgroundColor: "#0D1117",
				columnBackgroundColor: "#161C22",
			},
		},
	},
	plugins: [],
};

